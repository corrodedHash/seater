import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';

function Room() {
    const dispatch = useDispatch();

    const { room_id } = useParams();

    const [roomInfo, setRoomInfo] = useState()

    useEffect(() => {
        fetch(`/room/${room_id}`)
            .then((v) => v.json())
            .then(v => {
                setRoomInfo(v)
            })
    }, [setRoomInfo])

    const room = useSelector((state: RootState) => state.room.value)
    const myRoom = room.find(v => v.id === room_id)

    return (
        <>
            <div>{myRoom.id}</div>
        </>
    )
}

export default Room
