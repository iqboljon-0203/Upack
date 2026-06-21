"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t, language } = useLanguage();
  const [footerData, setFooterData] = useState<any>({
    desc_uz: "O'zbekistondagi eng yirik B2B platforma. Biznesingiz uchun sifatli qadoqlash vositalari.",
    desc_ru: "Крупнейшая B2B платформа в Узбекистане. Качественные упаковочные материалы для вашего бизнеса.",
    phone: "+998 90 901 39 38",
    email: "info@upackb2b.uz",
    address_uz: "Toshkent shahri, Yunusobod tumani",
    address_ru: "г. Ташкент, Юнусабадский район",
    instagram: "https://www.instagram.com/upackuz?igsh=ZmJ0emdlZHRrb2J",
    telegram: "https://t.me/upackuz"
  });

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data && data.footer) {
          setFooterData(data.footer);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-400 pt-20 pb-10 mt-auto border-t border-slate-800">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        <div className="lg:pr-8">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div 
              className="w-10 h-10 bg-primary-500 shrink-0"
              style={{
                WebkitMaskImage: 'url(/logo.svg)',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: 'url(/logo.svg)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
              }}
              aria-label="UPack Logo"
            />
            <span className="text-2xl font-extrabold text-white tracking-tight">UPack</span>
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            {language === 'uz' ? footerData.desc_uz : footerData.desc_ru}
          </p>
          <div className="flex gap-4 mt-2">
            {footerData.instagram && (
              <a href={footerData.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            )}
            {footerData.telegram && (
              <a href={footerData.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300">
                <Send size={18} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 tracking-tight">{t('footer.catalog')}</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link href="/katalog?category=bir-martalik" className="hover:text-primary-400 transition-colors">{t('footer.disposable')}</Link></li>
            <li><Link href="/katalog?category=qadoqlash" className="hover:text-primary-400 transition-colors">{t('footer.packaging')}</Link></li>
            <li><Link href="/katalog?category=ximiya" className="hover:text-primary-400 transition-colors">{t('footer.chemicals')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 tracking-tight">{t('footer.for_clients')}</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link href="/about" className="hover:text-primary-400 transition-colors">{t('footer.about')}</Link></li>
            <li><Link href="/delivery" className="hover:text-primary-400 transition-colors">{t('footer.delivery')}</Link></li>
            <li><Link href="/yordam" className="hover:text-primary-400 transition-colors">{t('footer.faq')}</Link></li>
            <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">{t('footer.privacy')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 tracking-tight">{t('footer.contact')}</h4>
          <ul className="flex flex-col gap-4 text-sm">
            {footerData.phone && (
              <li className="flex items-start gap-3">
                <Phone className="text-primary-500 shrink-0" size={18} />
                <a href={`tel:${footerData.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">{footerData.phone}</a>
              </li>
            )}
            {footerData.email && (
              <li className="flex items-start gap-3">
                <Mail className="text-primary-500 shrink-0" size={18} />
                <a href={`mailto:${footerData.email}`} className="hover:text-white transition-colors">{footerData.email}</a>
              </li>
            )}
            <li className="flex items-start gap-3">
              <MapPin className="text-primary-500 shrink-0" size={18} />
              <span>{language === 'uz' ? footerData.address_uz : footerData.address_ru}</span>
            </li>
          </ul>
        </div>

      </div>
      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} UPack. {t('footer.rights')}</p>
        <p className="text-slate-600 text-xs text-center md:text-right">
          Created by <span className="font-semibold text-primary-500 ml-1">Dream Tech IT Agency</span>
        </p>
      </div>
    </footer>
  );
}
