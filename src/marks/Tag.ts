import { toggleMark } from "prosemirror-commands";
import markInputRule from "../lib/markInputRule";
import Mark from "./Mark";

export default class Tag extends Mark {
  get name() {
    return "tag";
  }

  get schema() {
    return {
      attrs: {
        name: {
          default: "ExampleTag",
        },
      },
      parseDOM: [{ tag: "tag" }],
      toDOM: () => ["tag"],
    };
  }

  inputRules({ type }){
      return[markInputRule(/(?::)([^=]+)(?::)$/, type)]
  }

  get toMarkdown() {
    return {
      open: ":",
      close: ":",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "tag" };
  }

}
