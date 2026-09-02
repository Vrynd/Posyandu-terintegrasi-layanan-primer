<?php

namespace App\Http\Controllers\Examinations;

use App\Actions\Examinations\CreateExamination;
use App\Http\Controllers\Controller;
use App\Http\Requests\Examinations\CreateExaminationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExaminationController extends Controller
{
    /**
     * Halaman Utama / Daftar Pemeriksaan
     */
    public function index(Request $request): Response
    {
        return Inertia::render('examinations/Index');
    }

    /**
     * Halaman Form Input Pemeriksaan Baru
     */
    public function create(): Response
    {
        return Inertia::render('examinations/Create');
    }

    /**
     * Simpan Data Pemeriksaan
     */
    public function store(CreateExaminationRequest $request, CreateExamination $action): RedirectResponse
    {
        $action->execute($request->validated());

        session()->flash('success', 'Data pemeriksaan posyandu berhasil disimpan.');

        return redirect()->route('examinations.index');
    }
}
