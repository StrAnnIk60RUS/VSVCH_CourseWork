export type UiLanguage = 'ru' | 'en';

type Dictionary = {
  nav: {
    home: string;
    courses: string;
    myLearning: string;
    progress: string;
    reminders: string;
    teacher: string;
    profile: string;
    logout: string;
    login: string;
    register: string;
    openMenu: string;
    closeMenu: string;
    theme: string;
    language: string;
    light: string;
    dark: string;
  };
  common: {
    appName: string;
  };
  home: {
    heroTitle: string;
    heroBody: string;
    browseCourses: string;
    createAccount: string;
    benefits: Array<{ title: string; body: string }>;
    howItWorks: string;
    howSteps: string[];
    highlights: string;
    highlightsBody: string;
    nextSteps: string;
    nextStepsBody: string;
    goToCourses: string;
    logIn: string;
  };
  login: {
    pageTitle: string;
    pageDescription: string;
    cardTitle: string;
    passwordPlaceholder: string;
    submitIdle: string;
    submitPending: string;
    noAccount: string;
    registerLink: string;
  };
  register: {
    pageTitle: string;
    pageDescription: string;
    cardTitle: string;
    namePlaceholder: string;
    passwordPlaceholder: string;
    roleStudent: string;
    roleTeacher: string;
    submitIdle: string;
    submitPending: string;
    haveAccount: string;
    loginLink: string;
  };
  courses: {
    pageTitle: string;
    pageDescription: string;
    filters: string;
    searchPlaceholder: string;
    languagePlaceholder: string;
    levelPlaceholder: string;
    minRatingPlaceholder: string;
    sortNew: string;
    sortRating: string;
    sortPopularity: string;
    sortOld: string;
    reset: string;
    coursesLabel: string;
    lessonsLabel: string;
    openCourse: string;
    back: string;
    page: string;
    next: string;
  };
  profile: {
    pageTitle: string;
    pageDescription: string;
    profileData: string;
    resetUi: string;
    email: string;
    save: string;
    nameUpdated: string;
    localSettingsReset: string;
    resetButton: string;
  };
  progress: {
    pageTitle: string;
    pageDescription: string;
    history: string;
    reports: string;
    downloadPdf: string;
    downloadDocx: string;
    sendEmail: string;
    emailSent: string;
    demoMode: string;
  };
};

export const I18N_DICTIONARY: Record<UiLanguage, Dictionary> = {
  ru: {
    nav: {
      home: 'Главная',
      courses: 'Курсы',
      myLearning: 'Мое обучение',
      progress: 'Прогресс',
      reminders: 'Напоминания',
      teacher: 'Преподаватель',
      profile: 'Профиль',
      logout: 'Выйти',
      login: 'Войти',
      register: 'Регистрация',
      openMenu: 'Открыть меню',
      closeMenu: 'Закрыть меню',
      theme: 'Тема',
      language: 'Язык',
      light: 'Светлая',
      dark: 'Темная',
    },
    common: { appName: 'VSVH' },
    home: {
      heroTitle: 'Учитесь и преподавайте в одном месте',
      heroBody:
        'Платформа для гостей, студентов и преподавателей: изучайте каталог, входите в аккаунт и продолжайте обучение с места остановки.',
      browseCourses: 'Смотреть курсы',
      createAccount: 'Создать аккаунт',
      benefits: [
        {
          title: 'Структурированное обучение',
          body: 'Проходите последовательные уроки и отслеживайте прогресс на каждом шаге.',
        },
        {
          title: 'Для студентов и преподавателей',
          body: 'Учитесь в своем темпе или создавайте курсы и делитесь опытом.',
        },
        {
          title: 'Фокус на результате',
          body: 'Избранное, напоминания и прогресс помогают доводить обучение до конца.',
        },
      ],
      howItWorks: 'Как это работает',
      howSteps: [
        'Изучите каталог курсов и добавьте интересное в избранное.',
        'Запишитесь и проходите уроки по порядку с понятным прогрессом.',
        'Преподаватели создают курсы, добавляют уроки и отслеживают вовлеченность.',
      ],
      highlights: 'Важное',
      highlightsBody:
        'Здесь будут отображаться ключевые обновления платформы. Пока можно перейти в каталог или войти в аккаунт.',
      nextSteps: 'Следующие шаги',
      nextStepsBody: 'Откройте каталог курсов или войдите в личный кабинет, чтобы продолжить обучение.',
      goToCourses: 'Перейти к курсам',
      logIn: 'Войти',
    },
    login: {
      pageTitle: 'Вход',
      pageDescription: 'Войдите в аккаунт для продолжения обучения.',
      cardTitle: 'Форма входа',
      passwordPlaceholder: 'Пароль',
      submitIdle: 'Войти',
      submitPending: 'Вход...',
      noAccount: 'Нет аккаунта?',
      registerLink: 'Зарегистрироваться',
    },
    register: {
      pageTitle: 'Регистрация',
      pageDescription: 'Создайте аккаунт студента или преподавателя.',
      cardTitle: 'Новый аккаунт',
      namePlaceholder: 'Имя',
      passwordPlaceholder: 'Пароль',
      roleStudent: 'Студент',
      roleTeacher: 'Преподаватель',
      submitIdle: 'Создать аккаунт',
      submitPending: 'Создание...',
      haveAccount: 'Уже есть аккаунт?',
      loginLink: 'Войти',
    },
    courses: {
      pageTitle: 'Каталог курсов',
      pageDescription: 'Публичный каталог с фильтрами, сортировкой и пагинацией.',
      filters: 'Фильтры',
      searchPlaceholder: 'Поиск',
      languagePlaceholder: 'Язык',
      levelPlaceholder: 'Уровень',
      minRatingPlaceholder: 'Мин. рейтинг',
      sortNew: 'Новые',
      sortRating: 'Рейтинг',
      sortPopularity: 'Популярность',
      sortOld: 'Старые',
      reset: 'Сброс',
      coursesLabel: 'Курсы',
      lessonsLabel: 'уроков',
      openCourse: 'Открыть курс',
      back: 'Назад',
      page: 'Страница',
      next: 'Далее',
    },
    profile: {
      pageTitle: 'Профиль',
      pageDescription: 'Профиль пользователя и сброс UI-настроек.',
      profileData: 'Данные профиля',
      resetUi: 'Сброс интерфейса',
      email: 'Email',
      save: 'Сохранить',
      nameUpdated: 'Имя обновлено',
      localSettingsReset: 'Локальные настройки сброшены',
      resetButton: 'Сбросить настройки интерфейса',
    },
    progress: {
      pageTitle: 'Прогресс',
      pageDescription: 'История отправок и отчеты в PDF/DOCX/e-mail.',
      history: 'История отправок',
      reports: 'Отчеты',
      downloadPdf: 'Скачать PDF',
      downloadDocx: 'Скачать DOCX',
      sendEmail: 'Отправить на e-mail',
      emailSent: 'Письмо отправлено',
      demoMode: 'Демо-режим',
    },
  },
  en: {
    nav: {
      home: 'Home',
      courses: 'Courses',
      myLearning: 'My learning',
      progress: 'Progress',
      reminders: 'Reminders',
      teacher: 'Teacher',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      theme: 'Theme',
      language: 'Language',
      light: 'Light',
      dark: 'Dark',
    },
    common: { appName: 'VSVH' },
    home: {
      heroTitle: 'Learn and teach in one place',
      heroBody:
        'Platform for guests, students, and teachers: browse courses, sign in, and continue exactly where you left off.',
      browseCourses: 'Browse courses',
      createAccount: 'Create account',
      benefits: [
        {
          title: 'Structured learning',
          body: 'Follow a clear lesson flow and track progress at every step.',
        },
        {
          title: 'For students and teachers',
          body: 'Study at your own pace or create and publish your own courses.',
        },
        {
          title: 'Focus on outcomes',
          body: 'Favorites, reminders, and progress help you finish what you start.',
        },
      ],
      howItWorks: 'How it works',
      howSteps: [
        'Explore the course catalog and save favorites.',
        'Enroll and complete lessons in sequence with clear progress.',
        'Teachers create courses, add lessons, and track engagement.',
      ],
      highlights: 'Highlights',
      highlightsBody:
        'Important platform updates will appear here. For now, open the catalog or sign in to continue learning.',
      nextSteps: 'Next steps',
      nextStepsBody: 'Start browsing courses or open your account area to continue learning.',
      goToCourses: 'Go to courses',
      logIn: 'Log in',
    },
    login: {
      pageTitle: 'Login',
      pageDescription: 'Sign in to your account to continue learning.',
      cardTitle: 'Sign in form',
      passwordPlaceholder: 'Password',
      submitIdle: 'Sign in',
      submitPending: 'Signing in...',
      noAccount: "Don't have an account?",
      registerLink: 'Register',
    },
    register: {
      pageTitle: 'Register',
      pageDescription: 'Create a student or teacher account.',
      cardTitle: 'New account',
      namePlaceholder: 'Name',
      passwordPlaceholder: 'Password',
      roleStudent: 'Student',
      roleTeacher: 'Teacher',
      submitIdle: 'Create account',
      submitPending: 'Creating...',
      haveAccount: 'Already have an account?',
      loginLink: 'Login',
    },
    courses: {
      pageTitle: 'Course catalog',
      pageDescription: 'Public catalog with filtering, sorting, and pagination.',
      filters: 'Filters',
      searchPlaceholder: 'Search',
      languagePlaceholder: 'Language',
      levelPlaceholder: 'Level',
      minRatingPlaceholder: 'Min rating',
      sortNew: 'Newest',
      sortRating: 'Rating',
      sortPopularity: 'Popularity',
      sortOld: 'Oldest',
      reset: 'Reset',
      coursesLabel: 'Courses',
      lessonsLabel: 'lessons',
      openCourse: 'Open course',
      back: 'Back',
      page: 'Page',
      next: 'Next',
    },
    profile: {
      pageTitle: 'Profile',
      pageDescription: 'User profile and UI settings reset.',
      profileData: 'Profile data',
      resetUi: 'UI reset',
      email: 'Email',
      save: 'Save',
      nameUpdated: 'Name updated',
      localSettingsReset: 'Local settings were reset',
      resetButton: 'Reset interface settings',
    },
    progress: {
      pageTitle: 'Progress',
      pageDescription: 'Submission history and PDF/DOCX/e-mail reports.',
      history: 'Submission history',
      reports: 'Reports',
      downloadPdf: 'Download PDF',
      downloadDocx: 'Download DOCX',
      sendEmail: 'Send by e-mail',
      emailSent: 'E-mail sent',
      demoMode: 'Demo mode',
    },
  },
};
