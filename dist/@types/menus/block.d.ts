export default function blockMenuItems(): ({
    name: string;
    title: string;
    keywords: string;
    icon: any;
    shortcut: string;
    attrs: {
        level: number;
        rowsCount?: undefined;
        colsCount?: undefined;
    };
} | {
    name: string;
    title?: undefined;
    keywords?: undefined;
    icon?: undefined;
    shortcut?: undefined;
    attrs?: undefined;
} | {
    name: string;
    title: string;
    icon: any;
    keywords: string;
    shortcut: string;
    attrs?: undefined;
} | {
    name: string;
    title: string;
    icon: any;
    shortcut: string;
    keywords?: undefined;
    attrs?: undefined;
} | {
    name: string;
    title: string;
    icon: any;
    attrs: {
        rowsCount: number;
        colsCount: number;
        level?: undefined;
    };
    keywords?: undefined;
    shortcut?: undefined;
} | {
    name: string;
    title: string;
    icon: any;
    shortcut: string;
    attrs: {
        level: number;
        rowsCount?: undefined;
        colsCount?: undefined;
    };
    keywords?: undefined;
} | {
    name: string;
    title: string;
    icon: any;
    keywords: string;
    shortcut?: undefined;
    attrs?: undefined;
})[];
//# sourceMappingURL=block.d.ts.map