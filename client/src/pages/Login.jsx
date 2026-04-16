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
            toast.success('Logged in successfully')
            navigate('/dashboard')
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed'
            toast.error(msg)
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
            const msg = err.response?.data?.message || 'Google login failed'
            toast.error(msg)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 rounded-xl mb-4">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                            <path stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900">TaskFlow</h1>
                    <p className="text-zinc-500 text-sm mt-1">Sign in to your account</p>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm bg-zinc-50 focus:bg-white focus:border-zinc-400 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Your password"
                                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm bg-zinc-50 focus:bg-white focus:border-zinc-400 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-zinc-100" />
                        <span className="text-xs text-zinc-400">or</span>
                        <div className="flex-1 h-px bg-zinc-100" />
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google login failed')}
                            theme="outline"
                            shape="rectangular"
                            width="100%"
                        />
                    </div>

                    <p className="text-center text-sm text-zinc-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-zinc-900 font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login