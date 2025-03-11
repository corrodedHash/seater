import express from "express";
import { UserManagement } from "./services/user.mjs";
import { RoomManagement } from "./services/room.mjs";
import cookieParser from 'cookie-parser'
import { userRoomAuth } from "./middleware.mjs";
import { roomPath } from "./room.mjs";


export default function startApp() {
    const app = express()
    const rooms = new RoomManagement();
    const users = new UserManagement();

    app.use(cookieParser())

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.get('/user', userRoomAuth(users), (req, res) => {
        res.json(res.locals.user)
    })

    app.get('/token', (req, res) => {
        const { user, token } = users.create_user()
        res.cookie('user_id', user.id, { httpOnly: false })
            .cookie('token', token, { httpOnly: true })
            .status(200)
            .end()
    })

    app.use('/room', roomPath(rooms, users))


    return app
}

