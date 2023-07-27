<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;
    protected $table = 'rooms';
    protected $fillable = [
        'name',
        'price',
        'status',
        'category_id',
        'hotel_id'

    ];

    protected function hotel()
    {
        return $this->belongsTo(Hotel::class, 'hotel_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }
    public function roomBookings()
    {
        return $this->hasMany(RoomBooking::class);
    }
    public function images()
    {
        return $this->hasMany(Image::class);
    }
}
