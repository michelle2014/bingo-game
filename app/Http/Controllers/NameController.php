<?php

namespace App\Http\Controllers;

use App\Models\Name;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class NameController extends Controller
{
    public function index(Request $request)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Get the name input from the request
        $nameInput = $request->input('name');

        // Log or process the name
        Log::info('Name submitted: ' . $nameInput);

        // Generate a UUID
        $uuid = (string) Str::uuid();

        $name = Name::updateOrCreate(
            ['name' => $nameInput],
            ['id' => $uuid]
        );

        Log::info('Name created: ' . $name);

        // Redirect to the route that starts the game, passing the name ID
        return redirect()->route('game.index', ['name' => $name->id]);
    }
}
