import { Link } from 'react-router-dom'

function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb dm-breadcrumb">
        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
        {items.map((item, index) => (
          <li className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`} key={item.label}>
            {item.to && index !== items.length - 1 ? <Link to={item.to}>{item.label}</Link> : item.label}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function PageHeader({ eyebrow, title, description, children, breadcrumbs }) {
  return (
    <header className="dm-page-header">
      <div className="dm-container">
        {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
        <div className="dm-eyebrow">{eyebrow}</div>
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-4">
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {children}
        </div>
      </div>
    </header>
  )
}

export { Breadcrumb, PageHeader }
