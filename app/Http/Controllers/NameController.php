<?php

namespace App\Http\Controllers;

use App\Models\Name;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NameController extends Controller
{
    public function index(Request $request) {

        $nameInput = $request->input('name');
        Log::info('Name input: ' . $nameInput);
        if ($nameInput) {
            $name = Name::firstOrCreate(['name' => $nameInput]);
            $nameId = $name->id;
            Log::info('Submitted name id: ' . $nameId);

            // Store the nameId in the session
            $request->session()->put('nameId', $nameId);
        }

        return response()->json(['nameId' => $nameId]);
    }
}
