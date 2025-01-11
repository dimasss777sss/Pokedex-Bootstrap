import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    const response = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=100"
    );
    const pokemonData = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const details = await axios.get(pokemon.url);
        return {
          name: details.data.name,
          avatar: details.data.sprites.front_default,
          types: details.data.types.map((type) => type.type.name),
          stats: details.data.stats.map((stat) => ({
            name: stat.stat.name,
            value: stat.base_stat,
          })),
        };
      })
    );
    setPokemons(pokemonData);
  };

  const filteredPokemons = pokemons
    .filter((pokemon) => pokemon.name.includes(search.toLowerCase()))
    .filter((pokemon) =>
      selectedTypes.length === 0
        ? true
        : pokemon.types.some((type) => selectedTypes.includes(type))
    );

  const paginatedPokemons = filteredPokemons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleTypeFilter = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">
        <span
          className="text-primary"
          style={{
            textShadow: "2px 2px 4px rgba(109, 105, 105, 0.5)",
          }}
        >
          Poke
        </span>
        <span
          className="text-danger"
          style={{
            textShadow: "2px 2px 4px rgba(104, 98, 98, 0.5)",
          }}
        >
          dex
        </span>
      </h1>

      <div className="mb-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-4 text-center">
        {["bug", "electric", "fire", "grass", "normal", "poison", "water"].map(
          (type) => (
            <button
              key={type}
              onClick={() => toggleTypeFilter(type)}
              className={`btn btn-sm me-2 mb-2 shadow ${
                selectedTypes.includes(type)
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
            >
              {type}
            </button>
          )
        )}
      </div>

      <div className="row">
        {paginatedPokemons.map((pokemon, index) => (
          <div key={index} className="col-sm-6 col-lg-4 mb-4">
            <div className="card shadow h-100 ">
              <img
                src={pokemon.avatar}
                alt={pokemon.name}
                className="card-img-top mx-auto d-block"
                style={{ width: "120px", height: "120px" }}
              />
              <div className="card-body">
                <h5 className="card-title text-center">{pokemon.name}</h5>
                <div className="d-flex justify-content-center mb-2">
                  {pokemon.types.map((type, idx) => (
                    <span
                      key={idx}
                      className={`badge me-1 ${
                        type === "fire"
                          ? "bg-danger"
                          : type === "water"
                          ? "bg-primary"
                          : type === "grass"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <ul className="list-group list-group-flush">
                  {pokemon.stats.map((stat, idx) => (
                    <li key={idx} className="list-group-item">
                      <strong>{stat.name}:</strong> {stat.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
        <nav aria-label="Page navigation" className="mb-3 mb-md-0">
          <ul className="pagination pagination-sm justify-content-center mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
            </li>
            {Array.from(
              { length: Math.ceil(filteredPokemons.length / itemsPerPage) },
              (_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              )
            )}
            <li
              className={`page-item ${
                currentPage ===
                Math.ceil(filteredPokemons.length / itemsPerPage)
                  ? "disabled"
                  : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(filteredPokemons.length / itemsPerPage)
                    )
                  )
                }
              >
                Next
              </button>
            </li>
          </ul>
        </nav>

        {/* Items Per Page */}
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle btn-sm"
            type="button"
            id="itemsPerPageDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {itemsPerPage} per page
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="itemsPerPageDropdown"
          >
            {[10, 20, 50].map((count) => (
              <li key={count}>
                <button
                  className={`dropdown-item ${
                    itemsPerPage === count ? "active" : ""
                  }`}
                  onClick={() => setItemsPerPage(count)}
                >
                  {count} per page
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
