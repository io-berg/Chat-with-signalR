import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { IRoomsInfoProps } from "../../types";

const RoomsInfo: FC<IRoomsInfoProps> = ({
  rooms,
  addAlert,
  joinRoom,
  user,
}) => {
  const navigate = useNavigate();
  function join(room: string) {
    navigate(`/chat/${room}`);
  }

  const roomsInfo = (
    <div className="overflow-x-auto">
      <h3 className="text-center font-bold mb-1">Active Rooms</h3>
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th>Room</th>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => {
            return (
              <tr
                key={index}
                onClick={() => join(room.room)}
                className="cursor-pointer"
              >
                <td className="">
                  {room.room.length > 10
                    ? room.room.slice(0, 10) + "..."
                    : room.room}
                </td>
                <td>{room.users}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return <div>{roomsInfo}</div>;
};

export default RoomsInfo;
