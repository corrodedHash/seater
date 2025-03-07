<script lang="ts">
    import { rooms, waiting_rooms } from "../store/rooms";
</script>

{#each $rooms as room}
    <div class="roomDisplay">
        <span class="roomID">{room.id}</span>
        <span class="roomCount">{room.player_count}</span>
        {#if room.waiting_count > 0}
            <span class="hasWaiting"></span>
        {/if}
    </div>
{/each}

<style>
    .roomDisplay {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.1em;
        padding: 0.6em 1em;
        box-shadow: 0px 0px 4px lightblue;
    }
    .roomDisplay:hover {
        box-shadow: 0px 0px 4px blue;
        border-radius: 0.7em;
    }
    .roomDisplay .roomID {
        font-weight: bold;
    }
    .roomDisplay .roomCount {
        font-family: monospace;
        background-color: lightgray;
        margin: -1em 0;
        padding: 1em 0;
    }
    .hasWaiting {
        position: relative;
    }

    .hasWaiting::after {
        content: "";
        position: absolute;
        top: calc(50% - 4px);
        right: -10px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: red;
    }
</style>
