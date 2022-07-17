import Header from "./components/Header.jsx";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
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
import {
  authenticate,
  currentAuthToken,
  isAuthenticated,
} from "./helpers/auth";
import Login from "./components/Login/Login";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute.js";

function App() {
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const [connection, setConnection] = useState<HubConnection>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [currentChat, setCurrentChat] = useState<string>("");
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [typingUsers, setTypingUsers] = useState<IUserConnection[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<string>("");
  const [authStatus, setAuthStatus] = useState<boolean>(false);
  const navigate = useNavigate();

  const joinRoom = async (user: string, room: string) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7278/hubs/chat", {
          accessTokenFactory: () => currentAuthToken(),
        })
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

  const login = async (user: string, password: string) => {
    try {
      const result = await authenticate(user, password);

      if (result) {
        setLoggedInUser(user);
        setAuthStatus(true);
        navigate("/lobby/");
      }
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

  const tryLoginAuto = async () => {
    const response = await isAuthenticated();
    if (response.isAuthenticated) {
      setLoggedInUser(response.user);
      setAuthStatus(true);
      navigate("/lobby");
    }
  };

  useEffect(() => {
    tryLoginAuto();
  }, []);

  return (
    <div className="App h-screen">
      <Header alerts={alerts} removeAlert={removeAlert} />
      <main>
        <Routes>
          <Route path="/" element={<Login login={login} />} />

          <Route
            path="/lobby"
            element={
              <ProtectedRoute
                authStatus={authStatus}
                outlet={
                  <Lobby
                    joinRoom={joinRoom}
                    addAlert={addAlert}
                    rooms={rooms}
                    setRooms={setRooms}
                    loggedInUser={loggedInUser}
                  />
                }
              />
            }
          />

          <Route
            path="/chat/:room"
            element={
              <ProtectedRoute
                authStatus={authStatus}
                outlet={
                  <Chat
                    messages={messages}
                    users={users}
                    sendMessage={sendMessage}
                    closeConnection={closeConnection}
                    currentChat={currentChat}
                    typingUsers={typingUsers}
                    startTyping={startTyping}
                    stopTyping={stopTyping}
                    joinRoom={joinRoom}
                    currentUser={loggedInUser}
                  />
                }
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
