<script lang="ts">
  import RoomBox from "./lib/RoomBox.svelte";
  import { rooms, waiting_rooms } from "./store/rooms";
  import { user } from "./store/user";

  async function addRoom() {
    const x = await fetch(`/api/room`, { method: "POST" });
    const room = await x.json();
    rooms.update((v) => [
      ...v,
      { id: room.id, player_count: 1, waiting_count: 0 },
    ]);
  }
</script>

<main>
  {$user}
  <RoomBox />
  {#each $waiting_rooms as wr}
    <div class="waitingRoom">{wr}</div>
  {/each}
  <button on:click={addRoom}>Add room</button>
</main>

<style>
  .waitingRoom {
    font-weight: lighter;
  }
</style>
