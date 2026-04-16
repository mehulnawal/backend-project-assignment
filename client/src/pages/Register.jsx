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
            const msg = err.response?.data?.message || 'Registration failed'
            toast.error(msg)
        } finally {
            setLoading(false)
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
                    <p className="text-zinc-500 text-sm mt-1">Create your account</p>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm bg-zinc-50 focus:bg-white focus:border-zinc-400 transition-all"
                            />
                        </div>

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
                                placeholder="Min 6 chars, 1 upper, 1 number"
                                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm bg-zinc-50 focus:bg-white focus:border-zinc-400 transition-all"
                            />
                            <p className="text-xs text-zinc-400 mt-1.5">Must include uppercase, lowercase and a number</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-zinc-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-zinc-900 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register