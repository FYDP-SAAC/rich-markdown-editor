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
                    console.log(selection.from)
                    console.log(selection.to)
                    state.doc.nodesBetween(
                    selection.from,
                    selection.to,
                    (node, position) => {
                        console.log(node.toJSON());
                        console.log(node.marks);
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