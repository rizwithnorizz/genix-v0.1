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
        Schema::create('course_subject_feedback', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sectionID');
            $table->unsignedBigInteger('departmentID');
            $table->unsignedBigInteger('subjectID');
            $table->string('feedback');
            $table->unsignedBigInteger('scheduleID');
            $table->boolean('status')->nullable();

            $table->foreign('scheduleID')->references('id')->on('schedules')->onDelete('cascade');
            $table->foreign('departmentID')->references('departmentID')->on('departments')->onDelete('cascade');
            $table->foreign('sectionID')->references('id')->on('course_sections')->onDelete('cascade');
            $table->foreign('subjectID')->references('id')->on('course_subjects')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_subject_feedback');
    }
};
