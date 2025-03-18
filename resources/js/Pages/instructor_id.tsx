import * as React from "react";
import { useRouter } from "next/router";
import Layout from "@/Components/ui/layout";
import { Button } from "@/Components/ui/button";

const InstructorID = () => {
  const [instructorID, setInstructorID] = React.useState("");
  const router = useRouter();

  const handleSubmit = () => {
    
    router.push("/GuestViewSchedule/schedule");
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold">Enter Your Instructor ID</h1>
        <input
          type="text"
          value={instructorID}
          onChange={(e) => setInstructorID(e.target.value)}
          placeholder="Enter your instructor ID"
          className="px-4 py-2 border rounded"
        />
        <Button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">
          Submit
        </Button>
      </div>
    </Layout>
  );
};

export default InstructorID;