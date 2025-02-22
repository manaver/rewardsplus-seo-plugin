# RewardsPlusSEO

A Next.js plugin for easily generating SEO metadata, including Schema.org structured data, Open Graph tags, and Twitter Cards, using the `Metadata` object (compatible with the `app` directory in Next.js 13/14).

## Features

*   ✅ Supports dynamic pages (Home, Article, Category, Product, and custom types)
*   ✅ Generates JSON-LD (Schema.org) for better SEO
*   ✅ Supports Open Graph (Facebook, Twitter previews)
*   ✅ Can be used across multiple websites
*   ✅ Easily configurable via props
*   ✅ Published as an NPM package for easy installation
*   ✅ Compatible with Next.js 13/14's `app` directory and Server Components

## Installation

```bash
yarn add @your-npm-scope/rewardsplusseo  # Replace with your actual package name
```

Or, with npm:

```bash
npm install @your-npm-scope/rewardsplusseo
```

## Usage

This package provides a function, `generateRewardsPlusMetadata`, which you use to generate a `Metadata` object for your Next.js pages.  This function should be called within the `generateMetadata` function (for dynamic routes) or assigned directly to the `metadata` export (for static routes) in your page components within the `app` directory.

**Basic Example (Static Route - `app/page.tsx` or `app/about/page.tsx`):**

```typescript
// app/page.tsx
import type { Metadata } from 'next';
import { generateRewardsPlusMetadata, RewardsPlusSEOProps } from '@your-npm-scope/rewardsplusseo';

const seoProps: RewardsPlusSEOProps = {
  pageType: 'home',
  title: 'My Awesome Website',
  description: 'Welcome to my amazing website!',
  url: '[https://www.example.com](https://www.example.com)',
  siteName: 'Example Site',
};

export const metadata: Metadata = generateRewardsPlusMetadata(seoProps);

export default function Home() {
  return (
    <div>
      <h1>Welcome!</h1>
    </div>
  );
}
```

**Dynamic Route Example (`app/articles/[slug]/page.tsx`):**

```typescript
// app/articles/[slug]/page.tsx
import type { Metadata, GetStaticPaths } from 'next';
import { generateRewardsPlusMetadata, RewardsPlusSEOProps } from '@your-npm-scope/rewardsplusseo';

interface ArticleProps { // Define props for clarity (optional, but recommended)
  title: string;
  content: string;
  slug: string;
  publishedTime: string;
  author: string;
  tags: string[];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    // Fetch article data (replace with your actual data fetching)
    const slug = params.slug;
    const articleData = {
        title: `Article: ${slug}`,
        content: `This is the content for article ${slug}...`,
        slug: slug,
        publishedTime: new Date().toISOString(),
        author: 'Jane Doe',
        tags: ['nextjs', 'seo', 'example']
    };

  const url = `https://www.example.com/articles/${slug}`;
  const seoProps: RewardsPlusSEOProps = {
    pageType: 'article',
    title: articleData.title,
    description: articleData.content.substring(0, 160), // Short description
    url,
    imageUrl: `/images/articles/${slug}.jpg`, // Example image URL
    article: {
      publishedTime: articleData.publishedTime,
      modifiedTime: articleData.publishedTime,
      author: articleData.author,
      tags: articleData.tags,
    },
  };

  return generateRewardsPlusMetadata(seoProps);
}


export default function Article({ params }: { params: { slug: string } }) {
  // You'll likely need to fetch the data again here, or use a Client Component and a hook like SWR
  const articleData = { // Replace with your data fetching inside a client component
    title: `Article: ${params.slug}`,
    content: `This is the content for article ${params.slug}...`,
    slug: params.slug,
    publishedTime: new Date().toISOString(),
    author: 'Jane Doe',
    tags: ['nextjs', 'seo', 'example']
  };
  return (
    <div>
      <h1>{articleData.title}</h1>
      <p>{articleData.content}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch your article slugs from your data source.
  const slugs = ['article-1', 'article-2', 'article-3'];

  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return { paths, fallback: false }; // Or 'blocking' or true
};
```

**Product Page Example (`app/products/[slug]/page.tsx`):**

```typescript
// app/products/[slug]/page.tsx
import type { Metadata, GetStaticPaths } from 'next';
import { generateRewardsPlusMetadata, RewardsPlusSEOProps } from '@your-npm-scope/rewardsplusseo';

interface ProductProps { // Define type
  title: string;
  description: string;
  slug: string;
  imageUrl: string;
  price: number;
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'preorder' | 'discontinued';
  brand: string;
  sku?: string;
  gtin?: string;
  review?: {
    author: string;
    datePublished: string;
    reviewBody: string;
    ratingValue: number;
  };
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {

    const slug = params.slug;
    // Fetch product data (replace with your actual data fetching)
    const productData: ProductProps = {
        title: `Product: ${slug}`,
        description: `Description for product ${slug}...`,
        slug: slug,
        imageUrl: `/images/products/${slug}.jpg`, // Example image URL
        price: 99.99,
        currency: 'USD',
        availability: 'in_stock',
        brand: 'Example Brand',
        sku: '12345-ABC',
        gtin: '9780201379624', // Example GTIN
        review: {
          author: 'John Doe',
          datePublished: '2023-11-15T12:00:00Z',
          reviewBody: 'This product is amazing!  Highly recommended.',
          ratingValue: 5,
        },
      };

  const url = `https://www.example.com/products/${slug}`;
  const seoProps: RewardsPlusSEOProps = {
    pageType: 'product',
    title: productData.title,
    description: productData.description,
    url,
    imageUrl: productData.imageUrl,
    product: {
      price: productData.price,
      currency: productData.currency,
      availability: productData.availability,
      brand: productData.brand,
      sku: productData.sku,
      gtin: productData.gtin,
      review: productData.review,
    },
  };

  return generateRewardsPlusMetadata(seoProps);
}

export default function Product({params}:{params: {slug: string}}) {
  //Fetch data here also, or inside client component
  const productData = { // Replace
        title: `Product: ${params.slug}`,
        description: `Description for product ${params.slug}...`,
        slug: params.slug,
        imageUrl: `/images/products/${params.slug}.jpg`, // Example image URL
        price: 99.99,
        currency: 'USD',
        availability: 'in_stock',
        brand: 'Example Brand',
        sku: '12345-ABC',
        gtin: '9780201379624', // Example GTIN
        review: {
          author: 'John Doe',
          datePublished: '2023-11-15T12:00:00Z',
          reviewBody: 'This product is amazing!  Highly recommended.',
          ratingValue: 5,
        },
      };
  return (
    <div>
      <h1>{productData.title}</h1>
      <p>{productData.description}</p>
      {/* ... your product page content ... */}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = ['product-1', 'product-2']; // Replace with real slugs
    const paths = slugs.map(slug => ({params: {slug}}));

    return {paths, fallback: false}
}
```

**Other Page (`app/faq/page.tsx` - Using `additionalSchema`):**
```typescript
import type { Metadata } from 'next';
import { generateRewardsPlusMetadata, RewardsPlusSEOProps } from '@your-npm-scope/rewardsplusseo';

const seoProps: RewardsPlusSEOProps = {
  pageType: 'other',
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about our products and services.',
  url: '[https://www.example.com/faq](https://www.google.com/search?q=https://www.example.com/faq)',
  additionalSchema: {
    '@context': '[https://schema.org](https://schema.org)',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is your return policy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer a 30-day return policy for most items...',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I contact customer support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can contact us by phone, email, or live chat...',
        },
      },
      // ... more FAQ items ...
    ],
  },
};

export const metadata: Metadata = generateRewardsPlusMetadata(seoProps);

export default function FAQ() {
  return (
    <div>
      <h1>Frequently Asked Questions</h1>
    </div>
  )
}

```
## Props

The `generateRewardsPlusMetadata` function accepts a single argument, an object of type `RewardsPlusSEOProps`, which has the following properties:

| Prop Name          | Type                                                                  | Required | Description                                                                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------- | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pageType`         | `'home' \| 'article' \| 'category' \| 'product' \| 'other'`             |   Yes    | The type of page.  This determines which Schema.org type is used.                                                                                                                                    |
| `title`            | `string`                                                               |   Yes    | The title of the page.                                                                                                                                                                                    |
| `description`      | `string`                                                               |   Yes    | The description of the page.                                                                                                                                                                               |
| `url`              | `string`                                                               |   Yes    | The canonical URL of the page.                                                                                                                                                                          |
| `imageUrl`         | `string`                                                               |    No    | URL of an image associated with the page (for Open Graph and Twitter Cards).                                                                                                                             |
| `siteName`         | `string`                                                               |    No    | The name of your website (for Open Graph).                                                                                                                                                              |
| `twitterCardType`  | `'summary' \| 'summary_large_image' \| 'app' \| 'player'`              |    No    | The type of Twitter Card. Defaults to `'summary'`.                                                                                                                                                    |
| `twitterCreator`   | `string`                                                               |    No    | Your website's Twitter username (e.g., `@yourhandle`).                                                                                                                                                   |
| `article`          | `ArticleSchemaProps`                                                  |    No    | Article-specific data. *Required* if `pageType` is `'article'`.                                                                                                                                        |
| `product`          | `ProductSchemaProps`                                                  |    No    | Product-specific data. *Required* if `pageType` is `'product'`.                                                                                                                                        |
| `additionalSchema` | `Record<string, any>`                                                   |    No    | Any additional Schema.org data (as a JSON object) to be included. Use this for less common schema types or properties not covered by the other props.  This will be added as a JSON-LD script tag. |

### `ArticleSchemaProps`

| Prop Name         | Type                | Required | Description                                     |
| ----------------- | ------------------- | :------: | ----------------------------------------------- |
| `publishedTime`   | `string` (ISO 8601) |   Yes    | The publication date and time of the article.  |
| `modifiedTime`    | `string` (ISO 8601) |    No    | The last modification date and time.            |
| `author`          | `string`            |    No    | The author's name.                              |
| `tags`            | `string[]`          |    No    | An array of tags for the article.               |
| `publisherName`   |    `string`          | No       | Name of publisher                               |
|`publisherLogoUrl` |     `string`          |     No   | URL of publisher                               |

### `ProductSchemaProps`

| Prop Name      | Type                                          | Required | Description                                                                    |
| -------------- | --------------------------------------------- | :------: | ------------------------------------------------------------------------------ |
| `price`        | `number \| string`                             |   Yes    | The price of the product.                                                       |
| `currency`     | `string`                                      |   Yes    | The currency code (e.g., "USD", "EUR").                                        |
| `availability` | `'in_stock' \| 'out_of_stock' \| 'preorder' \| 'discontinued'` |    No    | The availability of the product.                                                 |
| `brand`        | `string`                                      |    No    | The brand of the product.                                                      |
| `sku`          | `string`                                      |    No    | The product's SKU.                                                              |
| `gtin`         | `string`                                      |    No    | The product's GTIN (Global Trade Item Number).                                   |
| `review`       | `ReviewSchemaProps`                            |    No    | A review of the product (see below).                                            |

### `ReviewSchemaProps`

| Prop Name      | Type     | Required | Description                            |
| -------------- | -------- | :------: | -------------------------------------- |
| `author`          |   `string`        |  Yes     |      Name of Review Author                                  |
|`datePublished`  |      `string`            |   Yes    |  Date when review was published.             |
|`reviewBody`   |      `string`        |   Yes   |    Review description.          |
|`ratingValue`  |   `number`          |  Yes      | Value of the given rating.   |

## Contributing

(Add guidelines for contributing if you plan to open-source your project.)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.