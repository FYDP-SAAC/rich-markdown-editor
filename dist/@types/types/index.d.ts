import * as React from "react";
export declare type EmbedDescriptor = {
    title?: string;
    name?: string;
    icon?: React.ReactNode;
    matcher: (url: string) => boolean | [];
    component: typeof React.Component;
};
//# sourceMappingURL=index.d.ts.map