import React from 'react';

export const metadata = {
  title: 'FAQs | Simiriki',
  description: 'Frequently Asked Questions about Simiriki digital transformation consultancy',
};

const faqs = [
  {
    question: 'What services does Simiriki provide?',
    answer: 'We specialize in digital transformation, including strategy, automation, AI integration, and cloud deployment.'
  },
  {
    question: 'How can I get in touch with Simiriki?',
    answer: 'Fill out the contact form on our website or email us at hello@simiriki.com.'
  },
  {
    question: 'Do you work with international clients?',
    answer: 'Yes. Although we are based in Mexico, we serve clients across the globe.'
  },
  {
    question: 'What industries do you focus on?',
    answer: 'We work across multiple industries, with particular expertise in finance, manufacturing, and professional services.'
  }
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
