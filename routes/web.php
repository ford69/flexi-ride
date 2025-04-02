<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;






/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::get('/', [CarController::class, 'index']);
Route::get('/cars/{id}', [CarController::class, 'show']);

Route::middleware(['auth'])->group(function () {
    Route::post('/cars', [CarController::class, 'store']);

    Route::get('/bookings/create', function () {
        return view('bookings.create');
    });

    Route::post('/bookings', [BookingController::class, 'store']);

    Route::post('/payments', [PaymentController::class, 'pay']);
    Route::get('/payment/callback', [PaymentController::class, 'callback'])->name('payment.callback');

    Route::post('/reviews', [ReviewController::class, 'store']);
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::post('/admin/cars/{id}/approve', [AdminController::class, 'approveCar']);
    Route::delete('/admin/cars/{id}/reject', [AdminController::class, 'rejectCar']);
});
