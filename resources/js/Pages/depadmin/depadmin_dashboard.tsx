import Layout  from '@/Components/ui/layout';
import { useEffect, useState } from 'react';
import { Bell, ChevronLeft, ChevronRight, MoreVertical, type LucideIcon } from "lucide-react"
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';


interface Instructor {
  id: number;
  name: string;
  initials: string;
}

interface Curriculum { 
  id: number;
  department_short_name: string;
  curriculum_name: string;
  program_name: string;
  program_short_name: string;
}

interface News {
  id: number;
  name: string;
  content: string;
}

interface Schedule {
  id: number;
  name: string;
  content: string;
}

const DepAdminDashboard:React.FC = () => {
  const [curriculum, setCurriculum] = useState<Curriculum[]>([]);

  const fetchCurriculum = async () => {
    try {
      const response = await axios.get('/api/curriculum');
      setCurriculum(response.data.data);
    } catch (error) {
      console.error('Error fetching curriculum:', error);
    }
  }
  
  useState(() => {
    fetchCurriculum();
  }, );
  
  const handleGenerateSchedule = async () => {
    try {
      const response = await axios.get('/api/schedules/generate');
      console.log('Schedule generated:', response.data);
    }
    catch (error) {
      console.error('Error generating schedule:', error);
    }
  }

  const [news, setNews] = useState<News[]>([
      { id: 1, name: 'Computer Science', content: 'Newly added department CENG' },
      { id: 2, name: 'Information Technology', content: 'Newly added department CICT' },
      { id: 3, name: 'Civil Engineering', content: 'Newly added department CIT' },
      { id: 4, name: 'Electrical Engineering', content: 'Newly added department CEE' },
    ]);  
  
    const [schedule, setSchedule] = useState<Schedule[]>([
      { id: 1, name: 'Generated Schedule', content: 'Class Schedule 03/26/2025' },
      { id: 2, name: 'Generated Schedule', content: 'Class Schedule 04/27/2025' },
      { id: 3, name: 'Generated Schedule', content: 'Class Schedule 06/15/2025' },
      { id: 4, name: 'Generated Schedule', content: 'Class Schedule 06/29/2025' },
    ]);
    const [instructors, setInstructors] = useState<Instructor[]>([
        { id: 1, name: 'Rhueliza Tordecilla', initials: 'RT'},
        { id: 2, name: 'Alvin Mercado', initials: 'AM'},
        { id: 3, name: 'Elvie Evangelista', initials: 'EE' },
        { id: 4, name: 'Rene Magpantay', initials: 'RM'},
        { id: 5, name: 'Charles Leoj Roxas', initials: 'CR'},
        { id: 6, name: 'Bernadet Macaraig', initials: 'BM'},
      ]);
      const [showCurriculumCourses, setShowCurriculumCourses] = useState<boolean>(false);
      const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);

      const handleShowCurriculumCourses = (curriculum: Curriculum) => {
        console.log('Curriculum:', curriculum);
        setSelectedCurriculum(curriculum);
        setShowCurriculumCourses(true);
      }
      const closeCurriculumCourses = () => {
        setShowCurriculumCourses(false);
        setSelectedCurriculum(null);
      }
  return (
    <Layout>
      <h1 className="font-bold text-2xl mb-4">Department Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 grid-cols1 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-lg md:row-start-1 s:h-70">
            <div className="flex justify-between">
              <h2 className="font-semibold text-lg mb-2">Generated Schedules</h2>
              <select className="border border-gray-300 rounded-lg p-2 pr-10">
                <option value="all">Past day</option>
                <option value="current">Past week</option>
                <option value="past">Past month</option>
                <option value="future">Past year</option>
              </select>
            </div>
          <div className="mt-5 space-y-4 h-[139px] overflow-y-auto">
            {schedule.map((schedule, idx) => (
              <div key={idx} className="bg-gray-800 text-white p-2 rounded-full flex shadow relative items-center justify-between">
                <div className="pl-5 flex items-center">
                  <span>{schedule.content}</span>
                </div>
                <div className="flex gap-2">
                  <button className="bg-green-500 hover:bg-green-400 text-white rounded-3xl p-2">View File</button>
                  <button className="bg-red-800 hover:bg-red-700 text-white rounded-3xl p-2">Delete File</button>
                </div>
              </div>
            ))}
          </div>
          <PrimaryButton 
          onClick={handleGenerateSchedule}
          className="mt-10 bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg ">
            Generate New Class Schedule
          </PrimaryButton>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex justify-between">
            <h2 className="font-semibold text-lg mb-2">Curriculums</h2>
          </div>
          <div className="mt-5 space-y-4 h-[139px] overflow-y-auto">
            {curriculum.map((Curriculum, idx) => (
              <button 
                key={idx} 
                className="w-full h-[55px] hover:bg-gray-700 bg-gray-800 text-white p-2 rounded-full flex shadow relative items-center justify-between">
                <div className="pl-5 flex items-center">
                  <span>{Curriculum.curriculum_name}</span>
                </div>
              </button>
            ))}
          </div>
          <a href="/dep-admin/courseOfferings">
            <PrimaryButton 
            className="mt-10 bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg ">View Curriculums
            </PrimaryButton>
          </a>
        </div>
        <div className="mt-4 bg-white p-4 rounded-2xl shadow-lg col-span-2  ">
          <h2 className="font-semibold text-lg mb-4">Faculty</h2>
          <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {instructors.map((instructor) => (
                <PrimaryButton key={instructor.id} 
                className="bg-gray-800 hover:bg-gray-700 text-white p-6 rounded-lg shadow flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold mb-2">{instructor.initials}</div>
                  <div className="text-center">{instructor.name}</div>
                </PrimaryButton>
              ))}
            </div>

            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 text-gray-600 hover:text-blue-600">
              <ChevronLeft size={20} />
            </button>
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 text-gray-600 hover:text-blue-600">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="mt-4 flex justify-between">
            <PrimaryButton className="bg-green-600 text-white py-2 px-4 rounded-lg">View All</PrimaryButton>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-lg md:row-start-3 col-start-1 h-[300px] overflow-y-auto">
          <h2 className="font-semibold text-lg">News</h2>
          <div className="mt-5 space-y-4 h-[200px] s:h-70 overflow-y-auto">
                {news.map((news, idx) => (
                  <div key={idx} className="bg-gray-800 text-white p-4 rounded-full flex justify-between items-center shadow relative">
                    
                    <div className="flex items-center gap-5">
                      <Bell/>
                      <span>{news.content}</span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
        
      </div>
    </Layout>
  );
};

export default DepAdminDashboard;
