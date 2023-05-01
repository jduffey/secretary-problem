import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import { CategoryScale } from "chart.js/auto";

Chart.register(CategoryScale);

const App = () => {
    const numCandidates = 100;
    const numSimulations = 1000;

    const [chartData, setChartData] = useState({});

    const calculateSuccessRatio = (stopFraction, currentSimulations, currentSuccessCount) => {
        const candidates = Array.from({ length: numCandidates }, () => Math.random());
        const stopIndex = Math.floor(numCandidates * stopFraction);

        const maxInFirstPhase = Math.max(...candidates.slice(0, stopIndex));
        const remainingCandidates = candidates.slice(stopIndex);

        const chosenCandidate = remainingCandidates.find((candidate) => candidate > maxInFirstPhase);
        const bestCandidate = Math.max(...candidates);

        if (chosenCandidate === bestCandidate) {
            currentSuccessCount++;
        }

        return currentSuccessCount / (currentSimulations + 1);
    };

    const [simulationCount, setSimulationCount] = useState(0);

    const prepareChartData = () => {
        const dataPoints = Array.from({ length: 101 }, (_, i) => i / 100);

        const newChartData = {
            labels: dataPoints,
            datasets: [
                {
                    label: "Success Ratio",
                    data: chartData.datasets ? chartData.datasets[0].data.slice() : new Array(101).fill(0),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 2,
                },
            ],
        };

        dataPoints.forEach((stopFraction, index) => {
            const currentSuccessCount = chartData.datasets ? chartData.datasets[0].data[index] * simulationCount : 0;
            newChartData.datasets[0].data[index] = calculateSuccessRatio(stopFraction, simulationCount, currentSuccessCount);
        });

        setChartData(newChartData);
        setSimulationCount(simulationCount + 1);
    };

    useEffect(() => {
        if (simulationCount < numSimulations) {
            const timer = setTimeout(() => {
                prepareChartData();
            }, 100); // Adjust the delay (100 ms) to your preference
            return () => clearTimeout(timer);
        }
    }, [simulationCount]);


    return (
        <Container>
            <h1>Secretary Problem Simulator</h1>
            {chartData.labels && chartData.datasets && (
                <Bar
                    data={chartData}
                    options={{
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
                                max: 1,
                            },
                        },
                    }}
                />
            )}
            <p>Simulations performed: {simulationCount}</p>
        </Container>
    );
};

export default App;
