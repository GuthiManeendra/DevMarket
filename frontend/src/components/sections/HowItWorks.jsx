import { FaArrowRight, FaDownload, FaEye, FaLock, FaSearch, FaShoppingBag } from 'react-icons/fa'
import SectionHeading from '../common/SectionHeading'

const steps = [
  ['01', 'Explore the marketplace', 'Browse projects and portfolios by the technology or outcome you need.', FaSearch],
  ['02', 'Preview your product', 'Understand the direction and experience before you make a decision.', FaEye],
  ['03', 'Choose your package', 'Compare the right format for your learning, portfolio, or build.', FaShoppingBag],
  ['04', 'Complete secure payment', 'A clear checkout journey is planned for the next phase of the product.', FaLock],
  ['05', 'Unlock your purchase', 'Access will be connected to verified purchase records.', FaArrowRight],
  ['06', 'Download and start building', 'Get the files and documentation needed to move forward.', FaDownload],
]

function HowItWorks() {
  return (
    <section className="dm-section" id="how-it-works">
      <div className="dm-container">
        <SectionHeading
          description="A clear path from first look to first commit."
          eyebrow="The journey"
          title="From discovery to download"
        />
        <div className="dm-process">
          {steps.map(([number, title, description, Icon]) => (
            <div className="dm-process__step" key={number}>
              <div className="dm-process__number">{number}</div>
              <div className="dm-process__icon"><Icon aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
