<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class DepartmentCurriculum extends Model
{
    protected $table = 'department_curriculums';
    protected $fillable = [
        'department_short_name',
        'curriculum_name',
        'program_short_name',
    ];
}
