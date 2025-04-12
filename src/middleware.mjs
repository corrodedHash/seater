import { UserManagement } from "./services/user.mjs"

/**
 * @param {UserManagement} users
 */
export function userRoomAuth(users) {
    return function userAuth(
        req, res,
        /** @type {() => void} */ next) {
        const u = users.match(req)
        if (u === undefined) {
            res.status(401).end()
            return
        }
        res.locals.user = u
        next()
    }
}
