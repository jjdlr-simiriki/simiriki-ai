'use client';

import { useEffect } from 'react';

export default function ContactPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//js.hsforms.net/forms/embed/v2.js';
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    document.body.appendChild(script);
    script.onload = () => {
      if ((window as any).hbspt) {
        (window as any).hbspt.forms.create({
          region: 'na1',
          portalId: '50203146',
          formId: '5d6f2da9-be4d-451c-8ed4-5f051b68d071',
          target: '#hubspotForm'
        });
      }
    };
  }, []);

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Contáctanos</h1>
      <div id="hubspotForm"></div>
    </main>
  );
}
