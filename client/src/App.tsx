import "./App.css";
import Header from "./components/Header.jsx";
import Main from "./components/Main";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Main></Main>
      <p className="text-lg text-green-400">Hello Vite + React!</p>
      <Footer></Footer>
    </div>
  );
}

export default App;
