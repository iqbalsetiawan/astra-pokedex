import React, { useEffect, useState } from "react";
import { Modal, Tag, Row, Col, Statistic, Spin } from "antd";

import api from "../api/api";
import { colors, getCardBackground } from "../utils/color";

const PokemonDetail = ({ visible, pokemon, onClose }) => {
  const [speciesInfo, setSpeciesInfo] = useState(null);

  useEffect(() => {
    const fetchSpeciesInfo = async () => {
      if (pokemon) {
        try {
          const response = await api.get(pokemon.species.url);
          setSpeciesInfo(
            response.data.flavor_text_entries.filter(
              (desc) => desc.language.name === "en",
            )[0],
          );
        } catch (error) {
          console.error("Error fetching species info:", error);
        }
      }
    };

    fetchSpeciesInfo();
  }, [pokemon]);

  const handleCloseModal = () => {
    setSpeciesInfo(null);
    onClose();
  };

  return (
    <Modal
      open={visible}
      title=""
      onCancel={handleCloseModal}
      footer={null}
      className="modal-content"
      width={1000}
      style={{
        "--background": pokemon ? getCardBackground(pokemon.types) : "",
      }}
      centered
    >
      <Row gutter={[16, 16]} style={{ marginTop: 30 }}>
        <Col xs={24} sm={24} md={24} lg={6} className="info__container__img">
          {pokemon && (
            <div>
              <h1>{pokemon.name}</h1>
              <img
                src={
                  pokemon?.sprites?.other?.dream_world?.front_default ||
                  pokemon?.sprites?.other?.["official-artwork"]?.front_default
                }
                alt={pokemon.name}
                height={150}
              />
              <div className="type-tags">
                {pokemon.types.map((type) => (
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
              <div style={{ marginTop: "20px" }}>
                <p>Height: {pokemon.height / 10} cm</p>
                <p>Weight: {pokemon.weight / 10} kg</p>
              </div>
            </div>
          )}
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} className="info__container__data">
          {pokemon && speciesInfo ? (
            <>
              <div className="info__container_each">
                <h2>About</h2>
                <Row>
                  <Col key={speciesInfo.flavor_text} span={24}>
                    <Statistic value={speciesInfo.flavor_text} />
                  </Col>
                </Row>
              </div>
              <div className="info__container_each">
                <h2>Stats</h2>
                <Row>
                  {pokemon.stats.map((stat) => (
                    <Col key={`${stat.stat.name}: ${stat.base_stat}`} span={12}>
                      <Statistic
                        title={stat.stat.name}
                        value={stat.base_stat}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
              <div className="info__container_each">
                <h2>Abilities</h2>
                <Row>
                  {pokemon.abilities.map((ability) => (
                    <Col key={ability.ability.name} span={12}>
                      <Statistic value={ability.ability.name} />
                    </Col>
                  ))}
                </Row>
              </div>
            </>
          ) : (
            <div className="info__container_each_loading">
              <Spin size="large" />
            </div>
          )}
        </Col>
      </Row>
    </Modal>
  );
};

export default PokemonDetail;
