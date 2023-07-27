<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomBooking extends Model
{
    use HasFactory;
    protected $table = 'room_bookings';
    protected $fillable = [
        'room_id',
        'user_id',
        'date_in',
        'date_out',
        'booking_status',
        'payment_status',
    ];
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
