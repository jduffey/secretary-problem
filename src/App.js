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

const NUM_CANDIDATES = 1000;
const NUM_STOPPING_POINTS = NUM_CANDIDATES;
const NUM_SIMULATIONS = 100_000;
const STOPPING_POINTS = Array.from({ length: NUM_STOPPING_POINTS }, (_, i) => i / NUM_STOPPING_POINTS);

const App = () => {
    const [chartData, setChartData] = useState({});
    const [simulationCount, setSimulationCount] = useState(0);
    const [colorScheme, setColorScheme] = useState(null);

    const calculateSuccessRatio = (candidates, stopFraction, currentSimulations, currentSuccessCount) => {
        const stopIndex = Math.floor(NUM_CANDIDATES * stopFraction);

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

        const newChartData = {
            labels: STOPPING_POINTS.map(e => e.toFixed(3)),
            datasets: [
                {
                    label: "Success Ratios",
                    data: chartData.datasets ? chartData.datasets[0].data.slice() : new Array(NUM_STOPPING_POINTS).fill(0),
                    backgroundColor: [],
                    barPercentage: 1.0,
                    categoryPercentage: 1.0,
                },
            ],
        };

        const candidates = Array.from({ length: NUM_CANDIDATES }, () => Math.random());

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
    };

    useEffect(() => {
        const selectedColorScheme = "Standard Colors";
        const useableColorScheme = {
            thresholds:
                Object.entries(colorSchemes[selectedColorScheme].thresholds)
                    .sort((a, b) => a.threshold - b.threshold)
                    .map(([threshold, color]) => ({ threshold: parseFloat(threshold), color })),
            defaultColor: colorSchemes[selectedColorScheme].defaultColor,
        };

        setColorScheme(useableColorScheme);
    }, []);

    useEffect(() => {
        const msDelayBetweenSimulations = 10;
        if (simulationCount < NUM_SIMULATIONS) {
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
                        numSimulations={NUM_SIMULATIONS}
                        numCandidates={NUM_CANDIDATES}
                        numStoppingPoints={NUM_STOPPING_POINTS}
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
                    numCandidates={NUM_CANDIDATES}
                    numStoppingPoints={NUM_STOPPING_POINTS}
                    numSimulations={NUM_SIMULATIONS}
                />
            </Row>
        </Container >
    );
};

export default App;
