//credits: gist.github.com/nathansmith/86b5d4b23ed968a92fd4#file-2-converttotext-js

export default function trimString(stringToTrim: string) {
  return stringToTrim
    .trim()
    .replace(/(?:^[\s\u00a0]+)/g, "")
    .replace(/(?:[\s\u00a0]+$)/g, "")
    .replace(/&nbsp;/gi, "")
    .replace(/<br>/gi, "\n")
    .replace(/<div>/gi, "\n")
    .replace(/<(.*?)>/gi, "")
    .split("\n")
    .map((line) => {
      return line.trim();
    })
    .join("\n");
}
