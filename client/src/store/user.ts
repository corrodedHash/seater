import { createSlice, PayloadAction } from '@reduxjs/toolkit'



export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: ""
    },
    reducers: {
        setUserID: (state, action: PayloadAction<string>) => {
            state.value = action.payload
        },
    }
})

export const { setUserID } = userSlice.actions

export default userSlice.reducer