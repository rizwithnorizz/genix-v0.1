import Layout  from '@/Components/ui/layout';
import { useEffect, useState } from 'react';
import { Bell, ChevronLeft, ChevronRight, MoreVertical, type LucideIcon } from "lucide-react"
import PrimaryButton from '@/Components/PrimaryButton';

interface Courses {
  id: number;
  name: string;
  content: string;
}

interface Instructor {
  id: number;
  name: string;
  initials: string;
}

interface Curriculums {
  id: number;
  name: string;
  courses: Courses[];
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
    const [Courses, setCourses] = useState<Courses[]>([
      { id: 1, name: 'BSCS', content: 'Bachelor of Science in Computer Science' },
      { id: 2, name: 'BSIT', content: 'Bachelor of Science in Information Technology' },
      { id: 3, name: 'BSIS', content: 'Bachelor of Science in Information Science' },
      { id: 4, name: 'BLIS', content: 'Bachelor of Library and Information Systems' },
    ]);

  const [curriculum, setCurriculum] = useState<Curriculums[]>([
    { id: 1, name: 'Curriculum 2023-2024', courses: Courses.map(course => ({ ...course })) },
    { id: 2, name: 'Curriculum 2022-2023', courses: Courses.map(course => ({ ...course }))  },
    { id: 3, name: 'Curriculum 2021-2022', courses: Courses.map(course => ({ ...course }))  },
    { id: 4, name: 'Curriculum 2020-2021', courses: Courses.map(course => ({ ...course }))  },
    { id: 5, name: 'Curriculum 2019-2020', courses: Courses.map(course => ({ ...course }))  },
    { id: 6, name: 'Curriculum 2018-2019', courses: Courses.map(course => ({ ...course }))  },
    { id: 7, name: 'Curriculum 2017-2018', courses: Courses.map(course => ({ ...course }))  },
    { id: 8, name: 'Curriculum 2016-2017', courses: Courses.map(course => ({ ...course }))  },
  ]);

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
      const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculums | null>(null);

      const handleShowCurriculumCourses = (curriculum: Curriculums) => {
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
          <PrimaryButton className="mt-10 bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg ">Generate New Class Schedule</PrimaryButton>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex justify-between">
            <h2 className="font-semibold text-lg mb-2">Curriculums</h2>
            <input className="border border-gray-300 rounded-lg p-2" type="text" placeholder="Search curriculum..." />
          </div>
          <div className="mt-5 space-y-4 h-[139px] overflow-y-auto">
            {curriculum.map((Curriculum, idx) => (
              <button 
                onClick={() => handleShowCurriculumCourses(Curriculum)}
                key={idx} 
                className="w-full h-[55px] hover:bg-gray-700 bg-gray-800 text-white p-2 rounded-full flex shadow relative items-center justify-between">
                <div className="pl-5 flex items-center">
                  <span>{Curriculum.name}</span>
                </div>
              </button>
            ))}
          </div>
          <PrimaryButton className="mt-10 bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg ">New Curriculum</PrimaryButton>
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
        {showCurriculumCourses && selectedCurriculum && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl overflow-y-auto grid grid-cols-1 gap-4">
            
            <h2 className="font-semibold text-lg mb-2">Courses in {selectedCurriculum.name}</h2>
            <div className="space-y-2 overflow-y-auto">
              {selectedCurriculum.courses.map((course, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-2 bg-gray-800 text-white rounded-full shadow relative">
                  {/*Button action open subjects offered per year level and semester*/}
                  <div className="flex items-center">
                    <span className="ml-2">{course.name}</span>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={closeCurriculumCourses} className="w-[200px] mt-4 bg-red-500 text-white px-4 py-2 rounded">
              Close
            </button>
            </div>
          </div>
        )}
        
      </div>
    </Layout>
  );
};

export default DepAdminDashboard;
