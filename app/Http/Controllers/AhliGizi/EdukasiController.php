<?php
namespace App\Http\Controllers\AhliGizi;

use App\Http\Controllers\Controller;
use App\Models\Edukasi;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EdukasiController extends Controller
{
    public function index()
    {
        $edukasi = Edukasi::where('user_id', Auth::id())->latest()->get();
        $video = Video::where('user_id', Auth::id())->latest()->get();
        return view('ahli_gizi.edukasi', compact('edukasi', 'video'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required',
            'kategori' => 'required',
            'tipe' => 'required',
        ]);

        Edukasi::create([
            'user_id' => Auth::id(),
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'kategori' => $request->kategori,
            'tipe' => $request->tipe,
        ]);

        return redirect()->route('ahli_gizi.edukasi.index')
            ->with('success', 'Konten edukasi berhasil ditambahkan');
    }

    public function destroy(Edukasi $edukasi)
    {
        $edukasi->delete();
        return redirect()->route('ahli_gizi.edukasi.index')
            ->with('success', 'Konten edukasi berhasil dihapus');
    }
}
