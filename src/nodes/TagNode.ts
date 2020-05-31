import { wrappingInputRule } from "prosemirror-inputrules";
import Node from "./Node";
import toggleWrap from "../commands/toggleWrap";

export default class TagNode extends Node{
    get name(){
        return "tag";
    }

    get schema(){
        return{
            content: "block+",      
            group: "block",
            parseDOM: [
                {tag: "tag"},
            ],
            toDOM: () => ["tag", 0],
        }
    }

    inputRules({ type }) {
        return [wrappingInputRule(/^\s*:\s$/, type)];
    }

    commands({ type }) {
        return () => toggleWrap(type);
    }

    toMarkdown(state, node) {
        state.wrapBlock(": ", null, node, () => state.renderContent(node));
    }

    parseMarkdown() {
        return { block: "tag" };
    }
}