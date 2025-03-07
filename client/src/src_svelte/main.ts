import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { rooms, waiting_rooms } from './store/rooms'
import { user } from './store/user'

const app = mount(App, {
  target: document.getElementById('app')!,
})

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
    console.error("Could not get user data")
    return
  }

  user.set(user_info.id)

  const room_promises = user_info.rooms.map(v =>
    fetch(`/api/room/${v}`)
      .then(v => v.json())
      .then(v => ({ id: v.id, player_count: v.users.length, waiting_count: v.waiting_room.length }))
  )
  const resolved_rooms = await Promise.all(room_promises)
  rooms.set(resolved_rooms)

  waiting_rooms.set(user_info.waiting_rooms)
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

  urlParams.pathname = '/'
  window.history.pushState({}, "", urlParams)
}

setup_user_info().then(() => {
  manage_join()
})



export default app
