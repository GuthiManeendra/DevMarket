import { useId } from 'react'
import { FaSearch } from 'react-icons/fa'

function TextInput({ label, id, ...props }) {
  const generatedId = useId()
  const inputId = id || generatedId
  return (
    <div>
      {label && <label className="form-label fw-semibold" htmlFor={inputId}>{label}</label>}
      <input className="dm-input" id={inputId} {...props} />
    </div>
  )
}

function PasswordInput(props) {
  return <TextInput autoComplete="current-password" type="password" {...props} />
}

function SearchInput({ label = 'Search', ...props }) {
  return (
    <div className="position-relative">
      <TextInput aria-label={label} placeholder={label} {...props} />
      <FaSearch aria-hidden="true" className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
    </div>
  )
}

function SelectInput({ label, id, options = [], ...props }) {
  const generatedId = useId()
  const inputId = id || generatedId
  return (
    <div>
      {label && <label className="form-label fw-semibold" htmlFor={inputId}>{label}</label>}
      <select className="dm-input" id={inputId} {...props}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  )
}

export { PasswordInput, SearchInput, SelectInput, TextInput }
