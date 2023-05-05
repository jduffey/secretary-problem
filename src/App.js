import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Col, Row } from "react-bootstrap";

import { Introduction } from "./components/Introduction";
import { Summary } from "./components/Summary";
import { SimulationChart } from "./components/SimulationChart";
import { SimulationStats } from "./components/SimulationStats";
import { ColorLegend } from "./components/ColorLegend";
import { ChartExplanation } from "./components/ChartExplanation";

import colorSchemes from "./colorSchemes";

const App = () => {
    const numCandidates = 1000;
    const numStoppingPoints = numCandidates;
    const numSimulations = 100_000;

    const [chartData, setChartData] = useState({});
    const [simulationCount, setSimulationCount] = useState(0);
    const [colorScheme, setColorScheme] = useState(null);

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
        const stoppingPoints = Array.from({ length: numStoppingPoints }, (_, i) => i / numStoppingPoints);

        const newChartData = {
            labels: stoppingPoints.map(e => e.toFixed(3)),
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

        stoppingPoints.forEach((stopRatio, index) => {
            const currentSuccessCount = chartData.datasets ? chartData.datasets[0].data[index] * simulationCount : 0;
            newChartData.datasets[0].data[index] = calculateSuccessRatio(candidates, stopRatio, simulationCount, currentSuccessCount);
        });

        const sortedSuccessRatios = [...newChartData.datasets[0].data].sort((a, b) => b - a);

        newChartData.datasets[0].backgroundColor = newChartData.datasets[0].data.map((successRatio) => {
            const thresholdColor = colorScheme.thresholds.find((pair) => {
                return successRatio >= sortedSuccessRatios[Math.floor(sortedSuccessRatios.length * pair.threshold)];
            });
            return thresholdColor ? thresholdColor.color : colorScheme.default;
        });

        setChartData(newChartData);
        setSimulationCount(simulationCount + 1);
    };

    useEffect(() => {
        const selectedColorScheme = "HAL 9000";
        const useableColorScheme = {
            thresholds:
                Object.entries(colorSchemes[selectedColorScheme].thresholds).sort(
                    (a, b) => a.threshold - b.threshold
                ).map(([threshold, color]) => ({ threshold: parseFloat(threshold), color })),
            defaultColor: colorSchemes[selectedColorScheme].defaultColor,
        };

        setColorScheme(useableColorScheme);
    }, []);

    useEffect(() => {
        const msDelayBetweenSimulations = 10;
        if (simulationCount < numSimulations && colorScheme) {
            const timer = setTimeout(() => {
                runSimulation();
            }, msDelayBetweenSimulations);
            return () => clearTimeout(timer);
        }
    }, [simulationCount, colorScheme]);

    return (
        <Container>
            <Row>
                <Col>
                    <Introduction />
                </Col>
                <Col>
                    <Summary />
                </Col>
            </Row>
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
                {
                    colorScheme &&
                    <Col>
                        <ColorLegend
                            colorScheme={colorScheme}
                        />
                    </Col>
                }
            </Row>
            <Row>
                <ChartExplanation
                    numCandidates={numCandidates}
                    numStoppingPoints={numStoppingPoints}
                    numSimulations={numSimulations}
                />
            </Row>
        </Container >
    );
};

export default App;
