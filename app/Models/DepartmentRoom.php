<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartmentRoom extends Model
{
    protected $table = 'department_room'; 
    protected $fillable = [
        'departmentID',
        'roomID',
    ];
}
