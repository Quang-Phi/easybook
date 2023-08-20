<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\User;
use App\Models\UserFavorite;
use App\Models\UserInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class UserController extends Controller
{

    private $users;
    public function __construct()
    {
        $this->users = User::all();
    }
    function  get()
    {
        $users = $this->users;
        return response()->json($users);
    }
    function login(Request $request)
    {
        $users = $this->users;
        $email = strtolower($request->email);

        $credentials = $request->only('email', 'password');
        $existingUser = $users->where('email', $email)->first();
        if (!$existingUser) {
            return response()->json([
                'user_id' => null,
                'type' => 'error',
                'message' => 'Account does not exist'
            ]);
        }
        $userId = $existingUser->id;

        if (Auth::attempt($credentials)) {
            $token = $existingUser->createToken('auth_token')->plainTextToken;
            return response()->json([
                'user_id' =>  $userId,
                'token' => $token,
                'type' => 'success',
                'message' => 'Login successfully'
            ]);
        }
        return response()->json([
            'user_id' => null,
            'type' => 'info',
            'message' => 'Password is incorrect'
        ]);
    }
    function create(Request $request)
    {
        try {
            DB::beginTransaction();
            $users = $this->users;
            $name = $request->name;
            $email = strtolower($request->email);
            $password = $request->password;

            $existingUser = $users->where('email', $email)->first();
            if ($existingUser) {
                return response()->json([
                    'status' => false,
                    'type' => 'info',
                    'message' => 'Account already exists'
                ]);
            }

            $newUser = User::create([
                'name' => $name,
                'email' => $email,
                'password' => bcrypt($password),
                'created_at' => now(),
            ]);
            $userId = $newUser->id;
            UserInfo::create([
                'user_id' => $userId,
            ]);

            //get id of user new

            DB::commit();
            return response()->json([
                'status' => true,
                'type' => 'success',
                'message' => 'Account created successfully'
            ]);
        } catch (
            \Exception $e
        ) {
            DB::rollback();
            return response()->json([
                'status' => false,
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    function update(Request $request)
    {
        try {
            DB::beginTransaction();
            $id = $request->input('id');
            $name = $request->input('name');
            $phone = $request->input('phone');
            $address = $request->input('address');
            $gender = $request->input('gender');
            $user = User::find($id);
            $user->name = $name;
            $user->save();
            $userInfo = UserInfo::where('user_id', $id)->first();
            $userInfo->phone = $phone;
            if ($request->hasFile('avatar')) {
                $avatar = $request->file('avatar');
                $imagePath = $avatar->store('images', 'public');
                $imageUrl = Storage::url($imagePath);
                $userInfo->avatar = $imageUrl;
            }
            $userInfo->address = $address;
            $userInfo->gender = $gender;
            $userInfo->save();
            DB::commit();
            return response()->json([
                'status' => true,
                'type' => 'success',
                'message' => 'User updated successfully',
                'user' => $user,
                'userInfo' => $userInfo
            ]);
        } catch (\Exception) {
            DB::rollback();
            return response()->json([
                'status' => false,
                'type' => 'error',
                'message' => 'Something went wrong'
            ]);
        }
    }
    function getInfo($id)
    {
        $user = User::where('id', $id)->with('userInfo')->first();
        return response()->json($user);
    }
    function getFavorites($id)
    {
        $favorites = UserFavorite::where('user_id', $id)
            ->with([
                'hotel' => function ($q) {
                    $q->with('addresses');
                    $q->with('reviews');
                    $q->with('images');
                }
            ])
            ->get();
        return response()->json($favorites);
    }
    function addFavorites(Request $request)
    {
        try {
            DB::beginTransaction();
            $isExist = UserFavorite::where('user_id', $request->userId)->where('hotel_id', $request->id)->first();
            if (!$isExist) {
                UserFavorite::create([
                    'user_id' => $request->userId,
                    'hotel_id' => $request->id,
                ]);
                DB::commit();
                return response()->json([
                    'status' => true,
                    'type' => 'success',
                    'message' => 'Hotel added to favorites successfully'
                ]);
            }
            return response()->json([
                'status' => false,
                'type' => 'info',
                'message' => 'Hotel already added to favorites'
            ]);
        } catch (\Exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'type' => 'error',
                'message' => 'Something went wrong'
            ]);
        }
    }
    function deleteFavorites(Request $request)
    {
        try {
            DB::beginTransaction();
            $isExist = UserFavorite::where('id', $request->favId)->first();
            if ($isExist) {
                UserFavorite::where('id', $request->favId)->delete();
                DB::commit();
                return response()->json([
                    'type' => 'success',
                    'message' => 'Hotel deleted from favorites successfully'
                ]);
            }

            return response()->json([
                'type' => 'info',
                'message' => 'Hotel does not exist'
            ]);
        } catch (\Exception) {
            return response()->json([
                'type' => 'error',
                'message' => 'Something went wrong'
            ]);
        }
    }
    function addComment(Request $request)
    {
        try {
            DB::beginTransaction();
            $userId = $request->userId;
            $hotelId = $request->hotelId;
            $review = $request->review;
            $rating = $request->rating;
            Review::insert([
                'user_id' => $userId,
                'hotel_id' => $hotelId,
                'rating' => $rating,
                'review' => $review,
                'created_at' => now(),
            ]);
            DB::commit();
            return response()->json([
                'type' => 'success',
                'message' => 'Review added successfully'
            ]);
        } catch (\Exception) {
            return response()->json([
                'type' => 'error',
                'message' => 'Something went wrong'
            ]);
        }
    }
}
