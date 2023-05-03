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

    const calculateSuccessRatio = (candidates, stopFraction, currentSimulations, currentSuccessCount) => {
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
        const stoppingPoints = Array.from({ length: 101 }, (_, i) => i / 100);

        const newChartData = {
            labels: stoppingPoints.map(e => e.toFixed(2)),
            datasets: [
                {
                    label: "Success Ratio",
                    data: chartData.datasets ? chartData.datasets[0].data.slice() : new Array(101).fill(0),
                    backgroundColor: [],
                },
            ],
        };

        const candidates = Array.from({ length: numCandidates }, () => Math.random());

        stoppingPoints.forEach((stopRatio, index) => {
            const currentSuccessCount = chartData.datasets ? chartData.datasets[0].data[index] * simulationCount : 0;
            newChartData.datasets[0].data[index] = calculateSuccessRatio(candidates, stopRatio, simulationCount, currentSuccessCount);
        });

        const sortedSuccessRatios = [...newChartData.datasets[0].data].sort((a, b) => b - a);

        newChartData.datasets[0].backgroundColor = newChartData.datasets[0].data.map((successRatio) => {
            return [
                [sortedSuccessRatios[0], "black"],
                [sortedSuccessRatios[Math.floor(sortedSuccessRatios.length * 0.1)], "red"],
                [sortedSuccessRatios[Math.floor(sortedSuccessRatios.length * 0.2)], "orange"],
                [sortedSuccessRatios[Math.floor(sortedSuccessRatios.length * 0.3)], "yellow"],
                [sortedSuccessRatios[Math.floor(sortedSuccessRatios.length * 0.4)], "green"],
                [sortedSuccessRatios[Math.floor(sortedSuccessRatios.length * 0.5)], "blue"],
                [0, "#CCCCCC"],
            ].find((thresholdColorPair) => successRatio >= thresholdColorPair[0])[1];
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
            <div>
                The Secretary Problem is an oft-studied problem in the field of statistics, probabilities, and decision-making. A common description of the problem goes something like this:
                <div style={{ margin: "10px 80px 0px 30px" }}>
                    Imagine an administrator who wants to hire the best secretary out of <i>n</i> rankable candidates for a position. The candidates are interviewed one by one in random order. A decision about each particular candidate must be made immediately after the interview. Once rejected, an candidate cannot be recalled. During the interview, the administrator gains information sufficient to rank the candidate among all candidates interviewed so far, but is unaware of the quality of yet unseen candidates. The problem faced by the administrator is <b>deciding the optimal strategy to maximize the probability of selecting the best candidate.</b> If the decision can be deferred to the end, then the problem is trivial -- simply choose the highest-ranked candidate. The difficulty is that the decision to hire a candidate must be made immediately after assessing that candidate.
                </div>
            </div>
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
            <pre>
                Simulations performed: {simulationCount.toLocaleString()} / {numSimulations.toLocaleString()} ({(simulationCount / numSimulations * 100).toFixed(2)}%)
                <br />
                Number of candidates in each simulation (<i>n</i>): {numCandidates.toLocaleString()}
            </pre>
            <div>
                In summary:
                <ul>
                    <li>There is a single position to fill.</li>
                    <li>There are <i>n</i> candidates for the position, and the value of <i>n</i> is known.</li>
                    <li>The candidates, if all seen together, can be ranked from best to worst unambiguously.</li>
                    <ul><li>Note that we are not concerned with the <i>absolute</i> quality of a candidate, only the relative quality (i.e. ranking).</li></ul>
                    <li>The candidates are interviewed sequentially and in random order.</li>
                    <li>A candidate is either accepted or rejected immediately after the inteview, and the decision is irrevocable.</li>
                    <li><b>The decision to accept or reject a candidate can be based only on the relative ranks of the candidates interviewed so far.</b></li>
                    <li>The administrator's objective is to have <b>the highest probability of selecting the best candidate of the whole group.</b></li>
                    <ul><li>This is the same as maximizing the expected payoff, with payoff defined to be <b>1</b> for the best candidate and <b>0</b> otherwise.</li></ul>
                </ul>
            </div>
            <div>
                Explanation of chart:
                <ul>
                    <li>On each iteration of the simulation, a new array of {numCandidates.toLocaleString()} candidates is created with each candidate assigned a random value representing their quality.</li>
                    <li>Because each candidate is assigned a random value, this is equivalent in practice to the candidates being assigned a random sequential position for their interview.</li>
                    <li>For each group of candidates (each simulation), the following occurs:</li>
                    <ul>
                        <li>For each potential stopping point ratio (i.e. 0 through 1 in increments of 0.01):</li>
                        <ul>
                            <li>The first group of candidates is assessed one-by-one and the value of the best candidate is recorded.</li>
                            <li>The interview process continues with the second group until a candidate is found with a higher rating than the best candidate from the first group.</li>
                            <li>If such a candidate is found, a "success" counter is incremented for that stopping point ratio.</li>
                        </ul>
                        <li>After the current stopping point ratio is used to find a candidate, we move to the next ratio and perform the same steps.</li>
                    </ul>
                    <li>After all stopping point ratios have been used on the given group of candidates, we start the simulaton again with a new group of candidates until the maximum number of simulations ({numSimulations.toLocaleString()}) have been executed.</li>
                    <li>The colorings on the bars are intended to help with visualization and have no meaning or relevance to the problem.</li>
                    <ul>
                        <li>Black: The stopping point ratio with the highest success rate so far.</li>
                        <li>Red: Top 10%.</li>
                        <li>Orange: Top 20%.</li>
                        <li>Yellow: Top 30%.</li>
                        <li>Green: Top 40%.</li>
                        <li>Blue: Top 50%.</li>
                        <li>Gray: Bottom 50%.</li>
                    </ul>
                </ul>
            </div>
        </Container >
    );
};

export default App;
