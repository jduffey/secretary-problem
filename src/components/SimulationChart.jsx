import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import { CategoryScale } from "chart.js/auto";

Chart.register(CategoryScale);

export const SimulationChart = ({ numCandidates, successCounts, simulationCount, backgroundColor }) => {
    const labels = Array.from({ length: numCandidates }, (_, i) => (i / numCandidates).toFixed(3));
    const data = successCounts.map(count => count / simulationCount);

    const chartData = {
        labels,
        datasets: [{
            label: `Success ratios with ${numCandidates.toLocaleString()} Candidates`,
            data,
            backgroundColor,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
        }],
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
