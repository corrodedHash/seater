
import './RoomBox.css'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { useNavigate } from 'react-router'


function RoomBox() {

    const rooms = useSelector((state: RootState) => state.room.value)
    const navigate = useNavigate()
    return (
        <>
            {rooms.map((v, index) => <div className="roomDisplay" key={v.id} onClick={()=>navigate(`/share/${v.id}`)}>
                <span className="roomID">{v.id}</span>
                <span className="roomCount">{v.player_count}</span>
                {v.waiting_count > 0 ? <span className="hasWaiting"></span> : ""}
            </div>
            )}
        </>
    )
}

export default RoomBox