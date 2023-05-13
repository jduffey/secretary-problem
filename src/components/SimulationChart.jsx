import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import { CategoryScale } from "chart.js/auto";

Chart.register(CategoryScale);

export const SimulationChart = ({ data, backgroundColor, numStoppingPoints }) => {
    console.log("SimulationChart: data", data);
    console.log("SimulationChart: backgroundColor", backgroundColor);

    const stoppingPoints = Array.from({ length: numStoppingPoints }, (_, i) => i / numStoppingPoints);

    const chartData = {
        labels: stoppingPoints.map(e => e.toFixed(3)),
        datasets: [
            {
                label: "Success Ratios",
                barPercentage: 1.0,
                categoryPercentage: 1.0,
                data: data,
                backgroundColor: backgroundColor
            },
        ],
    };

    return (
        <Bar
            data={chartData}
            options={{
                aspectRatio: 3,
                scales: {
                    x: {
                        type: "category",
                        title: {
                            display: true,
                            text: "Stopping Point",
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Success Ratio",
                        },
                        min: 0,
                        max: 0.5,
                        ticks: {
                            stepSize: 0.05,
                        },
                    },
                },
                animation: {
                    duration: 0,
                },
            }}
        />
    );
};
