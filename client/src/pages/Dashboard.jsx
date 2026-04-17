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
            toast.error(err.response?.data?.message || 'Failed to load tasks')
        } finally {
            dispatch(setLoading(false))
        }
    }

    useEffect(() => { fetchTasks() }, [])

    const handleDelete = async (id) => {
        setDeleteId(id)
        try {
            await api.delete(`/task/deleteTask/${id}`)
            dispatch(removeTask(id))
            toast.success('Task deleted')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed')
        } finally {
            setDeleteId(null)
        }
    }

    const handleLogout = async () => {
        try {
            await api.get('/auth/logout')
        } catch {
        } finally {
            dispatch(clearUser())
            toast.success('Logged out')
            navigate('/login')
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

            <header className="topbar">
                <div className="topbar-inner">
                    <div className="logo">
                        <div className="logo-icon">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                            </svg>
                        </div>
                        TaskFlow
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-2)', textTransform: 'capitalize' }}>
                                {user?.name}
                            </span>
                            {user?.userRole === 'admin' && (
                                <span className="badge">admin</span>
                            )}
                        </div>

                        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />

                        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="main-content">

                <div className="section-header">
                    <div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>My Tasks</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>
                            {loading ? 'Loading tasks...' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>

                    <button className="btn btn-primary" onClick={() => navigate('/task/create')}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M12 5v14M5 12h14" />
                        </svg>
                        New Task
                    </button>
                </div>

                {loading ? (
                    <div className="task-grid">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div className="skeleton" style={{ height: '16px', width: '70%' }} />
                                <div className="skeleton" style={{ height: '12px', width: '100%' }} />
                                <div className="skeleton" style={{ height: '12px', width: '80%' }} />
                                <div className="skeleton" style={{ height: '12px', width: '50%' }} />
                            </div>
                        ))}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                                <path stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 style={{ marginBottom: '8px', color: 'var(--text-1)' }}>No tasks yet</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginBottom: '24px' }}>
                            Create your first task to get started
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/task/create')}>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M12 5v14M5 12h14" />
                            </svg>
                            Create a task
                        </button>
                    </div>
                ) : (
                    <div className="task-grid">
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
            </div>
        </div>
    )
}

export default Dashboard