
export interface User {
    id: string
    rooms: string[]
    waiting_rooms: string[]
}

export interface Room {
    id: string
    admins: string[]
    users: string[]
    waiting_room: string[]
}