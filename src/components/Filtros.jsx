import React, { useEffect, useState } from 'react';
import api from '../api';

const Filtros = ({ anoSelecionado, setAnoSelecionado, estadoSelecionado, setEstadoSelecionado }) => {
  const [anos, setAnos] = useState([]);
  const [ufs, setUfs] = useState([]);

  useEffect(() => {
    api.get('/instituicoes/anos').then((res) => setAnos(res.data));
    api.get('/ufs').then((res) => setUfs(res.data));
  }, []);

  return (
    <div style={{ marginBottom: '20px' }}>
      <label>
        Ano:
        <select
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}
          style={{ marginRight: '20px' }}
        >
          {anos.map((item, idx) => (
            <option key={idx} value={item.ano}>
              {item.ano}
            </option>
          ))}
        </select>
      </label>

      <label>
        Estado:
        <select
          value={estadoSelecionado || ''}
          onChange={(e) => setEstadoSelecionado(e.target.value || null)}
        >
          <option value="">Todos os estados</option>
          {ufs.map((uf) => (
            <option key={uf.co_uf} value={uf.sg_uf}>
              {uf.sg_uf} - {uf.no_uf}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Filtros;
