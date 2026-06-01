export type UiLanguage = 'ru' | 'en';

type Dictionary = {
  nav: {
    home: string;
    courses: string;
    myLearning: string;
    currentCourses: string;
    favorites: string;
    progress: string;
    reminders: string;
    teacher: string;
    analytics: string;
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
    settings: string;
    up: string;
  };
  common: {
    appName: string;
  };
  footer: {
    copyright: string;
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
    goToMyLearning: string;
    goToTeacherCourses: string;
    goToProfile: string;
    discoveryTitle: string;
    discoveryBody: string;
    quickPopular: string;
    quickNewest: string;
    quickEnglish: string;
    quickBeginner: string;
    lessonsLabel: string;
    openCourse: string;
    teacherHubTitle: string;
    teacherHubBody: string;
    teacherManageCourses: string;
    teacherManageCoursesBody: string;
    teacherCreateCourse: string;
    teacherCreateCourseBody: string;
    teacherAnalytics: string;
    teacherAnalyticsBody: string;
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
    certificates: string;
    email: string;
    save: string;
    nameUpdated: string;
    localSettingsReset: string;
    resetButton: string;
    certificateNumber: string;
    certificateIssuedAt: string;
    certificatesEmpty: string;
    downloadPdf: string;
    certificateDownloaded: string;
    teacherMiniStats: string;
    teacherStatsCourse: string;
    teacherStatsNoCourses: string;
    teacherCoursesTotal: string;
    teacherCoursesPublished: string;
    teacherAverageRating: string;
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
    myLearningLink: string;
    coursesLink: string;
    homeLink: string;
    emailPlaceholder: string;
    reportDownloadedPdf: string;
    reportDownloadedDocx: string;
  };
  app: { reminderTitle: string; close: string };
  auth: { loadingSession: string };
  lesson: {
    titleFallback: string;
    description: string;
    toCourse: string;
    allCourses: string;
    myLearning: string;
    lockNonStudent: string;
    lockNotEnrolled: string;
    enrollSection: string;
    enrollHint: string;
    enroll: string;
    openCourse: string;
    theory: string;
    noTheory: string;
    courseProgress: string;
    checkingEnrollment: string;
    exercisesProgress: string;
    exercisesProgressHint: string;
    currentProgress: string;
    progressAuto: string;
    exercises: string;
    exerciseHintNonStudent: string;
    loadingAnswers: string;
    questionMissing: string;
    yourAnswer: string;
    answerPlaceholder: string;
    answerLabel: string;
    submit: string;
    accepted: string;
    correct: string;
    incorrect: string;
    points: string;
    outOf: string;
    retryHint: string;
    nextLesson: string;
    resolvingSequence: string;
    nextPrefix: string;
    nextButton: string;
    lastLesson: string;
  };
  courseDetail: {
    titleFallback: string;
    loadingDescription: string;
    allCourses: string;
    home: string;
    about: string;
    loading: string;
    notFound: string;
    ratingWord: string;
    na: string;
    unenrolled: string;
    enrolled: string;
    checkingEnrollment: string;
    unenroll: string;
    enroll: string;
    removedFromFavorites: string;
    addedToFavorites: string;
    checkingFavorites: string;
    removeFavorite: string;
    addFavorite: string;
    reviews: string;
    rateSection: string;
    yourRating: string;
    optionalComment: string;
    savePending: string;
    saveRating: string;
    rateAfterEnroll: string;
    rateAfterProgress: string;
    lessons: string;
    lessonProgress: string;
    completed: string;
    inProgress: string;
    open: string;
    savedRating: string;
  };
  reminders: {
    pageTitle: string;
    pageDescription: string;
    loadFailedFallback: string;
    titleRequired: string;
    dateRequired: string;
    futureDateRequired: string;
    editSaved: string;
    newSection: string;
    yourSection: string;
    titlePlaceholder: string;
    titleAria: string;
    dateAria: string;
    add: string;
    added: string;
    empty: string;
    save: string;
    cancel: string;
    edit: string;
    deleted: string;
    delete: string;
  };
  myLearning: {
    pageTitle: string;
    pageDescription: string;
    catalog: string;
    home: string;
    enrollments: string;
    progress: string;
    certIssued: string;
    toCourse: string;
    issuing: string;
    issueCertificate: string;
    downloadPdf: string;
    unenroll: string;
  };
  favorites: {
    pageTitle: string;
    pageDescription: string;
    sectionTitle: string;
    open: string;
    remove: string;
  };
  courseReviews: {
    pageTitle: string;
    pageDescriptionFallback: string;
    toCourse: string;
    allCourses: string;
    sectionTitle: string;
    loading: string;
    empty: string;
    userFallback: string;
    rating: string;
    noComment: string;
    backToCourse: string;
  };
  teacherManage: {
    pageTitle: string;
    pageDescription: string;
    backToCourses: string;
    content: string;
    studentsCsv: string;
    reports: string;
  };
  teacherContent: {
    courseTitle: string;
    language: string;
    level: string;
    courseDescription: string;
    savePending: string;
    saveCourse: string;
    lessonTitle: string;
    lessonContentOptional: string;
    createPending: string;
    addLesson: string;
    lesson: string;
    deletePending: string;
    deleteLesson: string;
    saveLesson: string;
    lessonContent: string;
    exerciseTitle: string;
    points: string;
    question: string;
    correctAnswer: string;
    save: string;
    delete: string;
    addExerciseTitle: string;
    addPoints: string;
    addExercise: string;
    addPending: string;
    markdownHint: string;
  };
  teacherStudents: {
    all: string;
    active: string;
    inactive: string;
    name: string;
    progress: string;
    activity: string;
    downloadCsv: string;
  };
  teacherReports: {
    pdfSummary: string;
    docxSummary: string;
    sendEmail: string;
    noCourseId: string;
  };
  teacherNewCourse: {
    pageTitle: string;
    pageDescription: string;
    backToCourses: string;
    formTitle: string;
    title: string;
    description: string;
    language: string;
    level: string;
    create: string;
  };
  teacherCourses: {
    pageTitle: string;
    pageDescription: string;
    home: string;
    listTitle: string;
    createCourse: string;
    lessons: string;
    students: string;
    rating: string;
    reviews: string;
    notAvailable: string;
    openReviews: string;
    manage: string;
    delete: string;
    deleting: string;
    deleted: string;
    deleteConfirm: string;
  };
  teacherAnalytics: {
    pageTitle: string;
    pageDescription: string;
    backToCourses: string;
    chooseCourse: string;
    chooseCoursePlaceholder: string;
    period: string;
    students: string;
    avgProgress: string;
    active7d: string;
    activePeriod: string;
    riskStudents: string;
    riskDefinition: string;
    submissionsTrend: string;
    activityTrend: string;
    submissionsSeries: string;
    activeStudentsSeries: string;
    progressDistribution: string;
    studentsProgress: string;
    riskOnly: string;
    allStudents: string;
    noData: string;
    viewManage: string;
    exportPdf: string;
    exportDocx: string;
    exportCsv: string;
    sendEmail: string;
  };
};

export const I18N_DICTIONARY: Record<UiLanguage, Dictionary> = {
  ru: {
    nav: {
      home: 'Главная',
      courses: 'Курсы',
      myLearning: 'Мое обучение',
      currentCourses: 'Текущие курсы',
      favorites: 'Избранное',
      progress: 'Прогресс',
      reminders: 'Напоминания',
      teacher: 'Преподаватель',
      analytics: 'Аналитика',
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
      settings: 'Настройки',
      up: 'Навигация на уровень выше',
    },
    common: { appName: 'VSVH' },
    footer: {
      copyright: '© 2026 VSVH. Все права защищены.',
    },
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
      goToMyLearning: 'Мое обучение',
      goToTeacherCourses: 'Мои курсы',
      goToProfile: 'Профиль',
      discoveryTitle: 'Подборки для быстрого старта',
      discoveryBody: 'Используйте быстрые фильтры или откройте популярные курсы прямо с главной.',
      quickPopular: 'Популярные',
      quickNewest: 'Новые',
      quickEnglish: 'English',
      quickBeginner: 'Начальный уровень',
      lessonsLabel: 'уроков',
      openCourse: 'Открыть курс',
      teacherHubTitle: 'Панель преподавателя',
      teacherHubBody: 'Управляйте своими курсами, создавайте новые программы и отслеживайте метрики обучения.',
      teacherManageCourses: 'Мои курсы',
      teacherManageCoursesBody: 'Открыть список ваших курсов и перейти к редактированию.',
      teacherCreateCourse: 'Создать курс',
      teacherCreateCourseBody: 'Запустить мастер создания нового курса.',
      teacherAnalytics: 'Аналитика',
      teacherAnalyticsBody: 'Посмотреть вовлеченность и прогресс по вашим курсам.',
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
      certificates: 'Сертификаты',
      email: 'Email',
      save: 'Сохранить',
      nameUpdated: 'Имя обновлено',
      localSettingsReset: 'Локальные настройки сброшены',
      resetButton: 'Сбросить настройки интерфейса',
      certificateNumber: 'Номер',
      certificateIssuedAt: 'Выдан',
      certificatesEmpty: 'Сертификатов пока нет.',
      downloadPdf: 'Скачать PDF',
      certificateDownloaded: 'Сертификат скачан.',
      teacherMiniStats: 'Общая статистика по курсам',
      teacherStatsCourse: 'Курс для статистики',
      teacherStatsNoCourses: 'У вас пока нет курсов для отображения статистики.',
      teacherCoursesTotal: 'Всего курсов',
      teacherCoursesPublished: 'Опубликовано курсов',
      teacherAverageRating: 'Средний рейтинг курсов',
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
      myLearningLink: 'Мое обучение',
      coursesLink: 'Каталог курсов',
      homeLink: 'На главную',
      emailPlaceholder: 'email@example.com',
      reportDownloadedPdf: 'PDF-отчёт скачан.',
      reportDownloadedDocx: 'DOCX-отчёт скачан.',
    },
    app: { reminderTitle: 'Напоминание', close: 'Закрыть' },
    auth: { loadingSession: 'Загрузка сессии...' },
    lesson: {
      titleFallback: 'Урок',
      description: 'Контент урока, упражнения и прогресс по курсу.',
      toCourse: 'К курсу',
      allCourses: 'Все курсы',
      myLearning: 'Мое обучение',
      lockNonStudent: 'Действия на уроке доступны только студентам, записанным на курс.',
      lockNotEnrolled: 'Вы не записаны на этот курс, поэтому действия с прогрессом и упражнениями недоступны.',
      enrollSection: 'Запись на курс',
      enrollHint: 'Чтобы отмечать урок и отправлять ответы, нужна запись на этот курс.',
      enroll: 'Записаться на курс',
      openCourse: 'Открыть карточку курса',
      theory: 'Теория урока',
      noTheory: 'Теория для этого урока пока не добавлена преподавателем.',
      courseProgress: 'Прогресс по курсу',
      checkingEnrollment: 'Проверяем запись на курс...',
      exercisesProgress: 'Прогресс по упражнениям',
      exercisesProgressHint: 'Процент растет, когда вы решаете упражнения ниже.',
      currentProgress: 'Текущий прогресс курса по упражнениям:',
      progressAuto: 'Прогресс обновляется автоматически по результатам упражнений.',
      exercises: 'Упражнения',
      exerciseHintNonStudent: 'Отправка ответов и учёт баллов доступны студентам, записанным на курс.',
      loadingAnswers: 'Подтягиваем ваши ответы…',
      questionMissing: 'Вопрос не указан',
      yourAnswer: 'Ваш ответ:',
      answerPlaceholder: 'Ваш ответ',
      answerLabel: 'Ответ',
      submit: 'Отправить',
      accepted: 'Ответ засчитан.',
      correct: 'Верно',
      incorrect: 'Неверно',
      points: 'баллы',
      outOf: 'из',
      retryHint: 'Измените ответ и отправьте снова — засчитывается лучший результат.',
      nextLesson: 'Следующий урок',
      resolvingSequence: 'Определяем последовательность уроков...',
      nextPrefix: 'Далее',
      nextButton: 'Следующий урок',
      lastLesson: 'Это последний урок.',
    },
    courseDetail: {
      titleFallback: 'Курс',
      loadingDescription: 'Загрузка...',
      allCourses: 'Все курсы',
      home: 'На главную',
      about: 'О курсе',
      loading: 'Загрузка данных курса...',
      notFound: 'Курс не найден.',
      ratingWord: 'рейтинг',
      na: 'н/д',
      unenrolled: 'Запись на курс удалена',
      enrolled: 'Вы записаны на курс',
      checkingEnrollment: 'Проверка записи...',
      unenroll: 'Отписаться',
      enroll: 'Записаться',
      removedFromFavorites: 'Курс удален из избранного',
      addedToFavorites: 'Курс добавлен в избранное',
      checkingFavorites: 'Проверка избранного...',
      removeFavorite: 'Убрать из избранного',
      addFavorite: 'В избранное',
      reviews: 'Отзывы',
      rateSection: 'Оценка курса',
      yourRating: 'Ваша оценка',
      optionalComment: 'Комментарий (необязательно)',
      savePending: 'Сохранение...',
      saveRating: 'Сохранить оценку',
      rateAfterEnroll: 'Оценить курс можно после записи на него.',
      rateAfterProgress: 'Оценить курс можно после прохождения минимум {percent}%.',
      lessons: 'Уроки',
      lessonProgress: 'Прогресс урока',
      completed: 'Пройден',
      inProgress: 'В процессе',
      open: 'Открыть',
      savedRating: 'Оценка курса сохранена',
    },
    reminders: {
      pageTitle: 'Напоминания',
      pageDescription: 'Запланируйте напоминания о занятиях и дедлайнах — они сохраняются в вашем аккаунте и доступны только вам.',
      loadFailedFallback: 'Не удалось загрузить напоминания. Попробуйте обновить страницу.',
      titleRequired: 'Укажите, о чём напомнить.',
      dateRequired: 'Выберите дату и время напоминания.',
      futureDateRequired: 'Время напоминания должно быть в будущем.',
      editSaved: 'Готово — изменения сохранены.',
      newSection: 'Новое напоминание',
      yourSection: 'Ваши напоминания',
      titlePlaceholder: 'О чём напомнить',
      titleAria: 'Текст напоминания',
      dateAria: 'Когда напомнить',
      add: 'Добавить',
      added: 'Напоминание добавлено.',
      empty: 'Пока нет напоминаний — добавьте первое в блоке выше.',
      save: 'Сохранить',
      cancel: 'Отмена',
      edit: 'Изменить',
      deleted: 'Напоминание удалено.',
      delete: 'Удалить',
    },
    myLearning: {
      pageTitle: 'Мое обучение',
      pageDescription: 'Активные записи на курсы и текущий прогресс.',
      catalog: 'Каталог курсов',
      home: 'На главную',
      enrollments: 'Записи на курсы',
      progress: 'Прогресс',
      certIssued: 'Сертификат №',
      toCourse: 'К курсу',
      issuing: 'Выдача...',
      issueCertificate: 'Получить сертификат',
      downloadPdf: 'Скачать PDF',
      unenroll: 'Отписаться',
    },
    favorites: {
      pageTitle: 'Избранное',
      pageDescription: 'Сохраненные курсы и быстрые действия.',
      sectionTitle: 'Список избранного',
      open: 'Открыть',
      remove: 'Удалить',
    },
    courseReviews: {
      pageTitle: 'Отзывы',
      pageDescriptionFallback: 'Отзывы о курсе',
      toCourse: 'К курсу',
      allCourses: 'Все курсы',
      sectionTitle: 'Отзывы',
      loading: 'Загрузка отзывов...',
      empty: 'Пока нет отзывов.',
      userFallback: 'Пользователь',
      rating: 'Оценка',
      noComment: 'Без комментария',
      backToCourse: 'Вернуться к курсу',
    },
    teacherManage: {
      pageTitle: 'Редактирование курса',
      pageDescription: 'Редактируйте материалы курса, отслеживайте студентов и выгружайте отчеты.',
      backToCourses: 'К списку моих курсов',
      content: 'Уроки и упражнения',
      studentsCsv: 'Студенты и CSV',
      reports: 'Отчеты и e-mail',
    },
    teacherContent: {
      courseTitle: 'Название курса',
      language: 'Язык',
      level: 'Уровень',
      courseDescription: 'Описание курса',
      savePending: 'Сохранение...',
      saveCourse: 'Сохранить курс',
      lessonTitle: 'Название урока',
      lessonContentOptional: 'Описание/контент урока (опционально)',
      createPending: 'Создание...',
      addLesson: 'Добавить урок',
      lesson: 'Урок',
      deletePending: 'Удаление...',
      deleteLesson: 'Удалить урок',
      saveLesson: 'Сохранить урок',
      lessonContent: 'Контент урока',
      exerciseTitle: 'Название',
      points: 'Баллы',
      question: 'Вопрос',
      correctAnswer: 'Правильный ответ',
      save: 'Сохранить',
      delete: 'Удалить',
      addExerciseTitle: 'Название упражнения',
      addPoints: 'Баллы (maxScore)',
      addExercise: 'Добавить упражнение в урок',
      addPending: 'Добавление...',
      markdownHint: 'Поддерживается Markdown: заголовки, списки, **жирный**, *курсив*, `код`, ссылки.',
    },
    teacherStudents: {
      all: 'Все',
      active: 'Активные',
      inactive: 'Неактивные',
      name: 'Имя',
      progress: 'Прогресс',
      activity: 'Активность',
      downloadCsv: 'Скачать CSV',
    },
    teacherReports: {
      pdfSummary: 'PDF сводка',
      docxSummary: 'DOCX сводка',
      sendEmail: 'Отправить e-mail',
      noCourseId: 'Идентификатор курса не указан.',
    },
    teacherNewCourse: {
      pageTitle: 'Создание курса',
      pageDescription: 'Создайте новый курс и настройте его основные параметры.',
      backToCourses: 'К списку моих курсов',
      formTitle: 'Форма курса',
      title: 'Название',
      description: 'Описание',
      language: 'Язык',
      level: 'Уровень',
      create: 'Создать',
    },
    teacherCourses: {
      pageTitle: 'Курсы преподавателя',
      pageDescription: 'Ваши курсы и переход к управлению.',
      home: 'На главную',
      listTitle: 'Список курсов',
      createCourse: 'Создать курс',
      lessons: 'уроков',
      students: 'студентов',
      rating: 'рейтинг',
      reviews: 'отзывов',
      notAvailable: 'н/д',
      openReviews: 'Отзывы',
      manage: 'Управлять',
      delete: 'Удалить',
      deleting: 'Удаление...',
      deleted: 'Курс удален.',
      deleteConfirm: 'Удалить курс "{title}"?',
    },
    teacherAnalytics: {
      pageTitle: 'Аналитика преподавателя',
      pageDescription: 'KPI и графики по вовлечённости студентов и прогрессу курса.',
      backToCourses: 'К курсам преподавателя',
      chooseCourse: 'Курс',
      chooseCoursePlaceholder: 'Выберите курс',
      period: 'Период',
      students: 'Студентов',
      avgProgress: 'Средний прогресс',
      active7d: 'Активных за 7 дней',
      activePeriod: 'Активных за период',
      riskStudents: 'Группа риска',
      riskDefinition: 'Прогресс < 40% или не было активности в выбранный период.',
      submissionsTrend: 'Динамика отправок',
      activityTrend: 'Активные студенты по дням',
      submissionsSeries: 'Отправки',
      activeStudentsSeries: 'Активные студенты',
      progressDistribution: 'Распределение прогресса',
      studentsProgress: 'Прогресс студентов',
      riskOnly: 'Только группа риска',
      allStudents: 'Все студенты',
      noData: 'Недостаточно данных для отображения.',
      viewManage: 'Перейти в управление курсом',
      exportPdf: 'PDF отчёт',
      exportDocx: 'DOCX отчёт',
      exportCsv: 'CSV студентов',
      sendEmail: 'Отправить отчёт на e-mail',
    },
  },
  en: {
    nav: {
      home: 'Home',
      courses: 'Courses',
      myLearning: 'My learning',
      currentCourses: 'Current courses',
      favorites: 'Favorites',
      progress: 'Progress',
      reminders: 'Reminders',
      teacher: 'Teacher',
      analytics: 'Analytics',
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
      settings: 'Settings',
      up: 'Navigate up',
    },
    common: { appName: 'VSVH' },
    footer: {
      copyright: '© 2026 VSVH. All rights reserved.',
    },
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
      goToMyLearning: 'My learning',
      goToTeacherCourses: 'My courses',
      goToProfile: 'Profile',
      discoveryTitle: 'Quick picks to start faster',
      discoveryBody: 'Use quick filters or open popular courses directly from the home page.',
      quickPopular: 'Popular',
      quickNewest: 'Newest',
      quickEnglish: 'English',
      quickBeginner: 'Beginner level',
      lessonsLabel: 'lessons',
      openCourse: 'Open course',
      teacherHubTitle: 'Teacher hub',
      teacherHubBody: 'Manage your courses, create new programs, and track learning metrics.',
      teacherManageCourses: 'My courses',
      teacherManageCoursesBody: 'Open your course list and continue to course management.',
      teacherCreateCourse: 'Create course',
      teacherCreateCourseBody: 'Start creating a new course.',
      teacherAnalytics: 'Analytics',
      teacherAnalyticsBody: 'Review engagement and progress for your courses.',
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
      certificates: 'Certificates',
      email: 'Email',
      save: 'Save',
      nameUpdated: 'Name updated',
      localSettingsReset: 'Local settings were reset',
      resetButton: 'Reset interface settings',
      certificateNumber: 'Number',
      certificateIssuedAt: 'Issued',
      certificatesEmpty: 'No certificates yet.',
      downloadPdf: 'Download PDF',
      certificateDownloaded: 'Certificate downloaded.',
      teacherMiniStats: 'Overall courses statistics',
      teacherStatsCourse: 'Course for stats',
      teacherStatsNoCourses: 'You have no courses yet to show statistics.',
      teacherCoursesTotal: 'Total courses',
      teacherCoursesPublished: 'Published courses',
      teacherAverageRating: 'Average course rating',
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
      myLearningLink: 'My learning',
      coursesLink: 'Course catalog',
      homeLink: 'Home',
      emailPlaceholder: 'email@example.com',
      reportDownloadedPdf: 'PDF report downloaded.',
      reportDownloadedDocx: 'DOCX report downloaded.',
    },
    app: { reminderTitle: 'Reminder', close: 'Close' },
    auth: { loadingSession: 'Loading session...' },
    lesson: {
      titleFallback: 'Lesson',
      description: 'Lesson content, exercises, and course progress.',
      toCourse: 'To course',
      allCourses: 'All courses',
      myLearning: 'My learning',
      lockNonStudent: 'Lesson actions are available only to students enrolled in this course.',
      lockNotEnrolled: 'You are not enrolled in this course, so progress and exercise actions are unavailable.',
      enrollSection: 'Course enrollment',
      enrollHint: 'You need to enroll in this course to mark lessons and submit answers.',
      enroll: 'Enroll in course',
      openCourse: 'Open course card',
      theory: 'Lesson theory',
      noTheory: 'Theory for this lesson has not been added by the teacher yet.',
      courseProgress: 'Course progress',
      checkingEnrollment: 'Checking enrollment...',
      exercisesProgress: 'Exercise progress',
      exercisesProgressHint: 'The percentage grows when you solve exercises below.',
      currentProgress: 'Current course progress by exercises:',
      progressAuto: 'Progress is updated automatically from exercise results.',
      exercises: 'Exercises',
      exerciseHintNonStudent: 'Submitting answers and score tracking are available to enrolled students.',
      loadingAnswers: 'Loading your answers...',
      questionMissing: 'Question is not specified',
      yourAnswer: 'Your answer:',
      answerPlaceholder: 'Your answer',
      answerLabel: 'Answer',
      submit: 'Submit',
      accepted: 'Answer accepted.',
      correct: 'Correct',
      incorrect: 'Incorrect',
      points: 'points',
      outOf: 'out of',
      retryHint: 'Update your answer and submit again — the best result is counted.',
      nextLesson: 'Next lesson',
      resolvingSequence: 'Resolving lesson sequence...',
      nextPrefix: 'Next',
      nextButton: 'Next lesson',
      lastLesson: 'This is the last lesson.',
    },
    courseDetail: {
      titleFallback: 'Course',
      loadingDescription: 'Loading...',
      allCourses: 'All courses',
      home: 'Home',
      about: 'About course',
      loading: 'Loading course data...',
      notFound: 'Course not found.',
      ratingWord: 'rating',
      na: 'n/a',
      unenrolled: 'Course enrollment removed',
      enrolled: 'You are enrolled in this course',
      checkingEnrollment: 'Checking enrollment...',
      unenroll: 'Unenroll',
      enroll: 'Enroll',
      removedFromFavorites: 'Course removed from favorites',
      addedToFavorites: 'Course added to favorites',
      checkingFavorites: 'Checking favorites...',
      removeFavorite: 'Remove favorite',
      addFavorite: 'Add to favorites',
      reviews: 'Reviews',
      rateSection: 'Rate course',
      yourRating: 'Your rating',
      optionalComment: 'Comment (optional)',
      savePending: 'Saving...',
      saveRating: 'Save rating',
      rateAfterEnroll: 'You can rate this course after enrollment.',
      rateAfterProgress: 'You can rate this course after completing at least {percent}%.',
      lessons: 'Lessons',
      lessonProgress: 'Lesson progress',
      completed: 'Completed',
      inProgress: 'In progress',
      open: 'Open',
      savedRating: 'Course rating saved',
    },
    reminders: {
      pageTitle: 'Reminders',
      pageDescription: 'Schedule reminders for lessons and deadlines — they are saved in your account and visible only to you.',
      loadFailedFallback: 'Failed to load reminders. Please refresh the page.',
      titleRequired: 'Please enter reminder text.',
      dateRequired: 'Please choose reminder date and time.',
      futureDateRequired: 'Reminder time must be in the future.',
      editSaved: 'Done — changes are saved.',
      newSection: 'New reminder',
      yourSection: 'Your reminders',
      titlePlaceholder: 'Reminder text',
      titleAria: 'Reminder text',
      dateAria: 'Reminder time',
      add: 'Add',
      added: 'Reminder added.',
      empty: 'No reminders yet — add your first one above.',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      deleted: 'Reminder deleted.',
      delete: 'Delete',
    },
    myLearning: {
      pageTitle: 'My learning',
      pageDescription: 'Active enrollments and current progress.',
      catalog: 'Course catalog',
      home: 'Home',
      enrollments: 'Course enrollments',
      progress: 'Progress',
      certIssued: 'Certificate #',
      toCourse: 'To course',
      issuing: 'Issuing...',
      issueCertificate: 'Get certificate',
      downloadPdf: 'Download PDF',
      unenroll: 'Unenroll',
    },
    favorites: {
      pageTitle: 'Favorites',
      pageDescription: 'Saved courses and quick actions.',
      sectionTitle: 'Favorites list',
      open: 'Open',
      remove: 'Remove',
    },
    courseReviews: {
      pageTitle: 'Reviews',
      pageDescriptionFallback: 'Course reviews',
      toCourse: 'To course',
      allCourses: 'All courses',
      sectionTitle: 'Reviews',
      loading: 'Loading reviews...',
      empty: 'No reviews yet.',
      userFallback: 'User',
      rating: 'Rating',
      noComment: 'No comment',
      backToCourse: 'Back to course',
    },
    teacherManage: {
      pageTitle: 'Course editing',
      pageDescription: 'Edit course content, track students, and export reports.',
      backToCourses: 'Back to my courses',
      content: 'Lessons and exercises',
      studentsCsv: 'Students and CSV',
      reports: 'Reports and e-mail',
    },
    teacherContent: {
      courseTitle: 'Course title',
      language: 'Language',
      level: 'Level',
      courseDescription: 'Course description',
      savePending: 'Saving...',
      saveCourse: 'Save course',
      lessonTitle: 'Lesson title',
      lessonContentOptional: 'Lesson content (optional)',
      createPending: 'Creating...',
      addLesson: 'Add lesson',
      lesson: 'Lesson',
      deletePending: 'Deleting...',
      deleteLesson: 'Delete lesson',
      saveLesson: 'Save lesson',
      lessonContent: 'Lesson content',
      exerciseTitle: 'Title',
      points: 'Points',
      question: 'Question',
      correctAnswer: 'Correct answer',
      save: 'Save',
      delete: 'Delete',
      addExerciseTitle: 'Exercise title',
      addPoints: 'Points (maxScore)',
      addExercise: 'Add exercise to lesson',
      addPending: 'Adding...',
      markdownHint: 'Markdown supported: headings, lists, **bold**, *italic*, `code`, links.',
    },
    teacherStudents: {
      all: 'All',
      active: 'Active',
      inactive: 'Inactive',
      name: 'Name',
      progress: 'Progress',
      activity: 'Activity',
      downloadCsv: 'Download CSV',
    },
    teacherReports: {
      pdfSummary: 'PDF summary',
      docxSummary: 'DOCX summary',
      sendEmail: 'Send e-mail',
      noCourseId: 'Course identifier is missing.',
    },
    teacherNewCourse: {
      pageTitle: 'Course creation',
      pageDescription: 'Create a new course and configure its basic settings.',
      backToCourses: 'Back to my courses',
      formTitle: 'Course form',
      title: 'Title',
      description: 'Description',
      language: 'Language',
      level: 'Level',
      create: 'Create',
    },
    teacherCourses: {
      pageTitle: 'Teacher courses',
      pageDescription: 'Your courses and links to manage them.',
      home: 'Home',
      listTitle: 'Courses list',
      createCourse: 'Create course',
      lessons: 'lessons',
      students: 'students',
      rating: 'rating',
      reviews: 'reviews',
      notAvailable: 'n/a',
      openReviews: 'Reviews',
      manage: 'Manage',
      delete: 'Delete',
      deleting: 'Deleting...',
      deleted: 'Course deleted.',
      deleteConfirm: 'Delete course "{title}"?',
    },
    teacherAnalytics: {
      pageTitle: 'Teacher analytics',
      pageDescription: 'KPI and charts for student engagement and course progress.',
      backToCourses: 'Back to teacher courses',
      chooseCourse: 'Course',
      chooseCoursePlaceholder: 'Select course',
      period: 'Period',
      students: 'Students',
      avgProgress: 'Avg progress',
      active7d: 'Active in 7 days',
      activePeriod: 'Active in period',
      riskStudents: 'Risk students',
      riskDefinition: 'Progress < 40% or no activity in the selected period.',
      submissionsTrend: 'Submissions trend',
      activityTrend: 'Active students by day',
      submissionsSeries: 'Submissions',
      activeStudentsSeries: 'Active students',
      progressDistribution: 'Progress distribution',
      studentsProgress: 'Students progress',
      riskOnly: 'Risk only',
      allStudents: 'All students',
      noData: 'Not enough data to display.',
      viewManage: 'Open course management',
      exportPdf: 'PDF report',
      exportDocx: 'DOCX report',
      exportCsv: 'Students CSV',
      sendEmail: 'Send report by e-mail',
    },
  },
};
