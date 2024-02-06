import { Link } from './link';

export interface SearchResult {
    data: any[];
    page: number;
    pages: number;
    rows: number;
    links: Link[];
}
