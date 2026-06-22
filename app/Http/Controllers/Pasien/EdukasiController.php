<?php
namespace App\Http\Controllers\Pasien;

use App\Http\Controllers\Controller;
use App\Models\Edukasi;

class EdukasiController extends Controller
{
    public function index()
    {
        $edukasi = Edukasi::latest()->get();
        return view('pasien.edukasi.index', compact('edukasi'));
    }

    public function show(Edukasi $edukasi)
    {
        $edukasi->increment('views');
        return view('pasien.edukasi.show', compact('edukasi'));
    }
}
