import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-0 w-10 h-10 ml-2 flex items-center justify-center z-50 text-2xl rounded-xl sm:hidden hover:bg-blue-700/40 transition-colors duration-200"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <div
        className={`sm:translate-x-0 sm:relative z-40 w-64 fixed inset-y-0 left-0 bg-gray-800 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } bg-gradient-to-bl from-blue-900`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <img src="image.png" alt="" />

          <div className="font-bold text-2xl mb-2 text-center">
            Gestion de personnalisations
          </div>
          <div className="bg-white p-0.5 w-full mb-4"></div>
          <Link
            to="/"
            className="hover:bg-blue-700/50 p-3 transition-colors duration-200 w-full text-center"
            onClick={() => setOpen(false)}
          >
            Tableau de bord
          </Link>
          <Link
            to="/clients"
            className="hover:bg-blue-700/50 p-3 transition-colors duration-200 w-full text-center"
            onClick={() => setOpen(false)}
          >
            Clients
          </Link>
          <Link
            to="/personalization"
            className="hover:bg-blue-700/50 p-3 transition-colors duration-200 w-full text-center"
            onClick={() => setOpen(false)}
          >
            Personnalisations
          </Link>
          <Link
            to="/creations"
            className="hover:bg-blue-700/50 p-3 transition-colors duration-200 w-full text-center"
            onClick={() => setOpen(false)}
          >
            Créations
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
