<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pasien;
use App\Models\AhliGizi;
use App\Models\Konsultasi;

class DashboardController extends Controller
{
    public function index()
    {
        $totalPasien = Pasien::count();
        $totalAhliGizi = AhliGizi::count();
        $totalKonsultasi = Konsultasi::count();
        $konsultasiTerbaru = Konsultasi::with(['pasien', 'ahliGizi'])
            ->latest()->take(5)->get();

        return view('admin.dashboard', compact(
            'totalPasien', 'totalAhliGizi',
            'totalKonsultasi', 'konsultasiTerbaru'
        ));
    }
}
