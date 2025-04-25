<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Course_Sections extends Model
{
    use HasFactory;
    protected $table = 'course_sections';
    protected $fillable = [
        'section_name',
        'program_short_name',
        'year_level',
        'curriculum_name',
    ];  
}
