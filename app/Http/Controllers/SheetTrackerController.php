<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SheetTrackerController extends Controller
{

    public function index()
    {
        return inertia('TrackerPanel/SheetTracker', [
            'auth' => auth()->check(),
        ]);
    }
}
