<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RandController extends Controller
{
    public function index(Request $request) {

        // Handle POST request for generating random number
        $calledNumbers = $request->session()->get('calledNumbers');
        if(!$calledNumbers) {
            $calledNumbers = [];
        }

        $randomNumber = rand(1, 100);
        if (!in_array($randomNumber, $calledNumbers)) {
            // Store the new number
            $calledNumbers[] = $randomNumber;
        }

        $request->session()->put('calledNumbers', $calledNumbers);

        $buttonPresses = count($calledNumbers);
        $request->session()->put('buttonPresses', $buttonPresses);
        $request->session()->put('randomNumber', $randomNumber);
        Log::info('Button presses: ' . $buttonPresses);
        Log::info('Random number called: ' . $randomNumber);

        return response()->json(['number' => $randomNumber, 'buttonPresses' => $buttonPresses]);
    }
}
