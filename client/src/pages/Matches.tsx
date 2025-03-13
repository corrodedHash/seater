import "./Room.css";
import { Matches, Match } from "../../../src/exchangeData";
import MatchComponent from "@/components/Match";
import { useReducer, useState } from "react";

type PairingID = number;

interface Pairing {
  id: PairingID;
  players: string[];
}

interface MatchCreation {
  last_id: PairingID;
  pairings: Pairing[];
  uniquePairing: boolean;
}

type AddPairing = { type: "add" };
type RemovePairing = { type: "remove"; payload: { id: PairingID } };
type AddPlayer = {
  type: "addPlayerPairing";
  payload: { id: PairingID; player: string };
};
type RemovePlayer = {
  type: "removePlayerPairing";
  payload: { id: PairingID; player: string };
};
type ToggleUnique = {
  type: "toggleUnique";
  payload: { unique: boolean };
};
type PairingAction =
  | AddPairing
  | RemovePairing
  | AddPlayer
  | RemovePlayer
  | ToggleUnique;

function filterPairings(
  pairings: Pairing[],
  fn: (a: string) => boolean
): Pairing[] {
  return pairings
    .map((v) => ({
      ...v,
      players: v.players.filter(fn),
    }))
    // .filter((q) => q.players.length > 0);
}

function pairingReducer(
  state: MatchCreation,
  action: PairingAction
): MatchCreation {
  switch (action.type) {
    case "toggleUnique": {
      const foundPlayers = [] as string[];
      const newPairings = () =>
        filterPairings(state.pairings, (q) => {
          if (foundPlayers.includes(q)) {
            return false;
          }
          foundPlayers.push(q);
          return true;
        });
      return {
        ...state,
        pairings: action.payload.unique ? newPairings() : state.pairings,
        uniquePairing: action.payload.unique,
      };
    }
    case "add":
      const new_id = state.last_id + 1;
      return {
        ...state,
        last_id: new_id,
        pairings: [...state.pairings, { id: new_id, players: [] }],
      };
    case "remove":
      return {
        ...state,
        pairings: state.pairings.filter((v) => v.id !== action.payload.id),
      };
    case "addPlayerPairing": {
      console.dir(action)
      const unique_pairings = () =>
        filterPairings(state.pairings, (q) => q !== action.payload.player);
      const pairings = state.uniquePairing ? unique_pairings() : state.pairings;
      const changed_pairing = pairings.find((v) => v.id === action.payload.id);
      if (changed_pairing === undefined) {
        return state;
      }
      if (changed_pairing.players.includes(action.payload.player)) {
        return state;
      }
      if (changed_pairing.players.length >= 2) {
        console.warn(`Tried to add player ${action.payload.player} to full pairing`)
        return state;
      }
      return {
        ...state,
        pairings: [
          ...pairings.filter((v) => v.id !== action.payload.id),
          {
            id: action.payload.id,
            players: [...changed_pairing.players, action.payload.player],
          },
        ].toSorted((a, b) => a.id - b.id),
      };
    }
    case "removePlayerPairing": {
      const changed_pairing = state.pairings.find(
        (v) => v.id === action.payload.id
      );
      if (changed_pairing === undefined) {
        return state;
      }
      return {
        ...state,
        pairings: [
          ...state.pairings.filter((v) => v.id !== action.payload.id),
          {
            id: action.payload.id,
            players: changed_pairing.players.filter(
              (v) => v !== action.payload.player
            ),
          },
        ].toSorted((a, b) => a.id - b.id),
      };
    }
    default:
      return state;
  }
}

function MatchesComponent() {
  const players = [..."abcdefgh"];

  const [match, dispatch] = useReducer(pairingReducer, {
    last_id: 0,
    uniquePairing: true,
    pairings: [{ id: 0, players: [] }],
  });

  if (!match.pairings.find((v) => v.players.length < 2)) {
    dispatch({ type: "add" });
  }
  return (
    <>
      {match.pairings.map((v) => (
        <div>{v.id}
        <MatchComponent
          players={players}
          chosenPlayers={v.players}
          onPlayerAdd={(q) =>
            dispatch({
              type: "addPlayerPairing",
              payload: { id: v.id, player: q },
            })
          }
          onPlayerDrop={(q) =>
            dispatch({
              type: "removePlayerPairing",
              payload: { id: v.id, player: q },
            })
          }
        /></div>
      ))}
    </>
  );
}

export default MatchesComponent;
