'use client';

import { useEffect } from 'react';

export default function ContactPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.hsforms.net/forms/embed/v2.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.hbspt) {
        // @ts-ignore
        window.hbspt.forms.create({
          region: 'na1',
          portalId: '50203416',
          formId: '11136151-e63d-4073-a62e-f25df954f1ef',
          target: '#hubspotForm'
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Contáctanos</h1>
<div
            {/* 🔎 Call to Action Block */}
      <div className="mt-12 p-8 bg-gray-100 rounded-xl text-center shadow-lg">
        <h2 className="text-2xl font-semibold mb-2">¿Quieres ir más allá?</h2>
        <p className="mb-4 text-gray-700">Agenda una sesión personalizada o accede a nuestra membresía premium y desbloquea aún más automatizaciones.</p>
        <div className="flex justify-center gap-4">
          <a
            href="https://buy.stripe.com/4gw4jSd5c5bM6KI288"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Contratar Consultoría
          </a>
          <a
            href="https://buy.stripe.com/28o6qI6KE2rAeSI6or"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition"
          >
            Unirse a la Membresía
          </a>
        </div>
      </div>

      {/* 🤖 ChatGPT Assistant Placeholder */}
      <div id="simirikiChatWidget" className="mt-16" />
 id="hubspotForm"></div>
    </div>
  );
}
