import {
  splitListItem,
  sinkListItem,
  liftListItem,
} from "prosemirror-schema-list";
import Node from "./Node";

export default class ListItem extends Node {
  get name() {
    return "list_item";
  }

  get schema() {
    return {
      attrs: {
        hidden: {
          default: false,
        },
        tags: {
          default: {}
        }
      },
      content: "paragraph block*",
      defining: true,
      draggable: false,
      parseDOM: [
        {
          tag: "li",
          getAttrs: dom => ({ hidden: dom.class === "hidden" }),
        },
      ],
      toDOM: node => {
        if (node.attrs.hidden) {
          return ["li", { class: "hidden" }, 0];
        }
        return ["li", 0];
      },
    };
  }

  keys({ type }) {
    return {
      Enter: splitListItem(type),
      Tab: sinkListItem(type),
      "Shift-Tab": liftListItem(type),
      "Mod-]": sinkListItem(type),
      "Mod-[": liftListItem(type),
    };
  }

  toMarkdown(state, node) {
    state.renderContent(node);
  }

  parseMarkdown() {
    return { block: "list_item" };
  }
}
