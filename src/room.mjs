import express from "express";
import { UserManagement } from "./services/user.mjs";
/** @import {User, Room} from './exchangeData' */
import { RoomManagement } from "./services/room.mjs";
import { userRoomAuth } from "./middleware.mjs";
import { matches } from "./matches.mjs";

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

    app.use('/matches', matches())
    return app
}

/**
 * 
 * @param {RoomManagement} rooms
 * @param {UserManagement} users
 */
export function roomPath(rooms, users) {
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