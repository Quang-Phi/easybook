<?php

namespace App\Http\Controllers\Listing;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Amenity;
use App\Models\Category;
use App\Models\CategoryAmenity;
use App\Models\City;
use App\Models\Facility;
use App\Models\Hotel;
use App\Models\HotelFacility;
use App\Models\Image;
use App\Models\Room;
use App\Models\RoomBooking;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ListingController extends Controller
{
    function getall(Request $request)
    {
        $facilities = Facility::all();
        $types = Type::all();
        $cities = DB::table('cities')
            ->join('addresses', 'cities.id', '=', 'addresses.city_id')
            ->join('hotels', 'addresses.hotel_id', '=', 'hotels.id')
            ->select('cities.id', 'cities.name', 'cities.image', 'cities.description', DB::raw('COUNT(DISTINCT hotels.id) as hotel_count'))
            ->groupBy('cities.id', 'cities.name', 'cities.image', 'cities.description')
            ->orderBy('hotel_count', 'desc')
            ->get();
        $param_location = '';
        if ((json_decode($request->input('location')) && json_decode($request->input('location')) != null)) {
            $param_location = json_decode($request->input('location'))->id;
        }
        $param_type = '';
        if ($request->input('type')) {
            $param_type = json_decode($request->input('type'))->id;
        }
        $param_rating = $request->input('star_rating');
        $param_facilities = $request->input('facilities');
        $param_per_page = $request->input('per_page');

        $query = Hotel::query();

        $query->when($param_location, function ($q) use ($param_location) {
            return $q->whereHas('addresses', function ($q) use ($param_location) {
                $q->where('city_id', $param_location);
            });
        });


        $query->when($param_type, function ($q) use ($param_type) {
            return  $q->where('type_id', $param_type);
        });


        $query->when($param_rating, function ($q) use ($param_rating) {
            return $q->whereHas('reviews', function ($q) use ($param_rating) {
                $q->havingRaw('FLOOR(AVG(rating)) = ?', [$param_rating]);
            });
        });

        $query->when(is_array($param_facilities), function ($q) use ($param_facilities) {
            return $q->whereHas('facilities', function ($q) use ($param_facilities) {
                $q->whereIn('name', $param_facilities);
            });
        });

        $hotels = $query->with([
            'facilities',
            'addresses' => function ($q) {
                $q->select('addresses.*', 'cities.name as city_name')
                    ->join('cities', 'cities.id', '=', 'addresses.city_id');
            },
            'type' => function ($q) {
                $q->select('id', 'name');
            },
            'images',
            'rooms',
            'reviews',
            'owner' => function ($q) {
                $q->select('id', 'name');
                $q->with('userInfo');
            }
        ])
            ->where('status', 1)
            ->orderBy('created_at', 'desc')
            ->paginate($param_per_page);

        $hotels->each(function ($hotel) {
            $totalPrice = $hotel->rooms->reduce(function ($total, $room) {
                return $total + $room->price;
            }, 0);

            $avgPrice = $totalPrice / $hotel->rooms->count();
            $hotel->avgPrice = $avgPrice;
        });

        $hotels->each(function ($hotel) {
            $totalStarRate = $hotel->reviews->reduce(function ($total, $reviews) {
                return $total + $reviews->rating;
            }, 0);
            if ($hotel->reviews->count() > 0) {
                $avgRating = $totalStarRate / $hotel->reviews->count();
            } else {
                $avgRating = 0;
            }
            $hotel->avgRating = round($avgRating, 1);
        });
        return response()->json([
            'hotels' => $hotels,
            'types' => $types,
            'cities' => $cities,
            'facilities' => $facilities
        ]);
    }


    function getSubData()
    {
        $categories = Category::all();
        $types = Type::all();
        $cities = City::all();
        $facilities = Facility::all();
        $amenities = Amenity::all();
        return response()->json([
            'categories' => $categories,
            'cities' => $cities,
            'types' => $types,
            'facilities' => $facilities,
            'amenities' => $amenities
        ]);
    }

    function addEditHotel(Request $request)
    {
        try {
            DB::beginTransaction();
            //hotels data
            $data = $request->all();
            $isExist = Hotel::where('name', $data['name'])->where('user_id', $data['user_id'])->first();
            if ($isExist && !$data['hotel_id']) {
                return response()->json([
                    'type' => 'info',
                    'message' => 'Hotel name already exists',
                ]);
            }

            if ($data['hotel_id'] == 'null') {
                $hotel =  Hotel::create([
                    'name' => $data['name'],
                    'phone' => $data['phone'],
                    'status' => 0,
                    'email' => $data['email'],
                    'description' => $data['description'],
                    'type_id' => $data['type_id'],
                    'user_id' => $data['user_id'],
                    'created_at' => now(),
                ]);
                Address::insert([
                    'hotel_id' => $hotel->id,
                    'address' => $data['address'],
                    'city_id' => $data['city_id'],
                    'longitude' => $data['longitude'],
                    'latitude' => $data['latitude'],
                ]);
                foreach (json_decode($data['facilities'], true) as $facility) {
                    HotelFacility::insert([
                        'hotel_id' => $hotel->id,
                        'facility_id' => $facility,
                        'created_at' => now(),
                    ]);
                }
                foreach ($data['hotel_images'] as  $image) {
                    $imagePath = $image->store('images', 'public');
                    $imageUrl = Storage::url($imagePath);
                    Image::insert([
                        'hotel_id' => $hotel->id,
                        'image_link' => $imageUrl,
                        'created_at' => now(),
                    ]);
                }
            } else {

                $hotel = Hotel::find($data['hotel_id']);
                $hotel->updated([
                    'name' => $data['name'] ? $data['name'] : $hotel->name,
                    'phone' => $data['phone'] ? $data['phone'] : $hotel->phone,
                    'email' => $data['email'] ? $data['email'] : $hotel->email,
                    'description' => $data['description'] ? $data['description'] : $hotel->description,
                    'type_id' => $data['type_id'],
                    'user_id' => $data['user_id'],
                    'updated_at' => now(),
                ]);
                Address::updateOrCreate(
                    ['hotel_id' => $hotel->id],
                    [
                        'address' => $data['address'],
                        'city_id' => $data['city_id'],
                        'longitude' => $data['longitude'],
                        'latitude' => $data['latitude'],
                    ]
                );

                HotelFacility::where('hotel_id', $hotel->id)->delete();
                foreach ($data['facilities'] as $facility) {
                    HotelFacility::create([
                        'hotel_id' => $hotel->id,
                        'facility_id' => $facility,
                        'created_at' => now(),
                    ]);
                }

                Image::where('hotel_id', $hotel->id)->delete();
                foreach ($data['hotel_images'] as $image) {
                    $imagePath = $image->store('images', 'public');
                    $imageUrl = Storage::url($imagePath);
                    Image::create([
                        'hotel_id' => $hotel->id,
                        'image_link' => $imageUrl,
                        'created_at' => now(),
                    ]);
                }
            };



            //
            DB::commit();
            return response()->json([
                'type' => 'success',
                'status' => true,
                'message' => 'Hotel added successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'type' => 'error',
                'status' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    function deleteHotel($id)
    {
        try {
            $hotel = Hotel::find($id);
            if (!$hotel) {
                return response()->json([
                    'type' => 'error',
                    'message' => 'Hotel not found',
                ], 404);
            }
            $hotel->delete();
            return response()->json([
                'type' => 'success',
                'message' => 'Hotel deleted successfully',
            ]);
        } catch (\Exception) {
            DB::rollback();
            return response()->json([
                'type' => 'error',
                'message' => 'Failed to delete hotel',
            ]);
        }
    }

    function getHotel($hotelId)
    {
        $hotel = Hotel::with([
            'facilities',
            'addresses',
            'images',
            'rooms',
            'reviews' => function ($q) {
                $q->select('reviews.*', 'users.name as owner_name', 'user_info.avatar as owner_avatar')
                    ->join('users', 'users.id', '=', 'reviews.user_id')
                    ->join('user_info', 'reviews.user_id', '=', 'user_info.user_id');
            },

        ])
            ->where('id', $hotelId)
            ->first();

        if ($hotel) {
            $totalStarRate = $hotel->reviews->reduce(function ($total, $reviews) {
                return $total + $reviews->rating;
            }, 0);
            if ($hotel->reviews->count() > 0) {
                $avgRating = $totalStarRate / $hotel->reviews->count();
            } else {
                $avgRating = 0;
            }
            $hotel->avgRating = round($avgRating, 1);
        }

        $categoryIds = Room::where('hotel_id', $hotelId)->pluck('category_id');
        $categories = Category::whereIn('categories.id', $categoryIds)
            ->leftJoin('category_amenity', 'categories.id', '=', 'category_amenity.category_id')
            ->leftJoin('amenities', 'category_amenity.amenity_id', '=', 'amenities.id')
            ->select('categories.*', 'amenities.name as a_name')
            ->with(['rooms' => function ($q) use ($hotelId) {
                $q->where('hotel_id', $hotelId);
            }])
            ->get()
            ->groupBy('id')
            ->map(
                function ($category) {
                    $amenities = $category->pluck('a_name')->filter()->toArray();
                    return $category->first()->setAttribute('amenities', $amenities);
                }
            );
        return response()->json([
            'hotel' => $hotel,
            'categories' => $categories->values()
        ]);
    }

    function addRoom(Request $request)
    {
        try {
            DB::beginTransaction();
            //data room
            $room = json_decode($request->input('room'), true);
            //
            $cate = json_decode($request->input('categories'), true);
            //
            $hotelId = $request->input('hotel_id');
            $cateId = $cate['choose']['id'];

            if (is_null($cateId)) {
                $imageUrl = null;
                if ($request->hasFile('cate_image')) {
                    $cate_image = $request->file('cate_image');
                    $imagePath = $cate_image->store('images', 'public');
                    $imageUrl = Storage::url($imagePath);
                }
                $newCate = Category::create([
                    'name' => $cate['create']['name'],
                    'max_guests' => $cate['create']['guest'],
                    'image' => $imageUrl,
                    'description' => $cate['create']['desc'],
                    'created_at' => now(),
                ]);

                $amenities = $cate['create']['amenities'];
                if ($amenities) {
                    foreach ($amenities as $amenity) {
                        CategoryAmenity::create([
                            'category_id' => $newCate->id,
                            'amenity_id' => $amenity,
                            'created_at' => now(),
                        ]);
                    }
                }


                for ($i = 0; $i < $room['quantity']; $i++) {
                    $newRoom = Room::create([
                        'hotel_id' => $hotelId,
                        'category_id' => $newCate->id,
                        'name' => $room['name'][$i],
                        'price' => $room['price'][$i],
                        'description' => $room['desc'][$i],
                        'created_at' => now(),
                    ]);
                    $room_images_arr = $request->file("room_images.$i");

                    foreach ($room_images_arr as $images) {
                        $imagePath = $images->store('images', 'public');
                        $imageUrl = Storage::url($imagePath);
                        Image::create([
                            'room_id' => $newRoom->id,
                            'image_link' => $imageUrl,
                            'created_at' => now(),
                        ]);
                    }
                }

                DB::commit();
                return response()->json([
                    'type' => 'success',
                    'status' => true,
                    'message' => 'Room added successfully',
                ]);
            }
            for ($i = 0; $i < $room['quantity']; $i++) {
                $newRoom = Room::create([
                    'hotel_id' => $hotelId,
                    'category_id' => $cateId,
                    'name' => $room['name'][$i],
                    'price' => $room['price'][$i],
                    'description' => $room['desc'][$i],
                    'created_at' => now(),
                ]);
                $room_images_arr = $request->file("room_images.$i");
                foreach ($room_images_arr as $images) {
                    $imagePath = $images->store('images', 'public');
                    $imageUrl = Storage::url($imagePath);
                    Image::create([
                        'room_id' => $newRoom->id,
                        'image_link' => $imageUrl,
                        'created_at' => now(),
                    ]);
                }
            }
            DB::commit();
            return response()->json([
                'type' => 'success',
                'status' => true,
                'message' => 'Room added successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'type' => 'error',
                'status' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    function getAvailableRooms($hotelId, Request $request)
    {
        $dateIn = $request->input('dateIn');
        $dateOut = $request->input('dateOut');
        $availableRooms = Room::where('hotel_id', $hotelId)
            ->whereDoesntHave('roomBookings', function ($query) use ($dateIn, $dateOut) {
                $query->where(function ($query) use ($dateIn, $dateOut) {
                    $query->where('date_out', '>=', $dateIn)
                        ->where('date_in', '<=', $dateOut);
                })->orWhere(function ($query) use ($dateIn, $dateOut) {
                    $query->where('date_out', '>=', $dateIn)
                        ->where('date_out', '<=', $dateOut);
                });
            })
            ->with('images')
            ->get();
        return response()->json($availableRooms);
    }

    function changeStatus(Request $request)
    {

        try {
            DB::beginTransaction();
            $hotel = Hotel::find($request->id);
            $rooms = $hotel->rooms;
            if ($rooms->count() > 0) {
                $hotel->status = !$hotel->status;
                $hotel->save();
                DB::commit();
                return response()->json([
                    'type' => 'success',
                    'message' => 'Status changed to ' . ($hotel->status ? 'active' : 'inactive') . ' successfully',
                ]);
            }
            return response()->json([
                'type' => 'info',
                'message' => 'Add rooms first',
            ]);
        } catch (\Exception) {
            DB::rollback();
            return response()->json([
                'type' => 'error',
                'message' => 'Failed to change status',
            ]);
        }
    }


    function getUserListings($userId)
    {
        $listings = Hotel::where('user_id', $userId)
            ->with('addresses', 'images')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($listings);
    }

    function getUserBookings(Request $request)
    {
        $userId = $request->input('userId');
        $per_page = $request->input('per_page');
        $bookings = RoomBooking::where('room_bookings.user_id', $userId)
            ->leftJoin('rooms', 'room_bookings.room_id', '=', 'rooms.id')
            ->leftJoin('hotels', 'rooms.hotel_id', '=', 'hotels.id')
            ->leftJoin('categories', 'rooms.category_id', '=', 'categories.id')
            ->leftJoin('user_info', 'room_bookings.user_id', '=', 'user_info.user_id')
            ->leftJoin('users', 'room_bookings.user_id', '=', 'users.id')
            ->select(
                'room_bookings.*',
                'rooms.name as room_name',
                'hotels.id as hotel_id',
                'hotels.name as hotel_name',
                'categories.name as category_name',
                'user_info.avatar as user_avatar',
                'users.name as user_name'
            )
            ->orderBy('room_bookings.created_at', 'desc')
            ->paginate($per_page);


        return response()->json($bookings);
    }
}
