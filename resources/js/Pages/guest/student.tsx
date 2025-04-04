import Layout from '@/Components/ui/layout';
import React, { useState } from 'react';

interface Subject {
  id: number;
  code: string;
  name: string;
  timeSlots: string; // e.g., "123" for slots 1, 2, and 3
  day: string;
}

interface TimeSlot {
  id: number;
  display: string; // The display time (e.g., "7:00 - 7:30")
  actualTime: string; // For internal use
}

const SchedulePage: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState<boolean>(false);
  const [feedbackRemaining, setFeedbackRemaining] = useState<number>(3);
  const [feedbackText, setFeedbackText] = useState<string>('');
  
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
  
  // Sample subjects with time slot numbers instead of time strings
  const scheduleData: Subject[] = [
    { id: 1, code: 'COMPROG', name: 'Computer Programming', timeSlots: '789', day: 'Sat' }, // 10:00 - 11:30
    { id: 2, code: 'THIS101', name: 'Thesis Writing', timeSlots: '12', day: 'Fri' }, // 7:00 - 8:00
  ];
  
  // Helper function to get the time display for a subject
  const getSubjectTimeDisplay = (subject: Subject): string => {
    const slots = subject.timeSlots.split('').map(Number);
    if (slots.length === 0) return '';
    
    const firstSlot = timeSlots.find(ts => ts.id === slots[0]);
    const lastSlot = timeSlots.find(ts => ts.id === slots[slots.length - 1]);
    
    if (!firstSlot || !lastSlot) return '';
    
    // Extract just the start time from first slot and end time from last slot
    const startTime = firstSlot.display.split(' - ')[0];
    const endTime = lastSlot.display.split(' - ')[1];
    
    return `${startTime} - ${endTime}`;
  };
  
  // Check if a cell should display a subject
  const getSubjectForCell = (timeSlotId: number, day: string): Subject | null => {
    return scheduleData.find(subject => 
      subject.day === day && 
      subject.timeSlots.includes(timeSlotId.toString())
    ) || null;
  };
  
  // Check if this is the first cell for a subject (to avoid duplicates)
  const isFirstCellForSubject = (timeSlotId: number, day: string, subject: Subject): boolean => {
    return parseInt(subject.timeSlots[0]) === timeSlotId;
  };
  
  // Calculate how many cells a subject spans
  const getSubjectRowSpan = (subject: Subject): number => {
    return subject.timeSlots.length;
  };
  
  const handleSubjectSelect = (subject: Subject) => {
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
          
          {/* Improved schedule display */}
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
                      const isFirstCell = subject && isFirstCellForSubject(timeSlot.id, day, subject);
                      
                      // If there's a subject and it's the first cell, render it
                      if (subject && isFirstCell) {
                        const rowSpan = getSubjectRowSpan(subject);
                        return (
                          <td 
                            key={`${day}-${timeSlot.id}`}
                            className="p-2 border bg-yellow-100 text-center cursor-pointer"
                            rowSpan={rowSpan}
                            onClick={() => handleSubjectSelect(subject)}
                          >
                            <div className="font-semibold">{subject.code}</div>
                            <div className="text-xs text-gray-600">{getSubjectTimeDisplay(subject)}</div>
                          </td>
                        );
                      }
                      // If there's a subject but not the first cell, skip rendering
                      else if (subject && !isFirstCell) {
                        return null;
                      }
                      // If no subject, render empty cell
                      else {
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
                <p className="font-semibold">{selectedSubject.code} - {selectedSubject.name}</p>
                <p className="text-sm text-gray-600">
                  {selectedSubject.day}, {getSubjectTimeDisplay(selectedSubject)}
                  <span className="text-xs ml-2 text-gray-500">
                    (Slots: {selectedSubject.timeSlots.split('').join(', ')})
                  </span>
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