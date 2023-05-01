import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js";
import { CategoryScale } from "chart.js/auto";

Chart.register(CategoryScale);

const App = () => {
    const numCandidates = 100;
    const numSimulations = 1000;

    const [chartData, setChartData] = useState({});

    const calculateSuccessRatio = (stopFraction) => {
        let successCount = 0;

        for (let i = 0; i < numSimulations; i++) {
            const candidates = Array.from({ length: numCandidates }, () => Math.random());
            const stopIndex = Math.floor(numCandidates * stopFraction);

            const maxInFirstPhase = Math.max(...candidates.slice(0, stopIndex));
            const remainingCandidates = candidates.slice(stopIndex);

            const chosenCandidate = remainingCandidates.find((candidate) => candidate > maxInFirstPhase);
            const bestCandidate = Math.max(...candidates);

            if (chosenCandidate === bestCandidate) {
                successCount++;
            }
        }

        return successCount / numSimulations;
    };

    const prepareChartData = () => {
        const dataPoints = Array.from({ length: 101 }, (_, i) => i / 100);
        const successRatios = dataPoints.map((stopFraction) => calculateSuccessRatio(stopFraction));

        setChartData({
            labels: dataPoints,
            datasets: [
                {
                    label: "Success Ratio",
                    data: successRatios,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 2,
                },
            ],
        });
    };

    useEffect(() => {
        prepareChartData();
    }, []);

    return (
        <Container>
            <h1>Secretary Problem Simulator</h1>
            {chartData.labels && chartData.datasets && (
                <Line
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
        </Container>
    );
};

export default App;
