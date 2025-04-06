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
        Schema::create('program_offerings', function (Blueprint $table) {
            $table->id();
            $table->string('program_name');
            $table->string('program_short_name')->unique();
            $table->string('curriculum_name');
            $table->string('department_short_name');
            $table->timestamps();

            $table->foreign('curriculum_name')->references('curriculum_name')->on('department_curriculums')->onDelete('cascade');
            $table->foreign('department_short_name')->references('department_short_name')->on('departments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_offerings');
    }
};
