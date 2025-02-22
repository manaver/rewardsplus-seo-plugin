// src/SchemaOrgScript.tsx
'use client';

import Script from 'next/script';
import React, { useEffect, useState } from 'react';
import type { SchemaOrgScriptProps } from './types'; // Import from types.ts

export default function SchemaOrgScript({
    schema,
    jsonLdString,
    strategy = 'beforeInteractive',
    id = 'schemaorg-jsonld',
}: SchemaOrgScriptProps) {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null; // Prevent server-side rendering issues
    }

    if (!schema && !jsonLdString) {
        console.warn("SchemaOrgScript: Neither 'schema' nor 'jsonLdString' prop provided.");
        return null;
    }

    if (schema && jsonLdString) {
        console.warn("SchemaOrgScript: Both 'schema' and 'jsonLdString' provided.  Using 'schema'.");
    }

    const jsonToUse = schema ? JSON.stringify(schema, null, 2) : jsonLdString;
    if (typeof jsonToUse !== 'string') {
        console.error("SchemaOrgScript: Invalid schema data provided.");
        return null;
    }
    return (
        <Script
            type="application/ld+json"
            id={id}
            strategy={strategy}
            dangerouslySetInnerHTML={{ __html: jsonToUse }}
        />
    );
}