/* eslint-disable no-undef */
export const wasBestCandidateChosen = (candidates, numCandidates, stopFraction) => {
    const stopIndex = Math.floor(numCandidates * stopFraction);

    const maxInFirstPhase = candidates.slice(0, stopIndex).reduce((max, curr) => curr > max ? curr : max, BigInt(0));
    const remainingCandidates = candidates.slice(stopIndex);

    const chosenCandidate = remainingCandidates.find((candidate) => candidate > maxInFirstPhase);
    const bestCandidate = candidates.reduce((max, curr) => curr > max ? curr : max, BigInt(0));

    return chosenCandidate === bestCandidate;
};
