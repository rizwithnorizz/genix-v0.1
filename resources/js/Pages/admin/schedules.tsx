import Layout from '@/Components/ui/layout';
  import React, { useState, useEffect, useCallback } from 'react';
  import axios from 'axios';

  interface ScheduleItem {
    id: number;
    subject_code: string;
    subject_name: string;
    time_slot: number;
    day_slot: number;
    room_number: string;
    section_name: string;
  }

  interface TimeSlot {
    id: number;
    display: string;
    actualTime: string;
  }

  const SchedulePage: React.FC = () => {
    const [selectedSubject, setSelectedSubject] = useState<ScheduleItem | null>(null);
    const [showFeedbackPopup, setShowFeedbackPopup] = useState<boolean>(false);
    const [feedbackRemaining, setFeedbackRemaining] = useState<number>(3);
    const [feedbackText, setFeedbackText] = useState<string>('');
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [transformedData, setTransformedData] = useState<ScheduleItem[]>([]);
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Define time slots with numerical IDs
    const timeSlots: TimeSlot[] = [
      { id: 1, display: '7:00 - 7:30', actualTime: '07:00-07:30' },
      { id: 2, display: '7:30 - 8:00', actualTime: '07:30-08:00' },
      { id: 3, display: '8:00 - 8:30', actualTime: '08:00-08:30' },
      { id: 4, display: '8:30 - 9:00', actualTime: '08:30-09:00' },
      { id: 5, display: '9:00 - 9:30', actualTime: '09:00-09:30' },
      { id: 6, display: '9:30 - 10:00', actualTime: '09:30-10:00' },
      { id: 7, display: '10:00 - 10:30', actualTime: '10:00-10:30' },
      { id: 8, display: '10:30 - 11:00', actualTime: '10:30-11:00' },
      { id: 9, display: '11:00 - 11:30', actualTime: '11:00-11:30' },
      { id: 10, display: '11:30 - 12:00', actualTime: '11:30-12:00' },
      { id: 11, display: '1:00 - 1:30', actualTime: '13:00-13:30' },
      { id: 12, display: '1:30 - 2:00', actualTime: '13:30-14:00' },
      { id: 13, display: '2:00 - 2:30', actualTime: '14:00-14:30' },
      { id: 14, display: '2:30 - 3:00', actualTime: '14:30-15:00' },
      { id: 15, display: '3:00 - 3:30', actualTime: '15:00-15:30' },
      { id: 16, display: '3:30 - 4:00', actualTime: '15:30-16:00' },
      { id: 17, display: '4:00 - 4:30', actualTime: '16:00-16:30' },
      { id: 18, display: '4:30 - 5:00', actualTime: '16:30-17:00' },
      { id: 19, display: '5:00 - 5:30', actualTime: '17:00-17:30' },
      { id: 20, display: '5:30 - 6:00', actualTime: '17:30-18:00' },
    ];

    const fetchScheduleData = useCallback(async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/schedules');
        console.log('API Response:', response.data);

        if (Array.isArray(response.data.schedules)) {
          const transformedData = response.data.schedules.map((item: any) => ({
            id: item.id,
            subject_code: item.subject_code,
            subject_name: item.subject?.name || item.subject_code,
            time_slot: item.time_slot,
            day_slot: item.day_slot,
            room_number: item.room_number,
            section_name: item.section_name,
          }));
          setScheduleData(transformedData);
        } else {
          setError('Unexpected response format');
          console.error('Unexpected response format:', response.data);
        }
      } catch (err) {
        setError('Failed to fetch schedule data');
        console.error('API Error:', err);
      } finally {
        setIsLoading(false);
      }
    }, []);
    // Correct useEffect usage
    useEffect(() => {
      fetchScheduleData();
    }, [fetchScheduleData]);
  // Helper function to get day abbreviation from day number
  const getDayAbbreviation = (dayNumber: number): string => {
    const dayMap: Record<number, string> = {
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat'
    };
    return dayMap[dayNumber] || '';
  };

  // Helper function to get the time display for a subject
  const getSubjectTimeDisplay = (subject: ScheduleItem): string => {
    const slot = timeSlots.find(ts => ts.id === subject.time_slot);
    return slot ? slot.display : '';
  };

  // Check if a cell should display a subject
  const getSubjectForCell = (timeSlotId: number, day: string): ScheduleItem | null => {
    return scheduleData.find(subject => 
      getDayAbbreviation(subject.day_slot) === day && 
      subject.time_slot === timeSlotId
    ) || null;
  };

  const handleSubjectSelect = (subject: ScheduleItem) => {
    setSelectedSubject(subject);
    setShowFeedbackPopup(true);
  };

  const handleSubmitFeedback = () => {
    console.log('Feedback submitted:', feedbackText);
    setFeedbackRemaining(prev => Math.max(0, prev - 1));
    setShowFeedbackPopup(false);
    setFeedbackText('');
  };

  const handleCancelFeedback = () => {
    setShowFeedbackPopup(false);
    setFeedbackText('');
  };

  if (isLoading) {
    return (
      <Layout>
        <main className="col-span-3 space-y-4">
          <h1 className="font-bold text-2xl mb-4">Schedule</h1>
          <div>Loading schedule data...</div>
          <button onClick={fetchScheduleData} className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4">
              Refresh Schedule
            </button>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="col-span-3 space-y-4">
          <h1 className="font-bold text-2xl mb-4">Schedule</h1>
          <div className="text-red-500">{error}</div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="col-span-3 space-y-4">
        <h1 className="font-bold text-2xl mb-4">Schedule</h1>
        
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex justify-between mb-4 gap-10">
            <div className="relative w-1/3">
              <select className="appearance-none w-full bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none">
                <option>Department</option>
                {/* Department options here */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              </div>
            </div>
            
            <div className="relative w-1/3">
              <select className="appearance-none w-full bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none">
                <option>Program</option>
                {/* Program options here */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              </div>
            </div>
            
            <div className="relative w-1/3">
              <select className="appearance-none w-full bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none">
                <option>Section</option>
                {/* Section options here */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              </div>
            </div>
          </div>
          
          {/* Schedule display */}
          <div className="overflow-y-auto h-[500px]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 bg-gray-50 border text-left">Time</th>
                  {days.map((day) => (
                    <th key={day} className="p-2 bg-gray-100 border text-center">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot.id}>
                    <td className="p-2 border bg-gray-50 text-sm">
                      {timeSlot.display}
                    </td>
                    {days.map((day) => {
                      const subject = getSubjectForCell(timeSlot.id, day);
                      
                      if (subject) {
                        return (
                          <td 
                            key={`${day}-${timeSlot.id}`}
                            className="p-2 border bg-yellow-100 text-center cursor-pointer"
                            onClick={() => handleSubjectSelect(subject)}
                          >
                            <div className="font-semibold">{subject.subject_code}</div>
                            <div className="text-xs text-gray-600">{subject.room_number}</div>
                            <div className="text-xs text-gray-600">{subject.section_name}</div>
                          </td>
                        );
                      } else {
                        return <td key={`${day}-${timeSlot.id}`} className="p-2 border"></td>;
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {showFeedbackPopup && selectedSubject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Selected Subject</h2>
                <div className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                  Feedback remaining: {feedbackRemaining}
                </div>
              </div>
              
              <div className="mb-4">
                <p className="font-semibold">{selectedSubject.subject_code} - {selectedSubject.subject_name}</p>
                <p className="text-sm text-gray-600">
                  {getDayAbbreviation(selectedSubject.day_slot)}, {getSubjectTimeDisplay(selectedSubject)}
                </p>
                <p className="text-sm text-gray-600">
                  Room: {selectedSubject.room_number} | Section: {selectedSubject.section_name}
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
                  onClick={handleSubmitFeedback} 
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