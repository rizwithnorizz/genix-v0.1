import Layout from '@/Components/ui/layout';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Schedule {
  id: number;
  subjectID: number;
  time_start: string;
  time_end: string;
  day_slot: number;
  roomID: number;
  sectionID: number;
  instructor_id: number;
  departmentID: number;
  department_short_name: string;
  semester: string;
  created_at: string | null;
  updated_at: string | null;
  section_name: string;
  instructor_name: string;
  subject_code: string;
  room_number: string;
}

const SchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [searchInstructor, setSearchInstructor] = useState<string>('');

  const fetchSchedule = async () => {
    try {
      const response = await axios.get('/api/schedules/instructor/published');
      setSchedules(response.data.data);
      setFilteredSchedules(response.data.data); // Initialize filtered schedules
      console.log('Response:', response.data.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };
  const DAY_MAPPING: { [key: number]: string } = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
};

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Filter schedules based on department and instructor name
  useEffect(() => {
    const filtered = schedules.filter((schedule) => {
      const matchesDepartment =
        !selectedDepartment || schedule.departmentID.toString() === selectedDepartment;
      const matchesInstructor =
        !searchInstructor ||
        schedule.instructor_name.toLowerCase().includes(searchInstructor.toLowerCase());
      return matchesDepartment && matchesInstructor;
    });
    setFilteredSchedules(filtered);
  }, [selectedDepartment, searchInstructor, schedules]);

  return (
    <Layout>
      <main className="col-span-3 space-y-4">
        <h1 className="font-bold text-2xl mb-4">Schedule</h1>

        {/* Filters */}
        <div className="gap-4 flex">
          <select
            className="rounded-xl p-2 border border-gray-300"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            {[...new Set(schedules.map((schedule) => schedule.departmentID))].map(
              (departmentID) => (
                <option key={departmentID} value={departmentID}>
                  {schedules.find((s) => s.departmentID === departmentID)?.department_short_name || 'Unknown'}
                </option>
              )
            )}
          </select>
          <input
            type="text"
            placeholder="Search Instructor Name"
            className="rounded-xl p-2 border border-gray-300"
            value={searchInstructor}
            onChange={(e) => setSearchInstructor(e.target.value)}
          />
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto">
          {selectedDepartment ? (
            <table className="w-full table-auto border-collapse border border-gray-300 mt-4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 border border-gray-300">Section</th>
                  <th className="px-4 py-2 border border-gray-300">Subject</th>
                  <th className="px-4 py-2 border border-gray-300">Day</th>
                  <th className="px-4 py-2 border border-gray-300">Time</th>
                  <th className="px-4 py-2 border border-gray-300">Instructor</th>
                  <th className="px-4 py-2 border border-gray-300">Room</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border border-gray-300">
                      {schedule.section_name}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {schedule.subject_code}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {DAY_MAPPING[schedule.day_slot] || 'Unknown'}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {schedule.time_start} - {schedule.time_end}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {schedule.instructor_name}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {schedule.room_number}
                    </td>
                  </tr>
                ))}
                {filteredSchedules.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center px-4 py-2 border border-gray-300"
                    >
                      No schedules found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="text-center mt-4 text-gray-500">
              Please select a department to view schedules.
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default SchedulePage;