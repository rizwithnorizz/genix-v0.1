<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramOfferings extends Model
{
    protected $table = 'program_offerings';
    protected $fillable = [
        'program_name',
        'program_short_name',
        'departmentID',
    ];
}
