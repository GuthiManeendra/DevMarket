import { useEffect, useState } from 'react'
import { FaCode } from 'react-icons/fa'
import { fetchProjectCategories } from '../../services/projectService'
import SectionHeading from '../common/SectionHeading'
import CategoryCard from '../cards/CategoryCard'

function CategorySection() {
  const [categories, setCategories] = useState([])
  useEffect(() => {
    fetchProjectCategories().then((data) => setCategories(data.results || data)).catch(() => setCategories([]))
  }, [])
  return (
    <section className="dm-section" id="categories">
      <div className="dm-container">
        <SectionHeading
          description="Discover practical and ready-to-use projects across modern technology domains."
          eyebrow="Explore the marketplace"
          title="Explore projects by technology"
        />
        <div className="row g-3">
          {categories.length > 0 ? categories.map((category) => (
            <div className="col-6 col-md-4 col-lg-3" key={category.id}>
              <CategoryCard icon={<FaCode size={22} />} name={category.name} description={category.description || 'Explore projects in this technology domain.'} />
            </div>
          )) : <div className="col-12"><div className="dm-card p-4"><p className="dm-muted mb-0">Project categories will appear here when the catalog is available.</p></div></div>}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
