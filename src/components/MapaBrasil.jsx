import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import api from '../api';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const geoUrl =
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson';

const MapaBrasil = ({ ano, onEstadoClick }) => {
  const [dados, setDados] = useState([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [projectionConfig] = useState({
    center: [-54, -15],
    scale: 800
  });
  useEffect(() => {
  api.get(`/instituicoes/matriculas_estado?ano=${ano}`).then((res) => {
    console.log("📦 Dados da API:", res.data);
    setDados(res.data);
  });
}, [ano]);

  const escalaCores = scaleLinear()
    .domain([0, Math.max(...dados.map((d) => d.matriculas))])
    .range(['#dceeff', '#007acc']);

  const getCor = (geo) => {
    const nomeGeo = geo.properties.name;
    const item = dados.find(d => normalize(d.estado) === normalize(nomeGeo));
    return item ? escalaCores(item.matriculas) : '#EEE';
  };

  return (
    <div>
      <h2>Mapa do Brasil - Ano {ano}</h2>
      <ComposableMap projection="geoMercator"
        projectionConfig={projectionConfig}
        style={{ width: '100%', height: 'auto' }}
        >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const nomeGeo = geo.properties.name;
              const item = dados.find(d => normalize(d.estado) === normalize(nomeGeo));
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onEstadoClick(geo.properties.sigla)}
                  onMouseEnter={() => {
                    setTooltipContent(item ?`${nomeGeo} — Matrículas: ${item.matriculas.toLocaleString()}` : nomeGeo);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent('');
                  }}
                  style={{
                    default: { fill: getCor(geo), outline: 'none' },
                    hover: { fill: '#ffcc00', outline: 'none' },
                    pressed: { fill: '#ff9900', outline: 'none' },
                  }}
                  data-tooltip-id="tooltip-brasil"
                  data-tooltip-content={tooltipContent}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <ReactTooltip id="tooltip-brasil" />
    </div>
  );
};

export default MapaBrasil;
