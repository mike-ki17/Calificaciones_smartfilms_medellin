import { useEffect, useState } from "react";
import '../App.css'

export default function Rooms({ onSelectRoom }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="rooms-container">
      {rooms.map((room) => (
        <button
          key={room.id}
          className="room-btn"
          onClick={() => onSelectRoom(room)}
        >
          {room.name}
        </button>
      ))}
    </div>
  );
}
