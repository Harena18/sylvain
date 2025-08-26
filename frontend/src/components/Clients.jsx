import AddClient from "./create/AddClient";
import React, { useEffect, useState } from "react";

function Creations() {
  const [refresh, setRefresh] = useState(false);
  const [active, setActive] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/clients/clients.php"
        );
        const data = await response.json();
        console.log(data.clients);

        setClients(data.clients);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [refresh]);

  return (
    <>
      <div className="px-5 py-12 rounded-2xl min-h-full">
        <div className="text-center font-bold text-2xl">Clients</div>
        <div className="bg-white p-0.5 w-full mb-4 mt-3"></div>

        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-b-1 bg-gray-500">
            ID
          </div>
          <div className="col-span-3 font-bold border-b-1 bg-gray-500 p-2">
            Nom
          </div>
          <div className="col-span-3 font-bold border-b-1 bg-gray-500 p-2">
            Prénoms
          </div>
          <div className="col-span-2 font-bold border-b-1 bg-gray-500 p-2">
            Téléphone
          </div>
          <div className="col-span-3 font-bold border-b-1 bg-gray-500 p-2">
            Email
          </div>

          {clients.map((client) => (
            <React.Fragment key={client.id}>
              <div className="col-span-1 p-2 border-b">{client.id}</div>
              <div className="col-span-3 p-2 border-b break-words max-w-[200px] sm:max-w-[350px]">
                {client.lastname}
              </div>
              <div className="col-span-3 p-2 border-b break-words max-w-[200px] sm:max-w-[350px]">
                {client.firstname}
              </div>
              <div className="col-span-2 p-2 border-b break-words max-w-[200px] sm:max-w-[350px]">
                {client.phone}
              </div>
              <div className="col-span-3 p-2 border-b break-words max-w-[200px] sm:max-w-[350px]">
                {client.email ? client.email : <span>&mdash;</span>}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setActive(!active);
            }}
            className="mt-15 bg-emerald-600 p-2 pt-2.5 font-bold rounded-x hover:bg-gray-700/40 transition-colors duration-200"
          >
            Ajouter un client
          </button>
        </div>
        {active ? (
          <AddClient setActive={setActive} setRefresh={setRefresh} />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Creations;
