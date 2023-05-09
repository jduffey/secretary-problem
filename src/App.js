import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Col, Row } from "react-bootstrap";

import { Introduction } from "./components/Introduction";
import { Summary } from "./components/Summary";
import { ColorLegend } from "./components/ColorLegend";
import { ChartExplanation } from "./components/ChartExplanation";
import { SimulationManager } from "./components/SimulationManager";

import colorSchemes from "./colorSchemes";

const NUM_CANDIDATES = 500;
const NUM_STOPPING_POINTS = NUM_CANDIDATES;
const NUM_SIMULATIONS = 100_000;
const COLOR_SCHEME_NAME = {
    0: "Standard Colors",
    1: "HAL 9000",
    2: "Sunspot",
}[2];
const COLOR_SCHEME = {
    thresholds:
        Object.entries(colorSchemes[COLOR_SCHEME_NAME].thresholds)
            .sort((a, b) => a.threshold - b.threshold)
            .map(([threshold, color]) => ({ threshold: parseFloat(threshold), color })),
    defaultColor: colorSchemes[COLOR_SCHEME_NAME].defaultColor,
};

const App = () => {
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
                <SimulationManager
                    numSimulations={NUM_SIMULATIONS}
                    numCandidates={NUM_CANDIDATES}
                    numStoppingPoints={NUM_STOPPING_POINTS}
                    colorScheme={COLOR_SCHEME}
                />
            </Row>
            <Row>
                {
                    COLOR_SCHEME &&
                    <Col>
                        <ColorLegend
                            colorScheme={COLOR_SCHEME}
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
