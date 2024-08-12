<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Name;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index(Request $request, ?string $nameId = null) {

        // Handle GET request to display the view
        if ($request->isMethod('get')) {
            return Inertia::render('Game');
        }

        if ($request->isMethod('post')) {

            // Handle name submission
            $nameInput = $request->input('name');
            if ($nameInput) {
                $name = Name::firstOrCreate(['name' => $nameInput]);
                $nameId = $name->id;

                // Generate a UUID
                $uuid = (string) Str::uuid();

                // Create or update the game
                $game = Game::updateOrCreate(
                    ['name_id' => $nameId],
                    ['id' => $uuid, 'button_presses' => 0, 'marked_count' => 0, 'score' => 0]
                );

                Log::info('Game created or updated with name_id: ' . $nameId, $game->button_press, ['game' => $game]);
            }

            // Handle POST request for random number
            $generatedNumbers = [];
            $maxNumber = 100;
            do {
                $randomNumber = rand(1, $maxNumber);
            } while (in_array($randomNumber, $generatedNumbers));

            // Store the new number
            $generatedNumbers[] = $randomNumber;

            // Get the count from the request
            $markedCards = $request->input('markedCards', []);

            if (count($markedCards) > 0) {
                Log::info('Cards marked: ' . $markedCards);
                $game->markedCount = count($markedCards);
            }

            Log::info('Cards marked: ' . $markedCards);

            $buttonPresses = $request->input('buttonPresses', 0);
            $game->buttonPresses = $buttonPresses;

            if($game->markedCount == 24) {
                $score = abs(100 - $buttonPresses);
                $game->score = $score;
            }

            return response()->json(['number' => $randomNumber]);
        }

        return Inertia::render('Error');
    }
}
