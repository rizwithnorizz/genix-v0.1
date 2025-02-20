import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,   
  CardTitle,
} from "@/Components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart"
const chartData = [
  { browser: "1st Years", students: 275, fill: "var(--color-1st Years)" },
  { browser: "2nd Years", students: 200, fill: "var(--color-2nd Years)" },
  { browser: "3rd Years", students: 287, fill: "var(--color-3rd Years)" },
  { browser: "4th Years", students: 173, fill: "var(--color-4th Years)" },
  { browser: "5th Years", students: 190, fill: "var(--color-5th Years)" },
]

const chartConfig = {
  students: {
    label: "Students",
  },
  FirstYears: {
    label: "1st Years",
    color: "hsl(var(--chart-1))",
  },
  SecordYears: {
    label: "2nd Years",
    color: "hsl(var(--chart-2))",
  },
  ThirdYears: {
    label: "3rd Years",
    color: "hsl(var(--chart-3))",
  },
  FourthYears: {
    label: "4th Years",
    color: "hsl(var(--chart-4))",
  },
  FifthYears: {
    label: "5th Years",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function Chart2() {
  const totalStudents = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.students, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Room Occupation Rate</CardTitle>
        <CardDescription>Percentage of Rooms Occupied</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="students"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalStudents.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Students
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
        Showing total number of Students <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
