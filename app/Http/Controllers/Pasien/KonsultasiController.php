<?php
namespace App\Http\Controllers\Pasien;

use App\Http\Controllers\Controller;
use App\Models\Konsultasi;
use App\Models\AhliGizi;
use App\Models\Pasien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KonsultasiController extends Controller
{
    public function index()
    {
        $ahliGizi = AhliGizi::all();
        return view('pasien.konsultasi.index', compact('ahliGizi'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'ahli_gizi_id' => 'required',
            'waktu_konsultasi' => 'required|date',
        ]);

        $pasien = Pasien::where('user_id', Auth::id())->first();

        Konsultasi::create([
            'pasien_id' => $pasien->id,
            'ahli_gizi_id' => $request->ahli_gizi_id,
            'waktu_konsultasi' => $request->waktu_konsultasi,
            'status' => 'terjadwal',
        ]);

        return redirect()->route('pasien.konsultasi.riwayat')
            ->with('success', 'Konsultasi berhasil dijadwalkan');
    }

    public function riwayat()
    {
        $pasien = Pasien::where('user_id', Auth::id())->first();
        $riwayat = Konsultasi::where('pasien_id', $pasien->id)
            ->with('ahliGizi')
            ->latest()
            ->get();

        return view('pasien.konsultasi.riwayat', compact('riwayat'));
    }

    public function whatsapp(AhliGizi $ahliGizi)
    {
        $noTelepon = $ahliGizi->no_telepon;
        $linkWa = "https://wa.me/{$noTelepon}";
        return redirect($linkWa);
    }
}
