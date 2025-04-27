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
        Schema::create('special_rooms_for_subjects', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('subjectID');
            $table->unsignedBigInteger('roomID');

            $table->foreign('subjectID')->references('id')->on('subjects')->onDelete('cascade');
            $table->foreign('roomID')->references('id')->on('classrooms')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('special_rooms_for_subjects');
    }
};
