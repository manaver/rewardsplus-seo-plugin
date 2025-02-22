# RewardsPlusSEO

A Next.js plugin for easily generating SEO metadata, including Schema.org structured data, Open Graph tags, and Twitter Cards, using the `Metadata` object (compatible with the `app` directory in Next.js 13/14+).  Provides a `generateRewardsPlusMetadata` function for standard metadata and a `SchemaOrgScript` component for injecting JSON-LD.

## Features

*   ✅ Supports dynamic pages (Home, Article, Category, Product, and custom types)
*   ✅ Generates JSON-LD (Schema.org) for better SEO via a dedicated `SchemaOrgScript` component
*   ✅ Supports Open Graph (Facebook, Twitter previews)
*   ✅ Can be used across multiple websites
*   ✅ Easily configurable via props
*   ✅ Published as an NPM package for easy installation
*   ✅ Compatible with Next.js 13/14+'s `app` directory and Server Components
*   ✅ Flexible Schema.org support using generics

## Installation

```bash
yarn add @your-npm-scope/rewardsplusseo  # Replace with your actual package name
```

Or, with npm:

```bash
npm install @your-npm-scope/rewardsplusseo
```

## Usage

This package provides two main exports:

*   **`generateRewardsPlusMetadata`:** A function to generate standard `Metadata` objects for your Next.js pages (title, description, Open Graph, Twitter Cards).  Use this in your `generateMetadata` function or `metadata` export.

*   **`SchemaOrgScript`:** A Client Component to inject JSON-LD structured data into your page. Use this *within* your page component's JSX.

### Basic Example (Static Route - `app/page.tsx` or `app/about/page.tsx`):

```typescript
// app/page.tsx
import type { Metadata } from 'next';
import { generateRewardsPlusMetadata, RewardsPlusSEOProps, SchemaOrgScript } from '@your-npm-scope/rewardsplusseo';

const seoProps: RewardsPlusSEOProps = {
  pageType: 'home',
  title: 'My Awesome Website',
  description: 'Welcome to my amazing website!',
  url: '[https://www.example.com](https://www.example.com)',
  siteName: 'Example Site',
};

export const metadata: Metadata = generateRewardsPlusMetadata(seoProps);

export default function Home() {
  const homePageSchema = {
    '@context': '[https://schema.org](https://schema.org)',
    '@type': 'WebSite', // Example: Use WebSite for the home page
    url: '[https://www.example.com](https://www.example.com)',
    name: 'My Awesome Website',
  };

  return (
    <div>
      <SchemaOrgScript schema={homePageSchema} />
      <h1>Welcome!</h1>
    </div>
  );
}
```

### Dynamic Route Example (`app/articles/[slug]/page.tsx`):

```typescript
// app/articles/[slug]/page.tsx
import type { Metadata, GetStaticPaths } from 'next';
import { generateRewardsPlusMetadata, RewardsPlusSEOProps, SchemaOrgScript } from '@your-npm-scope/rewardsplusseo';
import { ArticleSchemaProps, SchemaOrgBase } from '@your-npm-scope/rewardsplusseo';

interface ArticleProps {
    title: string;
    content: string;
    slug: string;
    publishedTime: string;
    author: string;
    tags: string[]
}
interface ArticleSchema extends SchemaOrgBase {
    '@type': 'Article' | 'BlogPosting';
    headline: string;
    description: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
     author?: {
        '@type': string;
        name: string;
    };
    publisher?: {
        '@type': string;
        name: string;
        logo?: {
          '@type': 'ImageObject',
            url: string
        }
    };
    mainEntityOfPage?: {
        '@type': string;
        '@id': string
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
     // Fetch article data
    const slug = params.slug;
    const articleData = { // Replace
        title: `Article: ${slug}`,
        content: `Content for ${slug}...`,
        slug: slug,
        publishedTime: new Date().toISOString(),
        author: 'Jane Doe',
        tags: ['nextjs', 'seo']
    };

  const url = `https://www.example.com/articles/${slug}`;
  const seoProps: RewardsPlusSEOProps = {
    pageType: 'article',
    title: articleData.title,
    description: articleData.content.substring(0, 160), // Short description
    url,
    imageUrl: `/images/articles/${slug}.jpg`, // Example
    article: {
      publishedTime: articleData.publishedTime,
      modifiedTime: articleData.publishedTime,
      author: articleData.author,
      tags: articleData.tags,
      publisherName: "Publisher Name", //Add publisher
      publisherLogoUrl: "[https://example.com/logo.png](https://example.com/logo.png)" //Add logo
    },
  };

  return generateRewardsPlusMetadata(seoProps);
}

export default async function Article({ params }: { params: { slug: string } }) {
  // You'll likely need to fetch the data again here, or use a Client Component
  const articleData = {
        title: `Article: ${params.slug}`,
        content: `Content for ${params.slug}...`,
        slug: params.slug,
        publishedTime: new Date().toISOString(),
        author: 'Jane Doe',
        tags: ['nextjs', 'seo']
    };
  const url = `https://www.example.com/articles/${params.slug}`;

    const articleSchema: ArticleSchema = {
      '@context': '[https://schema.org](https://schema.org)',
      '@type': 'BlogPosting', // Use 'BlogPosting' for blog posts
      headline: articleData.title,
      description: articleData.content.substring(0, 160),
      image: `/images/articles/${params.slug}.jpg`, // Example image URL
      datePublished: articleData.publishedTime,
      dateModified: articleData.publishedTime,
      author: {
        '@type': 'Person',
        name: articleData.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'My Blog', // Replace with your blog/website name
        // logo: { // Optional: Add a logo if you have one
        //   '@type': 'ImageObject',
        //   url: '[https://www.example.com/logo.png](https://www.example.com/logo.png)',
        // },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      }
    };
  return (
    <div>
      <SchemaOrgScript schema={articleSchema} />
      <h1>{articleData.title}</h1>
      <p>{articleData.content}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
   const slugs = ['article-1', 'article-2', 'article-3'];

  const paths = slugs.map((slug) => ({
    params: { slug },
  }));
  return { paths, fallback: false };
};
```

### Product Page Example (`app/products/[slug]/page.tsx`):

```typescript
// app/products/[slug]/page.tsx
import type { Metadata, GetStaticPaths } from 'next';
import { generateRewardsPlusMetadata, RewardsPlusSEOProps, SchemaOrgScript } from '@your-npm-scope/rewardsplusseo';
import { ProductSchemaProps, SchemaOrgBase } from '@your-npm-scope/rewardsplusseo';

interface ProductProps {
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

interface ProductSchema extends SchemaOrgBase {
    '@type': 'Product';
    name: string;
    image?: string;
    description: string;
    brand?: {
        '@type': 'Brand' | 'Organization';
        name: string;
    };
    sku?: string;
    gtin?: string;
    offers: {
        '@type': 'Offer';
        priceCurrency: string;
        price: number | string;
        availability?: string;
        url: string;
    };
    review?: {
        '@type': 'Review';
        reviewRating: {
            '@type': 'Rating';
            ratingValue: number;
        };
        author: {
            '@type': 'Person',
            name: string;
        };
        datePublished: string;
        reviewBody: string;
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const slug = params.slug
  // Fetch product data (replace with your actual data fetching)
  const productData: ProductProps = {
        title: `Product: ${slug}`,
        description: `Description for product ${slug}...`,
        slug: slug,
        imageUrl: `/images/products/${slug}.jpg`,
        price: 99.99,
        currency: 'USD',
        availability: 'in_stock',
        brand: 'Example Brand',
        sku: '12345-ABC',
        gtin: '9780201379624',
        review: {
            author: 'John Doe',
            datePublished: '2024-02-29T12:00:00Z',
            reviewBody: 'This product is amazing! Highly recommended.',
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
        review: productData.review
    },
  };

  return generateRewardsPlusMetadata(seoProps);
}

export default async function Product({params}:{params:{slug:string}}) {
  //Fetch product details
  const productData: ProductProps = {
        title: `Product: ${params.slug}`,
        description: `Description for product ${params.slug}...`,
        slug: params.slug,
        imageUrl: `/images/products/${params.slug}.jpg`,
        price: 99.99,
        currency: 'USD',
        availability: 'in_stock',
        brand: 'Example Brand',
        sku: '12345-ABC',
        gtin: '9780201379624',
        review: {
            author: 'John Doe',
            datePublished: '2024-02-29T12:00:00Z',
            reviewBody: 'This product is amazing! Highly recommended.',
            ratingValue: 5,
        },
    };

    const productSchema: ProductSchema = {
      '@context': '[https://schema.org](https://schema.org)',
      '@type': 'Product',
      name: productData.title,
      image: productData.imageUrl,
      description: productData.description,
      brand: {
        '@type': "Brand",
        name: productData.brand
      },
      sku: productData.sku,
      gtin: productData.gtin,
      offers: {
        '@type': 'Offer',
        priceCurrency: productData.currency,
        price: productData.price,
        availability: `https://schema.org/${productData.availability.replace(/_/g, '')}`,
        url: `https://www.example.com/products/${productData.slug}`,
      },
      review: {
          '@type': "Review",
          reviewRating: {
              '@type': "Rating",
              ratingValue: productData.review!.ratingValue
          },
          author: {
            '@type': "Person",
            name: productData.review!.author
          },
          datePublished: productData.review!.datePublished,
          reviewBody: productData.review!.reviewBody
      }
    };

  return (
    <div>
      <SchemaOrgScript schema={productSchema} />
      <h1>{productData.title}</h1>
      <p>{productData.description}</p>
      {/* ... your product page content ... */}
    </div>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = ['product-1', 'product-2']; // Replace with real slugs
  const paths = slugs.map((slug) => ({ params: { slug } }));
  return { paths, fallback: false };
};
```

### Category Page Example (`app/categories/[slug]/page.tsx`):
```typescript
// app/categories/[slug]/page.tsx
import type { Metadata, GetStaticPaths } from 'next';
import { generateRewardsPlusMetadata, RewardsPlusSEOProps, SchemaOrgScript } from '@your-npm-scope/rewardsplusseo';
import { SchemaOrgBase } from '@your-npm-scope/rewardsplusseo';

interface CategoryProps {
    name: string;
    description: string;
    slug: string
}

interface CategorySchema extends SchemaOrgBase {
    '@type': 'CollectionPage';
    name: string;
    description: string;
}
export async function generateMetadata({params}: {params: {slug: string}}): Promise<Metadata> {

    const slug = params.slug;

    const categoryData: CategoryProps = {
        name: `Category: ${slug}`,
        description: `Products under ${slug} category`,
        slug
    }

    const url = `https://www.example.com/categories/${slug}`;

    const seoProps: RewardsPlusSEOProps = {
        pageType: 'category',
        title: categoryData.name,
        description: categoryData.description,
        url
    }

    return generateRewardsPlusMetadata(seoProps)
}

export default async function Category({params}: {params:{slug: string}}) {

    const categoryData = {
        name: `Category: ${params.slug}`,
        description: `Products under ${params.slug} category`,
        slug: params.slug
    }

    const url = `https://www.example.com/categories/${params.slug}`;

    const categorySchema: CategorySchema = {
      '@context': '[https://schema.org](https://schema.org)',
      '@type': 'CollectionPage',
      name: categoryData.name,
        description: categoryData.description,
        url
    };

    return (
        <div>
             <SchemaOrgScript schema={categorySchema} />
            <h1>{categoryData.name}</h1>
            <p>{categoryData.description}</p>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = ['category-1', 'category-2']
    const paths = slugs.map(slug => ({params: {slug}}));
    return {paths, fallback: false}
}
```

### Other Page (`app/faq/page.tsx` - Using `jsonLdString`):

```typescript
// app/faq/page.tsx
import type { Metadata } from 'next';
import { generateRewardsPlusMetadata, RewardsPlusSEOProps, SchemaOrgScript } from '@your-npm-scope/rewardsplusseo';

export const metadata: Metadata = generateRewardsPlusMetadata({
  pageType: 'other', // Or 'home', 'article', etc., as appropriate
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions.',
  url: '[https://www.example.com/faq](https://www.example.com/faq)',
});

export default function FAQ() {
  const faqSchema = {
    '@context': '[https://schema.org](https://schema.org)',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is your return policy?',
        acceptedAnswer: { '@type': 'Answer', text: '...' },
      },
      // ... more questions ...
    ],
  };

  return (
    <div>
      <SchemaOrgScript schema={faqSchema} />
      <h1>Frequently Asked Questions</h1>
      {/* ... your FAQ content ... */}
    </div>
  );
}

```

## Props

### `generateRewardsPlusMetadata`

The `generateRewardsPlusMetadata` function accepts a single argument, an object of type `RewardsPlusSEOProps`:

| Prop Name         | Type                                                        | Required | Description                                                                  |
| ----------------- | ----------------------------------------------------------- | :------: | ---------------------------------------------------------------------------- |
| `pageType`        | `'home' \| 'article' \| 'category' \| 'product' \| 'other'` |   Yes    | The type of page.                                                            |
| `title`           | `string`                                                    |   Yes    | The title of the page.                                                       |
| `description`     | `string`                                                    |   Yes    | The description of the page.                                                 |
| `url`             | `string`                                                    |   Yes    | The canonical URL of the page.                                               |
| `imageUrl`        | `string`                                                    |    No    | URL of an image associated with the page (for Open Graph and Twitter Cards). |
| `siteName`        | `string`                                                    |    No    | The name of your website (for Open Graph).                                   |
| `twitterCardType` | `'summary' \| 'summary_large_image' \| 'app' \| 'player'`   |    No    | The type of Twitter Card. Defaults to `'summary'`.                           |
| `twitterCreator`  | `string`                                                    |    No    | Your website's Twitter username (e.g., `@yourhandle`).                       |
| `article`         | `ArticleSchemaProps`                                        |    No    | Article-specific data. *Required* if `pageType` is `'article'`.              |
| `product`         | `ProductSchemaProps`                                        |    No    | Product-specific data. *Required* if `pageType` is `'product'`.              |

### `ArticleSchemaProps`

| Prop Name          | Type                | Required | Description                                   |
| ------------------ | ------------------- | :------: | --------------------------------------------- |
| `publishedTime`    | `string` (ISO 8601) |   Yes    | The publication date and time of the article. |
| `modifiedTime`     | `string` (ISO 8601) |    No    | The last modification date and time.          |
| `author`           | `string`            |    No    | The author's name.                            |
| `tags`             | `string[]`          |    No    | An array of tags for the article.             |
| `publisherName`    | `string`            |    No    | Name of Publisher                             |
| `publisherLogoUrl` | `string`            |    No    | Logo URL of Publisher                         |

### `ProductSchemaProps`

| Prop Name      | Type                                                           | Required | Description                                    |
| -------------- | -------------------------------------------------------------- | :------: | ---------------------------------------------- |
| `price`        | `number \| string`                                             |   Yes    | The price of the product.                      |
| `currency`     | `string`                                                       |   Yes    | The currency code (e.g., "USD", "EUR").        |
| `availability` | `'in_stock' \| 'out_of_stock' \| 'preorder' \| 'discontinued'` |    No    | The availability of the product.               |
| `brand`        | `string`                                                       |    No    | The brand of the product.                      |
| `sku`          | `string`                                                       |    No    | The product's SKU.                             |
| `gtin`         | `string`                                                       |    No    | The product's GTIN (Global Trade Item Number). |
| `review`       | `ReviewSchemaProps`                                            |    No    | A review of the product (see below).           |

### `ReviewSchemaProps`

| Prop Name       | Type     | Required | Description                         |
| --------------- | -------- | :------: | ----------------------------------- |
| `author`        | `string` |   Yes    | The author of the review.           |
| `datePublished` | `string` |   Yes    | The publication date of the review. |
| `reviewBody`    | `string` |   Yes    | The content of the review.          |
| `ratingValue`   | `number` |   Yes    | The rating given in the review.     |

### `SchemaOrgScript`

The `SchemaOrgScript` component accepts the following props:

| Prop Name      | Type                                                                    | Required | Default               | Description                                                                                                                                                    |
| -------------- | ----------------------------------------------------------------------- | :------: | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`       | `T extends SchemaOrgBase = SchemaOrgBase`                               |    No    | `null`                | A JSON object representing the Schema.org structured data.  Takes precedence over `jsonLdString`.                                                              |
| `jsonLdString` | `string`                                                                |    No    | `null`                | A *pre-stringified* JSON-LD string.  Use this if you've already generated the JSON-LD string elsewhere.                                                        |
| `strategy`     | `'afterInteractive' \| 'beforeInteractive' \| 'lazyOnload' \| 'worker'` |    No    | `'beforeInteractive'` | The loading strategy for the script. See [Next.js Script documentation](https://nextjs.org/docs/app/building-your-application/optimizing/scripts) for details. |
| `id`           | `string`                                                                |    No    | `'schemaorg-jsonld'`  | The `id` attribute for the `<script>` tag.                                                                                                                     |

**Using Generics with `SchemaOrgScript`**
The `SchemaOrgScript` component is generic, allowing for improved type safety when providing specific schema.

```typescript
import { SchemaOrgScript } from '@your-npm-scope/rewardsplusseo';
import type { SchemaOrgBase } from '@your-npm-scope/rewardsplusseo'

//Define your own schema
interface MyCustomSchema extends SchemaOrgBase {
    '@type': "MyType"; //Constraint
    customValue: string;
}

const mySchema: MyCustomSchema = {
    '@context': '[[https://schema.org](https://schema.org)]',
    '@type': "MyType",
    customValue: 'Some Data'
}

<SchemaOrgScript schema={mySchema}/> //Type safe

<SchemaOrgScript schema={{'@context': '[[https://schema.org](https://schema.org)]', '@type': 'AnotherType', anotherValue: 123}} /> // Also valid, but less type safety

````

## Contributing

(Add guidelines for contributing if you plan to open-source your project.  Here's a basic example.)

Contributions are welcome\! Please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix: `git checkout -b feature/my-new-feature`
3.  Make your changes and commit them with clear, descriptive commit messages.
4.  Write tests for your changes.
5.  Run the tests: `yarn test`
6.  Push your branch to your fork: `git push origin feature/my-new-feature`
7.  Open a pull request against the `main` branch of the original repository.

## License

[![License: MIT](about:sanitized)](LICENSE)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.