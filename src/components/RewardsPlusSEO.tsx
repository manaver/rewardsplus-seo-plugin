import type { Metadata } from 'next';

interface BaseSEOProps {
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
    siteName?: string;
    twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
    twitterCreator?: string;
}

interface ArticleSchemaProps {
    publishedTime: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
    publisherName?: string;
    publisherLogoUrl?: string;
}

interface ProductSchemaProps {
    price: number | string;
    currency: string;
    availability?: 'in_stock' | 'out_of_stock' | 'preorder' | 'discontinued';
    brand?: string;
    sku?: string;
    gtin?: string;
    review?: ReviewSchemaProps;
}

interface ReviewSchemaProps {
    author: string;
    datePublished: string;
    reviewBody: string;
    ratingValue: number;
}

type PageType = 'home' | 'article' | 'category' | 'product' | 'other';

export interface RewardsPlusSEOProps extends BaseSEOProps {
    pageType: PageType;
    article?: ArticleSchemaProps;
    product?: ProductSchemaProps;
    additionalSchema?: Record<string, any>;
}

// --- Utility Functions ---
const schemaUrl = (path: string) => `https://schema.org/${path}`;

export default function generateRewardsPlusMetadata(props: RewardsPlusSEOProps): Metadata {
    const {
        pageType,
        title,
        description,
        url,
        imageUrl,
        article,
        product,
        additionalSchema,
        siteName,
        twitterCardType = 'summary',
        twitterCreator,
    } = props;

    const generateSchema = (): Record<string, any> | null => {
        let schema: Record<string, any> = {
            '@context': schemaUrl(''),
        };

        switch (pageType) {
            case 'home':
                schema['@type'] = 'WebSite';
                schema.url = url;
                schema.name = title;
                schema.description = description;
                break;

            case 'article':
                if (!article) {
                    console.error("RewardsPlusSEO: Article pageType requires 'article' prop.");
                    return null;
                }
                schema['@type'] = 'Article';
                schema.headline = title;
                schema.description = description;
                schema.image = imageUrl;
                schema.datePublished = article.publishedTime;
                if (article.modifiedTime) schema.dateModified = article.modifiedTime;
                if (article.author) {
                    schema.author = { '@type': 'Person', name: article.author };
                }
                if (article.publisherName) {
                    schema.publisher = {
                        '@type': 'Organization',
                        name: article.publisherName,
                        ...(article.publisherLogoUrl && {
                            logo: {
                                '@type': 'ImageObject',
                                url: article.publisherLogoUrl
                            }
                        })
                    }
                }
                schema.mainEntityOfPage = { '@type': 'WebPage', '@id': url };
                break;

            case 'category':
                schema['@type'] = 'CollectionPage';
                schema.url = url;
                schema.name = title;
                schema.description = description;
                break;

            case 'product':
                if (!product) {
                    console.error("RewardsPlusSEO: Product pageType requires 'product' prop.");
                    return null;
                }
                schema['@type'] = 'Product';
                schema.name = title;
                if (imageUrl) schema.image = imageUrl;
                schema.description = description;
                schema.url = url;
                if (product.brand) schema.brand = { '@type': 'Brand', name: product.brand };
                if (product.sku) schema.sku = product.sku;
                if (product.gtin) schema.gtin = product.gtin;

                const offer: Record<string, any> = {
                    '@type': 'Offer',
                    priceCurrency: product.currency,
                    price: product.price,
                    url: url,
                };
                if (product.availability) {
                    offer.availability = schemaUrl(product.availability);
                }
                schema.offers = offer;

                if (product.review) {
                    schema.review = {
                        '@type': 'Review',
                        reviewRating: {
                            '@type': 'Rating',
                            ratingValue: product.review.ratingValue,
                        },
                        author: {
                            '@type': 'Person',
                            name: product.review.author
                        },
                        datePublished: product.review.datePublished,
                        reviewBody: product.review.reviewBody
                    }
                }
                break;
            case 'other':
                if (!additionalSchema) {
                    console.error("RewardsPlusSEO: 'other' page type selected without additionalSchema");
                    return null;
                }
                schema = additionalSchema
                break;

            default:
                console.warn(`RewardsPlusSEO: Unknown pageType "${(pageType as string)}"`);
                return null;
        }

        if (additionalSchema) {
            schema = { ...schema, ...additionalSchema };
        }

        return Object.keys(schema).length > 1 ? schema : null;
    };

    const schema = generateSchema();

    const metadata: Metadata = {
        title: title,
        description: description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            type: pageType === 'article' ? 'article' : 'website',
            title: title,
            description: description,
            url: url,
            images: imageUrl ? [imageUrl] : undefined,
            siteName: siteName,
            ...(article && {
                publishedTime: article.publishedTime,
                modifiedTime: article.modifiedTime,
                tags: article.tags,
                authors: article.author ? [article.author] : undefined,
            }),
        },
        twitter: {
            card: twitterCardType,
            title: title,
            description: description,
            images: imageUrl ? [imageUrl] : undefined,
            creator: twitterCreator,
        },
    };

    if (schema) {
        metadata.other = {
            'application-ld+json': JSON.stringify(schema, null, 2),
        }
    }

    return metadata;
}