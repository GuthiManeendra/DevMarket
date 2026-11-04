import { useState } from 'react'
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import BrandLogo from '../components/common/BrandLogo'
import { PrimaryButton } from '../components/common/Buttons'

function PasswordField({ id, label, value, onChange }) {
  const [visible, setVisible] = useState(false)
  return <div><label className="form-label fw-semibold" htmlFor={id}>{label}</label><div className="position-relative"><input className="dm-input pe-5" id={id} minLength="8" onChange={onChange} required type={visible ? 'text' : 'password'} value={value} /><button aria-label={visible ? 'Hide password' : 'Show password'} className="dm-password-toggle" onClick={() => setVisible(!visible)} type="button">{visible ? <FaEyeSlash /> : <FaEye />}</button></div></div>
}

function AuthPages() {
  const isRegister = useLocation().pathname === '/register'
  const [values, setValues] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const update = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.classList.add('was-validated')
      setError('Please complete the required fields.')
    } else if (isRegister && values.password !== values.confirm) setError('Passwords do not match.')
    else {
      setError('')
      setSubmitted(true)
    }
  }
  return <main className="dm-auth-page"><div className="dm-auth-card"><Link to="/"><BrandLogo /></Link><div className="text-center mt-5 mb-4"><div className="dm-auth-icon"><FaLock aria-hidden="true" /></div><h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1><p className="dm-muted">{isRegister ? 'Prepare your DevMarket workspace.' : 'Sign in when authentication is connected.'}</p></div>{submitted && <div className="alert alert-info">Demo form accepted locally. No account or session was created.</div>}{error && <div className="alert alert-danger">{error}</div>}<form className="needs-validation" noValidate onSubmit={submit}>{isRegister && <div className="mb-3"><label className="form-label fw-semibold" htmlFor="full-name">Full name</label><input className="dm-input" id="full-name" required /></div>}<div className="mb-3"><label className="form-label fw-semibold" htmlFor="auth-email">Email</label><input className="dm-input" id="auth-email" required type="email" /></div><div className="mb-3"><PasswordField id="auth-password" label="Password" onChange={update('password')} value={values.password} /></div>{isRegister && <div className="mb-3"><PasswordField id="auth-confirm" label="Confirm password" onChange={update('confirm')} value={values.confirm} /></div>}{isRegister ? <div className="form-check mb-4"><input className="form-check-input" id="terms" required type="checkbox" /><label className="form-check-label small" htmlFor="terms">I agree to the Terms and Conditions.</label></div> : <div className="d-flex justify-content-between align-items-center mb-4"><div className="form-check"><input className="form-check-input" id="remember" type="checkbox" /><label className="form-check-label small" htmlFor="remember">Remember me</label></div><button className="dm-text-button" type="button">Forgot password?</button></div>}<PrimaryButton className="w-100" type="submit">{isRegister ? 'Create demo account' : 'Sign in'}</PrimaryButton></form><p className="text-center small dm-muted mt-4 mb-0">{isRegister ? 'Already have an account? ' : 'New to DevMarket? '}<Link className="text-primary fw-semibold" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Register'}</Link></p></div></main>
}

export default AuthPages
