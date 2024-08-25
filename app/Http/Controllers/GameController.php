<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{

    public function index(Request $request, ?string $nameId = null) {

        // Handle GET request to display the view
        if ($request->isMethod('get')) {
            return Inertia::render('Game', [
                'nameId' => $nameId,
            ]);
        }

        if ($request->isMethod('post')) {
            return $this->handleMarkRequest($request);
        }

        return Inertia::render('Error');
    }

    private function handleMarkRequest(Request $request) {

        $nameId = $request->session()->get('nameId');

        $game = Game::firstOrCreate(
            ['name_id' => $nameId],
        );

        Log::info('Game created with name_id: ' . $nameId, ['game' => $game]);

        // Get the count from the request
        $markedCards = $request->input('markedCards', []);
        Log::info('Marking a card: ' . implode(',', $markedCards));

        if (count($markedCards) > 0) {
            Log::info('Cards marked: ' . implode(',', $markedCards));
            $game->marked_count = count($markedCards);
            $game->save();
        }

        $buttonPresses = $request->session()->get('buttonPresses');
        $game->button_presses = $buttonPresses;

        if($game->marked_count == 24) {
            $score = abs(100 - $buttonPresses);
            $game->score = $score;

            $request->session()->remove('calledNumbers');
        }

        Log::info('Cards marking finished: ', ['markedCards' => $markedCards]);

        $game->save();

        return response()->json(['status' => 'success']);
    }
}
