
import Layout  from '@/Components/ui/layout';
import { useCallback, useEffect, useState } from 'react';
import { Bell,
        House,
        Network,
        Users,
        type LucideIcon } from "lucide-react"
import axios from 'axios';

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

interface HeaderCount{
  id: number;
  icon: LucideIcon;
  desc: string;
  count: number;
}

const SuperAdminDashboard: React.FC = () => {
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
  const [roomCount, setRoomCount] = useState<number>(0);
  const [departmentCount, setDepartmentCount] = useState<number>(0);

  const handleRoomCount = useCallback(async() => {
    const response = await axios.get('/admin/getRoom');
    setRoomCount(response.data.length);
    const response2 = await axios.get('admin/getDepartments');
    setDepartmentCount(response2.data.length);    
  }, []);
  useEffect(() => {
    handleRoomCount();
  }, [handleRoomCount]);

  const headerCount: HeaderCount[] = [
    {
      id: 1,
      icon: House,
      desc: "Rooms",
      count: roomCount,
    },
    {
      id: 2,
      icon: Network,
      desc: "Departments",
      count: departmentCount,
    },

  ]
  return (
      <Layout>
      
      <main className="col-span-3 space-y-4">
        
      <h1 className="font-bold text-2xl mb-4">Super Admin Dashboard</h1>
        <div className="grid md:grid-cols-5 grid-cols-1 gap-4">
          {headerCount.map((count, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-lg md:row-start-1 s:h-70">
                <div className="flex items-center justify-center">
                  <count.icon className="h-20 w-20"/>
                </div>
                <div>
                  <label className="text-lg">{count.desc}</label>
                </div>
                <div>
                  <label className="text-4xl font-bold">{count.count}</label>
                </div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 ">
            <div className="bg-white p-4 rounded-2xl shadow-lg md:row-start-1 s:h-70">
              <h2 className="font-semibold text-lg">Generate Schedule</h2>
              <div className="mt-5 space-y-4 h-[139px] overflow-y-auto">
                {schedule.map((schedule, idx) => (
                  <div key={idx} className="bg-gray-800 text-white p-2 rounded-full flex shadow relative items-center justify-between">
                    <div className="pl-5 flex items-center">
                      <span>{schedule.content}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-green-500 text-white rounded-3xl p-2">View File</button>
                      <button className="bg-red-800 text-white rounded-3xl p-2">Delete File</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-10 bg-black text-white py-2 px-4 rounded-lg ">Generate New Class Schedule</button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg col-span-2 h-[300px] overflow-y-auto">
              <h2 className="font-semibold text-lg mb-2">Feedback Pending for Approval</h2>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Department</th>
                    <th className="p-2">Year Level</th>
                    <th className="p-2">Program</th>
                    <th className="p-2">Building</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { dept: 'CICT', year: 1, section: 'IT4-1', building: 'A' },
                    { dept: 'CAS', year: 2, section: 'PSYCH2-2', building: 'B' },
                    { dept: 'CENG', year: 3, section: 'CIVENG3-2', building: 'C' },
                    { dept: 'CTHM', year: 4, section: 'HOSMNG1-4', building: 'D' },
                    { dept: 'CBA', year: 5, section: 'ACC2-1', building: 'E' },
                    { dept: 'CCJE', year: 6, section: 'CRIM3-2', building: 'F' },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{row.dept}</td>
                      <td className="p-2">{row.year}</td>
                      <td className="p-2">{row.section}</td>
                      <td className="p-2">{row.building}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            <div className="bg-white p-4 rounded-2xl shadow-lg md:row-start-1 col-span-1 ">
              <div className="p-5 grid grid-cols-3 md:grid-cols-3  gap-4 h-[200px] overflow-y-auto">
                {['CAS', 'CENG', 'CBA', 'CCJE', 'CTHM', 'CEDU', 'CAMS', 'CIT', 'DE', 'ETEEAP'].map((dept) => (
                  <div key={dept} className="bg-gray-50 p-4 rounded-xl flex flex-col items-center shadow h-30">
                    <div className="bg-gray-200 w-16 h-16 rounded-full mb-2"></div> 
                    <span>{dept}</span> 
                  </div> //Department Logo and Department Name
                ))}
              </div>
            <a href = "departments">
              <button className="mt-4 bg-black text-white py-2 px-4 rounded-lg">View All Departments</button>
            </a> 
          </div>
          
            <div className="bg-white p-4 rounded-2xl shadow-lg md:row-start-3 col-start-1 h-[300px] overflow-y-auto">
              <h2 className="font-semibold text-lg">News</h2>
              <div className="mt-5 space-y-4 h-[200px] s:h-70 ove rflow-y-auto">
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
      </main>
    </Layout>
  );
};
export default SuperAdminDashboard;
