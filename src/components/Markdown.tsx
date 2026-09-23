import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders trusted admin-authored Markdown on the server (raw HTML is not allowed). */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-journal">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const external = href?.startsWith("http");
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
              </a>
            );
          },
          // eslint-disable-next-line @next/next/no-img-element
          img: ({ src, alt }) => <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" decoding="async" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
