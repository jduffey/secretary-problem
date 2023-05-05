export const ChartExplanation = ({ numCandidates, numStoppingPoints, numSimulations }) => (
    <div>
        <h4>Explanation of chart:</h4>
        <ul>
            <li>On each iteration of the simulation, a new array of {numCandidates.toLocaleString()} candidates is created with each candidate assigned a random value representing their quality.</li>
            <li>Because each candidate is assigned a random value, this is equivalent in practice to the candidates being assigned a random sequential position for their interview.</li>
            <li>For each group of candidates (each simulation), the following occurs:</li>
            <ul>
                <li>For each potential stopping point ratio (i.e. 0 up to and excluding 1, in increments of {(1 / numStoppingPoints).toLocaleString()}):</li>
                <ul>
                    <li>The first group of candidates is assessed one-by-one and the value of the best candidate is recorded.</li>
                    <li>The interview process continues with the second group until a candidate is found with a higher rating than the best candidate from the first group.</li>
                    <li>If such a candidate is found, a &quot;success&quot; counter is incremented for that stopping point ratio.</li>
                </ul>
                <li>After the current stopping point ratio is used to find a candidate, we move to the next ratio and perform the same steps.</li>
            </ul>
            <li>After all stopping point ratios have been used on the given group of candidates, we start the simulaton again with a new group of candidates until the maximum number of simulations ({numSimulations.toLocaleString()}) have been executed.</li>
            <li>The colorings on the bars are intended to help with visualization and have no meaning or relevance to the problem.</li>
        </ul>
    </div>
);
