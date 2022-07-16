import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer";
import { useState } from "react";
import { IAlert, IMessage, IRoom, IUserConnection } from "./types";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Lobby from "./components/Lobby/Lobby";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import Chat from "./components/Chat/Chat";

function App() {
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const [connection, setConnection] = useState<HubConnection>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [currentChat, setCurrentChat] = useState<string>("");
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [typingUsers, setTypingUsers] = useState<IUserConnection[]>([]);
  const navigate = useNavigate();

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

      navigate(`/chat/${room}`);
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

  const addAlert = (alert: IAlert) => {
    setAlerts((alerts) => [...alerts, alert]);
  };

  const removeAlert = (id: string) => {
    setAlerts((alerts) => alerts.filter((alert) => alert.id !== id));
  };

  return (
    <div className="App h-screen">
      <Header alerts={alerts} removeAlert={removeAlert} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Lobby
                joinRoom={joinRoom}
                addAlert={addAlert}
                rooms={rooms}
                setRooms={setRooms}
              />
            }
          />
          <Route
            path="/chat/:room"
            element={
              <Chat
                messages={messages}
                users={users}
                sendMessage={sendMessage}
                closeConnection={closeConnection}
                currentChat={currentChat}
                typingUsers={typingUsers}
                startTyping={startTyping}
                stopTyping={stopTyping}
              />
            }
          />
          <Route path="/login" />
          <Route path="/register" />
          <Route path="/profile" />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
