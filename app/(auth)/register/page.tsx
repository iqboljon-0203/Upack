"use client";

import Link from "next/link";
import { User, Mail, Lock, Building2, Phone, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterPage() {
  const { language } = useLanguage();

  return (
    <div className="container mx-auto px-6 py-16 flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{language === 'uz' ? "Ro'yxatdan o'tish" : "Регистрация"}</h1>
          <p className="text-slate-500 text-sm">{language === 'uz' ? "Biznesingiz uchun qulay xaridlar platformasi" : "Удобная платформа закупок для вашего бизнеса"}</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">{language === 'uz' ? 'Kompaniya nomi' : 'Название компании'}</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={language === 'uz' ? "MCHJ / YTT nomi" : "Название ООО / ИП"}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{language === 'uz' ? 'Ism va familiya' : 'Имя и фамилия'}</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={language === 'uz' ? "To'liq ismingiz" : "Ваше полное имя"}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{language === 'uz' ? 'STIR (INN)' : 'ИНН'}</label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="123456789"
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{language === 'uz' ? 'Telefon raqam' : 'Номер телефона'}</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="+998 90 123 45 67"
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                placeholder="info@kompaniya.uz"
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">{language === 'uz' ? "Parol o'ylab toping" : 'Придумайте пароль'}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder={language === 'uz' ? "Kamida 8 ta belgi" : "Минимум 8 символов"}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div className="md:col-span-2 mt-2">
            <button 
              type="button"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-sm shadow-primary-600/20 flex items-center justify-center gap-2 transition-all"
            >
              {language === 'uz' ? 'Akkaunt yaratish' : 'Создать аккаунт'}
            </button>
          </div>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-xs font-bold text-slate-400 uppercase">{language === 'uz' ? 'Yoki quyidagilar orqali' : 'Или через'}</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <div className="flex flex-col gap-3">
          <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            {language === 'uz' ? 'Google orqali kiring' : 'Войти через Google'}
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-[#2AABEE]/10 border border-[#2AABEE]/20 hover:bg-[#2AABEE]/20 text-[#2AABEE] font-bold py-3 rounded-xl transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#2AABEE"/><path d="M18.8471 6.84001C18.8471 6.84001 20.3015 6.22156 20.1975 7.66442C20.1456 8.28286 19.6781 10.9623 19.2626 13.9511L17.8082 21.0621C17.8082 21.0621 17.6524 21.8865 17.0291 22.0411C16.4057 22.1957 15.3669 21.5258 15.159 21.3713C14.9512 21.2167 11.4191 18.9495 10.1205 17.8159C9.75691 17.5068 9.34142 16.8884 10.1725 16.1155L16.0942 10.3957C16.7695 9.72582 17.4447 7.97384 14.3283 10.1384L7.52331 14.827C7.52331 14.827 6.84803 15.2393 5.60146 14.8785L2.84859 14.0025C2.84859 14.0025 1.80978 13.3326 3.57577 12.6627C8.45821 10.3954 13.5484 8.48895 18.8471 6.84001Z" fill="white"/></svg>
            {language === 'uz' ? 'Telegram orqali kiring' : 'Войти через Telegram'}
          </button>
        </div>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          {language === 'uz' ? "Allaqachon ro'yxatdan o'tganmisiz?" : "Уже зарегистрированы?"}{" "}
          <Link href="/login" className="text-primary-600 font-bold hover:underline">
            {language === 'uz' ? "Tizimga kirish" : "Войти в систему"}
          </Link>
        </div>
      </div>
    </div>
  );
}
