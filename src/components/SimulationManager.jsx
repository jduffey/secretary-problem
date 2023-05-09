import { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";

import { SimulationChart } from "./SimulationChart";
import { SimulationStats } from "./SimulationStats";

export const SimulationManager = ({ numCandidates, numStoppingPoints, numSimulations, colorScheme }) => {
    const [chartData, setChartData] = useState({});
    const [simulationCount, setSimulationCount] = useState(0);
    const [successCounts, setSuccessCounts] = useState(new Array(numStoppingPoints).fill(0));
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const STOPPING_POINTS = Array.from({ length: numStoppingPoints }, (_, i) => i / numStoppingPoints);

    const bestCandidateChosen = (candidates, stopFraction) => {
        const stopIndex = Math.floor(numCandidates * stopFraction);

        const maxInFirstPhase = Math.max(...candidates.slice(0, stopIndex));
        const remainingCandidates = candidates.slice(stopIndex);

        const chosenCandidate = remainingCandidates.find((candidate) => candidate > maxInFirstPhase);
        const bestCandidate = Math.max(...candidates);

        return chosenCandidate === bestCandidate;
    };

    useEffect(() => {
        // We're using this effect to force a re-render of the chart when the window is resized
        // Previously, the chart would shrink properly but would not expand when the window was made larger
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    useEffect(() => {
        const msDelayBetweenSimulations = 10;
        if (simulationCount < numSimulations) {
            const timer = setTimeout(() => {
                const candidates = Array.from({ length: numCandidates }, () => Math.random());
                const newSuccessCounts = [...successCounts];

                STOPPING_POINTS.forEach((stopRatio, index) => {
                    if (bestCandidateChosen(candidates, stopRatio)) {
                        newSuccessCounts[index]++;
                    }
                });

                setSuccessCounts(newSuccessCounts);

                const newChartData = {
                    labels: STOPPING_POINTS.map(e => e.toFixed(3)),
                    datasets: [
                        {
                            label: "Success Ratios",
                            data: newSuccessCounts.map((successCount) => successCount / (simulationCount + 1)),
                            backgroundColor: [],
                            barPercentage: 1.0,
                            categoryPercentage: 1.0,
                        },
                    ],
                };

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
    });

    return (
        <Container>
            <Row>
                {chartData.labels && chartData.datasets &&
                    <SimulationChart
                        key={windowWidth}
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
