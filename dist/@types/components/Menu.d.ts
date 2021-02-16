import * as React from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import theme from "../theme";
declare type MenuItem = {
    name: string | "separator";
    tooltip?: string;
    icon?: typeof React.Component;
    attrs?: Record<string, any>;
    active?: (state: EditorState) => boolean;
    visible?: boolean;
};
declare type Props = {
    tooltip: typeof React.Component;
    commands: Record<string, any>;
    view: EditorView;
    theme: typeof theme;
    items: MenuItem[];
};
declare class Menu extends React.Component<Props> {
    render(): JSX.Element;
}
declare const _default: React.ForwardRefExoticComponent<Pick<Props & React.RefAttributes<Menu>, "view" | "tooltip" | "key" | "ref" | "commands" | "items"> & {
    theme?: any;
}>;
export default _default;
//# sourceMappingURL=Menu.d.ts.map