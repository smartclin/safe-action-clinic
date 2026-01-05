// src/app/(public)/hipaa/_components/faq-section.tsx

const faqs = [
    {
        question: 'Is your platform HIPAA-compliant?',
        answer: 'Yes, our platform is designed to be HIPAA-compliant. We implement all required administrative, physical, and technical safeguards. We also sign Business Associate Agreements with our healthcare provider customers.'
    },
    {
        question: 'Where is patient data stored?',
        answer: 'All patient data is stored on HIPAA-compliant cloud infrastructure with data centers located in the United States. We use multiple availability zones for redundancy and disaster recovery.'
    },
    {
        question: 'What happens in case of a data breach?',
        answer: 'We have a comprehensive incident response plan that includes immediate investigation, notification procedures, and remediation steps. We will notify affected parties in accordance with HIPAA requirements.'
    }
];

export function FaqSection() {
    return (
        <section className='mt-12 border-gray-200 border-t pt-8'>
            <h2 className='mb-4 font-semibold text-2xl text-gray-800'>Frequently Asked Questions</h2>
            <div className='space-y-4'>
                {faqs.map(faq => (
                    <div
                        className='rounded-lg border border-gray-200 p-4'
                        key={faq.question}
                    >
                        <h3 className='mb-2 font-medium text-gray-900'>{faq.question}</h3>
                        <p className='text-gray-700'>{faq.answer}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
