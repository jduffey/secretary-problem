export const SimulationStats = ({ simulationCount, numSimulations, numCandidates }) => (
    <div>
        <pre>
            Simulations performed: {simulationCount.toLocaleString()} / {numSimulations.toLocaleString()} ({(simulationCount / numSimulations * 100).toFixed(2)}%)
            <br />
            Candidates per simulation (<i>n</i>): {numCandidates.toLocaleString()}
        </pre>
    </div>
);
