import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import Extension from "../lib/Extension";

export default class SelectedNode extends Extension {
    get name() {
        return "SelectedNode";
      }

    get plugins() {
        return [
            new Plugin({
                props: {
                decorations(state) {
                    const { selection } = state;
                    const decorations = [];
                    state.doc.nodesBetween(
                    selection.from,
                    selection.to,
                    (node, position) => {
                        if (node.isBlock) {
                        decorations.push(
                            Decoration.node(position, position + node.nodeSize, {
                            class: 'selectedNode'
                            })
                        )
                        }
                    }
                    )
                    return DecorationSet.create(state.doc, decorations);
                }
                }
            })
        ]
    }
    
}