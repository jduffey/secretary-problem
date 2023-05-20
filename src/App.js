import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row } from "react-bootstrap";

import { Introduction } from "./components/Introduction";
import { Summary } from "./components/Summary";
import { ChartExplanation } from "./components/ChartExplanation";
import { SimulationManager } from "./components/SimulationManager";
import { Footer } from "./components/Footer";

const NUM_SIMULATIONS = 100_000;
// const NUM_SIMULATIONS = 500;

const App = () => {
    return (
        <Container>
            <Row>
                <Introduction />
            </Row>
            <Row>
                <SimulationManager
                    numSimulations={NUM_SIMULATIONS}
                    numCandidates={1000}
                />
                <SimulationManager
                    numSimulations={NUM_SIMULATIONS}
                    numCandidates={100}
                />
                <SimulationManager
                    numSimulations={NUM_SIMULATIONS}
                    numCandidates={50}
                />
                <SimulationManager
                    numSimulations={NUM_SIMULATIONS}
                    numCandidates={20}
                />
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
