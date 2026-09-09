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
            // 9. Balita: Arsyila Romeesa Farzana
            [
                'nik' => '3507125004220007',
                'name' => 'Arsyila Romeesa Farzana',
                'category' => ParticipantCategory::Toddler,
                'birth_date' => '2022-04-10',
                'gender' => Gender::Female,
                'address' => 'Dusun Krajan RT 02 RW 01',
                'rt' => '02',
                'rw' => '01',
                'phone' => '+6281234567807',
                'has_bpjs' => true,
                'bpjs_number' => '0005123456789',
                'is_active' => true,
                'toddler' => [
                    'parent_name' => 'Rendra Pratama',
                ],
            ],
            // 10. Balita: Kenzo Alfarizqi
            [
                'nik' => '3507121501230008',
                'name' => 'Kenzo Alfarizqi',
                'category' => ParticipantCategory::Toddler,
                'birth_date' => '2023-01-15',
                'gender' => Gender::Male,
                'address' => 'Jl. Dahlia No. 8',
                'rt' => '01',
                'rw' => '02',
                'phone' => '+6281345678908',
                'has_bpjs' => false,
                'bpjs_number' => null,
                'is_active' => true,
                'toddler' => [
                    'parent_name' => 'Fajar Nugraha',
                ],
            ],
            // 11. Balita: Alesha Zahra
            [
                'nik' => '3507126508210009',
                'name' => 'Alesha Zahra',
                'category' => ParticipantCategory::Toddler,
                'birth_date' => '2021-08-25',
                'gender' => Gender::Female,
                'address' => 'Jl. Anggrek No. 19',
                'rt' => '03',
                'rw' => '03',
                'phone' => '+6285678901209',
                'has_bpjs' => true,
                'bpjs_number' => '0006234567890',
                'is_active' => true,
                'toddler' => [
                    'parent_name' => 'Deni Kurniawan',
                ],
            ],
            // 12. Balita: Rafka Bilal Ramadhan
            [
                'nik' => '3507120311220010',
                'name' => 'Rafka Bilal Ramadhan',
                'category' => ParticipantCategory::Toddler,
                'birth_date' => '2022-11-03',
                'gender' => Gender::Male,
                'address' => 'Dusun Sumber RT 01 RW 05',
                'rt' => '01',
                'rw' => '05',
                'phone' => '+6287890123410',
                'has_bpjs' => true,
                'bpjs_number' => '0007345678901',
                'is_active' => true,
                'toddler' => [
                    'parent_name' => 'Aris Munandar',
                ],
            ],
            // 13. Balita: Mikayla Salsabila
            [
                'nik' => '3507125905230011',
                'name' => 'Mikayla Salsabila',
                'category' => ParticipantCategory::Toddler,
                'birth_date' => '2023-05-19',
                'gender' => Gender::Female,
                'address' => 'Jl. Flamboyan No. 5',
                'rt' => '02',
                'rw' => '02',
                'phone' => '+6289901234511',
                'has_bpjs' => false,
                'bpjs_number' => null,
                'is_active' => true,
                'toddler' => [
                    'parent_name' => 'Yoga Saputra',
                ],
            ],
            // 14. Balita: Gibran Mahendra
            [
                'nik' => '3507121209200012',
                'name' => 'Gibran Mahendra',
                'category' => ParticipantCategory::Toddler,
                'birth_date' => '2020-09-12',
                'gender' => Gender::Male,
                'address' => 'Perum Asri Blok D-2',
                'rt' => '04',
                'rw' => '06',
                'phone' => '+6281234509812',
                'has_bpjs' => true,
                'bpjs_number' => '0008456789012',
                'is_active' => true,
                'toddler' => [
                    'parent_name' => 'Hendra Mahendra',
                ],
            ],
            // 15. Ibu Hamil: Anisa Tri Wahyuni
            [
                'nik' => '3507126207980013',
                'name' => 'Anisa Tri Wahyuni',
                'category' => ParticipantCategory::PregnantMother,
                'birth_date' => '1998-07-22',
                'gender' => Gender::Female,
                'address' => 'Dusun Krajan RT 03 RW 01',
                'rt' => '03',
                'rw' => '01',
                'phone' => '+6282198765413',
                'has_bpjs' => true,
                'bpjs_number' => '0009567890123',
                'is_active' => true,
                'pregnancy' => [
                    'husband_name' => 'Eko Prasetyo',
                    'status' => 'active',
                ],
            ],
            // 16. Ibu Hamil: Rina Marlina
            [
                'nik' => '3507124911950014',
                'name' => 'Rina Marlina',
                'category' => ParticipantCategory::PregnantMother,
                'birth_date' => '1995-11-09',
                'gender' => Gender::Female,
                'address' => 'Jl. Kenanga No. 27',
                'rt' => '02',
                'rw' => '03',
                'phone' => '+6285234567814',
                'has_bpjs' => true,
                'bpjs_number' => '0001678901234',
                'is_active' => true,
                'pregnancy' => [
                    'husband_name' => 'Doni Irawan',
                    'status' => 'active',
                ],
            ],
            // 17. Ibu Hamil: Fitri Handayani
            [
                'nik' => '3507125801000015',
                'name' => 'Fitri Handayani',
                'category' => ParticipantCategory::PregnantMother,
                'birth_date' => '2000-01-18',
                'gender' => Gender::Female,
                'address' => 'Jl. Cempaka RT 01 RW 04',
                'rt' => '01',
                'rw' => '04',
                'phone' => '+6285789012315',
                'has_bpjs' => false,
                'bpjs_number' => null,
                'is_active' => true,
                'pregnancy' => [
                    'husband_name' => 'Lukman Hakim',
                    'status' => 'active',
                ],
            ],
            // 18. Ibu Hamil: Nurul Hidayati
            [
                'nik' => '3507127009940016',
                'name' => 'Nurul Hidayati',
                'category' => ParticipantCategory::PregnantMother,
                'birth_date' => '1994-09-30',
                'gender' => Gender::Female,
                'address' => 'Dusun Tondo RT 02 RW 02',
                'rt' => '02',
                'rw' => '02',
                'phone' => '+6281321098716',
                'has_bpjs' => true,
                'bpjs_number' => '0002789012345',
                'is_active' => true,
                'pregnancy' => [
                    'husband_name' => 'Bambang Sudiro',
                    'status' => 'active',
                ],
            ],
            // 19. Remaja: Dimas Aditya Pratama
            [
                'nik' => '3507121403100017',
                'name' => 'Dimas Aditya Pratama',
                'category' => ParticipantCategory::Teenager,
                'birth_date' => '2010-03-14',
                'gender' => Gender::Male,
                'address' => 'Jl. Melati RT 01 RW 03',
                'rt' => '01',
                'rw' => '03',
                'phone' => '+6289876543217',
                'has_bpjs' => true,
                'bpjs_number' => '0003890123456',
                'is_active' => true,
                'teen' => [
                    'parent_name' => 'Supriyadi',
                ],
            ],
            // 20. Remaja: Farhan Maulana
            [
                'nik' => '3507122108090018',
                'name' => 'Farhan Maulana',
                'category' => ParticipantCategory::Teenager,
                'birth_date' => '2009-08-21',
                'gender' => Gender::Male,
                'address' => 'Jl. Kamboja No. 11',
                'rt' => '03',
                'rw' => '02',
                'phone' => '+6287712345618',
                'has_bpjs' => false,
                'bpjs_number' => null,
                'is_active' => true,
                'teen' => [
                    'parent_name' => 'Mulyadi',
                ],
            ],
            // 21. Remaja: Zahra Aulia
            [
                'nik' => '3507124405120019',
                'name' => 'Zahra Aulia',
                'category' => ParticipantCategory::Teenager,
                'birth_date' => '2012-05-04',
                'gender' => Gender::Female,
                'address' => 'Dusun Krajan RT 04 RW 01',
                'rt' => '04',
                'rw' => '01',
                'phone' => '+6285612345619',
                'has_bpjs' => true,
                'bpjs_number' => '0004901234567',
                'is_active' => true,
                'teen' => [
                    'parent_name' => 'Hasan Bisri',
                ],
            ],
            // 22. Remaja: Rizky Ramadhani
            [
                'nik' => '3507121712100020',
                'name' => 'Rizky Ramadhani',
                'category' => ParticipantCategory::Teenager,
                'birth_date' => '2010-12-17',
                'gender' => Gender::Male,
                'address' => 'Jl. Mawar No. 33',
                'rt' => '02',
                'rw' => '03',
                'phone' => '+6281901234520',
                'has_bpjs' => true,
                'bpjs_number' => '0005012345678',
                'is_active' => true,
                'teen' => [
                    'parent_name' => 'Slamet Riyadi',
                ],
            ],
            // 23. Usia Produktif: Hendra Kusuma
            [
                'nik' => '3507121806920021',
                'name' => 'Hendra Kusuma',
                'category' => ParticipantCategory::Productive,
                'birth_date' => '1992-06-18',
                'gender' => Gender::Male,
                'address' => 'Perum Griya Indah Blok A-10',
                'rt' => '01',
                'rw' => '07',
                'phone' => '+6281234567821',
                'has_bpjs' => true,
                'bpjs_number' => '0006123456789',
                'is_active' => true,
                'adult' => [
                    'employment' => EmploymentStatus::CivilServant,
                    'employment_other' => null,
                    'marital_status' => MaritalStatus::Married,
                ],
            ],
            // 24. Usia Produktif: Maya Safitri
            [
                'nik' => '3507126509950022',
                'name' => 'Maya Safitri',
                'category' => ParticipantCategory::Productive,
                'birth_date' => '1995-09-25',
                'gender' => Gender::Female,
                'address' => 'Jl. Cempaka No. 14',
                'rt' => '02',
                'rw' => '04',
                'phone' => '+6285890123422',
                'has_bpjs' => true,
                'bpjs_number' => '0007234567890',
                'is_active' => true,
                'adult' => [
                    'employment' => EmploymentStatus::Entrepreneur,
                    'employment_other' => null,
                    'marital_status' => MaritalStatus::Married,
                ],
            ],
            // 25. Usia Produktif: Bayu Nugroho
            [
                'nik' => '3507121012850023',
                'name' => 'Bayu Nugroho',
                'category' => ParticipantCategory::Productive,
                'birth_date' => '1985-12-10',
                'gender' => Gender::Male,
                'address' => 'Dusun Krajan RT 02 RW 02',
                'rt' => '02',
                'rw' => '02',
                'phone' => '+6282234567823',
                'has_bpjs' => false,
                'bpjs_number' => null,
                'is_active' => true,
                'adult' => [
                    'employment' => EmploymentStatus::PrivateEmployee,
                    'employment_other' => null,
                    'marital_status' => MaritalStatus::Married,
                ],
            ],
            // 26. Usia Produktif: Lestari Indah
            [
                'nik' => '3507124503900024',
                'name' => 'Lestari Indah',
                'category' => ParticipantCategory::Productive,
                'birth_date' => '1990-03-05',
                'gender' => Gender::Female,
                'address' => 'Jl. Dahlia No. 2',
                'rt' => '03',
                'rw' => '02',
                'phone' => '+6285345678924',
                'has_bpjs' => true,
                'bpjs_number' => '0008345678901',
                'is_active' => true,
                'adult' => [
                    'employment' => EmploymentStatus::Housewife,
                    'employment_other' => null,
                    'marital_status' => MaritalStatus::Married,
                ],
            ],
            // 27. Usia Produktif: Danang Setiawan
            [
                'nik' => '3507122010870025',
                'name' => 'Danang Setiawan',
                'category' => ParticipantCategory::Productive,
                'birth_date' => '1987-10-20',
                'gender' => Gender::Male,
                'address' => 'Jl. Kenanga RT 04 RW 03',
                'rt' => '04',
                'rw' => '03',
                'phone' => '+6281789012325',
                'has_bpjs' => true,
                'bpjs_number' => '0009456789012',
                'is_active' => true,
                'adult' => [
                    'employment' => EmploymentStatus::FarmLaborer,
                    'employment_other' => null,
                    'marital_status' => MaritalStatus::Single,
                ],
            ],
            // 28. Lansia: Suparmi
            [
                'nik' => '3507125708580026',
                'name' => 'Suparmi',
                'category' => ParticipantCategory::Adult,
                'birth_date' => '1958-08-17',
                'gender' => Gender::Female,
                'address' => 'Dusun Tondo RT 03 RW 01',
                'rt' => '03',
                'rw' => '01',
                'phone' => '+6281390123426',
                'has_bpjs' => true,
                'bpjs_number' => '0001567890123',
                'is_active' => true,
                'adult' => [
                    'employment' => EmploymentStatus::Housewife,
                    'employment_other' => null,
                    'marital_status' => MaritalStatus::Widowed,
                ],
            ],
            // 29. Lansia: Mulyono
            [
                'nik' => '3507122204500027',
                'name' => 'Mulyono',
                'category' => ParticipantCategory::Adult,
                'birth_date' => '1950-04-22',
                'gender' => Gender::Male,
                'address' => 'Dusun Krajan RT 01 RW 01',
                'rt' => '01',
                'rw' => '01',
                'phone' => '+6285212345627',
                'has_bpjs' => true,
                'bpjs_number' => '0002678901234',
                'is_active' => true,
                'adult' => [
                    'employment' => EmploymentStatus::Farmer,
                    'employment_other' => null,
                    'marital_status' => MaritalStatus::Married,
                ],
            ],
            // 30. Lansia: Sri Mulyati
            [
                'nik' => '3507125211600028',
                'name' => 'Sri Mulyati',
                'category' => ParticipantCategory::Adult,
                'birth_date' => '1960-11-12',
                'gender' => Gender::Female,
                'address' => 'Jl. Melati RT 02 RW 03',
                'rt' => '02',
                'rw' => '03',
                'phone' => '+6287812345628',
                'has_bpjs' => false,
                'bpjs_number' => null,
                'is_active' => true,
                'adult' => [
                    'employment' => EmploymentStatus::Other,
                    'employment_other' => 'Pensiunan Guru',
                    'marital_status' => MaritalStatus::Married,
                ],
            ],
            // 31. Lansia: Karsiman
            [
                'nik' => '3507121402480029',
                'name' => 'Karsiman',
                'category' => ParticipantCategory::Adult,
                'birth_date' => '1948-02-14',
                'gender' => Gender::Male,
                'address' => 'Dusun Sumber RT 02 RW 05',
                'rt' => '02',
                'rw' => '05',
                'phone' => '+6289654321029',
                'has_bpjs' => true,
                'bpjs_number' => '0003789012345',
                'is_active' => true,
                'adult' => [
                    'employment' => EmploymentStatus::Other,
                    'employment_other' => 'Pensiunan',
                    'marital_status' => MaritalStatus::Widowed,
                ],
            ],
            // 32. Lansia: Sumarni
            [
                'nik' => '3507127006530030',
                'name' => 'Sumarni',
                'category' => ParticipantCategory::Adult,
                'birth_date' => '1953-06-30',
                'gender' => Gender::Female,
                'address' => 'Jl. Anggrek No. 3',
                'rt' => '01',
                'rw' => '02',
                'phone' => '+6281290876530',
                'has_bpjs' => true,
                'bpjs_number' => '0004890123456',
                'is_active' => true,
                'adult' => [
                    'employment' => EmploymentStatus::Housewife,
                    'employment_other' => null,
                    'marital_status' => MaritalStatus::Widowed,
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
