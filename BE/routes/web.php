<?php

use App\Http\Controllers\Listing\ListingController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

Route::get('api/csrf-token', function () {
    return response()->json([
        'csrfToken' => csrf_token(),
    ]);
});

// Route::get('/', function () {
//     return view('welcome');
// });
// Route::get('api/create-payment-intent', function () {
//     Stripe::setApiKey(env('sk_test_51NQJm4DCqdmv6gI3tgihloINjr2O5ty9OttFRqolWN5j4fP7DopGd0aStpGYBVKPaTchf8oc3UWKp6MKtBrVW7l400tysde6uE'));
//     $paymentIntent = PaymentIntent::create([
//         'amount' => 1000, // Set the amount in cents
//         'currency' => 'usd',
//     ]);
//     return response()->json([
//         'clientSecret' => $paymentIntent->client_secret,
//     ]);
// });



Route::prefix('api')->group(function () {
    Route::prefix('user')->controller(UserController::class)->name('user')->group(function () {
        Route::post('/create', 'create');
        Route::post('/update', 'update');
        Route::post('/login', 'login');
        Route::get('/get-info/{id}', 'getInfo');
        Route::get('/get-favorites/{id}', 'getFavorites');
        Route::post('/add-favorites', 'addFavorites');
        Route::post('/delete-favorites', 'deleteFavorites');
        Route::post('/add-comment', 'addComment');
    });
    Route::prefix('listings')->controller(ListingController::class)->name('listings')->group(function () {
        Route::get('/', 'getall');
        Route::get('/sub-data', 'getSubData');
        Route::post('/add-edit-hotel', 'addEditHotel');
        Route::get('/delete-hotel/{id}', 'deleteHotel');
        Route::post('/add-room', 'addRoom');
        Route::get('/user-listings/{id} ', 'getUserListings');
        Route::get('/get-hotel/{id}', 'getHotel');
        Route::get('/{id}/available-rooms', 'getAvailableRooms');
        Route::get('/user-bookings', 'getUserBookings');
        Route::get('/change-status/{id}', 'changeStatus');
    });
});