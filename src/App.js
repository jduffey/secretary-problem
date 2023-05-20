import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";

import { Introduction } from "./components/Introduction";
import { Summary } from "./components/Summary";
import { ChartExplanation } from "./components/ChartExplanation";
import { SimulationManager } from "./components/SimulationManager";
import { Footer } from "./components/Footer";
import { ColorLegend } from "./components/ColorLegend";

import colorSchemes from "./colorSchemes";

const NUM_SIMULATIONS = 100_000;

const COLOR_SCHEME_NAMES = ["Sunspot", "HAL 9000", "Rainbo"];

const App = () => {
    const [colorSchemeName, setColorSchemeName] = useState(COLOR_SCHEME_NAMES[2]);

    const colorScheme = {
        colorThresholds:
            Object.entries(colorSchemes[colorSchemeName].thresholds)
                .sort((a, b) => a.threshold - b.threshold)
                .map(([threshold, color]) => ({ threshold: parseFloat(threshold), color })),
        defaultColor: colorSchemes[colorSchemeName].defaultColor,
    };

    const changeColorScheme = () => {
        const nextColorSchemeIndex = (COLOR_SCHEME_NAMES.indexOf(colorSchemeName) + 1) % COLOR_SCHEME_NAMES.length;
        setColorSchemeName(COLOR_SCHEME_NAMES[nextColorSchemeIndex]);
    };

    return (
        <Container>
            <Row>
                <Introduction />
            </Row>
            <Row>
                <ColorLegend
                    colorScheme={colorScheme}
                />
                <Button
                    onClick={changeColorScheme}>
                    Change Color Scheme
                </Button>
            </Row>
            <Row>
                <Col>
                    <SimulationManager
                        numSimulations={NUM_SIMULATIONS}
                        numCandidates={1000}
                        colorScheme={colorScheme}
                    />
                    <SimulationManager
                        numSimulations={NUM_SIMULATIONS}
                        numCandidates={50}
                        colorScheme={colorScheme}
                    />
                </Col>
                <Col>
                    <SimulationManager
                        numSimulations={NUM_SIMULATIONS}
                        numCandidates={100}
                        colorScheme={colorScheme}
                    />
                    <SimulationManager
                        numSimulations={NUM_SIMULATIONS}
                        numCandidates={20}
                        colorScheme={colorScheme}
                    />
                </Col>
            </Row>
            <Row>
                <ChartExplanation
                    numSimulations={NUM_SIMULATIONS}
                />
            </Row>
            <Row>
                <Summary />
            </Row>
            <Row>
                <Footer />
            </Row>
        </Container>
    );
};

export default App;
