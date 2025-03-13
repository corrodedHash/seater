import { UserManagement } from "./services/user.mjs"
import express from 'express'

/**
 * @param {UserManagement} [users]
 */
export function matches() {
    const app = express.Router()

    app.get("/", (req, res) => {
        res.json(res.locals.matches)
    })

    app.put('/', (req, res) => {
        if (!res.locals.room.admins.includes(res.locals.user.id)) {
            res.status(401)
            res.end()
            return
        }
        res.locals.matches = req.body
        res.end()
    })

    return app
}
