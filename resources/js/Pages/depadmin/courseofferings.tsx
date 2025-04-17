import React, { useEffect, useState } from 'react';
import Layout from '@/Components/ui/layout';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';
import { Upload } from 'lucide-react';

interface Curriculum { 
  id: number;
  department_short_name: string;
  curriculum_name: string;
  program_name: string;
  program_short_name: string;
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
  name: string;
  program_short_name: string;
  subject_code: string;
  semester: string;
  year_level: number;
  lec: number;
  lab: number;
}

interface Subject {
  name: string;
  prof_sub: boolean;
  room_req: number;
  lec: number;
  lab: number;
  semester:  string;
  subject_code: string;
  year_level: number;
}


interface uploadedCurriculum {
  curriculum_name: string;
  department_short_name: string;
  program_name: string;
  program_short_name: string;
  subjects: Subject[];
}
const CourseOfferingsPage: React.FC = () => {
  {/* navigation */}
  const toggleSectionMenu = (sectionId: number) => {
    setOpenSectionMenu(openSectionMenu === sectionId ? null : sectionId);
  };
  const [openSectionMenu, setOpenSectionMenu] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'Course Offerings' | 'Sections'>('Course Offerings');
  const handleSwitchTabs = (tabName: string) => {
    setOpenSectionMenu(null);
    if (tabName == 'Course Offerings'){
      setActiveTab('Course Offerings');
    } else {
      setActiveTab('Sections');
      fetchSections();
    }
  }
  {/* navigation */}

  {/*curriculum pop up*/}
  const [showCurriculumCourses, setShowCurriculumCourses] = useState<boolean>(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const handleShowCurriculumCourses = (curriculum: Curriculum) => {
    setSelectedCurriculum(curriculum);
    setShowCurriculumCourses(true);
    fetchCourseSubjects(curriculum);
  }

  const handleCloseCurriculum = () => {
    setSelectedCurriculum(null);
    setShowCurriculumCourses(false);
    setCourseSubjects([]);
    
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

  {/*course subjects api*/}
  const [courseSubjects, setCourseSubjects] = useState<CourseSubject[]>([]);
  const fetchCourseSubjects = async (request : Curriculum) => {
    try {
      const response = await axios.post('/api/course-subject', {
        program_short_name: request.program_short_name,
        curriculum_name: request.curriculum_name,
      });
      setCourseSubjects(response.data.data);
      console.log("Course Subjects: ", response.data.data);
    } catch (error) {
      console.error('Error fetching course subjects:', error);
    }
  };
  const [selectedYearLevel, setSelectedYearLevel] = useState<string>('Year Level');
  const [selectedSemester, setSelectedSemester] = useState<string>('First Semester');
  {/*course subjects api*/}

  {/*add curriculum pop up*/}
  const [showAddCurriculum, setShowAddCurriculum] = useState<boolean>(false);
  const handleToggleCurriculumPopup = () => {
    setShowAddCurriculum(!showAddCurriculum);
    setCurriculumUploaded(null);
    setUploadSuccess(false);
  }


  const handleCreateCurriculum = (curriculum: uploadedCurriculum) => {
    try{
      const response = axios.post('/api/curriculum/create', curriculum);
      console.log("Curriculum added: ", response); 
      handleToggleCurriculumPopup();
    }catch(error){
      console.error('Error adding curriculum:', error);
    }


  }

  useEffect(() => { 
    fetchCurriculum();
    fetchSections();
    if(curriculumUploaded){
      console.log("curriculum uploaded: ", curriculumUploaded);
      setCurrProgramName(curriculumUploaded?.program_name);
      setCurrName(curriculumUploaded?.curriculum_name);
    } else {
      console.log("to be fetched");
    }
  }
  , []);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const [curriculumUploaded, setCurriculumUploaded] = useState<uploadedCurriculum | null>(null);
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!uploadedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('curriculum_file', uploadedFile);

    try {
      const response = await axios.post('/api/curriculum/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Upload response:", response.data.data.curriculum);
      setCurriculumUploaded(response.data.data.curriculum);
      if (curriculumUploaded){
        setCurrProgramName(curriculumUploaded.program_name);
        setCurrName(curriculumUploaded.curriculum_name);
      }
      setUploadSuccess(true);
      setUploadedFile(null);
    
    } catch (error) {
      console.error('Error uploading curriculum:', error);
      setUploadError("Failed to upload curriculum. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  const [editCurriculumProgramName, setCurrProgramName] = useState<string | undefined>('');
  const [editCurriculumName, setCurrName] = useState<string | undefined>('');
  const handleEditCurriculumProgramName = (e: string) => {
    if (curriculumUploaded){
      setCurrProgramName(e);
      setCurriculumUploaded({
        ...curriculumUploaded,
        program_name: editCurriculumProgramName || '',
      });
    }
  }
  const handleEditCurrName = (e: string) => {
    if (curriculumUploaded){
      setCurrName(e);
      setCurriculumUploaded({
        ...curriculumUploaded,
        curriculum_name: editCurriculumName || '',
      });
    }
  }

  {/*add section pop up*/}
  const [sectionName, setSectionName] = useState<string>('');
  const [addSectionPopup, setAddSectionPopup] = useState<boolean>(false);
  const handleAddSection = () => {
    setAddSectionPopup(!addSectionPopup);
    try{
      const yearLevelMap: { [key: string]: number } = {
        'First Year': 1,
        'Second Year': 2,
        'Third Year': 3,
        'Fourth Year': 4,
      };
      const response = axios.post('/api/section/create', {
        section_name: sectionName, 
        program_short_name: selectedCurriculum?.program_short_name,
        curriculum_name: selectedCurriculum?.curriculum_name,
        year_level: yearLevelMap[yearLevelCourse],
      });
    }catch(error){
      console.log("Error in creating section: ", error);
    }
  }

  const handleSelectCurriculum = (request: Curriculum) => {
    setSelectedCurriculum(request);
    fetchCourseSubjects(request);
    console.log('curriculum set success');
  }
  const handleToggleAddSection = () => {
    setAddSectionPopup(!addSectionPopup);
    setSelectedCurriculum(null);
    setCourseSubjects([]);
    setYearLevelCourse('Year Level');
    setSelectedSemester('First Semester');
    setSectionName('');
  }
  const [yearLevelCourse, setYearLevelCourse] = useState<string>('Year Level');
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
              <div className="flex justify-between mb-4">
                <input 
                  className="border border-gray-300 rounded-lg p-2 w-1/3" 
                  type="text" 
                  placeholder="Search curriculum..." 
                />
                <PrimaryButton 
                  onClick={handleToggleCurriculumPopup}
                  className="bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg"
                >
                  New Curriculum
                </PrimaryButton>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curriculum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {curriculum.map((curr) => (
                      <tr key={curr.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {curr.curriculum_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {curr.program_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {curr.department_short_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleShowCurriculumCourses(curr)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Curriculum
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {showCurriculumCourses && selectedCurriculum && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl shadow-full">
                  <h2 className="text-2xl font-semibold mb-4">{selectedCurriculum.program_name}</h2>
                  <h2 className="text-2xl font-semibold mb-4">{selectedCurriculum.curriculum_name}</h2>

                  <h1 className="text-xl font-semibold mt-10">Subjects</h1>
                  <div className="grid grid-cols-2 gap-4 mb-4 justify-end">
                    <div className="w-1/2">
                    </div>
                    <div className="col-span-2">
                      <button value="First Year" onClick={() => setSelectedYearLevel('First Year')} 
                      className={`px-4 py-2 ${selectedYearLevel === 'First Year' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>
                        First Year
                      </button>
                      <button value="Second Year" onClick={() => setSelectedYearLevel('Second Year')} 
                      className={`px-4 py-2 ${selectedYearLevel === 'Second Year' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>
                        Second Year
                      </button>
                      <button value="Third Year" onClick={() => setSelectedYearLevel('Third Year')} 
                      className={`px-4 py-2 ${selectedYearLevel === 'Third Year' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>
                        Third Year
                      </button>
                      <button value="Fourth Year" onClick={() => setSelectedYearLevel('Fourth Year')} 
                      className={`px-4 py-2 ${selectedYearLevel === 'Fourth Year' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>
                        Fourth Year
                      </button>
                      <select
                        key="semester"
                        className=" appearance-none bg-gray-200 rounded-lg w-1/4.5"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                      >
                        <option>First Semester</option>
                        <option>Second Semester</option>
                        <option>Summer</option>
                      </select>
                    </div>

                  </div>
    
                  <h3 className="font-semibold mb-2">Subjects</h3>
                  <div className="bg-gray-200 p-3 rounded-lg max-h-64 overflow-y-auto">
                    {courseSubjects
                      .filter((subject) => {
                        const yearLevelMap: { [key: string]: number } = {
                          'First Year': 1,
                          'Second Year': 2,
                          'Third Year': 3,
                          'Fourth Year': 4,
                        };
                        const semesterMap: { [key: string]: string } = {
                          'First Semester': '1st',
                          'Second Semester': '2nd',
                          'Summer': 'summer',
                        };

                        return (
                          subject.year_level === yearLevelMap[selectedYearLevel] &&
                          subject.semester === semesterMap[selectedSemester]
                        );
                      })
                      .map((subject) => (
                        <div key={subject.id}
                        className="bg-gray-700 text-white p-3 rounded-full mb-2 grid grid-cols-4">
                          <label className="text-xl font-bold flex items-center justify-center">
                            {subject.subject_code}
                          </label>
                          <label className ="p-4 truncate overflow-hidden whitespace-nowrap col-span-1">
                            {subject.name}
                          </label>
                          <label className ="p-4">
                            Lec Hr: {subject.lec}
                          </label>
                          <label className ="p-4">
                            Lab Hr: {subject.lab}
                          </label>
                        </div>  
                      ))}
                  </div>
    
                  <div className="flex justify-start space-x-2 mt-4">
                    <button 
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                      onClick={handleCloseCurriculum}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
          )}
          {/*adding curriculum pop up*/}
          {showAddCurriculum && (
            curriculumUploaded && editCurriculumName && editCurriculumProgramName ? (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl shadow-full">
                  <input
                    className="text-2xl font-semibold mb-4 border border-gray-300 rounded-lg p-2 w-full"
                    value={editCurriculumProgramName}
                    onChange={(e) => handleEditCurriculumProgramName(e.target.value)} 
                  />
                  <input
                    className="text-2xl font-semibold mb-4 border border-gray-300 rounded-lg p-2 w-full"
                    value={editCurriculumName}
                    onChange={(e) => handleEditCurrName(e.target.value)}
                  />

                  <h1 className="text-xl font-semibold mt-10">Subjects</h1>
                  <div className="grid grid-cols-2 gap-4 mb-4 justify-end">
                    <div className="w-1/2">
                    </div>
                    <div className="col-span-2">
                      <button value="First Year" onClick={() => setSelectedYearLevel('First Year')} 
                      className={`px-4 py-2 ${selectedYearLevel === 'First Year' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>
                        First Year
                      </button>
                      <button value="Second Year" onClick={() => setSelectedYearLevel('Second Year')} 
                      className={`px-4 py-2 ${selectedYearLevel === 'Second Year' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>
                        Second Year
                      </button>
                      <button value="Third Year" onClick={() => setSelectedYearLevel('Third Year')} 
                      className={`px-4 py-2 ${selectedYearLevel === 'Third Year' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>
                        Third Year
                      </button>
                      <button value="Fourth Year" onClick={() => setSelectedYearLevel('Fourth Year')} 
                      className={`px-4 py-2 ${selectedYearLevel === 'Fourth Year' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>
                        Fourth Year
                      </button>
                      <select
                        key="semester"
                        className=" appearance-none bg-gray-200 rounded-lg w-1/4.5"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                      >
                        <option>First Semester</option>
                        <option>Second Semester</option>
                        <option>Summer</option>
                      </select>
                    </div>

                  </div>
    
                  <h3 className="font-semibold mb-2">Subjects</h3>
                  <div className="bg-gray-200 p-3 rounded-lg max-h-64 overflow-y-auto">
                    {curriculumUploaded?.subjects && curriculumUploaded.subjects
                      .filter((subject) => {
                        const yearLevelMap: { [key: string]: number } = {
                          'First Year': 1,
                          'Second Year': 2,
                          'Third Year': 3,
                          'Fourth Year': 4,
                        };
                        const semesterMap: { [key: string]: string } = {
                          'First Semester': '1st',
                          'Second Semester': '2nd',
                          'Summer': 'summer',
                        };

                        return (
                          subject.year_level === yearLevelMap[selectedYearLevel] &&
                          subject.semester === semesterMap[selectedSemester]
                        );
                      })
                      .map((subject) => (
                        <div key={subject.subject_code}
                        className="bg-gray-700 text-white p-3 rounded-full mb-2 grid grid-cols-4">
                          <label className="text-xl font-bold flex items-center justify-center">
                            {subject.subject_code}
                          </label>
                          <label className ="p-4 truncate overflow-hidden whitespace-nowrap col-span-1">
                            {subject.name}
                          </label>
                          <label className ="p-4">
                            Lec Hr: {subject.lec}
                          </label>
                          <label className ="p-4">
                            Lab Hr: {subject.lab}
                          </label>
                        </div>  
                      ))}
                  </div>
    
                  <div className="flex justify-between space-x-2 mt-4">
                    <button 
                      className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                      onClick={() => handleCreateCurriculum(curriculumUploaded)}
                    >
                      Add Curriculum
                      
                    </button>
                      <button 
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                      onClick={handleToggleCurriculumPopup}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
              <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl">
                <h2 className="text-2xl font-semibold mb-4">Add Curriculum</h2>
                
                <div className="flex flex-col items-center justify-center mb-4">
                  <label 
                    className={`bg-blue-500 hover:bg-blue-400 h-[200px] w-[350px] rounded-lg flex flex-col items-center justify-center text-white font-semibold mb-4 cursor-pointer transition-all ${uploadedFile ? 'bg-green-500 hover:bg-green-400' : ''}`}
                  >
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange} 
                      accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
                    />
                    <Upload size={48} />
                    {uploadedFile ? (
                      <span className="mt-2">{uploadedFile.name}</span>
                    ) : (
                      <span className="mt-2">Upload Curriculum</span>
                    )}
                  </label>
                  
                  {uploadError && (
                    <p className="text-red-500 text-sm mt-1">{uploadError}</p>
                  )}
                  
                  {uploadSuccess && (
                    <p className="text-green-500 text-sm mt-1">Upload successful!</p>
                  )}
                </div>
                
                <div className="flex justify-center items-center">
                  <PrimaryButton
                    className="bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg disabled:bg-red"
                    onClick={handleFileUpload}
                    disabled={isUploading || !uploadedFile}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Curriculum'}
                  </PrimaryButton>
                </div>
                
                <div>
                </div>
                <button 
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                      onClick={handleToggleCurriculumPopup}
                    >
                      Close
                </button>
              </div>
            </div>
          ))}
          {/* Sections Tab */}
          {activeTab === 'Sections' && (
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <div className="flex justify-start gap-5 mb-4">
                <input 
                  className="border border-gray-300 rounded-lg p-2 w-1/4" 
                  type="text" 
                  placeholder="Search section..." 
                />
                <select 
                  className="border border-gray-300 rounded-lg p-2 w-1/4"
                  value={selectedYearLevel}
                  onChange={(e) => setSelectedYearLevel(e.target.value)}
                >
                  <option value="">All Year Levels</option>
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Fourth Year">Fourth Year</option>
                </select>
                <select
                  className="border border-gray-300 rounded-lg p-2 w-1/4"
                  onChange={(e) => setSelectedCurriculum(curriculum.find(curr => curr.program_short_name === e.target.value) || null)}
                >
                  <option value="">All Programs</option>
                  {curriculum
                    .filter((curr, index, self) =>
                      self.findIndex(item => item.program_short_name === curr.program_short_name) === index
                    )
                    .map((curr) => (
                      <option key={curr.id} value={curr.program_short_name}>
                        {curr.program_short_name}
                      </option>
                    ))}
                </select>
                <button 
                  onClick={handleToggleAddSection} 
                  className="ml-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Add Section
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sections
                      .filter((section) => {
                        const yearLevelMap: { [key: string]: number } = {
                          'First Year': 1,
                          'Second Year': 2,
                          'Third Year': 3,
                          'Fourth Year': 4,
                        };

                        if (selectedYearLevel == 'Year Level' && selectedCurriculum === null) {
                          return true;
                        }
                        return (
                          (!selectedCurriculum || section.program_short_name === selectedCurriculum?.program_short_name) &&
                          (!selectedYearLevel || section.year_level === yearLevelMap[selectedYearLevel])
                        );
                      })
                      .map((section) => (
                        <tr key={section.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {section.section_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {section.program_short_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {section.year_level}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button 
                              onClick={() => toggleSectionMenu(section.id)} 
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>
                            {openSectionMenu === section.id && (
                              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                  <button 
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    View Details
                                  </button>
                                  <button 
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        {addSectionPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Section</h2>
              </div>
              <div className="relative mb-4">
                <input 
                    type="text" 
                    placeholder="Section Name" 
                    value={sectionName}
                    onChange={(e)=>setSectionName(e.target.value)}
                    className="p-3 bg-gray-200 rounded-lg mb-4 w-full"
                  />
                <select 
                  onChange={(e) => {
                    const selectedCurriculum = curriculum.find(curr => curr.curriculum_name === e.target.value);
                    if (selectedCurriculum) {
                      handleSelectCurriculum(selectedCurriculum);
                    }
                  }}
                  className="appearance-none bg-gray-200 p-3 rounded-lg w-full">
                  <option>Curriculum</option>
                  {curriculum
                  .map((curriculum, idx) => (
                    <option key={idx} value={curriculum.curriculum_name}>
                      {curriculum.curriculum_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 justify-end">
                  <select onChange={(e) => setYearLevelCourse(e.target.value)}
                    className="appearance-none bg-gray-200 rounded-lg">
                    <option>Year Level</option>
                    <option value="First Year">
                        First Year
                    </option>
                    <option value="Second Year">
                        Second Year
                    </option>
                    <option value="Third Year">
                        Third Year
                    </option>
                    <option value="Fourth Year">
                        Fourth Year
                    </option>
                  </select>
                  <select
                    key="semester"
                    className="appearance-none bg-gray-200 rounded-lg"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                  >
                    <option>First Semester</option>
                    <option>Second Semester</option>
                    <option>Summer</option>
                  </select>
              </div>
              <h3 className="font-semibold mb-2">Subjects</h3>
              <div className="bg-gray-200 p-3 rounded-lg max-h-48 overflow-y-auto mb-4">
                {courseSubjects
                  .filter((subject) => {
                    const yearLevelMap: { [key: string]: number } = {
                      'First Year': 1,
                      'Second Year': 2,
                      'Third Year': 3,
                      'Fourth Year': 4,
                    };
                    const semesterMap: { [key: string]: string } = {
                      'First Semester': '1st',
                      'Second Semester': '2nd',
                      'Summer': 'summer',
                    };

                    return (
                      subject.year_level === yearLevelMap[yearLevelCourse] &&
                      subject.semester === semesterMap[selectedSemester]
                    );
                  })
                  .map((subject, idx) => (
                    <div key={idx}
                    className="bg-gray-700 text-white p-3 rounded-full mb-2 grid grid-cols-4">
                      <label className="text-xl font-bold flex items-center justify-center">
                        {subject.subject_code}
                      </label>
                      <label className ="p-4 truncate overflow-hidden whitespace-nowrap col-span-1">
                        {subject.name}
                      </label>
                      <label className ="p-4">
                        Lec Hr: {subject.lec}
                      </label>
                      <label className ="p-4">
                        Lab Hr: {subject.lab}
                      </label>
                    </div>  
                  ))}
              </div>

              
              <div className="flex justify-end space-x-2">
                <button 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={handleAddSection}
                >
                  Add Section
                </button>
                <button 
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                 onClick={handleToggleAddSection}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) }
        
      </main>
    </Layout>
  );
};

export default CourseOfferingsPage;