<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index(Request $request) {

        // Handle GET request to display the view
        if ($request->isMethod('get')) {
            return Inertia::render('Game');
        }

        if ($request->isMethod('post')) {
            // Handle POST request for random number
            $randomNumber = rand(1, 100);
            return response()->json(['number' => $randomNumber]);
        }

        return Inertia::render('Error');
    }
}
