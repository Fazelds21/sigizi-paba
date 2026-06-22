<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jadwal extends Model
{
    protected $fillable = [
        'ahli_gizi_id', 'hari', 'jam_mulai',
        'jam_selesai', 'tersedia'
    ];

    public function ahliGizi() {
        return $this->belongsTo(AhliGizi::class);
    }
}
