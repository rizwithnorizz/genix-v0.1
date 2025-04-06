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
            $table->string('subject_code');
            $table->integer('time_slot');
            $table->integer('day_slot');
            $table->string('room_number');
            $table->string('section_name');

            $table->foreign('subject_code')->references('subject_code')->on('subjects')->onDelete('cascade');
            $table->foreign('room_number')->references('room_number')->on('classrooms')->onDelete('cascade');
            $table->foreign('section_name')->references('section_name')->on('course_sections')->onDelete('cascade');
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
