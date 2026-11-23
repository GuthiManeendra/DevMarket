import { FaBookOpen, FaHeadset, FaLock, FaMagic, FaRegLightbulb, FaWallet } from 'react-icons/fa'
import SectionHeading from '../common/SectionHeading'

const benefits = [
  ['Ready-to-use projects', 'Start with a clear foundation and spend more time learning and building.', FaRegLightbulb],
  ['Professional portfolios', 'Present your work with a visual system built for the developer journey.', FaMagic],
  ['Transparent pricing', 'Make informed decisions with straightforward product information.', FaWallet],
  ['Secure purchase flow', 'A future-ready foundation for safe checkout and verified access.', FaLock],
  ['Documentation support', 'Set up confidently with clear product documentation and guidance.', FaBookOpen],
  ['Technical assistance', 'Have a path to support when your build needs another perspective.', FaHeadset],
]

function WhyChooseUs() {
  return (
    <section className="dm-section dm-section--dark">
      <div className="dm-container">
        <SectionHeading
          description="A focused ecosystem for people who are learning, shipping, and growing in technology."
          eyebrow="Why Repohaus"
          title="Everything you need to build and grow"
        />
        <div className="row g-4">
          {benefits.map(([title, description, Icon]) => (
            <div className="col-md-6 col-lg-4" key={title}>
              <div className="dm-benefit">
                <div className="dm-benefit__icon"><Icon aria-hidden="true" /></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
