import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export const waitingRoomSlice = createSlice({
    name: 'waitingRoom',
    initialState: {
        value: [] as string[]
    },
    reducers: {
        addWaitingRoom: (state, action: PayloadAction<string>) => {
            state.value.push(action.payload)
        },
        setWaitingRooms: (state, action: PayloadAction<string[]>) => {
            state.value = action.payload
        }
    }
})

export const { addWaitingRoom, setWaitingRooms } = waitingRoomSlice.actions

export default waitingRoomSlice.reducer