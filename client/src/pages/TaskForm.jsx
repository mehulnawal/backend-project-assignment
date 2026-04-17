import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../api/axiosInstance'
import { addTask, updateTask } from '../features/tasks/taskSlice'

function TaskForm() {
    const { id } = useParams()
    const isEdit = Boolean(id)

    const [form, setForm] = useState({ title: '', description: '' })
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const tasks = useSelector((state) => state.tasks.tasks)

    useEffect(() => {
        if (isEdit) {
            const existing = tasks.find((t) => t._id === id)
            if (existing) {
                setForm({ title: existing.title, description: existing.description })
            } else {
                toast.error('Task not found')
                navigate('/dashboard')
            }
        }
    }, [id])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.title.trim() || !form.description.trim()) {
            toast.error('Both fields are required')
            return
        }
        if (form.title.trim().length < 3) {
            toast.error('Title must be at least 3 characters')
            return
        }
        if (!/^[a-zA-Z- ]+$/.test(form.title.trim())) {
            toast.error('Title can only contain letters, hyphens and spaces')
            return
        }
        if (form.description.trim().length < 5) {
            toast.error('Description must be at least 5 characters')
            return
        }

        setLoading(true)
        try {
            if (isEdit) {
                const res = await api.patch(`/task/updateTask/${id}`, form)
                dispatch(updateTask(res.data.data))
                toast.success('Task updated')
            } else {
                const res = await api.post('/task/createTask', form)
                dispatch(addTask(res.data.data))
                toast.success('Task created')
            }
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

            <header className="topbar">
                <div className="topbar-inner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')}>
                            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                    d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
                        <div className="logo">
                            <div className="logo-icon">
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                    <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                                </svg>
                            </div>
                            TaskFlow
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: '560px', margin: '0 auto', padding: '48px 24px' }}>

                <div style={{ marginBottom: '28px' }}>
                    <h1 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>
                        {isEdit ? 'Edit Task' : 'Create Task'}
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>
                        {isEdit ? 'Update the details of your task' : 'Add a new task to your list'}
                    </p>
                </div>

                <div className="card fade-up" style={{ padding: '28px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div className="field">
                            <label>Title</label>
                            <input
                                className="input"
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Fix login bug"
                            />
                            <span className="hint">Letters, hyphens, and spaces only</span>
                        </div>

                        <div className="field">
                            <label>Description</label>
                            <textarea
                                className="input"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the task in detail..."
                                rows={5}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                            <button
                                type="button"
                                className="btn btn-outline"
                                style={{ flex: 1 }}
                                onClick={() => navigate('/dashboard')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg style={{ animation: 'spin 0.8s linear infinite' }} width="14" height="14" fill="none" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="10" />
                                        </svg>
                                        {isEdit ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : isEdit ? 'Update Task' : 'Create Task'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default TaskForm