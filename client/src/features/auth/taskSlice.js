import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    tasks: [],
    loading: false,
}

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks: (state, action) => {
            state.tasks = action.payload
        },
        addTask: (state, action) => {
            state.tasks.unshift(action.payload)
        },
        updateTask: (state, action) => {
            const index = state.tasks.findIndex(t => t._id === action.payload._id)
            if (index !== -1) state.tasks[index] = action.payload
        },
        removeTask: (state, action) => {
            state.tasks = state.tasks.filter(t => t._id !== action.payload)
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
    },
})

export const { setTasks, addTask, updateTask, removeTask, setLoading } = taskSlice.actions
export default taskSlice.reducer