/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Route {
    path: string;
    name: string;
    exact: boolean;
    icon: any;
    page: any;
    inMenu?: boolean;
}