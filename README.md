# Kamal Naagar SEO - Sitewide JSON-LD Deployment

This is the complete GitHub Pages website, not just the Blog page.

## Publishing
1. Extract this ZIP. All files are directly at the root; there are no folders.
2. In github.com/kamalnaagarseo/kamalnaagarseo.github.io, upload ALL extracted files to the repository root, replacing matching files.
3. Commit changes and wait for GitHub Pages to deploy.
4. Check `https://kamalnaagarseo.github.io/` and `https://kamalnaagarseo.github.io/services.html` using browser View Page Source and search for `application/ld+json`.
5. Validate each live page with https://validator.schema.org/ .

## Embedded schema
- index.html: Organization, Person (Kamal), Person (Vijay), WebSite, WebPage
- services.html: Service, OfferCatalog, WebPage, BreadcrumbList
- about.html: Organization, Person, AboutPage, BreadcrumbList
- contact.html: ContactPage, BreadcrumbList
- blog.html: Blog, CollectionPage, BreadcrumbList
- seo-agency-workload-management.html: BlogPosting, WebPage, BreadcrumbList
- testimonials.html: WebPage, BreadcrumbList
- resources.html: CollectionPage, BreadcrumbList
- resource-gbp.html, resource-workflow.html: Article, WebPage, BreadcrumbList

The schema lives in the <head> of every HTML page. No additional script file or plugin is required.
The `Work With Me` CTA links to office.kamalnaagar@gmail.com.

Structured data does not guarantee search appearance or rankings.
