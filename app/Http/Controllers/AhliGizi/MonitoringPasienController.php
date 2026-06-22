<?php
namespace App\Http\Controllers\AhliGizi;

use App\Http\Controllers\Controller;
use App\Models\Konsultasi;
use App\Models\AhliGizi;
use Illuminate\Support\Facades\Auth;

class MonitoringPasienController extends Controller
{
    public function index()
    {
        $ahliGizi = AhliGizi::where('user_id', Auth::id())->first();
        $pasien = Konsultasi::where('ahli_gizi_id', $ahliGizi->id)
            ->with('pasien')
            ->get()
            ->pluck('pasien')
            ->unique('id');

        return view('ahli_gizi.monitoring', compact('pasien'));
    }
}
