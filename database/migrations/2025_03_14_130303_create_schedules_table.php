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
            $table->string('subject_code'); // String instead of foreignId
            $table->string('room_id'); // String instead of foreignId
            $table->integer('course_req'); // 3 = 3 units (3 hours/week), 5 = 5-10 hours/week
            $table->integer('timeslot')->nullable();
            $table->timestamps();

            $table->foreign('subject_code')->references('subject_code')->on('subjects')->onDelete('cascade');
            $table->foreign('room_id')->references('room_id')->on('classrooms')->onDelete('cascade');
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
