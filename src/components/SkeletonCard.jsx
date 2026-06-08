import "./SkeletonCard.css";

function SkeletonCard() {
    return (
        <div className="skeleton-card">
            
            <div className="skeleton-image"/>

            <div className="skeleton-content">
                <div className="skeleton-line skeleton-title"/>
                <div className="skeleton-line skeleton-badge"/>
                <div className="skeleton-line skeleton-text"/>
            </div>
        </div>
    );
}

export default SkeletonCard;