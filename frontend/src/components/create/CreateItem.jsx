import { useState } from "react";

class Item {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}
class Clothes extends Item {
    constructor(name, size) {
        super(name, "Clothes");
        this.size = size;
    }
}
class Tarpaulin extends Item {
    constructor(name, length, width) {
        super(name, "Tarpaulin");
        this.length = length;
        this.width = width;
    }
}

class Display extends Item {
    constructor(name, format) {
        super(name, "Display");
        this.format = format;
    }
}

function Create({ setActive, setRefresh }) {
    //Inputs
    const [name, setName] = useState("");
    const [size, setSize] = useState("");
    const [dimensions, setDimensions] = useState({
        length: "",
        width: "",
    });
    const [format, setFormat] = useState("");

    const choices = [
        {
            key: 1,
            value: "Vêtement",
        },
        {
            key: 2,
            value: "Bâche",
        },
        {
            key: 3,
            value: "Affichage",
        },
    ];
    // 1
    const sizes = [
        { key: 0, value: "Aucun" },
        { key: 1, value: "S" },
        { key: 2, value: "M" },
        { key: 3, value: "L" },
        { key: 4, value: "XL" },
        { key: 5, value: "XXL" },
    ];
    // 3
    const formats = [
        { key: 0, value: "Aucun" },
        { key: 1, value: "A2" },
        { key: 2, value: "A3" },
        { key: 3, value: "A4" },
        { key: 4, value: "A5" },
        { key: 5, value: "A6" },
        { key: 6, value: "A7" },
    ];
    const [choice, setChoice] = useState(1);

    const sendObject = {
        clothes: async (clothe) => {
            console.log(clothe);

            const response = await fetch(
                "http://localhost/backend/items/items.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        object: clothe,
                    }),
                }
            );
            const data = await response.json();
            console.log(data);
        },
        tarpaulin: async (tarpaulin) => {
            const response = await fetch(
                "http://localhost/backend/items/items.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        object: tarpaulin,
                    }),
                }
            );
            const data = await response.json();
            console.log(data);
        },
        display: async (display) => {
            const response = await fetch(
                "http://localhost/backend/items/items.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        object: display,
                    }),
                }
            );
            const data = await response.json();
            console.log(data);
        },
    };

    const validate = (key) => {
        switch (key) {
            case 1: {
                const clothe = new Clothes(name, size);
                sendObject.clothes(clothe);
                break;
            }
            case 2: {
                const tarpaulin = new Tarpaulin(
                    name,
                    parseInt(dimensions.length),
                    parseInt(dimensions.width)
                );
                sendObject.tarpaulin(tarpaulin);
                break;
            }
            case 3: {
                const display = new Display(name, format);
                sendObject.display(display);
                break;
            }
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                <div className="px-5 py-5 z-30 bg-blue-950 rounded-xl w-96 relative">
                    <div
                        className="absolute top-3 pt-1.5 right-3 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-900 text-white font-bold"
                        onClick={() => setActive(false)}
                    >
                        ✕
                    </div>

                    <div className="pt-2 text-center font-bold text-xl mb-3">
                        Créer un objet
                    </div>
                    <div className="bg-white p-0.5 w-full mb-4"></div>
                    <div className="grid grid-cols-12 gap-2 items-center">
                        <label htmlFor="name" className="col-span-4">
                            Désignation
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="bg-gray-50 text-black rounded p-1 col-span-8 placeholder:italic"
                            placeholder="Nom de l'objet..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label htmlFor="categorie" className="col-span-4">
                            Catégorie
                        </label>
                        <select
                            id="size"
                            className={`col-span-8 p-2 pr-26 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"`}
                            onChange={(e) => setChoice(Number(e.target.value))}
                        >
                            {choices.map((choice) => (
                                <option key={choice.key} value={choice.key}>
                                    {choice.value}
                                </option>
                            ))}
                        </select>

                        {/* Vêtements */}
                        <label
                            htmlFor="size"
                            className={`${
                                choice === 1 ? "" : "hidden"
                            } col-span-4`}
                        >
                            Taille
                        </label>
                        <select
                            id="size"
                            className={`${
                                choice === 1 ? "" : "hidden"
                            } col-span-8 p-2 pr-26 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        >
                            {sizes.map((size) => (
                                <option key={size.key} value={size.value}>
                                    {size.value}
                                </option>
                            ))}
                        </select>

                        {/* Bâche */}
                        <label
                            htmlFor="size"
                            className={`${
                                choice === 2 ? "" : "hidden"
                            } col-span-4`}
                        >
                            Dimensions
                        </label>
                        <div
                            className={`${
                                choice === 2 ? "" : "hidden"
                            } col-span-8 text-black`}
                        >
                            <div className="grid grid-cols-12 items-center">
                                <input
                                    type="text"
                                    name=""
                                    id=""
                                    className="col-span-5 bg-white rounded p-1"
                                    placeholder="Longueur"
                                    value={dimensions.length}
                                    onChange={(e) =>
                                        setDimensions({
                                            ...dimensions,
                                            length: e.target.value,
                                        })
                                    }
                                />
                                <div className="col-span-2"></div>
                                <input
                                    type="text"
                                    name=""
                                    id=""
                                    className="col-span-5 bg-white rounded p-1"
                                    placeholder="Largeur"
                                    value={dimensions.width}
                                    onChange={(e) =>
                                        setDimensions({
                                            ...dimensions,
                                            width: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Affichage */}
                        <label
                            htmlFor="size"
                            className={`${
                                choice === 3 ? "" : "hidden"
                            } col-span-4`}
                        >
                            Format
                        </label>
                        <select
                            id="size"
                            className={`${
                                choice === 3 ? "" : "hidden"
                            } col-span-8 p-2 pr-26 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                        >
                            {formats.map((format) => (
                                <option key={format.key} value={format.value}>
                                    {format.value}
                                </option>
                            ))}
                        </select>
                        <div className="col-span-12 flex justify-center pt-10 pb-4">
                            <button
                                className="bg-emerald-600 p-2 pt-2.5 font-bold rounded-x hover:bg-gray-700/40 transition-colors duration-200"
                                onClick={() => {
                                    validate(choice);
                                    setActive(false);
                                    setRefresh((prev) => !prev);
                                }}
                            >
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Create;
