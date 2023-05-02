import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import { CategoryScale } from "chart.js/auto";

Chart.register(CategoryScale);

const App = () => {
    const numCandidates = 100;
    const numSimulations = 100_000;

    const [chartData, setChartData] = useState({});
    const [simulationCount, setSimulationCount] = useState(0);

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

    const prepareChartData = () => {
        const dataPoints = Array.from({ length: 101 }, (_, i) => i / 100);

        const newChartData = {
            labels: dataPoints,
            datasets: [
                {
                    label: "Success Ratio",
                    data: chartData.datasets ? chartData.datasets[0].data.slice() : new Array(101).fill(0),
                    backgroundColor: [],
                    borderColor: "#777777",
                    borderWidth: 2,
                },
            ],
        };

        dataPoints.forEach((stopFraction, index) => {
            const currentSuccessCount = chartData.datasets ? chartData.datasets[0].data[index] * simulationCount : 0;
            newChartData.datasets[0].data[index] = calculateSuccessRatio(stopFraction, simulationCount, currentSuccessCount);
        });

        const sortedSuccessRatios = [...newChartData.datasets[0].data].sort((a, b) => b - a);
        const top10PercentIndex = Math.floor(sortedSuccessRatios.length * 0.1);
        const top20PercentIndex = Math.floor(sortedSuccessRatios.length * 0.2);
        const top30PercentIndex = Math.floor(sortedSuccessRatios.length * 0.3);
        const top40PercentIndex = Math.floor(sortedSuccessRatios.length * 0.4);
        const top50PercentIndex = Math.floor(sortedSuccessRatios.length * 0.5);
        const top10PercentThreshold = sortedSuccessRatios[top10PercentIndex];
        const top20PercentThreshold = sortedSuccessRatios[top20PercentIndex];
        const top30PercentThreshold = sortedSuccessRatios[top30PercentIndex];
        const top40PercentThreshold = sortedSuccessRatios[top40PercentIndex];
        const top50PercentThreshold = sortedSuccessRatios[top50PercentIndex];

        newChartData.datasets[0].backgroundColor = newChartData.datasets[0].data.map((value) => {
            if (value >= top10PercentThreshold) {
                return "red";
            } else if (value >= top20PercentThreshold) {
                return "orange";
            } else if (value >= top30PercentThreshold) {
                return "yellow";
            } else if (value >= top40PercentThreshold) {
                return "green";
            } else if (value >= top50PercentThreshold) {
                return "blue";
            } else {
                return "#EEEEEE";
            }
        });

        setChartData(newChartData);
        setSimulationCount(simulationCount + 1);
    };

    useEffect(() => {
        const msDelayBetweenSimulations = 10;
        if (simulationCount < numSimulations) {
            const timer = setTimeout(() => {
                prepareChartData();
            }, msDelayBetweenSimulations);
            return () => clearTimeout(timer);
        }
    }, [simulationCount]);

    return (
        <Container>
            <h1>Secretary Problem Simulator</h1>
            <p>
                https://mathworld.wolfram.com/SultansDowryProblem.html
            </p>
            <p>
                https://en.wikipedia.org/wiki/Secretary_problem
            </p>
            <p>
                The basic problem can be stated as follows:
                <ul>
                    <li>There is a single position to fill.</li>
                    <li>There are n applicants for the position, and the value of n is known.</li>
                    <li>The applicants, if all seen together, can be ranked from best to worst unambiguously.</li>
                    <li>The applicants are interviewed sequentially in random order, with each order being equally likely.</li>
                    <li>Immediately after an interview, the interviewed applicant is either accepted or rejected, and the decision is irrevocable.</li>
                    <li>The decision to accept or reject an applicant can be based only on the relative ranks of the applicants interviewed so far.</li>
                    <li><b>The objective of the general solution is to have the highest probability of selecting the best applicant of the whole group.</b> This is the same as maximizing the expected payoff, with payoff defined to be one for the best applicant and zero otherwise.</li>
                </ul>
            </p>
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
            <p>Simulations performed: {simulationCount} / {numSimulations} ({simulationCount / numSimulations * 100}%)</p>
        </Container>
    );
};

export default App;
