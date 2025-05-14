"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart"
import { useEffect, useState } from "react";
import axios from "axios";

const chartConfig = {
  approval: {
    label: "Approval Rate",
    color: "hsl(var(--chart-3))",
  },
  feedback: {
    label: "Feedback Rate",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Chart({
    className = '',
}) {
    interface ChartData {
      day: string;
      approval: number;
      feedback: number;
    }
    
    const [chartData, setChartData] = useState<ChartData[]>([]);
    useEffect(() => {
   
    async function fetchData() {
      try {
        const response = await axios.get("/api/feedback-to-approval"); 
        const data = response.data; 
        const allDates = Array.from(
        new Set([
            ...Object.keys(data.waiting_feedback),
            ...Object.keys(data.approved_feedback),
        ])
        );

        // Process the data for the chart
        const processedData = allDates.map((date) => {
        const waitingCount = data.waiting_feedback[date]?.length || 0;
        const approvedCount = data.approved_feedback[date]?.length || 0;

        return {
            day: date.split(" ")[0], 
            approval: approvedCount,
            feedback: waitingCount,
        };
        });

        console.log("Processed Data:", processedData);
        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    }

    fetchData();
  }, []);
  return (
        <ChartContainer config={chartConfig} className={`${className}`}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
                top: 20,
                bottom: 20,
                left: 40,
                right: 20,
            }}
            >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="approval"
              type="monotone"
              stroke={chartConfig.approval.color}
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey="feedback"
              type="monotone"
              stroke={chartConfig.feedback.color}
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
  )
}
