import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table';

const data = [
    { department: "CICT", yearLevel: "1", program: "BS Information Technology", building: "Building A" },
    { department: "CAS", yearLevel: "2", program: "BS Psychology", building: "Building B" },
    { department: "CENG", yearLevel: "3", program: "BS Civil Engineering", building: "Building C" },
    { department: "CTHM", yearLevel: "4", program: "BS Hospitality Management", building: "Building D" },
];

const pendings = () => {
  return (
    <div className="rounded-xl border-2 bg-card text-card-foreground shadow absolute sm:w-[700px] md:w-[800px] lg:w-[1165px] left-5 bottom-32">   
        <Table>
        <TableCaption className='caption-top text-lg font-bold text-center'>Pending for Approval
        </TableCaption>
            <TableHeader>
            <TableRow>
                <TableHead className="text-center text-bold">Department</TableHead>
                <TableHead className="text-center text-bold">Year Level</TableHead>
                <TableHead className="text-center text-bold">Program</TableHead>
                <TableHead className="text-center text-bold">Building</TableHead>
            </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                        <TableCell className="text-center">{row.department}</TableCell>
                        <TableCell className="text-center">{row.yearLevel}</TableCell>
                        <TableCell className="text-center">{row.program}</TableCell>
                        <TableCell className="text-center">{row.building}</TableCell>
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
  )
}

export default pendings