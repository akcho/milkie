interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
  return (
    <div className="relative">
      <pre className="text-xs overflow-x-auto p-4 rounded-lg border max-w-full bg-[var(--code-block-bg)] text-[var(--code-block-fg)]">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
