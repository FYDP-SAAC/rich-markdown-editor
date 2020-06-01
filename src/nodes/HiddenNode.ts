import { MarkdownSerializerState } from "prosemirror-markdown";
import { Node as ProsemirrorNode } from "prosemirror-model";
import Node from "./Node";

export default class HiddenNode extends Node { // TODO (carl)
  node: Node;

  get type() {
    return "hidden-node";
  }

  get schema() {
    return this.node.schema;
  }

  get markdownToken(): string {
    // TODO (carl) what is a markdown token
    return this.node.markdownToken;
  }

  toMarkdown(state: MarkdownSerializerState, node: ProsemirrorNode) {
    return this.node.toMarkdown(state, node);
  }

  parseMarkdown() {
    return this.node.parseMarkdown();
  }
}
