import type React from "react";
import { useState } from "react";
import type { ListTileProps } from "../interface/IListTile";

const ListTile: React.FC<ListTileProps> = ({
  title,
  tag,
  isExpanded,
  onToggle,
  placeholders,
  onCall
}) => {
  const isWrite = tag === "WRITE";
  const [inputs, setInputs] = useState<string[]>(new Array(placeholders?.length || 0).fill(""));

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  return (
    <div className={`interaction-tile ${isExpanded ? "tile--expanded" : ""}`}>
      <div className="tile-header" onClick={onToggle}>
        <div className="tile-title-group">
          <span className="tile-title">{title}</span>
          <span
            className={`tile-tag ${isWrite ? "tag-write" : "tag-view"}`}
          >
            {tag}
          </span>
        </div>
        <span className="tile-arrow">▼</span>
      </div>

      <div className="tile-accordion-wrapper">
        <div className="tile-accordion-inner">
          <div className="tile-expanded-content">
            <div
              style={{
                display: "flex",
                gap: "12px",
                width: "100%",
                flexWrap: "wrap",
                alignItems: "center"
              }}
            >
              {placeholders && placeholders.length > 0 && (
                <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
                  {placeholders.map((placeholder, index) => (
                    <input
                      key={index}
                      className="load-token-input"
                      style={{ flex: 1, minWidth: '150px', height: "40px" }}
                      placeholder={placeholder}
                      value={inputs[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  ))}
                </div>
              )}
              <button 
                className="call-button"
                onClick={() => onCall!(inputs)}
                style={isWrite ? {
                  background: "var(--accent-purple)",
                  boxShadow: "0 0 12px rgba(168, 85, 247, 0.4)",
                  borderColor: "transparent"
                } : {}}
              >
                Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListTile;
