<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Konsultasi extends Model
{
    protected $fillable = [
        'pasien_id', 'ahli_gizi_id', 'waktu_konsultasi',
        'status', 'catatan', 'link_whatsapp'
    ];

    public function pasien() {
        return $this->belongsTo(Pasien::class);
    }

    public function ahliGizi() {
        return $this->belongsTo(AhliGizi::class);
    }
}
