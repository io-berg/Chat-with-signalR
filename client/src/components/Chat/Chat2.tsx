import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { FC, useEffect, useState } from "react";
import { IOpenRoom } from "../../types";
import ConnectedUsers from "./ConnecterUsers";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";

interface Chat2Props {
  // currentRoom: string;
  // setCurrentRoom: (chat: string) => void;
  // openRooms: IOpenRoom[];
  // setOpenRooms: (value: React.SetStateAction<IOpenRoom[]>) => void;
  // joinRoom: (room: string, user: string) => void;
  // leaveRoom: (room: string) => void;
  // joinChat: () => void;
  // sendMessage: (message: string, room: string) => Promise<void>;
  // startTyping: (room: string) => Promise<void>;
  // stopTyping: (room: string) => Promise<void>;
  currentUser: string;
  accessToken: string;
  addAlert: (type: string, message: string) => void;
  setConnection: (connection: HubConnection | undefined) => void;
  connection: HubConnection | undefined;
}

const Chat2: FC<Chat2Props> = ({
  accessToken,
  addAlert,
  connection,
  setConnection,
}) => {
  const [roomToJoin, setRoomToJoin] = useState("");
  const [openRooms, setOpenRooms] = useState<IOpenRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState("");
  const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);

  const joinChat = async () => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7278/hubs/chat", {
          accessTokenFactory: () => {
            return accessToken;
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .configureLogging(LogLevel.Information)
        .build();

      connection.on(
        "RecieveMessage",
        (user: string, message: string, room: string) => {
          console.log(user, message, room, "I RECIEVED A MSG");

          setOpenRooms((prevOpenRooms) => {
            const newOpenRooms: IOpenRoom[] = [...prevOpenRooms];
            const roomIndex = newOpenRooms.findIndex((c) => c.room === room);
            if (roomIndex > -1) {
              newOpenRooms[roomIndex].messages.push({ user, message });
            }
            return newOpenRooms;
          });
        }
      );

      connection.onclose(() => {
        setConnection(undefined);
        setCurrentRoom("");
      });

      connection.on(
        "RecieveConnectedUsers",
        (users: string[], room: string) => {
          console.log("I RECIEVED CONNECTED USERS", users, room);
          setOpenRooms((prevOpenRooms) => {
            const newOpenRooms: IOpenRoom[] = [...prevOpenRooms];
            const roomIndex = newOpenRooms.findIndex((c) => c.room === room);
            if (roomIndex > -1) {
              newOpenRooms[roomIndex].users = users;
            }
            return newOpenRooms;
          });
        }
      );

      connection.on("RecieveTypingUsers", (users: string[], room: string) => {
        console.log(users, room, "I RECIEVED A TYPING MSG");

        setOpenRooms((prevOpenRooms) => {
          const newOpenRooms: IOpenRoom[] = [...prevOpenRooms];
          const roomIndex = newOpenRooms.findIndex((c) => c.room === room);
          if (roomIndex > -1) {
            newOpenRooms[roomIndex].typingUsers = users;
          }
          return newOpenRooms;
        });
      });

      connection.on("AlreadyConnected", () => {
        addAlert("warning", "You are already connected to this room");
      });

      await connection.start();
      setConnection(connection);
    } catch (e: any) {
      addAlert("error", e.message);
      setConnection(undefined);
    }
  };

  const sendMessage = async (message: string, room: string) => {
    try {
      await connection?.invoke("SendMessage", message, room);
    } catch (e) {
      console.log(e);
    }
  };

  const startTyping = async (room: string) => {
    try {
      await connection?.invoke("IsTyping", room);
    } catch (e) {
      console.log(e);
    }
  };

  const stopTyping = async (room: string) => {
    try {
      await connection?.invoke("StopTyping", room);
    } catch (e) {
      console.log(e);
    }
  };

  const leaveRoom = async (room: string) => {
    console.log("LEAVING ROOM", room);
    try {
      await connection?.invoke("LeaveRoom", room);
      setOpenRooms((openRooms) => {
        return openRooms.filter((r) => r.room !== room);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const joinRoom = async (room: string) => {
    try {
      setOpenRooms([
        ...openRooms,
        { room: room, users: [], messages: [], typingUsers: [] },
      ]);
      await connection?.invoke("JoinRoom", room);
      setCurrentRoom(room);

      console.log(openRooms, "onJoin");
    } catch (e) {
      console.log(e);
    }
  };

  const currentlyTypingText = (typingUsers: string[]) => {
    const currentlyTyping: string = typingUsers.map((user) => user).join(", ");

    if (typingUsers.length > 0) {
      if (typingUsers.length === 1) {
        return `${currentlyTyping} is typing...`;
      }
      return `${currentlyTyping} are typing...`;
    }
    return "";
  };

  function handleSubmitJoinRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    joinRoom(roomToJoin);
    setRoomToJoin("");
    setShowJoinRoomModal(false);
  }

  useEffect(() => {
    joinChat();
  }, []);

  const tabs = openRooms.map((room) => {
    console.log(room);

    return (
      <a
        key={room.room}
        className={`tab tab-bordered tab-lg ${
          room.room === currentRoom ? "tab-active" : ""
        }`}
        onClick={() => {
          setCurrentRoom(room.room);
        }}
      >
        {room.room}
        <button
          className="btn btn-circle btn-xs ml-1"
          onClick={() => leaveRoom(room.room)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </a>
    );
  });

  const chatRooms = openRooms.map((room) => {
    return (
      <div
        key={room.room}
        className={`${
          room.room === currentRoom ? "flex" : "hidden"
        } flex-col p-5 full-height`}
      >
        <div className="flex grow mb-2">
          <MessageContainer messages={room.messages} />
          <ConnectedUsers users={room.users} />
        </div>
        <span className="pb-1">{currentlyTypingText(room.typingUsers)}</span>
        <SendMessageForm
          sendMessage={sendMessage}
          startTyping={startTyping}
          stopTyping={stopTyping}
          room={room.room}
        />
      </div>
    );
  });

  return (
    <div className="flex flex-col full-height w-auto">
      <div className="flex w-max p-1 column">
        <label
          onClick={() => {
            setShowJoinRoomModal(true);
          }}
          className="btn modal-button"
        >
          Join Room
        </label>
        <div className="tabs flex w-max">{tabs}</div>
      </div>
      {chatRooms}
      {/* JOIN ROOM MODAL  */}
      <input type="checkbox" id="joinRoomModal" className="modal-toggle" />
      <label
        htmlFor="joinRoomModal"
        className={`
          modal cursor-pointer
          ${showJoinRoomModal ? "modal-open" : ""}
        `}
      >
        <label className="modal-box relative">
          <form onSubmit={(e) => handleSubmitJoinRoom(e)}>
            <h3 className="text-lg font-bold mb-4">
              Enter the name of the room you want to join
            </h3>
            <div className="form-control">
              <input
                type="text"
                placeholder="room"
                className="input input-bordered"
                onChange={(e) => setRoomToJoin(e.target.value)}
              />
            </div>
            <div className="form-control mt-6">
              <button
                className="btn btn-primary mb-4"
                type="submit"
                disabled={!roomToJoin}
              >
                Join
              </button>
            </div>
          </form>
        </label>
      </label>
    </div>
  );
};

export default Chat2;
