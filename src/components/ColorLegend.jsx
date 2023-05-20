const decimalPrecision = 1;

const ColorSquareText = ({ color, threshold }) => (
    <div
        key={threshold}
        style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: 10
        }}
    >
        <div style={{
            width: 20,
            height: 20,
            backgroundColor: color,
            marginRight: 5,
            border: '1px solid black',
        }} />
        <span>
            {(threshold * 100).toFixed(decimalPrecision)}%
        </span>
    </div>
);

export const ColorLegend = ({ colorScheme }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '5% auto'
        }}>
            {
                colorScheme.colorThresholds.map(({ color, threshold }) => (
                    <ColorSquareText
                        key={threshold}
                        color={color}
                        threshold={threshold}
                    />
                ))
            }
            <ColorSquareText
                key={"defaultColor"}
                color={colorScheme.defaultColor}
                threshold={1}
            />
        </div>
    );
};
