import { useState } from 'react';
import Rooms from './components/Rooms.jsx';
import Shorts from './components/Shorts.jsx';
import Stats from './components/Stats.jsx';

function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>Shorts por Sala</h1>
      <Rooms onSelectRoom={setSelectedRoom} />
      {selectedRoom && <Shorts roomId={selectedRoom.id} />}
      <Stats />
    </div>
  );
}

export default App;
