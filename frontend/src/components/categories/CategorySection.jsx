import {
  FaBrain,
  FaCloud,
  FaCode,
  FaCubes,
  FaDatabase,
  FaJava,
  FaLock,
  FaMicrochip,
  FaPython,
  FaRobot,
  FaStackOverflow,
} from 'react-icons/fa'
import SectionHeading from '../common/SectionHeading'
import CategoryCard from '../cards/CategoryCard'

const categories = [
  ['Artificial Intelligence', 'Build intelligent systems and practical AI solutions.', FaBrain],
  ['Machine Learning', 'Explore models, workflows, and applied learning projects.', FaRobot],
  ['Generative AI', 'Prototype the next wave of creative technology.', FaCubes],
  ['LLM Applications', 'Create useful products around language models.', FaStackOverflow],
  ['Python Development', 'Start with versatile, production-minded Python work.', FaPython],
  ['Java Development', 'Explore robust applications and backend foundations.', FaJava],
  ['Full Stack Development', 'Ship complete experiences from interface to API.', FaCode],
  ['React Development', 'Design responsive interfaces that feel considered.', FaCode],
  ['Data Science', 'Turn data into decisions, insights, and momentum.', FaDatabase],
  ['Cybersecurity', 'Learn patterns for safer digital systems.', FaLock],
  ['Internet of Things', 'Connect software to the physical world.', FaMicrochip],
  ['Cloud Computing', 'Build foundations that are ready to scale.', FaCloud],
]

function CategorySection() {
  return (
    <section className="dm-section" id="categories">
      <div className="dm-container">
        <SectionHeading
          description="Discover practical and ready-to-use projects across modern technology domains."
          eyebrow="Explore the marketplace"
          title="Explore projects by technology"
        />
        <div className="row g-3">
          {categories.map(([name, description, Icon]) => (
            <div className="col-6 col-md-4 col-lg-3" key={name}>
              <CategoryCard icon={<Icon size={22} />} name={name} description={description} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
