import "./Match.css";
function Match({
  players,
  chosenPlayers,
  matchHistory,
  onPlayerAdd,
  onPlayerDrop,
  onMatchConclude,
  onMatchRemove,
}: {
  players: string[];
  chosenPlayers: string[];
  matchHistory: boolean[];
  onPlayerAdd: (a: string, total: string[]) => void;
  onPlayerDrop: (a: string, total: string[]) => void;
  onMatchConclude: (won: boolean) => void;
  onMatchRemove: () => void;
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

  const matchHistoryComponent = () => (
    <div>
      {matchHistory.map((v) => (v ? "Y" : "N"))}
      <button onClick={() => onMatchConclude(true)}>+</button>
      <button onClick={() => onMatchConclude(false)}>-</button>
      <button onClick={onMatchRemove}>x</button>
    </div>
  );
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
        ) : undefined}
        {myChosenPlayers.length === 2 ? matchHistoryComponent() : ""}
      </div>
    </>
  );
}

export default Match;
