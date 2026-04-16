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
            const msg = err.response?.data?.message || 'Something went wrong'
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50">

            <header className="bg-white border-b border-zinc-100">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <div className="w-px h-4 bg-zinc-200" />
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                                <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                            </svg>
                        </div>
                        <span className="font-bold text-zinc-900">TaskFlow</span>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-zinc-900">
                        {isEdit ? 'Edit Task' : 'Create Task'}
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        {isEdit ? 'Update your task details below' : 'Fill in the details to create a new task'}
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Fix login bug"
                                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm bg-zinc-50 focus:bg-white focus:border-zinc-400 transition-all"
                            />
                            <p className="text-xs text-zinc-400 mt-1.5">Only letters, hyphens and spaces allowed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the task in detail..."
                                rows={5}
                                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm bg-zinc-50 focus:bg-white focus:border-zinc-400 transition-all resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 py-2.5 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? isEdit ? 'Updating...' : 'Creating...'
                                    : isEdit ? 'Update Task' : 'Create Task'
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default TaskForm