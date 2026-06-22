<?php
namespace App\Http\Controllers\Pasien;

use App\Http\Controllers\Controller;
use App\Models\Pasien;
use App\Models\Konsultasi;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $pasien = Pasien::where('user_id', Auth::id())->first();
        $konsultasiTerbaru = Konsultasi::where('pasien_id', $pasien->id)
            ->with('ahliGizi')
            ->latest()
            ->take(3)
            ->get();

        return view('pasien.dashboard', compact('pasien', 'konsultasiTerbaru'));
    }
}
