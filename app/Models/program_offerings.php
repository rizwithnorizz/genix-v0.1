<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class program_offerings extends Model
{
    protected $fillable = [
        'program_name',
        'program_short_name',
        'curriculum_name',
        'department_short_name',
    ];
}
