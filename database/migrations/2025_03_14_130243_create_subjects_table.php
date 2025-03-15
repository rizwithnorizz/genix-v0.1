<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('subject_code')->unique();
            $table->integer('room_req')->default(0); // 1 = Lecture, 2 = Computer Lab, 3 = Special Room
            $table->integer('course_req')->default(0); // 3 = 3 units (3 hours/week), 5 = 5-10 hours/week
            $table->foreignId('instructor_id')->constrained('instructors')->nullable();
            $table->foreignId('room_id')->nullable()->constrained('classrooms');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
