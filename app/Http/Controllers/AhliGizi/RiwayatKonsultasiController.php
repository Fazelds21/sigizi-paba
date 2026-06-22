<?php
namespace App\Http\Controllers\AhliGizi;

use App\Http\Controllers\Controller;
use App\Models\Konsultasi;
use App\Models\AhliGizi;
use Illuminate\Support\Facades\Auth;

class RiwayatKonsultasiController extends Controller
{
    public function index()
    {
        $ahliGizi = AhliGizi::where('user_id', Auth::id())->first();
        $riwayat = Konsultasi::where('ahli_gizi_id', $ahliGizi->id)
            ->with('pasien')
            ->latest()
            ->get();

        return view('ahli_gizi.riwayat', compact('riwayat'));
    }
}
