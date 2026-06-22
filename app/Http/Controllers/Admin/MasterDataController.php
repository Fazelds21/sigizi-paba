<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AhliGizi;
use App\Models\User;
use Illuminate\Http\Request;

class MasterDataController extends Controller
{
    public function index()
    {
        $ahliGizi = AhliGizi::with('user')->latest()->get();
        return view('admin.master.index', compact('ahliGizi'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'spesialisasi' => 'required',
        ]);

        $user = User::create([
            'name' => $request->nama,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'ahli_gizi',
        ]);

        AhliGizi::create([
            'user_id' => $user->id,
            'nama' => $request->nama,
            'spesialisasi' => $request->spesialisasi,
            'no_telepon' => $request->no_telepon,
            'bio' => $request->bio,
        ]);

        return redirect()->route('admin.master.index')
            ->with('success', 'Data ahli gizi berhasil ditambahkan');
    }

    public function destroy(AhliGizi $ahliGizi)
    {
        $ahliGizi->user->delete();
        return redirect()->route('admin.master.index')
            ->with('success', 'Data ahli gizi berhasil dihapus');
    }
}
