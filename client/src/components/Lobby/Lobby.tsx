import { useState } from "react";
import { ILobbyProps } from "../../types";
import RoomsInfo from "./RoomsInfo";

const Lobby = (props: ILobbyProps) => {
  const [user, setUser] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  return (
    <div className="hero bg-base-200 full-height">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Join a room!</h1>
          <p className="py-6">Enter a username and room to join.</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              props.joinRoom(user, room);
            }}
            className="card-body"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                required
                type="text"
                placeholder="username"
                className="input input-bordered"
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Room</span>
              </label>
              <input
                required
                type="text"
                placeholder="room"
                className="input input-bordered"
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
            <div className="form-control mt-6">
              <button
                className="btn btn-primary mb-4"
                type="submit"
                disabled={!user || !room}
              >
                Join
              </button>
            </div>
          </form>
        </div>
        {props.rooms.length > 0 ? (
          <RoomsInfo
            rooms={props.rooms}
            addAlert={props.addAlert}
            joinRoom={props.joinRoom}
            user={user}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Lobby;
