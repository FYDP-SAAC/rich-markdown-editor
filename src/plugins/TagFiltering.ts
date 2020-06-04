import { Plugin, PluginKey } from "prosemirror-state";
import Extension from "../lib/Extension";
import Hide from "../marks/Hide";

export default class TagFiltering extends Extension {
  static PLUGIN_NAME = "tag-filtering";
  static pluginKey = new PluginKey(TagFiltering.PLUGIN_NAME);
  static TAG_REGEX = /#{[^{}]+}/g;

  static matchTextblockNode = (tag, tagFilters) => {
    // TODO (carl) tag marks not just string
    if (!tagFilters) {
      return true;
    }
    if (!Array.isArray(tagFilters)) {
      let filter = tagFilters.substring(2, tagFilters.length - 1);
      return tag.includes(filter);
    }
    // invariant: tagFilters isArray
    // only not expressions have array length 2
    if (tagFilters.length === 2) {
      return !TagFiltering.matchTextblockNode(tag, tagFilters[1]);
    }
    const match1 = TagFiltering.matchTextblockNode(tag, tagFilters[0]);

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
    return TagFiltering.matchTextblockNode(tag, tagFilters[2]);
  };

  get name() {
    return TagFiltering.PLUGIN_NAME;
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
          if (trTagFilters === undefined || trTagFilters === null) {
            return;
          }
          let tr = null;
          const evaluate = (node, pos) => {
            let match = false;
            let allMarks = node.marks;
            let hasTag = false;
            let tag = "";
            for(let i = 0; i < allMarks.length; i++){
              let mark = allMarks[i];
              if(mark['type']['name'] == "tag"){
                hasTag = true;
                tag = mark['attrs']['name'];
                break;
              }
            }
            if (hasTag) {
              match = TagFiltering.matchTextblockNode(tag, trTagFilters);
            } else {
              let cumulativeChildSize = 0;
              for (let i = 0; i < node.childCount; ++i) {
                const child = node.child(i);
                const evaluateChild = evaluate(
                  child,
                  pos + cumulativeChildSize
               );
                match = match || evaluateChild[0];
                cumulativeChildSize += evaluateChild[1];
              }
            }
            let difPos = 0;
            if (node.type !== node.type.schema.doc) { // don't hide/unhide for the doc node
              let nodeMarks = node.marks;
              let hasHide = false;
              for(let i = 0; i < nodeMarks.length; i++){
                let mark = nodeMarks[i];
                if(mark['type']['name'] == "hide"){
                  nodeMarks = true;
                  break;
                }
              }
              if (!match) {
                // TODO (carl) actually hide
                if (
                  node.text != undefined &&
                  !hasHide
                ) {
                  const endPos =
                    pos + (node.textContent.startsWith("${unhide} ") ? 10 : 0);
                  difPos = pos + 8 - endPos;
                  tr = (tr || newState.tr).addMark(
                    pos, pos+node.text.length, newState.schema.marks.hide.create()
                  );
                }
              } else {
                // TODO (carl) actually detect hidden and unhide
                if (
                  node.text != undefined
                ) {
                  difPos = -8;
                  tr = (tr || newState.tr).removeMark( pos, pos+node.text.length, newState.schema.marks.hide);
                }
              }
            }
            return [match, node.nodeSize];
          };
          
          const traverse = (node) => {
            for (let i = 0; i < node.childCount; ++i) {
              const child = node.child(i);
              traverse(child);
              }
          }
          evaluate(newState.doc, 0);
          traverse(newState.doc);
          return tr;
        },
      }),
    ];
  }
}
