<?php

namespace App\Models;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = ['booking_id', 'amount', 'status'];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
