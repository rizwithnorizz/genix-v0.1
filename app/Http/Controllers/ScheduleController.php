<?php

namespace App\Http\Controllers;

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Schedules;
use App\Models\Subject;
use App\Models\Instructor;
use App\Models\CourseSection;
use App\Models\CourseSubject;
use App\Models\DepartmentRoom;
use App\Models\SubjectInstructor;
use Exception;

class ScheduleController extends Controller
{
    
    
    const POPULATION_SIZE = 30;
    const MAX_GENERATIONS = 5;
    const MUTATION_RATE = 0.01;
    const CROSSOVER_RATE = 0.01;
    const ELITE_COUNT = 5;
    
    
    const TIME_SLOTS = [
        1 => '07:00-07:30',
        2 => '07:30-08:00',
        3 => '08:00-08:30',
        4 => '08:30-09:00',
        5 => '09:00-09:30',
        6 => '09:30-10:00',
        7 => '10:00-10:30',
        8 => '10:30-11:00',
        9 => '11:00-11:30',
        10 => '11:30-12:00',
        11 => '12:00-12:30',
        12 => '12:30-13:00',
        13 => '13:00-13:30',
        14 => '13:30-14:00',
        15 => '14:00-14:30',
        16 => '14:30-15:00',
        17 => '15:00-15:30',
        18 => '15:30-16:00',
        19 => '16:00-16:30',
        20 => '16:30-17:00',
        21 => '17:00-17:30',
        22 => '17:30-18:00'
    ];
    
    
    const DAYS = [
        1 => 'Monday',
        2 => 'Tuesday',
        3 => 'Wednesday',
        4 => 'Thursday',
        5 => 'Friday',
        6 => 'Saturday',
    ];
    public function generateScheduleFromFeedback()
    {
        $deepseek = new \App\Libraries\DeepSeekClient();
        
        $userDepartment = auth()->user()->departmentID;
        try {
            
            // Fetch approved feedback from instructor_feedback and course_section_feedback
            $feedback = DB::table('instructor_feedback')
                ->where('departmentID', $userDepartment)
                ->where('status', 1)
                ->select('id', 'instructor_id', 'feedback', 'subjectID')
                ->union(
                    DB::table('course_subject_feedback')
                        ->where('departmentID', $userDepartment)
                        ->where('status', 1)
                        ->select('id', 'sectionID',  'feedback', 'subjectID')
                )
                ->get();
            $currentSchedules = DB::table('schedules')
                ->where('departmentID', $userDepartment)
                ->get()
                ->map(function ($schedule) {
                    return [
                        $schedule->id,
                        $schedule->subjectID,
                        $schedule->time_start,
                        $schedule->time_end,
                        $schedule->day_slot,
                        $schedule->roomID,
                        $schedule->sectionID,
                        $schedule->instructor_id,
                        $schedule->departmentID,
                    ];
                });
            \Log::error("Current schedule: " . json_encode($currentSchedules));
            $availableTimeSlots = [];
            $feedbackJson = json_encode($feedback);
            
            $prompt = <<<PROMPT
            Generate an optimized class schedule in valid JSON format (no markdown, no explanations). Follow the exact structure shown below.

            INPUT DATA:
            1. Feedback: {$feedbackJson}
            2. Current Schedules: {$currentSchedules}
            3. Current Schedules format goes like this: 
                    {
                        "id": number,
                        "scheduleID": number, 
                        "subjectID": number,
                        "time_start": "08:00",
                        "time_end": "09:30",
                        "day_slot": number,
                        "roomID": string,
                        "sectionID": number,
                        "instructor_id": number,
                        "departmentID": 
                    }

            CONSTRAINTS:
            - Only adjust the schedule that match the feedback's scheduleID.
            - Use the feedback to find the corresponding subject in the currentSchedules and adjust ONLY that schedule.
            - Check the time_start, time_end, and day_slot for every section, instructor, and room if there are existing or overlapping slots.
            - Ensure the adjusted schedule adheres to the feedback while avoiding conflicts with existing schedules.

            STEPS:
            - Group the schedules of the sections involved in feedback using the "scheduleID" in currentSchedules.
            - Group the schedules of the rooms involved in feedback using the "roomID" in currentSchedules.
            - Group the schedules of the instructors involved in feedback using the "instructor_id" in currentSchedules.
            - Find available time slots (time start, time end) and day slot that has no conflicts between the entities involved.
            - Ensure that the found available time and day slot conforms to the feedback's request.
            - If there are no available time slots, no adjustments means don't generate response.

            OUTPUT FORMAT:
            {
                "schedule": [
                    {
                        "id": number, // ID from the schedules table
                        "scheduleID": number, // ID from the feedback
                        "subjectID": number,
                        "time_start": "08:00",
                        "time_end": "09:30",
                        "day_slot": number,
                        "roomID": string,
                        "sectionID": number,
                        "instructor_id": number,
                        "departmentID": {$userDepartment} // Do not change this
                    }
                ]
            }
            PROMPT;
            $response = $deepseek->query($prompt)->run();
            $cleanedResponse = preg_replace('/^```json|```$/m', '', trim($response));
            $scheduleArray = json_decode($cleanedResponse, true);
            \Log::error($cleanedResponse);
            if (json_last_error() !== JSON_ERROR_NONE) {
                \Log::error('JSON Decode Error: ' . json_last_error_msg());
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to decode JSON response.',
                    'error' => json_last_error_msg(),
                ], 500);
            }
                
            $scheduleArray = collect($scheduleArray['schedule']);

            $actualSchedule = DB::table('schedules')
                ->where('departmentID', $userDepartment)
                ->get();
                
            $adjustedSchedules = $actualSchedule->map(function ($actualSchedule) use ($scheduleArray) {
                // Find the adjusted schedule in $scheduleArray by matching the 'id'
                $adjustedSchedule = $scheduleArray->firstWhere('id', $actualSchedule->id); // Match by 'id'
                if ($adjustedSchedule) {
                    // Replace values in $actualSchedule with values from $adjustedSchedule
                    $actualSchedule->time_start = $adjustedSchedule['time_start']; // Replace time_start
                    $actualSchedule->time_end = $adjustedSchedule['time_end'];     // Replace time_end
                    $actualSchedule->day_slot = $adjustedSchedule['day_slot'];     // Replace day_slot
                    $actualSchedule->roomID = $adjustedSchedule['roomID'];         // Replace roomID
                    $actualSchedule->sectionID = $adjustedSchedule['sectionID'];   // Replace sectionID
                    $actualSchedule->instructor_id = $adjustedSchedule['instructor_id']; // Replace instructor_id
                }
                return $actualSchedule;
            });
            \LOG::error("Adjusted schedule: " . json_encode($adjustedSchedules));
            $semester = DB::table('course_subjects')
                ->where('subjectID', $scheduleArray[0]['subjectID'])
                ->select('semester')
                ->first();

            DB::table('schedule_repos')->insert([
                'schedule' => json_encode($adjustedSchedules),
                'repo_name' => "Generated Schedule from Feedback " . date('Y-m-d'),
                'departmentID' => $userDepartment,
                'semester' => $semester->semester,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Schedule generated successfully from feedback.',
                'data' => $adjustedSchedules,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate schedule from feedback.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function index()
    {
        try {
            $schedules = DB::table('schedules')->orderBy('day_slot')->orderBy('time_slot')->get();

            return response()->json([
                'success' => true,
                'schedules' => $schedules,
                'total' => $schedules->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch schedules',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function generateSchedule(Request $request)
    {
        try {
            $userDepartment = auth()->user()->departmentID;
            $semester = $request->input('semester');
            $repo_name = $request->input('school_year');
            DB::table('schedules')->where('departmentID', $userDepartment)->delete();
            
            $rooms = DepartmentRoom::where('departmentID', $userDepartment)
                ->join('classrooms', 'department_room.roomID', '=', 'classrooms.id')
                ->select('classrooms.id as roomID', 'classrooms.room_type', 'classrooms.room_number', 'classrooms.capacity')
                ->get();
            

            
            $instructors = DB::table('instructors')->get();
            
            $programs = DB::table('program_offerings')
                ->where('departmentID', $userDepartment)
                ->get();
            
            
            $courseSections = DB::table('course_sections')
                ->whereIn('programID', $programs->pluck('id'))
                ->select('course_sections.id as sectionID', 'course_sections.section_name', 'course_sections.year_level', 'course_sections.curriculumID', 'course_sections.programID', 'course_sections.population')
                ->get();
            
            
            $courseSubjects = DB::table('course_subjects')
                ->whereIn('programID', $programs->pluck('id'))
                ->join('subjects', 'course_subjects.subjectID', '=', 'subjects.id')
                ->where('course_subjects.semester', $semester)
                ->select('course_subjects.*', 'subjects.subject_code' , 'subjects.name as subject_name', 'subjects.lec', 'subjects.lab', 'subjects.prof_subject')
                ->get();
            
            
            $subjectInstructors = DB::table('subject_instructors')
                ->get();
            \Log::error("subject instructors: " . $subjectInstructors);
            
            $population = $this->initializePopulation(
                $courseSubjects, 
                $courseSections, 
                $rooms, 
                $instructors, 
                $subjectInstructors
            );
            
            
            $bestSchedule = $this->evolvePopulation(
                $population, 
                $courseSubjects, 
                $courseSections, 
                $rooms, 
                $instructors, 
                $subjectInstructors
            );
                
            DB::table('schedule_repos')->insert([
                'schedule' => json_encode($bestSchedule),
                'repo_name' => $repo_name . " " . "(created at " . date('Y-m-d') . " )",
                'departmentID' => $userDepartment,
                'semester' => $semester,
            ]);

            return response()->json([
                'success' => true,
                'data' => $bestSchedule,
                'message' => 'Schedule generated successfully',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate schedule: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    private function initializePopulation($courseSubjects, $courseSections, $rooms, $instructors, $subjectInstructors)
    {
        $population = [];
        \Log::info('Initializing Population...');

        for ($i = 0; $i < self::POPULATION_SIZE; $i++) {
            $schedule = [];

            foreach ($courseSections as $section) {
                $sectionSubjects = $courseSubjects->filter(function ($subject) use ($section) {
                    return $subject->programID === $section->programID &&
                        $subject->year_level === $section->year_level &&
                        $subject->curriculumID === $section->curriculumID;
                });

                foreach ($sectionSubjects as $subject) {

                    \Log::error("Processing subject: " . $subject->subject_code);
                    \Log::error("Processing section: " . $section->section_name);
                    $eligibleInstructors = $this->getEligibleInstructors($subject, $instructors, $subjectInstructors);
                    if ($eligibleInstructors->count() === 0){
                        \Log::error("No eligible instructors teaching the subject");
                        break;
                    }
                    $eligibleInstructors = $eligibleInstructors->shuffle();
                    $rooms = $rooms->shuffle();
                    
                    if ($subject->lec == 3 && $subject->lab == 0) {
                        
                        
                        $roomLec = $rooms->filter(function ($room) {
                            return $room->room_type === 'Lecture';
                        });
                        \Log::info('Room Lec: ' . json_encode($roomLec));
                        $daySlot1 = collect(range(1, 4))->shuffle();
                        foreach($daySlot1 as $daySlot1){
                            foreach($roomLec as $room){
                                foreach ($eligibleInstructors as $instructorId){
                                    $availableTimeSlots1 = $this->getAvailableTimeSlots(
                                        $room->roomID,
                                        $daySlot1,
                                        $schedule,
                                        3, 
                                        $instructorId->id,
                                        $section->sectionID
                                    );
                                    if (!empty($availableTimeSlots1)) {
                                        $roomLec1 = $room;
                                        break;
                                    }
                                }
                                if (!empty($availableTimeSlots1)) {
                                    break;
                                }
                            }
                            if (!empty($availableTimeSlots1)) {
                                break;
                            }
                        }
                        \Log::error("Chosen instructor : " . $instructorId->name);
                        $daySlot2 = $daySlot1 + 2;
                        while($daySlot2 < 7){   
                            foreach ($roomLec as $room){
                                    $availableTimeSlots2 = $this->getAvailableTimeSlots(
                                        $room->roomID,
                                        $daySlot2,
                                        $schedule,
                                        3,
                                        $instructorId->id,
                                        $section->sectionID
                                    );
                                    if (!empty($availableTimeSlots2)) {
                                        $roomLec2 = $room;
                                        break;
                                    }
                            }
                            if (!empty($availableTimeSlots2)) {
                                break;
                            }
                            $daySlot2++;
                        }
                        
                        if (empty($availableTimeSlots1)) {
                            $fusedSchedule = $this->findScheduleToFuseWith(
                                $schedule,
                                $section->sectionID,
                                $section->population,
                                $subject->subjectID,
                                $rooms
                            );
                            if (!empty($fusedSchedule)) {
                                $schedule[] = $fusedSchedule;
                            }
                        } else {
                            $timeSlot1 = $availableTimeSlots1[array_rand($availableTimeSlots1)];
                            $schedule[] = [
                                'subjectID' => $subject->subjectID,
                                'subject_code' => $subject->subject_code,
                                'subject_name' => $subject->subject_name,
                                'time_start' => $timeSlot1['time_start'],
                                'time_end' => $timeSlot1['time_end'],
                                'day_slot' => $daySlot1,
                                'roomID' => $roomLec1->roomID,
                                'room_number' => $roomLec1->room_number,
                                'sectionID' => $section->sectionID,
                                'section_name' => $section->section_name,
                                'instructor_id' => $instructorId->id,
                                'instructor_name' => $instructorId->name,
                                'population' => $section->population,
                            ];
                        }
                        
                        if (empty($availableTimeSlots2)){
                            $fusedSchedule = $this->findScheduleToFuseWith(
                                $schedule,
                                $section->sectionID,
                                $section->population,
                                $subject->subjectID,
                                $rooms
                            );
                            if (!empty($fusedSchedule)) {
                                $schedule[] = $fusedSchedule;
                            }
                        } else {
                            $timeSlot2 = $availableTimeSlots2[array_rand($availableTimeSlots2)];
                            $schedule[] = [
                                'subjectID' => $subject->subjectID,
                                'subject_code' => $subject->subject_code,
                                'subject_name' => $subject->subject_name,
                                'time_start' => $timeSlot2['time_start'],
                                'time_end' => $timeSlot2['time_end'],
                                'day_slot' => $daySlot2,
                                'roomID' => $roomLec2->roomID,
                                'room_number' => $roomLec2->room_number,
                                'sectionID' => $section->sectionID,
                                'section_name' => $section->section_name,
                                'instructor_id' => $instructorId->id,
                                'instructor_name' => $instructorId->name,
                                'population' => $section->population,
                            ];
                        }
                    }
                    elseif ($subject->lec > 0 && $subject->lab > 0) {
                        \Log::info("Lecture and Lab subject: " . $subject->subjectID);
                        $roomLab = $rooms->filter(function ($room) {
                            return $room->room_type === 'Laboratory';
                        });
                        $roomLec = $rooms->filter(function ($room) {
                            return $room->room_type !== 'Gym';
                        });
                        $daySlotLec = collect(range(1,6))->shuffle(); 
                        foreach ($daySlotLec as $daySlotLec){
                            foreach ($roomLec as $room){
                                foreach ($eligibleInstructors as $instructorId){
                                    $availableTimeSlotsLec = $this->getAvailableTimeSlots(
                                        $room->roomID,
                                        $daySlotLec,
                                        $schedule,
                                        4, 
                                        $instructorId->id,
                                        $section->sectionID
                                    );
                                    \Log::error("Day slot: $daySlotLec -> 1st day Time slots for room $room->room_number: " . json_encode($availableTimeSlotsLec));
                                    if (!empty($availableTimeSlotsLec)) {
                                        $roomLec = $room;
                                        break;
                                    }
                                }   
                                if (!empty($availableTimeSlotsLec)) {
                                    break;
                                }
                            }
                            
                            if (!empty($availableTimeSlotsLec)) {
                                break;
                            }
                        }

                        if (empty($availableTimeSlotsLec)){
                            $fusedSchedule = $this->findScheduleToFuseWith(
                                $schedule,
                                $section->sectionID,
                                $section->population,
                                $subject->subjectID,
                                $rooms
                            );
                            if (!empty($fusedSchedule)) {
                                $schedule[] = $fusedSchedule;
                            }
                        } else {
                            $timeSlotLec = $availableTimeSlotsLec[array_rand($availableTimeSlotsLec)];
                            $schedule[] = [
                                'subjectID' => $subject->subjectID,
                                'subject_code' => $subject->subject_code,
                                'subject_name' => $subject->subject_name,
                                'time_start' => $timeSlotLec['time_start'],
                                'time_end' => $timeSlotLec['time_end'],
                                'day_slot' => $daySlotLec,
                                'roomID' => $roomLec->roomID,
                                'room_number' => $roomLec->room_number,
                                'sectionID' => $section->sectionID,
                                'section_name' => $section->section_name,
                                'instructor_id' => $instructorId->id,
                                'instructor_name' => $instructorId->name,
                                'population' => $section->population,
                            ];
                        }
                        if ($daySlotLec >= 4){
                            $daySlotLab = 1;
                            $condition = 4;
                        } else {
                            $daySlotLab = $daySlotLec + 2;
                            $condition = 7;
                        }
                        while($daySlotLab < $condition){
                            foreach ($roomLab as $room){
                                $availableTimeSlotsLab = $this->getAvailableTimeSlots(
                                    $room->roomID,
                                    $daySlotLab,
                                    $schedule,
                                    4, 
                                    $instructorId->id,
                                    $section->sectionID
                                );

                                \Log::error("Day slot: $daySlotLab -> 2nd day Time slots for room $room->room_number: " . json_encode($availableTimeSlotsLab));
                                if (!empty($availableTimeSlotsLab)) {
                                    usort($availableTimeSlotsLab, function ($a, $b) {
                                        return $a['time_start'] <=> $b['time_start'];
                                    });
                                    $roomLab = $room;
                                    break;
                                }
                            }
                            if (!empty($availableTimeSlotsLab)) {
                                \Log::error("break3");
                                break;
                            }
                            $daySlotLab++;
                        }
                        
                        if(empty($availableTimeSlotsLab)){
                            $fusedSchedule = $this->findScheduleToFuseWith(
                                $schedule,
                                $section->sectionID,
                                $section->population,
                                $subject->subjectID,
                                $rooms
                            );
                            if (!empty($fusedSchedule)) {
                                $schedule[] = $fusedSchedule;
                            }
                        }else {
                            $timeSlotLab = $availableTimeSlotsLab[array_rand($availableTimeSlotsLab)];
                            $schedule[] = [
                                'subjectID' => $subject->subjectID,
                                'subject_name' => $subject->subject_name,
                                'subject_code' => $subject->subject_code,
                                'time_start' => $timeSlotLab['time_start'],
                                'time_end' => $timeSlotLab['time_end'],
                                'day_slot' => $daySlotLab,
                                'roomID' => $roomLab->roomID,
                                'room_number' => $roomLab->room_number,
                                'sectionID' => $section->sectionID,
                                'section_name' => $section->section_name,
                                'instructor_id' => $instructorId->id,
                                'instructor_name' => $instructorId->name,
                                'population' => $section->population,
                            ];
                        }
                    } else {
                        if ($subject->lec > 0){
                            $daySlotLec = collect(range(1,6))->shuffle();
                            if(stripos($subject->subject_code, "PE") !== false){
                                $roomEligible = $rooms->filter(function ($room) {
                                    return $room->room_type === 'Gym';
                                });
                            } else {
                                $roomEligible = $rooms->filter(function ($room) {
                                    return $room->room_type === 'Lecture';
                                });
                            }
                            foreach($daySlotLec as $daySlotLec){
                                foreach ($roomEligible as $room){
                                    foreach($eligibleInstructors as $instructorId){
                                        $availableTimeSlotsLec = $this->getAvailableTimeSlots(
                                            $room->roomID,
                                            $daySlotLec,
                                            $schedule,
                                            3, // 1.5 hours (3 * 30 minutes)
                                            $instructorId->id,
                                            $section->sectionID
                                        );
                                        \Log::error("Day Slot: $daySlotLec Time slots for room $room->room_number: " . json_encode($availableTimeSlotsLec));
                                        if (!empty($availableTimeSlotsLec)) {
                                            $roomLec = $room;
                                            break;
                                        }
                                    }
                                    if (!empty($availableTimeSlotsLec)) {
                                        break;
                                    }
                                }
                                
                                if (!empty($availableTimeSlotsLec)) {
                                    break;
                                }
                            }
                            $timeSlot = $availableTimeSlotsLec[array_rand($availableTimeSlotsLec)];
                            $schedule[] = [
                                'subjectID' => $subject->subjectID,
                                'subject_code' => $subject->subject_code,
                                'subject_name' => $subject->subject_name,
                                'time_start' => $timeSlot['time_start'],
                                'time_end' => $timeSlot['time_end'],
                                'day_slot' => $daySlotLec,
                                'roomID' => $roomLec->roomID,
                                'room_number' => $roomLec->room_number,
                                'sectionID' => $section->sectionID,
                                'section_name' => $section->section_name,
                                'instructor_id' => $instructorId->id,
                                'instructor_name' => $instructorId->name,
                                'population' => $section->population,
                            ];
                        }
                        if($subject->lab > 0){
                            $daySlotLab = collect(range(1,6))->shuffle();
                            $roomEligible = $rooms->filter(function ($room) {
                                return $room->room_type === 'Laboratory';
                            });
                            foreach($daySlotLab as $daySlotLab){
                                foreach($roomEligible as $room){
                                    foreach($eligibleInstructors as $instructor){
                                        $instructorId = $eligibleInstructors->random();
                                        $availableTimeSlotsLab = $this->getAvailableTimeSlots(
                                            $room->roomID,
                                            $daySlotLab,
                                            $schedule,
                                            3, // 1.5 hours (3 * 30 minutes)
                                            $instructorId->id,
                                            $section->sectionID
                                        );
                                        \Log::error("Day Slot: $daySlotLab Time slots for room $room->room_number: " . json_encode($availableTimeSlotsLab));
                                        if (!empty($availableTimeSlotsLab)) {
                                            $roomLab = $room;
                                            break;
                                        }
                                    }
                                    if (!empty($availableTimeSlotsLab)) {
                                        break;
                                    }
                                }
                                if (!empty($availableTimeSlotsLab)) {
                                    break;
                                }
                            }
                            $timeSlot = $availableTimeSlotsLab[array_rand($availableTimeSlotsLab)];
                            $schedule[] = [
                                'subjectID' => $subject->subjectID,
                                'subject_code' => $subject->subject_code,
                                'subject_name' => $subject->subject_name,
                                'time_start' => $timeSlot['time_start'],
                                'time_end' => $timeSlot['time_end'],
                                'day_slot' => $daySlotLab,
                                'roomID' => $roomLab->roomID,
                                'room_number' => $roomLab->room_number,
                                'sectionID' => $section->sectionID,
                                'section_name' => $section->section_name,
                                'instructor_id' => $instructorId->id,
                                'instructor_name' => $instructorId->name,
                                'population' => $section->population,
                            ];
                        }
                    } 
                }
            }
            usort($schedule, function ($a, $b) {
                return $a['day_slot'] <=> $b['day_slot'] ?: $a['time_start'] <=> $b['time_start'];
            });
            $population[] = $schedule;
        }

        return $population;
    }
    
    private function findScheduleToFuseWith(
        array $currentSchedule,
        int $sectionId,
        int $sectionPopulation,
        int $subjectId,
        $rooms
    ): ?array {
        \Log::error("Fusing invoked ");
        foreach ($currentSchedule as $item) {
            $room = $rooms->firstWhere('roomID', $item['roomID']);
            \Log::error("Fusing room : $room");
            if (
                $item['sectionID'] !== $sectionId &&
                $item['subjectID'] === $subjectId &&
                $item['population'] + $sectionPopulation <= $room->capacity
            ) {
                \Log::error("Found fusable");
                $item['population'] += $sectionPopulation;
                return [
                    'subjectID' => $subjectId,
                    'subject_code' => $item['subject_code'],
                    'subject_name' => $item['subject_name'],
                    'time_start' => $item['time_start'],
                    'time_end' => $item['time_end'],
                    'day_slot' => $item['day_slot'],
                    'roomID' => $item['roomID'],
                    'room_number' => $item['room_number'],
                    'sectionID' => $sectionId,
                    'section_name' => $item['section_name'],
                    'instructor_id' => $item['instructor_id'],
                    'instructor_name' => $item['instructor_name'],
                    'population' => $item['population'],
                ];
            }
        }
        return null; // No suitable schedule found
    }
    private function evolvePopulation($population, $courseSubjects, $courseSections, $rooms, $instructors, $subjectInstructors)
    {
        $bestFitness = -INF;
        $bestSchedule = null;
        for ($generation = 0; $generation < self::MAX_GENERATIONS; $generation++) {
            \Log::info('Generation: ' . $generation);
            $fitnessScores = [];
            foreach ($population as $index => $schedule) {
                $fitnessScores[$index] = $this->calculateFitness($schedule, $courseSubjects, $courseSections, $rooms, $instructors);
                if ($fitnessScores[$index] > $bestFitness) {
                    $bestFitness = $fitnessScores[$index];
                    $bestSchedule = $schedule;
                    \Log::info('New Best Schedule Found: ' . json_encode($bestSchedule));
                }
            }
            \Log::info('Best Fitness: ' . $bestFitness);
            
            
            $newPopulation = [];
            
            
            arsort($fitnessScores);
            $eliteIndices = array_keys(array_slice($fitnessScores, 0, self::ELITE_COUNT, true));
            foreach ($eliteIndices as $eliteIndex) {
                $newPopulation[] = $population[$eliteIndex];
            }
            \Log::info('Elite Population Size: ' . count($newPopulation));
            
            while (count($newPopulation) < self::POPULATION_SIZE) {
                \Log::info('Current Population Size: ' . count($newPopulation));
            
                $parent1Index = $this->selectParent($fitnessScores);
                $parent2Index = $this->selectParent($fitnessScores);
            
                \Log::info("Selected Parent 1 Index: $parent1Index");
                \Log::info("Selected Parent 2 Index: $parent2Index");
            
                if (mt_rand() / mt_getrandmax() < self::CROSSOVER_RATE) {
                    $child = $this->crossover($population[$parent1Index], $population[$parent2Index]);
                    \Log::info('Crossover Child: ' . json_encode($child));
                } else {
                    $child = $population[$parent1Index];
                    \Log::info('Child from Parent 1: ' . json_encode($child));
                }
                $child = $this->mutate($child, $courseSubjects, $courseSections, $rooms, $instructors, $subjectInstructors);
                \Log::info('Mutated Child: ' . json_encode($child));
            
                if (!empty($child)) {
                    $newPopulation[] = $child;
                    \Log::info('Child added to newPopulation. Current size: ' . count($newPopulation));
                } else {
                    \Log::warning('Failed to generate a valid child.');
                    throw new Exception('Failed to generate a valid child.');
                }
            }
            \Log::info('New Population Size: ' . count($newPopulation));    
            $population = $newPopulation;
        }
        
        return $bestSchedule;
        
    }
    
    private function selectParent($fitnessScores)
    {
        $tournamentSize = 5; // Increased from 3 to 5
        $indices = array_keys($fitnessScores);
        $best = null;
        $bestFitness = -INF;

        for ($i = 0; $i < $tournamentSize; $i++) {
            $randomIndex = $indices[array_rand($indices)];
            if ($fitnessScores[$randomIndex] > $bestFitness) {
                $best = $randomIndex;
                $bestFitness = $fitnessScores[$randomIndex];
            }
        }

        return $best;
    }
    
    private function crossover($parent1, $parent2)
    {
        
        $parent1BySections = [];
        $parent2BySections = [];
        
        foreach ($parent1 as $item) {
            $section = $item['sectionID'];
            if (!isset($parent1BySections[$section])) {
                $parent1BySections[$section] = [];
            }
            $parent1BySections[$section][] = $item;
        }
        
        foreach ($parent2 as $item) {
            $section = $item['sectionID'];
            if (!isset($parent2BySections[$section])) {
                $parent2BySections[$section] = [];
            }
            $parent2BySections[$section][] = $item;
        }
        
        
        $child = [];
        $allSections = array_unique(array_merge(array_keys($parent1BySections), array_keys($parent2BySections)));
        
        foreach ($allSections as $section) {
            
            if (!isset($parent1BySections[$section])) {
                $child = array_merge($child, $parent2BySections[$section]);
            } else if (!isset($parent2BySections[$section])) {
                $child = array_merge($child, $parent1BySections[$section]);
            } else {
                
                $inheritFrom = (mt_rand(0, 1) == 0) ? $parent1BySections[$section] : $parent2BySections[$section];
                $child = array_merge($child, $inheritFrom);
            }
        }
        
        return $child;
    }
    
    private function mutate($schedule, $courseSubjects, $courseSections, $rooms, $instructors, $subjectInstructors)
    {
        $scheduleBySubject = [];
        foreach ($schedule as $index => $item) {
            $key = $item['subjectID'] . '-' . $item['sectionID'];
            if (!isset($scheduleBySubject[$key])) {
                $scheduleBySubject[$key] = [];
            }
            $scheduleBySubject[$key][] = $index;
        }

        foreach ($scheduleBySubject as $key => $indices) {
            if (mt_rand() / mt_getrandmax() < self::MUTATION_RATE) {
                list($subjectCode, $sectionId) = explode('-', $key);
        
                $subject = $courseSubjects->firstWhere('subjectID', $subjectCode);
                if (!$subject) continue;
        
                $mutationType = rand(1, 3);
                $currentItem = $schedule[$indices[0]];
        
                switch ($mutationType) {
                    case 1: // Room mutation
                        \Log::info("Mutating room for subject: $subjectCode");
                        $eligibleRooms = $this->getEligibleRooms($subject, $rooms);
                        if ($eligibleRooms->isEmpty()) break;

                        $newRoom = $eligibleRooms->random();
                        $currentInstructor = $currentItem['instructor_id'];
                        $currentSection = $currentItem['sectionID'];

                        foreach ($indices as $idx) {
                            $timeStart = $schedule[$idx]['time_start'];
                            $timeEnd = $schedule[$idx]['time_end'];
                            $daySlot = $schedule[$idx]['day_slot'];
                            $length = (strtotime($timeEnd) - strtotime($timeStart)) / 1800;

                            $availableSlots = $this->getAvailableTimeSlots(
                                $newRoom->roomID,
                                $daySlot,
                                $schedule,
                                $length,
                                $currentInstructor,
                                $currentSection
                            );

                            if (empty($availableSlots)) {
                                \Log::warning("No slots in room: {$newRoom->roomID}");
                                continue 3;
                            }

                            $newSlot = $availableSlots[array_rand($availableSlots)];
                            $schedule[$idx]['roomID'] = $newRoom->roomID;
                            $schedule[$idx]['room_number'] = $newRoom->room_number;
                            $schedule[$idx]['time_start'] = $newSlot['time_start'];
                            $schedule[$idx]['time_end'] = $newSlot['time_end'];
                        }
                        break;

                    case 2: // Instructor mutation
                        \Log::info("Mutating instructor for subject: $subjectCode");
                        $eligibleInstructors = $this->getEligibleInstructors($subject, $instructors, $subjectInstructors);
                        if ($eligibleInstructors->isEmpty()) break;

                        $newInstructor = $eligibleInstructors->random();
                        $currentRoom = $currentItem['roomID'];
                        $currentDay = $currentItem['day_slot'];
                        $timeStart = $currentItem['time_start'];
                        $timeEnd = $currentItem['time_end'];
                        $length = (strtotime($timeEnd) - strtotime($timeStart)) / 1800;

                        // Verify instructor availability
                        $availableSlots = $this->getAvailableTimeSlots(
                            $currentRoom,
                            $currentDay,
                            $schedule,
                            $length,
                            $newInstructor->id,
                            $currentItem['sectionID']
                        );

                        if (!empty($availableSlots)) {
                            foreach ($indices as $idx) {
                                $schedule[$idx]['instructor_id'] = $newInstructor->id;
                            }
                        }
                        break;

                    case 3: // Time/day mutation
                        \Log::info("Mutating time/day for subject: $subjectCode");
                        $newDay = rand(1, 5);
                        $currentRoom = $currentItem['roomID'];
                        $currentInstructor = $currentItem['instructor_id'];
                        $timeStart = strtotime($currentItem['time_start']);
                        $timeEnd = strtotime($currentItem['time_end']);
                        $length = ($timeEnd - $timeStart) / 1800;

                        $availableSlots = $this->getAvailableTimeSlots(
                            $currentRoom,
                            $newDay,
                            $schedule,
                            $length,
                            $currentInstructor,
                            $currentItem['sectionID']
                        );

                        if (!empty($availableSlots)) {
                            $newSlot = $availableSlots[array_rand($availableSlots)];
                            foreach ($indices as $idx) {
                                $schedule[$idx]['day_slot'] = $newDay;
                                $schedule[$idx]['time_start'] = $newSlot['time_start'];
                                $schedule[$idx]['time_end'] = $newSlot['time_end'];
                            }
                        }
                        break;
                }
            }
        }

        return array_values($schedule);
    }
    
    private function calculateFitness($schedule, $courseSubjects, $courseSections, $rooms, $instructors)
    {
        $score = 0;
        $baseScore = count($schedule); // Base score based on number of scheduled items
        \Log::info('Base Score: ' . $baseScore);
        // Calculate penalties
        $instructorConflicts = $this->countInstructorConflicts($schedule);
        \Log::info('Instructor Conflicts: ' . $instructorConflicts);
        $instructorConsecutiveHours = $this->checkInstructorConsecutiveHours($schedule);
        \Log::info('Instructor Consecutive Hours: ' . $instructorConsecutiveHours);
        $distributionScore = $this->calculateDistributionScore($schedule);

        \Log::info('Distribution Score: ' . $distributionScore);
    
    
        // Apply penalties (each conflict drastically reduces the score)
        $score = $baseScore + $distributionScore;
        $score -= ($instructorConflicts * 0.2); // -100 per instructor conflict
        $score -= ($instructorConsecutiveHours * 0.2); // -50 per consecutive hour violation
        
        return max(0, $score); // Ensure score doesn't go negative
    }
    
   

    private function countInstructorConflicts($schedule)
    {
        $conflicts = 0;
        $instructorUsage = [];
        foreach ($schedule as $item) {
            $key = $item['instructor_id'] . '-' . $item['time_start'] . '-' . $item['time_end']. '-' . $item['day_slot'];
            if (isset($instructorUsage[$key])) {
                $conflicts++;
            }
            $instructorUsage[$key] = true;
        }
        return $conflicts;
    }
    
    
    private function checkInstructorConsecutiveHours($schedule)
    {
        $violations = 0;
        $instructorSchedule = [];

        
        foreach ($schedule as $item) {
            $key = $item['instructor_id'] . '-' . $item['day_slot'];
            if (!isset($instructorSchedule[$key])) {
                $instructorSchedule[$key] = [];
            }
            $instructorSchedule[$key][] = [
                'time_start' => strtotime($item['time_start']),
                'time_end' => strtotime($item['time_end']),
            ];
        }

        
        foreach ($instructorSchedule as $timeSlots) {
            
            usort($timeSlots, function ($a, $b) {
                return $a['time_start'] <=> $b['time_start'];
            });

            $consecutiveHours = 0;

            for ($i = 0; $i < count($timeSlots); $i++) {
                if ($i > 0) {
                    $previousEnd = $timeSlots[$i - 1]['time_end'];
                    $currentStart = $timeSlots[$i]['time_start'];

                    
                    if ($currentStart === $previousEnd) {
                        $consecutiveHours++;
                    } else {
                        $consecutiveHours = 1; 
                    }
                } else {
                    $consecutiveHours = 1; 
                }

                
                if ($consecutiveHours > 3) {
                    $violations++;
                    break; 
                }
            }
        }

        return $violations;
    }
    
    private function calculateDistributionScore($schedule)
    {
        $distributionScore = 0;

        
        $dayDistribution = array_fill(1, 6, 0); 
        $timeDistribution = [];

        
        $workingHoursStart = strtotime('07:00');
        $workingHoursEnd = strtotime('18:00');

        
        for ($time = $workingHoursStart; $time < $workingHoursEnd; $time += 1800) {
            $timeDistribution[date('H:i', $time)] = 0;
        }

        
        foreach ($schedule as $item) {
            
            $dayDistribution[$item['day_slot']]++;

            $timeStart = strtotime($item['time_start']);
            $timeEnd = strtotime($item['time_end']);

            
            for ($time = $timeStart; $time < $timeEnd; $time += 1800) {
                $timeKey = date('H:i', $time);
                if (isset($timeDistribution[$timeKey])) {
                    $timeDistribution[$timeKey]++;
                }
            }
        }

        
        $dayStdDev = $this->calculateStandardDeviation($dayDistribution);
        $timeStdDev = $this->calculateStandardDeviation(array_values($timeDistribution));

        
        $distributionScore = 10 - ($dayStdDev + $timeStdDev);

        return $distributionScore;
    }
    
    private function calculateStandardDeviation($array)
    {
        $count = count($array);
        
        if ($count <= 1) {
            return 0;
        }
        
        $mean = array_sum($array) / $count;
        $variance = 0;
        
        foreach ($array as $value) {
            $variance += pow(($value - $mean), 2);
        }
        
        return sqrt($variance / $count);
    }
    
    private function getEligibleInstructors($subject, $instructors, $subjectInstructors)
    {
        $eligibleIds = $subjectInstructors
            ->where('subject_code', $subject->subjectID)
            ->pluck('instructor_id')
            ->toArray();
        
        return $instructors->filter(function ($instructor) use ($eligibleIds) {
            return in_array($instructor->id, $eligibleIds);
        });
    }
    
    private function getEligibleRooms($subject, $rooms)
    {
        return $rooms->filter(function ($room) use ($subject) {
            if ($subject->lec > 0 && $subject->lab > 0) {
                
                return true;
            } elseif ($subject->lec > 0) {
                
                return $room->room_type === 'Lecture';
            } elseif ($subject->lab > 0) {
                
                return $room->room_type === 'Laboratory';
            }
            return false; 
        });
    }
    
    private function getAvailableTimeSlots(
        int $roomId,
        int $daySlot,
        array $currentSchedule,
        int $durationUnits, // Number of 30-minute units
        ?int $instructorId = null,
        ?int $sectionId = null
    ): array {
        $timeSlots = [];
        $durationSeconds = $durationUnits * 1800; // Convert to seconds
    
        // Generate all possible time slots within working hours
        $startTime = strtotime('07:00');
        $endTime = strtotime('18:00') - $durationSeconds;
    
        for ($slotStart = $startTime; $slotStart <= $endTime; $slotStart += 1800*$durationUnits) {
            $slotEnd = $slotStart + $durationSeconds;
    
            // Skip time slots overlapping with lunch break (12:00 PM to 1:00 PM)
            if ($slotStart < strtotime('13:00') && $slotEnd > strtotime('12:00')) {
                continue;
            }
    
            $timeSlots[] = [
                'time_start' => date('H:i', $slotStart),
                'time_end' => date('H:i', $slotEnd),
            ];
        }
    
        // Filter out conflicting slots
        return array_filter($timeSlots, function ($slot) use (
            $roomId,
            $daySlot,
            $currentSchedule,
            $instructorId,
            $sectionId
        ) {
            return $this->isSlotAvailable(
                $slot,
                $roomId,
                $daySlot,
                $currentSchedule,
                $instructorId,
                $sectionId
            );
        });
    }
    
    private function isSlotAvailable(
        array $slot,
        int $roomId,
        int $daySlot,
        array $currentSchedule,
        ?int $instructorId,
        ?int $sectionId
    ): bool {
        $slotStart = strtotime($slot['time_start']);
        $slotEnd = strtotime($slot['time_end']);
        \Log::error("Day slot checking: " . $daySlot);
        // Check current schedule conflicts
        foreach ($currentSchedule as $item) {
            $itemStart = strtotime($item['time_start']);
            $itemEnd = strtotime($item['time_end']);
            
            // Check section conflict
            if ($sectionId !== null &&
                $item['sectionID'] === $sectionId &&
                $item['day_slot'] === $daySlot &&
                $slotStart < $itemEnd &&
                $slotEnd > $itemStart
            ) {
                \Log::info("Section conflict: Section {$sectionId} is unavailable for day slot {$daySlot} and time slot {$slot['time_start']} - {$slot['time_end']}");
                return false;
            }
            
            // Check room conflict
            if ($roomId !== null &&
                $item['roomID'] === $roomId &&
                $item['day_slot'] === $daySlot &&
                $slotStart < $itemEnd &&
                $slotEnd > $itemStart
            ) {
                \Log::info("Room conflict: Room {$roomId} is unavailable for day slot {$daySlot} and time slot {$slot['time_start']} - {$slot['time_end']}");
                return false;
            }
    
            // Check instructor conflict
            if ($instructorId !== null &&
                $item['instructor_id'] === $instructorId &&
                $item['day_slot'] === $daySlot &&
                $slotStart < $itemEnd &&
                $slotEnd > $itemStart
            ) {
                \Log::info("Instructor conflict: Instructor {$instructorId} is unavailable for day slot {$daySlot} and time slot {$slot['time_start']} - {$slot['time_end']}");
                return false;
            }
    
        }
    
        // Check database conflicts using optimized queries
        return $this->checkDatabaseAvailability(
            $roomId,
            $daySlot,
            $slot['time_start'],
            $slot['time_end'],
            $instructorId,
            $sectionId
        );
    }
    
    private function checkDatabaseAvailability(
        string $roomId,
        int $daySlot,
        string $startTime,
        string $endTime,
        ?int $instructorId,
        ?int $sectionId,
    ): bool {
        $timeFormat = 'H:i:s';
        
        $roomConflict = DB::table('schedules')
            ->where('roomID', $roomId)
            ->where('day_slot', $daySlot)
            ->where(function ($query) use ($startTime, $endTime, $timeFormat) {
                $query->whereRaw('? < time_end', [date($timeFormat, strtotime($startTime))])
                      ->whereRaw('? > time_start', [date($timeFormat, strtotime($endTime))]);
            })->exists();
    
        if ($roomConflict) return false;
    
        if ($instructorId !== null) {
            $instructorConflict = DB::table('schedules')
                ->where('instructor_id', $instructorId)
                ->where('day_slot', $daySlot)
                ->where(function ($query) use ($startTime, $endTime, $timeFormat) {
                    $query->whereRaw('? < time_end', [date($timeFormat, strtotime($startTime))])
                          ->whereRaw('? > time_start', [date($timeFormat, strtotime($endTime))]);
                })->exists();
    
            if ($instructorConflict) return false;
        }
    
        if ($sectionId !== null) {
            $sectionConflict = DB::table('schedules')
                ->where('sectionID', $sectionId)
                ->where('day_slot', $daySlot)
                ->where(function ($query) use ($startTime, $endTime, $timeFormat) {
                    $query->whereRaw('? < time_end', [date($timeFormat, strtotime($startTime))])
                          ->whereRaw('? > time_start', [date($timeFormat, strtotime($endTime))]);
                })->exists();
    
            if ($sectionConflict) return false;
        }
    
        return true;
    }

    private function saveSchedule($schedule, $departmentShortName)
    {
        
        Schedules::where('department_short_name', $departmentShortName)->delete();
        
        
        foreach ($schedule as $item) {
            Schedules::create([
                'subject_code' => $item['subject_code'],
                'time_slot' => $item['time_slot'],
                'day_slot' => $item['day_slot'],
                'roomID' => $item['roomID'],
                'sectionID' => $item['sectionID'],
                'instructor_id' => $item['instructor_id'],
                'department_short_name' => $departmentShortName,
            ]);
        }
    }
    
    
    public function getSchedule()
    {
        $userDepartment = auth()->user()->department_short_name;

        $schedules = Schedules::where('department_short_name', $userDepartment)
            ->join('subjects', 'schedules.subject_code', '=', 'subjects.subject_code')
            ->join('instructors', 'schedules.instructor_id', '=', 'instructors.id')
            ->select(
                'schedules.*',
                'subjects.name as subject_name',
                'instructors.name as instructor_name'
            )
            ->get();

        $formattedSchedule = [];

        foreach ($schedules as $schedule) {
            $formattedSchedule[] = [
                'subject_code' => $schedule->subject_code,
                'subject_name' => $schedule->subject_name,
                'time_start' => $schedule->time_start,
                'time_end' => $schedule->time_end,
                'day_slot' => self::DAYS[$schedule->day_slot],
                'roomID' => $schedule->roomID,
                'sectionID' => $schedule->sectionID,
                'instructor' => $schedule->instructor_name,
                'department' => $schedule->department_short_name,
            ];
        }

        return response()->json([
            'success' => true,
            'schedule' => $formattedSchedule,
        ]);
    }

    private function isTimeSlotAvailable($roomID, $daySlot, $timeStart, $timeEnd, $schedule)
    {
        foreach ($schedule as $item) {
            if (
                $item['roomID'] === $roomID &&
                $item['day_slot'] === $daySlot &&
                (
                    (strtotime($timeStart) < strtotime($item['time_end'])) &&
                    (strtotime($timeEnd) > strtotime($item['time_start']))
                )
            ) {
                return false; // Overlapping
            }
        }
        return true;
    }
    
}
