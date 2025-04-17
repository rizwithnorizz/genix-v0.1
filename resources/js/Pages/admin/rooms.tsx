import React, { useEffect, useState } from 'react';
import Layout  from '@/Components/ui/layout';
import axios from 'axios';
interface Room {
  id: number;
  room_number: string;
  room_type: string;
}

const RoomPage: React.FC = () => {
  const [roomList, setRoomList] = useState<Room[] | null>(null);
  const handleGetRooms = async () => {
    try {
      const response = await axios.get('/api/get-rooms');
      setRoomList(response.data.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }

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
  useEffect(() => {
    handleGetRooms();
  }, []);
  return (
    <Layout>
      <main className="col-span-3 space-y-4">
        <h1 className="font-bold text-2xl mb-4">Rooms</h1>

        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <h2 className="font-semibold text-lg mb-2">List of Rooms</h2>
          <div className="space-y-4">
            {roomList?.map((room, idx) => (
              <div key={idx} className="bg-gray-800 text-white p-2 rounded-full flex justify-between items-center shadow relative">
                <div className="flex items-center">
                  <div className="bg-white w-10 h-10 rounded-full mr-4"></div>
                  <span className="ml-2">{room.room_number}</span>
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
          <select className="p-2 rounded-lg border">
            <option>Room Type</option>
            <option>Lecture</option>
            <option>Laboratory</option>
          </select>

          <button className="bg-green-500 text-white p-2 rounded-lg">Create Room</button>
          <button className="bg-blue-500 text-white p-2 rounded-lg">Upload File</button>
        </div>
      </main>
    </Layout>
  );
};

export default RoomPage;