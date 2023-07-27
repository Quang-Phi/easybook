<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    use HasFactory;
    protected $table = 'hotels';
    protected $fillable = [
        'name',
        'email',
        'phone',
        'status',
        'description',
        'user_id',
        'type_id',
    ];
    public function type()
    {
        return $this->hasOne(Type::class, 'id', 'type_id');
    }

    public function owner()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }

    public function facilities()
    {
        return $this->belongsToMany(Facility::class, 'hotel_facility');
    }
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    public function userFavorites()
    {
        return $this->hasMany(UserFavorite::class, 'hotel_id');
    }
}
