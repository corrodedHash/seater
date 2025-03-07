import * as crypto from "node:crypto";
/** @import { User } from './user.mjs' */

/**
 * @typedef {Object} Room
 * @property {string} id
 * @property {User[]} users
 * @property {string[]} waiting_room
 */

export class RoomManagement {

    /** @type Room[] */
    #rooms = []


    create_room(/** @type User */ user) {
        const new_room_id = crypto.randomUUID();
        this.#rooms.push({ id: new_room_id, users: [user], waiting_room: [] })
        user.rooms.push(new_room_id)
        return new_room_id;
    }

    get_rooms() {
        return this.#rooms
    }

    get_room(id) {
        return this.#rooms.find(v => v.id === id)
    }
}
