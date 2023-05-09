const colorSchemes = {
    "Standard Colors": {
        thresholds: {
            0.01: "#000000",
            0.05: "#FF00FF",
            0.10: "#FFFF00",
            0.20: "#FF8800",
            0.30: "#D00000",
            0.40: "#00FF00",
            0.50: "#00BB00",
            0.60: "#007700",
            0.70: "#00FFFF",
            0.80: "#00BFFF",
            0.90: "#4444FF",
        },
        defaultColor: "#CCCCCC",
    },
    "HAL 9000": {
        thresholds: {
            0.01: "#FFFF00",
            0.10: "#FF5555",
            0.20: "#DD0000",
            0.30: "#AA0000",
            0.40: "#333333",
            0.50: "#222222",
            0.60: "#111111",
            0.90: "#000000",
        },
        defaultColor: "#0F536D",
    },
    "Sunspot": {
        thresholds: {
            0.01: "#000000",
            0.20: "#E93E3A",
            0.40: "#ED683C",
            0.60: "#F3903F",
            0.80: "#FDC70C",
        },
        defaultColor: "#FFF33B",
    },
};

export default colorSchemes;