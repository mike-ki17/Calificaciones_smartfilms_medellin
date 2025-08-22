import { useEffect, useState } from 'react';

export default function Stats() {
  const [total, setTotal] = useState(0);
  const [byRoom, setByRoom] = useState([]);

  useEffect(() => {
    fetch('/shorts/pending/total')
      .then(res => res.json())
      .then(data => setTotal(data.total_pending));

    fetch('/shorts/pending/by-room')
      .then(res => res.json())
      .then(data => setByRoom(data));
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Estadísticas</h2>
      <p>Total de calificaciones pendientes: {total}</p>
      <ul>
        {byRoom.map(room => (
          <li key={room.room_id}>
            {room.room_name}  --- {room.pending_count} calificaciones faltan
          </li>
        ))}
      </ul>
    </div>
  );
}
