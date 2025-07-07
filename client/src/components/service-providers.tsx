import { Button } from "@/components/ui/button";
import { Language, useTranslation } from "@/lib/i18n";
import { MapPin, Star, Clock, Phone } from "lucide-react";

interface ServiceProvidersProps {
  language: Language;
  onContactProvider: (providerId: string) => void;
  onViewProfile: (providerId: string) => void;
}

export function ServiceProviders({ language, onContactProvider, onViewProfile }: ServiceProvidersProps) {
  const t = useTranslation(language);

  const providers = [
    {
      id: "1",
      name: "Rajesh Sharma",
      role: t('interiorDesigner'),
      location: t('lbNagar'),
      rating: 4.9,
      reviewCount: 67,
      experience: 5,
      description: "Specializes in modern residential interiors with a focus on functionality and aesthetics.",
      initials: "RS"
    },
    {
      id: "2",
      name: "Priya Kumari",
      role: t('furnitureSpecialist'),
      location: t('bnReddy'),
      rating: 4.8,
      reviewCount: 92,
      experience: 7,
      description: "Custom furniture solutions with premium materials and craftsmanship.",
      initials: "PK"
    },
    {
      id: "3",
      name: "Vikram Naidu",
      role: t('completeHomeSolutions'),
      location: `${t('lbNagar')} & ${t('bnReddy')}`,
      rating: 4.9,
      reviewCount: 134,
      experience: 10,
      description: "End-to-end interior design and furniture solutions for residential and commercial spaces.",
      initials: "VN"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">{t('featuredServiceProviders')}</h2>
          <p className="mt-4 text-slate-gray">{t('connectWithProfessionals')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-off-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-green rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {provider.initials}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">{provider.name}</h3>
                  <p className="text-slate-gray text-sm">{provider.role}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-emerald-green mr-2" />
                  <span className="text-slate-gray text-sm">{provider.location}</span>
                </div>
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderStars(provider.rating)}
                  </div>
                  <span className="text-slate-gray text-sm">
                    {provider.rating} ({provider.reviewCount} {t('reviews')})
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-emerald-green mr-2" />
                  <span className="text-slate-gray text-sm">
                    {provider.experience}+ {t('yearsExperience')}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-gray text-sm mb-4">{provider.description}</p>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => onContactProvider(provider.id)}
                  className="flex-1 bg-emerald-green text-white hover:bg-emerald-700"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {t('contact')}
                </Button>
                <Button
                  onClick={() => onViewProfile(provider.id)}
                  variant="outline"
                  className="flex-1 border-emerald-green text-emerald-green hover:bg-emerald-50"
                >
                  {t('viewProfile')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
