function SkeletonCard() {
    return (
        <div
            style={{
                width: 180,
                borderRadius: 12,
                overflow: "hidden",
                backgroundColor: "#f0f0f0",
            }}
            >
            <div
                style={{
                width: "100%",
                height: 270,
                backgroundColor: "#ddd",
                animation: "pulse 1.5s infinite",
                }}
            />

            <div style={{ padding: 10 }}>
                <div
                    style={{
                        height: 20,
                        backgroundColor: "#ddd",
                        borderRadius: 4,
                        marginBottom: 10,
                        animation: "pulse 1.5s infinite",
                    }}
                />

                <div
                    style={{
                        width: 60,
                        height: 20,
                        backgroundColor: "#ddd",
                        borderRadius: 4,
                        marginBottom: 10,
                        animation: "pulse 1.5s infinite",
                    }}
                />

                <div
                    style={{
                        width: 80,
                        height: 16,
                        backgroundColor: "#ddd",
                        borderRadius: 4,
                        animation: "pulse 1.5s infinite",
                    }}
                />
            </div>
        </div>
    );
}

export default SkeletonCard;