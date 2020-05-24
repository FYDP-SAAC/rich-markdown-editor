import * as React from "react";
import { EditorView } from "prosemirror-view";
import { SearchResult } from "./LinkEditor";
declare type Props = {
    tooltip: typeof React.Component;
    commands: Record<string, any>;
    onSearchLink?: (term: string) => Promise<SearchResult[]>;
    onClickLink: (url: string) => void;
    view: EditorView;
};
export default class FloatingToolbar extends React.Component<Props> {
    state: {
        left: number;
        top: number;
        offset: number;
    };
    componentDidUpdate(): void;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=FloatingToolbar.d.ts.map