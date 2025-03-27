<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClassCourse;
use App\Models\Classroom;
use App\Models\Department;
use App\Models\Instructor;
use App\Models\Schedule;
use App\Models\Subject;

class GeneticAlgorithmController extends Controller
{
    protected $populationSize = 100;
    protected $generations = 1000;
    protected $mutationRate = 0.01;

    public function run()
    {
        // Initialize population
        $population = $this->initializePopulation();

        for ($generation = 0; $generation < $this->generations; $generation++) {
            $fitnessScores = $this->evaluateFitness($population);

            $selected = $this->selection($population, $fitnessScores);

            $offspring = $this->crossover($selected);

            $population = $this->mutation($offspring);
        }

        $bestSolution = $this->getBestSolution($population);

        return response()->json($bestSolution);
    }

    protected function initializePopulation()
    {
        $subjects = Subject::all();
        $classrooms = Classroom::all();
        $instructors = Instructor::all();

        $population = [];

        for ($i = 0; $i < $this->populationSize; $i++) {
            $schedule = [];

            foreach ($subjects as $subject) {
                $schedule[] = [
                    'subject' => $subject,
                    'classroom' => $classrooms->random(),
                    'instructor' => $instructors->random(),
                    'timeslot' => rand(1, 10) // Example timeslot
                ];
            }

            $population[] = $schedule;
        }

        return $population;
    }

    protected function evaluateFitness($population)
    {
        $fitnessScores = [];

        foreach ($population as $schedule) {
            $fitness = 0;

            // Example fitness evaluation: penalize conflicts
            foreach ($schedule as $entry) {
                foreach ($schedule as $otherEntry) {
                    if ($entry !== $otherEntry) {
                        if ($entry['timeslot'] === $otherEntry['timeslot']) {
                            if ($entry['classroom']->id === $otherEntry['classroom']->id) {
                                $fitness -= 1; // Conflict in classroom
                            }
                            if ($entry['instructor']->id === $otherEntry['instructor']->id) {
                                $fitness -= 1; // Conflict in instructor
                            }
                        }
                    }
                }
            }

            $fitnessScores[] = $fitness;
        }

        return $fitnessScores;
    }

    protected function selection($population, $fitnessScores)
    {
        $selected = [];
        $totalFitness = array_sum($fitnessScores);

        for ($i = 0; $i < $this->populationSize; $i++) {
            $random = rand(0, $totalFitness);
            $cumulativeFitness = 0;

            foreach ($population as $index => $individual) {
                $cumulativeFitness += $fitnessScores[$index];
                if ($cumulativeFitness >= $random) {
                    $selected[] = $individual;
                    break;
                }
            }
        }

        return $selected;
    }

    protected function crossover($selected)
    {
        $offspring = [];

        for ($i = 0; $i < $this->populationSize; $i += 2) {
            $parent1 = $selected[$i];
            $parent2 = $selected[$i + 1];

            $crossoverPoint = rand(0, count($parent1) - 1);

            $child1 = array_merge(array_slice($parent1, 0, $crossoverPoint), array_slice($parent2, $crossoverPoint));
            $child2 = array_merge(array_slice($parent2, 0, $crossoverPoint), array_slice($parent1, $crossoverPoint));

            $offspring[] = $child1;
            $offspring[] = $child2;
        }

        return $offspring;
    }

    protected function mutation($offspring)
    {
        foreach ($offspring as &$individual) {
            if (rand(0, 100) / 100 < $this->mutationRate) {
                $index1 = rand(0, count($individual) - 1);
                $index2 = rand(0, count($individual) - 1);

                $temp = $individual[$index1]['timeslot'];
                $individual[$index1]['timeslot'] = $individual[$index2]['timeslot'];
                $individual[$index2]['timeslot'] = $temp;
            }
        }

        return $offspring;
    }

    protected function getBestSolution($population)
    {
        $fitnessScores = $this->evaluateFitness($population);
        $bestIndex = array_keys($fitnessScores, max($fitnessScores))[0];

        return $population[$bestIndex];
    }
}
