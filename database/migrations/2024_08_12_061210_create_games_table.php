<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Class CreateGamesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('name_id')->constrained()->onDelete('cascade'); // Foreign key to names table
            $table->integer('button_presses')->default(0); // Number of times the caller button was pressed
            $table->integer('marked_count')->default(0); // Number of cards marked
            $table->integer('score')->default(0); // Calculated score
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('games');
    }
};
