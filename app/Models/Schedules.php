<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Schedules extends Model
{
    protected $table = 'schedules';
    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_code', 'subject_code');
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'room_number', 'room_number');
    }

    public function section()
    {
        return $this->belongsTo(Course_Sections::class, 'section_name', 'section_name');
    }
}
