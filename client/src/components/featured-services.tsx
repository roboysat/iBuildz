import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Language, useTranslation } from "@/lib/i18n";

interface FeaturedServicesProps {
  language: Language;
  onViewAllInteriorDesign: () => void;
  onShopFurniture: () => void;
}

export function FeaturedServices({ language, onViewAllInteriorDesign, onShopFurniture }: FeaturedServicesProps) {
  const t = useTranslation(language);

  const interiorDesignImages = [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1543269865-0a740d43b90c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  ];

  const furnitureImages = [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  ];

  return (
    <section className="bg-cream py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">{t('featuredServices')}</h2>
          <p className="mt-4 text-slate-gray">{t('featuredDescription')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Interior Design Services */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{t('interiorDesignServices')}</h3>
                <Badge className="bg-emerald-green text-white">{t('popular')}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {interiorDesignImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Interior design ${index + 1}`}
                    className="rounded-lg shadow-sm w-full h-32 object-cover"
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-gray text-sm">{t('startingFrom')}</p>
                  <p className="text-2xl font-bold text-emerald-green">₹25,000</p>
                </div>
                <Button
                  onClick={onViewAllInteriorDesign}
                  className="bg-emerald-green text-white hover:bg-emerald-700"
                >
                  {t('viewAll')}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Furniture Services */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{t('furnitureCollection')}</h3>
                <Badge className="bg-blue-500 text-white">{t('new')}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {furnitureImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Furniture ${index + 1}`}
                    className="rounded-lg shadow-sm w-full h-32 object-cover"
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-gray text-sm">{t('startingFrom')}</p>
                  <p className="text-2xl font-bold text-emerald-green">₹5,000</p>
                </div>
                <Button
                  onClick={onShopFurniture}
                  className="bg-emerald-green text-white hover:bg-emerald-700"
                >
                  {t('shopNow')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
