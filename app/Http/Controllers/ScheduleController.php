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
    
    
    const POPULATION_SIZE = 20;
    const MAX_GENERATIONS = 5;
    const MUTATION_RATE = 0.1;
    const CROSSOVER_RATE = 0.1;
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
            $userDepartment = auth()->user()->department_short_name;
            $semester = $request->input('semester');
            $repo_name = $request->input('school_year');
            DB::table('schedules')->where('department_short_name', $userDepartment)->delete();
            
            $rooms = DepartmentRoom::where('department_short_name', $userDepartment)
                ->join('classrooms', 'department_room.room_number', '=', 'classrooms.room_number')
                ->select('department_room.room_number', 'classrooms.room_type')
                ->get();
            \Log::error('Rooms: ' . json_encode($rooms));

            
            $instructors = Instructor::where('department_short_name', $userDepartment)->get();
            
            
            $programs = DB::table('program_offerings')
                ->where('department_short_name', $userDepartment)
                ->get();
            \Log::error('Programs: ' . json_encode($programs));
            
            $courseSections = DB::table('course_sections')
                ->whereIn('program_short_name', $programs->pluck('program_short_name'))
                ->get();
            \Log::error('Course Sections: ' . json_encode($courseSections));
            
            $courseSubjects = DB::table('course_subjects')
                ->whereIn('program_short_name', $programs->pluck('program_short_name'))
                ->join('subjects', 'course_subjects.subject_code', '=', 'subjects.subject_code')
                ->where('course_subjects.semester', $semester)
                ->select('course_subjects.*', 'subjects.name as subject_name', 'subjects.room_req', 'subjects.lec', 'subjects.lab', 'subjects.prof_subject')
                ->get();
            \Log::error('Course Subjects: ' . json_encode($courseSubjects));
            
            $subjectInstructors = DB::table('subject_instructors')
                ->join('subjects', 'subject_instructors.subject_code', '=', 'subjects.id')
                ->select('subject_instructors.instructor_id', 'subjects.subject_code')
                ->get();
            \Log::error('Subject Instructors: ' . json_encode($subjectInstructors));
            
            $population = $this->initializePopulation(
                $courseSubjects, 
                $courseSections, 
                $rooms, 
                $instructors, 
                $subjectInstructors
            );
            \Log::error('Initial Population: ' . json_encode($population));
            
            $bestSchedule = $this->evolvePopulation(
                $population, 
                $courseSubjects, 
                $courseSections, 
                $rooms, 
                $instructors, 
                $subjectInstructors
            );
            \Log::error('Best Schedule: ' . json_encode($bestSchedule));
            DB::table('schedule_repos')->insert([
                'schedule' => json_encode($bestSchedule),
                'repo_name' => $repo_name . date('Y-m-d'),
                'department_short_name' => $userDepartment,
                'semester' => $semester,
            ]);
            DB::table('schedules')->where('department_short_name', $userDepartment)->delete();
            
            foreach ($bestSchedule as $item) {  
                try {
                    DB::table('schedules')->insert([
                        'subject_code' => $item['subject_code'],
                        'section_name' => $item['section_name'],
                        'room_number' => $item['room_number'],
                        'instructor_id' => $item['instructor_id'],
                        'day_slot' => $item['day_slot'], 
                        'time_start' => $item['time_start'],
                        'time_end' => $item['time_end'],
                        'department_short_name' => $userDepartment,
                        'semester' => $semester,
                    ]);
                    \Log::info('Inserted Schedule: ' . json_encode($item));
                } catch (\Exception $e) {
                    \Log::error('Failed to insert schedule: ' . $e->getMessage());
                }
            }
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
        \Log::info('Course Subjects: ' . json_encode($courseSubjects));
        \Log::info('Course Sections: ' . json_encode($courseSections));
        \Log::info('Rooms: ' . json_encode($rooms));
        \Log::info('Instructors: ' . json_encode($instructors));
        \Log::info('Subject Instructors: ' . json_encode($subjectInstructors));

        for ($i = 0; $i < self::POPULATION_SIZE; $i++) {
            $schedule = [];

            foreach ($courseSections as $section) {
                \Log::info('Processing Section: ' . json_encode($section));
                $sectionSubjects = $courseSubjects->filter(function ($subject) use ($section) {
                    return $subject->program_short_name === $section->program_short_name &&
                        $subject->year_level === $section->year_level &&
                        $subject->curriculum_name === $section->curriculum_name;
                });
                \Log::info('Section Subjects: ' . json_encode($sectionSubjects));

                foreach ($sectionSubjects as $subject) {
                    \Log::info('Processing Subject: ' . json_encode($subject));

                    
                    $eligibleInstructors = $this->getEligibleInstructors($subject, $instructors, $subjectInstructors);
                    \Log::info('Eligible Instructors: ' . json_encode($eligibleInstructors));

                    if ($eligibleInstructors->isEmpty()) {
                        \Log::warning('No eligible instructors for subject: ' . $subject->subject_code);
                        continue;
                    }

                    
                    $eligibleRooms = $this->getEligibleRooms($subject, $rooms);
                    \Log::info('Eligible Rooms: ' . json_encode($eligibleRooms));

                    if ($eligibleRooms->isEmpty()) {
                        \Log::warning('No eligible rooms for subject: ' . $subject->subject_code);
                        continue;
                    }

                    $instructorId = $eligibleInstructors->random()->id;

                    if ($subject->lec == 3 && $subject->lab == 0) {
                        \Log::error("Lecture only subject: " . $subject->subject_code);
                        
                        $daySlot1 = rand(1, 4); 
                        $daySlot2 = $daySlot1 + 1; 

                        $availableTimeSlots1 = $this->getAvailableTimeSlots($eligibleRooms->first()->room_number, $daySlot1, $schedule, 3);
                        $availableTimeSlots2 = $this->getAvailableTimeSlots($eligibleRooms->first()->room_number, $daySlot2, $schedule, 3);

                        if (empty($availableTimeSlots1) || empty($availableTimeSlots2)) {
                            \Log::warning('No available time slots for subject: ' . $subject->subject_code);
                            continue;
                        }

                        $timeSlot1 = $availableTimeSlots1[array_rand($availableTimeSlots1)];
                        $timeSlot2 = $availableTimeSlots2[array_rand($availableTimeSlots2)];

                        $roomLec = $eligibleRooms->filter(function ($room) {
                            return $room->room_type === 'Lecture';
                        })->random()->room_number;

                        
                        $schedule[] = [
                            'subject_code' => $subject->subject_code,
                            'subject_name' => $subject->subject_name,
                            'time_start' => $timeSlot1['time_start'],
                            'time_end' => $timeSlot1['time_end'],
                            'day_slot' => $daySlot1,
                            'room_number' => $roomLec,
                            'section_name' => $section->section_name,
                            'instructor_id' => $instructorId,
                        ];

                        
                        $schedule[] = [
                            'subject_code' => $subject->subject_code,
                            'subject_name' => $subject->subject_name,
                            'time_start' => $timeSlot2['time_start'],
                            'time_end' => $timeSlot2['time_end'],
                            'day_slot' => $daySlot2,
                            'room_number' => $roomLec,
                            'section_name' => $section->section_name,
                            'instructor_id' => $instructorId,
                        ];
                    } elseif ($subject->lec > 0 && $subject->lab > 0) {
                        \Log::info("Lecture and Lab subject: " . $subject->subject_code);

                        
                        $daySlotLec = rand(1, 3); 
                        $daySlotLab = rand($daySlotLec + 1, 5); 

                        
                        $availableTimeSlotsLec = $this->getAvailableTimeSlots($eligibleRooms->first()->room_number, $daySlotLec, $schedule, 3);

                        if (empty($availableTimeSlotsLec)) {
                            \Log::warning('No available time slots for lecture: ' . $subject->subject_code);
                            continue;
                        }

                        
                        $timeSlotLec = $availableTimeSlotsLec[array_rand($availableTimeSlotsLec)];

                        
                        $timeSlotLab = [
                            'time_start' => $timeSlotLec['time_start'],
                            'time_end' => date('H:i', strtotime($timeSlotLec['time_start']) + (3 * 3600)), 
                        ];

                        $roomLec = $eligibleRooms->filter(function ($room) {
                            return $room->room_type === 'Lecture';
                        })->random()->room_number;

                        $roomLab = $eligibleRooms->filter(function ($room) {
                            return $room->room_type === 'Laboratory';
                        })->random()->room_number;

                        
                        $schedule[] = [
                            'subject_code' => $subject->subject_code,
                            'subject_name' => $subject->subject_name,
                            'time_start' => $timeSlotLec['time_start'],
                            'time_end' => $timeSlotLec['time_end'],
                            'day_slot' => $daySlotLec,
                            'room_number' => $roomLec,
                            'section_name' => $section->section_name,
                            'instructor_id' => $instructorId,
                        ];

                        
                        $schedule[] = [
                            'subject_code' => $subject->subject_code,
                            'subject_name' => $subject->subject_name,
                            'time_start' => $timeSlotLab['time_start'],
                            'time_end' => $timeSlotLab['time_end'],
                            'day_slot' => $daySlotLab,
                            'room_number' => $roomLab,
                            'section_name' => $section->section_name,
                            'instructor_id' => $instructorId,
                        ];
                    } else {
                        $availableTimeSlots = $this->getAvailableTimeSlots($eligibleRooms->first()->room_number, $daySlot, $schedule, 4);

                        if (empty($availableTimeSlots)) {
                            \Log::warning('No available time slots for subject: ' . $subject->subject_code);
                            continue;
                        }

                        $timeSlot = $availableTimeSlots[array_rand($availableTimeSlots)];

                        $schedule[] = [
                            'subject_code' => $subject->subject_code,
                            'subject_name' => $subject->subject_name,
                            'time_start' => $timeSlot['time_start'],
                            'time_end' => $timeSlot['time_end'],
                            'day_slot' => $daySlot,
                            'room_number' => $eligibleRooms->first()->room_number,
                            'section_name' => $section->section_name,
                            'instructor_id' => $instructorId,
                        ];
                    }
                }
            }
            $population[] = $schedule;
        }

        return $population;
    }
    
    private function evolvePopulation($population, $courseSubjects, $courseSections, $rooms, $instructors, $subjectInstructors)
    {
        $bestFitness = -INF;
        $bestSchedule = null;
        for ($generation = 0; $generation < self::MAX_GENERATIONS; $generation++) {
            \Log::info('Generation: ' . $generation);
            $fitnessScores = [];
            foreach ($population as $index => $schedule) {
                \Log::error('calculating fitness', $schedule);
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
                }
            }
            \Log::info('New Population Size: ' . count($newPopulation));    
            $population = $newPopulation;
        }
        
        return $bestSchedule;
        
    }
    
    private function selectParent($fitnessScores)
    {
        $tournamentSize = 3;
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
            $section = $item['section_name'];
            if (!isset($parent1BySections[$section])) {
                $parent1BySections[$section] = [];
            }
            $parent1BySections[$section][] = $item;
        }
        
        foreach ($parent2 as $item) {
            $section = $item['section_name'];
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
            $key = $item['subject_code'] . '-' . $item['section_name'];
            if (!isset($scheduleBySubject[$key])) {
                $scheduleBySubject[$key] = [];
            }
            $scheduleBySubject[$key][] = $index;
        }

        foreach ($scheduleBySubject as $key => $indices) {
            if (mt_rand() / mt_getrandmax() < self::MUTATION_RATE) {
                list($subjectCode, $sectionName) = explode('-', $key);

                $subject = $courseSubjects->firstWhere('subject_code', $subjectCode);
                if (!$subject) continue;

                $mutationType = 4 / mt_rand(1, 12);

                switch ($mutationType) {
                    case 1: 
                        \Log::error("mutate room");
                        $eligibleRooms = $this->getEligibleRooms($subject, $rooms);
                        if (!$eligibleRooms->isEmpty()) {
                            $newRoom = $eligibleRooms->random()->room_number;
                            foreach ($indices as $idx) {
                                $schedule[$idx]['room_number'] = $newRoom;
                            }
                        }
                        break;

                    case 2: 
                        \Log::error("Mutate instructor");
                        $eligibleInstructors = $this->getEligibleInstructors($subject, $instructors, $subjectInstructors);
                        if (!$eligibleInstructors->isEmpty()) {
                            $newInstructor = $eligibleInstructors->random()->id;
                            foreach ($indices as $idx) {
                                $schedule[$idx]['instructor_id'] = $newInstructor;
                            }
                        }
                        break;

                    case 3: 
                        \Log::info("Mutate day and time slots for lecture and lab");

                        $newDayLec = rand(1, 3); 
                        $newDayLab = rand($newDayLec + 1, 5); 

                        $roomNumber = $schedule[$indices[0]]['room_number'];

                        
                        $availableTimeSlotsLec = $this->getAvailableTimeSlots($roomNumber, $newDayLec, $schedule, 3);

                        if (!empty($availableTimeSlotsLec)) {
                            $newTimeSlotLec = $availableTimeSlotsLec[array_rand($availableTimeSlotsLec)];

                            
                            $newTimeSlotLab = [
                                'time_start' => $newTimeSlotLec['time_start'],
                                'time_end' => date('H:i', strtotime($newTimeSlotLec['time_start']) + (3 * 3600)), 
                            ];

                            foreach ($indices as $idx) {
                                if ($schedule[$idx]['room_number'] === $roomNumber && $schedule[$idx]['day_slot'] === $newDayLec) {
                                    
                                    $schedule[$idx]['day_slot'] = $newDayLec;
                                    $schedule[$idx]['time_start'] = $newTimeSlotLec['time_start'];
                                    $schedule[$idx]['time_end'] = $newTimeSlotLec['time_end'];
                                } else {
                                    
                                    $schedule[$idx]['day_slot'] = $newDayLab;
                                    $schedule[$idx]['time_start'] = $newTimeSlotLab['time_start'];
                                    $schedule[$idx]['time_end'] = $newTimeSlotLab['time_end'];
                                }
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
        $penaltyFactor = 1.0;
        
        
        $roomConflicts = $this->countRoomConflicts($schedule);
        $instructorConflicts = $this->countInstructorConflicts($schedule);
        $sectionConflicts = $this->countSectionConflicts($schedule);
        $instructorConsecutiveHours = $this->checkInstructorConsecutiveHours($schedule);
        $labRoomAssignments = $this->checkLabRoomAssignments($schedule, $courseSubjects, $rooms);
        $distributionScore = $this->calculateDistributionScore($schedule);
        
        
        $penaltyFactor -= ($roomConflicts * 0.2);
        $penaltyFactor -= ($instructorConflicts * 0.2);
        $penaltyFactor -= ($sectionConflicts * 0.2);
        $penaltyFactor -= ($instructorConsecutiveHours * 0.1);
        $penaltyFactor -= ($labRoomAssignments * 0.1);
        
        
        $baseScore = count($schedule);
        
        
        $score = $baseScore + $distributionScore;
        $score *= max(0.1, $penaltyFactor); 
        return $score;
    }
    
    private function countRoomConflicts($schedule)
    {
        \Log::error('time slot conflict scan: ', $schedule);
        $conflicts = 0;
        $roomUsage = [];

        foreach ($schedule as $item) {
            $key = $item['room_number'] . '-' . $item['day_slot'];
            $timeStart = strtotime($item['time_start']);
            $timeEnd = strtotime($item['time_end']);

            if (!isset($roomUsage[$key])) {
                $roomUsage[$key] = [];
            }

            foreach ($roomUsage[$key] as $usedTime) {
                $usedStart = strtotime($usedTime['time_start']);
                $usedEnd = strtotime($usedTime['time_end']);

                if ($timeStart < $usedEnd && $timeEnd > $usedStart) {
                    $conflicts++;
                    break;
                }
            }

            $roomUsage[$key][] = [
                'time_start' => $item['time_start'],
                'time_end' => $item['time_end'],
            ];
            \Log::error('Room Usage: ' . json_encode($roomUsage));
        }

        return $conflicts;
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
    
    private function countSectionConflicts($schedule)
    {
        $conflicts = 0;
        $sectionUsage = [];
        
        foreach ($schedule as $item) {
            $key = $item['section_name'] . '-' . $item['time_start'] . '-' . $item['time_end'] . '-' . $item['day_slot'];
            if (isset($sectionUsage[$key])) {
                $conflicts++;
            }
            $sectionUsage[$key] = true;
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
    
    private function checkLabRoomAssignments($schedule, $courseSubjects, $rooms)
    {
        $violations = 0;
        $roomMap = [];
        
        foreach ($rooms as $room) {
            $roomMap[$room->room_number] = $room->is_lab;
        }
        
        foreach ($schedule as $item) {
            $subject = $courseSubjects->firstWhere('subject_code', $item['subject_code']);
            
            if (!$subject) {
                continue;
            }
            
            $subjectNeedsLab = ($subject->room_req === 1);
            $roomIsLab = $roomMap[$item['room_number']] ?? false;
            
            if ($subjectNeedsLab !== $roomIsLab) {
                $violations++;
            }
        }
        
        return $violations;
    }
    
    private function calculateDistributionScore($schedule)
    {
        $distributionScore = 0;

        
        $dayDistribution = array_fill(1, 5, 0); 
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
            ->where('subject_code', $subject->subject_code)
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
    
    private function getAvailableTimeSlots($roomNumber, $daySlot, $schedule, $length)
    {
        $availableTimeSlots = [];
        $time_length = 1800 * $length;
        \Log::error('Time length: ' . $time_length . ' For room: ' . $roomNumber . ' on day: ' . $daySlot);
        
        $workingHoursStart = strtotime('07:00');
        $workingHoursEnd = strtotime('18:00');

        
        for ($time = $workingHoursStart; $time < $workingHoursEnd; $time += $time_length) { 
            $availableTimeSlots[] = [
                'time_start' => date('H:i', $time),
                'time_end' => date('H:i', $time + $time_length),
            ];
        }

        
        foreach ($schedule as $item) {
            if ($item['room_number'] === $roomNumber && $item['day_slot'] === $daySlot) {
                $occupiedStart = strtotime($item['time_start']);
                $occupiedEnd = strtotime($item['time_end']);

                
                $availableTimeSlots = array_filter($availableTimeSlots, function ($slot) use ($occupiedStart, $occupiedEnd) {
                    $slotStart = strtotime($slot['time_start']);
                    $slotEnd = strtotime($slot['time_end']);
                    return $slotEnd <= $occupiedStart || $slotStart >= $occupiedEnd;
                });
            }
        }

        
        $occupiedTimeSlots = DB::table('schedules')
            ->where('room_number', $roomNumber)
            ->where('day_slot', $daySlot)
            ->get(['time_start', 'time_end']);

        foreach ($occupiedTimeSlots as $occupied) {
            $occupiedStart = strtotime($occupied->time_start);
            $occupiedEnd = strtotime($occupied->time_end);

            
            $availableTimeSlots = array_filter($availableTimeSlots, function ($slot) use ($occupiedStart, $occupiedEnd) {
                $slotStart = strtotime($slot['time_start']);
                $slotEnd = strtotime($slot['time_end']);
                return $slotEnd <= $occupiedStart || $slotStart >= $occupiedEnd;
            });
        }

        return array_values($availableTimeSlots);
    }

    private function saveSchedule($schedule, $departmentShortName)
    {
        
        Schedules::where('department_short_name', $departmentShortName)->delete();
        
        
        foreach ($schedule as $item) {
            Schedules::create([
                'subject_code' => $item['subject_code'],
                'time_slot' => $item['time_slot'],
                'day_slot' => $item['day_slot'],
                'room_number' => $item['room_number'],
                'section_name' => $item['section_name'],
                'instructor_id' => $item['instructor_id'],
                'department_short_name' => $departmentShortName,
            ]);
        }
    }
    
    private function sendToDeepSeek()
    {
        $deepSeekController = new DeepSeekController();
        return $deepSeekController->index();
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
                'room_number' => $schedule->room_number,
                'section_name' => $schedule->section_name,
                'instructor' => $schedule->instructor_name,
                'department' => $schedule->department_short_name,
            ];
        }

        return response()->json([
            'success' => true,
            'schedule' => $formattedSchedule,
        ]);
    }
    
}
