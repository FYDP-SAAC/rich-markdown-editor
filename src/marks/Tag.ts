import Mark from "./Mark";
import { InputRule } from "prosemirror-inputrules";
import { toggleMark } from "prosemirror-commands";

const TAG_REGEX = /:(.+):\(([^\)]+)\)/;

export default class Tag extends Mark {
  get name() {
    return "tag";
  }

  get schema() {
    return {
      attrs: {
        name: {
          default: null,
        },
      },
      parseDOM: [
        {
          tag: "tag[name]",
          getAttrs: (dom: HTMLElement) => ({
            name: dom.getAttribute("name"),
          }),
        },
      ],
      toDOM: node => [
        "tag",
        {
          ...node.attrs,
        },
        0,
      ],
    };
  }

  
  inputRules({ type }) {
    return [
      new InputRule(TAG_REGEX, (state, match, start, end) => {
        const [okay, name, content] = match;
        const { tr } = state;

        if (okay) {
          tr.replaceWith(start, end, this.editor.schema.text(content)).addMark(
            start,
            start+content.length,
            type.create({ name })
          );
        }

        return tr;
      }),
    ];
  }

  get toMarkdown() {
    return {
      open(state, mark, parent, index) {
        return ":" + state.esc(mark.attrs.name) + ":("
      },
      close(state, mark, parent, index) {
        return ")"
      },
    };
  }

  parseMarkdown() {
    return {
      mark: "tag",
      getAttrs: tok => ({
        name: tok.attrGet("name"),
      }),
    };
  }
}