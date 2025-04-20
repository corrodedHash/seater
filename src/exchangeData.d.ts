export interface Match {
    player1: string
    player2: string
    player1won: boolean[]
}
export interface Matches {
    rounds: Match[][]
}

export interface User {
    id: string
    rooms: string[]
    waiting_rooms: string[]
}

export interface Room {
    id: string
    display_name: string
    admins: string[]
    users: string[]
    waiting_room: string[]
}