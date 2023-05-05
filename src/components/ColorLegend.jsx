export const ColorLegend = ({ colorScheme }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
            {colorScheme.thresholds.map((colorPair) => (
                <div key={colorPair[0]} style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
                    <div
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: colorPair.color,
                            marginRight: 5,
                            border: '1px solid black',
                        }}
                    />
                    <span>{(colorPair.threshold * 100).toFixed(0)}%</span>
                </div>
            ))}
            <div key={"defaultColor"} style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
                <div
                    style={{
                        width: 20,
                        height: 20,
                        backgroundColor: colorScheme.default,
                        marginRight: 5,
                        border: '1px solid black',
                    }}
                />
                <span>{(1 * 100).toFixed(0)}%</span>
            </div>
        </div>
    );
};
