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
            $table->string('section_name');
            $table->string('department_short_name');
            $table->string('subject_code');
            $table->string('feedback');
            $table->boolean('status')->default(false);

            $table->foreign('department_short_name')->references('department_short_name')->on('departments')->onDelete('cascade');
            $table->foreign('section_name')->references('section_name')->on('course_sections')->onDelete('cascade');
            $table->foreign('subject_code')->references('subject_code')->on('course_subjects')->onDelete('cascade');
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
