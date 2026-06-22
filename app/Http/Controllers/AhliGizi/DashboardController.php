<?php
namespace App\Http\Controllers\AhliGizi;

use App\Http\Controllers\Controller;
use App\Models\Konsultasi;
use App\Models\AhliGizi;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $ahliGizi = AhliGizi::where('user_id', Auth::id())->first();
        $konsultasiHariIni = Konsultasi::where('ahli_gizi_id', $ahliGizi->id)
            ->whereDate('waktu_konsultasi', today())
            ->get();
        $totalPasien = Konsultasi::where('ahli_gizi_id', $ahliGizi->id)
            ->distinct('pasien_id')->count();
        $konsultasiSelesai = Konsultasi::where('ahli_gizi_id', $ahliGizi->id)
            ->where('status', 'selesai')->count();

        return view('ahli_gizi.dashboard', compact(
            'ahliGizi', 'konsultasiHariIni',
            'totalPasien', 'konsultasiSelesai'
        ));
    }
}
