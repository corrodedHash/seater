import * as crypto from "node:crypto";
/** @import { Room, User } from '../exchangeData.js' */
import names from './names.json' with { type: "json" };


export class RoomManagement {

    /** @type Room[] */
    #rooms = []

    #unique_room_name() {

        // Function to get a random element from the array
        function getRandomElement(arr) {
            const randomIndex = Math.floor(Math.random() * arr.length);
            return arr[randomIndex];
        }

        // Get a random element
        const randomElement = getRandomElement(names.planes);

        function buildRegexWithNumberAtEnd(baseString) {
            // Escape any special characters in the base string
            const escapedBaseString = baseString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            // Build the regex pattern
            const regexPattern = `${escapedBaseString}\\d+$`;
            // Create the regex object
            const regex = new RegExp(regexPattern);
            return regex;
        }

        if (this.#rooms.find(x => x.display_name === randomElement) === undefined) {
            return randomElement
        } else {
            const suffixes = this.#rooms
                .filter(x => x.display_name.startsWith(randomElement))
                .map(x => x.display_name.slice(randomElement.length + 1))
                .map(parseInt)
                .filter(x => !Number.isNaN(x))
            return randomElement + " " + (Math.max(0, ...suffixes) + 1).toString()
        }

    }

    create_room(/** @type User */ user) {
        const new_room_id = crypto.randomUUID();
        this.#rooms.push({ id: new_room_id, users: [user.id], admins: [user.id], waiting_room: [], display_name: this.#unique_room_name() })
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
