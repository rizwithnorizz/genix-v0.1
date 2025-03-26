import Layout  from '@/Components/ui/layout';
import React, { useState } from 'react';

interface Department {
  id: number;
  name: string;
  shortName: string;
  logo: string;
}

const DepartmentPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: 'Computer Science', shortName: 'CS', logo: '' },
    { id: 2, name: 'Information Technology', shortName: 'IT', logo: '' },
    { id: 3, name: 'Civil Engineering', shortName: 'CE', logo: '' },
    { id: 4, name: 'Electrical Engineering', shortName: 'EE', logo: '' },
    { id: 5, name: 'Mechanical Engineering', shortName: 'ME', logo: '' },
    { id: 6, name: 'Chemical Engineering', shortName: 'ChE', logo: '' },
    { id: 7, name: 'Industrial Engineering', shortName: 'IE', logo: '' },
  ]);
  const [showMenuIndex, setShowMenuIndex] = useState<number | null>(null);
  const [showAdminPopup, setShowAdminPopup] = useState<boolean>(false);

  const handleEdit = (department: Department) => {
    console.log('Edit:', department);
  };

  const handleDelete = (department: Department) => {
    console.log('Delete:', department);
  };

  const handleAdmin = (department: Department) => {
    console.log('Admin:', department);
    setShowAdminPopup(true);
  };

  const toggleMenu = (index: number) => {
    setShowMenuIndex(prev => (prev === index ? null : index));
  };

  const closeAdminPopup = () => {
    setShowAdminPopup(false);
  };

  return (
    <Layout>
      <main className="col-span-3 space-y-4">
        <h1 className="font-bold text-2xl mb-4">Department</h1>

        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <h2 className="font-semibold text-lg mb-2">List of departments</h2>
          <div className="space-y-4 h-[300px] overflow-y-auto">
            {departments.map((department, idx) => (
              <div key={idx} className="bg-gray-800 text-white p-2 rounded-full flex justify-between items-center shadow relative">
                <div className="flex items-center">
                  <div className="bg-white w-10 h-10 rounded-full mr-4"></div>
                  <span>{department.shortName}</span>
                </div>
                <button onClick={() => toggleMenu(idx)} className="pr-5 text-4xl focus:outline-none relative z-10">&#x22EE;</button>
                {showMenuIndex === idx && (
                  <div className="absolute bg-gray-100 rounded-lg shadow-lg p-4 right-10 mr-3 top-0 mt-2 z-20">
                    <button onClick={() => handleEdit(department)} className="text-black block w-full text-left p-2 hover:bg-gray-300 rounded">Edit Department Details</button>
                    <button onClick={() => handleDelete(department)} className="text-black block w-full text-left p-2 hover:bg-gray-300 rounded">Delete Department</button>
                    <button onClick={() => handleAdmin(department)} className="text-black block w-full text-left p-2 hover:bg-gray-300 rounded">Department Admin</button>
                    <button className="text-black block w-full text-left p-2 hover:bg-gray-300 rounded">Room Assignments</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Department Name..." className="p-2 rounded-lg border" />
          <select className="p-2 rounded-lg border">
            <option>Department Admin</option>
          </select>
          <button className="bg-blue-500 text-white p-2 rounded-lg">Upload Logo</button>

          <input type="text" placeholder="Department Short Name..." className="p-2 rounded-lg border" />
          <select className="p-2 rounded-lg border">
            <option>Assigned Rooms</option>
          </select>
          <button className="bg-green-500 text-white p-2 rounded-lg">Create Department</button>
        </div>

        {showAdminPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">Department Admin</h2>
              <input type="text" placeholder="Search Name" className="p-2 border rounded-lg w-full mb-4" />
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                  <span>Department Admin Name</span>
                  <button className="text-red-500">&#10060;</button>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                  <span>Department Admin Name</span>
                  <button className="text-red-500">&#10060;</button>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={closeAdminPopup} className="bg-green-500 text-white p-2 rounded-lg">Confirm</button>
                <button onClick={closeAdminPopup} className="bg-gray-500 text-white p-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default DepartmentPage;
