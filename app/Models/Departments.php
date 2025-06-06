<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departments extends Model
{
    use HasFactory;
    protected $table = 'departments';
    protected $fillable = [
        'department_full_name',
        'department_short_name',
        'logo_img_path',
    ];
}
