import React, { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";

const url = "http://localhost/backend/personalization/personalization.php";

function Personalization() {
    const [personalisations, setPersonalisations] = useState([]);
    const [newPerso, setNewPerso] = useState({
        client_id: "",
        item_id: "",
        motif: "",
        date_fin: "",
        statut: "en cours",
        nombre_exemplaires: 1,
    });

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => setPersonalisations(data.personnalisations || []))
            .catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPerso),
            });
            const data = await response.json();
            if (data.status === "ok") {
                setPersonalisations([
                    ...personalisations,
                    {
                        ...newPerso,
                        id: data.id,
                        date_debut: new Date()
                            .toISOString()
                            .slice(0, 19)
                            .replace("T", " "),
                        client_nom: null,
                        item_nom: null,
                    },
                ]);
                setNewPerso({
                    client_id: "",
                    item_id: "",
                    motif: "",
                    date_fin: "",
                    statut: "en cours",
                });
            }
            if (data.status === "ok") {
                // Récupérer la liste complète après l'ajout
                const res = await fetch(url);
                const updated = await res.json();
                setPersonalisations(updated.personnalisations || []);

                setNewPerso({
                    client_id: "",
                    item_id: "",
                    motif: "",
                    date_fin: "",
                    statut: "en cours",
                    nombre_exemplaires: 1,
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async (id, updates) => {
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...updates }),
            });
            const data = await response.json();
            if (data.status === "ok") {
                setPersonalisations((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Supprimer cette personnalisation ?")) return;
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `id=${encodeURIComponent(id)}`,
            });
            const data = await response.json();
            if (data.status === "ok") {
                setPersonalisations((prev) => prev.filter((p) => p.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const [editBuffer, setEditBuffer] = useState({});
    const setEditField = (id, field, value) =>
        setEditBuffer((b) => ({
            ...b,
            [id]: { ...(b[id] || {}), [field]: value },
        }));

    const getBuffered = (id, field, fallback) =>
        (editBuffer[id] && editBuffer[id][field] !== undefined
            ? editBuffer[id][field]
            : fallback) ?? "";

    const [clients, setClients] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    "http://localhost/backend/clients/clients.php"
                );
                const data = await response.json();
                console.log(data.clients);

                setClients(data.clients);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    const [foundClient, setFoundClient] = useState({
        lastname: "",
        firstname: "",
    });

    const currentClient = (e) => {
        setFoundClient({
            ...foundClient,
            lastname: "",
            firstname: "",
        });
        const clientID = parseInt(e.target.value);
        const client = clients.find((u) => u.id === clientID);

        if (!client) return;

        setFoundClient({
            ...foundClient,
            lastname: client.lastname,
            firstname: client.firstname,
        });
    };

    // Fetch de tous les objets
    const [clothes, setClothes] = useState([]);
    const [display, setDisplay] = useState([]);
    const [tarpaulin, setTarpaulin] = useState([]);

    const [foundItem, setFoundItem] = useState({
        name: "",
    });

    const fetchAll = async () => {
        try {
            const response = await fetch(
                "http://localhost/backend/items/items.php"
            );
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
    }, []);

    const currentItem = (e) => {
        setFoundItem({
            name: null,
            size: null,
            length: null,
            width: null,
            format: null,
        });
        const id = parseInt(e.target.value);
        const item =
            clothes.find((c) => c.id === id) ||
            tarpaulin.find((t) => t.id === id) ||
            display.find((d) => d.id === id);

        if (!item) return;

        const selectedItem = {
            name: item.name,
            size: item.size || "",
            length: item.length || "",
            width: item.width || "",
            format: item.format || "",
        };

        setFoundItem(selectedItem);
    };

    return (
        <div className="p-4">
            <h2 className="text-center font-bold text-2xl">
                Personnalisations
            </h2>

            <div className="mt-3 border rounded-2xl py-10 px-5">
                <h3 className="font-bold text-lg">Nouvelle personnalisation</h3>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-2 mt-2"
                >
                    <input
                        type="number"
                        placeholder="ID Client"
                        value={newPerso.client_id}
                        onChange={(e) => {
                            setNewPerso({
                                ...newPerso,
                                client_id: e.target.value,
                            });
                            currentClient(e);
                        }}
                        required
                        className="p-2"
                    />
                    <input
                        type="number"
                        placeholder="ID Objet"
                        value={newPerso.item_id}
                        onChange={(e) => {
                            setNewPerso({
                                ...newPerso,
                                item_id: e.target.value,
                            });
                            currentItem(e);
                        }}
                        required
                        className="p-2"
                    />
                    <input
                        type="text"
                        placeholder="Motif"
                        value={newPerso.motif}
                        onChange={(e) =>
                            setNewPerso({
                                ...newPerso,
                                motif: e.target.value,
                            })
                        }
                        required
                        className="p-2"
                    />
                    <div className="font-bold">Date de fin</div>
                    <input
                        type="date"
                        value={newPerso.date_fin}
                        onChange={(e) =>
                            setNewPerso({
                                ...newPerso,
                                date_fin: e.target.value,
                            })
                        }
                        className="p-2"
                    />
                    <input
                        type="number"
                        placeholder="Nombre d'exemplaires"
                        value={newPerso.nombre_exemplaires}
                        onChange={(e) =>
                            setNewPerso({
                                ...newPerso,
                                nombre_exemplaires: e.target.value,
                            })
                        }
                        className="p-2"
                    />

                    <div className="font-bold">Statut</div>
                    <select
                        value={newPerso.statut}
                        onChange={(e) =>
                            setNewPerso({
                                ...newPerso,
                                statut: e.target.value,
                            })
                        }
                        className="p-2 mb-5"
                    >
                        <option value="en cours" className="text-black">
                            En cours
                        </option>
                        <option value="terminé" className="text-black">
                            Terminé
                        </option>
                        <option value="en retard" className="text-black">
                            En retard
                        </option>
                        <option value="récupéré" className="text-black">
                            Récupéré
                        </option>
                        <option value="livré" className="text-black">
                            Livré
                        </option>
                    </select>
                    <button
                        type="submit"
                        className="bg-green-600 text-white p-2 rounded font-bold"
                        onClick={() => {
                            setFoundClient({});
                            setFoundItem({});
                        }}
                    >
                        Ajouter
                    </button>
                </form>
            </div>
            <div className="p-5">
                {foundClient.lastname && foundClient.firstname ? (
                    <span className="font-bold col-span-1">
                        Nom du client :{" "}
                    </span>
                ) : null}
                {foundClient.lastname} {foundClient.firstname} <br />
                {foundItem.name ? (
                    <span className="font-bold col-span-1">Désignation : </span>
                ) : null}
                <span className="col-span-3">
                    {foundItem.name}
                    {foundItem.name ? <br /> : null}
                    {foundItem.size ? (
                        <span className="font-bold col-span-1">Taille : </span>
                    ) : null}
                    {foundItem.size}
                    {foundItem.size ? <br /> : null}
                    {foundItem.length ? (
                        <span className="font-bold col-span-1">
                            Longueur :{" "}
                        </span>
                    ) : null}
                    {foundItem.length}
                    {foundItem.length ? <br /> : null}
                    {foundItem.width ? (
                        <span className="font-bold col-span-1">Largeur : </span>
                    ) : null}
                    {foundItem.width}
                    {foundItem.width ? <br /> : null}
                    {foundItem.format ? (
                        <span className="font-bold col-span-1">Format : </span>
                    ) : null}
                    {foundItem.format}
                </span>
            </div>

            <div className="my-4 grid grid-cols-8">
                <div className="col-span-1 border-b-2 p-2 font-bold">
                    Client
                </div>
                <div className="col-span-1 border-b-2 p-2 font-bold">Objet</div>
                <div className="col-span-1 border-b-2 p-2 font-bold">Motif</div>
                <div className="col-span-1 border-b-2 p-2 font-bold">
                    Quantité
                </div>
                <div className="col-span-1 border-b-2 p-2 font-bold">Début</div>
                <div className="col-span-1 border-b-2 p-2 font-bold">Fin</div>
                <div className="col-span-1 border-b-2 p-2 font-bold">
                    Statut
                </div>
                <div className="col-span-1 border-b-2 p-2 font-bold">
                    Actions
                </div>

                {personalisations.map((p) => (
                    <React.Fragment key={p.id}>
                        <div className="col-span-1 border-b-2 p-2">
                            {p.client_nom
                                ? `${p.client_nom} (id:${p.client_id})`
                                : p.client_id}
                        </div>
                        <div className="col-span-1 border-b-2 p-2">
                            {p.item_nom
                                ? `${p.item_nom} (id:${p.item_id})`
                                : p.item_id}
                        </div>

                        <div className="col-span-1 border-b-2 p-2">
                            <input
                                className="p-1 border rounded w-full"
                                type="text"
                                value={getBuffered(p.id, "motif", p.motif)}
                                onChange={(e) => {
                                    setEditField(p.id, "motif", e.target.value);
                                }}
                            />
                        </div>

                        <div className="col-span-1 border-b-2 p-2">
                            {p.nombre_exemplaires}
                        </div>

                        <div className="col-span-1 border-b-2 p-2">
                            {p.date_debut}
                        </div>

                        <div className="col-span-1 border-b-2 p-2">
                            <input
                                className="p-1 border rounded w-full"
                                type="date"
                                value={getBuffered(
                                    p.id,
                                    "date_fin",
                                    (p.date_fin || "").slice(0, 10)
                                )}
                                onChange={(e) =>
                                    setEditField(
                                        p.id,
                                        "date_fin",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="col-span-1 border-b-2 p-2">
                            <select
                                className="p-1 border rounded w-full"
                                value={getBuffered(p.id, "statut", p.statut)}
                                onChange={(e) =>
                                    setEditField(p.id, "statut", e.target.value)
                                }
                            >
                                <option value="en cours" className="text-black">
                                    En cours
                                </option>
                                <option value="terminé" className="text-black">
                                    Terminé
                                </option>
                                <option
                                    value="en retard"
                                    className="text-black"
                                >
                                    En retard
                                </option>
                                <option value="récupéré" className="text-black">
                                    Récupéré
                                </option>
                                <option value="livré" className="text-black">
                                    Livré
                                </option>
                            </select>
                        </div>

                        <div className="col-span-1 border-b-2 p-2 flex gap-2">
                            <button
                                onClick={() =>
                                    handleUpdate(p.id, {
                                        motif: getBuffered(
                                            p.id,
                                            "motif",
                                            p.motif
                                        ),
                                        date_fin: getBuffered(
                                            p.id,
                                            "date_fin",
                                            (p.date_fin || "").slice(0, 10)
                                        ),
                                        statut: getBuffered(
                                            p.id,
                                            "statut",
                                            p.statut
                                        ),
                                    })
                                }
                                className="bg-blue-600 text-white px-3 py-1 rounded font-bold hover:bg-blue-700 transition-colors"
                            >
                                <Save size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(p.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded font-bold hover:bg-red-700 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default Personalization;
