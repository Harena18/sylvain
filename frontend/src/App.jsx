import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Creations from "./components/Creations";
import Clients from "./components/Clients";
import Personalization from "./components/Personalization";

function App() {
  return (
    <>
      <div className="bg-gray-800 flex min-h-screen text-white bg-gradient-to-bl from-blue-950">
        <Navbar />
        <main className="flex-1 px-7 py-7 pt-15 sm:pt-7">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/personalization" element={<Personalization />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/creations" element={<Creations />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
