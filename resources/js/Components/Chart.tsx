"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart"
const chartData = [
  { month: "January", approval: 186, feedback: 80 },
  { month: "February", approval: 305, feedback: 200 },
  { month: "March", approval: 237, feedback: 120 },
  { month: "April", approval: 73, feedback: 190 },
  { month: "May", approval: 209, feedback: 130 },
  { month: "June", approval: 214, feedback: 140 },
]

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
  return (
        <ChartContainer config={chartConfig} className={`${className}`}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
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
