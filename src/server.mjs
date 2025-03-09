import express from "express";
import { UserManagement } from "./services/user.mjs";
/** @import {User, Room} from './exchangeData' */
import { RoomManagement } from "./services/room.mjs";
import cookieParser from 'cookie-parser'


/**
 * 
 * @param {RoomManagement} rooms
 * @param {UserManagement} users
 */

function roomModifiers(rooms, users) {
    const app = express.Router()

    app.get("/", (req, res) => {
        // TODO: Do not send back all of room info, censor users down to only id
        res.send(res.locals.room)
    })


    app.put("/accept/:user_id", (req, res) => {
        /** @type {User} */
        const admin_user = res.locals.user
        /** @type {Room} */
        const room = res.locals.room

        if (!room.admins.includes(admin_user.id)) {
            res.status(401).end()
            return
        }
        const user = users.get_user(req.params.user_id)
        const waiting_index = room.waiting_room.indexOf(user.id)
        if (waiting_index === -1) {
            res.status(400).end()
            return
        }
        const user_waiting_index = user.waiting_rooms.indexOf(room.id)
        if (user_waiting_index === -1) {
            res.status(500).end()
            return
        }
        room.waiting_room.splice(waiting_index, 1)
        user.waiting_rooms.splice(user_waiting_index, 1)
        room.users.push(user.id)
        user.rooms.push(room.id)
        res.end()

    })
    return app
}

/**
 * @param {UserManagement} users
 */
function userRoomAuth(users) {
    return function userAuth(req, res, next) {
        const u = users.match(req)
        if (u === undefined) {
            res.status(401).end()
            return
        }
        res.locals.user = u
        next()
    }
}

/**
 * 
 * @param {RoomManagement} rooms
 * @param {UserManagement} users
 */
function roomPath(rooms, users) {
    const app = express.Router()

    app.use(userRoomAuth(users))

    app.put('/join/:room_id', (req, res) => {
        /** @type {User} */
        const user = res.locals.user
        if (user.rooms.includes(req.params.room_id) || user.waiting_rooms.includes(req.params.room_id)) {
            res.status(204).end();
            return
        }
        const room = rooms.get_room(req.params.room_id)
        if (room === undefined) {
            res.status(400).end();
            return
        }

        room.waiting_room.push(user.id)
        user.waiting_rooms.push(req.params.room_id)

        res.status(200)
        res.send("Done")
    })

    app.get('/', (req, res) => {
        /** @type {User} */
        const user = res.locals.user
        res.send(rooms.get_rooms().filter(v => user.rooms.includes(v.id)))
    })

    app.post("/", (req, res) => {
        res.status(200)
        res.json({ "id": rooms.create_room(res.locals.user) })
    })

    app.use("/:room_id", function roomIDExtractor(req, res, next) {
        /** @type {User} */
        const user = res.locals.user
        if (!user.rooms.includes(req.params.room_id)) {
            res.status(404).end()
            return
        }
        res.locals.room = rooms.get_room(req.params.room_id)
        next()
    }, roomModifiers(rooms, users))



    return app
}

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

