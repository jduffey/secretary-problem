import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import { CategoryScale } from "chart.js/auto";

Chart.register(CategoryScale);

export const SimulationChart = ({ chartData }) => (
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
