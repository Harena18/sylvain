import { useState } from "react";

function AddClient({ setActive, setRefresh }) {
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const sendClient = async (client) => {
    try {
      const response = await fetch(
        "http://localhost:8000/clients/clients.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ client }),
        }
      );
      const data = await response.json();
      console.log(data);
      setActive(false);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error(err);
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
            Ajouter un client
          </div>
          <div className="bg-white p-0.5 w-full mb-6"></div>

          <div className="grid grid-cols-12 items-center gap-3">
            <label htmlFor="lastname" className="col-span-4">
              Nom*
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              className="p-1 rounded col-span-8 bg-white placeholder:italic text-black"
              placeholder="Saisir le nom..."
              required
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <label htmlFor="firstname" className="col-span-4">
              Prénoms*
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              className="p-1 rounded col-span-8 bg-white placeholder:italic text-black"
              placeholder="Saisir les prénoms..."
              required
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <label htmlFor="phone" className="col-span-4">
              Téléphone*
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="p-1 rounded col-span-8 bg-white placeholder:italic text-black"
              placeholder="03x xx xxx xx"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label htmlFor="email" className="col-span-4">
              E-mail
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="p-1 rounded col-span-8 bg-white placeholder:italic text-black"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="col-span-12 italic text-center text-sm">
              <span className="font-bold">*</span> : Champ obligatoire.
            </div>

            <div className="col-span-12 flex justify-center pt-4 pb-4">
              <button
                className="bg-emerald-600 p-2 pt-2.5 font-bold rounded-x hover:bg-gray-700/40 transition-colors duration-200"
                onClick={() => {
                  sendClient({
                    lastname: lastname,
                    firstname: firstname,
                    phone: phone,
                    email: email,
                  });
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

export default AddClient;
