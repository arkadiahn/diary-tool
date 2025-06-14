"use client";

import { Spinner } from "@heroui/react";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

interface CustomChartProps {
    title: string;
    data: number[];
    dates: number[];
    labels: { title: string; date: number }[];
    yaxis?: {
        min?: number;
        max?: number;
        tickAmount?: number;
    };
    color: string;
    tooltiptext: string;
    yaxistext?: string;
}

const Chart = dynamic(() => import("react-apexcharts"), {
    loading: () => (
        <div className="flex justify-center items-center h-full">
            <Spinner color="primary" />
        </div>
    ),
    ssr: false,
});

export default function CustomChart({
    title,
    data,
    dates,
    labels = [],
    yaxis = {},
    color,
    tooltiptext,
    yaxistext = "",
}: CustomChartProps) {
    const defaultYAxis = {
        min: 0,
        max: 100,
        tickAmount: 5,
    };

    const options: ApexOptions = {
        colors: [color],
        chart: {
            type: "line",
            toolbar: {
                show: false,
            },
            animations: {
                enabled: false,
            },
            zoom: {
                enabled: false,
            },
        },
        stroke: {
            curve: "straight",
            width: 5,
        },
        xaxis: {
            type: "datetime",
            categories: dates,
            labels: {
                style: {
                    colors: "#666",
                },
            },
        },
        yaxis: {
            ...defaultYAxis,
            ...yaxis,
            title: {
                text: title,
            },
            labels: {
                formatter: (value: number) => `${value}${yaxistext}`,
            },
        },
        markers: {
            size: 6,
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 8,
            },
        },
        annotations: {
            xaxis: labels.map((label) => ({
                x: label.date,
                strokeDashArray: 2,
                borderColor: "#FF4E4E",
                label: {
                    borderColor: "#FF4E4E",
                    style: {
                        color: "#fff",
                        background: "#FF4E4E",
                    },
                    text: label.title,
                    position: "top",
                    orientation: "horizontal",
                    offsetY: -15,
                },
            })),
        },
        tooltip: {
            theme: "dark",
            shared: true,
            intersect: false,
            style: {
                fontSize: "12px",
            },
            marker: {
                show: true,
            },
            y: {
                formatter: (value: number) => `${value}${tooltiptext}`,
            },
        },
    };

    return <Chart options={options} series={[{ name: title, data: data }]} type="line" height="100%" />;
}
