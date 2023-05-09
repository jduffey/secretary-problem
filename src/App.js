import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Col, Row } from "react-bootstrap";

import { Introduction } from "./components/Introduction";
import { Summary } from "./components/Summary";
import { ChartExplanation } from "./components/ChartExplanation";
import { SimulationManager } from "./components/SimulationManager";

const NUM_CANDIDATES = 1000;
const NUM_STOPPING_POINTS = NUM_CANDIDATES;
const NUM_SIMULATIONS = 100_000;

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
                />
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
