import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pokemonList, setPokemonList] = useState([]); // Stores Pokémon names

  // ✅ Fetch Pokémon List on Mount (if needed)
  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=1302")
      .then((response) => {
        setPokemonList(response.data.results.map((p) => p.name));
      })
      .catch((error) => console.error("Error fetching Pokémon list:", error));
  }, []);

  // ✅ Function to Fetch Pokémon Details
  const fetchPokemon = async () => {
    if (!name.trim()) return;

    setLoading(true);
    setPokemon(null);
    setFailed(false);

    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
      );
      setPokemon(response.data);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
      setFailed(true);
    } finally {
      setLoading(false);
      setName("");
    }
  };

  // ✅ Allow "Enter" Key to Search
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchPokemon();
    }
  };

  return (
    <div className="App">
      <div>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter Pokémon name"
          list="pokemon-options"
        />
        <button onClick={fetchPokemon} disabled={!name.trim()}>
          🔍 pika-kapi
        </button>
      </div>

      <datalist id="pokemon-options">
        {pokemonList.map((p, index) => (
          <option key={index} value={p} />
        ))}
      </datalist>

      {loading ? (
        <p>Loading... ⏳</p>
      ) : failed ? (
        <p>❌ Oops! No Pokémon found. Check the spelling and try again.</p>
      ) : pokemon ? (
        <div>
          <h1>{pokemon.name.toUpperCase()}</h1>
          <img
            src={pokemon.sprites?.other?.dream_world?.front_default}
            alt={pokemon.name}
            style={{ width: "150px" }}
          />
          <h3>Abilities:</h3>
          <ul>
            {pokemon.abilities.map((ability, index) => (
              <li key={index}>{ability.ability.name}</li>
            ))}
          </ul>
          <h3>Type:</h3>
          <ul>
            {pokemon.types.map((poke, key) => (
              <li key={key}>{poke.type.name}</li>
            ))}
          </ul>
          <h3>Weight:</h3>
          <p>{pokemon.weight}</p>
        </div>
      ) : (
        <p>🔍 Search for your favorite Pokémon by name! Gotta catch 'em all! 🐾</p>
      )}
    </div>
  );
}

export default App;
