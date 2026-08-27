import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

import { CopyButton } from "./copy-button";

const languageLabels: Record<string, string> = {
  python: "Python",
  sql: "SQL",
  text: "نص",
  pseudo: "Pseudocode",
};

function extractText(node: unknown): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object") {
    const record = node as Record<string, unknown>;
    if (typeof record.value === "string") return record.value;
    if (Array.isArray(record.children)) return extractText(record.children);
  }
  return "";
}

const components: Components = {
  pre({ children }) {
    return <>{children}</>;
  },
  code({ node, className, children, ...props }) {
    const classNames = (className ?? "").split(" ");
    const isBlock = classNames.some((name) => name.startsWith("language-"));

    if (!isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    const language = classNames
      .find((name) => name.startsWith("language-"))
      ?.replace("language-", "");
    const codeText = extractText(node);

    return (
      <div className="code-block">
        <div className="code-block__header">
          <span className="font-medium">
            {language ? (languageLabels[language] ?? language) : "كود"}
          </span>
          <CopyButton text={codeText} />
        </div>
        <pre className="code-block__body" dir="ltr">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  },
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="md-content" dir="rtl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
