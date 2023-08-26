import React, { useState, useEffect } from "react";
import { Card, Row, Col, Tag, Empty, Spin, Select } from "antd";

import PokemonDetail from "./PokemonDetail";

import api from "../api/api";
import { getCardBackground, colors } from "../utils/color";

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        // change the limit as big as you want
        const limit = 100;
        const response = await api.get(`/pokemon?limit=${limit}&offset=0`);
        setPokemonList(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokemon list:", error);
      }
    };

    fetchPokemonList();
  }, []);

  useEffect(() => {
    const fetchPokemonDetailsBatched = async () => {
      const batchSize = 10;
      const batches = [];

      for (let i = 0; i < pokemonList.length; i += batchSize) {
        const batch = pokemonList.slice(i, i + batchSize);
        batches.push(batch);
      }

      const fetchBatch = async (batch) => {
        const batchPromises = batch.map((pokemon) =>
          api.get(`/pokemon/${pokemon.name}`),
        );
        const batchResponses = await Promise.all(batchPromises);

        const batchDetails = {};
        batchResponses.forEach((response, index) => {
          batchDetails[batch[index].name] = response.data;
        });

        setPokemonDetails((prevState) => ({
          ...prevState,
          ...batchDetails,
        }));
      };

      const fetchAllBatches = async () => {
        for (const batch of batches) {
          await fetchBatch(batch);
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      };

      fetchAllBatches();
    };

    fetchPokemonDetailsBatched();
  }, [pokemonList]);

  const handleTypeFilterSelect = (selectedValue) => {
    setSelectedTypes(selectedValue ? [selectedValue] : []);
  };

  const filteredPokemonList = pokemonList.filter((pokemon) => {
    if (selectedTypes.length === 0) {
      return true;
    }
    return selectedTypes.some((type) =>
      pokemonDetails[pokemon.name]?.types?.some(
        (pokemonType) => pokemonType.type.name === type,
      ),
    );
  });

  const handleOpenModal = (pokemon) => {
    setSelectedPokemon(pokemon);
    setVisibleModal(true);
  };

  const handleCloseModal = () => {
    setVisibleModal(false);
  };

  return (
    <div className="pokemon-list">
      <div className="filter">
        <h4>Type</h4>
        <Select
          allowClear
          placeholder="Select One"
          onChange={handleTypeFilterSelect}
          style={{ width: 200 }}
        >
          {Object.keys(colors).map((type) => (
            <Select.Option key={type} value={type}>
              <span style={{ textTransform: "capitalize" }}>{type}</span>
            </Select.Option>
          ))}
        </Select>
      </div>
      {loading ? (
        <div className="filter">
          <Spin />
        </div>
      ) : filteredPokemonList.length === 0 ? (
        <div className="filter">
          <Empty />
        </div>
      ) : (
        <Row gutter={[54, 54]}>
          {filteredPokemonList.map((pokemon) => (
            <Col xs={24} sm={12} md={8} lg={6} key={pokemon.name}>
              <Card
                title={pokemon.name}
                className="pokemon-card"
                style={{
                  background: getCardBackground(
                    pokemonDetails[pokemon.name]?.types,
                  ),
                }}
                onClick={
                  pokemonDetails[pokemon.name]
                    ? () => handleOpenModal(pokemonDetails[pokemon.name])
                    : () => {}
                }
              >
                <div className="card-content">
                  {pokemonDetails[pokemon.name] ? (
                    <>
                      <img
                        src={
                          pokemonDetails[pokemon.name]?.sprites?.other
                            ?.dream_world?.front_default ||
                          pokemonDetails[pokemon.name]?.sprites?.other?.[
                            "official-artwork"
                          ]?.front_default
                        }
                        alt={pokemon.name}
                        height={100}
                      />
                      <div className="type-tags">
                        {pokemonDetails[pokemon.name].types.map((type) => (
                          <Tag
                            key={type.type.name}
                            className="tag-style"
                            style={{
                              "--tag-background-color": colors[type.type.name],
                            }}
                          >
                            <span className="tag-text">{type.type.name}</span>
                          </Tag>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="loading">
                      <div className="loading-image" />
                      <div className="loading-types" />
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <PokemonDetail
        visible={visibleModal}
        pokemon={selectedPokemon}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PokemonList;
