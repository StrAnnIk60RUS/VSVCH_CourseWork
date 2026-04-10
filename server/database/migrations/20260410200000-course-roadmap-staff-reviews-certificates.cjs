'use strict';

/**
 * Добавляет: course_staff, course_reviews, certificates, courses.rating_average;
 * переносит legacy courses.teacher_id в course_staff (роль TEACHER) и удаляет колонку.
 * Идемпотентно для БД, уже созданной новым init-schema.sql.
 */
module.exports = {
  async up(queryInterface) {
    const qi = queryInterface.sequelize;

    await qi.query(`
      DO $$ BEGIN
        CREATE TYPE "CourseStaffRole" AS ENUM ('TEACHER', 'AUTHOR', 'METHODIST', 'CURATOR');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await qi.query(`ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "rating_average" DECIMAL(4,3);`);

    await qi.query(`
      CREATE TABLE IF NOT EXISTS "course_staff" (
        "id" TEXT NOT NULL,
        "course_id" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "staff_role" "CourseStaffRole" NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "course_staff_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "course_staff_course_id_user_id_staff_role_key" UNIQUE ("course_id", "user_id", "staff_role")
      );
    `);

    await qi.query(`
      CREATE TABLE IF NOT EXISTS "course_reviews" (
        "id" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "course_id" TEXT NOT NULL,
        "rating" SMALLINT NOT NULL,
        "comment" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "course_reviews_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "course_reviews_rating_check" CHECK ("rating" >= 1 AND "rating" <= 5)
      );
    `);

    await qi.query(`
      CREATE TABLE IF NOT EXISTS "certificates" (
        "id" TEXT NOT NULL,
        "enrollment_id" TEXT NOT NULL,
        "document_number" TEXT NOT NULL,
        "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "certificates_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "certificates_enrollment_id_key" UNIQUE ("enrollment_id"),
        CONSTRAINT "certificates_document_number_key" UNIQUE ("document_number")
      );
    `);

    const [teacherCol] = await qi.query(`
      SELECT 1 AS "x" FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'teacher_id'
      LIMIT 1;
    `);

    if (teacherCol.length > 0) {
      await qi.query(`
        INSERT INTO "course_staff" ("id", "course_id", "user_id", "staff_role")
        SELECT gen_random_uuid()::text, c."id", c."teacher_id", 'TEACHER'::"CourseStaffRole"
        FROM "courses" c
        WHERE c."teacher_id" IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM "course_staff" cs
          WHERE cs."course_id" = c."id" AND cs."user_id" = c."teacher_id" AND cs."staff_role" = 'TEACHER'
        );
      `);
      await qi.query(`ALTER TABLE "courses" DROP CONSTRAINT IF EXISTS "courses_teacher_id_fkey";`);
      await qi.query(`ALTER TABLE "courses" DROP COLUMN "teacher_id";`);
    }

    const addFk = async (sql) => {
      try {
        await qi.query(sql);
      } catch (e) {
        const code = e?.original?.code ?? e?.parent?.code;
        if (code === '42710') return;
        throw e;
      }
    };

    await addFk(`
      ALTER TABLE "course_staff" ADD CONSTRAINT "course_staff_course_id_fkey"
      FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);
    await addFk(`
      ALTER TABLE "course_staff" ADD CONSTRAINT "course_staff_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);
    await addFk(`
      ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);
    await addFk(`
      ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_course_id_fkey"
      FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);
    await addFk(`
      ALTER TABLE "certificates" ADD CONSTRAINT "certificates_enrollment_id_fkey"
      FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);

    await qi.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "course_reviews_user_id_course_id_key"
      ON "course_reviews"("user_id", "course_id");
    `);
    await qi.query(`CREATE INDEX IF NOT EXISTS "course_staff_course_id_idx" ON "course_staff"("course_id");`);
    await qi.query(`CREATE INDEX IF NOT EXISTS "course_reviews_course_id_idx" ON "course_reviews"("course_id");`);
    await qi.query(`CREATE INDEX IF NOT EXISTS "courses_rating_average_idx" ON "courses"("rating_average");`);
  },

  async down() {
    throw new Error(
      'course-roadmap migration is not reversible; restore from backup or recreate the database.',
    );
  },
};
