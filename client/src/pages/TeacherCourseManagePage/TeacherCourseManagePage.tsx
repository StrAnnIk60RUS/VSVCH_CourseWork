import { useParams } from 'react-router-dom';
import { NavigationUp, PageShell, SectionCard } from '../../components/layout';
import { useI18n } from '../../hooks/useI18n';
import { CourseContentSection } from './CourseContentSection';
import { ReportsSection } from './ReportsSection';
import { StudentsSection } from './StudentsSection';
import { useTeacherCourseManage } from './useTeacherCourseManage';

export default function TeacherCourseManagePage() {
  const t = useI18n();
  const { courseId = '' } = useParams();
  const vm = useTeacherCourseManage(courseId);

  return (
    <PageShell
      title={`${t.teacherManage.pageTitle}: ${vm.course?.title ?? ''}`}
      description={t.teacherManage.pageDescription}
    >
      <div className="space-y-4">
        <NavigationUp links={[{ to: '/teacher/courses', label: t.teacherManage.backToCourses }]} />
        <SectionCard title={t.teacherManage.content}>
          <CourseContentSection
            courseForm={vm.courseForm}
            lessonTitle={vm.lessonTitle}
            lessonContent={vm.lessonContent}
            lessons={vm.course?.lessons ?? []}
            exerciseMap={vm.exerciseMap}
            lessonEdits={vm.lessonEdits}
            exerciseEdits={vm.exerciseEdits}
            exerciseForms={vm.exerciseForms}
            busyAction={vm.busyAction}
            setCourseForm={vm.setCourseForm}
            setLessonTitle={vm.setLessonTitle}
            setLessonContent={vm.setLessonContent}
            setLessonEdits={vm.setLessonEdits}
            setExerciseEdits={vm.setExerciseEdits}
            setExerciseForms={vm.setExerciseForms}
            onSaveCourse={vm.actions.updateCourse}
            onCreateLesson={vm.actions.createLesson}
            onDeleteLesson={vm.actions.deleteLesson}
            onSaveLesson={vm.actions.saveLesson}
            onCreateExercise={vm.actions.createExercise}
            onDeleteExercise={vm.actions.deleteExercise}
            onSaveExercise={vm.actions.saveExercise}
          />
        </SectionCard>

        <SectionCard title={t.teacherManage.studentsCsv}>
          <StudentsSection
            students={vm.students}
            statusFilter={vm.statusFilter}
            sort={vm.sort}
            setStatusFilter={vm.setStatusFilter}
            setSort={vm.setSort}
            onDownloadCsv={vm.actions.downloadStudentsCsv}
          />
        </SectionCard>

        <SectionCard title={t.teacherManage.reports}>
          <ReportsSection
            courseId={courseId}
            status={vm.status}
            onDownloadPdf={() => vm.actions.downloadCourseReport('pdf')}
            onDownloadDocx={() => vm.actions.downloadCourseReport('docx')}
            onSendEmail={vm.actions.sendCourseReportEmail}
          />
        </SectionCard>
      </div>
    </PageShell>
  );
}
