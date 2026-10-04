<?php

namespace App\Actions\Reports;

use App\Enums\ParticipantCategory;
use App\Models\Participant;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ParticipantReport
{
    /**
     * Mengambil dan memetakan seluruh data sasaran peserta aktif posyandu.
     *
     * @return Collection<int, mixed>
     */
    public function execute(): Collection
    {
        return Participant::query()
            ->with(['toddler', 'latestPregnancy', 'teen', 'adult'])
            ->orderBy('name')
            ->get()
            ->map(function (Participant $p, int $index): array {
                $infoKhusus = match ($p->category) {
                    ParticipantCategory::Toddler => $p->toddler ? 'Ortu: '.$p->toddler->parent_name : '-',
                    ParticipantCategory::PregnantMother => $p->latestPregnancy ? 'Suami: '.$p->latestPregnancy->husband_name : '-',
                    ParticipantCategory::Teenager => $p->teen ? 'Ortu: '.$p->teen->parent_name : '-',
                    ParticipantCategory::Adult, ParticipantCategory::Productive => $p->adult ? 'Pekerjaan: '.$p->adult->employment_label : '-',
                };

                return [
                    'no' => $index + 1,
                    'nik' => $p->nik ?? '-',
                    'name' => $p->name,
                    'category' => $p->category->label(),
                    'gender' => $p->gender->label(),
                    'birth_date' => $p->birth_date->format('d/m/Y'),
                    'age' => $p->birth_date->diff(Carbon::now())->format('%y Thn %m Bln'),
                    'address' => $p->address ?? '-',
                    'rt_rw' => 'RT '.($p->rt ?? '-').' / RW '.($p->rw ?? '-'),
                    'phone' => $p->phone ?? '-',
                    'has_bpjs' => $p->has_bpjs ? 'Ya' : 'Tidak',
                    'bpjs_number' => $p->bpjs_number ?? '-',
                    'info_khusus' => $infoKhusus,
                    'status' => $p->is_active ? 'Aktif' : 'Nonaktif',
                ];
            });
    }
}
