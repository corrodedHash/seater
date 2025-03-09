
import './RoomBox.css'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { useNavigate } from 'react-router'


function RoomBox() {

    const rooms = useSelector((state: RootState) => state.room.value)
    const navigate = useNavigate()
    const handleShare = (roomID: string) => (e) => {
        e.stopPropagation()
        navigate(`/share/${roomID}`)
    }
    return (
        <>
            {rooms.map((v) => <div className="roomDisplay" key={v.id} onClick={() => navigate(`/room/${v.id}`)}>
                <span className="roomID" >{v.id}</span>
                <span className="playerBox">
                    <span className="roomCount">{v.player_count}</span>
                    <span className="shareButton" onClick={handleShare(v.id)}>Share</span>
                </span>
                {v.waiting_count > 0 ? <span className="hasWaiting"></span> : ""}
            </div>
            )}
        </>
    )
}

export default RoomBox