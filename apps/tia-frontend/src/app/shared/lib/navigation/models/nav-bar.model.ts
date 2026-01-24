export interface NavigationItem {
    label: string;
    icon?: string;
    route?: string;
    disabled?: boolean;
}

export type NavigationOrientation = 'horizontal' | 'vertical';