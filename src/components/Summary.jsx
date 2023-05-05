export const Summary = () => (
    <div>
        <div>
            <h4>In summary:</h4>
            <ul>
                <li>There is a single position to fill.</li>
                <li>There are <i>n</i> candidates for the position, and the value of <i>n</i> is known.</li>
                <li>The candidates, if all seen together, can be ranked from best to worst unambiguously.</li>
                <ul><li>Note that we are not concerned with the <i>absolute</i> quality of a candidate, only the relative quality (i.e. ranking).</li></ul>
                <li>The candidates are interviewed sequentially and in random order.</li>
                <li>A candidate is either accepted or rejected immediately after the inteview, and the decision is irrevocable.</li>
                <li><b>The decision to accept or reject a candidate can be based only on the relative ranks of the candidates interviewed so far.</b></li>
                <li>The administrator&apos;s objective is to have <b>the highest probability of selecting the best candidate of the whole group.</b></li>
                <ul><li>This is the same as maximizing the expected payoff, with payoff defined to be <b>1</b> for the best candidate and <b>0</b> otherwise.</li></ul>
            </ul>
        </div>
    </div>
);
