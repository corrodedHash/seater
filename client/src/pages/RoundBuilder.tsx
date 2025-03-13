import "./Room.css";
import { Matches, Match } from "../../../src/exchangeData";

function RoundBuilder() {
  const players = [..."abcdefgh"];

  const pairings = Object.values(
    Object.groupBy(players, (_, i) => Math.floor(i / 2))
  );
  return (
    <>
      {pairings.map((p, i) => (
        <div key={i}>
          <ul>
            {p.map((u) => (
              <li>{u}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export default RoundBuilder;
