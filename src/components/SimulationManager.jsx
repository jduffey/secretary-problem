/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";

import { SimulationChart } from "./SimulationChart";
import { SimulationStats } from "./SimulationStats";
import { ColorLegend } from "./ColorLegend";

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

export const SimulationManager = ({ numCandidates, numStoppingPoints, numSimulations }) => {
    const [backgroundColorsArray, setBackgroundColorsArray] = useState([]);
    const [simulationCount, setSimulationCount] = useState(0);
    const [successCounts, setSuccessCounts] = useState(new Array(numStoppingPoints).fill(0));
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [initialSeedHash, setInitialSeedHash] = useState('');
    const [lastCandidateHash, setLastCandidateHash] = useState(null);

    const stoppingPoints = Array.from({ length: numStoppingPoints }, (_, i) => i / numStoppingPoints);

    const wasBestCandidateChosen = (candidates, stopFraction) => {
        const stopIndex = Math.floor(numCandidates * stopFraction);

        const maxInFirstPhase = candidates.slice(0, stopIndex).reduce((max, curr) => curr > max ? curr : max, BigInt(0));
        const remainingCandidates = candidates.slice(stopIndex);

        const chosenCandidate = remainingCandidates.find((candidate) => candidate > maxInFirstPhase);
        const bestCandidate = candidates.reduce((max, curr) => curr > max ? curr : max, BigInt(0));

        return chosenCandidate === bestCandidate;
    };

    const resetSimulation = () => {
        setSimulationCount(0);
        setSuccessCounts(new Array(numStoppingPoints).fill(0));
        setInitialSeedHash('');
        setLastCandidateHash(null);
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

    const generateCandidates = async () => {
        let hash;
        if (lastCandidateHash === null) {
            hash = new TextEncoder().encode(Date.now().toString());
            // generate the initial digest and convert to hexadecimal
            const initialDigest = await window.crypto.subtle.digest('SHA-256', hash);
            const initialSeedHashHex = Array.from(new Uint8Array(initialDigest)).map(b => b.toString(16).padStart(2, '0')).join('');
            setInitialSeedHash(initialSeedHashHex);
            // continue with the initial hash for the first candidate generation
            hash = initialDigest;
        } else {
            hash = lastCandidateHash;
        }

        const candidates = [];
        for (let i = 0; i < numCandidates; i++) {
            hash = await window.crypto.subtle.digest('SHA-256', hash);
            const hashArray = Array.from(new Uint8Array(hash));
            const bigIntHash = BigInt('0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
            candidates.push(bigIntHash);
            hash = new TextEncoder().encode(bigIntHash.toString());
        }

        setLastCandidateHash(hash);
        return candidates;
    };

    useEffect(() => {
        const msDelayBetweenSimulations = 10;
        if (simulationCount < numSimulations) {
            const timer = setTimeout(async () => {
                const newSuccessCounts = [...successCounts];
                const candidates = await generateCandidates();

                stoppingPoints.forEach((stopRatio, index) => {
                    if (wasBestCandidateChosen(candidates, stopRatio)) {
                        newSuccessCounts[index]++;
                    }
                });

                setSuccessCounts(newSuccessCounts);

                // const newChartDataForBgColorCalculations = {
                //     datasets: [
                //         {
                //             data: newSuccessCounts.map((successCount) => successCount / (simulationCount + 1)),
                //         },
                //     ],
                // };

                const foo = newSuccessCounts.map((successCount) => successCount / (simulationCount + 1));

                const sortedSuccessRatios = foo.sort((a, b) => b - a);

                const bgColorsArray = foo.map((successRatio) => {
                    const thresholdPair = colorScheme.thresholds.find((pair) => {
                        return successRatio >= sortedSuccessRatios[Math.floor(sortedSuccessRatios.length * pair.threshold)];
                    });
                    return thresholdPair ? thresholdPair.color : colorScheme.defaultColor;
                });

                setBackgroundColorsArray(bgColorsArray);
                setSimulationCount(simulationCount + 1);
            }, msDelayBetweenSimulations);
            return () => clearTimeout(timer);
        }
    });

    const InitialSeedHashDisplay = () => (
        <div>
            <h2>Initial Seed Hash</h2>
            <p>{initialSeedHash}</p>
        </div>
    );

    return (
        <Container>
            <Row>
                <SimulationChart
                    key={windowWidth}
                    data={successCounts.map((successCount) => successCount / (simulationCount + 1))}
                    backgroundColor={backgroundColorsArray}
                    numStoppingPoints={numStoppingPoints}
                />
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
                <Col>
                    <div
                        role="button"
                        onClick={() => resetSimulation()}
                        style={{
                            border: "1px solid black",
                            borderRadius: "0.5em",
                            fontSize: "1em",
                            fontWeight: "bold",
                            padding: "0.5em",
                            textAlign: "center",
                            cursor: "pointer",
                            margin: "5% auto",
                            backgroundColor: "lightgray",
                            width: "10em",
                        }}
                    >
                        Reset
                    </div>
                </Col>
                <Col>
                    <ColorLegend
                        colorScheme={colorScheme}
                    />
                </Col>
            </Row>
            <Row>
                <InitialSeedHashDisplay />
            </Row>
        </Container >
    );
}
