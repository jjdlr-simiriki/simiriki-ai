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
      <div id="hubspotForm"></div>
    </div>
  );
}
