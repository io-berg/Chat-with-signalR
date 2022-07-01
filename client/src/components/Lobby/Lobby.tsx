import { useState } from "react";
import { ILobbyProps } from "../../types";

const Lobby = (props: ILobbyProps) => {
  const [user, setUser] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.joinRoom(user, room);
        }}
      >
        <input
          type="text"
          placeholder="name"
          onChange={(e) => setUser(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="room"
          onChange={(e) => setRoom(e.target.value)}
        ></input>
        <button type="submit" disabled={!user || !room}>
          Join
        </button>
      </form>
    </div>
  );
};

export default Lobby;
