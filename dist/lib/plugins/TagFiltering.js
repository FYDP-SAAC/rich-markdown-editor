"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_state_1 = require("prosemirror-state");
const Extension_1 = __importDefault(require("../lib/Extension"));
class TagFiltering extends Extension_1.default {
    get name() {
        return TagFiltering.PLUGIN_NAME;
    }
    get plugins() {
        return [
            new prosemirror_state_1.Plugin({
                key: TagFiltering.pluginKey,
                state: {
                    init: () => null,
                    apply: (tr, v) => {
                        const val = tr.getMeta(TagFiltering.pluginKey);
                        return val === undefined ? v : val;
                    },
                },
                appendTransaction: (transactions, oldState, newState) => {
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
                            const nodeTagsIt = node.textContent.matchAll(TagFiltering.TAG_REGEX);
                            for (const nodeTag of nodeTagsIt) {
                                nodeTags.add(nodeTag[0]);
                            }
                            match = TagFiltering.matchTagFilters(nodeTags, trTagFilters);
                        }
                        else {
                            let cumulativeChildSize = 1;
                            for (let i = 0; i < node.childCount; ++i) {
                                const child = node.child(i);
                                const evaluateChild = evaluate(tr, child, node, nodeTags, pos + cumulativeChildSize, offset);
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
                        if ((node.isTextblock &&
                            parent.type !== newState.schema.nodes.list_item) ||
                            node.type === newState.schema.nodes.list_item) {
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
exports.default = TagFiltering;
TagFiltering.PLUGIN_NAME = "tag-filtering";
TagFiltering.pluginKey = new prosemirror_state_1.PluginKey(TagFiltering.PLUGIN_NAME);
TagFiltering.TAG_REGEX = /#{[^#{}]+}/g;
TagFiltering.matchTagFilters = (tags, tagFilters) => {
    if (!tagFilters) {
        return true;
    }
    if (!Array.isArray(tagFilters)) {
        return tags.has(tagFilters);
    }
    if (tagFilters.length === 2) {
        return !TagFiltering.matchTagFilters(tags, tagFilters[1]);
    }
    const match1 = TagFiltering.matchTagFilters(tags, tagFilters[0]);
    if (tagFilters.length === 1) {
        return match1;
    }
    const andOp = tagFilters[1] === "&";
    if (andOp !== match1) {
        return match1;
    }
    return TagFiltering.matchTagFilters(tags, tagFilters[2]);
};
//# sourceMappingURL=TagFiltering.js.map