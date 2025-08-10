import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Simiriki | Automatiza. Escala. Transforma.</title>
        <meta name="description" content="Implementamos asistentes, flujos y funnels que venden 24/7. Integración nativa con Microsoft." />
      </Head>
      <main className="container mx-auto p-8">
        <section className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">Automatiza. Escala. Transforma.</h1>
          <p className="text-lg mb-8">Implementamos asistentes, flujos y funnels que venden 24/7. Integración nativa con tu ecosistema Microsoft.</p>
          <a href="https://outlook.office.com/bookwithme/user/15326e2aa1e14023a8057ff158d26f38@simiriki.com?anonymous&ismsaljsauthenabled&ep=plink" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Agenda una llamada
          </a>
        </section>

        {/* Aquí puedes seguir agregando secciones: servicios, FAQ, etc. */}
      </main>
    </>
  );
}
