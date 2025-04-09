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
        Schema::create('department_room', function (Blueprint $table) {
            $table->id();
            $table->string('department_short_name');
            $table->string('room_number');

            $table->foreign('room_number')->references('room_number')->on('classrooms')->onDelete('cascade');
            $table->foreign('department_short_name')->references('department_short_name')->on('departments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_room');
    }
};
