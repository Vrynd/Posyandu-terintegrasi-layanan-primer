<?php

namespace App\Http\Controllers\Participants;

use App\Enums\EmploymentStatus;
use App\Enums\Gender;
use App\Enums\MaritalStatus;
use App\Enums\ParticipantCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\ParticipantRequest;
use App\Models\Participant;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    // Constant untuk opsi membership bpjs
    private const BPJS_OPTIONS = [
        ['label' => 'Ya', 'value' => '1'],
        ['label' => 'Tidak', 'value' => '0'],
    ];

    // Method untuk halaman daftar peserta
    public function index(Request $request): Response
    {
        $search = $request->filled('search') ? (string) $request->input('search') : null;
        $category = $request->filled('category') ? (string) $request->input('category') : null;
        $sort = $request->filled('sort') ? (string) $request->input('sort') : null;
        $participants = Participant::query()
            ->search($search)
            ->ofCategory($category)
            ->sorted($sort)
            ->paginate(6)
            ->withQueryString();

        return Inertia::render('participants/Index', [
            'participants' => $participants,
            'categories' => ParticipantCategory::toOptions(),
            'filters' => [
                'search' => $search,
                'category' => $category,
                'sort' => $sort,
            ],
        ]);
    }

    // Method untuk halaman pendaftaran peserta
    public function create(): Response
    {
        return Inertia::render('participants/CreateParticipant', [
            'category' => ParticipantCategory::toOptions(),
            'gender' => Gender::toOptions(),
            'membershipBpjs' => self::BPJS_OPTIONS,
            'employment' => EmploymentStatus::toOptions(),
            'martialStatus' => MaritalStatus::toOptions(),
        ]);
    }

    // Method untuk menyimpan data peserta
    public function store(ParticipantRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($validated['nik'] ?? null) {
            $nikHash = hash('sha256', $validated['nik']);

            if (Participant::where('nik_hash', $nikHash)->exists()) {
                return back()
                    ->withErrors(['nik' => 'NIK ini sudah terdaftar atas nama peserta lain.'])
                    ->withInput();
            }
        }

        try {
            DB::transaction(function () use ($validated) {
                $participant = Participant::create([
                    'name' => $validated['name'],
                    'nik' => $validated['nik'] ?? null,
                    'birth_date' => $validated['birth_date'],
                    'gender' => $validated['gender'],
                    'category' => $validated['category'],
                    'address' => $validated['address'] ?? null,
                    'rt' => $validated['rt'] ?? null,
                    'rw' => $validated['rw'] ?? null,
                    'phone' => $validated['phone'] ?? null,
                    'has_bpjs' => $validated['has_bpjs'],
                    'bpjs_number' => $validated['has_bpjs'] ? $validated['bpjs_number'] : null,
                ]);

                match ($validated['category']) {
                    'toddler' => $participant->toddler()->create([
                        'parent_name' => $validated['parent_name'] ?? null,
                    ]),
                    'pregnant_mother' => $participant->pregnancies()->create([
                        'husband_name' => $validated['husband_name'] ?? null,
                    ]),
                    'teenager' => $participant->teen()->create([
                        'parent_name' => $validated['parent_name'] ?? null,
                    ]),
                    'productive', 'adult' => $participant->adult()->create([
                        'employment' => $validated['employment'] ?? null,
                        'employment_other' => ($validated['employment'] ?? null) === 'other'
                            ? $validated['employment_other']
                            : null,
                        'marital_status' => $validated['marital_status'] ?? null,
                    ]),
                    default => null,
                };
            });
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return back()
                    ->withErrors(['nik' => 'NIK ini sudah terdaftar atas nama peserta lain.'])
                    ->withInput();
            }
            throw $e;
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data peserta posyandu berhasil didaftarkan.',
        ]);

        return redirect()->route('participants.index');
    }
}
