function TaskCard({ task, onEdit, onDelete, deleting }) {
    const date = new Date(task.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    return (
        <div className="bg-white rounded-2xl border border-zinc-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-zinc-900 text-sm leading-snug capitalize line-clamp-2 flex-1">
                    {task.title}
                </h3>
                <span className="shrink-0 w-2 h-2 rounded-full bg-emerald-400 mt-1" />
            </div>

            <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                {task.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-50">
                <span className="text-xs text-zinc-400">{date}</span>

                <div className="flex items-center gap-1">
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-all"
                    >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                    </button>

                    <button
                        onClick={onDelete}
                        disabled={deleting}
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {deleting ? (
                            <svg className="animate-spin" width="13" height="13" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                        ) : (
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                    d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                            </svg>
                        )}
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TaskCard