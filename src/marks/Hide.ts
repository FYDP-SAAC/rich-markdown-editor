import markInputRule from "../lib/markInputRule";
import Mark from "./Mark";

export default class Hide extends Mark {
  get name() {
    return "hide";
  }

  get schema() {
    return {
      parseDOM: [{ tag: "hide" }],
      toDOM: () => ["hide"],
    };
  }

  get toMarkdown() {
    return {
      open: "++",
      close: "++",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "hide" };
  }
}
