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
            $table->unsignedBigInteger('departmentID');
            $table->unsignedBigInteger('roomID');
            $table->timestamps();
            
            $table->foreign('roomID')->references('id')->on('classrooms')->onDelete('cascade');
            $table->foreign('departmentID')->references('departmentID')->on('departments')->onDelete('cascade');
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
