import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      "nav": {
        "about": "À propos",
        "solutions": "Nos solutions",
        "stories": "Histoires",
        "projects": "Projets",
        "impact": "Impact",
        "engagement": "S'engager",
        "contact": "Contact",
        "admin": "Admin"
      },
      "hero": {
        "title": "SOLIDARITÉ ACTIVE POUR LE DÉVELOPPEMENT",
        "badge": "Ensemble pour le bien être des enfants et des communautés",
        "but": "But : contribuer à l’amélioration des conditions de vie socio‑économiques et culturelles des communautés, dans une approche de développement durable, inclusif et participatif.",
        "cta1": "S'engager",
        "cta2": "Découvrir nos actions"
      },
      "news": {
        "title": "Actualités",
        "desc": "Les nouvelles publiées par l’équipe.",
        "loading": "Chargement des actualités...",
        "empty": "Aucune actualité pour le moment."
      },
      "about": {
        "title": "À propos de SAD",
        "desc": "Informations officielles : siège, but, vision et mission.",
        "siege": "Siège",
        "vision": "Vision",
        "mission": "Mission",
        "but_title": "But"
      },
      "contact": {
        "title": "Newsletter et contact",
        "desc": "Rester informé, poser une question, ou proposer votre aide.",
        "newsletter_title": "S'inscrire à la newsletter",
        "email_label": "Adresse e-mail",
        "subscribe": "S'inscrire",
        "newsletter_hint": "Pas de spam. Des nouvelles locales, une fois par mois.",
        "write_us": "Nous écrire",
        "name_label": "Nom",
        "message_label": "Message",
        "send": "Envoyer",
        "contact_hint": "Ou écrivez-nous :"
      }
    }
  },
  en: {
    translation: {
      "nav": {
        "about": "About",
        "solutions": "Our Solutions",
        "stories": "Stories",
        "projects": "Projects",
        "impact": "Impact",
        "engagement": "Get Involved",
        "contact": "Contact",
        "admin": "Admin"
      },
      "hero": {
        "title": "ACTIVE SOLIDARITY FOR DEVELOPMENT",
        "badge": "Together for the well-being of children and communities",
        "but": "Goal: contribute to improving the socio-economic and cultural living conditions of communities, in a sustainable, inclusive, and participatory development approach.",
        "cta1": "Get Involved",
        "cta2": "Discover our actions"
      },
      "news": {
        "title": "News",
        "desc": "Latest updates from the team.",
        "loading": "Loading news...",
        "empty": "No news at the moment."
      },
      "about": {
        "title": "About SAD",
        "desc": "Official information: headquarters, goal, vision, and mission.",
        "siege": "Headquarters",
        "vision": "Vision",
        "mission": "Mission",
        "but_title": "Goal"
      },
      "contact": {
        "title": "Newsletter and Contact",
        "desc": "Stay informed, ask a question, or offer your help.",
        "newsletter_title": "Subscribe to our newsletter",
        "email_label": "Email address",
        "subscribe": "Subscribe",
        "newsletter_hint": "No spam. Local news, once a month.",
        "write_us": "Write to us",
        "name_label": "Name",
        "message_label": "Message",
        "send": "Send",
        "contact_hint": "Or write to us at:"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
