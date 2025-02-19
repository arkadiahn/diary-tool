import { remark } from "remark";
import html from "remark-html";
import "./markdown-auto.css";

export default async function MarkdownRenderer({ markdown }: { markdown: string }) {
    const processedContent = await remark().use(html).process(markdown);
    const descriptionHtml = processedContent.toString();

    return (
        <div
            className="markdown-body !bg-transparent"
            // biome-ignore lint/security/noDangerouslySetInnerHTML: Markdown content is processed through remark which sanitizes the HTML
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
    );
}
