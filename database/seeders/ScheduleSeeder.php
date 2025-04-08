<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Subject;
use App\Models\Classroom;
use App\Models\Course_Sections;

class ScheduleSeeder extends Seeder
{
    private $populationSize = 100;
    private $generationCount = 100;
    private $mutationRate = 0.01;
    private $elitismCount = 2;
    
    public function run()
    {
        // Clear existing schedules
        DB::table('schedules')->truncate();

        // Get all necessary data
        $subjects = Subject::all();
        $classrooms = Classroom::all();
        $sections = Course_Sections::all();

        // Generate initial population
        $population = $this->generateInitialPopulation($subjects, $classrooms, $sections);

        // Evolve the population
        for ($i = 0; $i < $this->generationCount; $i++) {
            $population = $this->evolvePopulation($population, $subjects, $classrooms, $sections);
        }

        // Get the best schedule
        $bestSchedule = $this->getBestSchedule($population);

        // Save to database
        $this->saveScheduleToDatabase($bestSchedule);
    }

    private function generateInitialPopulation($subjects, $classrooms, $sections)
    {
        $population = [];
        for ($i = 0; $i < $this->populationSize; $i++) {
            $schedule = $this->generateRandomSchedule($subjects, $classrooms, $sections);
            $population[] = $schedule;
        }
        return $population;
    }

    private function generateRandomSchedule($subjects, $classrooms, $sections)
    {
        $schedule = [];
        
        foreach ($subjects as $subject) {
            $section = $sections->random();
            $classroom = $classrooms->random();
            
            $schedule[] = [
                'subject_code' => $subject->subject_code,
                'time_slot' => rand(1,20), // Assuming 8 time slots per day //revise this line of code, it shouldnt be rng
                'day_slot' => rand(1, 5), // Assuming 5-day week
                'room_number' => $classroom->room_number,
                'section_name' => $section->section_name,
                'fitness' => 0
            ];
        }
        
        return $schedule;
    }

    private function evolvePopulation($population, $subjects, $classrooms, $sections)
    {
        // Evaluate fitness
        $population = $this->calculateFitness($population);
        
        // Sort by fitness
        usort($population, function($a, $b) {
            return $this->getScheduleFitness($b) <=> $this->getScheduleFitness($a);
        });
        
        $newPopulation = [];
        
        // Elitism: keep the best schedules
        for ($i = 0; $i < $this->elitismCount; $i++) {
            if (isset($population[$i])) {
                $newPopulation[] = $population[$i];
            }
        }
        
        // Crossover
        while (count($newPopulation) < $this->populationSize) {
            $parent1 = $this->selectParent($population);
            $parent2 = $this->selectParent($population);
            
            $child = $this->crossover($parent1, $parent2);
            $newPopulation[] = $child;
        }
        
        // Mutation
        for ($i = $this->elitismCount; $i < count($newPopulation); $i++) {
            if (rand(0, 100) / 100 < $this->mutationRate) {
                $newPopulation[$i] = $this->mutate($newPopulation[$i], $classrooms, $sections);
            }
        }
        
        return $newPopulation;
    }

    private function getScheduleFitness($schedule)
    {
        return is_array($schedule) && isset($schedule[0]['fitness']) ? $schedule[0]['fitness'] : 0;
    }

    private function calculateFitness($population)
    {
        foreach ($population as &$schedule) {
            if (!is_array($schedule)) continue;
            
            $conflicts = 0;
            
            // Check for room conflicts
            $roomAssignments = [];
            foreach ($schedule as $entry) {
                if (!isset($entry['room_number']) || !isset($entry['day_slot']) || !isset($entry['time_slot'])) continue;
                
                $key = $entry['room_number'] . '-' . $entry['day_slot'] . '-' . $entry['time_slot'];
                if (isset($roomAssignments[$key])) {
                    $conflicts++;
                } else {
                    $roomAssignments[$key] = true;
                }
            }
            
            // Check for section conflicts
            $sectionAssignments = [];
            foreach ($schedule as $entry) {
                if (!isset($entry['section_name']) || !isset($entry['day_slot']) || !isset($entry['time_slot'])) continue;
                
                $key = $entry['section_name'] . '-' . $entry['day_slot'] . '-' . $entry['time_slot'];
                if (isset($sectionAssignments[$key])) {
                    $conflicts++;
                } else {
                    $sectionAssignments[$key] = true;
                }
            }
            
            // Set fitness for each entry in the schedule
            foreach ($schedule as &$entry) {
                $entry['fitness'] = 1 / (1 + $conflicts);
            }
        }
        
        return $population;
    }

    private function selectParent($population)
    {
        // Tournament selection
        $tournamentSize = min(5, count($population));
        $tournament = [];
        
        for ($i = 0; $i < $tournamentSize; $i++) {
            $randomIndex = array_rand($population);
            $tournament[] = $population[$randomIndex];
        }
        
        usort($tournament, function($a, $b) {
            return $this->getScheduleFitness($b) <=> $this->getScheduleFitness($a);
        });
        
        return $tournament[0] ?? [];
    }

    private function crossover($parent1, $parent2)
    {
        // Uniform crossover
        $child = [];
        $parent1 = is_array($parent1) ? $parent1 : [];
        $parent2 = is_array($parent2) ? $parent2 : [];
        
        $maxLength = max(count($parent1), count($parent2));
        
        for ($i = 0; $i < $maxLength; $i++) {
            $useParent1 = rand(0, 1) == 0;
            
            if ($useParent1 && isset($parent1[$i])) {
                $child[] = $parent1[$i];
            } elseif (isset($parent2[$i])) {
                $child[] = $parent2[$i];
            }
        }
        
        return $child;
    }

    private function mutate($schedule, $classrooms, $sections)
    {
        if (!is_array($schedule) || empty($schedule)) {
            return $schedule;
        }
        
        $index = array_rand($schedule);
        $mutationType = rand(1, 4);
        
        switch ($mutationType) {
            case 1:
                $schedule[$index]['time_slot'] = rand(1, 8);
                break;
            case 2:
                $schedule[$index]['day_slot'] = rand(1, 5);
                break;
            case 3:
                $schedule[$index]['room_number'] = $classrooms->random()->room_number;
                break;
            case 4:
                $schedule[$index]['section_name'] = $sections->random()->section_name;
                break;
        }
        
        return $schedule;
    }

    private function getBestSchedule($population)
    {
        usort($population, function($a, $b) {
            return $this->getScheduleFitness($b) <=> $this->getScheduleFitness($a);
        });
        
        return $population[0] ?? [];
    }

    private function saveScheduleToDatabase($schedule)
    {
        if (!is_array($schedule)) return;
        
        foreach ($schedule as $entry) {
            if (is_array($entry) && isset($entry['subject_code'])) {
                DB::table('schedules')->insert([
                    'subject_code' => $entry['subject_code'],
                    'time_slot' => $entry['time_slot'] ?? 1,
                    'day_slot' => $entry['day_slot'] ?? 1,
                    'room_number' => $entry['room_number'] ?? 'R101',
                    'section_name' => $entry['section_name'] ?? 'BSCS-1A',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }
}