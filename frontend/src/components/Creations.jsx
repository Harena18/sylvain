import { Trash2 } from "lucide-react";
import Create from "./create/CreateItem";
import React, { useEffect, useState } from "react";

function Creations() {
  const [refresh, setRefresh] = useState(false);
  const [active, setActive] = useState(false);
  const [clothes, setClothes] = useState([]);
  const [display, setDisplay] = useState([]);
  const [tarpaulin, setTarpaulin] = useState([]);

  const fetchAll = async () => {
    try {
      const response = await fetch("http://localhost:8000/items/items.php");
      const data = await response.json();
      setClothes(data.clothes || []);
      setDisplay(data.display || []);
      setTarpaulin(data.tarpaulin || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [refresh]);

  const handleDeleteItem = async (id) => {
    if (!confirm(`Supprimer l'objet #${id} ?`)) return;
    try {
      const res = await fetch(
        `http://localhost:8000/items/items.php?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.status === "ok") {
        setRefresh((r) => !r);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="px-5 py-12 rounded-2xl min-h-full">
        <div className="text-center font-bold text-2xl">Créations</div>
        <div className="bg-white p-0.5 w-full mb-4 mt-3"></div>

        <div className="text-center text-xl font-bold bg-gray-500 p-2">
          Vêtements
        </div>
        <div className="text-center mb-5 grid grid-cols-12">
          <div className="col-span-1 border-y p-2 font-bold bg-amber-50/10">
            ID
          </div>
          <div className="col-span-5 border-y p-2 font-bold bg-amber-50/10">
            Désignation
          </div>
          <div className="col-span-4 border-y p-2 font-bold bg-amber-50/10">
            Taille
          </div>
          <div className="col-span-2 border-y p-2 font-bold bg-amber-50/10">
            Actions
          </div>
          {clothes.map((clothe) => (
            <React.Fragment key={clothe.id}>
              <div className="col-span-1 border-y p-2">{clothe.id}</div>
              <div className="col-span-5 border-y p-2">{clothe.name}</div>
              <div className="col-span-4 border-y p-2">{clothe.size}</div>
              <div className="col-span-2 border-y p-2">
                <button
                  onClick={() => handleDeleteItem(clothe.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded font-bold hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="text-center text-xl font-bold bg-gray-500 p-2">
          Bâches
        </div>
        <div className="text-center mb-5 grid grid-cols-12">
          <div className="col-span-1 border-y p-2 font-bold bg-amber-50/10">
            ID
          </div>
          <div className="col-span-5 border-y p-2 font-bold bg-amber-50/10">
            Désignation
          </div>
          <div className="col-span-2 border-y p-2 font-bold bg-amber-50/10">
            Longueur
          </div>
          <div className="col-span-2 border-y p-2 font-bold bg-amber-50/10">
            Largeur
          </div>
          <div className="col-span-2 border-y p-2 font-bold bg-amber-50/10">
            Actions
          </div>
          {tarpaulin.map((t) => (
            <React.Fragment key={t.id}>
              <div className="col-span-1 border-y p-2">{t.id}</div>
              <div className="col-span-5 border-y p-2">{t.name}</div>
              <div className="col-span-2 border-y p-2">{t.length}</div>
              <div className="col-span-2 border-y p-2">{t.width}</div>
              <div className="col-span-2 border-y p-2">
                <button
                  onClick={() => handleDeleteItem(t.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded font-bold hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="text-center text-xl font-bold bg-gray-500 p-2">
          Affichages
        </div>
        <div className="text-center mb-5 grid grid-cols-12">
          <div className="col-span-1 border-y p-2 font-bold bg-amber-50/10">
            ID
          </div>
          <div className="col-span-7 border-y p-2 font-bold bg-amber-50/10">
            Désignation
          </div>
          <div className="col-span-2 border-y p-2 font-bold bg-amber-50/10">
            Format
          </div>
          <div className="col-span-2 border-y p-2 font-bold bg-amber-50/10">
            Actions
          </div>
          {display.map((d) => (
            <React.Fragment key={d.id}>
              <div className="col-span-1 border-y p-2">{d.id}</div>
              <div className="col-span-7 border-y p-2">{d.name}</div>
              <div className="col-span-2 border-y p-2">{d.format}</div>
              <div className="col-span-2 border-y p-2">
                <button
                  onClick={() => handleDeleteItem(d.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded font-bold hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
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
            Créer un objet
          </button>
        </div>
        {active ? <Create setActive={setActive} setRefresh={setRefresh} /> : ""}
      </div>
    </>
  );
}

export default Creations;
