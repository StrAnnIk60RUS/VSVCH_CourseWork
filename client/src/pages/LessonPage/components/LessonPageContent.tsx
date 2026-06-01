import { useEffect, useMemo, useState } from 'react';

import { Link, useParams } from 'react-router-dom';

import {
  getCourseById,

  enrollToCourse,

  getApiError,

  getEnrollments,

  getLessonById,

  getLessonExercises,

  getSubmissions,

  submitExercise,

  type SubmissionListItem,

} from '../../../api';

import { MarkdownContent } from '../../../components/common';
import { NavigationUp, PageShell, SectionCard } from '../../../components/layout';
import { useAuthSession } from '../../../hooks/useAuthSession';
import { useI18n } from '../../../hooks/useI18n';



type ExerciseItem = {

  id: string;

  title: string;

  maxScore?: number;

  question?: string;

  payload?: { question?: string; maxScore?: number };

};

type LessonMeta = {

  id: string;

  title: string;

  content: string;

  order: number;

};

type CourseLessonNav = {
  id: string;
  title: string;
  order: number;
};



/** Лучшая отправка по упражнению (как в server/utils/progress.js). */

function mergeBestSubmissionsForLesson(

  items: SubmissionListItem[],

  lessonId: string,

  exerciseIds: Set<string>,

): { answers: Record<string, string>; results: Record<string, { correct: boolean; score: number }> } {

  const relevant = items.filter(

    (s) => s.exercise?.lessonId === lessonId && exerciseIds.has(s.exerciseId),

  );

  const bestByExercise = new Map<string, SubmissionListItem>();

  for (const s of relevant) {

    const existing = bestByExercise.get(s.exerciseId);

    if (!existing) {

      bestByExercise.set(s.exerciseId, s);

      continue;

    }

    const scoreDiff = Number(s.score) - Number(existing.score);

    if (scoreDiff > 0) {

      bestByExercise.set(s.exerciseId, s);

    } else if (scoreDiff === 0) {

      if (new Date(s.createdAt).getTime() > new Date(existing.createdAt).getTime()) {

        bestByExercise.set(s.exerciseId, s);

      }

    }

  }

  const answers: Record<string, string> = {};

  const results: Record<string, { correct: boolean; score: number }> = {};

  for (const [exId, row] of bestByExercise) {

    const payload = row.payload ?? {};

    answers[exId] = payload.answer != null ? String(payload.answer) : '';

    const correct =

      typeof payload.correct === 'boolean' ? payload.correct : Number(row.score) > 0;

    results[exId] = { correct, score: Number(row.score) || 0 };

  }

  return { answers, results };

}



function maxScoreForExercise(ex: ExerciseItem): number {

  const n = ex.maxScore ?? ex.payload?.maxScore;

  return typeof n === 'number' && Number.isFinite(n) ? n : 10;

}



export function LessonPageContent() {
  const t = useI18n();

  const { courseId = '', lessonId = '' } = useParams();

  const { user } = useAuthSession();

  const isStudent = Boolean(user?.roles.includes('STUDENT'));

  const [exercises, setExercises] = useState<ExerciseItem[]>([]);

  const [lessonMeta, setLessonMeta] = useState<LessonMeta | null>(null);
  const [courseLessons, setCourseLessons] = useState<CourseLessonNav[]>([]);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [progress, setProgress] = useState<number | null>(null);

  const [error, setError] = useState('');

  const [actionError, setActionError] = useState('');

  const [exerciseResults, setExerciseResults] = useState<Record<string, { correct: boolean; score: number }>>({});

  const [isEnrolledInCourse, setIsEnrolledInCourse] = useState<boolean | null>(null);

  const [enrollBusy, setEnrollBusy] = useState(false);

  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [courseLessonsLoading, setCourseLessonsLoading] = useState(false);



  const loadingEnrollment = isStudent && isEnrolledInCourse === null;

  const canActOnCourse = isStudent && isEnrolledInCourse === true;

  const interactionLockMessage = !isStudent

    ? t.lesson.lockNonStudent

    : isEnrolledInCourse === false

      ? t.lesson.lockNotEnrolled

      : '';



  const nextLesson = useMemo(() => {
    if (!lessonMeta || courseLessons.length === 0) return null;
    const sorted = [...courseLessons].sort((a, b) => a.order - b.order);
    const currentIdx = sorted.findIndex((lesson) => lesson.id === lessonMeta.id);
    if (currentIdx < 0 || currentIdx >= sorted.length - 1) return null;
    return sorted[currentIdx + 1];
  }, [courseLessons, lessonMeta]);



  useEffect(() => {

    setExercises([]);

    setLessonMeta(null);
    setCourseLessons([]);

    setAnswers({});

    setExerciseResults({});

  }, [courseId, lessonId]);



  useEffect(() => {

    getLessonExercises(courseId, lessonId)

      .then((res) => setExercises(res.items))

      .catch((err) => setError(getApiError(err)));

  }, [courseId, lessonId]);

  useEffect(() => {
    if (!courseId) {
      setCourseLessons([]);
      return;
    }
    let active = true;
    setCourseLessonsLoading(true);
    getCourseById(courseId)
      .then((res) => {
        if (!active) return;
        setCourseLessons(
          res.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.order,
          })),
        );
      })
      .catch(() => {
        if (!active) return;
        setCourseLessons([]);
      })
      .finally(() => {
        if (active) setCourseLessonsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [courseId]);



  useEffect(() => {

    getLessonById(courseId, lessonId)

      .then((res) => setLessonMeta(res))

      .catch((err) => setError(getApiError(err)));

  }, [courseId, lessonId]);



  useEffect(() => {

    if (!courseId) {

      setIsEnrolledInCourse(null);

      return;

    }

    let active = true;

    setIsEnrolledInCourse(null);

    getEnrollments()

      .then((res) => {

        if (!active) return;

        setIsEnrolledInCourse(res.items.some((i) => i.courseId === courseId));

      })

      .catch(() => {

        if (!active) return;

        setIsEnrolledInCourse(null);

      });

    return () => {

      active = false;

    };

  }, [courseId]);



  useEffect(() => {

    if (!courseId || !isStudent || !isEnrolledInCourse) return;

    let active = true;

    getEnrollments()

      .then((res) => {

        if (!active) return;

        const en = res.items.find((i) => i.courseId === courseId);

        if (en) setProgress(en.progress);

      })

      .catch(() => {});

    return () => {

      active = false;

    };

  }, [courseId, isStudent, isEnrolledInCourse]);



  useEffect(() => {

    if (!canActOnCourse || !lessonId || exercises.length === 0) {

      setSubmissionsLoading(false);

      return;

    }

    let active = true;

    setSubmissionsLoading(true);

    getSubmissions()

      .then((res) => {

        if (!active) return;

        const ids = new Set(exercises.map((e) => e.id));

        const merged = mergeBestSubmissionsForLesson(res.items, lessonId, ids);

        setAnswers(merged.answers);

        setExerciseResults(merged.results);

      })

      .catch(() => {

        if (!active) return;

      })

      .finally(() => {

        if (active) setSubmissionsLoading(false);

      });

    return () => {

      active = false;

    };

  }, [canActOnCourse, lessonId, exercises]);



  const upLinks = [

    { to: `/courses/${courseId}`, label: t.lesson.toCourse },

    { to: '/courses', label: t.lesson.allCourses },

    ...(isStudent ? ([{ to: '/me/learning', label: t.lesson.myLearning }] as const) : []),

  ];



  return (

    <PageShell

      title={lessonMeta?.title ?? t.lesson.titleFallback}
      description={t.lesson.description}

    >

      <div className="lesson-page__stack">

        <NavigationUp links={upLinks} />

        {error && <p className="text-sm text-ui-danger">{error}</p>}

        {actionError && <p className="text-sm text-ui-danger">{actionError}</p>}

        {interactionLockMessage && (

          <p className="ui-notice text-sm font-medium" role="status">

            {interactionLockMessage}

          </p>

        )}

        {isStudent && isEnrolledInCourse === false && (

          <SectionCard title={t.lesson.enrollSection}>

            <p className="text-sm text-ui-text">

              {t.lesson.enrollHint}

            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              <button

                type="button"

                disabled={enrollBusy}

                onClick={async () => {

                  setActionError('');

                  setEnrollBusy(true);

                  try {

                    await enrollToCourse(courseId);

                    setIsEnrolledInCourse(true);

                  } catch (err) {

                    setActionError(getApiError(err));

                  } finally {

                    setEnrollBusy(false);

                  }

                }}

                className="ui-btn-primary"

              >

                {t.lesson.enroll}

              </button>

              <Link

                to={`/courses/${courseId}`}

                className="ui-btn-secondary text-sm text-ui-link"

              >

                {t.lesson.openCourse}

              </Link>

            </div>

          </SectionCard>

        )}

        <SectionCard title={t.lesson.theory}>

          <div className="mt-2 rounded border border-ui-border bg-ui-subtle p-3">

            {lessonMeta?.content?.trim() ? (
              <MarkdownContent content={lessonMeta.content} />
            ) : (

              <p className="text-sm text-ui-muted">{t.lesson.noTheory}</p>

            )}

          </div>

        </SectionCard>

        <SectionCard title={t.lesson.courseProgress}>

          {loadingEnrollment && <p className="text-sm text-ui-muted">{t.lesson.checkingEnrollment}</p>}

          <div className="mt-2 space-y-4">

            <div>

              <p className="text-sm font-medium text-ui-text">{t.lesson.exercisesProgress}</p>

              <p className="mt-1 text-sm text-ui-muted">{t.lesson.exercisesProgressHint}</p>

              {progress !== null && (

                <p className="mt-2 text-sm text-ui-text">

                  {t.lesson.currentProgress} <span className="font-semibold">{progress}%</span>

                </p>

              )}

            </div>

            <div className="border-t border-ui-border pt-4">
              <p className="text-sm text-ui-muted">
                {t.lesson.progressAuto}
              </p>
            </div>

          </div>

        </SectionCard>

        <SectionCard title={t.lesson.exercises}>

          {!isStudent && (

            <p className="text-sm text-ui-text">

              {t.lesson.exerciseHintNonStudent}

            </p>

          )}

          {canActOnCourse && submissionsLoading && (

            <p className="mt-2 text-sm text-ui-muted" role="status">

              {t.lesson.loadingAnswers}

            </p>

          )}

          <div className="mt-2 space-y-3">

            {exercises.map((ex) => {

              const maxPts = maxScoreForExercise(ex);

              const result = exerciseResults[ex.id];

              const hasResult = result != null;

              const answeredCorrectly = hasResult && result.correct;

              const cardClass =

                hasResult && result.correct

                  ? 'border-l-4 border-l-emerald-600'

                  : hasResult && !result.correct

                    ? 'border-l-4 border-l-red-600'

                    : 'border-l-4 border-l-transparent';

              const answerPreview = (answers[ex.id] ?? '').trim();

              const showAnswerLine = answerPreview.length > 0 || hasResult;



              const questionText = ex.question ?? ex.payload?.question ?? '';

              return (

                <div

                  key={ex.id}

                  className={`ui-card-interactive rounded border border-ui-border bg-ui-surface p-3 ${cardClass}`}

                >

                  <p className="font-medium">{ex.title}</p>

                  {questionText.trim() ? (
                    <MarkdownContent content={questionText} className="text-ui-muted" />
                  ) : (
                    <p className="text-sm text-ui-muted">{t.lesson.questionMissing}</p>
                  )}

                  {showAnswerLine && (

                    <p className="mt-2 text-sm text-ui-text">

                      <span className="text-ui-muted">{t.lesson.yourAnswer}</span>{' '}

                      <span className="font-medium">{answers[ex.id] ?? '—'}</span>

                    </p>

                  )}

                  <div className="mt-2 flex gap-2">

                    <input

                      value={answers[ex.id] ?? ''}

                      onChange={(e) => setAnswers((x) => ({ ...x, [ex.id]: e.target.value }))}

                      disabled={!canActOnCourse || loadingEnrollment || answeredCorrectly}

                      className="ui-input w-full rounded px-3 py-2"

                      placeholder={t.lesson.answerPlaceholder}

                      aria-label={`${t.lesson.answerLabel}: ${ex.title}`}

                    />

                    <button

                      type="button"

                      disabled={

                        loadingEnrollment || !canActOnCourse || answeredCorrectly || submissionsLoading

                      }

                      onClick={async () => {

                        setActionError('');

                        try {

                          const res = await submitExercise(ex.id, answers[ex.id] ?? '');

                          setExerciseResults((prev) => ({

                            ...prev,

                            [ex.id]: { correct: res.correct, score: res.score },

                          }));

                          setProgress(res.progress);

                        } catch (err) {

                          setActionError(getApiError(err));

                        }

                      }}

                      className="ui-btn-secondary shrink-0"

                    >

                      {t.lesson.submit}

                    </button>

                  </div>

                  {answeredCorrectly && (

                    <p className="mt-2 text-sm font-medium text-ui-success" role="status">

                      {t.lesson.accepted}

                    </p>

                  )}

                  {hasResult && (

                    <p

                      className={`mt-2 text-sm ${result.correct ? 'text-ui-success' : 'text-ui-danger'}`}

                      role="status"

                    >

                      {result.correct ? t.lesson.correct : t.lesson.incorrect} - {t.lesson.points}: {result.score} {t.lesson.outOf} {maxPts}

                    </p>

                  )}

                  {hasResult && !result.correct && (

                    <p className="mt-1 text-sm text-ui-muted">

                      {t.lesson.retryHint}

                    </p>

                  )}

                </div>

              );

            })}

          </div>

        </SectionCard>

        <SectionCard title={t.lesson.nextLesson}>
          {courseLessonsLoading ? (
            <p className="text-sm text-ui-muted">{t.lesson.resolvingSequence}</p>
          ) : nextLesson ? (
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-sm text-ui-text">
                {t.lesson.nextPrefix}: {nextLesson.order}. {nextLesson.title}
              </p>
              <Link
                to={`/courses/${courseId}/lessons/${nextLesson.id}`}
                className="ui-btn-primary inline-flex items-center"
              >
                {t.lesson.nextButton}
              </Link>
            </div>
          ) : (
            <p className="text-sm text-ui-muted">{t.lesson.lastLesson}</p>
          )}
        </SectionCard>

      </div>

    </PageShell>

  );

}

