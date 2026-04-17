import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import api from '../api/axiosInstance'
import { setUser } from '../features/auth/authSlice'

function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.email || !form.password) {
            toast.error('Please fill in all fields')
            return
        }
        setLoading(true)
        try {
            const res = await api.post('/auth/login', form)
            dispatch(setUser(res.data.data))
            toast.success('Welcome back!')
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await api.post('/auth/google/login', {
                token: credentialResponse.credential,
            })
            dispatch(setUser(res.data.data))
            toast.success('Logged in with Google')
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Google login failed')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">

                <div className="auth-header">
                    <div className="auth-logo">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                            <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>TaskFlow</h1>
                    <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Sign in to your account</p>
                </div>

                <div className="auth-card fade-up">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        <div className="field">
                            <label>Email address</label>
                            <input
                                className="input"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="field">
                            <label>Password</label>
                            <input
                                className="input"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Your password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={loading}
                            style={{ marginTop: '4px' }}
                        >
                            {loading ? (
                                <>
                                    <svg className="spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="10" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : 'Sign in'}
                        </button>
                    </form>

                    <div className="divider">or</div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google login failed')}
                            theme="outline"
                            shape="rectangular"
                            width="360"
                        />
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-3)', marginTop: '24px' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--text-1)', fontWeight: 600 }}>
                            Sign up
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Login