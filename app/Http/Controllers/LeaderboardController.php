<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index() {

        $games = Game::with('name')
            ->orderBy('score', 'desc')
            ->get();

        return Inertia::render('Leaderboard', ['games' => $games]);
    }
}
