export const translations = {
  uz: {
    nav: {
      home: "Bosh sahifa",
      catalog: "Katalog",
      about: "Biz haqimizda",
      delivery: "Yetkazib berish",
      contact: "Aloqa",
      cart: "Savat",
      login: "Kirish",
      profile: "Profil"
    },
    footer: {
      catalog: "Katalog",
      disposable: "Bir martalik idishlar",
      packaging: "Qadoqlash vositalari",
      chemicals: "Ximiya va tozalash",
      for_clients: "Mijozlarga",
      about: "Kompaniya haqida",
      delivery: "Yetkazib berish",
      faq: "Ko'p so'raladigan savollar",
      privacy: "Maxfiylik siyosati",
      contact: "Aloqa",
      address: "Toshkent shahri, Yunusobod tumani",
      rights: "Barcha huquqlar himoyalangan."
    },
    home: {
      hero_badge: "O'zbekistondagi eng yirik B2B platforma",
      hero_title: "Biznesingiz uchun sifatli qadoqlash vositalari",
      hero_desc: "UPack orqali restoran, kafe va do'koningiz uchun kerakli barcha bir martalik idishlar va qadoqlash vositalarini ulgurji narxlarda xarid qiling.",
      hero_btn_catalog: "Katalogga o'tish",
      hero_btn_contact: "Biz bilan bog'lanish",
      features: {
        wholesale: {
          title: "Ulgurji narxlar",
          desc: "To'g'ridan-to'g'ri ishlab chiqaruvchidan arzon narxlar"
        },
        delivery: {
          title: "Tez yetkazib berish",
          desc: "Toshkent shahri ichida 24 soat ichida"
        },
        quality: {
          title: "Yuqori sifat",
          desc: "Barcha mahsulotlar sertifikatlangan"
        },
        support: {
          title: "24/7 Qo'llab-quvvatlash",
          desc: "Har doim aloqadamiz"
        }
      }
    }
  },
  ru: {
    nav: {
      home: "Главная",
      catalog: "Каталог",
      about: "О нас",
      delivery: "Доставка",
      contact: "Контакты",
      cart: "Корзина",
      login: "Войти",
      profile: "Профиль"
    },
    footer: {
      catalog: "Каталог",
      disposable: "Одноразовая посуда",
      packaging: "Упаковочные материалы",
      chemicals: "Бытовая химия и уборка",
      for_clients: "Клиентам",
      about: "О компании",
      delivery: "Доставка",
      faq: "Часто задаваемые вопросы",
      privacy: "Политика конфиденциальности",
      contact: "Контакты",
      address: "г. Ташкент, Юнусабадский район",
      rights: "Все права защищены."
    },
    home: {
      hero_badge: "Крупнейшая B2B платформа в Узбекистане",
      hero_title: "Качественные упаковочные материалы для вашего бизнеса",
      hero_desc: "Приобретайте через UPack всю необходимую одноразовую посуду и упаковку для вашего ресторана, кафе или магазина по оптовым ценам.",
      hero_btn_catalog: "Перейти в каталог",
      hero_btn_contact: "Связаться с нами",
      features: {
        wholesale: {
          title: "Оптовые цены",
          desc: "Низкие цены напрямую от производителя"
        },
        delivery: {
          title: "Быстрая доставка",
          desc: "В течение 24 часов по Ташкенту"
        },
        quality: {
          title: "Высокое качество",
          desc: "Вся продукция сертифицирована"
        },
        support: {
          title: "Поддержка 24/7",
          desc: "Мы всегда на связи"
        }
      }
    }
  }
};

export type Language = "uz" | "ru";
export type TranslationDict = typeof translations.uz;
