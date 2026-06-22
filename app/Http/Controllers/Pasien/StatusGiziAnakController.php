<?php
namespace App\Http\Controllers\Pasien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StatusGiziAnakController extends Controller
{
    public function index()
    {
        return view('pasien.gizi_anak.index');
    }

    public function hitung(Request $request)
    {
        $request->validate([
            'nama_anak' => 'required',
            'usia' => 'required|numeric',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
            'jenis_kelamin' => 'required',
        ]);

        $berat = $request->berat_badan;
        $tinggi = $request->tinggi_badan;
        $usia = $request->usia;

        if ($berat < ($usia * 0.5 + 3)) {
            $status = 'Gizi Kurang';
        } elseif ($berat > ($usia * 0.8 + 5)) {
            $status = 'Gizi Lebih';
        } else {
            $status = 'Gizi Baik';
        }

        return view('pasien.gizi_anak.hasil', compact(
            'status', 'berat', 'tinggi', 'usia',
            'request'
        ));
    }
}
