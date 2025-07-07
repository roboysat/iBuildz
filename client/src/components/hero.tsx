import { Button } from "@/components/ui/button";
import { Language, useTranslation } from "@/lib/i18n";

interface HeroProps {
  language: Language;
  onFindServices: () => void;
  onJoinAsProvider: () => void;
}

export function Hero({ language, onFindServices, onJoinAsProvider }: HeroProps) {
  const t = useTranslation(language);

  return (
    <section className="bg-gradient-to-r from-cream to-off-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 sm:text-5xl md:text-6xl">
            {t('heroTitle')}
            <span className="text-emerald-green block">{t('heroSubtitle')}</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-slate-gray sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {t('heroDescription')}
          </p>
          
          {/* Company Motto */}
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm max-w-4xl mx-auto">
            <p className="text-lg font-semibold text-gray-800 mb-2">{t('aimOfiBuildz')}</p>
            <p className="text-slate-gray mb-4">{t('aimDescription')}</p>
            <p className="text-emerald-green font-semibold">{t('motto')}</p>
          </div>
          
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={onFindServices}
                size="lg"
                className="bg-emerald-green text-white hover:bg-emerald-700 px-8 py-3 text-lg font-medium"
              >
                {t('findServices')}
              </Button>
              <Button
                onClick={onJoinAsProvider}
                variant="outline"
                size="lg"
                className="border-emerald-green text-emerald-green hover:bg-emerald-50 px-8 py-3 text-lg font-medium"
              >
                {t('joinAsProvider')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
