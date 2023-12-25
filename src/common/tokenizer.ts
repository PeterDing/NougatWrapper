export interface IToken {
  text: string;
  type: string;
}

export function markdownTokenize(text: string): IToken[] {
  const tokens: IToken[] = [];
  let p1 = 0;
  let p2 = 2;
  while (p2 < text.length) {
    const left = text.slice(p2 - 2, p2);
    let right = "";
    if (left == "\\(") {
      right = "\\)";
    } else if (left == "\\[") {
      right = "\\]";
    }
    if (right != "") {
      const tokenStr = text.slice(p1, p2 - 2);
      if (tokenStr != "") {
        tokens.push({
          text: tokenStr,
          type:
            tokenStr.startsWith("\\(") || tokenStr.startsWith("\\[")
              ? "latex"
              : "md",
        });
      }
      const p3 = text.indexOf(right, p2);
      if (p3 != -1) {
        tokens.push({ text: text.slice(p2 - 2, p3 + 2), type: "latex" });
        p1 = p3 + 2;
        p2 = p1;
      } else {
        p1 = p2 - 2;
        p2 += 2;
      }
    } else {
      p2 += 1;
    }
  }

  const tokenStr = text.slice(p1, p2);
  if (tokenStr != "") {
    tokens.push({
      text: tokenStr,
      type:
        tokenStr.startsWith("\\(") || tokenStr.startsWith("\\[")
          ? "latex"
          : "md",
    });
  }

  return tokens;
}
