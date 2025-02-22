import type { ScriptProps } from 'next/script';

export interface BaseSEOProps {
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
    siteName?: string;
    twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
    twitterCreator?: string;
}

export interface ArticleSchemaProps {
    publishedTime: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
    publisherName?: string;
    publisherLogoUrl?: string;
}

export interface ProductSchemaProps {
    price: number | string;
    currency: string;
    availability?: 'in_stock' | 'out_of_stock' | 'preorder' | 'discontinued';
    brand?: string;
    sku?: string;
    gtin?: string;
    review?: ReviewSchemaProps;
}

export interface ReviewSchemaProps {
    author: string;
    datePublished: string;
    reviewBody: string;
    ratingValue: number;
}

export type PageType = 'home' | 'article' | 'category' | 'product' | 'other';

export interface RewardsPlusSEOProps extends BaseSEOProps {
    pageType: PageType;
    article?: ArticleSchemaProps;
    product?: ProductSchemaProps;
    additionalSchema?: Record<string, any>;
}

export interface SchemaOrgBase {
    '@context': 'https://schema.org' | string;
    '@type': string;
    [key: string]: any;
}

export interface SchemaOrgScriptProps<T extends SchemaOrgBase = SchemaOrgBase> {
    schema?: T | null;
    jsonLdString?: string | null;
    strategy?: ScriptProps['strategy'];
    id?: string;
}