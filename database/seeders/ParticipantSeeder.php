<?php

namespace Database\Seeders;

use App\Enums\EmploymentStatus;
use App\Enums\Gender;
use App\Enums\MaritalStatus;
use App\Enums\ParticipantCategory;
use App\Models\Participant;
use Illuminate\Database\Seeder;

class ParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $participants = [
            // 1. Ibu Hamil: Dewi Ratnasari
            [
                'nik' => '3507125405960001',
                'name' => 'Dewi Ratnasari',
                'category' => ParticipantCategory::PregnantMother,
                'birth_date' => '1996-05-14',
                'gender' => Gender::Female,
                'address' => 'Jl. Mawar No. 12, Dusun Krajan',
                'rt' => '01',
                'rw' => '03',
                'phone' => '+6281234567801',
                'has_bpjs' => true,
                'bpjs_number' => '0001827364519',
                'is_active' => true,
                'pregnancy' => [
                    'husband_name' => 'Budi Prasetyo',
                    'status' => 'active',
                ],
            ],
            // 2. Remaja: Nadia Putri Azzahra
            [
                'nik' => '3507126809100003',
                'name' => 'Nadia Putri Azzahra',
                'category' => ParticipantCategory::Teenager,
                'birth_date' => '2011-10-28',
                'gender' => Gender::Female,
                'address' => 'Jl. Melati RT 03 RW 02, Desa Tondomulyo',
                'rt' => '04',
                'rw' => '04',
                'phone' => '+6285712345603',
                'has_bpjs' => false,
                'bpjs_number' => null,
                'is_active' => true,
                'teen' => [
                    'parent_name' => 'Ahmad Fauzi',
                ],
            ],
            // 3. Usia Produktif: Rudi Hermawan
            [
                'nik' => '3507121508880004',
                'name' => 'Rudi Hermawan',
                'category' => ParticipantCategory::Productive,
                'birth_date' => '1988-04-15',
                'gender' => Gender::Male,
                'address' => 'Perum Griya Indah Blok C-5',
                'rt' => '03',
                'rw' => '07',
                'phone' => '+6282134567804',
                'has_bpjs' => true,
                'bpjs_number' => '0003847291054',
                'is_active' => true,
                'adult' => [
                    'employment' => EmploymentStatus::PrivateEmployee,
                    'employment_other' => null,
                    'marital_status' => MaritalStatus::Married,
                ],
            ],
            // 4. Lansia: Sukirno
            [
                'nik' => '3507120101550005',
                'name' => 'Sukirno',
                'category' => ParticipantCategory::Adult,
                'birth_date' => '1955-01-01',
                'gender' => Gender::Male,
                'address' => 'Dusun Tondo RT 01 RW 01',
                'rt' => '01',
                'rw' => '01',
                'phone' => '+6281298765405',
                'has_bpjs' => true,
                'bpjs_number' => '0004958372619',
                'is_active' => true,
                'adult' => [
                    'employment' => EmploymentStatus::Farmer,
                    'employment_other' => null,
                    'marital_status' => MaritalStatus::Widowed,
                ],
            ],
            // 5. Ibu Hamil: Siti Rahmawati
            [
                'nik' => '3507125508980002',
                'name' => 'Siti Rahmawati',
                'category' => ParticipantCategory::PregnantMother,
                'birth_date' => '1997-03-15',
                'gender' => Gender::Female,
                'address' => 'Jl. Melati No. 45',
                'rt' => '02',
                'rw' => '04',
                'phone' => '+6285712345672',
                'has_bpjs' => true,
                'bpjs_number' => '0002837491023',
                'is_active' => true,
                'pregnancy' => [
                    'husband_name' => 'Agus Setiawan',
                    'status' => 'active',
                ],
            ],
            // 6. Balita: Muhammad Rayyan Pratama
            [
                'nik' => '3201011504220003',
                'name' => 'Muhammad Rayyan Pratama',
                'category' => ParticipantCategory::Toddler,
                'birth_date' => '2020-06-22',
                'gender' => Gender::Male,
                'address' => 'Perum Permata Hijau Blok C3',
                'rt' => '04',
                'rw' => '08',
                'phone' => '+6281398765433',
                'has_bpjs' => true,
                'bpjs_number' => '0001234567892',
                'is_active' => true,
                'toddler' => [
                    'parent_name' => 'Budi Pratama',
                ],
            ],
            // 7. Usia Produktif: Putri Dian Anggraini
            [
                'nik' => '3201015002010008',
                'name' => 'Putri Dian Anggraini',
                'category' => ParticipantCategory::Productive,
                'birth_date' => '2001-02-08',
                'gender' => Gender::Female,
                'address' => 'Kp. Sindanggalih No. 22',
                'rt' => '03',
                'rw' => '04',
                'phone' => '+6285812345678',
                'has_bpjs' => false,
                'bpjs_number' => null,
                'is_active' => true,
                'adult' => [
                    'employment' => EmploymentStatus::Other,
                    'employment_other' => 'Freelance Desainer Grafis',
                    'marital_status' => MaritalStatus::Single,
                ],
            ],
            // 8. Remaja: Nabila Syakirah
            [
                'nik' => '3201015809120006',
                'name' => 'Nabila Syakirah',
                'category' => ParticipantCategory::Teenager,
                'birth_date' => '2011-09-11',
                'gender' => Gender::Female,
                'address' => 'Jl. Mawar Indah Gang 3 No. 17',
                'rt' => '04',
                'rw' => '04',
                'phone' => '+6289612345606',
                'has_bpjs' => true,
                'bpjs_number' => '0003456789013',
                'is_active' => true,
                'teen' => [
                    'parent_name' => 'Sri Wahyuni',
                ],
            ],
        ];

        foreach ($participants as $data) {
            $toddlerData = $data['toddler'] ?? null;
            $pregnancyData = $data['pregnancy'] ?? null;
            $teenData = $data['teen'] ?? null;
            $adultData = $data['adult'] ?? null;

            unset($data['toddler'], $data['pregnancy'], $data['teen'], $data['adult']);

            $participant = Participant::create($data);

            if ($toddlerData) {
                $participant->toddler()->create($toddlerData);
            }

            if ($pregnancyData) {
                $participant->pregnancies()->create($pregnancyData);
            }

            if ($teenData) {
                $participant->teen()->create($teenData);
            }

            if ($adultData) {
                $participant->adult()->create($adultData);
            }
        }
    }
}
