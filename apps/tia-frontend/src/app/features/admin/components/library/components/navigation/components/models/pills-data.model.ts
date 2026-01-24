export interface Item {
    id: number;
    status: 'all' | 'active' | 'completed' | 'archived';
    name: string;
}