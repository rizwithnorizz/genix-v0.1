import React, { useState } from 'react';
import Layout from '@/Components/ui/layout';

// Types
interface Course {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
  courseId: number;
  yearLevel: string;
  subjects: Subject[];
}

const CourseOfferingsPage: React.FC = () => {
  // Courses data
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: 'Bachelor of Science in Information Technology' },
    { id: 2, name: 'Bachelor of Science in Computer Science' },
    { id: 3, name: 'Bachelor of Science in Information Systems' },
    { id: 4, name: 'Bachelor of Library and Information Science' },
    { id: 5, name: 'Associate in Computer Technology' },
  ]);
  const [sections, setSection] = useState<Section[]>([
    { id: 1, name: "CS1-1", courseId: 1, yearLevel: "First Year", subjects: [{id: 1, name: "AL101"}]},
    { id: 2, name: "IT1-1", courseId: 2, yearLevel: "First Year", subjects: [{id: 1, name: "AL101"}]},
  ])

  // UI state
  const [activeTab, setActiveTab] = useState<'Course Offerings' | 'Sections'>('Course Offerings');

  const [showAddSubject, setShowAddSubject] = useState<boolean>(false);
  const [selectedYearLevel, setSelectedYearLevel] = useState<string>('First Year');
  const [selectedSemester, setSelectedSemester] = useState<string>('First Semester');

  const [showSectionDetails, setShowSectionDetails] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [showAddSection, setShowAddSection] = useState<boolean>(false);

  const [showCourseDetails, setShowCourseDetails] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCreateCourse, setShowCreateCourse] = useState<boolean>(false);



  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Subject name' },
    { id: 2, name: 'Subject name' },
    { id: 3, name: 'Subject name' },
    { id: 4, name: 'Subject name' },
  ]);

  const [courseName, setCourseName] = useState<string>('');

  // Handlers
  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseDetails(true);
  };

  const handleSectionClick = (sections: Section) => {
    setSelectedCourse(sections);
    setShowSectionDetails(true);
  }

  const handleAddCourse = () => {
    setShowCreateCourse(true);
    console.log('Add new course');
  };

  const handleAddSection = () => {
    setShowAddSection(true);
  };

  const handleAddSubject = () => {
    setShowAddSubject(true);
  };

  const handleRemoveSubject = (id: number) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const handleCloseCourseDetails = () => {
    setShowCourseDetails(false);
  };

  const handleCloseAddSection = () => {
    setShowAddSection(false);
  };

  const handleCloseAddSubject = () => {
    setShowAddSubject(false);
  };

  const handleCloseAddCourse = () => {
    setShowCreateCourse(false);
    setCourseName('');
  }

  const handleCreateSubject = (courseName: string) => {
    //Course name checker if its blank
    console.log(courseName);
    setShowCreateCourse(false);
  }

  

  // Menu toggle for each course (three dots)
  const [openCourseMenu, setOpenCourseMenu] = useState<number | null>(null);
  
  const toggleCourseMenu = (courseId: number) => {
    setOpenCourseMenu(openCourseMenu === courseId ? null : courseId);
  };

  const [openSectionMenu, setOpenSectionMenu] = useState<number | null>(null);
  
  const toggleSectionMenu = (sectionId: number) => {
    setOpenSectionMenu(openSectionMenu === sectionId ? null : sectionId);
  };

  const handleSwitchTabs = (tabName: string) => {
    setOpenSectionMenu(null);
    setOpenCourseMenu(null);
    setActiveTab(tabName === 'Course Offerings' ? 'Course Offerings' : 'Sections');
  }

  return (
    <Layout>
      <main className="col-span-3 space-y-4">
        <h1 className="font-bold text-2xl mb-4">Course Offerings & Sections</h1>

        <div className="bg-white p-4 rounded-2xl shadow-lg">
          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button 
              className={`px-4 py-2 ${activeTab === 'Course Offerings' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
              onClick={() => handleSwitchTabs('Course Offerings')}
            >
              Course Offerings
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'Sections' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
              onClick={() => handleSwitchTabs('Sections')}
            >
              Sections
            </button>
          </div>

          {/* Course Offerings Tab */}
          {activeTab === 'Course Offerings' && (
            <div className="bg-gray-200 p-4 rounded-lg">
              {courses.map((course) => (
                <div key={course.id} className="bg-gray-800 text-white p-3 rounded-full flex justify-between items-center mb-3 shadow">
                  <span className="text-lg pl-3">{course.name}</span>
                  <button onClick={() => toggleCourseMenu(course.id)} className="text-2xl px-4 focus:outline-none relative">
                    &#x22EE;
                  </button>
                  {openCourseMenu === course.id && (
                    <div className="mr-8 absolute bg-white rounded-lg shadow-lg p-2 right-16 z-10 mt-2">
                      <button 
                        onClick={() => handleCourseClick(course)} 
                        className="text-black block w-full text-left p-2 hover:bg-gray-200 rounded"
                      >
                        Course Details
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-end mt-4">
                <button 
                  onClick={handleAddCourse} 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Add Course
                </button>
              </div>
            </div>
          )}

          {/* Sections Tab */}
          {activeTab === 'Sections' && (
            <div className="bg-gray-200 p-4 rounded-lg">
              {sections.map((sections) => (
                    <div key={sections.id} className="bg-gray-800 text-white p-3 rounded-full flex justify-between items-center mb-3 shadow">
                    <span className="text-lg pl-3">{sections.name}</span>
                    <button onClick={() => toggleSectionMenu(sections.id)} className="text-2xl px-4 focus:outline-none relative">
                      &#x22EE;
                    </button>
                    {openSectionMenu === sections.id && (
                      <div className="mr-8 absolute bg-white rounded-lg shadow-lg p-2 right-16 z-10 mt-2">
                        <button 
                          onClick={() => handleSectionClick(sections)} 
                          className="text-black block w-full text-left p-2 hover:bg-gray-200 rounded"
                        >
                          Section Details
                        </button>
                      </div>
                    )}
                  </div>
                  ))}
              <div className="flex justify-end mt-4">
                <button 
                  onClick={handleAddSection} 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Add Section
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Course Details Popup */}
        {showCourseDetails && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">Course Details</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="relative">
                    <select className="appearance-none bg-gray-200 p-3 rounded-lg w-full">
                      <option>First Year</option>
                      <option>Second Year</option>
                      <option>Third Year</option>
                      <option>Fourth Year</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <select className="appearance-none bg-gray-200 p-3 rounded-lg w-full">
                      <option>Semester</option>
                      <option>First Semester</option>
                      <option>Second Semester</option>
                      <option>Summer</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <h3 className="font-semibold mb-2">Subjects</h3>
              <div className="bg-gray-200 p-3 rounded-lg max-h-64 overflow-y-auto">
                {subjects.map(subject => (
                  <div key={subject.id} className="bg-gray-700 text-white p-3 rounded-full mb-2">
                    {subject.name}
                  </div>
                ))}
                <div className="flex justify-end mt-2">
                  <button onClick={handleAddSubject} className="bg-green-500 text-white p-1 rounded-full h-8 w-8 flex items-center justify-center text-xl">
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={handleCloseCourseDetails}
                >
                  Done
                </button>
                <button 
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                  onClick={handleCloseCourseDetails}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Subject Popup */}
        {showAddSubject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">Add</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <select className="appearance-none bg-gray-200 p-3 rounded-lg w-full">
                    <option>Units</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                
                <div className="relative">
                  <select className="appearance-none bg-gray-200 p-3 rounded-lg w-full">
                    <option>Room Req</option>
                    <option>Computer Lab</option>
                    <option>Lecture Room</option>
                    <option>Gym</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                
                <input 
                  type="text" 
                  placeholder="Subject Description" 
                  className="p-3 bg-gray-200 rounded-lg w-full"
                />
                
                <input 
                  type="text" 
                  placeholder="Subject Code" 
                  className="p-3 bg-gray-200 rounded-lg w-full"
                />
                
                <div>
                  <p className="mb-2">Professional Subject</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="radio" id="lecture" name="subjectType" checked className="mr-2" />
                      <label htmlFor="lecture">Lecture</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="comlab" name="subjectType" className="mr-2" />
                      <label htmlFor="comlab">Comlab</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="halfhalf" name="subjectType" className="mr-2" />
                      <label htmlFor="halfhalf">Half-Half</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-2 mt-4">
                <button 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={handleCloseAddSubject}
                >
                  Add
                </button>
                <button 
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                  onClick={handleCloseAddSubject}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Section Popup */}
        {showAddSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Section</h2>
                <div className="relative">
                  <button className="bg-gray-200 p-2 rounded-lg">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="relative mb-4">
                <select className="appearance-none bg-gray-200 p-3 rounded-lg w-full">
                  <option>Course</option>
                  {courses.map(course => (
                    <option key={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input 
                  type="text" 
                  placeholder="Section Name" 
                  className="p-3 bg-gray-200 rounded-lg"
                />
                <div className="relative">
                  <select className="appearance-none bg-gray-200 p-3 rounded-lg w-full">
                    <option>First Year</option>
                    <option>Second Year</option>
                    <option>Third Year</option>
                    <option>Fourth Year</option>
                  </select>
                </div>
              </div>
              
              <h3 className="font-semibold mb-2">Subjects</h3>
              <div className="bg-gray-200 p-3 rounded-lg max-h-48 overflow-y-auto mb-4">
                <div className="bg-gray-700 text-white p-3 rounded-full mb-2">
                  Subject name
                </div>
                <div className="bg-gray-700 text-white p-3 rounded-full mb-2">
                  Subject name
                </div>
                <div className="bg-gray-700 text-white p-3 rounded-full">
                  Subject name
                </div>
              </div>

              {/* Room Assignment section (for Image 4) */}
              <h3 className="font-semibold mb-2">Room Assignment</h3>
              <div className="bg-gray-200 p-3 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <select className="appearance-none bg-gray-200 p-3 rounded-lg w-full border border-gray-300">
                      <option>Lecture</option>
                    </select>
                  </div>
                  <div className="relative">
                    <select className="appearance-none bg-gray-200 p-3 rounded-lg w-full border border-gray-300">
                      <option>Computer Lab</option>
                    </select>
                  </div>
                  <div className="relative">
                    <select className="appearance-none bg-gray-200 p-3 rounded-lg w-full border border-gray-300">
                      <option>Gym</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={handleCloseAddSection}
                >
                  Done
                </button>
                <button 
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                  onClick={handleCloseAddSection}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showSectionDetails && selectedSection && (
          <div>

          </div>
        )}

        {/* Course Details Popup */}
        {showCreateCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">Add Course</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                    <input
                      key="courseName"
                      value={courseName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCourseName(e.target.value)}
                      type="text"
                      placeholder="Course Name..." 
                      className="rounded-xl w-full p-3 border border-gray-300"
                    />
                </div>
                
                <div>
                  <select key="yearLevel" className="appearance-none bg-gray-200 p-3 rounded-lg w-full">
                    <option>First Year</option>
                    <option>Second Year</option>
                    <option>Third Year</option>
                    <option>Fourth Year</option>
                  </select>
                </div>
                
                <div>
                  <select key="semester" className="appearance-none bg-gray-200 p-3 rounded-lg w-full">
                    <option>First Semester</option>
                    <option>Second Semester</option>
                    <option>Summer</option>
                  </select>
                </div>
              </div>
              
              <h3 className="font-semibold mb-2">Subjects</h3>
              <div className="bg-gray-200 p-3 rounded-lg max-h-64 overflow-y-auto">
                {subjects.map(subject => (
                  <div key={subject.id} className="bg-gray-700 text-white p-3 rounded-full mb-2">
                    {subject.name}
                  </div>
                ))}
                <div className="flex justify-end mt-2">
                  <button onClick={handleAddSubject} className="bg-green-500 text-white p-1 rounded-full h-8 w-8 flex items-center justify-center text-xl">
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={() => handleCreateSubject(courseName)}
                >
                  Add Course
                </button>
                <button 
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                  onClick={handleCloseAddCourse}
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

export default CourseOfferingsPage;