import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axiosInstance'

function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.email || !form.password) {
            toast.error('Please fill in all fields')
            return
        }
        setLoading(true)
        try {
            await api.post('/auth/register', form)
            toast.success('Account created! Please log in.')
            navigate('/login')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
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
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Create account</h1>
                    <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Get started with TaskFlow</p>
                </div>

                <div className="auth-card fade-up">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        <div className="field">
                            <label>Full name</label>
                            <input
                                className="input"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                            />
                        </div>

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
                                placeholder="Min 6 chars, 1 uppercase, 1 number"
                            />
                            <span className="hint">Must include uppercase, lowercase, and a number</span>
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
                                    Creating account...
                                </>
                            ) : 'Create account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-3)', marginTop: '24px' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--text-1)', fontWeight: 600 }}>
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Register