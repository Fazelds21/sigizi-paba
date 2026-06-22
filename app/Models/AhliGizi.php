<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AhliGizi extends Model
{
    protected $table = 'ahli_gizi';
    protected $fillable = [
        'user_id', 'nama', 'spesialisasi',
        'no_telepon', 'bio', 'rating'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function konsultasi() {
        return $this->hasMany(Konsultasi::class);
    }

    public function jadwal() {
        return $this->hasMany(Jadwal::class);
    }
}
