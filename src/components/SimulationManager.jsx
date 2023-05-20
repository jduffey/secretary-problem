import { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";

import { ResetButton } from "./ResetButton";
import { SimulationChart } from "./SimulationChart";
import { SimulationStats } from "./SimulationStats";
import { ColorLegend } from "./ColorLegend";

import { generateCandidates } from "../utils/generateCandidates";
import { wasBestCandidateChosen } from "../utils/wasBestCandidateChosen";

import colorSchemes from "../colorSchemes";

const COLOR_SCHEME_NAME = {
    0: "Standard Colors",
    1: "HAL 9000",
    2: "Sunspot",
}[2];
const colorScheme = {
    thresholds:
        Object.entries(colorSchemes[COLOR_SCHEME_NAME].thresholds)
            .sort((a, b) => a.threshold - b.threshold)
            .map(([threshold, color]) => ({ threshold: parseFloat(threshold), color })),
    defaultColor: colorSchemes[COLOR_SCHEME_NAME].defaultColor,
};

export const SimulationManager = ({ numCandidates, numSimulations }) => {
    const [simulationCount, setSimulationCount] = useState(0);
    const [successCounts, setSuccessCounts] = useState(new Array(numCandidates).fill(0));
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [barColors, setBarColors] = useState(new Array(numCandidates).fill(colorScheme.defaultColor));

    const stoppingPoints = Array.from({ length: numCandidates }, (_, i) => i / numCandidates);

    const resetSimulation = () => {
        setSimulationCount(0);
        setSuccessCounts(new Array(numCandidates).fill(0));
    };

    useEffect(() => {
        // We're using this effect to force a re-render of the chart when the window is resized
        // Previously, the chart would shrink properly but would not expand when the window was made larger
        // Note that this might be later refactored to simply store a changed boolean state variable instead of the actual window width since it's not actually used
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
            const timer = setTimeout(async () => {
                const newSuccessCounts = [...successCounts];
                const candidates = await generateCandidates(numCandidates);

                stoppingPoints.forEach((stopRatio, index) => {
                    if (wasBestCandidateChosen(candidates, numCandidates, stopRatio)) {
                        newSuccessCounts[index]++;
                    }
                });

                setSuccessCounts(newSuccessCounts);

                const newSuccessRatios = newSuccessCounts.map((successCount) => successCount / (simulationCount + 1));

                const sortedSuccessRatios = [...newSuccessRatios].sort((a, b) => b - a);

                const newColors = newSuccessRatios.map((successRatio) => {
                    const thresholdPair = colorScheme.thresholds.find((pair) => {
                        return successRatio >= sortedSuccessRatios[Math.floor(sortedSuccessRatios.length * pair.threshold)];
                    });
                    return thresholdPair ? thresholdPair.color : colorScheme.defaultColor;
                });

                setBarColors(newColors);

                setSimulationCount(simulationCount + 1);
            }, msDelayBetweenSimulations);
            return () => clearTimeout(timer);
        }
    }, [simulationCount, numSimulations, successCounts, numCandidates, stoppingPoints]);

    return (
        <Container>
            <Row>
                <SimulationChart
                    key={windowWidth}
                    numCandidates={numCandidates}
                    successCounts={successCounts}
                    simulationCount={simulationCount}
                    backgroundColor={barColors}
                />
            </Row>
            <Row>
                <Col>
                    <SimulationStats
                        simulationCount={simulationCount}
                        numSimulations={numSimulations}
                        numCandidates={numCandidates}
                    />
                </Col>
                <Col>
                    <ResetButton
                        myFunction={resetSimulation}
                    />
                </Col>
                <Col>
                    <ColorLegend
                        colorScheme={colorScheme}
                    />
                </Col>
            </Row>
        </Container >
    );
}
