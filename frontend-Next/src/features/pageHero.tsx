import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { ImageWithFallback } from "@/components/ui/imageWithFallback";
import { Badge } from "@/components/ui/badge";
import Link from "next/link"; // Fixed import

interface BreadcrumbItemProps {
  label: string;
  href?: string;
}

interface PageHeroProps {
  imageUrl?: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItemProps[];
  badge?: {
    label: string;
    variant?: 'default' | 'secondary' | 'outline';
  };
  showGradient?: boolean;
  className?: string;
  height?: string; // Expects a valid CSS height string like "45vh" or "400px"
}

export const PageHero = ({
  imageUrl,
  title,
  description,
  breadcrumbs = [],
  badge,
  showGradient = true,
  className = '',
  height = '45vh'
}: PageHeroProps) => {
  const hasImage = !!imageUrl;

  return (
    <section 
      className={`relative overflow-hidden ${
        hasImage ? 'min-h-[350px]' : 'py-12 bg-card border-b border-border'
      } ${className}`}
      style={hasImage ? { height: height } : undefined} // Safely handles dynamic arbitrary heights
    >
      {hasImage && (
        <div className="absolute inset-0">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full"
          />
          {showGradient && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          )}
        </div>
      )}

      <div className={`${hasImage ? 'relative h-full flex flex-col justify-center' : ''} container mx-auto px-4 lg:px-8`}>
        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <Breadcrumb className="mb-4">
            <BreadcrumbList className={hasImage ? 'text-white/80' : ''}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="transition-colors hover:text-[#D4AF37]">
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <div key={index} className="flex items-center gap-1.5">
                    <BreadcrumbSeparator className={hasImage ? 'text-white/60' : ''} />
                    {isLast ? (
                      <BreadcrumbItem>
                        <BreadcrumbPage className={hasImage ? 'text-white' : ''}>
                          {crumb.label}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    ) : (
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link 
                            href={crumb.href || '/'} 
                            className="transition-colors hover:text-[#D4AF37]"
                          >
                            {crumb.label}
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    )}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Badge */}
        {badge && (
          <Badge 
            variant={badge.variant || 'default'}
            className={`mb-4 w-fit ${!badge.variant || badge.variant === 'default' ? 'bg-[#D4AF37] text-black hover:bg-[#C5A028]' : ''}`}
          >
            {badge.label}
          </Badge>
        )}

        {/* Hero Heading */}
        <h1 className={`font-serif ${hasImage ? 'text-white' : ''} text-[2.5rem] md:text-[4.5rem] leading-tight mb-4`}>
          {title}
        </h1>
        <p className={`${hasImage ? 'text-white/90' : 'text-muted-foreground'} text-lg max-w-2xl`}>
          {description}
        </p>
      </div>
    </section>
  );
};