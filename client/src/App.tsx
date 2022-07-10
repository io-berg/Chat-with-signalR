import "./App.css";
import Header from "./components/Header.jsx";
import Main from "./components/Main";
import Footer from "./components/Footer";
import { useState } from "react";
import { IAlert } from "./types";

function App() {
  const [alerts, setAlerts] = useState<IAlert[]>([]);

  const addAlertHandler = (alert: IAlert) => {
    setAlerts((alerts) => [...alerts, alert]);
  };

  const removeAlertHandler = (id: string) => {
    setAlerts((alerts) => alerts.filter((alert) => alert.id !== id));
  };

  return (
    <div className="App h-screen">
      <Header alerts={alerts} removeAlert={removeAlertHandler}></Header>
      <Main addAlert={addAlertHandler}></Main>
      <Footer></Footer>
    </div>
  );
}

export default App;
