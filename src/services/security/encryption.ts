// src/services/security/encryption.ts
import crypto from 'crypto';

export class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private keyLength = 32; // 256 bits
  private ivLength = 16; // 128 bits
  private saltLength = 64; // 512 bits
  private tagLength = 16; // 128 bits
  private iterations = 100000;

  constructor(private masterKey?: string) {
    this.masterKey = masterKey || process.env.ENCRYPTION_MASTER_KEY!;
    if (!this.masterKey) {
      throw new Error('Encryption master key not configured');
    }
  }

  /**
   * Encrypts sensitive data using AES-256-GCM
   */
  async encrypt(text: string): Promise<string> {
    try {
      // Generate random salt and IV
      const salt = crypto.randomBytes(this.saltLength);
      const iv = crypto.randomBytes(this.ivLength);

      // Derive key from master key and salt
      const key = await this.deriveKey(this.masterKey!, salt);

      // Create cipher
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);

      // Encrypt data
      const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final(),
      ]);

      // Get auth tag
      const tag = cipher.getAuthTag();

      // Combine salt, iv, tag, and encrypted data
      const combined = Buffer.concat([salt, iv, tag, encrypted]);

      // Return base64 encoded
      return combined.toString('base64');
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypts data encrypted with encrypt()
   */
  async decrypt(encryptedData: string): Promise<string> {
    try {
      // Decode from base64
      const combined = Buffer.from(encryptedData, 'base64');

      // Extract components
      const salt = combined.slice(0, this.saltLength);
      const iv = combined.slice(this.saltLength, this.saltLength + this.ivLength);
      const tag = combined.slice(
        this.saltLength + this.ivLength,
        this.saltLength + this.ivLength + this.tagLength
      );
      const encrypted = combined.slice(this.saltLength + this.ivLength + this.tagLength);

      // Derive key from master key and salt
      const key = await this.deriveKey(this.masterKey!, salt);

      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      decipher.setAuthTag(tag);

      // Decrypt data
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);

      return decrypted.toString('utf8');
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hashes data using SHA-256 (one-way)
   */
  hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generates a secure random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Anonymizes PII data for GDPR compliance
   */
  anonymize(data: string, preserveLength: boolean = false): string {
    const hash = this.hash(data);
    
    if (preserveLength) {
      // Return hash truncated to original length
      return hash.substring(0, data.length);
    }
    
    // Return first 8 chars of hash
    return hash.substring(0, 8);
  }

  /**
   * Masks sensitive data (e.g., email -> e***@example.com)
   */
  mask(data: string, type: 'email' | 'phone' | 'custom' = 'custom'): string {
    switch (type) {
      case 'email':
        const [localPart, domain] = data.split('@');
        if (!domain) return '***';
        const maskedLocal = localPart[0] + '***';
        return `${maskedLocal}@${domain}`;
      
      case 'phone':
        if (data.length < 4) return '***';
        return data.slice(0, -4).replace(/./g, '*') + data.slice(-4);
      
      case 'custom':
      default:
        if (data.length <= 3) return '***';
        const visibleChars = Math.min(3, Math.floor(data.length / 3));
        return data.substring(0, visibleChars) + '***';
    }
  }

  /**
   * Derives encryption key from master key and salt
   */
  private async deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, this.iterations, this.keyLength, 'sha256', (err, key) => {
        if (err) reject(err);
        else resolve(key);
      });
    });
  }

  /**
   * Validates if data has been tampered with
   */
  async validateIntegrity(data: string, signature: string): Promise<boolean> {
    const hmac = crypto.createHmac('sha256', this.masterKey!);
    hmac.update(data);
    const computedSignature = hmac.digest('hex');
    
    // Constant time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  }

  /**
   * Creates a signature for data integrity
   */
  sign(data: string): string {
    const hmac = crypto.createHmac('sha256', this.masterKey!);
    hmac.update(data);
    return hmac.digest('hex');
  }
}

// Export singleton instance
export const encryption = new EncryptionService();

// GDPR-compliant data processor
export class GDPRProcessor {
  constructor(private encryptionService: EncryptionService) {}

  /**
   * Processes user data for storage (encrypts PII)
   */
  async processForStorage(userData: any): Promise<any> {
    const processed = { ...userData };
    
    // Encrypt sensitive fields
    const sensitiveFields = ['email', 'full_name', 'phone', 'address', 'ip_address'];
    
    for (const field of sensitiveFields) {
      if (processed[field]) {
        processed[field] = await this.encryptionService.encrypt(processed[field]);
      }
    }
    
    return processed;
  }

  /**
   * Processes user data for display (decrypts PII)
   */
  async processForDisplay(userData: any): Promise<any> {
    const processed = { ...userData };
    
    // Decrypt sensitive fields
    const sensitiveFields = ['email', 'full_name', 'phone', 'address', 'ip_address'];
    
    for (const field of sensitiveFields) {
      if (processed[field] && processed[field].startsWith('enc:')) {
        try {
          processed[field] = await this.encryptionService.decrypt(
            processed[field].substring(4)
          );
        } catch (error) {
          // If decryption fails, return masked value
          processed[field] = '***';
        }
      }
    }
    
    return processed;
  }

  /**
   * Exports user data for GDPR data portability
   */
  async exportUserData(userId: string): Promise<any> {
    // This would fetch all user data from various sources
    // and compile it into a portable format
    
    return {
      exported_at: new Date().toISOString(),
      user_id: userId,
      // ... all user data
    };
  }

  /**
   * Anonymizes user data for GDPR right to be forgotten
   */
  async anonymizeUserData(userId: string): Promise<void> {
    // This would anonymize all user data across the system
    // while maintaining referential integrity for legal requirements
    
    console.log(`Anonymizing data for user: ${userId}`);
    // Implementation would update all user records
  }
}

// Content sanitization for preventing XSS
export class ContentSanitizer {
  /**
   * Sanitizes user input to prevent XSS attacks
   */
  sanitize(input: string): string {
    // Basic HTML entity encoding
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validates input against common injection patterns
   */
  validateInput(input: string): boolean {
    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/gi,
      /(--|;|\/\*|\*\/)/g,
      /(\bOR\b\s*\d+\s*=\s*\d+)/gi,
    ];

    // Check for script injection patterns
    const scriptPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ];

    const patterns = [...sqlPatterns, ...scriptPatterns];
    
    for (const pattern of patterns) {
      if (pattern.test(input)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Strips all HTML tags from input
   */
  stripHtml(input: string): string {
    return input.replace(/<[^>]*>/g, '');
  }
}