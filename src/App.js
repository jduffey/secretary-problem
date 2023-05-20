import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from "react-bootstrap";

import { Introduction } from "./components/Introduction";
import { Summary } from "./components/Summary";
import { ChartExplanation } from "./components/ChartExplanation";
import { SimulationManager } from "./components/SimulationManager";
import { Footer } from "./components/Footer";
import { ColorLegend } from "./components/ColorLegend";

import colorSchemes from "./colorSchemes";

const NUM_SIMULATIONS = 100_000;

const COLOR_SCHEME_NAME = {
    0: "Sunspot",
    1: "HAL 9000",
}[0];
const colorScheme = {
    colorThresholds:
        Object.entries(colorSchemes[COLOR_SCHEME_NAME].thresholds)
            .sort((a, b) => a.threshold - b.threshold)
            .map(([threshold, color]) => ({ threshold: parseFloat(threshold), color })),
    defaultColor: colorSchemes[COLOR_SCHEME_NAME].defaultColor,
};

const App = () => {
    return (
        <Container>
            <Row>
                <Introduction />
            </Row>
            <Row>
                <ColorLegend
                    colorScheme={colorScheme}
                />
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
        </Container >
    );
};

export default App;
