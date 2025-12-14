import "./miniCard.css"
function MiniCard({title, desc}) {
    return (
        <div className="mini-card">
            <div className="mini-card-title">{title}</div>
            <div className="mini-card-content">{desc}</div>
        </div>
    );
}
export default MiniCard;