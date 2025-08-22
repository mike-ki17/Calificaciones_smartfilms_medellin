import { useEffect, useState } from 'react';
import './Shorts.css'; // Aquí va el CSS profesional que definiremos después

export default function Shorts({ roomId }) {
  const [shorts, setShorts] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, rated: 0 });
  const [modalShort, setModalShort] = useState(null);
  const [rating, setRating] = useState(5);

  // Traer shorts y estadísticas
const fetchShorts = () => {
  fetch(`/rooms/${roomId}/shorts`)
    .then(res => res.json())
    .then(data => {
      // Validamos qué shorts ya tienen calificación
      const processedData = data.map(s => ({
        ...s,
        isRated: s.rating !== null // nueva propiedad para indicar que ya fue calificado
      }));

      // Ordenar: los no calificados primero, los calificados al final
      processedData.sort((a, b) => a.isRated - b.isRated);

      setShorts(processedData);

      const total = processedData.length;
      const rated = processedData.filter(s => s.isRated).length;
      setStats({ total, rated, pending: total - rated });
    })
    .catch(err => console.error(err));
};


  useEffect(() => {
    fetchShorts();
  }, [roomId]);

  // Manejo de calificación
  const handleRate = async (shortId, ratingValue) => {
    try {
      await fetch(`/rooms/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortId, rating: ratingValue })
      });

      // Actualizar el estado local para cambiar el botón a "Editar"
      setShorts(prev =>
        prev.map(short =>
          short.id === shortId ? { ...short, rating: ratingValue } : short
        )
      );

      setModalShort(null);
    } catch (error) {
      console.error(error);
      alert('Error al enviar calificación');
    }
  };

  // Render de estrellas interactivas
  const renderStars = (value) => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <span key={i} className={`star ${i <= value ? 'filled' : ''}`}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="shorts-container">
      {/* Estadísticas arriba */}
      <div className="stats-bar">
        <div className="stat">
          <p>Total de shorts</p>
          <span>{stats.total}</span>
        </div>
        <div className="stat">
          <p>Calificados</p>
          <span>{stats.rated}</span>
        </div>
        <div className="stat">
          <p>Pendientes</p>
          <span>{stats.pending}</span>
        </div>
      </div>

      <h2>Shorts de la sala {roomId}</h2>

      {/* Tarjetas de shorts */}
      <div className="cards-grid">
        {shorts.map(short => (
          <div key={short.id} className={`short-card ${short.isRated ? 'rated-card' : ''}`}>
            <div className="card-header">
              <h3>{short.title}</h3>
              {short.rating && <span className="badge">Calificado: {short.rating} ⭐</span>}
            </div>
            <p className="director">{short.director}</p>
            <p className="description">{short.description}</p>

            <div className="card-actions">
  <button
    className="range-btn"
    onClick={() => { setModalShort(short); setRating(short.rating || 5); }}
  >
    {short.isRated ? 'Editar calificación' : 'Calificar'}
  </button>
</div>

          </div>
        ))}
      </div>

      {/* Modal de calificación */}
      {modalShort && (
        <div className="modal-overlay" onClick={() => setModalShort(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{modalShort.rating ? 'Editar' : 'Calificar'} {modalShort.title}</h3>
            <div className="stars-container">{renderStars(Math.round(rating * 2) / 2)}</div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
            />
            <p>Valor: {rating}</p>
            <button onClick={() => handleRate(modalShort.id, rating)}>Enviar</button>
            <button className="close-btn" onClick={() => setModalShort(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
