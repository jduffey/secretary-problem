import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col, ProgressBar } from "react-bootstrap";

const App = () => {
    const [candidates, setCandidates] = useState([]);
    const [bestCandidate, setBestCandidate] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [currentState, setCurrentState] = useState("start");

    const generateCandidates = () => {
        const numCandidates = 100;
        const newCandidates = Array.from({ length: numCandidates }, () => Math.floor(Math.random() * 100) + 1);
        setCandidates(newCandidates);
        setBestCandidate(Math.max(...newCandidates));
        setSelectedCandidate(null);
        setCurrentState("interview");
    };

    const selectCandidate = (index) => {
        setSelectedCandidate(candidates[index]);
        setCurrentState("result");
    };

    const optimalStop = Math.ceil(candidates.length * 0.368);

    return (
        <Container>
            <h1>Secretary Problem Simulator</h1>

            {currentState === "start" && (
                <Button onClick={generateCandidates}>Generate Candidates</Button>
            )}

            {currentState === "interview" && (
                <>
                    <h2>Candidates</h2>
                    <Row>
                        {candidates.map((candidate, index) => (
                            <Col key={index}>
                                <Button
                                    variant={index < optimalStop ? "secondary" : "primary"}
                                    onClick={() => selectCandidate(index)}
                                >
                                    {candidate}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                    <p>Optimal stopping point: Candidate {optimalStop}</p>
                </>
            )}

            {currentState === "result" && (
                <>
                    <h2>Selected Candidate: {selectedCandidate}</h2>
                    <h2>Best Candidate: {bestCandidate}</h2>
                    <ProgressBar>
                        <ProgressBar variant="success" now={(selectedCandidate / bestCandidate) * 100} />
                    </ProgressBar>
                    <Button onClick={generateCandidates}>Try Again</Button>
                </>
            )}
        </Container>
    );
};

export default App;
