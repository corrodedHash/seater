import { createSlice } from '@reduxjs/toolkit'


interface RoomSummary {
    id: string
    player_count: number
    waiting_count: number
}

export const roomSlice = createSlice({
    name: 'room',
    initialState: {
        value: [] as RoomSummary[]
    },
    reducers: {
        addRoom: (state, action) => {
            state.value.push(action.payload)
        },
        setRooms: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { addRoom, setRooms } = roomSlice.actions

export default roomSlice.reducer