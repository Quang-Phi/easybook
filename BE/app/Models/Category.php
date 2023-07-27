<?php

namespace App\Models;


use App\Models\Amenity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $table = 'categories';
    protected $fillable = [
        'name',
        'image',
        'max_guests',
        'description',

    ];
    public function rooms()
    {
        return $this->hasMany(Room::class, 'category_id', 'id');
    }

    protected function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'category_amenity', 'category_id', 'amenity_id');
    }
}
