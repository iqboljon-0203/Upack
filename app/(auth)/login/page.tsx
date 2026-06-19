"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Send, Loader2 } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { language } = useLanguage();
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const newCode = [...code];
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasted[i] || "";
      }
      setCode(newCode);
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
      setActiveIndex(nextIndex);
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError(language === 'uz' ? "Iltimos, 6 xonali kodni to'liq kiriting" : "Пожалуйста, введите 6-значный код полностью");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: fullCode }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.supabaseSession) {
          const { supabase } = await import("@/lib/supabase");
          await supabase.auth.setSession({
            access_token: data.supabaseSession.access_token,
            refresh_token: data.supabaseSession.refresh_token,
          });
        }
        window.location.href = "/";
      } else {
        setError(data.message || (language === 'uz' ? "Kod noto'g'ri yoki muddati o'tgan." : "Неверный код или срок его действия истек."));
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setActiveIndex(0);
      }
    } catch {
      setError(language === 'uz' ? "Server bilan bog'lanishda xatolik." : "Ошибка соединения с сервером.");
    } finally {
      setIsVerifying(false);
    }
  };

  const isCodeComplete = code.every((d) => d !== "");

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 sm:p-10">
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 relative">
              <div
                className="w-full h-full bg-primary-600"
                style={{
                  WebkitMaskImage: "url(/logo.svg)",
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskImage: "url(/logo.svg)",
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                }}
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-900 mb-2">
              {language === 'uz' ? 'Kodni Kiriting' : 'Введите код'}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              <a
                href="https://t.me/uupackbot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2AABEE] font-bold hover:underline"
              >
                @uupackbot
              </a>
              {language === 'uz' ? " telegram botiga kiring va 2 daqiqalik kodingizni oling." : " зайдите в телеграм-бот и получите ваш 2-минутный код."}
            </p>
          </div>

          {/* Code Inputs */}
          <div className="flex justify-center gap-2.5 sm:gap-3 mb-6" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <input
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => setActiveIndex(index)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all duration-200 bg-slate-50
                    ${error ? "border-red-300 text-red-600 bg-red-50/50" : ""}
                    ${!error && digit ? "border-primary-500 text-primary-700 bg-primary-50/50" : ""}
                    ${!error && !digit && activeIndex === index ? "border-primary-400 ring-4 ring-primary-100" : ""}
                    ${!error && !digit && activeIndex !== index ? "border-slate-200" : ""}
                  `}
                />
              </motion.div>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-red-500 text-sm font-semibold text-center mb-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Verify Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVerify}
            disabled={isVerifying}
            className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-base transition-all duration-300 shadow-lg
              ${isCodeComplete && !isVerifying
                ? "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/30"
                : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              }
            `}
          >
            {isVerifying ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {language === 'uz' ? 'Tekshirilmoqda...' : 'Проверка...'}
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                {language === 'uz' ? 'Tasdiqlash' : 'Подтвердить'}
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs font-bold text-slate-400 uppercase">
              {language === 'uz' ? "Botga o'tish" : 'Перейти в бот'}
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Open Bot Button */}
          <a
            href="https://t.me/uupackbot"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-[#2AABEE]/10 border-2 border-[#2AABEE]/20 hover:bg-[#2AABEE]/20 text-[#2AABEE] font-bold py-4 rounded-2xl transition-all group"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#2AABEE"/>
              <path d="M18.8471 6.84001C18.8471 6.84001 20.3015 6.22156 20.1975 7.66442C20.1456 8.28286 19.6781 10.9623 19.2626 13.9511L17.8082 21.0621C17.8082 21.0621 17.6524 21.8865 17.0291 22.0411C16.4057 22.1957 15.3669 21.5258 15.159 21.3713C14.9512 21.2167 11.4191 18.9495 10.1205 17.8159C9.75691 17.5068 9.34142 16.8884 10.1725 16.1155L16.0942 10.3957C16.7695 9.72582 17.4447 7.97384 14.3283 10.1384L7.52331 14.827C7.52331 14.827 6.84803 15.2393 5.60146 14.8785L2.84859 14.0025C2.84859 14.0025 1.80978 13.3326 3.57577 12.6627C8.45821 10.3954 13.5484 8.48895 18.8471 6.84001Z" fill="white"/>
            </svg>
            {language === 'uz' ? 'Telegram Botni ochish' : 'Открыть Telegram Бот'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Security Notice */}
          <div className="mt-6 flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-primary-500" />
            <span>{language === 'uz' ? 'Kod 2 daqiqa ichida amal qiladi. Kodni hech kimga bermang.' : 'Код действителен в течение 2 минут. Никому не передавайте код.'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
