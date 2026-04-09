export default function CourseDetailPage() {
  return (
    <>
      <header>
        <h1>Course Detail</h1>
        <p>Detailed view of a single course and lesson roadmap.</p>
      </header>
      <main>
        <nav>
          <h2>Course Navigation</h2>
          <p>Anchors for overview, lessons and related actions.</p>
        </nav>
        <section>
          <h2>Course Summary</h2>
          <p>Description, instructor and metadata.</p>
        </section>
        <section>
          <h2>Lessons</h2>
          <p>Ordered list of lessons and navigation points.</p>
        </section>
        <section>
          <h2>Actions</h2>
          <p>Enrollment, favorite and management entry area.</p>
        </section>
        <aside>
          <h2>Progress Preview</h2>
          <p>Course completion and engagement status placeholder.</p>
        </aside>
        <footer>
          <h2>Related Links</h2>
          <p>Navigation to lesson start and course neighbors.</p>
        </footer>
      </main>
    </>
  );
}
