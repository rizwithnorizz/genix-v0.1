import Chart2 from '@/Components/ui/chart2';
import Layout  from '@/Components/ui/layout';
import Department from '@/Components/ui/department';
import Pendings from '@/Components/ui/pendings';
import News from '@/Components/ui/news';


export default function SuperAdminDashboard (){
  return (
    <div className="p-2 md:p-5 bg-gray-100 min-h-screen">
      <Layout>
      
      <h1 className="font-bold text-2xl mb-4">Department</h1>
      <main className="space-y-4">
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 ">
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
                    { dept: 'CICT', year: 1, section: 'IT4-1', subject: 'HC101' },
                    { dept: 'CAS', year: 2, section: 'PSYCH2-2', subject: 'MIND102' },
                    { dept: 'CENG', year: 3, section: 'CIVENG3-2', subject: 'CALC101' },
                    { dept: 'CTHM', year: 4, section: 'HOSMNG1-4', subject: 'BAR202' },
                    { dept: 'CBA', year: 5, section: 'ACC2-1', subject: 'STATS101' },
                    { dept: 'CCJE', year: 6, section: 'CRIM3-2', subject: 'JUS102' },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{row.dept}</td>
                      <td className="p-2">{row.year}</td>
                      <td className="p-2">{row.section}</td>
                      <td className="p-2">{row.subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            <div className="bg-white p-4 rounded-2xl shadow-lg row-start-2 col-span-1 ">
              <div className="p-5 grid grid-cols-3 md:grid-cols-3  gap-4 h-[200px] overflow-y-auto">
                {['CAS', 'CENG', 'CBA', 'CCJE', 'CTHM', 'CEDU', 'CAMS', 'CIT', 'DE', 'ETEEAP'].map((dept) => (
                  <div key={dept} className="bg-gray-50 p-4 rounded-xl flex flex-col items-center shadow h-30">

                    <div className="bg-gray-200 w-16 h-16 rounded-full mb-2"></div>
                    <span>{dept}</span>
                  </div>
                ))}
              </div>
            <button className="mt-4 bg-black text-white py-2 px-4 rounded-lg">View All Departments</button>
          </div>
          
          <div className="bg-white p-4 rounded-2xl shadow-lg md:row-start-2 row-start-3 h-[300px] overflow-y-auto">
              <h2 className="font-semibold text-lg">News</h2>
              <p className="mt-2">ang lupet ni jud mag computer sheeesh</p>
              <p>time check, 7:46 am!!!!!!!!!
              </p>
              <p>tulog na ko goodnight mahal ko kayong lahat mwah</p>
            </div>
          </div>
        </main>
      </Layout>

      </div>
  );
};

