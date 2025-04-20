import * as crypto from "node:crypto";
/** @import { Room, User } from '../exchangeData.js' */
import names from './names.json' with { type: "json" };
import { unique_identifier } from "../util.mjs";


export class RoomManagement {

    /** @type Room[] */
    #rooms = []

    create_room(/** @type User */ user) {
        const new_room_id = crypto.randomUUID();
        const display_name = unique_identifier(names.planes, this.#rooms.map(x => x.display_name))
        this.#rooms.push({ id: new_room_id, users: [user.id], admins: [user.id], waiting_room: [], display_name: display_name })
        user.rooms.push(new_room_id)
        return new_room_id;
    }

    /**
     * @param {string} id
     */
    get_room(id) {
        return this.#rooms.find(v => v.id === id)
    }
}
