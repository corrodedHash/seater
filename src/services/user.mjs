import * as crypto from "node:crypto";

/** @import {Request} from 'express' */
/** @import { User } from '../exchangeData' */


export class UserManagement {
    /** @type User[] */
    #users = []
    /** @type Record<string, string> */
    #tokens = {}

    create_user() {
        const new_user_id = crypto.randomUUID()
        const token = crypto.randomUUID()
        const user = { id: new_user_id, rooms: [], waiting_rooms: [] }
        this.#users.push(user);
        this.#tokens[new_user_id] = token;
        return {user, token}
    }

    get_user(user_id){
        return this.#users.find(v=> v.id === user_id)
    }

    /**
     * 
     * @param {Request} req 
     * @returns {(User|undefined)}
     */
    match(req) {
        if (!req.cookies) {
            return undefined
        }
        if (!req.cookies.user_id) {
            return undefined
        }
        const user_id = req.cookies.user_id
        const token = req.cookies.token
        const token_entry = this.#tokens[user_id]
        if (!token_entry || token_entry !== token) { return undefined }
        const user = this.#users.find((v) => v.id === user_id)
        return user
    }
}
