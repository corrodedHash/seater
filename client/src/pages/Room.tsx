import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import './Room.css'
function Room() {
    const user = useSelector((v: RootState) => v.user.value)

    const { room_id } = useParams();

    const [roomInfo, setRoomInfo] = useState<undefined | { id: string, users: string[], waiting_room: string[], admins: string[] }>()

    useEffect(() => {
        fetch(`/api/room/${room_id}`)
            .then((v) => v.json())
            .then(v => {
                setRoomInfo(v)
            })
    }, [setRoomInfo])

    // const room = useSelector((state: RootState) => state.room.value)
    // const myRoom = room.find(v => v.id === room_id)

    if (roomInfo === undefined) {
        return <> Loading ... </>
    }
    const amAdmin = roomInfo.admins.includes(user)

    const display_user = (u: string) => {
        if (roomInfo.admins.includes(u)) {
            return <div className="adminUser" key={u}>{u}</div>
        } else {
            return <div className="normalUser" key={u}>{u}</div>
        }
    }

    const handleAccept = (u: string) => (_e: React.MouseEvent) => {
        fetch(`/api/room/${room_id}/accept/${u}`, { method: "PUT" })
    }
    console.dir(roomInfo)
    const waiting_user = (u: string) => {
        if (amAdmin) {
            return <div className="waitingUser">{u} <button onClick={handleAccept(u)}>Accept</button></div>
        } else {
            return <div className="waitingUser">{u}</div>
        }
    }

    return (
        <>
            <div>{roomInfo.id}</div>
            {roomInfo.users.map(display_user)}
            <div>{roomInfo.waiting_room.map(waiting_user)}</div>
        </>
    )
}

export default Room
