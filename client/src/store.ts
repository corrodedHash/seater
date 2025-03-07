import { configureStore } from '@reduxjs/toolkit'
import roomReducer from './store/room'

export default configureStore({
    reducer: {
        room: roomReducer
    }
})