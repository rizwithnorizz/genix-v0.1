<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Department_Curriculum extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'department_short_name',
        'curriculum_name',
    ];
}
