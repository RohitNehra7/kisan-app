import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

const KisanSeo: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage, 
  ogType = 'website' 
}) => {
  const { t } = useTranslation();
  
  const siteName = 'KisanNiti';
  const defaultTitle = t('seo.default_title') || 'KisanNiti - Digital Farmhand for Indian Farmers';
  const defaultDescription = t('seo.default_description') || 'Real-time Mandi prices, AI crop advisory, and precision weather for Haryana and Punjab farmers.';
  const defaultKeywords = 'mandi prices, crop advisory, agriculture india, haryana farmers, paddy price, wheat price, msp bodyguard';
  
  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const url = window.location.href;
  
  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <link rel="canonical" href={canonical || url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang="hi" href={`${url}?lng=hi`} />
      <link rel="alternate" hrefLang="en" href={`${url}?lng=en`} />
      <link rel="alternate" hrefLang="x-default" href={url} />
    </Helmet>
  );
};

export default KisanSeo;
