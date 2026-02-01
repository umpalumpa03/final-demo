export interface NavigationItem {
    label: string;
    icon?: string;
    route?: string;
    disabled?: boolean;
    count?: number;
    exact?: boolean;
}

export type NavigationOrientation = 'horizontal' | 'vertical';