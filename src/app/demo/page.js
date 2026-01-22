"use client";

import { useState } from "react";
import EditorWithPreview from "@/component/EditorWithPreview";
import { Chips } from "primereact/chips";


const initialContent = `
<h2>PrimeReact Editor</h2>
<p>Use the toolbar above to format text. Preview and copy the generated HTML on the right.</p>
<ul>
  <li>Headings, lists, and inline styles are supported.</li>
  <li>The HTML column shows the exact markup.</li>
</ul>
`;

export default function DemoPage() {
  const [value, setValue] = useState([]);

  return (
    <main className="grid gap-6 px-6 py-6 md:px-10">
      <section className="mx-auto max-w-4xl text-center">
                  

        <h1 className="text-3xl font-semibold text-slate-900">PrimeReact editor demo</h1>
        <p className="mt-3 text-sm text-slate-600">
          Compose content in the editor on the left and review the generated HTML on the right.
        </p>
      </section>
       <div className="card p-fluid">
            <Chips value={value} onChange={(e) => setValue(e.value)} />
        </div>

      {/* <EditorWithPreview
        value={value}
        onChange={setValue}
        editorHeight="320px"
      /> */}
    </main>
  );
}
