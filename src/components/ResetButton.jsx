export const ResetButton = ({ myFunction }) => (
    <button
        onClick={() => myFunction()}
        style={{
            border: "1px solid black",
            borderRadius: "0.25em",
            fontSize: "1em",
            fontWeight: "bold",
            padding: "0.2em",
            textAlign: "center",
            cursor: "pointer",
            margin: "auto",
            backgroundColor: "lightgray",
            width: "8em",
            display: "block",
            appearance: "none",
        }}
    >
        Reset
    </button>
);