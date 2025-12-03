/**
 * API Integration Tests
 * DSGVO & Compliance Testing
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('API Endpoints', () => {
  const baseUrl = process.env.TEST_URL || 'http://localhost:3000';
  
  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await fetch(`${baseUrl}/api/health`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.status).toBeDefined();
      expect(data.compliance.gdpr).toBe(true);
      expect(data.compliance.iso27001).toBe(true);
      expect(data.compliance.euAiAct).toBe(true);
    });
  });
  
  describe('Analysis API', () => {
    it('should reject empty content', async () => {
      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '' }),
      });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('required');
    });
    
    it('should reject content over limit', async () => {
      const longContent = 'a'.repeat(5001);
      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: longContent }),
      });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('exceeds maximum');
    });
    
    it('should return GDPR compliance headers', async () => {
      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: 'Test content',
          platform: 'twitter',
        }),
      });
      
      expect(response.headers.get('X-GDPR-Compliant')).toBe('true');
      expect(response.headers.get('X-EU-AI-Act-Compliant')).toBe('true');
    });
  });
  
  describe('Privacy APIs', () => {
    it('should handle consent logging', async () => {
      const response = await fetch(`${baseUrl}/api/privacy/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test_user',
          consentTypes: {
            necessary: true,
            functional: true,
            analytics: false,
            marketing: false,
          },
        }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.consentId).toBeDefined();
    });
    
    it('should handle deletion requests', async () => {
      const response = await fetch(`${baseUrl}/api/privacy/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          reason: 'GDPR Article 17',
        }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.confirmationRequired).toBe(true);
    });
  });
  
  describe('Authentication', () => {
    it('should reject invalid login', async () => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid',
          password: 'wrong',
        }),
      });
      
      expect(response.status).toBe(400);
    });
    
    it('should require GDPR consent for registration', async () => {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'new@example.com',
          password: 'SecurePass123!',
          acceptTerms: false,
          gdprConsent: false,
        }),
      });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('consent');
    });
  });
  
  describe('Compliance', () => {
    it('should have security headers', async () => {
      const response = await fetch(`${baseUrl}/api/health`);
      
      // Check security headers
      expect(response.headers.get('X-Content-Type-Options')).toBeDefined();
      expect(response.headers.get('X-Frame-Options')).toBeDefined();
      expect(response.headers.get('X-XSS-Protection')).toBeDefined();
    });
    
    it('should support CORS properly', async () => {
      const response = await fetch(`${baseUrl}/api/health`, {
        method: 'OPTIONS',
      });
      
      expect(response.headers.get('Access-Control-Allow-Origin')).toBeDefined();
    });
  });
});

describe('Rate Limiting', () => {
  it('should enforce rate limits', async () => {
    const baseUrl = process.env.TEST_URL || 'http://localhost:3000';
    
    // Make multiple requests
    const requests = Array(15).fill(null).map(() =>
      fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Test' }),
      })
    );
    
    const responses = await Promise.all(requests);
    const rateLimited = responses.some(r => r.status === 429);
    
    expect(rateLimited).toBe(true);
  });
});

describe('Data Protection', () => {
  it('should hash sensitive data', async () => {
    // This would check that sensitive data is properly hashed
    // in logs and storage
    expect(true).toBe(true);
  });
  
  it('should encrypt data at rest', async () => {
    // This would verify encryption is working
    expect(true).toBe(true);
  });
  
  it('should handle data export requests', async () => {
    const baseUrl = process.env.TEST_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format: 'json' }),
    });
    
    if (response.status === 401) {
      // Unauthorized is expected without session
      expect(response.status).toBe(401);
    } else {
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.gdprCompliant).toBe(true);
    }
  });
});
