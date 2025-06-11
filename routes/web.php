<?php

use App\Http\Controllers\API\ApiClientController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CredentialsController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SheetTrackerController;
use App\Http\Controllers\WorksheetController;
use App\Http\Controllers\OrderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendancepanel.attendance');
    Route::get('/tracker', [SheetTrackerController::class, 'index'])->name('trackerpanel.sheettracker');
    Route::get('/employee', [EmployeeController::class, 'index'])->name('employeepanel.employee');
    Route::get('/api/employee', [EmployeeController::class, 'fetchEmployee'])->name('api.employee');


    Route::get('/worksheets', [WorksheetController::class, 'index'])->name('worksheetpanel.worksheet');

    Route::get('/clients', [ClientController::class, 'index'])->name('clientpanel.client');
    Route::get('/api/clients', [ApiClientController::class, 'index'])->name('api.client');


    Route::get('/credentials', [CredentialsController::class, 'index'])->name('credentialspanel.credentials');
    Route::post('/credentials', [CredentialsController::class, 'storeCredential'])->name('credential.store');
     Route::delete('/credentials/{credential}/delete', [CredentialsController::class, 'deleteCredential'])->name('credential.delete');

     Route::post('/worksheets', [WorksheetController::class, 'storeWorksheet'])->name('worksheet.store');
     Route::delete('/worksheets/{worksheet}', [WorksheetController::class, 'destroy'])->name('worksheet.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/orders', [OrderController::class, 'index'])->name('orderpanel.order');
    Route::post('/orders', [OrderController::class, 'store'])->name('order.store');
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('order.updateStatus');
});

require __DIR__.'/auth.php';
