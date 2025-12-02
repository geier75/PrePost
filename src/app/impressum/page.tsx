'use client';

export default function Impressum() {
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
          Impressum gemäß §5 TMG & §18 MStV
        </h1>
        
        <div style={{ lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Angaben gemäß §5 TMG
            </h2>
            <p>
              <strong>PREPOST GmbH</strong><br/>
              Musterstraße 1<br/>
              10115 Berlin<br/>
              Deutschland
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Vertreten durch
            </h2>
            <p>
              Geschäftsführer: Max Mustermann<br/>
              Geschäftsführer: Erika Mustermann
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Kontakt
            </h2>
            <p>
              Telefon: +49 (0) 30 123456789<br/>
              Telefax: +49 (0) 30 123456788<br/>
              E-Mail: kontakt@prepost.ai<br/>
              Website: https://prepost.ai
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Registereintrag
            </h2>
            <p>
              Eintragung im Handelsregister<br/>
              Registergericht: Amtsgericht Berlin-Charlottenburg<br/>
              Registernummer: HRB 123456 B
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Umsatzsteuer-ID
            </h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß §27a UStG:<br/>
              DE123456789
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Wirtschafts-ID
            </h2>
            <p>
              Wirtschafts-Identifikationsnummer gemäß §139c AO:<br/>
              DE987654321
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Verantwortlich für den Inhalt (§18 MStV)
            </h2>
            <p>
              Max Mustermann<br/>
              PREPOST GmbH<br/>
              Musterstraße 1<br/>
              10115 Berlin
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              EU-Streitschlichtung
            </h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              <a href="https://ec.europa.eu/consumers/odr/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 style={{ color: '#8b5cf6', textDecoration: 'underline' }}>
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Verbraucherstreitbeilegung
            </h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Haftungsausschluss (Disclaimer)
            </h2>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1rem' }}>
              Haftung für Inhalte
            </h3>
            <p style={{ marginTop: '0.5rem' }}>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
              Tätigkeit hinweisen.
            </p>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1rem' }}>
              Haftung für Links
            </h3>
            <p style={{ marginTop: '0.5rem' }}>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
              Seiten verantwortlich.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Urheberrecht
            </h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Datenschutz
            </h2>
            <p>
              Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. 
              Weitere Informationen finden Sie in unserer{' '}
              <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>
                Datenschutzerklärung
              </a>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Stand
            </h2>
            <p>November 2024</p>
          </section>
        </div>
      </div>
    </div>
  );
}
