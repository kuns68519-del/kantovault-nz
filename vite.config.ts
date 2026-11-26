import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { PRODUCTS } from './src/products';
import { STORE_CONFIG } from './src/storeConfig';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function kantovaultGmcSeoPlugin(): Plugin {
  return {
    name: 'kantovault-gmc-seo',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const templatePath = path.join(distDir, 'index.html');
      if (!fs.existsSync(templatePath)) return;

      const templateHtml = fs.readFileSync(templatePath, 'utf8');
      const base = STORE_CONFIG.domain;

      const injectHead = (
        title: string,
        description: string,
        canonicalUrl: string,
        extraHead = ''
      ): string => {
        let html = templateHtml.replace(
          /<title>[\s\S]*?<\/title>/,
          `<title>${escapeHtml(title)}</title>`
        );
        html = html.replace(
          /<meta\s+name="description"[\s\S]*?\/>/,
          `<meta name="description" content="${escapeHtml(description)}" />`
        );
        const headTags = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />\n    ${extraHead}`;
        return html.replace('</head>', `    ${headTags}\n  </head>`);
      };

      // 1. Static crawlable HTML + JSON-LD for every product landing page
      for (const product of PRODUCTS) {
        const canonicalUrl = `${base}/product/${product.id}`;
        const fullImageUrl = `${base}${product.imageUrl}`;
        const shippingRate =
          product.priceNzd >= STORE_CONFIG.shipping.freeThresholdNzd
            ? '0.00'
            : STORE_CONFIG.shipping.flatRateNzd.toFixed(2);

        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          sku: product.sku,
          mpn: product.sku,
          image: [fullImageUrl],
          description: product.description,
          brand: { '@type': 'Brand', name: 'KantoVault' },
          category: `Toys & Games > Toys > Building Toys > ${product.category}`,
          offers: {
            '@type': 'Offer',
            url: canonicalUrl,
            priceCurrency: STORE_CONFIG.shipping.currency,
            price: `${product.priceNzd}.00`,
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: STORE_CONFIG.legalName },
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingRate: {
                '@type': 'MonetaryAmount',
                value: shippingRate,
                currency: STORE_CONFIG.shipping.currency,
              },
              shippingDestination: {
                '@type': 'DefinedRegion',
                addressCountry: STORE_CONFIG.address.countryCode,
              },
              deliveryTime: {
                '@type': 'ShippingDeliveryTime',
                handlingTime: {
                  '@type': 'QuantitativeValue',
                  minValue: STORE_CONFIG.shipping.handlingDaysMin,
                  maxValue: STORE_CONFIG.shipping.handlingDaysMax,
                  unitCode: 'DAY',
                },
                transitTime: {
                  '@type': 'QuantitativeValue',
                  minValue: STORE_CONFIG.shipping.transitDaysMin,
                  maxValue: STORE_CONFIG.shipping.transitDaysMax,
                  unitCode: 'DAY',
                },
              },
            },
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: STORE_CONFIG.address.countryCode,
              returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: STORE_CONFIG.returns.windowDays,
              returnMethod: 'https://schema.org/ReturnByMail',
              returnFees: 'https://schema.org/FreeReturn',
            },
          },
        };

        const ogAndLd = [
          `<meta property="og:type" content="product" />`,
          `<meta property="og:title" content="${escapeHtml(product.name)} — ${escapeHtml(STORE_CONFIG.storeName)}" />`,
          `<meta property="og:description" content="${escapeHtml(product.description)}" />`,
          `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
          `<meta property="og:image" content="${escapeHtml(fullImageUrl)}" />`,
          `<meta property="product:price:amount" content="${product.priceNzd}.00" />`,
          `<meta property="product:price:currency" content="NZD" />`,
          `<script id="product-jsonld" type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
        ].join('\n    ');

        const pageHtml = injectHead(
          `${product.name} (${product.pieces.toLocaleString('en-NZ')} pcs) — ${STORE_CONFIG.storeName}`,
          product.description,
          canonicalUrl,
          ogAndLd
        );

        const outDir = path.join(distDir, 'product', product.id);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), pageHtml, 'utf8');
      }

      // 2. Static policy & contact pages
      const policyPages = [
        {
          slug: 'shipping-returns',
          title: `Shipping & Returns Policy — ${STORE_CONFIG.storeName}`,
          description: `New Zealand courier rates (free over NZ$${STORE_CONFIG.shipping.freeThresholdNzd}), 1-3 day dispatch from Auckland, and ${STORE_CONFIG.returns.windowDays}-day returns on unopened building-block sets.`,
        },
        {
          slug: 'privacy',
          title: `Privacy Policy — ${STORE_CONFIG.storeName}`,
          description: `Privacy Policy for ${STORE_CONFIG.legalName} under the New Zealand Privacy Act 2020.`,
        },
        {
          slug: 'terms',
          title: `Terms of Service — ${STORE_CONFIG.storeName}`,
          description: `Terms of Service, NZD pricing inclusive of 15% GST, and NZ Consumer Guarantees Act notice for ${STORE_CONFIG.storeName}.`,
        },
        {
          slug: 'contact',
          title: `Contact Us & Auckland Studio — ${STORE_CONFIG.storeName}`,
          description: `Contact ${STORE_CONFIG.legalName} in Grey Lynn, Auckland by email at ${STORE_CONFIG.supportEmail}.`,
        },
      ];

      for (const page of policyPages) {
        const canonicalUrl = `${base}/${page.slug}`;
        const outDir = path.join(distDir, page.slug);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(
          path.join(outDir, 'index.html'),
          injectHead(page.title, page.description, canonicalUrl),
          'utf8'
        );
      }

      // 3. Google Merchant Center RSS 2.0 XML Product Feed (/merchant-feed.xml)
      const feedItems = PRODUCTS.map((p) => {
        const shippingFee =
          p.priceNzd >= STORE_CONFIG.shipping.freeThresholdNzd
            ? '0.00'
            : STORE_CONFIG.shipping.flatRateNzd.toFixed(2);
        return `    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <g:title>${escapeXml(`${p.name} (${p.pieces.toLocaleString('en-NZ')} Pieces, Ages ${p.age})`)}</g:title>
      <g:description>${escapeXml(p.description)}</g:description>
      <g:link>${escapeXml(`${base}/product/${p.id}`)}</g:link>
      <g:image_link>${escapeXml(`${base}${p.imageUrl}`)}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${p.priceNzd}.00 NZD</g:price>
      <g:condition>new</g:condition>
      <g:brand>KantoVault</g:brand>
      <g:mpn>${escapeXml(p.sku)}</g:mpn>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>Toys &amp; Games &gt; Toys &gt; Building Toys</g:google_product_category>
      <g:product_type>${escapeXml(`${p.era} > ${p.category}`)}</g:product_type>
      <g:shipping>
        <g:country>NZ</g:country>
        <g:service>Tracked NZ Courier</g:service>
        <g:price>${shippingFee} NZD</g:price>
      </g:shipping>
    </item>`;
      }).join('\n');

      const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml(STORE_CONFIG.storeName)} Product Feed</title>
    <link>${escapeXml(base)}</link>
    <description>Building-block construction sets shipped nationwide in New Zealand from Auckland.</description>
${feedItems}
  </channel>
</rss>
`;
      fs.writeFileSync(path.join(distDir, 'merchant-feed.xml'), feedXml, 'utf8');

      // 4. Sitemap & robots.txt
      const urls = [
        `${base}/`,
        ...policyPages.map((p) => `${base}/${p.slug}`),
        ...PRODUCTS.map((p) => `${base}/product/${p.id}`),
      ];
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${escapeXml(u)}</loc></url>`).join('\n')}
</urlset>
`;
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

      const robotsTxt = `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`;
      fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), kantovaultGmcSeoPlugin()],
});
