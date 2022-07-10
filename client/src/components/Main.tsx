import Lobby from "./Lobby/Lobby";
import { FC, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { IAlert, IMainProps, IMessage } from "../types";
import Chat from "./Chat/Chat";
import { randomUUID } from "crypto";

const Main: FC<IMainProps> = ({ addAlert }) => {
  const [connection, setConnection] = useState<HubConnection>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [currentChat, setCurrentChat] = useState<string>("");

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

  const closeConnection = async () => {
    try {
      await connection?.stop();
      setConnection(undefined);
      setCurrentChat("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <main>
      {!connection ? (
        <Lobby joinRoom={joinRoom} />
      ) : (
        <Chat
          messages={messages}
          sendMessage={sendMessage}
          closeConnection={closeConnection}
          users={users}
          currentChat={currentChat}
        />
      )}
    </main>
  );
};

export default Main;
