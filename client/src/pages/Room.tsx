import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import "./Room.css";
import MatchesComponent from "@/pages/Matches";

function Room() {
  const user = useSelector((v: RootState) => v.user.value);

  const { room_id } = useParams();

  const [roomInfo, setRoomInfo] = useState<
    | undefined
    | { id: string; display_name: String; users: string[]; waiting_room: string[]; admins: string[]; user_names: Record<string, string> }
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
  console.log(roomInfo.admins, user)



  const handleDelete = (u: string) => (_e: React.MouseEvent) => {
    fetch(`/api/room/${room_id}/user/${u}`, { method: "DELETE" });
  };
  const handleNameChange = (u: string) => (e: React.ChangeEvent) => {
    fetch(`/api/room/${room_id}/user/${u}/name/${e.target.value}`, { method: "PUT" })
  };

  const display_user = (u: string) => {
    const userClassName = roomInfo.admins.includes(u)
      ? "adminUser"
      : "normalUser";
    const deleteButton = <button onClick={handleDelete(u)}>Delete</button>;
    return (
      <div className={userClassName} key={u}>
        {u in roomInfo.user_names ? roomInfo.user_names[u] : u}
        {amAdmin ? <input type="text" onChange={handleNameChange(u)} /> : ""}
        {amAdmin ? deleteButton : ""}
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
      <div title={roomInfo.id}>{roomInfo.display_name}</div>
      {roomInfo.users.map(display_user)}
      <div>{roomInfo.waiting_room.map(waiting_user)}</div>
      <MatchesComponent />
    </>
  );
}

export default Room;
