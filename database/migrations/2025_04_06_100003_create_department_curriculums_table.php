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
        Schema::create('department_curriculums', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('departmentID');
            $table->unsignedBigInteger('programID');
            $table->string('curriculum_name')->unique();
            
            $table->foreign('programID')
                ->references('id')
                ->on('program_offerings')
                ->onDelete('cascade');
            $table->foreign('departmentID')
                ->references('departmentID')
                ->on('departments')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_curriculums');
    }
};
