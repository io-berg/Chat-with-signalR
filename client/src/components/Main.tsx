import Lobby from "./Lobby/Lobby";
import { FC, useEffect, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { IAlert, IMainProps, IMessage, IRoom, IUserConnection } from "../types";
import Chat from "./Chat/Chat";
import { getRooms } from "../helpers/apicalls";

const Main: FC<IMainProps> = ({ addAlert }) => {
  const [connection, setConnection] = useState<HubConnection>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [currentChat, setCurrentChat] = useState<string>("");
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [typingUsers, setTypingUsers] = useState<IUserConnection[]>([]);

  const joinRoom = async (user: string, room: string) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7278/hubs/chat")
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("RecieveMessage", (user: string, message: string) => {
        setMessages((messages) => [...messages, { user, message }]);
      });

      connection.onclose(() => {
        setConnection(undefined);
        setMessages([]);
        setUsers([]);
        setCurrentChat("");
      });

      connection.on("RecieveConnectedUsers", (users: string[]) => {
        setUsers(users);
      });

      connection.on("RecieveTypingUsers", (users: IUserConnection[]) => {
        setTypingUsers(users);
      });

      await connection.start();
      await connection.invoke("JoinRoom", { user, room });
      setConnection(connection);
      setCurrentChat(room);
    } catch (e: any) {
      const alert: IAlert = {
        id: crypto.randomUUID(),
        type: "error",
        message: e.message,
      };

      addAlert(alert);
    }
  };

  const sendMessage = async (message: string) => {
    try {
      await connection?.invoke("SendMessage", message);
    } catch (e) {
      console.log(e);
    }
  };

  const startTyping = async () => {
    try {
      await connection?.invoke("IsTyping");
    } catch (e) {
      console.log(e);
    }
  };

  const stopTyping = async () => {
    try {
      await connection?.invoke("StopTyping");
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnection = async () => {
    try {
      await connection?.stop();
      setConnection(undefined);
      setCurrentChat("");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getRooms().then((rooms: IRoom[]) => {
      setRooms(rooms);
    });
  }, []);

  return (
    <main>
      {!connection ? (
        <Lobby joinRoom={joinRoom} rooms={rooms} addAlert={addAlert} />
      ) : (
        <Chat
          messages={messages}
          sendMessage={sendMessage}
          closeConnection={closeConnection}
          users={users}
          currentChat={currentChat}
          typingUsers={typingUsers}
          startTyping={startTyping}
          stopTyping={stopTyping}
        />
      )}
    </main>
  );
};

export default Main;
