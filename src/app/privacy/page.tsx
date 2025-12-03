'use client';

export default function PrivacyPolicy() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      padding: '4rem 2rem',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '3rem',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Datenschutzerklärung nach DSGVO & EU AI Act
        </h1>
        
        <div style={{ lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              1. Verantwortlicher (Art. 13 Abs. 1 lit. a DSGVO)
            </h2>
            <p>
              PREPOST GmbH<br/>
              Geschäftsführer: [Name]<br/>
              Musterstraße 1<br/>
              10115 Berlin, Deutschland<br/>
              E-Mail: datenschutz@prepost.ai<br/>
              Telefon: +49 30 123456789
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              2. Datenschutzbeauftragter (Art. 37 DSGVO)
            </h2>
            <p>
              Externer Datenschutzbeauftragter<br/>
              DataProtect GmbH<br/>
              E-Mail: dsb@prepost.ai<br/>
              Telefon: +49 30 987654321
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              3. Erhobene Daten & Rechtsgrundlagen (Art. 13 Abs. 1 lit. c DSGVO)
            </h2>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              3.1 Registrierungsdaten
            </h3>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li>E-Mail-Adresse (Pflichtfeld)</li>
              <li>Vollständiger Name (Optional)</li>
              <li>Beruf & Branche (Optional)</li>
              <li>Profilbild (Optional)</li>
            </ul>
            <p style={{ marginTop: '0.5rem' }}>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
            </p>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              3.2 Inhaltsdaten zur Analyse
            </h3>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li>Social Media Posts (verschlüsselt)</li>
              <li>Analyseergebnisse</li>
              <li>Verbesserungsvorschläge</li>
            </ul>
            <p style={{ marginTop: '0.5rem' }}>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              <strong>Speicherdauer:</strong> 30 Tage nach Analyse, dann automatische Löschung
            </p>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              3.3 Technische Daten
            </h3>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li>IP-Adresse (anonymisiert nach 7 Tagen)</li>
              <li>Browser-Typ und Version</li>
              <li>Betriebssystem</li>
              <li>Cookies (siehe Cookie-Policy)</li>
            </ul>
            <p style={{ marginTop: '0.5rem' }}>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse)
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              4. KI-Verarbeitung nach EU AI Act
            </h2>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              4.1 KI-System Klassifizierung
            </h3>
            <p>
              PREPOST nutzt KI-Systeme mit <strong>minimalem Risiko</strong> gemäß EU AI Act Artikel 52.
              Unser System fällt nicht unter Hochrisiko-KI-Systeme (Anhang III).
            </p>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              4.2 Transparenzpflichten
            </h3>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li>KI-Modell: Anthropic Claude 3.5 Sonnet</li>
              <li>Zweck: Risikoanalyse von Social Media Inhalten</li>
              <li>Funktionsweise: Natural Language Processing zur Sentiment- und Risikoanalyse</li>
              <li>Genauigkeit: ~94% (kontinuierlich überwacht)</li>
              <li>Keine automatisierte Entscheidungsfindung i.S.v. Art. 22 DSGVO</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              4.3 Menschliche Aufsicht
            </h3>
            <p>
              Alle KI-generierten Empfehlungen sind Vorschläge. Die finale Entscheidung 
              über Veröffentlichungen trifft immer der Nutzer (Human-in-the-loop Prinzip).
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              5. Ihre Rechte (Art. 13 Abs. 2 lit. b DSGVO)
            </h2>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Kostenlose Auskunft über gespeicherte Daten</li>
              <li><strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Korrektur unrichtiger Daten</li>
              <li><strong>Löschungsrecht (Art. 17 DSGVO):</strong> "Recht auf Vergessenwerden"</li>
              <li><strong>Einschränkungsrecht (Art. 18 DSGVO):</strong> Sperrung der Verarbeitung</li>
              <li><strong>Datenportabilität (Art. 20 DSGVO):</strong> Datenübertragung in strukturiertem Format</li>
              <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Widerspruch gegen Verarbeitung</li>
              <li><strong>Widerruf (Art. 7 Abs. 3 DSGVO):</strong> Jederzeitiger Widerruf der Einwilligung</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              Zur Ausübung Ihrer Rechte kontaktieren Sie: datenschutz@prepost.ai
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              6. Datensicherheit (Art. 32 DSGVO)
            </h2>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li>AES-256 Ende-zu-Ende Verschlüsselung</li>
              <li>TLS 1.3 für alle Datenübertragungen</li>
              <li>ISO 27001 zertifizierte Server (AWS Frankfurt)</li>
              <li>Regelmäßige Penetrationstests</li>
              <li>24/7 Security Monitoring</li>
              <li>Zero-Knowledge Architektur für sensible Daten</li>
              <li>DSGVO-konforme Auftragsverarbeiter (AVV vorhanden)</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              7. Internationale Datenübermittlung (Art. 44 ff. DSGVO)
            </h2>
            <p>
              Datenverarbeitung erfolgt ausschließlich in der EU (Frankfurt, Deutschland).
              Bei Nutzung von US-Diensten (Stripe, Anthropic) erfolgt dies auf Basis von:
            </p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>EU-US Data Privacy Framework (Angemessenheitsbeschluss)</li>
              <li>Standard-Datenschutzklauseln (SCC)</li>
              <li>Zusätzliche technische Schutzmaßnahmen</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              8. Cookies & Tracking
            </h2>
            <p>
              Wir verwenden nur technisch notwendige Cookies. Marketing-Cookies nur mit Ihrer Einwilligung.
              Details siehe <a href="/cookies" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Cookie-Richtlinie</a>.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              9. Beschwerderecht (Art. 13 Abs. 2 lit. d DSGVO)
            </h2>
            <p>
              Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren:
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Berliner Beauftragte für Datenschutz und Informationsfreiheit<br/>
              Friedrichstr. 219<br/>
              10969 Berlin<br/>
              E-Mail: mailbox@datenschutz-berlin.de
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              10. Aktualität & Änderungen
            </h2>
            <p>
              Stand: November 2024<br/>
              Version: 1.0<br/>
              Bei Änderungen informieren wir Sie per E-Mail.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
