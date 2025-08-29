// src/components/MarkdownRenderer.jsx
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useCallback } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

/**
 * Improved, more pleasant color combo and layout for markdown content.
 * - Wraps content in a soft card with light/dark variants
 * - Uses indigo as accent color for headings & links
 * - Softer blockquotes, tables, and images
 * - Code blocks visually integrated in a rounded panel
 */

function CodeBlock({ className = "", children = [] }) {
  const code = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : null;

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      console.error("Copy failed", e);
    }
  }, [code]);

  // Panel wrapper so code block blends with page theme
  return (
    <div className="relative my-6">
      <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {language ? language.toUpperCase() : "CODE"}
          </span>
          <button
            onClick={handleCopy}
            className="text-xs px-2 py-1 rounded bg-white/90 dark:bg-black/60 border text-gray-700 dark:text-gray-200 hover:opacity-95"
            aria-label="Copy code"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900">
          {language ? (
            <SyntaxHighlighter
              style={dracula}
              language={language}
              PreTag="div"
              customStyle={{ background: "transparent", padding: 0, margin: 0 }}
              showLineNumbers={false}
            >
              {code}
            </SyntaxHighlighter>
          ) : (
            <pre className="text-sm whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200">
              <code>{code}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarkdownRenderer({ children }) {
  return (
    <div className="max-w-none">
      {/* Card wrapper to improve background/text contrast */}
      <div className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        {/* Use prose for typographic defaults but keep custom overrides */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-a:text-indigo-600 prose-a:underline hover:prose-a:decoration-2">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              // Headings with accent color
              h1: ({ node, ...props }) => (
                <h1
                  className="text-3xl md:text-4xl font-extrabold mt-1 mb-4 leading-tight text-indigo-600 dark:text-indigo-300"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl md:text-3xl font-bold mt-6 mb-3 text-indigo-600 dark:text-indigo-300"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-xl font-semibold mt-5 mb-2 text-indigo-700 dark:text-indigo-200"
                  {...props}
                />
              ),
              h4: ({ node, ...props }) => (
                <h4
                  className="text-lg font-semibold mt-4 mb-2 text-indigo-700 dark:text-indigo-200"
                  {...props}
                />
              ),

              // Paragraph
              p: ({ node, children, ...props }) => (
                <p
                  className="leading-relaxed text-base my-2 text-gray-700 dark:text-gray-300"
                  {...props}
                >
                  {children}
                </p>
              ),

              // Links - indigo accent
              a: ({ node, ...props }) => (
                <a
                  className="text-indigo-600 dark:text-indigo-300 underline decoration-indigo-200 hover:decoration-indigo-400"
                  {...props}
                />
              ),

              // Images - elevated and contained
              img: ({ node, ...props }) => (
                <figure className="my-4">
                  <img
                    {...props}
                    loading="lazy"
                    className="w-full rounded-lg shadow-sm object-contain border border-gray-100 dark:border-gray-800"
                    alt={props.alt || ""}
                  />
                  {props.alt && (
                    <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {props.alt}
                    </figcaption>
                  )}
                </figure>
              ),

              // Blockquote - soft indigo background
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-indigo-300 pl-4 italic text-gray-700 dark:text-gray-200 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-md py-3 my-4"
                  {...props}
                />
              ),

              // Lists
              ul: ({ node, ...props }) => (
                <ul className="list-disc ml-6 my-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal ml-6 my-2" {...props} />
              ),

              // Tables - subtle borders and rounded container
              table: ({ node, ...props }) => (
                <div className="overflow-auto my-4 rounded-md border border-gray-100 dark:border-gray-800">
                  <table
                    className="min-w-full divide-y divide-gray-200"
                    {...props}
                  />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead className="bg-gray-50 dark:bg-slate-800/60" {...props} />
              ),
              th: ({ node, children, ...props }) => (
                <th
                  className="px-3 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200"
                  {...props}
                >
                  {children}
                </th>
              ),
              td: ({ node, children, ...props }) => (
                <td
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300"
                  {...props}
                >
                  {children}
                </td>
              ),

              // Inline code: subtle indigo tint instead of harsh gray
              code: ({
                node,
                inline,
                className,
                children: codeChildren,
                ...props
              }) => {
                const isInline = inline === true;
                if (isInline) {
                  return (
                    <code
                      className="bg-indigo-50 dark:bg-indigo-900/40 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-700 dark:text-indigo-200"
                      {...props}
                    >
                      {codeChildren}
                    </code>
                  );
                }
                // block-level code -> handled by CodeBlock
                // eslint-disable-next-line react/no-children-prop
                return (
                  <CodeBlock
                    className={className}
                    children={codeChildren}
                    {...props}
                  />
                );
              },

              // Horizontal rule
              hr: ({ node, ...props }) => (
                <hr
                  className="my-6 border-gray-200 dark:border-gray-700"
                  {...props}
                />
              ),
            }}
          >
            {children}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
