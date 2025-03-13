import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import "./Room.css";
import MatchesComponent from "@/pages/Matches";
import RoundBuilder from "@/pages/RoundBuilder";

function Room() {
  const user = useSelector((v: RootState) => v.user.value);

  const { room_id } = useParams();

  const [roomInfo, setRoomInfo] = useState<
    | undefined
    | { id: string; users: string[]; waiting_room: string[]; admins: string[] }
  >();

  useEffect(() => {
    fetch(`/api/room/${room_id}`)
      .then((v) => v.json())
      .then((v) => {
        setRoomInfo(v);
      });
  }, [setRoomInfo]);

  if (roomInfo === undefined) {
    return <> Loading ... </>;
  }
  const amAdmin = roomInfo.admins.includes(user);

  const display_user = (u: string) => {
    const userClassName = roomInfo.admins.includes(u)
      ? "adminUser"
      : "normalUser";
    return (
      <div className={userClassName} key={u}>
        {u}
      </div>
    );
  };

  const handleAccept = (u: string) => (_e: React.MouseEvent) => {
    fetch(`/api/room/${room_id}/accept/${u}`, { method: "PUT" });
  };

  const waiting_user = (u: string) => {
    const acceptButton = <button onClick={handleAccept(u)}>Accept</button>;
    return (
      <div className="waitingUser">
        {u} {amAdmin ? acceptButton : ""}
      </div>
    );
  };

  return (
    <>
      <div>{roomInfo.id}</div>
      {roomInfo.users.map(display_user)}
      <div>{roomInfo.waiting_room.map(waiting_user)}</div>
      <MatchesComponent />
    </>
  );
}

export default Room;
