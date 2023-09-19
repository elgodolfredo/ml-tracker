export type Group = {
    name: string;
    products: Product[];
};

export type Product = {
    name: string;
    basePrice: number;
    avgLastPrice: number;
    links: Link[];
};

export type Link = {
    link: string;
    lastPrice: number;
}