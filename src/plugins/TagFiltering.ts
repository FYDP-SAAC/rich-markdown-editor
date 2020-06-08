import { NodeRange } from "prosemirror-model";
import { Plugin, PluginKey } from "prosemirror-state";
import { findWrapping } from "prosemirror-transform";
import Extension from "../lib/Extension";

export default class TagFiltering extends Extension {
  static PLUGIN_NAME = "tag-filtering";
  static pluginKey = new PluginKey(TagFiltering.PLUGIN_NAME);
  static TAG_REGEX = /#{[^#{}]+}/g;

  get name() {
    return TagFiltering.PLUGIN_NAME;
  }

  static matchTagFilters = (tags, tagFilters) => {
    // TODO (carl) tag marks not just string
    if (!tagFilters) {
      return true;
    }
    if (!Array.isArray(tagFilters)) {
      return tags.has(tagFilters);
    }
    // invariant: tagFilters isArray
    // only not expressions have array length 2
    if (tagFilters.length === 2) {
      return !TagFiltering.matchTagFilters(tags, tagFilters[1]);
    }
    const match1 = TagFiltering.matchTagFilters(tags, tagFilters[0]);
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
    return TagFiltering.matchTagFilters(tags, tagFilters[2]);
  };

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
          const evaluate = (tr, node, parent, parentTags, pos, offset) => {
            let match = false;
            let nodeTags = new Set([...parentTags]);
            if (node.isTextblock) {
              const nodeTagsIt = node.textContent.matchAll(
                TagFiltering.TAG_REGEX
              );
              for (const nodeTag of nodeTagsIt) {
                nodeTags.add(nodeTag[0]);
              }
              match = TagFiltering.matchTagFilters(nodeTags, trTagFilters);
            } else {
              let cumulativeChildSize = 1;
              for (let i = 0; i < node.childCount; ++i) {
                const child = node.child(i);
                const evaluateChild = evaluate(
                  tr,
                  child,
                  node,
                  nodeTags,
                  pos + cumulativeChildSize,
                  offset
                );
                tr = evaluateChild[0];
                match = match || evaluateChild[1];
                offset = evaluateChild[3];
                cumulativeChildSize += child.nodeSize;
                if (node.type === newState.schema.nodes.list_item && i === 0) {
                  nodeTags = evaluateChild[2];
                }
              }
            }
            const difPos = 0;
            // TODO (carl) other types of nodes / blocks
            if (
              (node.isTextblock &&
                parent.type !== newState.schema.nodes.list_item) ||
              node.type === newState.schema.nodes.list_item
            ) {
              tr = (tr || newState.tr).setNodeMarkup(pos - 1, node.type, {
                hidden: !match,
              });
            }
            return [tr, match, nodeTags, offset + difPos];
          };
          return evaluate(null, newState.doc, null, new Set(), 0, 0)[0];
        },
      }),
    ];
  }
}
