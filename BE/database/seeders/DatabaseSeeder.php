<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Hotel;
use App\Models\User;
use App\Models\UserInfo;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $facilities = ['free wifi', 'free parking', 'restaurant', 'swimming pool', 'gym'];
        $amenities = ['air conditioned', 'television',  'phone', 'hair dryer', 'balcony'];
        $roomcate = ['Standard Family Room', 'Superior Double Room', 'Deluxe Single Room'];
        $cities = [
            "New York",
            "Los Angeles",
            "Chicago",
            "Houston",
            "Phoenix",
            "Philadelphia",
            "San Antonio",
            "San Diego",
            "Dallas",
            "San Jose",
        ];
        $types = ['hotel', 'apartment', 'hostel'];
        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('123123123'),
        ]);


        User::factory()->count(200)->create();

        for ($i = 1; $i < 201; $i++) {
            UserInfo::factory()->create([
                'user_id' => $i
            ]);
        }


        foreach ($facilities as $key => $facility) {
            DB::table('facilities')->insert([
                'name' => $facility,
            ]);
        };
        foreach ($types as $key => $type) {
            DB::table('types')->insert([
                'name' => $types[$key],
            ]);
        };
        foreach ($amenities as $key => $amenity) {
            DB::table('amenities')->insert([
                'name' => $amenity,
            ]);
        };
        foreach ($cities as $key => $city) {
            DB::table('cities')->insert([
                'name' => $city,
                'image' => fake()->imageUrl(),
                'description' => fake()->paragraph(rand(5, 10)),
            ]);
        };

        Hotel::factory(500)->create();


        $numAddresses = rand(1, 3);
        // for ($j = 1; $j < $numAddresses; $j++) {
        for ($i = 1; $i <= 500; $i++) {
            DB::table('addresses')->insert([
                'address' => fake()->address,
                'latitude' => rand(-90, 90),
                'longitude' => rand(-180, 180),
                'hotel_id' => $i,
                'city_id' => rand(1, count($cities)),
            ]);
            // }
        }


        foreach ($roomcate as $key => $cate) {
            DB::table('categories')->insert([
                'name' => $cate,
                'image' => fake()->imageUrl(),
                'max_guests' => rand(2, 3),
                'description' => fake()->paragraph(rand(5, 10)),
            ]);
        };

        $rooms = 0;
        for ($i = 1; $i <= 500; $i++) {
            $numRooms = rand(20, 50);
            for ($j = 1; $j < $numRooms; $j++) {
                DB::table('rooms')->insert([
                    'name' => 'room' . $j,
                    'price' => rand(50, 100),
                    'hotel_id' => $i,
                    'category_id' => rand(1, 3),
                ]);
                $rooms++;
            }
        }

        for ($i = 1; $i < $rooms; $i++) {
            for ($k = 1; $k < 6; $k++) {
                DB::table('images')->insert([
                    'image_link' => fake()->imageUrl(),
                    'room_id' => $i
                ]);
            }
            for ($j = 1; $j < rand(1, 3); $j++) {
                $dateIn = Carbon::now()->addDays(rand(1, 50));
                $dateOut = clone $dateIn;
                $dateOut->addDays(rand(1, 7));
                DB::table('room_bookings')->insert([
                    'room_id' => $i,
                    'user_id' => rand(1, 200),
                    'date_in' => $dateIn,
                    'date_out' => $dateOut,
                    'booking_status' => rand(1, 3),
                    'payment_status' => 1,
                ]);
            }
        }



        for ($i = 1; $i <= 3; $i++) {
            DB::table('category_amenity')->insert([
                'category_id' => $i,
                'amenity_id' => 1,
            ]);
        };

        $amenityIds = range(2, 5);
        shuffle($amenityIds);
        for ($i = 1; $i <= count($roomcate); $i++) {
            for ($j = 1; $j < rand(2, 4); $j++) {
                if (empty($amenityIds)) {
                    $amenityIds = range(2, 5);
                    shuffle($amenityIds);
                }
                DB::table('category_amenity')->insert([
                    'category_id' => $i,
                    'amenity_id' => array_shift($amenityIds),
                ]);
            }
            shuffle($amenityIds);
        }


        for ($i = 1; $i <= 500; $i++) {
            DB::table('hotel_facility')->insert([
                'hotel_id' => $i,
                'facility_id' => 1,
            ]);
        }
        $facilityIds = range(2, 5);
        shuffle($facilityIds);
        for ($i = 1; $i <= 500; $i++) {
            for ($j = 1; $j < rand(2, 4); $j++) {
                if (empty($facilityIds)) {
                    $facilityIds = range(2, 5);
                    shuffle($facilityIds);
                }
                DB::table('hotel_facility')->insert([
                    'hotel_id' => $i,
                    'facility_id' => array_shift($facilityIds),
                ]);
            }
            shuffle($facilityIds);
        }

        for ($i = 1; $i <= 500; $i++) {
            for ($j = 1; $j <= 6; $j++) {
                DB::table('images')->insert([
                    'hotel_id' => $i,
                    'room_id' => null,
                    'image_link' => fake()->imageUrl(),
                ]);
            }
        }


        for ($i = 1; $i <= 1000; $i++) {
            DB::table('reviews')->insert([
                'user_id' => rand(1, 200),
                'hotel_id' => rand(1, 500),
                'rating' => rand(3, 5),
                'review' => fake()->paragraph(rand(5, 10)),
                'created_at' => fake()->dateTimeBetween('-1 years', '-1 months'),
            ]);
        }
    }
}
