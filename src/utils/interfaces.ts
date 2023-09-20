export type Group = {
    key: string;
    name: string;
    products?: Product[];
};

export type Product = {
    key: string;
    name: string;
    basePrice: number;
    avgLastPrice: number;
    links?: Link[];
};

export type Link = {
    link: string;
    lastPrice: number;
}

export type FirebaseIdToken = {
    uid: string;
    email: string;
    email_verified: boolean;
    phone_number?: string;
    name?: string;
    picture?: string;
}