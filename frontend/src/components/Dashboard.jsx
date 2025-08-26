import React, { useEffect, useState } from "react";

const url = "http://localhost/backend/personalization/personalization.php";

function Dashboard() {
    const [personalisations, setPersonalisations] = useState([]);
    const [stats, setStats] = useState({
        en_cours: 0,
        termines: 0,
        en_retard: 0,
        recupere: 0,
        livre: 0,
    });

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const list = data.personnalisations || [];
                setPersonalisations(list);

                const s = {
                    en_cours: 0,
                    termines: 0,
                    en_retard: 0,
                    recupere: 0,
                    livre: 0,
                };

                list.forEach((p) => {
                    switch (p.statut) {
                        case "en cours":
                            s.en_cours += 1;
                            break;
                        case "terminé":
                            s.termines += 1;
                            break;
                        case "en retard":
                            s.en_retard += 1;
                            break;
                        case "récupéré":
                            s.recupere += 1;
                            break;
                        case "livré":
                            s.livre += 1;
                            break;
                        default:
                            break;
                    }
                });
                setStats(s);
            })
            .catch(console.error);
    }, []);

    const statCards = [
        { label: "En cours", value: stats.en_cours, color: "bg-blue-500" },
        { label: "Terminés", value: stats.termines, color: "bg-green-500" },
        { label: "En retard", value: stats.en_retard, color: "bg-red-500" },
        { label: "Récupérés", value: stats.recupere, color: "bg-yellow-500" },
        { label: "Livrés", value: stats.livre, color: "bg-purple-500" },
    ];

    return (
        <div className="px-5 py-12 rounded-2xl min-h-full">
            <div className="text-center font-bold text-2xl">
                Tableau de bord
            </div>
            <div className="bg-white p-0.5 w-full mb-4 mt-3"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className={`p-5 rounded-xl shadow-md text-white flex flex-col justify-center items-center ${card.color}`}
                    >
                        <span className="text-lg font-semibold">
                            {card.label}
                        </span>
                        <span className="text-3xl font-bold">{card.value}</span>
                    </div>
                ))}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-blue-100/20">
                        <tr>
                            <th className="py-3 px-5 text-left">Client</th>
                            <th className="py-3 px-5 text-left">Objet</th>
                            <th className="py-3 px-5 text-left">Motif</th>
                            <th className="py-3 px-5 text-left">Début</th>
                            <th className="py-3 px-5 text-left">Fin</th>
                            <th className="py-3 px-5 text-left">Exemplaires</th>
                            <th className="py-3 px-5 text-left">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personalisations.map((p) => (
                            <tr
                                key={p.id}
                                className="border-b hover:bg-gray-50/10"
                            >
                                <td className="py-2 px-5">
                                    {p.client_nom || p.client_id}
                                </td>
                                <td className="py-2 px-5">
                                    {p.item_nom || p.item_id}
                                </td>
                                <td className="py-2 px-5">{p.motif}</td>
                                <td className="py-2 px-5">
                                    {p.date_debut?.slice(0, 10)}
                                </td>
                                <td className="py-2 px-5">
                                    {p.date_fin?.slice(0, 10) || "-"}
                                </td>
                                <td className="py-2 px-5">
                                    {p.nombre_exemplaires}
                                </td>
                                <td className="py-2 px-5">
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm ${
                                            p.statut === "en cours"
                                                ? "bg-blue-500"
                                                : p.statut === "terminé"
                                                ? "bg-green-500"
                                                : p.statut === "en retard"
                                                ? "bg-red-500"
                                                : p.statut === "récupéré"
                                                ? "bg-yellow-500"
                                                : "bg-purple-500"
                                        }`}
                                    >
                                        {p.statut}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;
