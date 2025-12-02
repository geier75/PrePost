'use client';

export default function TermsOfService() {
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
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>
        
        <div style={{ lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              §1 Geltungsbereich & Vertragspartner
            </h2>
            <p>
              (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen der 
              PREPOST GmbH, Musterstraße 1, 10115 Berlin (nachfolgend "Anbieter") und dem Nutzer 
              (nachfolgend "Kunde") über die Nutzung der PREPOST-Plattform.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (2) Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft 
              zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen 
              beruflichen Tätigkeit zugerechnet werden können.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              §2 Leistungsbeschreibung
            </h2>
            <p>
              (1) PREPOST ist eine KI-gestützte Plattform zur Risikoanalyse von Social Media Inhalten 
              vor deren Veröffentlichung.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (2) Der Leistungsumfang richtet sich nach dem gewählten Tarif:
            </p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li><strong>Free:</strong> Bis zu 10 Analysen pro Tag</li>
              <li><strong>Pro (9,99€/Monat):</strong> Unbegrenzte Analysen, Priority Support</li>
              <li><strong>Premium (29,99€/Monat):</strong> Alle Pro-Features + Team-Funktionen</li>
              <li><strong>Enterprise:</strong> Individuelle Vereinbarung</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              §3 KI-Nutzung & EU AI Act Compliance
            </h2>
            <p>
              (1) Der Kunde wird hiermit informiert, dass die Plattform KI-Systeme zur Inhaltsanalyse 
              verwendet (EU AI Act Art. 52).
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (2) Das verwendete KI-System (Anthropic Claude) ist als System mit minimalem Risiko 
              klassifiziert und unterliegt nicht den Hochrisiko-Bestimmungen des EU AI Act.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (3) Die KI-generierten Analysen sind Empfehlungen. Die Entscheidung über die 
              Veröffentlichung von Inhalten trifft ausschließlich der Kunde (Human-in-the-loop).
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (4) Der Anbieter gewährleistet:
            </p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Transparenz über die KI-Nutzung</li>
              <li>Menschliche Aufsicht über das System</li>
              <li>Regelmäßige Qualitätskontrolle (min. 94% Genauigkeit)</li>
              <li>Keine diskriminierende Verarbeitung</li>
              <li>Protokollierung aller KI-Entscheidungen</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              §4 Vertragsschluss
            </h2>
            <p>
              (1) Die Darstellung der Leistungen auf der Website stellt kein rechtlich bindendes Angebot dar.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (2) Der Vertrag kommt durch Registrierung und Aktivierung des Accounts zustande.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (3) Der Vertragstext wird gespeichert und kann jederzeit im Account eingesehen werden.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              §5 Widerrufsrecht für Verbraucher
            </h2>
            <div style={{ 
              background: 'rgba(139,92,246,0.1)', 
              padding: '1rem', 
              borderRadius: '12px',
              border: '1px solid rgba(139,92,246,0.3)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Widerrufsbelehrung
              </h3>
              <p>
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (PREPOST GmbH, Musterstraße 1, 10115 Berlin, 
                E-Mail: widerruf@prepost.ai) mittels einer eindeutigen Erklärung über Ihren Entschluss, 
                diesen Vertrag zu widerrufen, informieren.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                <strong>Folgen des Widerrufs:</strong> Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle 
                Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen 
                ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              §6 Preise & Zahlung
            </h2>
            <p>
              (1) Alle Preise verstehen sich inklusive der gesetzlichen Umsatzsteuer.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (2) Die Zahlung erfolgt per Kreditkarte, SEPA-Lastschrift oder PayPal über Stripe.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (3) Bei Zahlungsverzug werden Verzugszinsen in Höhe von 5% über dem Basiszinssatz berechnet.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              §7 Datenschutz & Sicherheit
            </h2>
            <p>
              (1) Der Anbieter verpflichtet sich zur Einhaltung der DSGVO und aller relevanten 
              Datenschutzbestimmungen.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (2) Technische und organisatorische Maßnahmen:
            </p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>AES-256 Verschlüsselung</li>
              <li>ISO 27001 zertifizierte Server</li>
              <li>Regelmäßige Sicherheitsaudits</li>
              <li>Automatische Datenlöschung nach 30 Tagen</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              §8 Haftung & Gewährleistung
            </h2>
            <p>
              (1) Die KI-Analysen sind automatisierte Empfehlungen ohne Gewähr für Vollständigkeit 
              oder Richtigkeit.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (2) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie bei 
              Verletzung von Leben, Körper und Gesundheit.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (3) Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher 
              Vertragspflichten, begrenzt auf den vorhersehbaren, vertragstypischen Schaden.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (4) Die Haftung für Datenverlust ist auf den typischen Wiederherstellungsaufwand beschränkt.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              §9 Kündigung
            </h2>
            <p>
              (1) Der Vertrag kann von beiden Parteien mit einer Frist von einem Monat zum Monatsende 
              gekündigt werden.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (2) Das Recht zur außerordentlichen Kündigung bleibt unberührt.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (3) Die Kündigung bedarf der Textform (E-Mail genügt).
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              §10 Änderungen der AGB
            </h2>
            <p>
              (1) Der Anbieter behält sich vor, diese AGB zu ändern.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (2) Änderungen werden dem Kunden per E-Mail mitgeteilt. Sie gelten als genehmigt, wenn der 
              Kunde nicht binnen 4 Wochen widerspricht.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              §11 Streitbeilegung
            </h2>
            <p>
              (1) Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: 
              <a href="https://ec.europa.eu/consumers/odr" 
                 target="_blank" 
                 style={{ color: '#8b5cf6', marginLeft: '0.5rem' }}>
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (2) Wir sind nicht verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              §12 Schlussbestimmungen
            </h2>
            <p>
              (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (2) Gerichtsstand für Kaufleute ist Berlin.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              (3) Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen 
              Bestimmungen unberührt.
            </p>
            <p style={{ marginTop: '1rem' }}>
              <strong>Stand:</strong> November 2024<br/>
              <strong>Version:</strong> 1.0
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
