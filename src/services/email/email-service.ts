// src/services/email/email-service.ts
import { Resend } from 'resend';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private from: string;

  constructor() {
    this.from = process.env.EMAIL_FROM || 'noreply@thinkbeforepost.ai';
  }

  async sendEmail(to: string, template: EmailTemplate) {
    try {
      const { data, error } = await resend.emails.send({
        from: this.from,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        console.error('Email send error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  // Welcome email for new users
  async sendWelcomeEmail(user: {
    email: string;
    name?: string;
  }) {
    const template = this.getWelcomeTemplate(user.name || 'there');
    return this.sendEmail(user.email, template);
  }

  // Analysis warning email
  async sendHighRiskAlert(user: {
    email: string;
    name?: string;
  }, analysis: {
    content: string;
    riskLevel: string;
    platform: string;
  }) {
    const template = this.getHighRiskTemplate(user.name || 'there', analysis);
    return this.sendEmail(user.email, template);
  }

  // Usage limit warning
  async sendUsageLimitWarning(user: {
    email: string;
    name?: string;
    usagePercent: number;
  }) {
    const template = this.getUsageLimitTemplate(user.name || 'there', user.usagePercent);
    return this.sendEmail(user.email, template);
  }

  // Subscription confirmation
  async sendSubscriptionConfirmation(user: {
    email: string;
    name?: string;
    plan: string;
  }) {
    const template = this.getSubscriptionTemplate(user.name || 'there', user.plan);
    return this.sendEmail(user.email, template);
  }

  // Password reset email
  async sendPasswordResetEmail(email: string, resetLink: string) {
    const template = this.getPasswordResetTemplate(resetLink);
    return this.sendEmail(email, template);
  }

  // Email templates
  private getWelcomeTemplate(name: string): EmailTemplate {
    return {
      subject: 'Welcome to ThinkBeforePost! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f7f7f7; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
              .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to ThinkBeforePost!</h1>
                <p>Your journey to safer social media starts here</p>
              </div>
              <div class="content">
                <h2>Hey ${name}! 👋</h2>
                <p>
                  Thank you for joining ThinkBeforePost! We're excited to help you protect your 
                  digital reputation and career with our AI-powered content analysis.
                </p>
                
                <h3>What you can do now:</h3>
                <div class="feature">
                  <strong>✅ Analyze your first post</strong>
                  <p>Start by analyzing any content before you post it on social media.</p>
                </div>
                <div class="feature">
                  <strong>📊 Check your risk profile</strong>
                  <p>See how your posting habits improve over time with our risk tracking.</p>
                </div>
                <div class="feature">
                  <strong>🔧 Install our browser extension</strong>
                  <p>Get real-time warnings directly on social media platforms.</p>
                </div>
                
                <center>
                  <a href="https://thinkbeforepost.ai/dashboard" class="button">
                    Go to Dashboard
                  </a>
                </center>
                
                <p>
                  <strong>Quick tip:</strong> Start with analyzing your most recent draft. 
                  Our AI will help you identify potential risks and suggest improvements!
                </p>
              </div>
              <div class="footer">
                <p>© 2025 ThinkBeforePost. All rights reserved.</p>
                <p>
                  <a href="https://thinkbeforepost.ai/legal/privacy">Privacy</a> | 
                  <a href="https://thinkbeforepost.ai/legal/terms">Terms</a> | 
                  <a href="https://thinkbeforepost.ai/support">Support</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Welcome to ThinkBeforePost, ${name}!

Thank you for joining us. We're excited to help you protect your digital reputation.

What you can do now:
- Analyze your first post
- Check your risk profile
- Install our browser extension

Get started: https://thinkbeforepost.ai/dashboard

Best regards,
The ThinkBeforePost Team
      `,
    };
  }

  private getHighRiskTemplate(name: string, analysis: any): EmailTemplate {
    return {
      subject: '⚠️ High Risk Content Detected - ThinkBeforePost',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .alert-header { background: #ef4444; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
              .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
              .risk-badge { display: inline-block; padding: 5px 15px; background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; border-radius: 20px; font-weight: bold; }
              .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="alert-header">
                <h2>⚠️ High Risk Content Alert</h2>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>
                  We've detected that your recent content analysis showed 
                  <span class="risk-badge">HIGH RISK</span> indicators.
                </p>
                
                <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
                  <strong>Platform:</strong> ${analysis.platform}<br>
                  <strong>Risk Level:</strong> ${analysis.riskLevel}<br>
                  <strong>Content Preview:</strong> "${analysis.content.substring(0, 50)}..."
                </div>
                
                <p>
                  <strong>We strongly recommend:</strong>
                  <ul>
                    <li>Review the detailed analysis in your dashboard</li>
                    <li>Consider our suggested improvements</li>
                    <li>Avoid posting this content in its current form</li>
                  </ul>
                </p>
                
                <center>
                  <a href="https://thinkbeforepost.ai/dashboard" class="button">
                    View Full Analysis
                  </a>
                </center>
                
                <p style="color: #666; font-size: 14px;">
                  Remember: One bad post can have lasting consequences on your career and reputation. 
                  We're here to help you stay safe online.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
  }

  private getUsageLimitTemplate(name: string, usagePercent: number): EmailTemplate {
    return {
      subject: `📊 You've used ${usagePercent}% of your monthly analyses`,
      html: `
        <!DOCTYPE html>
        <html>
          <body>
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Usage Alert</h2>
              <p>Hi ${name},</p>
              <p>You've used <strong>${usagePercent}%</strong> of your monthly analysis limit.</p>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <div style="background: #e5e7eb; height: 20px; border-radius: 10px;">
                  <div style="background: #3b82f6; height: 20px; border-radius: 10px; width: ${usagePercent}%;"></div>
                </div>
                <p style="text-align: center; margin-top: 10px;">${usagePercent}% used</p>
              </div>
              
              <p>Consider upgrading to Pro for unlimited analyses:</p>
              <a href="https://thinkbeforepost.ai/pricing" style="display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">
                Upgrade Now
              </a>
            </div>
          </body>
        </html>
      `,
    };
  }

  private getSubscriptionTemplate(name: string, plan: string): EmailTemplate {
    return {
      subject: `✅ Welcome to ThinkBeforePost ${plan}!`,
      html: `
        <!DOCTYPE html>
        <html>
          <body>
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1>Subscription Confirmed! 🎉</h1>
              <p>Hi ${name},</p>
              <p>Your <strong>${plan}</strong> subscription is now active!</p>
              
              <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>What's included in ${plan}:</h3>
                <ul>
                  <li>Unlimited content analyses</li>
                  <li>Browser extension access</li>
                  <li>Advanced risk insights</li>
                  <li>Priority support</li>
                  ${plan === 'Premium' ? '<li>Team collaboration features</li><li>API access</li>' : ''}
                </ul>
              </div>
              
              <a href="https://thinkbeforepost.ai/dashboard" style="display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px;">
                Start Using ${plan} Features
              </a>
              
              <p style="margin-top: 30px; color: #666;">
                Need help? Reply to this email or visit our <a href="https://thinkbeforepost.ai/support">support center</a>.
              </p>
            </div>
          </body>
        </html>
      `,
    };
  }

  private getPasswordResetTemplate(resetLink: string): EmailTemplate {
    return {
      subject: '🔐 Reset Your ThinkBeforePost Password',
      html: `
        <!DOCTYPE html>
        <html>
          <body>
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Password Reset Request</h2>
              <p>
                We received a request to reset your password. Click the button below to create a new password:
              </p>
              
              <a href="${resetLink}" style="display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                Reset Password
              </a>
              
              <p style="color: #666; font-size: 14px;">
                If you didn't request this, you can safely ignore this email. 
                The link will expire in 1 hour.
              </p>
              
              <p style="color: #999; font-size: 12px;">
                Or copy this link: ${resetLink}
              </p>
            </div>
          </body>
        </html>
      `,
    };
  }
}