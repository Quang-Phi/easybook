<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserFavorite extends Model
{
    use HasFactory;
    protected $table = 'user_favorites';
    protected $fillable = [
        'user_id',
        'hotel_id'
    ];
    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'hotel_id');
    }
}
