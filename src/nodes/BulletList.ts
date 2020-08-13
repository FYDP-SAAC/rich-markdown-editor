import { wrappingInputRule } from "prosemirror-inputrules";
import toggleList from "../commands/toggleList";
import Node from "./Node";

export default class BulletList extends Node {
  get name() {
    return "bullet_list";
  }

  get schema() {
    return {
      attrs: {
        tags: {
          default: [],
        },
        hidden: {
          default: false,
        },
      },
      content: "list_item+",
      group: "block",
      parseDOM: [
        {
          tag: "ul",
          getAttrs: dom => ({ hidden: dom.class === "hidden" }),
        },
      ],
      toDOM: node => {
        if (node.attrs.hidden) {
          return ["ul", { class: "hidden" }, 0];
        }
        return ["ul", 0];
      },
    };
  }

  commands({ type, schema }) {
    return () => toggleList(type, schema.nodes.list_item);
  }

  keys({ type, schema }) {
    return {
      "Shift-Ctrl-8": toggleList(type, schema.nodes.list_item),
    };
  }

  inputRules({ type }) {
    return [wrappingInputRule(/^\s*([-+*])\s$/, type)];
  }

  toMarkdown(state, node) {
    state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ");
  }

  parseMarkdown() {
    return { block: "bullet_list" };
  }
}
