<?php
namespace App\Http\Controllers\Pasien;

use App\Http\Controllers\Controller;
use App\Models\Video;

class VideoController extends Controller
{
    public function index()
    {
        $video = Video::latest()->get();
        return view('pasien.video.index', compact('video'));
    }

    public function show(Video $video)
    {
        $video->increment('views');
        return view('pasien.video.show', compact('video'));
    }
}
