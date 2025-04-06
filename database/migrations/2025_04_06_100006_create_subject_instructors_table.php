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
        Schema::create('subject_instructors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('subject_code');
            $table->unsignedBigInteger('instructor_id');

            $table->foreign('subject_code')->references('id')->on('subjects')->onDelete('cascade');
            $table->foreign('instructor_id')->references('id')->on('instructors')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subject_instructors');
    }
};
