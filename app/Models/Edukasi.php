<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Edukasi extends Model
{
    protected $fillable = [
        'user_id', 'judul', 'deskripsi',
        'kategori', 'file_path', 'tipe', 'views'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
