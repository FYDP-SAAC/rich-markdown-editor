export default function tableRowMenuItems(state: any, index: any): ({
    name: string;
    tooltip: string;
    icon: any;
    attrs: {
        index: number;
    };
    active: () => boolean;
    visible: boolean;
} | {
    name: string;
    tooltip: string;
    icon: any;
    attrs: {
        index: any;
    };
    active: () => boolean;
    visible?: undefined;
} | {
    name: string;
    tooltip?: undefined;
    icon?: undefined;
    attrs?: undefined;
    active?: undefined;
    visible?: undefined;
} | {
    name: string;
    tooltip: string;
    icon: any;
    active: () => boolean;
    attrs?: undefined;
    visible?: undefined;
})[];
//# sourceMappingURL=tableRow.d.ts.map