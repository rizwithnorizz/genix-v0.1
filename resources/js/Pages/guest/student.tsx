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
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Schedule | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRemaining, setFeedbackRemaining] = useState(3); // Example value

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

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Filter schedules based on department and section
  useEffect(() => {
    const filtered = schedules.filter((schedule) => {
      const matchesDepartment =
        !selectedDepartment || schedule.department_short_name === selectedDepartment;
      const matchesSection =
        !selectedSection || schedule.section_name === selectedSection;
      return matchesDepartment && matchesSection;
    });
    setFilteredSchedules(filtered);
  }, [selectedDepartment, selectedSection, schedules]);

  const DAY_MAPPING: { [key: number]: string } = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
  };

  // Group schedules by day and sort by time
  const groupedSchedules = Object.keys(DAY_MAPPING).reduce((acc, day) => {
    const daySchedules = filteredSchedules
      .filter((schedule) => schedule.day_slot === parseInt(day))
      .sort((a, b) => a.time_start.localeCompare(b.time_start));
    acc[day] = daySchedules;
    return acc;
  }, {} as { [key: string]: Schedule[] });

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSubject(schedule);
    setShowFeedbackPopup(true);
  };

  const handleSubmitFeedback = async(schedule: Schedule) => {
    console.log('Feedback submitted:', feedbackText);
    try{
      await axios.post('/api/feedback/student', {
        sectionID: schedule.sectionID,
        departmentID: schedule.departmentID,
        subjectID: schedule.subjectID,
        feedback: feedbackText,
      });
      console.log('Feedback submitted successfully');
    }catch (error) {
      console.error('Error submitting feedback:', error);
    }
    setShowFeedbackPopup(false);
    setFeedbackText('');
  };

  const handleCancelFeedback = () => {
    setShowFeedbackPopup(false);
    setFeedbackText('');
  };

  return (
    <Layout>
      <main className="col-span-3 space-y-4">
        <h1 className="font-bold text-2xl mb-4">Schedule</h1>

        <div className="gap-4 flex">
          <select
            className="rounded-xl p-2 border border-gray-300"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            {[...new Set(schedules.map((schedule) => schedule.department_short_name))].map(
              (departmentName) => (
                <option key={departmentName} value={departmentName}>
                  {departmentName}
                </option>
              )
            )}
          </select>

          <select
            className="rounded-xl p-2 border border-gray-300"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!selectedDepartment} // Disable if no department is selected
          >
            <option value="">Select Section</option>
            {[...new Set(
              schedules
                .filter((schedule) => schedule.department_short_name === selectedDepartment)
                .map((schedule) => schedule.section_name)
            )].map((sectionName) => (
              <option key={sectionName} value={sectionName}>
                {sectionName}
              </option>
            ))}
          </select>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto">
          {selectedSection ? (
            <table className="w-full overflow-x-auto border-collapse border border-gray-300 mt-4">
              <thead className="bg-gray-200">
                <tr>
                  {Object.values(DAY_MAPPING).map((day) => (
                    <th key={day} className="px-4 py-2 border border-gray-300">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.keys(DAY_MAPPING).map((day) => (
                    <td key={day} className="px-4 py-2 border border-gray-300 w-[10rem]  align-top">
                      {groupedSchedules[day]?.length > 0 ? (
                        groupedSchedules[day].map((schedule) => (
                          <button key={schedule.id} className="mb-2 bg-gray-100 w-full" 
                            onClick={() => handleScheduleClick(schedule)}>
                            <p className="text-xl text-blue-500 font-semibold">
                              {schedule.room_number}
                            </p>
                            <p className="font-semibold">
                              {schedule.subject_code}
                            </p>
                            <p className="text-sm text-gray-600">
                              {schedule.instructor_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {schedule.time_start} - {schedule.time_end} 
                            </p>
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No schedules</p>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="text-center mt-4 text-gray-500">
              Please select a section to view schedules.
            </div>
          )}
        </div>

        {showFeedbackPopup && selectedSubject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Create Feedback</h2>
                <div className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                  Feedback remaining: {feedbackRemaining}
                </div>
              </div>

              <div className="mb-4">
                <p >
                  <h2>
                    Subject: {selectedSubject.subject_code}
                  </h2>
                  <h2>Section: {selectedSubject.section_name}</h2> 
                    Day: {DAY_MAPPING[selectedSubject.day_slot]}
                  <h2>
                    Room: {selectedSubject.room_number}
                  </h2>
                  <h2>
                    Time: {selectedSubject.time_start} - {selectedSubject.time_end}
                  </h2>
                  <h2>
                    Instructor: {selectedSubject.instructor_name}
                  </h2>
                </p>
              </div>

              <textarea
                placeholder="Request..."
                className="p-2 border rounded-lg w-full h-32 mb-4"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleSubmitFeedback(selectedSubject)}
                  className="bg-green-500 text-white py-2 px-8 rounded-full"
                >
                  Submit
                </button>
                <button
                  onClick={handleCancelFeedback}
                  className="bg-red-500 text-white py-2 px-8 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default SchedulePage;