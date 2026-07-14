import type { Metadata } from "next";
import { supabase } from "@/src/lib/supabase";

type CompanyLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { data: company, error } = await supabase
    .from("companies")
    .select(`
      name,
      slug,
      category,
      city,
      province,
      description,
      average_rating,
      review_count
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !company) {
    return {
      title: "Impresa non trovata",
      description:
        "Il profilo dell’impresa richiesta non è disponibile su EdilRate.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const city = company.city?.trim() || "";
const province = company.province?.trim() || "";

const sameLocation =
  city &&
  province &&
  city.toLowerCase() === province.toLowerCase();

const location = city
  ? sameLocation || !province
    ? city
    : `${city} (${province})`
  : province;

const title = `${company.name}${
  location ? ` a ${location}` : ""
} | EdilRate`;

  const fallbackDescription = [
    company.category
      ? `${company.name} opera nel settore ${company.category}.`
      : `Consulta il profilo di ${company.name}.`,
    location ? `Impresa con sede a ${location}.` : "",
    "Leggi le recensioni e richiedi un preventivo tramite EdilRate.",
  ]
    .filter(Boolean)
    .join(" ");

  const description =
    company.description?.trim().slice(0, 155) ||
    fallbackDescription;

  return {
    title: {
        absolute: title,
      },
    description,

    alternates: {
      canonical: `/imprese/${company.slug}`,
    },

    openGraph: {
      type: "website",
      url: `/imprese/${company.slug}`,
      title: `${company.name} | EdilRate`,
      description,
      siteName: "EdilRate",
    },

    twitter: {
      card: "summary_large_image",
      title: `${company.name} | EdilRate`,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },

    other: {
      "company:category": company.category || "",
      "company:city": company.city || "",
      "company:province": company.province || "",
      "company:average_rating":
        company.average_rating?.toString() || "0",
      "company:review_count":
        company.review_count?.toString() || "0",
    },
  };
}

export default async function CompanyLayout({
    children,
    params,
  }: CompanyLayoutProps) {
    const { slug } = await params;
  
    const { data: company } = await supabase
      .from("companies")
      .select(`
        name,
        slug,
        category,
        city,
        province,
        region,
        address,
        phone,
        email,
        website,
        description,
        average_rating,
        review_count
      `)
      .eq("slug", slug)
      .maybeSingle();
  
    const baseUrl = "https://edilrate.vercel.app";
  
    const companyUrl = company?.slug
      ? `${baseUrl}/imprese/${encodeURIComponent(company.slug)}`
      : `${baseUrl}/imprese`;
  
    const normalizedWebsite = company?.website
      ? company.website.startsWith("http")
        ? company.website
        : `https://${company.website}`
      : undefined;
  
    const hasRating =
      Number(company?.average_rating || 0) > 0 &&
      Number(company?.review_count || 0) > 0;
  
    const address =
      company &&
      (company.address ||
        company.city ||
        company.province ||
        company.region)
        ? {
            "@type": "PostalAddress",
            ...(company.address
              ? { streetAddress: company.address }
              : {}),
            ...(company.city
              ? { addressLocality: company.city }
              : {}),
            ...(company.province
              ? { addressRegion: company.province }
              : {}),
            addressCountry: "IT",
          }
        : undefined;
  
    const structuredData = company
      ? {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${companyUrl}#business`,
  
          name: company.name,
          url: companyUrl,
  
          ...(company.description
            ? {
                description: company.description
                  .trim()
                  .slice(0, 500),
              }
            : {}),
  
          ...(company.category
            ? {
                additionalType:
                  "https://schema.org/HomeAndConstructionBusiness",
                knowsAbout: company.category,
              }
            : {}),
  
          ...(company.phone
            ? { telephone: company.phone }
            : {}),
  
          ...(company.email
            ? { email: company.email }
            : {}),
  
          ...(normalizedWebsite
            ? { sameAs: [normalizedWebsite] }
            : {}),
  
          ...(address ? { address } : {}),
  
          ...(company.city || company.province
            ? {
                areaServed: [
                  company.city,
                  company.province,
                ].filter(Boolean),
              }
            : {}),
  
          ...(hasRating
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: Number(
                    company.average_rating
                  ).toFixed(1),
                  reviewCount: Number(
                    company.review_count
                  ),
                  bestRating: "5",
                  worstRating: "1",
                },
              }
            : {}),
        }
      : null;
  
    return (
      <>
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                structuredData
              ).replace(/</g, "\\u003c"),
            }}
          />
        )}
  
        {children}
      </>
    );
  }