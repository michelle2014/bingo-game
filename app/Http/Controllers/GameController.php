<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Name;
use Illuminate\Support\Facades\Log;
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
            $action = $request->input('action');
            Log::info('Action taken: ' . $action);

            if ($action === 'call') {
                return $this->handleCallRequest($request);
            } elseif ($action === 'name') {
                return $this->handleNameRequest($request, $action);
            } elseif ($action === 'mark') {
                return $this->handleMarkRequest($request);
            }
        }

        return Inertia::render('Error');
    }

    private function handleCallRequest(Request $request) {

        // Handle POST request for random number
        $calledNumbers = $request->session()->get('calledNumbers');

        $randomNumber = rand(1, 100);
        if (!in_array($randomNumber, $calledNumbers)) {
            // Store the new number
            $calledNumbers[] = $randomNumber;
        }

        $request->session()->put('calledNumbers', $calledNumbers);

        $buttonPresses = count($calledNumbers);
        $request->session()->put('buttonPresses', $buttonPresses);
        Log::info('Button presses: ' . $buttonPresses);
        Log::info('Random number called: ' . $randomNumber);

        return response()->json(['number' => $randomNumber]);
    }

    private function handleNameRequest(Request $request, $action) {

        if ($action === 'name') {
            Log::info('Take an action: ' . $action);
            // Handle name submission
            $nameInput = $request->input('name');
            Log::info('Name input: ' . $nameInput);
            if ($nameInput) {
                $name = Name::firstOrCreate(['name' => $nameInput]);
                $nameId = $name->id;
                Log::info('Submitted name id: ' . $nameId);

                // Store the nameId in the session
                $request->session()->put('nameId', $nameId);

                // Create or update the game
                $game = Game::updateOrCreate(
                    ['name_id' => $nameId],
                    ['button_presses' => 0, 'marked_count' => 0, 'score' => 0]
                );

                Log::info('Game created or updated with name_id: ' . $nameId, ['game' => $game]);
            }
        }
    }

    private function handleMarkRequest(Request $request) {
        $nameId = $request->session()->get('nameId');
        Log::info('Submitted name id with mark request: ' . $nameId);

        $game = Game::where('name_id', $nameId)->first();
        Log::info('Game found with name ID: ' . $nameId . $game);

        // Get the count from the request
        $markedCards = $request->input('markedCards', []);
        if (count($markedCards) > 0) {
            Log::info('Cards marked: ' . implode(',', $markedCards));
            $game->marked_count = count($markedCards);
            $game->save();
        }
        Log::info('Cards marking finished: ', ['markedCards' => $markedCards]);

        $buttonPresses = $request->session()->get('buttonPresses');
        $game->button_presses = $buttonPresses;

        if($game->marked_count == 24) {
            $score = abs(100 - $buttonPresses);
            $game->score = $score;
        }

        $game->save();

        return response()->json(['status' => 'success']);
    }
}
