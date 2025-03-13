import "./Match.css";
function Match({
  players,
  chosenPlayers,
  onPlayerAdd,
  onPlayerDrop,
}: {
  players: string[];
  chosenPlayers: string[];
  onPlayerAdd: (a: string, total: string[]) => void;
  onPlayerDrop: (a: string, total: string[]) => void;
}) {
  let myChosenPlayers = [...chosenPlayers];
  const playerEntry = (playerID: string) => {
    return (
      <div className="matchPlayer" key={playerID}>
        {playerID}
        <button
          onClick={() => {
            myChosenPlayers = myChosenPlayers.filter((v) => v !== playerID);
            onPlayerDrop(playerID, [...myChosenPlayers]);
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
              onPlayerAdd(q.target.value, [...myChosenPlayers]);
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
