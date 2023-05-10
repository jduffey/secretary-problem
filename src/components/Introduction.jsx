export const Introduction = () => (
    <div>
        <h1
            style={{ textAlign: "center" }}
        >
            Secretary Problem Simulator
        </h1>
        <div>
            The Secretary Problem is an oft-studied problem in statistics, probabilities, and decision-making. A common description of the problem goes something like this:
            <div
                style={{ margin: "10px 80px 0px 30px" }}
            >
                Imagine an administrator who wants to hire the best secretary out of <i>n</i> rankable candidates for a position. The candidates are interviewed one by one in random order. A decision about each particular candidate must be made immediately after the interview. Once rejected, an candidate cannot be recalled. During the interview, the administrator gains information sufficient to rank the candidate among all candidates interviewed so far, but is unaware of the quality of yet unseen candidates. The problem faced by the administrator is <b>deciding the optimal strategy to maximize the probability of selecting the best candidate.</b> If the decision can be deferred to the end, then the problem is trivial -- simply choose the highest-ranked candidate. The difficulty is that the decision to hire a candidate must be made immediately after assessing that candidate.
            </div>
        </div>
    </div>
);
