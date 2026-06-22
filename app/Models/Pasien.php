<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pasien extends Model
{
    protected $table = 'pasien';
    protected $fillable = [
        'user_id', 'nama', 'jenis_kelamin', 'tanggal_lahir',
        'no_telepon', 'alamat', 'berat_badan', 'tinggi_badan',
        'bmi', 'status_gizi'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function konsultasi() {
        return $this->hasMany(Konsultasi::class);
    }
}
