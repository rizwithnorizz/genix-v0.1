<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Subject extends Model
{
    use HasFactory;
    protected $table = 'subjects';  
    protected $fillable = [
        'name',
        'lec',
        'lab',
        'subject_code',
        'prof_subject',
    ]; 
    public function instructors()
    {
        return $this->belongsToMany(Instructor::class, 'subject_instructors', 'subject_code', 'instructor_id');
    }
}
