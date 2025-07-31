import React from 'react';

export const metadata = {
  title: 'FAQs | Simiriki',
  description: 'Frequently Asked Questions about Simiriki digital transformation consultancy',
};

const faqs = [
  {
    question: '¿Qué es Simiriki y por qué debería importarme?',
    answer: 'Simiriki es la plataforma líder en México y Latinoamérica que utiliza automatización inteligente e IA conversacional para liberar a las PYMEs de las tareas repetitivas. Nos describimos como el socio tecnológico que automatiza lo aburrido para que puedas volver a hacer lo que amas. Si estás cansado de tableros de Excel que no escalan y quieres vender hasta 340 % más, estás en el lugar correcto.'
  },
  {
    question: '¿Cómo la automatización inteligente mejora mi negocio?',
    answer: 'Nuestros flujos de trabajo se ejecutan solos, lo que libera tu tiempo y el de tu equipo para que se enfoquen en tareas de alto valor. Más de 200 empresas han transformado su operación con Simiriki, logrando un ROI promedio de 300 %, 85 % de tiempo ahorrado y una satisfacción de cliente del 98 %.'
  },
  {
    question: '¿Necesito ser experto en tecnología para usar Simiriki?',
    answer: 'No. Nuestro software está diseñado para que cualquier PYME pueda aprovechar la IA sin convertirse en programador. Configuramos las integraciones, entrenamos a los asistentes virtuales y te guiamos paso a paso; tú te concentras en vender y en tu estrategia.'
  },
  {
    question: '¿Qué tipo de IA utiliza Simiriki y cómo atiende a mis clientes?',
    answer: 'Utilizamos IA conversacional alimentada por modelos de lenguaje avanzados que permiten que tus clientes sean atendidos 24/7 con respuestas personalizadas. No es un bot genérico: se adapta a tu negocio y aprende con cada interacción.'
  },
  {
    question: '¿Con qué herramientas se integra Simiriki?',
    answer: 'Nos conectamos con las plataformas líderes del mercado para crear un ecosistema integrado: HubSpot, Google Cloud, Microsoft, Zapier y OpenAI. Esto te permite sincronizar tus datos actuales y aprovechar lo mejor de cada tecnología sin dolores de cabeza.'
  },
  {
    question: '¿Cuánto tiempo tarda en generar resultados?',
    answer: 'Nos comprometemos a que veas resultados en 90 días. Si en 30 días no estás satisfecho, te devolvemos tu dinero. Nuestro modelo está diseñado para acelerar tus procesos desde el primer mes y escalar contigo sin límites.'
  },
  {
    question: '¿Qué pasa con la seguridad de mis datos?',
    answer: 'La seguridad empresarial es una prioridad. Cumplimos con las normativas de protección de datos y utilizamos cifrado de primer nivel para proteger tu información. Nuestro equipo se encarga de mantener tus procesos seguros mientras tú duermes.'
  },
  {
    question: '¿Es Simiriki escalable cuando mi negocio crezca?',
    answer: 'Sí. Uno de nuestros pilares es la escalabilidad sin límites. Puedes crecer 10× sin contratar más personal ni aumentar tus gastos operativos. El sistema se adapta a tu ritmo de crecimiento para que no te quedes corto.'
  },
  {
    question: '¿Cómo empiezo?',
    answer: 'Solo tienes que reservar una consulta gratuita desde nuestro sitio y un especialista evaluará tus procesos. En esa llamada definimos un plan de acción a medida y te mostramos cómo Simiriki puede transformar tu negocio. No hay compromiso; preferimos que nos pruebes y decidas por los resultados.'
  },
];

export default function FAQPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((item, index) => (
          <details key={index} className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-md shadow-sm">
            <summary className="cursor-pointer font-medium text-lg">{item.question}</summary>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{item.answer}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
