import { configureStore } from '@reduxjs/toolkit'
import roomReducer from './store/room'
import userReducer from './store/user'
import waitingRoomReducer from './store/waiting_room'

const store = configureStore({
    reducer: {
        waiting_room: waitingRoomReducer,
        room: roomReducer,
        user: userReducer,
    }
})
export default store
// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']