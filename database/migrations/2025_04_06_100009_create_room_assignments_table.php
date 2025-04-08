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
        Schema::create('room_assignments', function (Blueprint $table) {
            $table->string('section_name');
            $table->string('room_number');

            $table->foreign('room_number')->references('room_number')->on('classrooms')->onDelete('cascade');
            $table->foreign('section_name')->references('section_name')->on('course_sections')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_assignments');
    }
};
