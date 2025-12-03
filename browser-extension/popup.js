// browser-extension/popup.js

document.addEventListener('DOMContentLoaded', async () => {
  const contentDiv = document.getElementById('content');
  
  // Check authentication status
  const authStatus = await checkAuthStatus();
  
  if (authStatus.authenticated) {
    showAuthenticatedView(authStatus.user);
  } else {
    showLoginView();
  }
});

async function checkAuthStatus() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getAuthStatus' }, (response) => {
      if (response && response.success) {
        resolve(response.data);
      } else {
        resolve({ authenticated: false });
      }
    });
  });
}

function showLoginView() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="auth-section">
      <div class="auth-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <h2 class="auth-title">Welcome to ThinkBeforePost</h2>
      <p class="auth-desc">Sign in to start protecting your reputation on social media</p>
      <button class="btn-primary" id="loginBtn">Sign In</button>
      <button class="btn-secondary" id="learnMoreBtn">Learn More</button>
    </div>
  `;
  
  document.getElementById('loginBtn').addEventListener('click', handleLogin);
  document.getElementById('learnMoreBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://thinkbeforepost.ai' });
  });
}

async function showAuthenticatedView(user) {
  // Get usage statistics
  const usageStats = await getUsageStats();
  
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="user-section">
      <div class="user-card">
        <div class="user-avatar">${getInitials(user.name || user.email)}</div>
        <div class="user-info">
          <div class="user-name">${user.name || 'User'}</div>
          <div class="user-plan">${formatPlan(user.subscription?.tier || 'free')} Plan</div>
        </div>
      </div>
    </div>
    
    <div class="usage-section">
      <div class="usage-header">
        <span>Daily Usage</span>
        <span>${usageStats.used}/${usageStats.limit === 'unlimited' ? '∞' : usageStats.limit}</span>
      </div>
      <div class="usage-bar">
        <div class="usage-fill" style="width: ${getUsagePercentage(usageStats)}%"></div>
      </div>
    </div>
    
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${user.totalAnalyses || 0}</div>
          <div class="stat-label">Total Analyses</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${user.riskScore || 95}</div>
          <div class="stat-label">Safety Score</div>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <div class="settings-toggle">
        <span class="settings-label">Auto-check posts</span>
        <div class="toggle ${user.settings?.autoCheck ? 'active' : ''}" id="autoCheckToggle">
          <div class="toggle-thumb"></div>
        </div>
      </div>
      <div class="settings-toggle">
        <span class="settings-label">Notifications</span>
        <div class="toggle ${user.settings?.notifications !== false ? 'active' : ''}" id="notificationsToggle">
          <div class="toggle-thumb"></div>
        </div>
      </div>
    </div>
    
    <div class="actions-section">
      <a href="https://thinkbeforepost.ai/dashboard" target="_blank" class="action-btn">
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        Dashboard
      </a>
      <a href="https://thinkbeforepost.ai/history" target="_blank" class="action-btn">
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
        History
      </a>
      <a href="https://thinkbeforepost.ai/billing" target="_blank" class="action-btn">
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
        Billing
      </a>
      <button class="action-btn" id="logoutBtn">
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Sign Out
      </button>
    </div>
    
    ${usageStats.plan === 'free' ? `
      <button class="btn-primary" id="upgradeBtn" style="margin-top: 16px;">
        Upgrade for Unlimited Analyses
      </button>
    ` : ''}
  `;
  
  // Add event listeners
  document.getElementById('autoCheckToggle')?.addEventListener('click', handleToggle);
  document.getElementById('notificationsToggle')?.addEventListener('click', handleToggle);
  document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
  document.getElementById('upgradeBtn')?.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://thinkbeforepost.ai/pricing' });
  });
}

async function handleLogin() {
  const loginBtn = document.getElementById('loginBtn');
  loginBtn.textContent = 'Signing in...';
  loginBtn.disabled = true;
  
  chrome.runtime.sendMessage({ action: 'login' }, (response) => {
    if (response && response.success) {
      // Reload to show authenticated view
      location.reload();
    } else {
      loginBtn.textContent = 'Sign In';
      loginBtn.disabled = false;
      alert('Login failed. Please try again.');
    }
  });
}

async function handleLogout() {
  if (confirm('Are you sure you want to sign out?')) {
    chrome.runtime.sendMessage({ action: 'logout' }, () => {
      location.reload();
    });
  }
}

function handleToggle(event) {
  const toggle = event.currentTarget;
  toggle.classList.toggle('active');
  
  const settingName = toggle.id.replace('Toggle', '');
  const isActive = toggle.classList.contains('active');
  
  // Save setting
  chrome.storage.sync.get('settings', (result) => {
    const settings = result.settings || {};
    settings[settingName] = isActive;
    chrome.storage.sync.set({ settings });
  });
}

async function getUsageStats() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getUsageStats' }, (response) => {
      if (response && response.success) {
        resolve(response.data);
      } else {
        resolve({ used: 0, limit: 10, plan: 'free' });
      }
    });
  });
}

function getInitials(name) {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return parts[0][0] + parts[parts.length - 1][0];
  }
  return name.substring(0, 2).toUpperCase();
}

function formatPlan(tier) {
  const plans = {
    free: 'Free',
    pro: 'Pro',
    premium: 'Premium',
    enterprise: 'Enterprise'
  };
  return plans[tier] || 'Free';
}

function getUsagePercentage(stats) {
  if (stats.limit === 'unlimited') return 0;
  const percentage = (stats.used / stats.limit) * 100;
  return Math.min(percentage, 100);
}