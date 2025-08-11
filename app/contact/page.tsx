'use client';

export default function ContactPage() {
  return (
    <div className="container mx-auto py-8">
      <iframe
        src={process.env.NEXT_PUBLIC_CONTACT_FORM_URL}
        frameBorder={0}
        marginWidth={0}
        marginHeight={0}
        style={{ border: 'none', width: '100%', height: '100vh' }}
        allowFullScreen
      />
    </div>
  );
}
