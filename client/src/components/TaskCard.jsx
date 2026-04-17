function TaskCard({ task, onEdit, onDelete, deleting }) {
    const date = new Date(task.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    return (
        <div className="task-card fade-up">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <h3 style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--text-1)',
                    lineHeight: '1.4',
                    textTransform: 'capitalize',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1,
                }}>
                    {task.title}
                </h3>
                <span className="dot" style={{ marginTop: '5px' }} />
            </div>

            <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-2)',
                lineHeight: '1.6',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
            }}>
                {task.description}
            </p>

            <div className="task-card-footer">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{date}</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button className="btn btn-ghost btn-sm" onClick={onEdit}>
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                    </button>

                    <button
                        className="btn btn-danger-ghost btn-sm"
                        onClick={onDelete}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <>
                                <svg style={{ animation: 'spin 0.8s linear infinite' }} width="13" height="13" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="10" />
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            <>
                                <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                        d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                                </svg>
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TaskCard