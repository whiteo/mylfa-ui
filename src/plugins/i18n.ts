import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    pageTitle: 'My Little Finance Analyst',
    HomePageDemoButton: 'Demo',
    HomePageLoginButton: 'Sign in',
    HomePageRegistrationButton: 'Registration',
    footerText: 'by WhiteO',
    language: 'Language',
    dashboard: 'Dashboard',
    currency: 'Currency',
    category: 'Category',
    income: 'Income',
    outlay: 'Outlay',
    account: 'Account',
    verified: 'Verified',
    HomePageRegistrationTitelText: 'Sign up',
    HomePageLoginTitelText: 'Sign in',
    HomePageEmailText: 'E-mail',
    HomePagePasswordText: 'Password',
    HomePageConfirmPasswordText: 'Confirm password',
    HomePageInProgressText: 'in progress',
    logout: 'logout',
  },
  de: {
    pageTitle: 'My Little Finance Analyst',
    HomePageDemoButton: 'Bezeigung',
    HomePageLoginButton: 'Anmelden',
    HomePageRegistrationButton: 'Anmeldung',
    footerText: 'by WhiteO',
    language: 'Sprache',
    dashboard: 'Dashboard',
    currency: 'Währung',
    category: 'Kategorie',
    income: 'Einkommen',
    outlay: 'Kosten',
    account: 'Benutzerkonto',
    verified: 'Verifiziert',
    HomePageRegistrationTitelText: 'Anmeldung',
    HomePageLoginTitelText: 'Anmelden',
    HomePageEmailText: 'E-mail',
    HomePagePasswordText: 'Passwort',
    HomePageConfirmPasswordText: 'Bestätige das Passwort',
    HomePageInProgressText: 'im Gange',
    logout: 'Ausloggen',
  },
  ru: {
    pageTitle: 'My Little Finance Analyst',
    HomePageDemoButton: 'Демо',
    HomePageLoginButton: 'Войти',
    HomePageRegistrationButton: 'Регистрация',
    footerText: 'by WhiteO',
    language: "Язык",
    dashboard: 'Главная',
    currency: 'Валюта',
    category: 'Категории',
    income: 'Приход',
    outlay: 'Расход',
    account: 'Учетная запись',
    verified: 'Подтверждена',
    HomePageRegistrationTitelText: 'Регистрация',
    HomePageLoginTitelText: 'Авторизация',
    HomePageEmailText: 'E-mail',
    HomePagePasswordText: 'Пароль',
    HomePageConfirmPasswordText: 'Подтверждение пароля',
    HomePageInProgressText: 'выполняется регистрация',
    logout: 'Выход',
  },
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages,
});

export default i18n;
