
import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import BrandLogo from '../components/common/BrandLogo'
import { PrimaryButton } from '../components/common/Buttons'
import SEO from '../components/seo/SEO'
import useMarketplace from '../context/useMarketplace'
import api from '../services/api'

function PasswordField({ id, label, value, onChange }) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label className="form-label fw-semibold" htmlFor={id}>
        {label}
      </label>

      <div className="position-relative">
        <input
          className="dm-input pe-5"
          id={id}
          minLength="8"
          onChange={onChange}
          required
          type={visible ? 'text' : 'password'}
          value={value}
        />

        <button
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="dm-password-toggle"
          onClick={() => setVisible(!visible)}
          type="button"
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  )
}

function AuthPages() {
  const location = useLocation()
  const navigate = useNavigate()

  const isRegister = location.pathname === '/register'

  const { user, login, authLoading } = useMarketplace()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  const [values, setValues] = useState({
    password: '',
    confirm: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const getRedirectPath = () => {
    const destination = location.state?.from

    if (!destination) return '/'

    const path = destination.pathname || '/'

    if (
      !path.startsWith('/') ||
      path.startsWith('//') ||
      path === '/login' ||
      path === '/register'
    ) {
      return '/'
    }

    return `${path}${destination.search || ''}${destination.hash || ''}`
  }

  useEffect(() => {
    if (!authLoading && user?.isLoggedIn) {
      navigate(getRedirectPath(), { replace: true })
    }
  }, [user, authLoading, navigate, location.state])

  const update = (key) => (event) => {
    setValues((current) => ({
      ...current,
      [key]: event.target.value,
    }))
  }

  const submit = async (event) => {
    event.preventDefault()

    const form = event.currentTarget

    if (!form.checkValidity()) {
      form.classList.add('was-validated')
      setError('Please complete all required fields correctly.')
      return
    }

    if (isRegister && values.password !== values.confirm) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const endpoint = isRegister
        ? '/auth/register/'
        : '/auth/login/'

      const payload = isRegister
        ? {
            full_name: fullName.trim(),
            email: email.trim(),
            password: values.password,
          }
        : {
            email: email.trim(),
            password: values.password,
          }

      // Django must verify the credentials first.
      const response = await api.post(endpoint, payload)

      const token = response.data?.token
      const authenticatedUser = response.data?.user

      // Reject incomplete or invalid authentication responses.
      if (!token || !authenticatedUser) {
        throw new Error('Invalid authentication response.')
      }

      // Only save login state after successful backend authentication.
      login(authenticatedUser, token)

      navigate(getRedirectPath(), { replace: true })

    } catch (err) {
      const message = err.response?.data?.message

      setError(
        Array.isArray(message)
          ? message.join(' ')
          : message || 'Invalid email or password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="dm-auth-page">
      <SEO noindex title={isRegister ? 'Create account' : 'Sign in'} />
      <div className="dm-auth-card">

        <Link to="/" state={{ from: location.state?.from }}>
          <BrandLogo />
        </Link>

        <div className="text-center mt-5 mb-4">
          <div className="dm-auth-icon">
            <FaLock aria-hidden="true" />
          </div>

          <h1>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h1>

          <p className="dm-muted">
            {isRegister
              ? 'Join Repohaus to explore and purchase verified projects.'
              : 'Sign in to access your Repohaus workspace.'}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form
          className="needs-validation"
          noValidate
          onSubmit={submit}
        >
          {isRegister && (
            <div className="mb-3">
              <label
                className="form-label fw-semibold"
                htmlFor="full-name"
              >
                Full name
              </label>

              <input
                className="dm-input"
                id="full-name"
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your name"
                required
                value={fullName}
              />
            </div>
          )}

          <div className="mb-3">
            <label
              className="form-label fw-semibold"
              htmlFor="auth-email"
            >
              Email
            </label>

            <input
              className="dm-input"
              id="auth-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
              type="email"
              value={email}
            />
          </div>

          <div className="mb-3">
            <PasswordField
              id="auth-password"
              label="Password"
              onChange={update('password')}
              value={values.password}
            />
          </div>

          {isRegister && (
            <div className="mb-3">
              <PasswordField
                id="auth-confirm"
                label="Confirm password"
                onChange={update('confirm')}
                value={values.confirm}
              />
            </div>
          )}

          {isRegister ? (
            <div className="form-check mb-4">
              <input
                className="form-check-input"
                id="terms"
                required
                type="checkbox"
              />

              <label
                className="form-check-label small"
                htmlFor="terms"
              >
                I agree to the Terms and Conditions.
              </label>
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  id="remember"
                  type="checkbox"
                />

                <label
                  className="form-check-label small"
                  htmlFor="remember"
                >
                  Remember me
                </label>
              </div>

              <button
                className="dm-text-button"
                type="button"
                onClick={() =>
                  setError('Password recovery is not configured yet.')
                }
              >
                Forgot password?
              </button>
            </div>
          )}

          <PrimaryButton
            className="w-100 py-2"
            disabled={loading}
            type="submit"
          >
            {loading
              ? 'Please wait...'
              : isRegister
                ? 'Create account'
                : 'Sign in'}
          </PrimaryButton>
        </form>

        <p className="text-center small dm-muted mt-4 mb-0">
          {isRegister
            ? 'Already have an account? '
            : 'New to Repohaus? '}

          <Link
            className="text-primary fw-semibold"
            to={isRegister ? '/login' : '/register'}
            state={{ from: location.state?.from }}
          >
            {isRegister ? 'Log in' : 'Register'}
          </Link>
        </p>

      </div>
    </main>
  )
}

export default AuthPages
