<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class subject extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'room_req',
        'lec',
        'lab',
        'subject_code',
        'prof_subject',
    ];  
}
