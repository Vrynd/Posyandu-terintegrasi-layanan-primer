<?php

namespace App\Http\Controllers\Participants;

use App\Actions\Participants\CreateParticipant;
use App\Actions\Participants\UpdateParticipant;
use App\Enums\BpjsStatus;
use App\Enums\EmploymentStatus;
use App\Enums\Gender;
use App\Enums\MaritalStatus;
use App\Enums\ParticipantCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\Participants\CreateParticipantRequest;
use App\Http\Requests\Participants\IndexParticipantRequest;
use App\Http\Requests\Participants\UpdateParticipantRequest;
use App\Models\Participant;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    // Method untuk halaman daftar peserta
    public function index(IndexParticipantRequest $request): Response
    {
        $filters = $request->toFilters();
        $participants = Participant::query()
            ->search($filters['search'])
            ->ofCategory($filters['category'])
            ->sorted($filters['sort'])
            ->paginate(6)
            ->withQueryString();

        return Inertia::render('participants/Index', [
            'participants' => $participants,
            'categories' => ParticipantCategory::toOptions(),
            'filters' => $filters,
        ]);
    }

    // Method untuk halaman pendaftaran peserta
    public function create(): Response
    {
        return Inertia::render('participants/CreateParticipant', [
            'category' => ParticipantCategory::toOptions(),
            'gender' => Gender::toOptions(),
            'membershipBpjs' => BpjsStatus::toOptions(),
            'employment' => EmploymentStatus::toOptions(),
            'maritalStatus' => MaritalStatus::toOptions(),
        ]);
    }

    // Method untuk menyimpan data peserta
    public function store(CreateParticipantRequest $request, CreateParticipant $action): RedirectResponse
    {
        $validated = $request->validated();

        if ($duplicateNik = $this->ensureUniqueNik($validated['nik'] ?? null)) {
            return $duplicateNik;
        }

        try {
            $action->execute($validated);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return back()
                    ->withErrors(['nik' => 'NIK ini sudah terdaftar atas nama peserta lain.'])
                    ->withInput();
            }
            throw $e;
        }

        session()->flash('success', 'Data peserta posyandu berhasil didaftarkan.');

        return redirect()->route('participants.index');
    }

    public function edit(Participant $participant): Response
    {
        $participant->load([
            'toddler',
            'latestPregnancy',
            'teen',
            'adult',
        ]);

        $participant->makeVisible(['nik', 'bpjs_number']);

        return Inertia::render('participants/UpdateParticipant', [
            'participant' => $participant,
            'category' => ParticipantCategory::toOptions(),
            'gender' => Gender::toOptions(),
            'membershipBpjs' => BpjsStatus::toOptions(),
            'employment' => EmploymentStatus::toOptions(),
            'maritalStatus' => MaritalStatus::toOptions(),
        ]);
    }

    public function update(
        UpdateParticipantRequest $request,
        Participant $participant,
        UpdateParticipant $action
    ): RedirectResponse {
        $validated = $request->validated();

        if ($duplicateNik = $this->ensureUniqueNik($validated['nik'] ?? null, $participant)) {
            return $duplicateNik;
        }

        try {
            $action->execute($participant, $validated);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return back()
                    ->withErrors(['nik' => 'NIK ini sudah terdaftar atas nama peserta lain.'])
                    ->withInput();
            }
            throw $e;
        }

        session()->flash('success', 'Data peserta posyandu berhasil diperbarui.');

        return redirect()->route('participants.edit', $participant);
    }

    private function ensureUniqueNik(?string $nik, ?Participant $except = null): ?RedirectResponse
    {
        if (! $nik) {
            return null;
        }

        $query = Participant::where('nik_hash', hash('sha256', $nik));

        if ($except) {
            $query->where('id', '!=', $except->id);
        }

        $exists = $query->exists();

        return $exists
            ? back()->withErrors(['nik' => 'NIK ini sudah terdaftar atas nama peserta lain.'])->withInput()
            : null;
    }
}
