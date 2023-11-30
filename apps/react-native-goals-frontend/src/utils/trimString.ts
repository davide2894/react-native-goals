export default function trimString(stringToTrim: string) {
  // replace extra spaces with one
  return stringToTrim.replace(/\s\s+/g, " ");
}
