import { useParams } from 'react-router-dom';
import { PageShell, SectionCard } from '../../components/layout';
import { CourseContentSection } from './CourseContentSection';
import { ReportsSection } from './ReportsSection';
import { StudentsSection } from './StudentsSection';
import { useTeacherCourseManage } from './useTeacherCourseManage';

export default function TeacherCourseManagePage() {
  const { courseId = '' } = useParams();
  const vm = useTeacherCourseManage(courseId);

  return (
    <PageShell title={`Управление: ${vm.course?.title ?? ''}`} description="CRUD контента, аналитика и отчеты преподавателя.">
      <div className="space-y-4">
        <SectionCard title="Уроки и упражнения">
          <CourseContentSection
            courseForm={vm.courseForm}
            lessonTitle={vm.lessonTitle}
            lessonContent={vm.lessonContent}
            lessons={vm.course?.lessons ?? []}
            exerciseMap={vm.exerciseMap}
            exerciseForms={vm.exerciseForms}
            busyAction={vm.busyAction}
            setCourseForm={vm.setCourseForm}
            setLessonTitle={vm.setLessonTitle}
            setLessonContent={vm.setLessonContent}
            setExerciseForms={vm.setExerciseForms}
            onSaveCourse={vm.actions.updateCourse}
            onCreateLesson={vm.actions.createLesson}
            onDeleteLesson={vm.actions.deleteLesson}
            onCreateExercise={vm.actions.createExercise}
            onDeleteExercise={vm.actions.deleteExercise}
          />
        </SectionCard>

        <SectionCard title="Студенты и CSV">
          <StudentsSection
            students={vm.students}
            statusFilter={vm.statusFilter}
            sort={vm.sort}
            setStatusFilter={vm.setStatusFilter}
            setSort={vm.setSort}
            onDownloadCsv={vm.actions.downloadStudentsCsv}
          />
        </SectionCard>

        <SectionCard title="Отчеты и e-mail">
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
