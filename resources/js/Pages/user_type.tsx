import * as React from "react";
import { useRouter } from "next/router";
import Layout from "@/Components/ui/layout";
import { Button } from "@/Components/ui/button";

const UserType = () => {
  const router = useRouter();

  const handleStudentClick = () => {
    router.push("/student_search");
  };

  const handleInstructorClick = () => {
    router.push("/instructor_id");
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold">Select Your User Type</h1>
        <div className="flex space-x-4">
          <Button onClick={handleStudentClick} className="px-4 py-2 bg-blue-500 text-white rounded">
            Student
          </Button>
          <Button onClick={handleInstructorClick} className="px-4 py-2 bg-green-500 text-white rounded">
            Instructor
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default UserType;