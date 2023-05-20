export const ColorLegend = ({ colorScheme }) => {
    const decimalPrecision = 1;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '5% auto'
        }}>
            {
                colorScheme.colorThresholds.map(({ color, threshold }) => (
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
                ))
            }
            <div
                key={"defaultColor"}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: 10
                }}
            >
                <div style={{
                    width: 20,
                    height: 20,
                    backgroundColor: colorScheme.defaultColor,
                    marginRight: 5,
                    border: '1px solid black',
                }} />
                <span>
                    {(100).toFixed(decimalPrecision)}%
                </span>
            </div>
        </div>
    );
};
