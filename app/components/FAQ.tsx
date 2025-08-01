'use client';

export default function FAQ() {
  return (
    <section id="faq" className="max-w-3xl mx-auto py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        <details className="p-4 border rounded-md">
          <summary className="font-semibold cursor-pointer">What is Simiriki?</summary>
          <p className="mt-2">Simiriki provides AI-powered solutions to help you make smarter decisions.</p>
        </details>
        <details className="p-4 border rounded-md">
          <summary className="font-semibold cursor-pointer">How do I get started?</summary>
          <p className="mt-2">Contact us via the form below and our team will reach out.</p>
        </details>
      </div>
    </section>
  );
}
