import React, { useState, useEffect} from "react";

function Countdown({onFinish}) {
  const [count, setCount] = useState(5);
  useEffect(() => {
    if (count > -1) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer); 
    } 
    else {
      const finishTimer = setTimeout(() => onFinish?.(), 999);
      return () => clearTimeout(finishTimer);
    }
  }, [count, onFinish]);
  return (
    <div className="countdown-container">
      <h1 className="countdown-text">
        {count > 0 ? count : "Loading.."}
      </h1>
    </div>
  )
}
export default Countdown;