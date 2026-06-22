<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\AhliGizi;
use Illuminate\Http\Request;

class JadwalController extends Controller
{
    public function index()
    {
        $jadwal = Jadwal::with('ahliGizi')->latest()->get();
        return view('admin.jadwal.index', compact('jadwal'));
    }

    public function create()
    {
        $ahliGizi = AhliGizi::all();
        return view('admin.jadwal.create', compact('ahliGizi'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'ahli_gizi_id' => 'required',
            'hari' => 'required',
            'jam_mulai' => 'required',
            'jam_selesai' => 'required',
        ]);

        Jadwal::create($request->all());

        return redirect()->route('admin.jadwal.index')
            ->with('success', 'Jadwal berhasil ditambahkan');
    }

    public function destroy(Jadwal $jadwal)
    {
        $jadwal->delete();
        return redirect()->route('admin.jadwal.index')
            ->with('success', 'Jadwal berhasil dihapus');
    }
}
