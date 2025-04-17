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
    
    
    const POPULATION_SIZE = 50;
    const MAX_GENERATIONS = 100;
    const MUTATION_RATE = 0.1;
    const CROSSOVER_RATE = 0.8;
    const ELITE_COUNT = 5;
    
    
    const TIME_SLOTS = [
        1 => '08:00-09:30',
        2 => '09:30-11:00',
        3 => '11:00-12:30',
        4 => '13:00-14:30',
        5 => '14:30-16:00',
        6 => '16:00-17:30',
    ];
    
    
    const DAYS = [
        1 => 'Monday',
        2 => 'Tuesday',
        3 => 'Wednesday',
        4 => 'Thursday',
        5 => 'Friday',
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
    public function generateSchedule()
    {
        try {
            $userDepartment = auth()->user()->department_short_name;
            
            
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
            foreach ($bestSchedule as $item) {  
                try {
                    DB::table('schedules')->insert([
                        'subject_code' => $item['subject_code'],
                        'section_name' => $item['section_name'],
                        'room_number' => $item['room_number'],
                        'instructor_id' => $item['instructor_id'],
                        'day_slot' => $item['day_slot'], 
                        'time_slot' => $item['time_slot'],
                        'department_short_name' => $userDepartment,
                    ]);
                    \Log::info('Inserted Schedule: ' . json_encode($item));
                } catch (\Exception $e) {
                    \Log::error('Failed to insert schedule: ' . $e->getMessage());
                }
            }
            return response()->json([
                'success' => true,
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

                    
                    $totalHours = ($subject->lec ?? 0) + ($subject->lab ?? 0);
                    $dayCount = ($totalHours > 3) ? 2 : 1;

                    
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
                    $roomNumber = $eligibleRooms->random()->room_number;

                    
                    if ($dayCount === 1) {
                        
                        $daySlot = rand(1, 5); 
                        $timeSlot = rand(1, 4); 

                        
                        $consecutiveSlots = ($totalHours > 4) ? 3 : 2;

                        for ($slot = 0; $slot < $consecutiveSlots; $slot++) {
                            if ($timeSlot + $slot <= 6) { 
                                $schedule[] = [
                                    'subject_code' => $subject->subject_code,
                                    'subject_name' => $subject->subject_name,
                                    'time_slot' => $timeSlot + $slot,
                                    'day_slot' => $daySlot,
                                    'room_number' => $roomNumber,
                                    'section_name' => $section->section_name,
                                    'instructor_id' => $instructorId,
                                ];
                            }
                        }
                    } else {
                        
                        $daySlot1 = rand(1, 3); 
                        $daySlot2 = rand($daySlot1 + 1, 5); 

                        $timeSlot1 = rand(1, 6); 
                        $timeSlot2 = rand(1, 6); 

                        $schedule[] = [
                            'subject_code' => $subject->subject_code,
                            'subject_name' => $subject->subject_name,
                            'time_slot' => $timeSlot1,
                            'day_slot' => $daySlot1,
                            'room_number' => $roomNumber,
                            'section_name' => $section->section_name,
                            'instructor_id' => $instructorId,
                        ];

                        $schedule[] = [
                            'subject_code' => $subject->subject_code,
                            'subject_name' => $subject->subject_name,
                            'time_slot' => $timeSlot2,
                            'day_slot' => $daySlot2,
                            'room_number' => $roomNumber,
                            'section_name' => $section->section_name,
                            'instructor_id' => $instructorId,
                        ];
                    }
                }
            }
            \Log::info('Generated Schedule: ' . json_encode($schedule));
            $population[] = $schedule;
        }

        return $population;
    }
    
    private function evolvePopulation($population, $courseSubjects, $courseSections, $rooms, $instructors, $subjectInstructors)
    {
        $bestFitness = -INF;
        $bestSchedule = null;
        
        for ($generation = 0; $generation < self::MAX_GENERATIONS; $generation++) {
            
            $fitnessScores = [];
            foreach ($population as $index => $schedule) {
                $fitnessScores[$index] = $this->calculateFitness($schedule, $courseSubjects, $courseSections, $rooms, $instructors);
                
                
                if ($fitnessScores[$index] > $bestFitness) {
                    $bestFitness = $fitnessScores[$index];
                    $bestSchedule = $schedule;
                }
            }
            
            
            $newPopulation = [];
            
            
            arsort($fitnessScores);
            $eliteIndices = array_keys(array_slice($fitnessScores, 0, self::ELITE_COUNT, true));
            foreach ($eliteIndices as $eliteIndex) {
                $newPopulation[] = $population[$eliteIndex];
            }
            
            
            while (count($newPopulation) < self::POPULATION_SIZE) {
                
                $parent1Index = $this->selectParent($fitnessScores);
                $parent2Index = $this->selectParent($fitnessScores);
                
                
                if (mt_rand() / mt_getrandmax() < self::CROSSOVER_RATE) {
                    $child = $this->crossover($population[$parent1Index], $population[$parent2Index]);
                } else {
                    $child = $population[$parent1Index]; 
                }
                
                
                $child = $this->mutate($child, $courseSubjects, $courseSections, $rooms, $instructors, $subjectInstructors);
                
                $newPopulation[] = $child;
            }
            
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
                
                
                $mutationType = mt_rand(1, 3);
                
                switch ($mutationType) {
                    case 1: 
                        $eligibleRooms = $this->getEligibleRooms($subject, $rooms);
                        if (!$eligibleRooms->isEmpty()) {
                            $newRoom = $eligibleRooms->random()->room_number;
                            foreach ($indices as $idx) {
                                $schedule[$idx]['room_number'] = $newRoom;
                            }
                        }
                        break;
                        
                    case 2: 
                        $eligibleInstructors = $this->getEligibleInstructors($subject, $instructors, $subjectInstructors);
                        if (!$eligibleInstructors->isEmpty()) {
                            $newInstructor = $eligibleInstructors->random()->id;
                            foreach ($indices as $idx) {
                                $schedule[$idx]['instructor_id'] = $newInstructor;
                            }
                        }
                        break;
                        
                    case 3: 
                        $totalHours = ($subject->lec ?? 0) + ($subject->lab ?? 0);
                        $dayCount = count($indices);
                        
                        if ($dayCount === 1) {
                            
                            $newDay = rand(1, 5);
                            $newStartTime = rand(1, 4);
                            $consecutiveSlots = ($totalHours > 4) ? 3 : 2;
                            
                            
                            foreach ($indices as $idx) {
                                unset($schedule[$idx]);
                            }
                            
                            
                            for ($slot = 0; $slot < $consecutiveSlots; $slot++) {
                                if ($newStartTime + $slot <= 6) {
                                    $schedule[] = [
                                        'subject_code' => $subjectCode,
                                        'subject_name' => $subject->subject_name,
                                        'time_slot' => $newStartTime + $slot,
                                        'day_slot' => $newDay,
                                        'room_number' => $schedule[$indices[0]]['room_number'],
                                        'section_name' => $sectionName,
                                        'instructor_id' => $schedule[$indices[0]]['instructor_id'],
                                    ];
                                }
                            }
                        } else if ($dayCount === 2) {
                            
                            $newDay1 = rand(1, 3);
                            $newDay2 = rand($newDay1 + 1, 5);
                            $newTime1 = rand(1, 6);
                            $newTime2 = rand(1, 6);
                            
                            
                            $schedule[$indices[0]]['day_slot'] = $newDay1;
                            $schedule[$indices[0]]['time_slot'] = $newTime1;
                            $schedule[$indices[1]]['day_slot'] = $newDay2;
                            $schedule[$indices[1]]['time_slot'] = $newTime2;
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
        $conflicts = 0;
        $roomUsage = [];
        
        foreach ($schedule as $item) {
            $key = $item['room_number'] . '-' . $item['time_slot'] . '-' . $item['day_slot'];
            if (isset($roomUsage[$key])) {
                $conflicts++;
            }
            $roomUsage[$key] = true;
        }
        
        return $conflicts;
    }

    private function countInstructorConflicts($schedule)
    {
        $conflicts = 0;
        $instructorUsage = [];
        
        foreach ($schedule as $item) {
            $key = $item['instructor_id'] . '-' . $item['time_slot'] . '-' . $item['day_slot'];
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
            $key = $item['section_name'] . '-' . $item['time_slot'] . '-' . $item['day_slot'];
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
            $instructorSchedule[$key][] = $item['time_slot'];
        }
        
        foreach ($instructorSchedule as $timeSlots) {
            sort($timeSlots);
            $consecutiveCount = 1;
            
            for ($i = 1; $i < count($timeSlots); $i++) {
                if ($timeSlots[$i] == $timeSlots[$i-1] + 1) {
                    $consecutiveCount++;
                } else {
                    $consecutiveCount = 1;
                }
                
                if ($consecutiveCount > 3) {
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
        $timeDistribution = array_fill(1, 6, 0); 
        
        foreach ($schedule as $item) {
            $dayDistribution[$item['day_slot']]++;
            $timeDistribution[$item['time_slot']]++;
        }
        
        
        $dayStdDev = $this->calculateStandardDeviation($dayDistribution);
        $timeStdDev = $this->calculateStandardDeviation($timeDistribution);
        
        
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
        if ($subject->prof_subject) {
            
            $eligibleIds = $subjectInstructors
                ->where('subject_code', $subject->subject_code)
                ->pluck('instructor_id')
                ->toArray();
            
            return $instructors->filter(function($instructor) use ($eligibleIds) {
                return in_array($instructor->id, $eligibleIds);
            });
        } else {
            
            return $instructors;
        }
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
                'time_slot' => self::TIME_SLOTS[$schedule->time_slot],
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
