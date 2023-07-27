<?php

namespace App\Models;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    use HasFactory;
    protected $table = 'amenities';
    protected $fillable = [
        'name',
    ];

    protected function categories()
    {
        return $this->belongsToMany(Category::class, 'category_amenity', 'amenity_id', 'category_id');
    }
}
