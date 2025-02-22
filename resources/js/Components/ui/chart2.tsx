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
  { browser: "H Building", rooms: 30, fill: "var(--color-H Building)" },
  { browser: "E Building", rooms: 40, fill: "var(--color-E Building)" },
  { browser: "G Building", rooms: 25, fill: "var(--color-G Building)" },
  { browser: "I Building", rooms: 55, fill: "var(--color-I Building)" },
  { browser: "B Building", rooms: 20, fill: "var(--color-B Building)" },
]

const chartConfig = {
  rooms: {
    label: "Buildings",
  },
  HBuilding: {
    label: "H Building",
    color: "hsl(var(--chart-1))",
  },
  EBuilding: {
    label: "E Building",
    color: "hsl(var(--chart-2))",
  },
  GBuilding: {
    label: "G Building",
    color: "hsl(var(--chart-3))",
  },
  IBuilding: {
    label: "I Building",
    color: "hsl(var(--chart-4))",
  },
  BBuilding: {
    label: "B Building",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function Chart2() {
  const totalrooms = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.rooms, 0)
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
              dataKey="rooms"
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
                          {totalrooms.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Rooms
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
      <CardFooter className="flex-col text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
        Showing total number of Rooms <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
