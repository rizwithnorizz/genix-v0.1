import PrimaryButton from '@/Components/PrimaryButton';
import Layout from '@/Components/ui/layout';
import { Upload } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Department {
  id: number;
  department_full_name: string;
  department_short_name: string;
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
  const [departments, setDepartments] = useState<Department[]>([]);

  const [showMenuIndex, setShowMenuIndex] = useState<number | null>(null);
  const [showAdminPopup, setShowAdminPopup] = useState<boolean>(false);
  const [showEditPopup, setEditPopup] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState<string>('');
  const [showCurriculum, setShowCurriculum] = useState<boolean>(false);
  const [csrfToken, setCsrfToken] = useState<string>('');

  // Get CSRF token on component mount
  useEffect(() => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      setCsrfToken(token);
      // Set default header for all axios requests
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
  }, []);

  const handleEdit = (department: Department) => {
    console.log('Edit:', department);
    setSelectedDepartment(department);
    setEditDepartmentName(department.department_full_name);
    setEditPopup(true);
  };

  const closeEditPopup = () => {
    setEditPopup(false);
  };

  const handleDelete = (department: Department) => {
    console.log('Delete:', department);
    // Add delete functionality here
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
    // Add update functionality here
  };

  const handleCreateDepartment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    axios.post('/admin/create-department', formData)
      .then(response => {
        console.log('Department created successfully', response);
        form.reset();
      })
      .catch(error => {
        alert('Department Already exists. Please try again');
      });
  };

  const handleGetDepartments = () => {
    axios.get('/admin/get-departments')
      .then(response => {
        console.log('Fetched departments:', response.data.data);
        setDepartments(response.data.data);
        console.log('Departments:', departments);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      }); 
    }

  useEffect(() => {
    handleGetDepartments();
  }
  , []);


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
                  <div className="bg-white w-20 h-10 rounded-full text-black flex items-center justify-center flex-wrap">{department.department_short_name}</div>
                  <span className="text-2xl pl-5 flex flex-nowrap">{department.department_full_name}</span>
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
          <input type="hidden" name="_token" value={csrfToken} />
          
          <input type="text" name="depName" placeholder="Department Name..." className="p-2 rounded-lg border" required />
          <input type="text" name="depAdmin" className="p-2 rounded-lg border" placeholder="Department Admin..." />  
          <button type="button" className="md:row-start-1 md:col-start-3 bg-blue-500 text-white p-2 rounded-lg">Upload Logo</button>

          <input type="text" name="depShortName" placeholder="Department Short Name..." className="p-2 rounded-lg border" required />
          <input type="text" name="logo_img_path" placeholder="Logo Path..." className="p-2 rounded-lg border" />
          <select className="p-2 rounded-lg border">
            <option>Assigned Rooms</option>
          </select>
          <button type="button" className="md:col-start-3 h-full bg-blue-500 text-white p-2 rounded-lg w-full">
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
              <input 
                type="text" 
                value={editDepartmentName}
                onChange={(e) => setEditDepartmentName(e.target.value)}
                className="p-2 border rounded-lg w-full mb-4" 
              />
              <input 
                type="text" 
                placeholder={selectedDepartment.department_short_name} 
                className="p-2 border rounded-lg w-full mb-4" 
              />
              <button className="bg-blue-500 text-white p-2 rounded-lg">Upload Logo</button>
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={handleUpdateDepartment} className="bg-green-500 text-white p-2 rounded-lg">Update</button>
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