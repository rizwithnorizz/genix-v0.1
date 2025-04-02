import React, { useState } from 'react';
import Layout from '@/Components/ui/layout';

// Types
interface Instructor {
  id: number;
  name: string;
  initials: string;
  subjects: Subject[];
}

interface Subject {
  id: number;
  name: string;
  type: 'professional' | 'general';
}

const InstructorsPage: React.FC = () => {
  // Instructors data
  const [instructors, setInstructors] = useState<Instructor[]>([
    { id: 1, name: 'Rhueliza Tordecilla', initials: 'RT', subjects: [] },
    { id: 2, name: 'Alvin Mercado', initials: 'AM', subjects: [] },
    { id: 3, name: 'Elvie Evangelista', initials: 'EE', subjects: [] },
    { id: 4, name: 'Rene Magpantay', initials: 'RM', subjects: [] },
    { id: 5, name: 'Charles Leoj Roxas', initials: 'CR', subjects: [] },
    { id: 6, name: 'Bernadet Macaraig', initials: 'BM', subjects: [] },
  ]);

  // Subject sample data
  const [profSubjects, setProfSubjects] = useState<Subject[]>([
    { id: 1, name: 'Subject name', type: 'professional' },
    { id: 2, name: 'Subject name', type: 'professional' },
    { id: 3, name: 'Subject name', type: 'professional' },
  ]);

  // UI state
  const [showAddInstructor, setShowAddInstructor] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'Professional Subjects' | 'General Education'>('Professional Subjects');
  const [instructorName, setInstructorName] = useState<string>('');

  const [showEditInstructor, setShowEditInstructor] = useState<boolean>(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  const handleEditInstructor = (instructor: Instructor) => {
    setShowEditInstructor(true);
    setSelectedInstructor(instructor);
    setInstructorName(instructor.name); 
  }
  
  // Handlers
  const handleAddInstructor = () => {
    setShowAddInstructor(true);
  };

  const handleCloseAddInstructor = () => {
    setShowAddInstructor(false);
    setInstructorName('');
  };

  const handleCloseUpdate = () => {
    setShowEditInstructor(false);
    setInstructorName('');
  }


  const handleSaveInstructor = () => {
    if (instructorName.trim()) {
        // Generate initials from name
        const nameParts = instructorName.split(' ');
        let initials = '';
        
        if (nameParts.length >= 2) {
            initials = nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
        } else if (nameParts.length === 1) {
            initials = nameParts[0].substring(0, 2);
        }
        
        initials = initials.toUpperCase();
        
        const newInstructor: Instructor = {
            id: instructors.length + 1,
            name: instructorName,
            initials: initials,
            subjects: []
        };
        
        setInstructors([...instructors, newInstructor]);
        handleCloseAddInstructor();
    }
  };

  const handleUpdateInstructor = () => {
    if (selectedInstructor && instructorName.trim()) {
        const nameParts = instructorName.split(' ');
        let initials = '';
        
        if (nameParts.length >= 2) {
            initials = nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
        } else if (nameParts.length === 1) {
            initials = nameParts[0].substring(0, 2);
        }
        
        selectedInstructor.initials = initials.toUpperCase();
        
            
        const updatedInstructors = instructors.map(inst =>
            inst.id === selectedInstructor.id ? { ...inst, name: instructorName } : inst
        );
        setInstructors(updatedInstructors); // Update the instructor list
        handleCloseUpdate();
    }
  };

  const handleAddSubject = () => {
    // Logic to add a new subject
    console.log('Add new subject');
  };

  return (
    <Layout>
      <main className="col-span-3 space-y-4">
        <h1 className="font-bold text-2xl mb-4">Instructors</h1>

        <div className="bg-gray-200 p-4 rounded-lg">
          <div className="flex justify-end mb-4">
            <div className="relative w-32">
              <select className="appearance-none bg-white p-2 rounded-lg w-full shadow">
                <option>Filter</option>
                <option>By Name</option>
                <option>By Subject</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {instructors.map((instructor) => (
              <button key={instructor.id} 
              onClick = {() => handleEditInstructor(instructor)}
              className="bg-gray-700 text-white p-6 rounded-lg shadow flex flex-col items-center justify-center">
                <div className="text-6xl font-bold mb-2">{instructor.initials}</div>
                <div className="text-center">{instructor.name}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <button 
              onClick={handleAddInstructor}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add Instructor
            </button>
          </div>
        </div>

        {/* Add Instructor Popup */}
        {showAddInstructor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Instructor</h2>
              </div>
              
              <input 
                type="text" 
                placeholder="Name" 
                className="p-3 bg-gray-200 rounded-lg w-full mb-4"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
              />
              
              <div className="mb-4">
                <div className="flex border-b mb-2">
                  <button 
                    className={`px-4 py-2 ${activeTab === 'Professional Subjects' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                    onClick={() => setActiveTab('Professional Subjects')}
                  >
                    Professional Subjects
                  </button>
                  <button 
                    className={`px-4 py-2 ${activeTab === 'General Education' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                    onClick={() => setActiveTab('General Education')}
                  >
                    General Education
                  </button>
                </div>
                
                {activeTab === 'Professional Subjects' && (
                  <div className="bg-gray-200 p-3 rounded-lg max-h-48 overflow-y-auto">
                  {profSubjects.map(profSubject => (
                    <div key={profSubject.id} className="bg-gray-700 text-white p-3 rounded-full mb-2">
                      {profSubject.name}
                    </div>
                  ))}
                  <div className="flex justify-end mt-2">
                    <button 
                      onClick={handleAddSubject} 
                      className="bg-green-500 text-white p-1 rounded-full h-8 w-8 flex items-center justify-center text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={handleSaveInstructor}
                >
                  Done
                </button>
                <button 
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                  onClick={handleCloseAddInstructor}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/*Show Edit Instructor */}
        {showEditInstructor && selectedInstructor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Instructor</h2>
              </div>
              
              <input 
                type="text" 
                placeholder="Name" 
                className="p-3 bg-gray-200 rounded-lg w-full mb-4"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
              />
              
              <div className="mb-4">
                <div className="flex border-b mb-2">
                  <button 
                    className={`px-4 py-2 ${activeTab === 'Professional Subjects' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                    onClick={() => setActiveTab('Professional Subjects')}
                  >
                    Professional Subjects
                  </button>
                  <button 
                    className={`px-4 py-2 ${activeTab === 'General Education' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                    onClick={() => setActiveTab('General Education')}
                  >
                    General Education
                  </button>
                </div>
                {activeTab === 'Professional Subjects' && (
                  <div className="bg-gray-200 p-3 rounded-lg max-h-48 overflow-y-auto">
                  {profSubjects.map(profSubject => (
                    <div key={profSubject.id} className="bg-gray-700 text-white p-3 rounded-full mb-2">
                      {profSubject.name}
                    </div>
                  ))}
                  <div className="flex justify-end mt-2">
                    <button 
                      onClick={handleAddSubject} 
                      className="bg-green-500 text-white p-1 rounded-full h-8 w-8 flex items-center justify-center text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                )}
                
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={() => handleUpdateInstructor()}
                >
                  Done
                </button>
                <button 
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                  onClick={handleCloseUpdate}
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

export default InstructorsPage;