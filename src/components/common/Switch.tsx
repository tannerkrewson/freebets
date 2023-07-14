import React from "react";
import "./Switch.css";

export default function Switch() {
  const [checked, setChecked] = React.useState(false);

  const handleToggle = () => {
    setChecked(!checked);
  };

  return (
    <div className={`switch-container ${checked ? "checked" : ""}`} onClick={handleToggle}>
      <div className="switch">
        <div className="slider"></div>
      </div>
    </div>
  );
}
