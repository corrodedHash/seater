import "./Match.css";
function Match({
  players,
  chosenPlayers,
  onPlayerChange,
}: {
  players: string[];
  chosenPlayers: string[];
  onPlayerChange: (a: string[]) => void;
}) {
  let myChosenPlayers = [...chosenPlayers];
  const playerEntry = (playerID: string) => {
    return (
      <div className="matchPlayer" key={playerID}>
        {playerID}
        <button
          onClick={() => {
            myChosenPlayers = myChosenPlayers.filter((v) => v !== playerID);
            onPlayerChange([...myChosenPlayers]);
          }}
        >
          X
        </button>
      </div>
    );
  };
  return (
    <>
      <div className="matchBox">
        {myChosenPlayers.map(playerEntry)}
        {myChosenPlayers.length < 2 ? (
          <select
            onChange={(q) => {
              myChosenPlayers.push(q.target.value);
              onPlayerChange([...myChosenPlayers]);
            }}
          >
            {players.map((q) => (
              <option value={q} key={q}>
                {q}
              </option>
            ))}
          </select>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Match;
