<?php
namespace App\Http\Controllers\Pasien;

use App\Http\Controllers\Controller;
use App\Models\Pasien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IMTController extends Controller
{
    public function index()
    {
        return view('pasien.imt.index');
    }

    public function hitung(Request $request)
    {
        $request->validate([
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
        ]);

        $berat = $request->berat_badan;
        $tinggi = $request->tinggi_badan / 100;
        $bmi = round($berat / ($tinggi * $tinggi), 1);

        if ($bmi < 18.5) {
            $status = 'Kekurangan Berat Badan';
        } elseif ($bmi < 25) {
            $status = 'Normal';
        } elseif ($bmi < 30) {
            $status = 'Kelebihan Berat Badan';
        } else {
            $status = 'Obesitas';
        }

        $pasien = Pasien::where('user_id', Auth::id())->first();
        if ($pasien) {
            $pasien->update([
                'berat_badan' => $berat,
                'tinggi_badan' => $request->tinggi_badan,
                'bmi' => $bmi,
                'status_gizi' => $status,
            ]);
        }

        return view('pasien.imt.hasil', compact('bmi', 'status', 'berat', 'tinggi'));
    }
}
