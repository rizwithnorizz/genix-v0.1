import Chart2 from '@/Components/ui/chart2';
import  Layout  from '@/Components/ui/layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/Components/ui/table";

const data = [
  { department: "CICT", yearLevel: "1", program: "BSIT", building: "Building A" },
  { department: "CAS", yearLevel: "2", program: "BS Psychology", building: "Building B" },
  { department: "CENG", yearLevel: "3", program: "BS Civil Engineering", building: "Building C" },
  { department: "CTHM", yearLevel: "4", program: "BS Hospitality Management", building: "Building D" },
  // Add more rows as needed
];
const Dashboard = () => {
  return (
    <Layout>
      <div className="flex items-end justify-between mb-7">
        <h1 className="text 3xl font-bold">Pogi si Jud 8===D</h1>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="order-2 lg:order-1 border p-2 rounded-lg"> 
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Avatar className="h-16 w-16 rounded-full">
              <AvatarImage src="/path/to/avatar1.jpg" alt="CICT" />
              <AvatarFallback>CICT</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16 rounded-full">
              <AvatarImage src="/path/to/avatar2.jpg" alt="CAS" />
              <AvatarFallback>CAS</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16 rounded-full">
              <AvatarImage src="/path/to/avatar3.jpg" alt="CENG" />
              <AvatarFallback>CENG</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16 rounded-full">
              <AvatarImage src="/path/to/avatar4.jpg" alt="CTHM" />
              <AvatarFallback>CTHM</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16 rounded-full">
              <AvatarImage src="/path/to/avatar4.jpg" alt="CEDU" />
              <AvatarFallback>CEDU</AvatarFallback>
            </Avatar><Avatar className="h-16 w-16 rounded-full">
              <AvatarImage src="/path/to/avatar4.jpg" alt="CAMS" />
              <AvatarFallback>CAMS</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16 rounded-full">
              <AvatarImage src="/path/to/avatar4.jpg" alt="CBA" />
              <AvatarFallback>CBA</AvatarFallback>
            </Avatar><Avatar className="h-16 w-16 rounded-full">
              <AvatarImage src="/path/to/avatar4.jpg" alt="CCJE" />
              <AvatarFallback>CCJE</AvatarFallback>
            </Avatar><Avatar className="h-16 w-16 rounded-full">
              <AvatarImage src="/path/to/avatar4.jpg" alt="CIT" />
              <AvatarFallback>CIT</AvatarFallback>
            </Avatar><Avatar className="h-16 w-16 rounded-full">
              <AvatarImage src="/path/to/avatar4.jpg" alt="DE" />
              <AvatarFallback>DE</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16 rounded-full">
              <AvatarImage src="/path/to/avatar4.jpg" alt="ETEEAP" />
              <AvatarFallback>ETEEAP</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-center mt-4">
            <Button>View All Departments</Button>
        </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Chart2  />
      </div>
  <div className="order-1 lg:order-2 border p-2 rounded-lg">   
  <Table>
    <TableCaption>Pending for Approval</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Department</TableHead>
        <TableHead>Year Level</TableHead>
        <TableHead>Program</TableHead>
        <TableHead>Building</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((row, index) => (
        <TableRow key={index}>
          <TableCell>{row.department}</TableCell>
          <TableCell>{row.yearLevel}</TableCell>
          <TableCell>{row.program}</TableCell>
          <TableCell>{row.building}</TableCell>
        </TableRow>
      ))}
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colSpan={4}>Total Departments: {data.length}</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
</div>
    </Layout>
  );
};

export default Dashboard;
