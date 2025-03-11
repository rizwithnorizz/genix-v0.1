import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import Layout from "@/Components/ui/layout";
import AccountDropdown from "@/Components/ui/account-dropdown";

const scheduleData = [
  { time: "7:00-8:00", monday: "CC101", tuesday: "", wednesday: "CC102", thursday: "", friday: "", saturday: "" },
  { time: "8:00-9:00", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "" },
  { time: "9:00-10:00", monday: "HCI", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "" },
  { time: "11:00-12:00", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "" },
  { time: "1:00-2:00", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "" },
  { time: "2:00-3:00", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "" },
  { time: "4:00-5:00", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "" },
  { time: "5:00-6:00", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "" },
  { time: "7:00-8:00", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "" },
];

const Schedule1 = () => {
  return (
    <Layout>
      <Table>
        <TableCaption>Schedules</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Time</TableHead>
            <TableHead>M</TableHead>
            <TableHead>T</TableHead>
            <TableHead>W</TableHead>
            <TableHead>TH</TableHead>
            <TableHead>F</TableHead>
            <TableHead>S</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduleData.map((schedule, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{schedule.time}</TableCell>
              <TableCell>{schedule.monday}</TableCell>
              <TableCell>{schedule.tuesday}</TableCell>
              <TableCell>{schedule.wednesday}</TableCell>
              <TableCell>{schedule.thursday}</TableCell>
              <TableCell>{schedule.friday}</TableCell>
              <TableCell>{schedule.saturday}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
};

export default Schedule1;