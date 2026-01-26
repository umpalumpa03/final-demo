export interface NavigationItem {
    label: string;
    icon?: string;
    route?: string;
    disabled?: boolean;
    count?: number;
}

export type NavigationOrientation = 'horizontal' | 'vertical';