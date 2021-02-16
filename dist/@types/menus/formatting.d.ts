import { EditorState } from "prosemirror-state";
export default function formattingMenuItems(state: EditorState): ({
    name: string;
    tooltip: string;
    icon: any;
    active: (state: any) => boolean;
    visible?: undefined;
    attrs?: undefined;
} | {
    name: string;
    visible: boolean;
    tooltip?: undefined;
    icon?: undefined;
    active?: undefined;
    attrs?: undefined;
} | {
    name: string;
    tooltip: string;
    icon: any;
    active: (state: any) => any;
    attrs: {
        level: number;
        href?: undefined;
    };
    visible: boolean;
} | {
    name: string;
    tooltip?: undefined;
    icon?: undefined;
    active?: undefined;
    visible?: undefined;
    attrs?: undefined;
} | {
    name: string;
    tooltip: string;
    icon: any;
    active: (state: any) => boolean;
    attrs: {
        href: string;
        level?: undefined;
    };
    visible?: undefined;
})[];
//# sourceMappingURL=formatting.d.ts.map