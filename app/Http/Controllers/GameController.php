<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class GameController extends Controller
{
    public function index() {
        return Inertia::render('Game');
    }
}
