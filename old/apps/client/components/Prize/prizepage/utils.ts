interface Node {
  type: string;
  content?: Node[];
  text?: string;
  marks?: { type: string }[];
}

function extractTextFromNode(node: Node): string {
  if (node.text) {
    return node.text;
  }

  if (node.content) {
    return node.content.map(extractTextFromNode).join('\n');
  }

  return '';
}

export function extractPlainTextFromEditor(jsonString: string): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- lets see fix there is a bug
  const data: Node = JSON.parse(jsonString);
  return extractTextFromNode(data);
}
