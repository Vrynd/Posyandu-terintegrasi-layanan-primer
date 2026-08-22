<?php

namespace App\Http\Controllers\Participants;

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
    // Const
    private const CATEGORY_OPTIONS = [
        ['label' => 'Ibu Hamil', 'value' => 'pregnant_mother'],
        ['label' => 'Balita', 'value' => 'toddler'],
        ['label' => 'Anak Remaja', 'value' => 'teenager'],
        ['label' => 'Usia Produktif', 'value' => 'productive'],
        ['label' => 'Usia Lansia', 'value' => 'adult'],
    ];

    private const GENDER_OPTIONS = [
        ['label' => 'Laki-Laki', 'value' => 'male'],
        ['label' => 'Perempuan', 'value' => 'female'],
    ];

    private const BPJS_OPTIONS = [
        ['label' => 'Ya', 'value' => '1'],
        ['label' => 'Tidak', 'value' => '0'],
    ];

    private const MARITAL_STATUS_OPTIONS = [
        ['label' => 'Belum Menikah', 'value' => 'single'],
        ['label' => 'Menikah', 'value' => 'married'],
        ['label' => 'Cerai Hidup', 'value' => 'divorced'],
        ['label' => 'Cerai Mati', 'value' => 'widowed'],
    ];

    private const EMPLOYMENT_OPTIONS = [
        ['label' => 'Petani', 'value' => 'farmer'],
        ['label' => 'Buruh Tani', 'value' => 'farm_laborer'],
        ['label' => 'PNS', 'value' => 'civil_servant'],
        ['label' => 'Karyawan Swasta', 'value' => 'private_employee'],
        ['label' => 'Wiraswasta', 'value' => 'entrepreneur'],
        ['label' => 'Nelayan', 'value' => 'fisherman'],
        ['label' => 'Ibu Rumah Tangga', 'value' => 'housewife'],
        ['label' => 'Belum Bekerja', 'value' => 'unemployed_new'],
        ['label' => 'Tidak Bekerja', 'value' => 'unemployed'],
        ['label' => 'Lainnya', 'value' => 'other'],
    ];

    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $query = Participant::query();

        if (is_string($search) && $search !== '') {
            $query->where(function ($q) use ($search) {
                if (ctype_digit($search) && strlen($search) === 16) {
                    $q->where('nik_hash', hash('sha256', $search));
                } else {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                }
            });
        }

        $participants = $query->latest('id')->paginate(10)->withQueryString();

        return Inertia::render('participants/Index', [
            'participants' => $participants,
            'filters' => [
                'search' => is_string($search) ? $search : null,
            ],
        ]);
    }

    // Method untuk halaman pendaftaran peserta
    public function create(): Response
    {
        return Inertia::render('participants/CreateParticipant', [
            'category' => self::CATEGORY_OPTIONS,
            'gender' => self::GENDER_OPTIONS,
            'membershipBpjs' => self::BPJS_OPTIONS,
            'employment' => self::EMPLOYMENT_OPTIONS,
            'martialStatus' => self::MARITAL_STATUS_OPTIONS,
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
                    'pregnant_mother' => $participant->pregnancy()->create([
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
