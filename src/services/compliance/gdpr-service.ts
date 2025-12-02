// src/services/compliance/gdpr-service.ts
import { supabaseAdmin } from '@/lib/supabase/client';
import { encryption } from '@/services/security/encryption';

export interface ConsentRecord {
  user_id: string;
  consent_type: 'marketing' | 'analytics' | 'necessary' | 'functional';
  granted: boolean;
  timestamp: Date;
  ip_address?: string;
  user_agent?: string;
  version: string;
}

export interface DataRetentionPolicy {
  data_type: string;
  retention_days: number;
  auto_delete: boolean;
  anonymize_after: boolean;
}

export class GDPRService {
  private retentionPolicies: Map<string, DataRetentionPolicy>;

  constructor() {
    // Define data retention policies
    this.retentionPolicies = new Map([
      ['user_profile', { 
        data_type: 'user_profile', 
        retention_days: 365 * 3, // 3 years
        auto_delete: false,
        anonymize_after: true 
      }],
      ['analysis_content', { 
        data_type: 'analysis_content', 
        retention_days: 30, // 30 days
        auto_delete: true,
        anonymize_after: false 
      }],
      ['audit_logs', { 
        data_type: 'audit_logs', 
        retention_days: 365 * 2, // 2 years for compliance
        auto_delete: false,
        anonymize_after: true 
      }],
      ['payment_data', { 
        data_type: 'payment_data', 
        retention_days: 365 * 7, // 7 years for tax compliance
        auto_delete: false,
        anonymize_after: false 
      }],
    ]);
  }

  /**
   * Records user consent for data processing
   */
  async recordConsent(consent: ConsentRecord): Promise<void> {
    try {
      await supabaseAdmin.recordConsent({
        ...consent,
        ip_address: consent.ip_address ? encryption.anonymize(consent.ip_address) : null,
      });

      // Log audit event
      await supabaseAdmin.logAuditEvent({
        user_id: consent.user_id,
        action: 'consent_recorded',
        resource_type: 'consent',
        details: {
          consent_type: consent.consent_type,
          granted: consent.granted,
          version: consent.version,
        },
      });
    } catch (error) {
      console.error('Error recording consent:', error);
      throw new Error('Failed to record consent');
    }
  }

  /**
   * Gets current consent status for a user
   */
  async getUserConsent(userId: string): Promise<Record<string, boolean>> {
    try {
      const consents = await supabaseAdmin.getUserConsents(userId);
      
      const consentMap: Record<string, boolean> = {
        marketing: false,
        analytics: false,
        necessary: true, // Always true for essential cookies
        functional: false,
      };

      consents.forEach((consent: any) => {
        consentMap[consent.consent_type] = consent.granted;
      });

      return consentMap;
    } catch (error) {
      console.error('Error getting user consent:', error);
      throw new Error('Failed to retrieve consent status');
    }
  }

  /**
   * Exports all user data for GDPR data portability
   */
  async exportUserData(userId: string): Promise<any> {
    try {
      // Collect data from all sources
      const [
        userProfile,
        analyses,
        subscriptions,
        consents,
        auditLogs,
      ] = await Promise.all([
        supabaseAdmin.getUserById(userId),
        supabaseAdmin.getAllUserAnalyses(userId),
        supabaseAdmin.getUserSubscriptionHistory(userId),
        supabaseAdmin.getUserConsents(userId),
        supabaseAdmin.getUserAuditLogs(userId),
      ]);

      // Decrypt sensitive data
      const decryptedProfile = await this.decryptSensitiveData(userProfile);

      // Compile export
      const exportData = {
        export_date: new Date().toISOString(),
        export_version: '1.0',
        user_data: {
          profile: decryptedProfile,
          analyses: analyses.map((a: any) => ({
            ...a,
            content: '[REDACTED]', // Don't export actual content
          })),
          subscriptions,
          consents,
          audit_logs: auditLogs.map((log: any) => ({
            ...log,
            ip_address: '[ANONYMIZED]',
          })),
        },
      };

      // Log export event
      await supabaseAdmin.logAuditEvent({
        user_id: userId,
        action: 'data_exported',
        resource_type: 'user_data',
        details: { export_date: exportData.export_date },
      });

      return exportData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw new Error('Failed to export user data');
    }
  }

  /**
   * Deletes or anonymizes user data (Right to be forgotten)
   */
  async deleteUserData(userId: string, options: {
    deleteAccount: boolean;
    anonymizeOnly: boolean;
  }): Promise<void> {
    try {
      if (options.anonymizeOnly) {
        // Anonymize personal data but keep records
        await this.anonymizeUser(userId);
      } else if (options.deleteAccount) {
        // Complete account deletion
        await this.deleteUser(userId);
      }

      // Log deletion/anonymization
      await supabaseAdmin.logAuditEvent({
        user_id: userId,
        action: options.deleteAccount ? 'account_deleted' : 'data_anonymized',
        resource_type: 'user_data',
        details: { 
          method: options.anonymizeOnly ? 'anonymization' : 'deletion',
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw new Error('Failed to delete user data');
    }
  }

  /**
   * Processes data retention policies
   */
  async enforceRetentionPolicies(): Promise<void> {
    for (const [dataType, policy] of this.retentionPolicies) {
      if (policy.auto_delete) {
        await this.deleteOldData(dataType, policy.retention_days);
      } else if (policy.anonymize_after) {
        await this.anonymizeOldData(dataType, policy.retention_days);
      }
    }
  }

  /**
   * Checks if data processing is lawful under GDPR
   */
  async validateLawfulBasis(
    userId: string,
    processingType: string
  ): Promise<boolean> {
    // Check various lawful bases
    const lawfulBases = [
      await this.hasConsent(userId, processingType),
      await this.hasContract(userId, processingType),
      await this.hasLegalObligation(processingType),
      await this.hasVitalInterest(userId, processingType),
      await this.hasPublicTask(processingType),
      await this.hasLegitimateInterest(processingType),
    ];

    return lawfulBases.some(basis => basis);
  }

  /**
   * Generates a GDPR-compliant privacy notice
   */
  generatePrivacyNotice(language: string = 'en'): string {
    const notices = {
      en: `
# Privacy Notice

## Data Controller
ThinkBeforePost AI GmbH
[Contact Information]

## Data We Collect
- Account information (email, name)
- Content you analyze
- Usage data and analytics
- Payment information (processed by Stripe)

## Legal Basis
We process your data based on:
- Your consent (for marketing)
- Contract fulfillment (for service provision)
- Legitimate interests (for security and improvement)
- Legal obligations (for tax and compliance)

## Your Rights
Under GDPR, you have the right to:
- Access your personal data
- Rectify incorrect data
- Delete your data ("right to be forgotten")
- Restrict processing
- Data portability
- Object to processing
- Not be subject to automated decision-making

## Data Retention
We retain your data according to our retention policies:
- Account data: 3 years after account closure
- Analysis content: 30 days
- Payment records: 7 years (legal requirement)
- Audit logs: 2 years

## Contact
For privacy concerns, contact: privacy@thinkbeforepost.ai
Data Protection Officer: dpo@thinkbeforepost.ai
      `,
      de: `
# Datenschutzerklärung

## Verantwortlicher
ThinkBeforePost AI GmbH
[Kontaktinformationen]

## Erhobene Daten
- Kontoinformationen (E-Mail, Name)
- Von Ihnen analysierte Inhalte
- Nutzungsdaten und Analysen
- Zahlungsinformationen (verarbeitet durch Stripe)

## Rechtsgrundlage
Wir verarbeiten Ihre Daten auf Basis von:
- Ihrer Einwilligung (für Marketing)
- Vertragserfüllung (für Dienstleistungen)
- Berechtigten Interessen (für Sicherheit und Verbesserung)
- Rechtlichen Verpflichtungen (für Steuern und Compliance)

## Ihre Rechte
Nach DSGVO haben Sie das Recht auf:
- Auskunft über Ihre persönlichen Daten
- Berichtigung unkorrekter Daten
- Löschung Ihrer Daten ("Recht auf Vergessenwerden")
- Einschränkung der Verarbeitung
- Datenübertragbarkeit
- Widerspruch gegen die Verarbeitung
- Nicht automatisierten Entscheidungen unterworfen zu werden

## Datenspeicherung
Wir speichern Ihre Daten gemäß unseren Aufbewahrungsrichtlinien:
- Kontodaten: 3 Jahre nach Kontoschließung
- Analyse-Inhalte: 30 Tage
- Zahlungsunterlagen: 7 Jahre (gesetzliche Anforderung)
- Audit-Logs: 2 Jahre

## Kontakt
Bei Datenschutzanliegen: privacy@thinkbeforepost.ai
Datenschutzbeauftragter: dpo@thinkbeforepost.ai
      `,
    };

    return notices[language] || notices.en;
  }

  // Private helper methods
  private async anonymizeUser(userId: string): Promise<void> {
    // Anonymize user profile
    await supabaseAdmin.updateUser(userId, {
      email: `anon_${encryption.anonymize(userId)}@deleted.com`,
      full_name: 'Anonymous User',
      username: null,
      profession: null,
      industry: null,
      avatar_url: null,
    });

    // Anonymize analyses
    await supabaseAdmin.anonymizeUserAnalyses(userId);
  }

  private async deleteUser(userId: string): Promise<void> {
    // Delete in correct order to respect foreign keys
    await supabaseAdmin.deleteUserAnalyses(userId);
    await supabaseAdmin.deleteUserSubscriptions(userId);
    await supabaseAdmin.deleteUserConsents(userId);
    await supabaseAdmin.deleteUser(userId);
  }

  private async deleteOldData(dataType: string, retentionDays: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    switch (dataType) {
      case 'analysis_content':
        await supabaseAdmin.deleteOldAnalyses(cutoffDate);
        break;
      case 'audit_logs':
        await supabaseAdmin.deleteOldAuditLogs(cutoffDate);
        break;
      // Add more data types as needed
    }
  }

  private async anonymizeOldData(dataType: string, retentionDays: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    switch (dataType) {
      case 'user_profile':
        await supabaseAdmin.anonymizeInactiveUsers(cutoffDate);
        break;
      case 'audit_logs':
        await supabaseAdmin.anonymizeOldAuditLogs(cutoffDate);
        break;
      // Add more data types as needed
    }
  }

  private async decryptSensitiveData(data: any): Promise<any> {
    // Decrypt encrypted fields
    const decrypted = { ...data };
    const encryptedFields = ['email', 'full_name', 'phone'];
    
    for (const field of encryptedFields) {
      if (decrypted[field] && decrypted[field].startsWith('enc:')) {
        try {
          decrypted[field] = await encryption.decrypt(decrypted[field].substring(4));
        } catch {
          decrypted[field] = '[DECRYPTION_FAILED]';
        }
      }
    }
    
    return decrypted;
  }

  private async hasConsent(userId: string, processingType: string): Promise<boolean> {
    const consents = await this.getUserConsent(userId);
    return consents[processingType] || false;
  }

  private async hasContract(userId: string, processingType: string): Promise<boolean> {
    // Check if processing is necessary for contract
    if (processingType === 'service_provision') {
      const subscription = await supabaseAdmin.getUserSubscription(userId);
      return subscription?.status === 'active';
    }
    return false;
  }

  private async hasLegalObligation(processingType: string): Promise<boolean> {
    // Check if processing is required by law
    return ['tax_records', 'fraud_prevention'].includes(processingType);
  }

  private async hasVitalInterest(userId: string, processingType: string): Promise<boolean> {
    // Usually not applicable for this service
    return false;
  }

  private async hasPublicTask(processingType: string): Promise<boolean> {
    // Usually not applicable for this service
    return false;
  }

  private async hasLegitimateInterest(processingType: string): Promise<boolean> {
    // Check if we have legitimate interest
    return ['security', 'improvement', 'analytics'].includes(processingType);
  }
}

// Export singleton instance
export const gdprService = new GDPRService();