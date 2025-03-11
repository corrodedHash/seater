import * as crypto from "node:crypto";
/** @import { Room, User } from '../exchangeData' */



export class RoomManagement {

    /** @type Room[] */
    #rooms = []

    create_room(/** @type User */ user) {
        const new_room_id = crypto.randomUUID();
        this.#rooms.push({ id: new_room_id, users: [user.id], admins: [user.id], waiting_room: [] })
        user.rooms.push(new_room_id)
        return new_room_id;
    }

    get_rooms() {
        return this.#rooms
    }

    /**
     * @param {string} id
     */
    get_room(id) {
        return this.#rooms.find(v => v.id === id)
    }
}
