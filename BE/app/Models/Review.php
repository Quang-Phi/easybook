<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;
    protected $table = 'reviews';
    protected $fillable = [
        'user_id',
        'hotel_id',
        'review',
        'rating',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
}
