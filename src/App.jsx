import { useState } from 'react';
import Filtros from './components/Filtros';
import MapaBrasil from './components/MapaBrasil';
import MapaEstado from './components/MapaEstado';
import './App.css'
function App() {
  const [anoSelecionado, setAnoSelecionado] = useState(2023);
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);

  const handleEstadoClick = (sigla) => {
    setEstadoSelecionado(sigla);
  };

  const voltarAoMapaBrasil = () => {
    setEstadoSelecionado(null);
  };

  return (
      <div className="app-container">
        <div style={{ padding: '20px' }}>
          <h1>Censo Escolar</h1>

          <Filtros
            anoSelecionado={anoSelecionado}
            setAnoSelecionado={setAnoSelecionado}
            estadoSelecionado={estadoSelecionado}
            setEstadoSelecionado={setEstadoSelecionado}
          />

          {estadoSelecionado ? (
            <MapaEstado
              sigla={estadoSelecionado}
              ano={anoSelecionado}
              onVoltar={voltarAoMapaBrasil}
            />
          ) : (
            <MapaBrasil
              ano={anoSelecionado}
              onEstadoClick={handleEstadoClick}
            />
          )}
        </div>
      </div>
  );
}

export default App;
