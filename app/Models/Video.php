<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'user_id', 'judul', 'deskripsi',
        'kategori', 'url_video', 'durasi', 'views'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
