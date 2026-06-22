<?php

use Illuminate\Support\Facades\Route;

// Auth
Route::get('/', function () {
    return view('welcome');
})->name('home');

require __DIR__.'/auth.php';

// Admin Routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    // Kelola Pasien
    Route::get('/pasien', [App\Http\Controllers\Admin\PasienController::class, 'index'])->name('pasien.index');
    Route::get('/pasien/create', [App\Http\Controllers\Admin\PasienController::class, 'create'])->name('pasien.create');
    Route::post('/pasien', [App\Http\Controllers\Admin\PasienController::class, 'store'])->name('pasien.store');
    Route::get('/pasien/{pasien}/edit', [App\Http\Controllers\Admin\PasienController::class, 'edit'])->name('pasien.edit');
    Route::put('/pasien/{pasien}', [App\Http\Controllers\Admin\PasienController::class, 'update'])->name('pasien.update');
    Route::delete('/pasien/{pasien}', [App\Http\Controllers\Admin\PasienController::class, 'destroy'])->name('pasien.destroy');

    // Manajemen Jadwal
    Route::get('/jadwal', [App\Http\Controllers\Admin\JadwalController::class, 'index'])->name('jadwal.index');
    Route::get('/jadwal/create', [App\Http\Controllers\Admin\JadwalController::class, 'create'])->name('jadwal.create');
    Route::post('/jadwal', [App\Http\Controllers\Admin\JadwalController::class, 'store'])->name('jadwal.store');
    Route::delete('/jadwal/{jadwal}', [App\Http\Controllers\Admin\JadwalController::class, 'destroy'])->name('jadwal.destroy');

    // Laporan Statistik
    Route::get('/laporan', [App\Http\Controllers\Admin\LaporanController::class, 'index'])->name('laporan.index');

    // Master Data
    Route::get('/master', [App\Http\Controllers\Admin\MasterDataController::class, 'index'])->name('master.index');
    Route::post('/master', [App\Http\Controllers\Admin\MasterDataController::class, 'store'])->name('master.store');
    Route::delete('/master/{ahliGizi}', [App\Http\Controllers\Admin\MasterDataController::class, 'destroy'])->name('master.destroy');
});

// Ahli Gizi Routes
Route::middleware(['auth'])->prefix('ahli-gizi')->name('ahli_gizi.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\AhliGizi\DashboardController::class, 'index'])->name('dashboard');

    // Monitoring Pasien
    Route::get('/monitoring', [App\Http\Controllers\AhliGizi\MonitoringPasienController::class, 'index'])->name('monitoring.index');

    // Riwayat Konsultasi
    Route::get('/riwayat', [App\Http\Controllers\AhliGizi\RiwayatKonsultasiController::class, 'index'])->name('riwayat.index');

    // Rekam Konsultasi
    Route::get('/rekam', [App\Http\Controllers\AhliGizi\RekamKonsultasiController::class, 'index'])->name('rekam.index');
    Route::put('/rekam/{konsultasi}', [App\Http\Controllers\AhliGizi\RekamKonsultasiController::class, 'update'])->name('rekam.update');

    // Kelola Edukasi
    Route::get('/edukasi', [App\Http\Controllers\AhliGizi\EdukasiController::class, 'index'])->name('edukasi.index');
    Route::post('/edukasi', [App\Http\Controllers\AhliGizi\EdukasiController::class, 'store'])->name('edukasi.store');
    Route::delete('/edukasi/{edukasi}', [App\Http\Controllers\AhliGizi\EdukasiController::class, 'destroy'])->name('edukasi.destroy');
});

// Pasien Routes
Route::middleware(['auth'])->prefix('pasien')->name('pasien.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Pasien\DashboardController::class, 'index'])->name('dashboard');

    // Hitung IMT
    Route::get('/imt', [App\Http\Controllers\Pasien\IMTController::class, 'index'])->name('imt.index');
    Route::post('/imt', [App\Http\Controllers\Pasien\IMTController::class, 'hitung'])->name('imt.hitung');

    // Status Gizi Anak
    Route::get('/gizi-anak', [App\Http\Controllers\Pasien\StatusGiziAnakController::class, 'index'])->name('gizi_anak.index');
    Route::post('/gizi-anak', [App\Http\Controllers\Pasien\StatusGiziAnakController::class, 'hitung'])->name('gizi_anak.hitung');

    // Konsultasi Online
    Route::get('/konsultasi', [App\Http\Controllers\Pasien\KonsultasiController::class, 'index'])->name('konsultasi.index');
    Route::post('/konsultasi', [App\Http\Controllers\Pasien\KonsultasiController::class, 'store'])->name('konsultasi.store');
    Route::get('/konsultasi/riwayat', [App\Http\Controllers\Pasien\KonsultasiController::class, 'riwayat'])->name('konsultasi.riwayat');
    Route::get('/konsultasi/whatsapp/{ahliGizi}', [App\Http\Controllers\Pasien\KonsultasiController::class, 'whatsapp'])->name('konsultasi.whatsapp');

    // Edukasi / Panduan
    Route::get('/edukasi', [App\Http\Controllers\Pasien\EdukasiController::class, 'index'])->name('edukasi.index');
    Route::get('/edukasi/{edukasi}', [App\Http\Controllers\Pasien\EdukasiController::class, 'show'])->name('edukasi.show');

    // Video
    Route::get('/video', [App\Http\Controllers\Pasien\VideoController::class, 'index'])->name('video.index');
    Route::get('/video/{video}', [App\Http\Controllers\Pasien\VideoController::class, 'show'])->name('video.show');
});
