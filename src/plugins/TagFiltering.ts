import { Plugin, PluginKey } from "prosemirror-state";
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

  static evaluateTagFilters = (
    tr,
    schema,
    tagFilters,
    node,
    parent,
    parentTags,
    pos
  ) => {
    let match = false;
    const nodeTags = new Set([...parentTags]);
    const isTagFilterableBlock =
      (node.isTextblock && parent.type !== schema.nodes.list_item) ||
      node.type === schema.nodes.bullet_list ||
      node.type === schema.nodes.ordered_list;
    if (isTagFilterableBlock) {
      for (const nodeTag of Object.keys(node.attrs.tags)) {
        nodeTags.add(nodeTag);
      }
      match = TagFiltering.matchTagFilters(nodeTags, tagFilters);
    }
    if (!node.isTextBlock) {
      let cumulativeChildSize = 1;
      for (let i = 0; i < node.childCount; ++i) {
        const child = node.child(i);
        const evaluateChild = TagFiltering.evaluateTagFilters(
          tr,
          schema,
          tagFilters,
          child,
          node,
          nodeTags,
          pos + cumulativeChildSize
        );
        tr = evaluateChild[0];
        cumulativeChildSize += child.nodeSize;
        match = match || evaluateChild[1];
      }
    }
    // TODO (carl) other types of nodes / blocks
    if (isTagFilterableBlock) {
      tr = tr.setNodeMarkup(pos - 1, node.type, {
        hidden: !match,
        tags: node.attrs.tags,
      });
    }
    return [tr, match];
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
          return TagFiltering.evaluateTagFilters(
            newState.tr,
            newState.schema,
            trTagFilters,
            newState.doc,
            null,
            new Set(),
            0
          )[0];
        },
      }),
    ];
  }
}
