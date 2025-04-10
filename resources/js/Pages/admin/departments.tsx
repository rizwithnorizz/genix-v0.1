import PrimaryButton from '@/Components/PrimaryButton';
import Layout  from '@/Components/ui/layout';
import { Upload } from 'lucide-react';
import React, { useState } from 'react';

interface Department {
  id: number;
  name: string;
  shortName: string;
  logo: string;
}

interface ProgramsOffered { 
  id: number;
  name: string;
  shortName: string;
}
interface Curriculum { 
  id: number;
  name: string;
  programs: ProgramsOffered[];
}

const DepartmentPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: 'College of Information and Communications Technology', shortName: 'CICT', logo: '' },
    { id: 2, name: 'College of Industrial Technology', shortName: 'CIT', logo: '' },
    { id: 3, name: 'College of Engineering', shortName: 'CENG', logo: '' },
    { id: 4, name: 'College of Nursing and Midwifery', shortName: 'CNM', logo: '' },
    { id: 5, name: 'College of Business, Accountancy, and Hospitality Management', shortName: 'CBAHM', logo: '' },
    { id: 6, name: 'College of Allied Medical Sciences', shortName: 'CAMS', logo: '' },
    { id: 7, name: 'College of Arts and Sciences', shortName: 'CAS', logo: '' },
  ]);
  const [showMenuIndex, setShowMenuIndex] = useState<number | null>(null);
  const [showAdminPopup, setShowAdminPopup] = useState<boolean>(false);
  const [showEditPopup, setEditPopup] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState<string>('');

  const [showCurriculum, setShowCurriculum] = useState<boolean>(false);

  const [newDepartment, setNewDepartment] = useState<Department | null>(null);
  const handleEdit = (department: Department) => {
    console.log('Edit:', department);
    setSelectedDepartment(department);
    setEditDepartmentName(department.name);
    setEditPopup(true);
  };

  const closeEditPopup = () => {
    setEditPopup(false);
  }

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

  const handleUpdateDepartment = () => {

  }

  const handleCreateDepartment = () => {

  }
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
                  
                <div className="bg-white w-20 h-10 rounded-full text-black flex items-center justify-center flex-wrap">{department.shortName}</div>
                  <span className="text-2xl pl-5 flex flex-nowrap">{department.name}</span>
                </div>
                <button onClick={() => toggleMenu(idx)} className="pr-5 text-4xl focus:outline-none relative z-10">&#x22EE;</button>
                {showMenuIndex === idx && (
                  <div className="absolute bg-gray-100 rounded-lg shadow-lg p-4 right-10 mr-3 top-0 mt-2 z-20">
                    <button onClick={() => handleEdit(department)} className="text-black block w-full text-left p-2 hover:bg-gray-300 rounded">Edit Department Details</button>
                    <button onClick={() => handleDelete(department)} className="text-black block w-full text-left p-2 hover:bg-gray-300 rounded">Delete Department</button>
                    <button className="text-black block w-full text-left p-2 hover:bg-gray-300 rounded">View Curriculum</button>  
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleCreateDepartment}
          className="bg-white p-4 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="depName" placeholder="Department Name..." className="p-2 rounded-lg border" />
          <input type="text" name="depAdmin" className="p-2 rounded-lg border" placeholder="Department Admin..."/>  
          <button className=" xd:row-start-3 sm:row-start-3  md:row-start-1 md:col-start-3 bg-blue-500 text-white p-2 rounded-lg">Upload Logo</button>

          <input type="text" name="depShortName" placeholder="Department Short Name..." className="p-2 rounded-lg border" />
          <input type="text" name="logo_img_path" placeholder="Test..." className="p-2 rounded-lg border" />
          <select className="p-2 rounded-lg border">
            <option>Assigned Rooms</option>
          </select>
          <button className="md:col-start-3 h-full bg-blue-500 text-white p-2 rounded-lg w-full">
            <Upload className="inline-block mr-2" />
            Add Curriculum
            </button> 
          <div className="flex justify-center col-start-2">
            <button type="submit" className="bg-green-500 text-white p-2 rounded-full pr-5 pl-5">Create Department</button>
          </div>
        </form>

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
        {showEditPopup && selectedDepartment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">Department Details</h2>
              <input type="text" value={editDepartmentName}
              onChange={(e)=> setEditDepartmentName(e.target.value)}
              className="p-2 border rounded-lg w-full mb-4" />
              <input type="text" placeholder={selectedDepartment.shortName} className="p-2 border rounded-lg w-full mb-4" />
              <button className="bg-blue-500 text-white p-2 rounded-lg">Upload Logo</button>
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={closeEditPopup} className="bg-green-500 text-white p-2 rounded-lg">Update</button>
                <button onClick={closeEditPopup} className="bg-gray-500 text-white p-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default DepartmentPage;
