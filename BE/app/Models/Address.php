<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;
    protected $table = 'addresses';
    protected $fillable = [
        'hotel_id',
        'address',
        'latitude',
        'longitude',
        'city_id',
    ];

    protected function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }
}
