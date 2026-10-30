export default function sitemap() {
  const baseUrl = "https://andhraartofwar.org";
  const dateStr = "2026-10-27";

  return [
    {
      url: baseUrl,
      lastModified: dateStr,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/heritage`,
      lastModified: dateStr,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lineage`,
      lastModified: dateStr,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/training`,
      lastModified: dateStr,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: dateStr,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: dateStr,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: dateStr,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
