// browser-extension/content.js

/**
 * ThinkBeforePost Browser Extension - Content Script
 * Injects safety analysis buttons into social media platforms
 */

(function() {
  'use strict';

  // Configuration for different platforms
  const PLATFORM_CONFIGS = {
    facebook: {
      name: 'Facebook',
      postSelector: '[role="textbox"][contenteditable="true"]',
      submitButtonSelector: '[type="submit"]',
      buttonContainer: '[role="button"][tabindex="0"]',
      getContent: (element) => element.innerText || element.textContent,
    },
    twitter: {
      name: 'Twitter',
      postSelector: '[data-testid="tweetTextarea_0"]',
      submitButtonSelector: '[data-testid="tweetButtonInline"]',
      buttonContainer: '[data-testid="toolBar"]',
      getContent: (element) => element.innerText || element.textContent,
    },
    linkedin: {
      name: 'LinkedIn',
      postSelector: '.ql-editor',
      submitButtonSelector: '.share-actions__primary-action',
      buttonContainer: '.share-creation-state__actions',
      getContent: (element) => element.innerText || element.textContent,
    },
    instagram: {
      name: 'Instagram',
      postSelector: 'textarea[aria-label*="caption"]',
      submitButtonSelector: 'button[type="submit"]',
      buttonContainer: 'div[role="dialog"]',
      getContent: (element) => element.value,
    },
    reddit: {
      name: 'Reddit',
      postSelector: '[name="text"]',
      submitButtonSelector: 'button[type="submit"]',
      buttonContainer: '.Post',
      getContent: (element) => element.value || element.innerText,
    }
  };

  // Detect current platform
  function detectPlatform() {
    const hostname = window.location.hostname;
    if (hostname.includes('facebook.com')) return 'facebook';
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('linkedin.com')) return 'linkedin';
    if (hostname.includes('instagram.com')) return 'instagram';
    if (hostname.includes('reddit.com')) return 'reddit';
    return null;
  }

  const currentPlatform = detectPlatform();
  if (!currentPlatform) return;

  const config = PLATFORM_CONFIGS[currentPlatform];

  // Create the analysis button
  function createAnalyzeButton() {
    const button = document.createElement('button');
    button.className = 'tbp-analyze-button';
    button.innerHTML = `
      <svg class="tbp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
      </svg>
      <span>Check Safety</span>
    `;
    button.title = 'Analyze with ThinkBeforePost';
    
    button.addEventListener('click', handleAnalyzeClick);
    
    return button;
  }

  // Handle analyze button click
  async function handleAnalyzeClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const contentElement = document.querySelector(config.postSelector);
    if (!contentElement) {
      showNotification('No content to analyze', 'warning');
      return;
    }
    
    const content = config.getContent(contentElement);
    if (!content || content.trim().length === 0) {
      showNotification('Please write something first', 'warning');
      return;
    }
    
    // Show loading state
    const button = event.currentTarget;
    button.classList.add('tbp-loading');
    button.innerHTML = `
      <svg class="tbp-icon tbp-spinner" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.4 31.4" />
      </svg>
      <span>Analyzing...</span>
    `;
    
    try {
      // Send message to background script
      const response = await chrome.runtime.sendMessage({
        action: 'analyze',
        data: {
          content: content,
          platform: currentPlatform
        }
      });
      
      if (response.success) {
        showAnalysisResult(response.data);
      } else {
        showNotification('Analysis failed: ' + response.error, 'error');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      showNotification('Failed to analyze content', 'error');
    } finally {
      // Reset button state
      button.classList.remove('tbp-loading');
      button.innerHTML = `
        <svg class="tbp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
        <span>Check Safety</span>
      `;
    }
  }

  // Show analysis result in modal
  function showAnalysisResult(analysis) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.tbp-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'tbp-modal';
    
    const riskClass = getRiskClass(analysis.overallRisk);
    const riskLabel = getRiskLabel(analysis.overallRisk);
    const riskIcon = getRiskIcon(analysis.overallRisk);
    
    modal.innerHTML = `
      <div class="tbp-modal-overlay"></div>
      <div class="tbp-modal-content">
        <div class="tbp-modal-header">
          <h3>Content Analysis Result</h3>
          <button class="tbp-modal-close">&times;</button>
        </div>
        
        <div class="tbp-modal-body">
          <div class="tbp-risk-summary ${riskClass}">
            ${riskIcon}
            <div class="tbp-risk-info">
              <div class="tbp-risk-label">${riskLabel}</div>
              <div class="tbp-risk-score">Risk Score: ${analysis.riskScore}/100</div>
            </div>
          </div>
          
          <div class="tbp-recommendation">
            <strong>Recommendation:</strong> ${getRecommendationText(analysis.recommendation)}
          </div>
          
          <div class="tbp-categories">
            <h4>Risk Categories:</h4>
            <ul>
              ${Object.entries(analysis.categories).map(([key, category]) => `
                <li class="tbp-category-item">
                  <span class="tbp-category-name">${formatCategoryName(key)}</span>
                  <span class="tbp-category-level tbp-level-${category.level}">${category.score}%</span>
                </li>
              `).join('')}
            </ul>
          </div>
          
          ${analysis.suggestions && analysis.suggestions.length > 0 ? `
            <div class="tbp-suggestions">
              <h4>Suggestions:</h4>
              <ul>
                ${analysis.suggestions.map(suggestion => `
                  <li>${suggestion}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${analysis.improvedVersion ? `
            <div class="tbp-improved">
              <h4>Safer Alternative:</h4>
              <div class="tbp-improved-content">${analysis.improvedVersion}</div>
              <button class="tbp-copy-button" data-text="${analysis.improvedVersion}">
                Copy Alternative
              </button>
            </div>
          ` : ''}
        </div>
        
        <div class="tbp-modal-footer">
          <button class="tbp-button tbp-button-secondary tbp-close-button">Close</button>
          ${analysis.recommendation === 'safe' ? 
            '<button class="tbp-button tbp-button-primary">Post Anyway</button>' : 
            '<button class="tbp-button tbp-button-warning">Revise Content</button>'
          }
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.tbp-modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.tbp-modal-overlay').addEventListener('click', () => modal.remove());
    modal.querySelector('.tbp-close-button').addEventListener('click', () => modal.remove());
    
    // Copy button functionality
    const copyButton = modal.querySelector('.tbp-copy-button');
    if (copyButton) {
      copyButton.addEventListener('click', (e) => {
        const text = e.target.dataset.text;
        navigator.clipboard.writeText(text).then(() => {
          e.target.textContent = 'Copied!';
          setTimeout(() => {
            e.target.textContent = 'Copy Alternative';
          }, 2000);
        });
      });
    }
  }

  // Helper functions
  function getRiskClass(level) {
    const classes = {
      none: 'tbp-risk-none',
      low: 'tbp-risk-low',
      medium: 'tbp-risk-medium',
      high: 'tbp-risk-high'
    };
    return classes[level] || 'tbp-risk-none';
  }

  function getRiskLabel(level) {
    const labels = {
      none: 'No Risk Detected',
      low: 'Low Risk',
      medium: 'Medium Risk',
      high: 'High Risk'
    };
    return labels[level] || 'Unknown Risk';
  }

  function getRiskIcon(level) {
    const icons = {
      none: '✓',
      low: '!',
      medium: '⚠',
      high: '⚠'
    };
    return `<span class="tbp-risk-icon">${icons[level] || '?'}</span>`;
  }

  function getRecommendationText(recommendation) {
    const texts = {
      safe: 'This content appears safe to post.',
      revise: 'Consider revising this content before posting.',
      danger: 'We strongly recommend not posting this content.'
    };
    return texts[recommendation] || 'Please review the analysis carefully.';
  }

  function formatCategoryName(key) {
    const names = {
      hateSpeech: 'Hate Speech',
      careerRisk: 'Career Risk',
      legalIssues: 'Legal Issues',
      reputationDamage: 'Reputation',
      personalSafety: 'Personal Safety',
      misinformation: 'Misinformation'
    };
    return names[key] || key;
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `tbp-notification tbp-notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('tbp-notification-show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('tbp-notification-show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Initialize extension
  function initialize() {
    // Wait for page to load completely
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', inject);
    } else {
      inject();
    }
  }

  // Inject the analyze button
  function inject() {
    // Use MutationObserver to detect when post areas appear
    const observer = new MutationObserver((mutations) => {
      const postArea = document.querySelector(config.postSelector);
      if (postArea && !document.querySelector('.tbp-analyze-button')) {
        injectButton();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Initial injection attempt
    injectButton();
  }

  function injectButton() {
    const postArea = document.querySelector(config.postSelector);
    if (!postArea) return;
    
    // Check if button already exists
    if (document.querySelector('.tbp-analyze-button')) return;
    
    const button = createAnalyzeButton();
    
    // Find the best place to insert the button
    const submitButton = document.querySelector(config.submitButtonSelector);
    if (submitButton && submitButton.parentElement) {
      submitButton.parentElement.insertBefore(button, submitButton);
    } else {
      // Fallback: append to post area parent
      if (postArea.parentElement) {
        postArea.parentElement.appendChild(button);
      }
    }
  }

  // Start the extension
  initialize();

})();