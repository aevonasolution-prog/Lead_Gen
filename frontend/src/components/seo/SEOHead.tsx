import React, { useEffect } from 'react';
import { siteConfig } from '../../config/siteConfig';
import { PageSeoMeta } from '../../types';

interface SEOHeadProps extends Partial<PageSeoMeta> {
  path?: string;
}

/**
 * Dynamic SEO Head Manager component
 * Updates document title and meta tags on route transition
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  noIndex = false,
  path = '',
}) => {
  const fullTitle = title
    ? `${title} | ${siteConfig.brand.tradingName}`
    : siteConfig.seoDefaults.title;

  const finalDescription = description || siteConfig.seoDefaults.description;
  const finalKeywords = keywords ? keywords.join(', ') : siteConfig.seoDefaults.keywords?.join(', ') || '';
  
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.yourbusiness.example.com';
  const finalCanonical = canonicalUrl || `${siteUrl}${path}`;
  const finalOgImage = ogImage || `${siteUrl}/favicon.svg`;

  useEffect(() => {
    // Update Page Title
    document.title = fullTitle;

    // Helper to create or update meta tags
    const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      let meta = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Standard SEO Meta Tags
    setMetaTag('name', 'description', finalDescription);
    if (finalKeywords) {
      setMetaTag('name', 'keywords', finalKeywords);
    }
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph Metadata
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', finalCanonical);
    setMetaTag('property', 'og:image', finalOgImage);
    setMetaTag('property', 'og:site_name', siteConfig.brand.companyName);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', finalCanonical);
  }, [fullTitle, finalDescription, finalKeywords, finalCanonical, ogType, finalOgImage, noIndex]);

  return null;
};
