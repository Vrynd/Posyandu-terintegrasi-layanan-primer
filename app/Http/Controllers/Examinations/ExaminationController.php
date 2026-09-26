<?php

namespace App\Http\Controllers\Examinations;

use App\Actions\Examinations\CreateExamination;
use App\Enums\BmiCategory;
use App\Enums\ContraceptiveMethod;
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
use App\Models\ScreeningQuestion;
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
    public function create(Participant $participant): Response
    {
        $participant->loadMissing(['latestPregnancy', 'latestExamination']);

        $screening = ScreeningQuestion::query()
            ->where('is_active', true)
            ->orderBy('order')
            ->get()
            ->groupBy(fn ($item) => $item->category->value);

        return Inertia::render('examinations/Create', [
            'participant' => $participant,
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
            'contraceptiveMethods' => ContraceptiveMethod::toOptions(),
            'screenings' => $screening,
        ]);
    }

    /**
     * Simpan Data Pemeriksaan
     */
    public function store(CreateExaminationRequest $request, Participant $participant, CreateExamination $action): RedirectResponse
    {
        $validated = $request->validated();
        $validated['participant_id'] = $participant->id;

        $action->execute($validated);

        session()->flash('success', 'Data pemeriksaan posyandu berhasil disimpan.');

        return redirect()->route('participants.show', ['participant' => $participant->ulid]);
    }
}
