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
}

type AddPairing = { type: "add" };
type RemovePairing = { type: "remove"; payload: { id: PairingID } };
type ChangePairing = {
  type: "change";
  payload: { id: PairingID; players: string[] };
};

type PairingAction = AddPairing | RemovePairing | ChangePairing;

function pairingReducer(
  state: MatchCreation,
  action: PairingAction
): MatchCreation {
  switch (action.type) {
    case "add":
      const new_id = state.last_id + 1;
      return {
        last_id: new_id,
        pairings: [...state.pairings, { id: new_id, players: [] }],
      };
    case "remove":
      return {
        last_id: state.last_id,
        pairings: state.pairings.filter((v) => v.id !== action.payload.id),
      };
    case "change":
      return {
        last_id: state.last_id,
        pairings: [
          ...state.pairings.filter((v) => v.id !== action.payload.id),
          { id: action.payload.id, players: action.payload.players },
        ],
      };
    default:
      return state;
  }
}

function MatchesComponent() {
  const players = [..."abcdefgh"];

  const [match, dispatch] = useReducer(pairingReducer, {
    last_id: 0,
    pairings: [{ id: 0, players: [] }],
  });

  if (!match.pairings.find((v) => v.players.length < 2)) {
    dispatch({ type: "add" });
  }
  return (
    <>
      {match.pairings.map((v) => (
        <MatchComponent
          players={players}
          chosenPlayers={v.players}
          onPlayerChange={(q) =>
            dispatch({ type: "change", payload: { id: v.id, players: q } })
          }
        />
      ))}
    </>
  );
}

export default MatchesComponent;
