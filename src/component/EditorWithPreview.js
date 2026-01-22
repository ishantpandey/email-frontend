"use client";
import { useRef } from "react";
import { Editor } from "primereact/editor";

const formatHtml = (html) => (html ?? "").replace(/></g, ">\n<").trim();

export default function EditorWithPreview({
  value = "",
  onChange = () => {},
  initialContent = "",
  className = "",
  editorHeight = "320px"
}) {
  const editorRef = useRef(null);
  const formattedHtml = formatHtml(value);

  const handleTextChange = (event) => {
    onChange(event.htmlValue ?? "");
  };

  return (
    <section className={`mx-auto grid w-full max-w-6xl gap-6  ${className}`}>
      <div>
        <Editor
          ref={editorRef}
          value={value}
          onTextChange={handleTextChange}
          className={`overflow-hidden rounded-xl w-full border border-slate-200`}
          style={{ height: editorHeight }}
          pt={{
            toolbar: { className: "rounded-t-xl" },
            content: { className: "rounded-b-xl" },
          }}
        />
      </div>

     
    </section>
  );
}