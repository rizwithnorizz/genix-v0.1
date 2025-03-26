import React, { useState } from 'react';
import Layout  from '@/Components/ui/layout';
interface Room {
  id: number;
  name: string;
  building: string;
  roomType: string;
}

const RoomPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: 'A-101', building: 'A', roomType: 'Lecture' },
    { id: 2, name: 'A-303', building: 'A', roomType: 'Laboratory' },
    { id: 3, name: 'B-401', building: 'B', roomType: 'Lecture' },
    { id: 4, name: 'H-202', building: 'H', roomType: 'Seminar' },
  ]);
  const [showMenuIndex, setShowMenuIndex] = useState<number | null>(null);

  const handleEdit = (room: Room) => {
    console.log('Edit:', room);
  };

  const handleDelete = (room: Room) => {
    console.log('Delete:', room);
  };

  const toggleMenu = (index: number) => {
    setShowMenuIndex(prev => (prev === index ? null : index));
  };

  return (
    <Layout>
      <main className="col-span-3 space-y-4">
        <h1 className="font-bold text-2xl mb-4">Rooms</h1>

        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <h2 className="font-semibold text-lg mb-2">List of Rooms</h2>
          <div className="space-y-4">
            {rooms.map((room, idx) => (
              <div key={idx} className="bg-gray-800 text-white p-2 rounded-full flex justify-between items-center shadow relative">
                <div className="flex items-center">
                  <div className="bg-white w-10 h-10 rounded-full mr-4"></div>
                  <span>{room.building}</span>
                  <span className="ml-2">{room.name}</span>
                </div>
                <button onClick={() => toggleMenu(idx)} className="pr-5 text-4xl focus:outline-none relative z-10">&#x22EE;</button>
                {showMenuIndex === idx && (
                  <div className="absolute bg-gray-300 rounded-lg shadow-lg p-4 right-0 top-full mt-2 z-20">
                    <button onClick={() => handleEdit(room)} className="block w-full text-left p-2 hover:bg-gray-200">Edit Room Details</button>
                    <button onClick={() => handleDelete(room)} className="block w-full text-left p-2 hover:bg-gray-200">Delete Room</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Room Name..." className="p-2 rounded-lg border" />
          <input type="text" placeholder="Building..." className="p-2 rounded-lg border" />
          <select className="p-2 rounded-lg border">
            <option>Room Type</option>
          </select>

          <button className="bg-green-500 text-white p-2 rounded-lg">Create Room</button>
        </div>
      </main>
    </Layout>
  );
};

export default RoomPage;