import { RoomManagement } from "./services/room.mjs"
import { UserManagement } from "./services/user.mjs"
import express from 'express'
/** @import {User, Room} from "./exchangeData" */

/**
 * 
 */
export function matches() {
    const app = express.Router()

    app.get("/", (req, res) => {
        res.json(res.locals.matches)
    })

    return app
}
