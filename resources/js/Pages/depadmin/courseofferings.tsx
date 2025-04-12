import React, { useEffect, useState } from 'react';
import Layout from '@/Components/ui/layout';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';

interface Curriculum { 
  id: number;
  department_short_name: string;
  curriculum_name: string;
  program_name: string;
  program_short_name: string;
}

interface ProgramOfferings { 
  id: number;
  program_name: string;
  program_short_name: string;
  curriculum_id: number;
  department_short_name: string;
}

interface Section {
  id: number;
  section_name: string;
  program_short_name: string;
  year_level: number;
  semester: string;
}

interface CourseSubject {
  id: number;
  program_short_name: string;
  subject_code: string;
}

interface Subject {
  id: number;
  name: string;
  room_req: number;
  subject_code: string;
  prof_sub: boolean;
}
const CourseOfferingsPage: React.FC = () => {
  


  {/* navigation */}
  const [openCourseMenu, setOpenCourseMenu] = useState<number | null>(null);
  const toggleCourseMenu = (courseId: number) => {
    setOpenCourseMenu(openCourseMenu === courseId ? null : courseId);
  };
  const toggleSectionMenu = (sectionId: number) => {
    setOpenSectionMenu(openSectionMenu === sectionId ? null : sectionId);
  };
  const [openSectionMenu, setOpenSectionMenu] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'Course Offerings' | 'Sections'>('Course Offerings');
  const handleSwitchTabs = (tabName: string) => {
    setOpenSectionMenu(null);
    setOpenCourseMenu(null);
    setActiveTab(tabName === 'Course Offerings' ? 'Course Offerings' : 'Sections');
  }
  {/* navigation */}

  {/*curriculum pop up*/}
  const [showCurriculumCourses, setShowCurriculumCourses] = useState<boolean>(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const handleShowCurriculumCourses = (curriculum: Curriculum) => {
    setSelectedCurriculum(curriculum);
    setShowCurriculumCourses(true);
  }

  {/*curriculum pop up*/}
  
  {/*curriculum api*/}
  const [curriculum, setCurriculum] = useState<Curriculum[]>([]);
  const fetchCurriculum = async() => {
    try {
      const response = await axios.get('/api/curriculum');
      console.log("Curriculum: ", response.data.data);
      setCurriculum(response.data.data);
    } catch (error) {
      console.error('Error fetching curriculum:', error);
    }
  }
  {/*curriculum api*/}

  {/*sections api*/}
  const [sections, setSections] = useState<Section[]>([]);
  const fetchSections = async () => {
    try {
      const response = await axios.get('/api/section');
      setSections(response.data.data);
      console.log("Sections: ", response.data.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };
  {/*sections api*/}


  useEffect(() => { 
    fetchCurriculum();
    fetchSections();
  }
  , []);

  return (
    <Layout>
      <main className="col-span-3 space-y-4">
        <h1 className="font-bold text-2xl mb-4">Curriculum</h1>

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
            <div className="bg-white p-4 rounded-2xl shadow-lg">
                <div className="flex justify-between">
                  <input className="border border-gray-300 rounded-lg p-2" type="text" placeholder="Search curriculum..." />
                </div>
                <div  >
                  <div className="mt-5">
                    <label className="text-lg font-semibold pl-5 pt-3">Curriculum</label>
                    <label className="text-lg font-semibold pl-5 pt-3">Program</label>
                  </div>
                </div>
                <div className="mt-5 space-y-4 max-h-[400px] overflow-y-auto">
                  {curriculum.map((Curriculum, idx) => (
                    <button 
                      onClick={() => handleShowCurriculumCourses(Curriculum)}
                      key={idx} 
                      className="w-full h-[55px] hover:bg-gray-700 bg-gray-800 text-white p-2 rounded-full flex shadow relative items-center">
                      <div className="pl-5">
                        <label className="flex justify-start h-full w-20">{Curriculum.curriculum_name}</label>
                      </div>
                      <div className="pl-5">
                        <label className="flex justify-start h-50">{Curriculum.program_name}</label>
                      </div>
                    </button>
                  ))}
                </div>
                <PrimaryButton className="mt-10 bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg ">New Curriculum</PrimaryButton>
            </div>
          )}

          {/* Sections Tab */}
          {activeTab === 'Sections' && (
            
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="flex justify-between">
              <input className="border border-gray-300 rounded-lg p-2" type="text" placeholder="Search section..." />
            </div>
            <div className="mt-5 space-y-4 max-h-[400px] overflow-y-auto">
              {sections.map((sections) => (
                    <div key={sections.id} className="bg-gray-800 text-white p-3 rounded-full flex justify-between items-center mb-3 shadow">
                    <span className="text-lg pl-3">{sections.section_name}</span>
                    <button onClick={() => toggleSectionMenu(sections.id)} className="text-2xl px-4 focus:outline-none relative">
                      &#x22EE;
                    </button>
                    {openSectionMenu === sections.id && (
                      <div className="mr-8 absolute bg-white rounded-lg shadow-lg p-2 right-16 z-10 mt-2">
                        <button 
                          //onClick={() => handleSectionClick(sections)} 
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
                  //onClick={handleAddSection} 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Add Section
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
        
        
      </main>
    </Layout>
  );
};

export default CourseOfferingsPage;