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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('subjectID');
            $table->string('time_start');
            $table->string('time_end');
            $table->unsignedBigInteger('day_slot');
            $table->unsignedBigInteger('roomID');
            $table->unsignedBigInteger('sectionID');
            $table->unsignedBigInteger('instructor_id');
            $table->unsignedBigInteger('departmentID');
            $table->string('semester');

            $table->foreign('departmentID')->references('departmentID')->on('departments')->onDelete('cascade');
            $table->foreign('instructor_id')->references('id')->on('instructors')->onDelete('cascade');
            $table->foreign('subjectID')->references('id')->on('subjects')->onDelete('cascade');
            $table->foreign('roomID')->references('id')->on('classrooms')->onDelete('cascade');
            $table->foreign('sectionID')->references('id')->on('course_sections')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
