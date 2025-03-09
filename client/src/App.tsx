import './App.css'
import { useSelector, useDispatch } from 'react-redux'
import { addRoom, setRooms } from './store/room'
import { RootState } from './store'
import RoomBox from './lib/RoomBox'
import { useEffect } from 'react'
import { setUserID } from './store/user'
import { setWaitingRooms } from './store/waiting_room'


async function setup_user_info() {
  let user_info
  try {
    user_info = await fetch('/api/user').then(v => v.json()).catch(async () => {
      return await fetch('/api/token').then(async () => {
        return (await fetch('/api/user').then(v => v.json()))
      });
    })
  }
  catch (err) {
    throw Error("Could not get user data")
  }


  const room_promises = user_info.rooms.map((v: string) =>
    fetch(`/api/room/${v}`)
      .then(v => v.json())
      .then(v => ({ id: v.id, player_count: v.users.length, waiting_count: v.waiting_room.length }))
  )
  const resolved_rooms = await Promise.all(room_promises)

  return { user_id: user_info.id, rooms: resolved_rooms, waiting_rooms: user_info.waiting_rooms }

}

async function manage_join() {
  const urlParams = new URL(window.location.href);
  const join_regex = /^\/join\/(?<room_id>[\w-]+)$/
  const join_match = urlParams.pathname.match(join_regex)
  if (join_match === null) {
    return
  }
  console.dir(join_match)
  const room_id = join_match.groups['room_id']
  try {
    await fetch(`/api/room/join/${room_id}`, { method: "PUT" }).then(v => v.json())
  }
  catch {

  }
}


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    setup_user_info().then((v) => {
      dispatch(setRooms(v.rooms))
      dispatch(setUserID(v.user_id))
      dispatch(setWaitingRooms(v.waiting_rooms))
    })
  }, [])

  const waiting_rooms = useSelector((state: RootState) => state.waiting_room.value)
  const userID = useSelector((state: RootState) => state.user.value)
  async function addRoomClick() {
    const x = await fetch(`/api/room`, { method: "POST" });
    const room = await x.json();
    dispatch(addRoom({ id: room.id, player_count: 1, waiting_count: 0 }))
  }

  return (
    <>
      hello
      <div>{userID}</div>
      <RoomBox />
      {waiting_rooms.map(v => {
        return <div className="waitingRoom">{v}</div>
      })}
      <button onClick={addRoomClick}>Add room</button>
    </>
  )
}

export default App
