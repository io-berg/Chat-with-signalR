import Header from "./components/Header.jsx";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import {
  IAlert,
  IAuthResponse,
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
import { HubConnection } from "@microsoft/signalr";
import {
  clearAuthToken,
  isAuthenticated,
  registerAccount,
} from "./helpers/auth";
import Login from "./components/Login/Login";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute.js";
import Register from "./components/Register/Register.js";
import Chat from "./components/Chat/Chat.js";

function App() {
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const [connection, setConnection] = useState<HubConnection>();
  const [loggedInUser, setLoggedInUser] = useState<string>("");
  const [authStatus, setAuthStatus] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const navigate = useNavigate();

  const BASEURL = "https://localhost:7278/api/auth/";

  const authenticate = async (username: string, password: string) => {
    const URL = BASEURL + "Login";
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data: IAuthResponse = await response.json();
      if (response.status === 200) {
        console.log(data);
        localStorage.setItem("token", data.token);
        return {
          success: true,
          token: data.token,
        };
      }
      return {
        success: false,
        token: "",
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const login = async (user: string, password: string) => {
    try {
      const result = await authenticate(user, password);
      if (result.success) {
        setLoggedInUser(user);
        setAuthStatus(true);
        if (result.token) {
          setAccessToken(result.token);
          navigate("/Chat");
        }
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

  const closeConnection = async () => {
    try {
      await connection?.stop();
      setConnection(undefined);
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
    const token = localStorage.getItem("token");
    if (response.isAuthenticated && token) {
      console.log(token);
      setLoggedInUser(response.user);
      setAuthStatus(true);
      setAccessToken(token);
      navigate("/chat");
    }
  };

  const signout = async () => {
    clearAuthToken();
    setAuthStatus(false);
    setLoggedInUser("");
    await closeConnection();
    navigate("/");
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
            path="/chat"
            element={
              <ProtectedRoute
                authStatus={authStatus}
                outlet={
                  <Chat
                    currentUser={loggedInUser}
                    accessToken={accessToken}
                    addAlert={addAlert}
                    setConnection={setConnection}
                    connection={connection}
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
