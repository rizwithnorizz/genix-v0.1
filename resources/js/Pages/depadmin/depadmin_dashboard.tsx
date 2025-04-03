import Layout  from '@/Components/ui/layout';
import { useState } from 'react';
import { Bell, type LucideIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

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

interface ProfessionalSubjects {
  id: number;
  name: string;
  content: string;
}

interface News {
  id: number;
  name: string;
  content: string;
}

const DepAdminDashboard:React.FC = () => {
  
  const [Courses, setCourses] = useState<Courses[]>([
    { id: 1, name: 'Course', content: 'Course Name' },
    { id: 2, name: 'Course', content: 'Course Name' },
    { id: 3, name: 'Course', content: 'Course Name' },
    { id: 4, name: 'Course', content: 'Course Name' },
    { id: 5, name: 'Course', content: 'Course Name' },
    { id: 6, name: 'Course', content: 'Course Name' },
    { id: 7, name: 'Course', content: 'Course Name' },
  ]);

  const [ProfessionalSubjects, setProfessionalSubjects] = useState<ProfessionalSubjects[]>([
      { id: 1, name: 'ProfessionalSubjects', content: 'Subject Name' },
      { id: 2, name: 'ProfessionalSubjects', content: 'Subject Name' },
      { id: 3, name: 'ProfessionalSubjects', content: 'Subject Name' },
      { id: 4, name: 'ProfessionalSubjects', content: 'Subject Name' },
      { id: 5, name: 'ProfessionalSubjects', content: 'Subject Name' },
      { id: 6, name: 'ProfessionalSubjects', content: 'Subject Name' },
      { id: 7, name: 'ProfessionalSubjects', content: 'Subject Name' },

    ]);

  const [news, setNews] = useState<News[]>([
      { id: 1, name: 'Computer Science', content: 'Newly added department CENG' },
      { id: 2, name: 'Information Technology', content: 'Newly added department CICT' },
      { id: 3, name: 'Civil Engineering', content: 'Newly added department CIT' },
      { id: 4, name: 'Electrical Engineering', content: 'Newly added department CEE' },
    ]);  

    const [instructors, setInstructors] = useState<Instructor[]>([
        { id: 1, name: 'Rhueliza Tordecilla', initials: 'RT'},
        { id: 2, name: 'Alvin Mercado', initials: 'AM'},
        { id: 3, name: 'Elvie Evangelista', initials: 'EE' },
        { id: 4, name: 'Rene Magpantay', initials: 'RM'},
        { id: 5, name: 'Charles Leoj Roxas', initials: 'CR'},
        { id: 6, name: 'Bernadet Macaraig', initials: 'BM'},
      ]);

  return (
    <Layout>
      <h1>Department Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div className="mt-4 pt-4 bg-white p-4 rounded-2xl shadow-lg flex md:flex-col flex-row">
          <div className="ml-4">
            <h2 className="font-semibold text-lg">Courses</h2>
            <div className="mt-5 space-y-4 h-[250px] overflow-y-auto">
                    {Courses.map((courses, idx) => (
                      <div key={idx} className="bg-gray-800 text-white p-2 rounded-full flex justify-between items-center shadow relative">
                        <div className="pl-5 flex items-center">
                          <span>{courses.content}</span>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 bg-white p-4 rounded-2xl shadow-lg flex md:flex-col flex-row">
            <div className="ml-4">
              <h2 className="font-semibold text-lg">Professional Subjects</h2>
              <div className="mt-5 space-y-4 h-[250px] overflow-y-auto">
                    {ProfessionalSubjects.map((professionalSubjects, idx) => (
                      <div key={idx} className="bg-gray-800 text-white p-2 rounded-full flex justify-between items-center shadow relative">
                        <div className="pl-5 flex items-center">
                          <span>{professionalSubjects.content}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg col-span-2 h-[300px] overflow-y-auto flex md:flex-col flex-row p-4">
            <div className="ml-4">
              <h2 className="font-semibold text-lg mb-2">Faculty</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
                {instructors.map((instructor) => (
                    <div className="rounded-xl border bg-card h-40 w-40 flex flex-col items-center justify-center">
                      <Avatar className="bg-gray-100 rounded-full flex items-center justify-center h-32 w-32">
                        <AvatarImage className="h-full w-full" src="#" alt="CICT" />
                          <AvatarFallback className="text-center">Prof</AvatarFallback>
                      </Avatar>
                      <span className="mt-2 text-sm font-medium text-gray-700">{instructor.name}</span>
                    </div>
                ))}
                </div>
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
