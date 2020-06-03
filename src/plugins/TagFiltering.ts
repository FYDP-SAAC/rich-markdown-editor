import { Plugin, PluginKey } from "prosemirror-state";
import Extension from "../lib/Extension";

export default class TagFiltering extends Extension {
  static pluginName = "tag-filtering";
  static pluginKey = new PluginKey(TagFiltering.pluginName);

  static matchTextblockNode = (node, tagFilters) => {
    // TODO (carl) tag marks not just string
    if (!tagFilters) {
      return true;
    }
    if (!Array.isArray(tagFilters)) {
      return node.textContent.includes(tagFilters);
    }
    // invariant: tagFilters isArray
    // only not expressions have array length 2
    if (tagFilters.length === 2) {
      return !TagFiltering.matchTextblockNode(node, tagFilters[1]);
    }
    const match1 = TagFiltering.matchTextblockNode(node, tagFilters[0]);
    if (tagFilters.length === 1) {
      return match1;
    }
    // invariant: length 3, [1] is op, [2] is tag or sub expression
    const andOp = tagFilters[1] === "&";
    // short circuit evaluation
    if (andOp !== match1) {
      return match1;
    }
    // invariant:
    // if andOp then !match1, so result should be "match2",
    // if !andOp then match1, so result should be "match2"
    return TagFiltering.matchTextblockNode(node, tagFilters[2]);
  };

  get name() {
    return TagFiltering.pluginName;
  }

  get plugins() {
    return [
      new Plugin({
        key: TagFiltering.pluginKey,
        state: {
          init: () => null,
          apply: (tr, v) => {
            // TODO (carl) handle readonly toggling?
            const val = tr.getMeta(TagFiltering.pluginKey);
            return val === undefined ? v : val;
          },
        },
        appendTransaction: (transactions, oldState, newState) => {
          // TODO (carl) handle readonly toggling?
          // TODO (carl) trailing node?
          let trTagFilters = undefined;
          for (let i = transactions.length - 1; i >= 0; --i) {
            trTagFilters = transactions[i].getMeta(TagFiltering.pluginKey);
            if (trTagFilters !== undefined) {
              break;
            }
          }
          if (trTagFilters === undefined) {
            return;
          }
          let tr = null;
          const evaluate = (node, pos, offset) => {
            let match = false;
            if (node.isTextblock) {
              match = TagFiltering.matchTextblockNode(node, trTagFilters);
            } else {
              let cumulativeChildSize = 1;
              for (let i = 0; i < node.childCount; ++i) {
                const child = node.child(i);
                const evaluateChild = evaluate(
                  child,
                  pos + cumulativeChildSize,
                  offset
                );
                match = match || evaluateChild[0];
                offset = evaluateChild[1];
                cumulativeChildSize += child.nodeSize;
              }
            }
            let difPos = 0;
            if (node.type !== node.type.schema.doc) { // don't hide/unhide for the doc node
              if (!match) {
                // TODO (carl) actually hide
                if (
                  node.isTextblock &&
                  !node.textContent.startsWith("${hide} ")
                ) {
                  const endPos =
                    pos + (node.textContent.startsWith("${unhide} ") ? 10 : 0);
                  difPos = pos + 8 - endPos;
                  tr = (tr || newState.tr).insertText(
                    "${hide} ",
                    pos + offset,
                    endPos + offset
                  );
                }
              } else {
                // TODO (carl) actually detect hidden and unhide
                if (
                  node.isTextblock &&
                  node.textContent.startsWith("${hide} ")
                ) {
                  difPos = -8;
                  tr = (tr || newState.tr).insertText(
                    "",
                    pos + offset,
                    pos + offset + 8
                  );
                }
              }
            }
            return [match, offset + difPos];
          };
          evaluate(newState.doc, 0, 0);
          return tr;
        },
      }),
    ];
  }
}
