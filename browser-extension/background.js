// browser-extension/background.js

/**
 * ThinkBeforePost Browser Extension - Background Service Worker
 * Handles API communication and extension logic
 */

// API Configuration
const API_BASE_URL = 'https://thinkbeforepost.ai/api/v1';
const AUTH_URL = 'https://thinkbeforepost.ai/auth';

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SETTINGS: 'settings',
  USAGE_COUNT: 'usage_count',
  LAST_RESET: 'last_reset'
};

// Initialize extension on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      [STORAGE_KEYS.SETTINGS]: {
        enabled: true,
        autoCheck: false,
        notifications: true,
        riskThreshold: 'medium'
      }
    });
    
    // Open onboarding page
    chrome.tabs.create({
      url: 'https://thinkbeforepost.ai/extension/welcome'
    });
  } else if (details.reason === 'update') {
    // Handle updates
    console.log('Extension updated to version:', chrome.runtime.getManifest().version);
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyze') {
    handleAnalyze(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'getAuthStatus') {
    getAuthStatus()
      .then(status => sendResponse({ success: true, data: status }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'login') {
    initiateLogin()
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'logout') {
    logout()
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'getUsageStats') {
    getUsageStats()
      .then(stats => sendResponse({ success: true, data: stats }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// Analyze content via API
async function handleAnalyze(data) {
  // Check authentication
  const authToken = await getStoredAuthToken();
  if (!authToken) {
    throw new Error('Please login to use ThinkBeforePost');
  }
  
  // Check usage limits
  const canAnalyze = await checkUsageLimit();
  if (!canAnalyze) {
    throw new Error('Daily limit reached. Please upgrade your plan.');
  }
  
  // Make API request
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'X-Extension-Version': chrome.runtime.getManifest().version
    },
    body: JSON.stringify({
      content: data.content,
      platform: data.platform,
      contentType: data.contentType || 'post'
    })
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Clear auth token if unauthorized
      await chrome.storage.sync.remove(STORAGE_KEYS.AUTH_TOKEN);
      throw new Error('Session expired. Please login again.');
    }
    
    const error = await response.json();
    throw new Error(error.message || 'Analysis failed');
  }
  
  const result = await response.json();
  
  // Update usage count
  await incrementUsageCount();
  
  // Show notification based on risk level
  if (await getNotificationSetting()) {
    showRiskNotification(result.data);
  }
  
  return result.data;
}

// Authentication functions
async function getAuthStatus() {
  const token = await getStoredAuthToken();
  if (!token) return { authenticated: false };
  
  // Verify token with API
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      await chrome.storage.sync.set({ [STORAGE_KEYS.USER_DATA]: userData });
      return { authenticated: true, user: userData };
    } else {
      await chrome.storage.sync.remove(STORAGE_KEYS.AUTH_TOKEN);
      return { authenticated: false };
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return { authenticated: false };
  }
}

async function initiateLogin() {
  // Open auth page in new tab
  const authTab = await chrome.tabs.create({
    url: `${AUTH_URL}/extension`
  });
  
  // Listen for auth completion
  return new Promise((resolve, reject) => {
    const listener = (tabId, changeInfo) => {
      if (tabId === authTab.id && changeInfo.url) {
        const url = new URL(changeInfo.url);
        
        if (url.hostname === 'thinkbeforepost.ai' && url.pathname === '/extension/success') {
          const token = url.searchParams.get('token');
          if (token) {
            chrome.storage.sync.set({ [STORAGE_KEYS.AUTH_TOKEN]: token }, () => {
              chrome.tabs.remove(tabId);
              chrome.tabs.onUpdated.removeListener(listener);
              resolve();
            });
          }
        } else if (url.pathname === '/extension/error') {
          chrome.tabs.remove(tabId);
          chrome.tabs.onUpdated.removeListener(listener);
          reject(new Error('Authentication failed'));
        }
      }
    };
    
    chrome.tabs.onUpdated.addListener(listener);
    
    // Timeout after 5 minutes
    setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      reject(new Error('Authentication timeout'));
    }, 5 * 60 * 1000);
  });
}

async function logout() {
  await chrome.storage.sync.remove([
    STORAGE_KEYS.AUTH_TOKEN,
    STORAGE_KEYS.USER_DATA,
    STORAGE_KEYS.USAGE_COUNT
  ]);
}

// Usage tracking
async function checkUsageLimit() {
  const userData = await getStoredUserData();
  const usageCount = await getUsageCount();
  
  // Check if we need to reset daily count
  const lastReset = await getLastReset();
  const today = new Date().toDateString();
  
  if (lastReset !== today) {
    await chrome.storage.sync.set({
      [STORAGE_KEYS.USAGE_COUNT]: 0,
      [STORAGE_KEYS.LAST_RESET]: today
    });
    return true;
  }
  
  // Check limits based on plan
  const limits = {
    free: 10,
    pro: 9999,
    premium: 9999,
    enterprise: 9999
  };
  
  const userPlan = userData?.subscription?.tier || 'free';
  const limit = limits[userPlan];
  
  return usageCount < limit;
}

async function incrementUsageCount() {
  const current = await getUsageCount();
  await chrome.storage.sync.set({
    [STORAGE_KEYS.USAGE_COUNT]: current + 1
  });
}

async function getUsageStats() {
  const usageCount = await getUsageCount();
  const userData = await getStoredUserData();
  const userPlan = userData?.subscription?.tier || 'free';
  
  const limits = {
    free: 10,
    pro: 'unlimited',
    premium: 'unlimited',
    enterprise: 'unlimited'
  };
  
  return {
    used: usageCount,
    limit: limits[userPlan],
    plan: userPlan
  };
}

// Storage helpers
async function getStoredAuthToken() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(STORAGE_KEYS.AUTH_TOKEN, (result) => {
      resolve(result[STORAGE_KEYS.AUTH_TOKEN] || null);
    });
  });
}

async function getStoredUserData() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(STORAGE_KEYS.USER_DATA, (result) => {
      resolve(result[STORAGE_KEYS.USER_DATA] || null);
    });
  });
}

async function getUsageCount() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(STORAGE_KEYS.USAGE_COUNT, (result) => {
      resolve(result[STORAGE_KEYS.USAGE_COUNT] || 0);
    });
  });
}

async function getLastReset() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(STORAGE_KEYS.LAST_RESET, (result) => {
      resolve(result[STORAGE_KEYS.LAST_RESET] || null);
    });
  });
}

async function getNotificationSetting() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(STORAGE_KEYS.SETTINGS, (result) => {
      const settings = result[STORAGE_KEYS.SETTINGS] || {};
      resolve(settings.notifications !== false);
    });
  });
}

// Notifications
function showRiskNotification(analysis) {
  const riskMessages = {
    high: {
      title: '⚠️ High Risk Content Detected',
      message: 'This post could have serious consequences. Please review carefully.',
      icon: 'icons/warning-red.png'
    },
    medium: {
      title: '⚠ Medium Risk Content',
      message: 'Some concerns were found. Consider revising before posting.',
      icon: 'icons/warning-yellow.png'
    },
    low: {
      title: 'ℹ️ Low Risk Content',
      message: 'Minor suggestions available for your content.',
      icon: 'icons/info-blue.png'
    },
    none: {
      title: '✓ Content is Safe',
      message: 'No risks detected. Safe to post!',
      icon: 'icons/check-green.png'
    }
  };
  
  const notification = riskMessages[analysis.overallRisk] || riskMessages.none;
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: notification.icon,
    title: notification.title,
    message: notification.message,
    priority: analysis.overallRisk === 'high' ? 2 : 1
  });
}

// Context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'analyze-selected',
    title: 'Analyze with ThinkBeforePost',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'analyze-selected' && info.selectionText) {
    // Send selected text to content script for analysis
    chrome.tabs.sendMessage(tab.id, {
      action: 'analyzeSelection',
      text: info.selectionText
    });
  }
});

// Keep service worker alive
chrome.alarms.create('keepAlive', { periodInMinutes: 4.9 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log('Keeping service worker alive');
  }
});