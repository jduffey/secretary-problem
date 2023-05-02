import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import { CategoryScale } from "chart.js/auto";

Chart.register(CategoryScale);

const App = () => {
    const numCandidates = 1000;
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

    const runSimulation = () => {
        const dataPoints = Array.from({ length: 101 }, (_, i) => i / 100);

        const newChartData = {
            labels: dataPoints.map(e => e.toFixed(2)),
            datasets: [
                {
                    label: "Success Ratio",
                    data: chartData.datasets ? chartData.datasets[0].data.slice() : new Array(101).fill(0),
                    backgroundColor: [],
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
                return "#CCCCCC";
            }
        });

        setChartData(newChartData);
        setSimulationCount(simulationCount + 1);
    };

    useEffect(() => {
        const msDelayBetweenSimulations = 10;
        if (simulationCount < numSimulations) {
            const timer = setTimeout(() => {
                runSimulation();
            }, msDelayBetweenSimulations);
            return () => clearTimeout(timer);
        }
    }, [simulationCount]);

    return (
        <Container>
            <h1>Secretary Problem Simulator</h1>
            <p>
                The Secretary Problem is an oft-studied problem in the field of statistics, probabilities, and decision-making. A common description of the problem goes something like this:
            </p>
            <p>
                Imagine an administrator who wants to hire the best secretary out of <i>n</i> rankable candidates for a position. The candidates are interviewed one by one in random order. A decision about each particular candidate must be made immediately after the interview. Once rejected, an candidate cannot be recalled. During the interview, the administrator gains information sufficient to rank the candidate among all candidates interviewed so far, but is unaware of the quality of yet unseen candidates. The problem faced by the administrator is <b>deciding the optimal strategy to maximize the probability of selecting the best candidate.</b> If the decision can be deferred to the end, then the problem is trivial -- simply choose the highest-ranked candidate. The difficulty is that the decision to hire a candidate must be made immediately after assessing that candidate.
            </p>
            <p>
                In summary:
                <ul>
                    <li>There is a single position to fill.</li>
                    <li>There are <i>n</i> candidates for the position, and the value of <i>n</i> is known.</li>
                    <li>The candidates, if all seen together, can be ranked from best to worst unambiguously.</li>
                    <li>The candidates are interviewed sequentially in random order, with each order being equally likely.</li>
                    <li>The interviewed candidate is either accepted or rejected immediately after the inteview, and the decision is irrevocable.</li>
                    <li><b>The decision to accept or reject an candidate can be based only on the relative ranks of the candidates interviewed so far.</b></li>
                    <li>The administrator's objective is to have <b>the highest probability of selecting the best candidate of the whole group.</b> This is the same as maximizing the expected payoff, with payoff defined to be <b>1</b> for the best candidate and <b>0</b> otherwise.</li>
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
                                    text: "Stopping Point: The ratio of candidates interviewed before allowing a selection to be made.",
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: "Success Ratio: The ratio of simulations where the best candidate was selected.",
                                },
                                min: 0,
                                max: 0.6,
                                ticks: {
                                    stepSize: 0.05,
                                },
                            },
                        },
                    }}
                />
            )}
            <pre>Simulations performed: {simulationCount.toLocaleString()} / {numSimulations.toLocaleString()} ({(simulationCount / numSimulations * 100).toFixed(2)}%)</pre>
        </Container>
    );
};

export default App;
