<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Image extends Model
{
    use HasFactory;
    protected $table = 'images';
    protected $fillable = [
        'hotel_id',
        'image_link',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'hotel_id');
    }
    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }
}
