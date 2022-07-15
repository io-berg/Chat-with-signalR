import "./App.css";
import Header from "./components/Header.jsx";
import Main from "./components/Main";
import Footer from "./components/Footer";
import { useState } from "react";
import { IAlert } from "./types";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
      <Header alerts={alerts} removeAlert={removeAlertHandler} />
      <Routes>
        <Route path="/" element={<Main addAlert={addAlertHandler} />} />
        <Route path="/chat" element={<Main addAlert={addAlertHandler} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
