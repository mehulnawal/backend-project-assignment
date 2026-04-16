import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axiosInstance'
import { setTasks, removeTask, setLoading } from '../features/tasks/taskSlice'
import { clearUser } from '../features/auth/authSlice'
import TaskCard from '../components/TaskCard'

function Dashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { tasks, loading } = useSelector((state) => state.tasks)
    const { user } = useSelector((state) => state.auth)
    const [deleteId, setDeleteId] = useState(null)

    const fetchTasks = async () => {
        dispatch(setLoading(true))
        try {
            const res = await api.get('/task/allOwnTask')
            dispatch(setTasks(res.data.data))
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to fetch tasks'
            toast.error(msg)
        } finally {
            dispatch(setLoading(false))
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const handleDelete = async (id) => {
        setDeleteId(id)
        try {
            await api.delete(`/task/deleteTask/${id}`)
            dispatch(removeTask(id))
            toast.success('Task deleted')
        } catch (err) {
            const msg = err.response?.data?.message || 'Delete failed'
            toast.error(msg)
        } finally {
            setDeleteId(null)
        }
    }

    const handleLogout = async () => {
        try {
            await api.get('/auth/logout')
            dispatch(clearUser())
            toast.success('Logged out')
            navigate('/login')
        } catch {
            dispatch(clearUser())
            navigate('/login')
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50">

            <header className="bg-white border-b border-zinc-100 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                            </svg>
                        </div>
                        <span className="font-bold text-zinc-900 text-lg">TaskFlow</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-semibold text-zinc-700 uppercase">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <span className="text-sm text-zinc-600 capitalize">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-100"
                        >
                            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900">My Tasks</h2>
                        <p className="text-sm text-zinc-400 mt-0.5">
                            {loading ? 'Loading...' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} total`}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/task/create')}
                        className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-colors"
                    >
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 5v14M5 12h14" />
                        </svg>
                        New Task
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-white rounded-2xl border border-zinc-100 p-5 animate-pulse">
                                <div className="h-4 bg-zinc-100 rounded w-3/4 mb-3" />
                                <div className="h-3 bg-zinc-100 rounded w-full mb-2" />
                                <div className="h-3 bg-zinc-100 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                                <path stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-zinc-700 font-semibold mb-1">No tasks yet</h3>
                        <p className="text-zinc-400 text-sm mb-6">Create your first task to get started</p>
                        <button
                            onClick={() => navigate('/task/create')}
                            className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-colors"
                        >
                            Create a task
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={() => navigate(`/task/edit/${task._id}`)}
                                onDelete={() => handleDelete(task._id)}
                                deleting={deleteId === task._id}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Dashboard