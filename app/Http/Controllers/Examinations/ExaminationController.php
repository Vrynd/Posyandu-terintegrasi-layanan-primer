<?php

namespace App\Http\Controllers\Examinations;

use App\Actions\Examinations\CreateExamination;
use App\Enums\BmiCategory;
use App\Enums\DiseaseHistory;
use App\Enums\EducationTopic;
use App\Enums\ExaminationLocation;
use App\Enums\IndependenceLevel;
use App\Enums\Intervention;
use App\Enums\RiskBehavior;
use App\Enums\SensoryTestResult;
use App\Enums\TbcSymptom;
use App\Enums\WeightStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Examinations\CreateExaminationRequest;
use App\Models\Participant;
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
    public function create(Request $request): Response
    {
        $selectedParticipant = null;

        if ($request->filled('participant')) {
            $selectedParticipant = Participant::query()
                ->where('ulid', $request->string('participant'))
                ->with(['latestPregnancy'])
                ->first();
        }

        $participants = Participant::query()
            ->select(['id', 'ulid', 'name', 'category', 'birth_date', 'gender', 'nik_hash'])
            ->where('is_active', true)
            ->with(['latestPregnancy'])
            ->orderBy('name')
            ->get();

        return Inertia::render('examinations/Create', [
            'participants' => $participants,
            'selectedParticipant' => $selectedParticipant,
            'locations' => ExaminationLocation::toOptions(),
            'weightStatuses' => WeightStatus::toOptions(),
            'bmiCategories' => BmiCategory::toOptions(),
            'sensoryResults' => SensoryTestResult::toOptions(),
            'tbcSymptoms' => TbcSymptom::toOptions(),
            'educationTopics' => EducationTopic::toOptions(),
            'independenceLevels' => IndependenceLevel::toOptions(),
            'toddlerInterventions' => Intervention::toOptions(),
            'diseaseHistories' => DiseaseHistory::toOptions(),
            'riskBehaviors' => RiskBehavior::toOptions(),
        ]);
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
