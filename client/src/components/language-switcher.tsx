import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Language } from "@/lib/i18n";

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <Select value={language} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-24 bg-warm-beige border-soft-tan">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="te">తెలుగు</SelectItem>
      </SelectContent>
    </Select>
  );
}
