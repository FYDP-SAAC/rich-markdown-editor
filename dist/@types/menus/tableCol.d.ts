import { EditorState } from "prosemirror-state";
export default function tableColMenuItems(state: EditorState, index: any): ({
    name: string;
    tooltip: string;
    icon: any;
    attrs: {
        index: any;
        alignment: string;
    };
    active: (state: any) => any;
} | {
    name: string;
    tooltip?: undefined;
    icon?: undefined;
    attrs?: undefined;
    active?: undefined;
} | {
    name: string;
    tooltip: string;
    icon: any;
    active: () => boolean;
    attrs?: undefined;
})[];
//# sourceMappingURL=tableCol.d.ts.map