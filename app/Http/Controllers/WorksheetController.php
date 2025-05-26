<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WorksheetController extends Controller
{
     public function index()
    {

        return inertia('WorksheetPanel/Worksheet', [
            'auth' => auth()->check(),
        ]);
    }
}
