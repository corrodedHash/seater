import { writable } from "svelte/store";

interface RoomSummary {
    id: string
    player_count: number
    waiting_count: number
}


export const rooms = writable<RoomSummary[]>([]);
export const waiting_rooms = writable<string[]>([]);
