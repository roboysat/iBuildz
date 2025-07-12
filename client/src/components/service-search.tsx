import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Language, useTranslation } from "@/lib/i18n";
import { Search } from "lucide-react";
import { useState } from "react";

interface ServiceSearchProps {
  language: Language;
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  serviceType: string;
  location: string;
  budgetRange: string;
}

export function ServiceSearch({ language, onSearch }: ServiceSearchProps) {
  const t = useTranslation(language);
  const [filters, setFilters] = useState<SearchFilters>({
    serviceType: '',
    location: '',
    budgetRange: ''
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-off-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('findYourService')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">{t('serviceType')}</label>
              <Select value={filters.serviceType} onValueChange={(value) => updateFilter('serviceType', value)}>
                <SelectTrigger className="w-full border-soft-tan focus:ring-emerald-green">
                  <SelectValue placeholder={t('allServices')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interior_design">{t('interiorDesign')}</SelectItem>
                  <SelectItem value="furniture">{t('furniture')}</SelectItem>
                  <SelectItem value="all">{t('allServices')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">{t('location')}</label>
              <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
                <SelectTrigger className="w-full border-soft-tan focus:ring-emerald-green">
                  <SelectValue placeholder={t('bothAreas')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L.B. Nagar">{t('lbNagar')}</SelectItem>
                  <SelectItem value="B.N. Reddy">{t('bnReddy')}</SelectItem>
                  <SelectItem value="both">{t('bothAreas')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">{t('budgetRange')}</label>
              <Select value={filters.budgetRange} onValueChange={(value) => updateFilter('budgetRange', value)}>
                <SelectTrigger className="w-full border-soft-tan focus:ring-emerald-green">
                  <SelectValue placeholder="₹10,000 - ₹50,000" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000-50000">₹10,000 - ₹50,000</SelectItem>
                  <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                  <SelectItem value="100000+">₹1,00,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full bg-emerald-green text-white hover:bg-emerald-700"
              >
                <Search className="mr-2 h-4 w-4" />
                {t('search')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
