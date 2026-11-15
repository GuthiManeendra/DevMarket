import { useState } from 'react'
import { FaCheckCircle, FaEnvelope } from 'react-icons/fa'
import { PageHeader } from '../components/common/PageHeader'
import { PrimaryButton } from '../components/common/Buttons'
import SiteShell from '../layouts/SiteShell'
import SEO from '../components/seo/SEO'
import { breadcrumbJsonLd } from '../utils/seo'

function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const submit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.classList.add('was-validated')
      setError('Please complete the required fields.')
      return
    }
    setError('')
    setSubmitted(true)
  }
  return (
    <SiteShell>
      <SEO
        description="Contact DevMarket for questions about software projects, portfolio templates, purchases, and technical support."
        jsonLd={breadcrumbJsonLd([{ label: 'Home', to: '/' }, { label: 'Contact', to: '/contact' }])}
        path="/contact"
        title="Contact DevMarket"
      />
      <PageHeader breadcrumbs={[{ label: 'Contact' }]} description="Have a question about a future product, a portfolio, or support? Send a message and we will connect this form to the support workflow later." eyebrow="Let’s talk" title="Contact DevMarket" />
      <main className="dm-section pt-4"><div className="dm-container"><div className="row g-5"><div className="col-lg-5"><div className="dm-contact-aside"><FaEnvelope className="text-primary mb-4" size={28} /><h2 className="h3">A thoughtful answer starts with the right context.</h2><p className="dm-muted">This is a frontend-only contact experience. No message is sent until the backend support endpoint is connected.</p><div className="dm-contact-placeholder"><strong>Contact information</strong><span>Official email and support details will be published here.</span></div></div></div><div className="col-lg-7"><form className="dm-card p-4 p-md-5 needs-validation" noValidate onSubmit={submit}>{submitted && <div className="alert alert-success"><FaCheckCircle aria-hidden="true" className="me-2" />Demo submission recorded locally. No message was sent.</div>}{error && <div className="alert alert-danger">{error}</div>}<div className="row g-3"><div className="col-md-6"><label className="form-label fw-semibold" htmlFor="contact-name">Name</label><input className="dm-input" id="contact-name" required /></div><div className="col-md-6"><label className="form-label fw-semibold" htmlFor="contact-email">Email</label><input className="dm-input" id="contact-email" required type="email" /></div><div className="col-12"><label className="form-label fw-semibold" htmlFor="contact-subject">Subject</label><input className="dm-input" id="contact-subject" required /></div><div className="col-12"><label className="form-label fw-semibold" htmlFor="contact-message">Message</label><textarea className="dm-input" id="contact-message" required rows="6" /></div><div className="col-12"><PrimaryButton type="submit">Submit demo message</PrimaryButton></div></div></form></div></div></div></main>
    </SiteShell>
  )
}

export default ContactPage
