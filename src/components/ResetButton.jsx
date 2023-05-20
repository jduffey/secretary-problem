export const ResetButton = ({ myFunction }) => (
    <div
        role="button"
        onClick={() => myFunction()}
        style={{
            border: "1px solid black",
            borderRadius: "0.5em",
            fontSize: "1em",
            fontWeight: "bold",
            padding: "0.5em",
            textAlign: "center",
            cursor: "pointer",
            margin: "5% auto",
            backgroundColor: "lightgray",
            width: "10em",
        }}
    >
        Reset
    </div>
);