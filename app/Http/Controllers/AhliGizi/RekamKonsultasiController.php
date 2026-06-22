<?php
namespace App\Http\Controllers\AhliGizi;

use App\Http\Controllers\Controller;
use App\Models\Konsultasi;
use App\Models\AhliGizi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RekamKonsultasiController extends Controller
{
    public function index()
    {
        $ahliGizi = AhliGizi::where('user_id', Auth::id())->first();
        $konsultasi = Konsultasi::where('ahli_gizi_id', $ahliGizi->id)
            ->where('status', 'berlangsung')
            ->with('pasien')
            ->get();

        return view('ahli_gizi.rekam', compact('konsultasi'));
    }

    public function update(Request $request, Konsultasi $konsultasi)
    {
        $request->validate([
            'catatan' => 'required',
            'status' => 'required',
        ]);

        $konsultasi->update([
            'catatan' => $request->catatan,
            'status' => $request->status,
        ]);

        return redirect()->route('ahli_gizi.rekam.index')
            ->with('success', 'Rekam konsultasi berhasil disimpan');
    }
}
