<?php

namespace App\Http\Controllers;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomManager extends Controller
{
    public function index()
    {
        $rooms = Room::all();
        //return view('rooms.index', compact('rooms'));
    }

    public function create(array $data)
    {
        $room = new Room();
        $room->room_id = $data['room_id'];
        $room->room_type = $data['room_type'];
        $room->save();
    }
    
    public function update(array $data)
    {
        $room = Room::find($data['id']);
        $room->room_id = $data['room_id'];
        $room->room_type = $data['room_type'];
        $room->save();
    }
}
