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
        Schema::create('course_subjects', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('programID');
            $table->unsignedBigInteger('curriculumID');
            $table->integer('year_level');
            $table->string('semester');
            $table->unsignedBigInteger('subjectID');

            $table->foreign('curriculumID')->references('id')->on('department_curriculums')->onDelete('cascade');
            $table->foreign('programID')->references('id')->on('program_offerings')->onDelete('cascade');
            $table->foreign('subjectID')->references('id')->on('subjects')->onDelete('cascade');
            $table->timestamps();
        }); 
    }   

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_subjects');
    }
};
