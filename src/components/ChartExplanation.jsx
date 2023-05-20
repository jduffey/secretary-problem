export const ChartExplanation = ({ numSimulations }) => {
    return (
        <div>
            <h4 style={{ textAlign: "center" }}>The charts represent the continuously-updated success ratios on a series of {numSimulations.toLocaleString()} simulations with various sizes of candidate groups.</h4>
            <br />
            <ul>
                <li>On each iteration of the simulation, a new array of candidates is created with each candidate assigned a random value representing their quality.</li>
                <li>For each group of candidates (each simulation of the interview process), the following occurs:</li>
                <ul>
                    <li>For each potential stopping point ratio (i.e. 0 up to and excluding 1, in evenly-spaced increments inversely proportional to the number of candidates being interviewed:</li>
                    <ul>
                        <li>The first group of candidates is assessed one-by-one and the value of the best candidate is recorded.</li>
                        <li>The interview process continues with the second group until a candidate is found with a higher rating than the best candidate from the first group.</li>
                        <li>If such a candidate is found (this is the candidate who is hired):</li>
                        <ul>
                            <li>If they are the best candidate in the second group, then that means they are the best candidate overall and a &quot;success&quot; counter is incremented for that stopping point ratio.</li>
                            <li>If they are not the best candidate in the second group, or if there are no candidates in the second group who are better than the best candidate in the first group, then the interview process was not successful and we do not increment the success counter.</li>
                        </ul>
                    </ul>
                    <li>After the current stopping point ratio is used to find a candidate, we move to the next ratio and perform the same steps.</li>
                </ul>
                <li>After all stopping point ratios have been used on the given group of candidates, we start the simulaton again with a new group of candidates until the maximum number of simulations ({numSimulations.toLocaleString()}) have been executed.</li>
                <li>The colorings on the bars are intended to help with visualization and have no meaning or relevance to the problem.</li>
            </ul>
        </div>
    )
};
