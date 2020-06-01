import { Plugin, PluginKey } from "prosemirror-state";
import Extension from "../lib/Extension";

export default class TagFiltering extends Extension {
  static pluginName = "tag-filtering";
  static pluginKey = new PluginKey(TagFiltering.pluginName);

  get name() {
    return TagFiltering.pluginName;
  }

  get plugins() {
    return [
      new Plugin({
        key: TagFiltering.pluginKey,
        state: {
          init: () => ({ idx: 0, val: null }),
          apply: (tr, v) => {
            const val = tr.getMeta(TagFiltering.pluginKey);
            if (val !== undefined) return { idx: v.idx + 1, val: val };
            return v;
          },
        },
        view: () => ({
          update: (view, prevEditorState) => {
            const state = TagFiltering.pluginKey.getState(view.state);
            const prevState = TagFiltering.pluginKey.getState(prevEditorState);
            if (state.idx !== prevState.idx) {
              // TODO new filters so have to refilter - iterate through all the nodes of the view.state.doc, and:
              // dispatch transaction(s) to set mark/attr to be hidden for nodes that match against state.tagFilters
            }
          },
        }),
      }),
    ];
  }
}
