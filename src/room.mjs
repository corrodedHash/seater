import express from "express";
import { UserManagement } from "./services/user.mjs";
/** @import {User, Room} from './exchangeData.js' */
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

    /**
     * @param {any} req
     * @param {any} res
     * @param {() => void} next
     */
    function is_admin(req, res, next) {
        /** @type {User} */
        const admin_user = res.locals.user
        /** @type {Room} */
        const room = res.locals.room

        if (!room.admins.includes(admin_user.id)) {
            res.status(401).end()
            return
        }
        next()
    };

    app.put("/accept/:user_id", is_admin, (req, res) => {
        /** @type {Room} */
        const room = res.locals.room

        const user = users.get_user(req.params.user_id)

        const status = acceptUser(room, user);

        if (status !== 0) {
            res.status(status).end()
            return
        }
        res.end()

    })

    app.delete('/user/:user_id', is_admin, (req, res) => {
        /** @type {Room} */
        const room = res.locals.room

        const user = users.get_user(req.params.user_id)
        if (user === undefined) {
            res.status(400).end()
            return
        }
        deleteUser(room, user);
        res.end()
    })

    app.use('/matches', matches())
    return app
}

/**
 * @param {Room} room
 * @param {User} user
 */
function deleteUser(room, user) {
    room.users = room.users.filter((/** @type {string} */ x) => x !== user.id);
    user.rooms = user.rooms.filter((/** @type {string} */ x) => x !== room.id);
}

/**
 * @param {Room} room
 * @param {User} user
 */
function acceptUser(room, user) {
    const waiting_index = room.waiting_room.indexOf(user.id)
    if (waiting_index === -1) {
        return 400
    }

    const user_waiting_index = user.waiting_rooms.indexOf(room.id)
    if (user_waiting_index === -1) {
        return 500
    }
    room.waiting_room.splice(waiting_index, 1);
    user.waiting_rooms.splice(user_waiting_index, 1);
    room.users.push(user.id);
    user.rooms.push(room.id);
    return 0
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

        joinRoom(room, user);

        res.status(200)
        res.send("Done")
    })

    app.get('/', (req, res) => {
        /** @type {User} */
        const user = res.locals.user

        res.send(user.rooms.map(v => rooms.get_room(v)))
    })

    app.post("/", (req, res) => {
        res.status(200)
        res.json({ "id": rooms.create_room(res.locals.user) })
    })

    app.use("/:room_id", function roomIDExtractor(req, res, next) {
        /** @type {User} */
        const user = res.locals.user
        if (!user.rooms.includes(req.params.room_id)) {
            res.status(401).end()
            return
        }
        res.locals.room = rooms.get_room(req.params.room_id)
        next()
    }, roomModifiers(rooms, users))



    return app
}

/**
 * @param {Room} room
 * @param {User} user
 */
function joinRoom(room, user) {
    room.waiting_room.push(user.id);
    user.waiting_rooms.push(room.id);
}
