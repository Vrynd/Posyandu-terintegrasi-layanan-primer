<?php

namespace App\Http\Controllers\Participants;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('participants/Index');
    }
}
