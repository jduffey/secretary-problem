import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import { CategoryScale } from "chart.js/auto";

Chart.register(CategoryScale);

export const SimulationChart = ({ chartData }) => (
    <Bar
        data={chartData}
        options={{
            scales: {
                x: {
                    type: "category",
                    title: {
                        display: true,
                        text: "Stopping Point: The ratio of candidates interviewed before allowing a selection to be made.",
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Success Ratio: The ratio of simulations where the best candidate was selected.",
                    },
                    min: 0,
                    max: 0.5,
                    ticks: {
                        stepSize: 0.05,
                    },
                },
            },
        }}
    />
);
