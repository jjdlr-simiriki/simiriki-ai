import FAQ from './components/FAQ';

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold">Welcome to Simiriki</h1>
        <p className="mt-4 text-xl">Your guide to smarter decisions.</p>
      </section>

      <FAQ />

      {/* Microsoft Forms iframe */}
      <section id="contact" className="py-20">
        <iframe
          src={process.env.NEXT_PUBLIC_CONTACT_FORM_URL || ''}
          width="100%"
          height="600"
          style={{ border: 'none' }}
          title="Simiriki Contact Form"
        />
      </section>
    </main>
  );
}
