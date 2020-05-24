import * as React from "react";
import { EditorView } from "prosemirror-view";
import { Mark } from "prosemirror-model";
import theme from "../theme";
export declare type SearchResult = {
    title: string;
    url: string;
};
declare type Props = {
    mark: Mark;
    from: number;
    to: number;
    tooltip: typeof React.Component;
    onSearchLink?: (term: string) => Promise<SearchResult[]>;
    onClickLink: (url: string) => void;
    view: EditorView;
    theme: typeof theme;
};
declare class LinkEditor extends React.Component<Props> {
    discardInputValue: boolean;
    initialValue: string;
    state: {
        selectedIndex: number;
        value: any;
        results: any[];
    };
    componentWillUnmount: () => void;
    save: (href: string) => void;
    handleKeyDown: (event: React.KeyboardEvent<Element>) => void;
    handleChange: (event: any) => Promise<void>;
    handleOpenLink: (event: any) => void;
    handleRemoveLink: () => void;
    handleSearchResultClick: (url: string) => (event: any) => void;
    moveSelectionToEnd: () => void;
    render(): JSX.Element;
}
declare const _default: React.ForwardRefExoticComponent<Pick<Props & React.RefAttributes<LinkEditor>, "mark" | "view" | "tooltip" | "key" | "ref" | "from" | "to" | "onSearchLink" | "onClickLink"> & {
    theme?: any;
}>;
export default _default;
//# sourceMappingURL=LinkEditor.d.ts.map