import hljs from "highlight.js";

import { CopyButton } from "./copy-button";

const languageLabels: Record<string, string> = {
  python: "Python",
  sql: "SQL",
  text: "نص",
  pseudo: "Pseudocode",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function CodeBlock({
  code,
  language = "text",
}: {
  code: string;
  language?: string;
}) {
  const highlightLanguage =
    language === "python" || language === "sql" ? language : "plaintext";

  let html = "";
  try {
    html = hljs.highlight(code, { language: highlightLanguage }).value;
  } catch {
    html = escapeHtml(code);
  }

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="font-medium">{languageLabels[language] ?? language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="code-block__body" dir="ltr">
        <code
          className="hljs"
          // The highlighted markup is produced server-side by highlight.js.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  );
}
