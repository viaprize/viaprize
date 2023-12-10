import { Parser } from "htmlparser2";

export function htmlToPlainText(html: string): string {
    let textContent = '';

    const parser = new Parser(
        {
            ontext: (text) => {
                textContent += text;
            },
        },
        { decodeEntities: true },
    );

    parser.write(html);
    parser.end();

    return textContent;
}