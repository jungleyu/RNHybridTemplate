import remend from 'remend';

const remendConfig = {
    bold: true,
    italic: true,
    boldItalic: true,
    strikethrough: true,
    links: true,
    linkMode: 'text-only' as const,
    images: true,
    inlineCode: true,
    katex: false,
    setextHeadings: true,
};

export function processRemendInWorklet(
    markdown: string,
    onComplete: (result: string) => void
) {
    const result = remend(markdown, remendConfig);
    onComplete(result);
}