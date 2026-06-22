<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Konsultasi;
use App\Models\Pasien;
use App\Models\AhliGizi;

class LaporanController extends Controller
{
    public function index()
    {
        $totalKonsultasi = Konsultasi::count();
        $konsultasiSelesai = Konsultasi::where('status', 'selesai')->count();
        $totalPasien = Pasien::count();
        $totalAhliGizi = AhliGizi::count();
        $konsultasiPerBulan = Konsultasi::selectRaw('MONTH(created_at) as bulan, COUNT(*) as total')
            ->groupBy('bulan')->get();

        return view('admin.laporan.index', compact(
            'totalKonsultasi', 'konsultasiSelesai',
            'totalPasien', 'totalAhliGizi', 'konsultasiPerBulan'
        ));
    }
}
