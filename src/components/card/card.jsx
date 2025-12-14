import "./card.css"
function Card({title, desc}) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-content">{desc}</div>
    </div>
  );
}
export default Card;
