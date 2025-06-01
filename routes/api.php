<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiClientController;


Route::apiResource('clients', ApiClientController::class);


