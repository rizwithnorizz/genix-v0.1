import * as React from "react";
import { useRouter } from "next/router";
import Layout from "@/Components/ui/layout";
import { Button } from "@/Components/ui/button";

const StudentSearch = () => {
  const [section, setSection] = React.useState("");
  const router = useRouter();

  const handleSearch = () => {
    
    router.push("/GuestViewSchedule/schedule");
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold">Search for Your Section</h1>
        <input
          type="text"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          placeholder="Enter your section"
          className="px-4 py-2 border rounded"
        />
        <Button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded">
          Search
        </Button>
      </div>
    </Layout>
  );
};

export default StudentSearch;