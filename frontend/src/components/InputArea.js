import React, { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import "../styles/cursor-ai.css";

const InputArea = ({ onSend }) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;
    onSend(content);
    setContent("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="input-container">
      <div className="input-box">
        <textarea
          ref={textareaRef}
          className="input-field"
          placeholder="Message Gemini..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="input-controls">
          <button
            type="button"
            className="send-btn"
            onClick={handleSubmit}
            disabled={!content.trim()}
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
