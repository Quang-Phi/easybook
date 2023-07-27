<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryAmenity extends Model
{
    use HasFactory;
    protected $table = 'category_amenity';
    protected $fillable = [
        'category_id',
        'amenity_id',
    ];
}
