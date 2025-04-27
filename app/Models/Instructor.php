<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Instructor extends Model
{
    use HasFactory;
    protected $table = 'instructors';
    protected $fillable = [
        'name',
        'prof_subject_instructor',
        'departmentID',
    ];
    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'subject_instructors', 'instructor_id', 'subject_code');
    }
}
