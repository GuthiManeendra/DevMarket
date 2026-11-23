const questions = [
  ['What is Repohaus?', 'Repohaus is a digital marketplace planned for developer projects, portfolios, and related support services.'],
  ['What types of projects are available?', 'The planned marketplace will cover academic, AI, machine learning, Python, Java, full stack, data science, cybersecurity, IoT, and cloud projects.'],
  ['Can I preview projects before purchasing?', 'Yes. Product previews are part of the planned marketplace experience.'],
  ['What files are included with a project?', 'The exact files and documentation will be listed on each product detail page and may vary by product.'],
  ['How can I purchase a portfolio?', 'Portfolio purchasing will be available through a future secure checkout flow.'],
  ['When can I download purchased files?', 'Download access will be provided after a successful purchase is verified.'],
  ['What payment methods are supported?', 'Payment methods will be confirmed when the payment integration is implemented.'],
  ['Can I request portfolio customization?', 'Customization and technical support are planned services for a later phase.'],
  ['How can I contact support?', 'A dedicated contact and support flow will be connected in a future phase.'],
  ['What is the refund policy?', 'The final refund policy will be published before purchases are enabled.'],
]

function FAQ() {
  return (
    <section className="dm-section" id="faq">
      <div className="dm-container dm-container--narrow">
        <div className="text-center dm-section-heading">
          <div className="dm-eyebrow">Questions, answered</div>
          <h2>Frequently asked questions</h2>
          <p className="mx-auto">Clear expectations are part of a good product experience.</p>
        </div>
        <div className="accordion dm-faq" id="faq-accordion">
          {questions.map(([question, answer], index) => (
            <div className="accordion-item" key={question}>
              <h3 className="accordion-header">
                <button
                  aria-controls={`faq-answer-${index}`}
                  aria-expanded={index === 0}
                  className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                  data-bs-target={`#faq-answer-${index}`}
                  data-bs-toggle="collapse"
                  type="button"
                >
                  {question}
                </button>
              </h3>
              <div className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#faq-accordion" id={`faq-answer-${index}`}>
                <div className="accordion-body">{answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
