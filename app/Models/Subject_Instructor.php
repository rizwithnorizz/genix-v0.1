<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Subject_Instructor extends Model
{
    use HasFactory;

    protected $fillable = [
        'instructor_id',
        'subject_id',
    ];
}
