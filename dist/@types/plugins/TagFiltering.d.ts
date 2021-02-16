import { Plugin, PluginKey } from "prosemirror-state";
import Extension from "../lib/Extension";
export default class TagFiltering extends Extension {
    static PLUGIN_NAME: string;
    static pluginKey: PluginKey<any, any>;
    static TAG_REGEX: RegExp;
    get name(): string;
    static matchTagFilters: (tags: any, tagFilters: any) => any;
    get plugins(): Plugin<any, any>[];
}
//# sourceMappingURL=TagFiltering.d.ts.map