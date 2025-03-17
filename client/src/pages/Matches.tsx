import "./Room.css";
import { Matches, Match } from "../../../src/exchangeData";
import MatchComponent from "@/components/Match";
import { useReducer, useState } from "react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type PairingID = number;

interface Pairing {
  id: PairingID;
  players: string[];
  matchHistory: boolean[];
}

interface MatchCreation {
  last_id: PairingID;
  pairings: Pairing[];
  uniquePairing: boolean;
}

export const matchesSlice = createSlice({
  name: "matches",
  initialState: {
    last_id: 0,
    uniquePairing: true,
    pairings: [{ id: 0, players: [], matchHistory: [] }],
  } as MatchCreation,
  reducers: {
    toggleUnique: (state, action: PayloadAction<{ unique: boolean }>) => {
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
    },
    add: (state) => {
      const new_id = state.last_id + 1;
      return {
        ...state,
        last_id: new_id,
        pairings: [
          ...state.pairings,
          { id: new_id, players: [], matchHistory: [] },
        ],
      };
    },
    remove: (state, action: PayloadAction<{ id: number }>) => {
      return {
        ...state,
        pairings: state.pairings.filter((v) => v.id !== action.payload.id),
      };
    },
    addPlayerPairing: (
      state,
      action: PayloadAction<{ id: number; player: string }>
    ) =>
      modifyPairing(state, action.payload.id, (changed_pairing) => {
        if (changed_pairing.players.includes(action.payload.player)) {
          return changed_pairing;
        }
        if (changed_pairing.players.length >= 2) {
          console.warn(
            `Tried to add player ${action.payload.player} to full pairing`
          );
          return changed_pairing;
        }
        return {
          ...changed_pairing,
          players: [...changed_pairing.players, action.payload.player],
        };
      }),
    removePlayerPairing: (
      state,
      action: PayloadAction<{ id: number; player: string }>
    ) =>
      modifyPairing(state, action.payload.id, (changed_pairing) => {
        return {
          ...changed_pairing,
          players: changed_pairing.players.filter(
            (v) => v !== action.payload.player
          ),
        };
      }),
    addMatchHistory: (
      state,
      action: PayloadAction<{ id: number; won: boolean }>
    ) =>
      modifyPairing(state, action.payload.id, (changed_pairing) => {
        return {
          ...changed_pairing,
          matchHistory: [...changed_pairing.matchHistory, action.payload.won],
        };
      }),
    removeMatchHistory: (state, action: PayloadAction<{ id: number }>) =>
      modifyPairing(state, action.payload.id, (changed_pairing) => {
        return {
          ...changed_pairing,
          matchHistory: changed_pairing.matchHistory.slice(
            0,
            changed_pairing.matchHistory.length - 1
          ),
        };
      }),
  },
});

function modifyPairing(
  state: MatchCreation,
  id: number,
  modification: (pairing: Pairing) => Pairing
) {
  const changed_pairing = state.pairings.find((v) => v.id === id);
  if (changed_pairing === undefined) {
    return state;
  }
  return {
    ...state,
    pairings: [
      ...state.pairings.filter((v) => v.id !== id),
      modification(changed_pairing),
    ].toSorted((a, b) => a.id - b.id),
  };
}

function filterPairings(
  pairings: Pairing[],
  fn: (a: string) => boolean
): Pairing[] {
  return pairings.map((v) => ({
    ...v,
    players: v.players.filter(fn),
  }));
}

function MatchesComponent() {
  const players = [..."abcdefgh"];

  const [match, dispatch] = useReducer(matchesSlice.reducer, {
    last_id: 0,
    uniquePairing: true,
    pairings: [{ id: 0, players: [], matchHistory: [] }],
  } as MatchCreation);

  if (!match.pairings.find((v) => v.players.length < 2)) {
    dispatch(matchesSlice.actions.add());
  }
  return (
    <>
      {match.pairings.map((v) => (
        <div key={v.id}>
          <MatchComponent
            players={players}
            chosenPlayers={v.players}
            matchHistory={v.matchHistory}
            onPlayerAdd={(q) =>
              dispatch(
                matchesSlice.actions.addPlayerPairing({
                  id: v.id,
                  player: q,
                })
              )
            }
            onPlayerDrop={(q) =>
              dispatch(
                matchesSlice.actions.removePlayerPairing({
                  id: v.id,
                  player: q,
                })
              )
            }
            onMatchConclude={(q) =>
              dispatch(
                matchesSlice.actions.addMatchHistory({ id: v.id, won: q })
              )
            }
            onMatchRemove={() =>
              dispatch(matchesSlice.actions.removeMatchHistory({ id: v.id }))
            }
          />
        </div>
      ))}
    </>
  );
}

export default MatchesComponent;
