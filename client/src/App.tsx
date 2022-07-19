import Header from "./components/Header.jsx";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import {
  IAlert,
  IOpenRoom,
  IRegisterErrorItem,
  IRegisterResult,
  IRoom,
} from "./types";
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
  JsonHubProtocol,
  LogLevel,
} from "@microsoft/signalr";
import {
  authenticate,
  clearAuthToken,
  currentAuthToken,
  isAuthenticated,
  registerAccount,
} from "./helpers/auth";
import Login from "./components/Login/Login";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute.js";
import Register from "./components/Register/Register.js";
import Chat2 from "./components/Chat/Chat2.js";

function App() {
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const [connection, setConnection] = useState<HubConnection>();
  const [currentChat, setCurrentChat] = useState<string>("");
  const [activeRoomsInfo, setActiveRoomsInfo] = useState<IRoom[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<string>("");
  const [authStatus, setAuthStatus] = useState<boolean>(false);
  const [openRooms, setOpenRooms] = useState<IOpenRoom[]>([]);
  const navigate = useNavigate();

  const joinChat = async () => {
    if (connection) return;

    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7278/hubs/chat", {
          accessTokenFactory: () => currentAuthToken(),
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
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

      // connection.onclose(() => {
      //   setConnection(undefined);
      //   setCurrentChat("");
      // });

      connection.on(
        "RecieveConnectedUsers",
        (users: string[], room: string) => {
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

      // connection.on("AlreadyConnected", () => {
      //   addAlert("warning", "You are already connected to this room");
      // });

      await connection.start();
      setConnection(connection);
    } catch (e: any) {
      addAlert("error", e.message);
      setConnection(undefined);
    }
  };

  const login = async (user: string, password: string) => {
    try {
      const result = await authenticate(user, password);

      if (result) {
        setLoggedInUser(user);
        setAuthStatus(true);
        joinChat();
        navigate("/Chat2");
      }
    } catch (e: any) {
      e.foreach((e: any) => {
        addAlert("error", e);
      });
    }
  };

  const register = async (email: string, user: string, password: string) => {
    try {
      const result: IRegisterResult = await registerAccount(
        email,
        user,
        password
      );

      if (result.success) {
        addAlert("success", "Account created successfully");
        navigate("/lobby/");
        return;
      }

      result.errors.forEach((e: IRegisterErrorItem) => {
        addAlert("error", e.description);
      });
    } catch (e: any) {
      addAlert("error", e.message);
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

  const closeConnection = async () => {
    try {
      await connection?.stop();
      setConnection(undefined);
      setCurrentChat("");
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

  const addAlert = (type: string, message: string) => {
    const alert: IAlert = {
      id: crypto.randomUUID(),
      type,
      message,
    };

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
      joinChat();
      navigate("/chat2");
    }
  };

  const signout = async () => {
    clearAuthToken();
    setAuthStatus(false);
    setLoggedInUser("");
    await closeConnection();
    navigate("/");
  };

  const joinRoom = async (room: string) => {
    try {
      await connection?.invoke("JoinRoom", room);
      setCurrentChat(room);
      setOpenRooms([
        ...openRooms,
        { room: room, users: [], messages: [], typingUsers: [] },
      ]);

      console.log(openRooms, "onJoin");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    tryLoginAuto();
  }, []);

  return (
    <div className="App h-screen">
      <Header
        alerts={alerts}
        removeAlert={removeAlert}
        currentUser={loggedInUser}
        signout={signout}
      />
      <main>
        <Routes>
          <Route path="/" element={<Login login={login} />} />
          <Route
            path="/register"
            element={<Register register={register} addAlert={addAlert} />}
          />
          <Route
            path="/chat2"
            element={
              <Chat2
                currentRoom={currentChat}
                setCurrentRoom={setCurrentChat}
                openRooms={openRooms}
                setOpenRooms={setOpenRooms}
                joinRoom={joinRoom}
                leaveRoom={leaveRoom}
                joinChat={joinChat}
                sendMessage={sendMessage}
                startTyping={startTyping}
                stopTyping={stopTyping}
                currentUser={loggedInUser}
              />
            }
          />
          <Route
            path="/lobby"
            element={
              <ProtectedRoute
                authStatus={authStatus}
                outlet={
                  <Lobby
                    joinRoom={joinRoom}
                    addAlert={addAlert}
                    rooms={activeRoomsInfo}
                    setRooms={setActiveRoomsInfo}
                    loggedInUser={loggedInUser}
                  />
                }
              />
            }
          />

          {/* <Route
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
          /> */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
