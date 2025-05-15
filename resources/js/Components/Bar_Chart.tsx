"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, TooltipProps, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { useEffect, useState } from "react";
import axios from "axios";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

export function Bar_Chart({ className = "" }) {
    interface ChartData { 
        version: string;
        count: number;
    }

    const [chartData, setChartData] = useState<ChartData[]>([]);
    //Modify
    const fetchData = async () => {
        try{
            const response = await axios.get('/api/feedback-to-versions');
            const data = response.data;
            const versions = Array.from(
            new Set([
                ...Object.keys(data.data),
            ])
            );

            const processedData = versions.map((version) => {
            const countData = data.data[version]?.length || 0;

            return {
                version: version, 
                count: countData
            };
            });
            setChartData(processedData);
        }catch(error){
            console.error("Error fetching data:", error);
        }
        

    }

    useEffect(() => { 
        fetchData();
    }, [])
    const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            const { version, count } = payload[0].payload;
            return (
                <div className="custom-tooltip bg-white p-2 rounded shadow">
                    <p className="label font-bold">{version}</p>
                    <p className="intro">{`Count: ${count}`}</p>
                </div>
            );
        }
        return null;
    };
    return (
        <ChartContainer config={chartConfig} className={`${className}`}>
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="version"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value}
                />
                <ChartTooltip
                    cursor={false}
                    content={<CustomTooltip />}
                />
                <Bar dataKey="count" fill="var(--color-desktop)" radius={8}/>
            </BarChart>
        </ChartContainer>
    );
}
