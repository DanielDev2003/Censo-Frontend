import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import api from '../api';
import stateViewConfig from '../data/stateViewConfig';
import { Tooltip as ReactTooltip } from 'react-tooltip';


const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const MapaEstado = ({ sigla, ano }) => {
  const [geoData, setGeoData] = useState(null);
  const [dados, setDados] = useState([]);
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    const geoUrl = `https://raw.githubusercontent.com/luizpedone/municipal-brazilian-geodata/master/minified/${sigla}.min.json`;
    
    fetch(geoUrl)
      .then(res => res.json())
      .then(data => {
        console.log("GeoJSON carregado:", data);
        setGeoData(data);
      });

    api.get(`/instituicoes/matriculas_cidade?ano=${ano}&sigla=${sigla}`)
      .then(res => {
        setDados(res.data);
      });
  }, [sigla, ano]);

  const getCor = (nomeCidade) => {
    const cidade = dados.find(
      d => normalize(d.municipio) === normalize(nomeCidade)
    );
    return cidade ? cidade.matriculas : 0;
  };

  const escalaCor = scaleLinear()
    .domain([0, Math.max(...dados.map(d => d.matriculas || 0))])
    .range(["#e0f3f8", "#005824"]);

  return (
    <div>
      <h2>{stateViewConfig[sigla].name} - Ano {ano}</h2>

      {geoData && (
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: stateViewConfig[sigla].center,
            scale: stateViewConfig[sigla].scale,
          }}
        >
          <ZoomableGroup center={stateViewConfig[sigla].center}>
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const nomeGeo = geo.properties.NOME;
                  const cidade = dados.find(
                    d => normalize(d.municipio) === normalize(nomeGeo)
                  );

                  if (!cidade) {
                    console.warn("Não encontrou:", nomeGeo);
                  }

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={escalaCor(cidade?.matriculas || 0)}
                      stroke="#FFF"
                      data-tooltip-id="tooltip-id"
                      data-tooltip-content={tooltipContent}
                      onMouseEnter={() => {
                        console.log(`Cidade: ${nomeGeo}, Matrículas: ${cidade?.matriculas || 0}`);
                        if (cidade) {
                          setTooltipContent(`${nomeGeo} — Matrículas: ${cidade.matriculas}`);
                        } else {
                          setTooltipContent(`${nomeGeo} — Dados não encontrados`);
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("");
                      }}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#ffcc00", outline: "none" },
                        pressed: { outline: "none" }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      )}
      <ReactTooltip id="tooltip-id" />

    </div>
  );
};

export default MapaEstado;
