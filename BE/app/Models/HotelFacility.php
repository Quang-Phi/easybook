<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelFacility extends Model
{
    use HasFactory;
    protected $table = 'hotel_facility';
    protected $fillable = [
        'hotel_id',
        'facility_id'
    ];
}
