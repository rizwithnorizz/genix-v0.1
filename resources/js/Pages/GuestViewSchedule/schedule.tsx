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
          <TableRow>
            <TableCell className="font-medium">7:00-8:00</TableCell>
            <TableCell>CC101</TableCell>
            <TableCell></TableCell>
            <TableCell>CC102</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">8:00-9:00</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">9:00-10:00</TableCell>
            <TableCell>HCI</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">11:00-12:00</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">1:00-2:00</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">2:00-3:00</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">4:00-5:00</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">5:00-6:00</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">7:00-8:00</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Layout>
  );
};

export default Schedule1;