import Script from 'next/script';
import Image from 'next/image';
import FAQ from './components/FAQ';

export default function Home() {
  return (
    <>
      {/* Load main.js with Next.js Script component */}
      <Script src="/main.js" strategy="afterInteractive" />
      
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <Image
            src="/logo.svg"
            alt="Simiriki Logo"
            width={200}
            height={60}
            className="logo"
            priority
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#features" className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              Características
            </a>
            <a href="#contact" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              Contacto
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <h1>Automatiza tu Negocio</h1>
          <p className="subtitle">Escala • Transforma • Crece</p>
          <p className="description">
            Descubre cómo la automatización inteligente puede transformar tu empresa. 
            Reduce costos operativos hasta un 40% y multiplica tu productividad con 
            soluciones personalizadas que se adaptan a tu negocio.
          </p>
          
          <div className="cta-container">
            <a href="#contact" className="btn btn-primary">
              Solicitar Demo Gratuita
            </a>
            <a href="#features" className="btn btn-secondary">
              Ver Características
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <div className="features-container">
            <h2>¿Por qué elegir Simiriki?</h2>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
              Soluciones de automatización que generan resultados reales
            </p>
            
            <div className="features-grid">
              <div className="feature-card slide-up">
                <div className="feature-icon">🚀</div>
                <h3>Automatización Inteligente</h3>
                <p>
                  Implementamos sistemas que automatizan procesos repetitivos, 
                  liberando tiempo valioso para que tu equipo se enfoque en tareas estratégicas.
                </p>
              </div>
              
              <div className="feature-card slide-up">
                <div className="feature-icon">📈</div>
                <h3>Escalabilidad Garantizada</h3>
                <p>
                  Nuestras soluciones crecen contigo. Diseñamos sistemas que se adaptan 
                  al crecimiento de tu empresa sin comprometer el rendimiento.
                </p>
              </div>
              
              <div className="feature-card slide-up">
                <div className="feature-icon">🔄</div>
                <h3>Transformación Digital</h3>
                <p>
                  Te acompañamos en cada paso de tu transformación digital, desde la 
                  planificación hasta la implementación y optimización continua.
                </p>
              </div>
              
              <div className="feature-card slide-up">
                <div className="feature-icon">💡</div>
                <h3>Soluciones Personalizadas</h3>
                <p>
                  Cada negocio es único. Desarrollamos soluciones específicas para 
                  tus necesidades, maximizando el ROI de tu inversión en tecnología.
                </p>
              </div>
              
              <div className="feature-card slide-up">
                <div className="feature-icon">📊</div>
                <h3>Analytics Avanzado</h3>
                <p>
                  Obtén insights valiosos con nuestros dashboards inteligentes. 
                  Toma decisiones basadas en datos reales y precisos.
                </p>
              </div>
              
              <div className="feature-card slide-up">
                <div className="feature-icon">🛡️</div>
                <h3>Soporte 24/7</h3>
                <p>
                  Nuestro equipo de expertos está disponible cuando lo necesites. 
                  Garantizamos uptime del 99.9% y respuesta rápida ante cualquier consulta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{ background: '#f8f9ff', padding: '80px 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: '#333' }}>
              Preguntas Frecuentes
            </h2>
            <FAQ />
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact">
          <div className="contact-container">
            <h2>¿Listo para transformar tu negocio?</h2>
            <p>
              Solicita una consultoría gratuita y descubre cómo podemos ayudarte 
              a automatizar, escalar y transformar tu empresa.
            </p>
            
            <div style={{ marginBottom: '3rem' }}>
              <a href="mailto:contacto@simiriki.com" className="btn btn-primary" style={{ marginRight: '1rem' }}>
                Contactar Ahora
              </a>
              <a href="tel:+34600000000" className="btn btn-secondary">
                Llamar Gratis
              </a>
            </div>

            {/* Microsoft Forms iframe */}
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '15px', marginTop: '2rem' }}>
              <iframe
                src="https://forms.office.com/Pages/ResponsePage.aspx?..." // TODO: replace with actual form URL
                width="100%"
                height="600"
                style={{ border: 'none', borderRadius: '10px' }}
                title="Formulario de Contacto Simiriki"
              />
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer style={{ 
        background: '#2c3e50', 
        color: 'white', 
        textAlign: 'center', 
        padding: '2rem',
        borderTop: '4px solid #667eea'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Image
            src="/logo.svg"
            alt="Simiriki Logo"
            width={150}
            height={45}
            style={{ marginBottom: '1rem', filter: 'brightness(0) invert(1)' }}
          />
          <p style={{ margin: '1rem 0', opacity: 0.8 }}>
            © 2024 Simiriki. Todos los derechos reservados. 
            Transformando empresas a través de la automatización inteligente.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Política de Privacidad</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Términos de Servicio</a>
            <a href="#contact" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Contacto</a>
          </div>
        </div>
      </footer>
    </>
  );
}
