import { useState, useEffect } from "react";

import { Container, Col, Row } from "react-bootstrap";

import { SimulationChart } from "./SimulationChart";
import { SimulationStats } from "./SimulationStats";

export const SimulationManager = ({ numCandidates, numStoppingPoints, numSimulations, colorScheme }) => {
    const [chartData, setChartData] = useState({});
    const [simulationCount, setSimulationCount] = useState(0);

    const STOPPING_POINTS = Array.from({ length: numStoppingPoints }, (_, i) => i / numStoppingPoints);

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

    useEffect(() => {
        const msDelayBetweenSimulations = 10;
        if (simulationCount < numSimulations) {
            const timer = setTimeout(() => {
                const newChartData = {
                    labels: STOPPING_POINTS.map(e => e.toFixed(3)),
                    datasets: [
                        {
                            label: "Success Ratios",
                            data: chartData.datasets ? chartData.datasets[0].data.slice() : new Array(numStoppingPoints).fill(0),
                            backgroundColor: [],
                            barPercentage: 1.0,
                            categoryPercentage: 1.0,
                        },
                    ],
                };

                const candidates = Array.from({ length: numCandidates }, () => Math.random());

                STOPPING_POINTS.forEach((stopRatio, index) => {
                    const currentSuccessCount = chartData.datasets ? chartData.datasets[0].data[index] * simulationCount : 0;
                    newChartData.datasets[0].data[index] = calculateSuccessRatio(candidates, stopRatio, simulationCount, currentSuccessCount);
                });

                const sortedSuccessRatios = [...newChartData.datasets[0].data].sort((a, b) => b - a);

                newChartData.datasets[0].backgroundColor = newChartData.datasets[0].data.map((successRatio) => {
                    const thresholdPair = colorScheme.thresholds.find((pair) => {
                        return successRatio >= sortedSuccessRatios[Math.floor(sortedSuccessRatios.length * pair.threshold)];
                    });
                    return thresholdPair ? thresholdPair.color : colorScheme.defaultColor;
                });

                setChartData(newChartData);
                setSimulationCount(simulationCount + 1);
            }, msDelayBetweenSimulations);
            return () => clearTimeout(timer);
        }
    }, [simulationCount, chartData.datasets]);

    return (
        <Container>
            <Row>
                {chartData.labels && chartData.datasets &&
                    <SimulationChart
                        chartData={chartData}
                    />
                }
            </Row>
            <Row>
                <Col>
                    <SimulationStats
                        simulationCount={simulationCount}
                        numSimulations={numSimulations}
                        numCandidates={numCandidates}
                        numStoppingPoints={numStoppingPoints}
                    />
                </Col>
            </Row>
        </Container>
    );
}
