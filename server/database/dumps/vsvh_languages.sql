--
-- PostgreSQL database dump
--

\restrict 6ocCKcGsgYcziJkOswbWseeZWBcnOLS9zHTcinMy3bFFbBcv5kdX9OUEyum8bEz

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-01 11:04:57

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 30 (class 2615 OID 33674)
-- Name: SDGSD; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "SDGSD";


ALTER SCHEMA "SDGSD" OWNER TO postgres;

--
-- TOC entry 902 (class 1247 OID 32848)
-- Name: CourseStaffRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CourseStaffRole" AS ENUM (
    'TEACHER',
    'AUTHOR',
    'METHODIST',
    'CURATOR'
);


ALTER TYPE public."CourseStaffRole" OWNER TO postgres;

--
-- TOC entry 899 (class 1247 OID 32840)
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'STUDENT',
    'TEACHER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 250 (class 1259 OID 32833)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 32975)
-- Name: certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificates (
    id text NOT NULL,
    enrollment_id text NOT NULL,
    document_number text NOT NULL,
    issued_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.certificates OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 32918)
-- Name: course_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_reviews (
    id text NOT NULL,
    user_id text NOT NULL,
    course_id text NOT NULL,
    rating smallint NOT NULL,
    comment text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT course_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.course_reviews OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 32903)
-- Name: course_staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_staff (
    id text NOT NULL,
    course_id text NOT NULL,
    user_id text NOT NULL,
    staff_role public."CourseStaffRole" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.course_staff OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 32886)
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    language text NOT NULL,
    level text NOT NULL,
    published boolean DEFAULT false NOT NULL,
    rating_average numeric(4,3),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 32960)
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    id text NOT NULL,
    user_id text NOT NULL,
    course_id text NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    CONSTRAINT enrollments_progress_range_check CHECK (((progress >= 0) AND (progress <= 100)))
);


ALTER TABLE public.enrollments OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 32947)
-- Name: exercises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercises (
    id text NOT NULL,
    lesson_id text NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    payload jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE public.exercises OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 33017)
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id text NOT NULL,
    user_id text NOT NULL,
    course_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 32934)
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    id text NOT NULL,
    course_id text NOT NULL,
    title text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    content text NOT NULL,
    CONSTRAINT lessons_sort_order_non_negative_check CHECK ((sort_order >= 0))
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 33029)
-- Name: reminders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reminders (
    id text NOT NULL,
    user_id text NOT NULL,
    course_id text,
    title text NOT NULL,
    remind_at timestamp(3) with time zone NOT NULL,
    created_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    delivered_at timestamp(3) with time zone,
    email_sent_at timestamp(3) with time zone,
    acknowledged_at timestamp(3) with time zone
);


ALTER TABLE public.reminders OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 32857)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    code public."Role" NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 33003)
-- Name: submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.submissions (
    id text NOT NULL,
    user_id text NOT NULL,
    exercise_id text NOT NULL,
    score integer,
    payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT submissions_score_non_negative_check CHECK (((score IS NULL) OR (score >= 0)))
);


ALTER TABLE public.submissions OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 32877)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id text NOT NULL,
    role_code public."Role" NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 32863)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    name text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 5072 (class 0 OID 32833)
-- Dependencies: 250
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20260410150000-initial-schema.cjs
20260423110000-add-performance-indexes-and-checks.cjs
20260501115000-add-reminder-delivery-status.cjs
20260507210000-reminders-timestamptz.cjs
20260507223000-drop-lesson-completions.cjs
\.


--
-- TOC entry 5082 (class 0 OID 32975)
-- Dependencies: 260
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificates (id, enrollment_id, document_number, issued_at) FROM stdin;
7f24b620-8fae-4afc-943e-cb74900b37c0	0916a25d-ba85-47f8-87ec-8ea6f12962ad	VSVH-2026-C9C439A3	2026-05-07 19:23:51.002
seed-bulk-certificate-1	45e90e26-e133-470b-98fc-f5fb722829f0	VSVH-SEED-2026-0001	2026-05-27 15:12:03.553
seed-bulk-certificate-2	17b3041b-7989-40fc-a489-8ef2b9b4bfd3	VSVH-SEED-2026-0002	2026-05-27 15:12:03.556
seed-bulk-certificate-3	230a17f7-6c8d-40d9-a77a-ab9648171754	VSVH-SEED-2026-0003	2026-05-27 15:12:03.557
seed-bulk-certificate-4	d392a12b-42e8-4cba-a914-5060118f1535	VSVH-SEED-2026-0004	2026-05-27 15:12:03.559
seed-bulk-certificate-5	52d22f69-39a9-4ee6-a25b-3fa5f40a861f	VSVH-SEED-2026-0005	2026-05-27 15:12:03.56
seed-bulk-certificate-6	58f1e534-cca6-47cc-8a64-4c46e2d4bc44	VSVH-SEED-2026-0006	2026-05-27 15:12:03.561
seed-cert-cohort-1-a1	e52769b8-192b-4b12-bfae-371d27645c79	VSVH-2026-COHORT-1-A1	2026-05-28 09:00:00
seed-cert-cohort-1-b1	e2e1d7c3-2de1-4080-a126-a99b2b00b712	VSVH-2026-COHORT-1-B1	2026-05-28 09:00:00
seed-cert-cohort-2-a1	11a516bb-cd3c-4c1d-9661-feb5896fb074	VSVH-2026-COHORT-2-A1	2026-05-28 09:00:00
seed-cert-cohort-2-b1	37b552c6-38de-4a2e-aee0-93c98f767164	VSVH-2026-COHORT-2-B1	2026-05-28 09:00:00
\.


--
-- TOC entry 5078 (class 0 OID 32918)
-- Dependencies: 256
-- Data for Name: course_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_reviews (id, user_id, course_id, rating, comment, created_at, updated_at) FROM stdin;
0e12590b-de11-4e9c-b8ad-0bdf50b1f18f	e1ad91ad-7a95-4176-8659-d246165ecdb4	seed-course-intro	5	Seed review for catalog minRating checks.	2026-04-12 18:40:19.874	2026-04-12 18:40:19.874
b75aad6b-27a3-4706-9464-db6816b796fb	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-a1	5	Очень понятно для старта, особенно урок про приветствия.	2026-04-24 22:26:25.27	2026-04-24 22:26:25.27
94fe1eca-e3c6-4e3f-8ca8-f26b95808d6c	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-b1	4	Полезно для созвонов; хотелось бы больше примеров писем.	2026-04-24 22:26:25.272	2026-04-24 22:26:25.272
030c4d6f-75dc-4ed5-a5e6-075b9152b691	371f8e8a-69df-4ec8-aac4-2a2eceb23dfb	seed-bulk-course-2	5	Полезный модуль 2: задания проверяются быстро, ответы в упражнениях понятны преподавателю.	2026-05-27 15:12:03.424	2026-05-27 15:12:03.424
c6e4e853-d995-4576-bb30-94585225cf49	ec47cc44-6274-4d50-a9c1-6c9bf339eafb	seed-bulk-course-3	4	Полезный модуль 3: задания проверяются быстро, ответы в упражнениях понятны преподавателю.	2026-05-27 15:12:03.427	2026-05-27 15:12:03.427
61972ec3-43f6-4490-8f47-559af27001f1	fa576b75-3be7-456e-8c13-92560a68c42f	seed-bulk-course-4	5	Полезный модуль 4: задания проверяются быстро, ответы в упражнениях понятны преподавателю.	2026-05-27 15:12:03.431	2026-05-27 15:12:03.431
93e5eb35-84ff-4d42-a262-043ea2e5cc11	a4ed5ec9-d376-41a2-8afb-fe53e494500e	seed-bulk-course-5	4	Полезный модуль 5: задания проверяются быстро, ответы в упражнениях понятны преподавателю.	2026-05-27 15:12:03.434	2026-05-27 15:12:03.434
28f82faf-5fd2-4336-8678-f901188741f9	3b180a56-18e5-4a7e-913f-1dfa2ea1557b	seed-bulk-course-6	5	Полезный модуль 6: задания проверяются быстро, ответы в упражнениях понятны преподавателю.	2026-05-27 15:12:03.437	2026-05-27 15:12:03.437
df55a124-096a-4c69-bd6d-8920bb7deb36	937659aa-d221-4720-b41c-c410cbad03fe	seed-bulk-course-7	4	Полезный модуль 7: задания проверяются быстро, ответы в упражнениях понятны преподавателю.	2026-05-27 15:12:03.441	2026-05-27 15:12:03.441
3ea973a3-909a-4a0e-83e5-28689741e3b6	200d4cc2-567b-478a-aadd-1a1b6c6a3de2	seed-bulk-course-8	5	Полезный модуль 8: задания проверяются быстро, ответы в упражнениях понятны преподавателю.	2026-05-27 15:12:03.443	2026-05-27 15:12:03.443
6a9a9293-fcf9-407c-a1af-0d76ed6edad4	d7811cc8-33e3-4334-873e-cc79c799253f	seed-bulk-course-9	4	Полезный модуль 9: задания проверяются быстро, ответы в упражнениях понятны преподавателю.	2026-05-27 15:12:03.445	2026-05-27 15:12:03.445
f7975f9a-485e-440b-9894-5b8ae20caf15	c396b5e6-3de5-4f8f-8102-213b5bba6f77	seed-bulk-course-10	5	Полезный модуль 10: задания проверяются быстро, ответы в упражнениях понятны преподавателю.	2026-05-27 15:12:03.45	2026-05-27 15:12:03.45
fffcf8c9-3e64-4531-a4f2-0411ae5852f0	e121b451-ca46-4505-b500-88929d5f2b02	seed-bulk-course-11	4	Полезный модуль 11: задания проверяются быстро, ответы в упражнениях понятны преподавателю.	2026-05-27 15:12:03.452	2026-05-27 15:12:03.452
19462459-2fe8-4d64-9326-90740ba92b75	371f8e8a-69df-4ec8-aac4-2a2eceb23dfb	seed-bulk-course-12	5	Полезный модуль 12: задания проверяются быстро, ответы в упражнениях понятны преподавателю.	2026-05-27 15:12:03.455	2026-05-27 15:12:03.455
bad538af-4867-488c-9c2a-ba99d9d0205a	e121b451-ca46-4505-b500-88929d5f2b02	seed-bulk-course-1	4	Полезный модуль 1: задания проверяются быстро, ответы в упражнениях понятны преподавателю.	2026-05-27 15:12:03.419	2026-05-27 15:12:03.419
\.


--
-- TOC entry 5077 (class 0 OID 32903)
-- Dependencies: 255
-- Data for Name: course_staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_staff (id, course_id, user_id, staff_role, created_at) FROM stdin;
0bf71c91-468e-4b49-8225-3474096e1d08	seed-course-intro	5710ecb0-6b4b-415f-aae6-325ef368540a	TEACHER	2026-04-12 18:22:24.272
d59b608f-a4ef-4336-be39-98c20a6a9ad8	seed-course-en-a1	75acde4b-8101-47c6-af43-c31c6f973d7c	TEACHER	2026-04-24 22:26:25.23
6f19f2ac-8976-4dbf-96e6-f2cfccfb5ec0	seed-course-en-b1	75acde4b-8101-47c6-af43-c31c6f973d7c	TEACHER	2026-04-24 22:26:25.232
28ee96d9-33b4-4d32-9026-ad82898256b8	seed-course-fr-draft	75acde4b-8101-47c6-af43-c31c6f973d7c	TEACHER	2026-04-24 22:26:25.235
46d8c3e4-0f21-474d-921b-e228ef252a35	seed-course-en-a1	75acde4b-8101-47c6-af43-c31c6f973d7c	AUTHOR	2026-04-24 22:26:25.237
05eff7bf-6e78-4e3e-9818-2df519a6da1b	seed-bulk-course-1	adfe57e9-9c30-4100-b406-6a4347f216bb	TEACHER	2026-05-27 15:12:03.002
a91c02d8-bd18-4049-8800-816538b7ddf1	seed-bulk-course-2	adfe57e9-9c30-4100-b406-6a4347f216bb	TEACHER	2026-05-27 15:12:03.006
3671fc2f-f4b4-45d4-ba1d-fca8eb4663ea	seed-bulk-course-3	adfe57e9-9c30-4100-b406-6a4347f216bb	TEACHER	2026-05-27 15:12:03.009
51c753ec-f750-4900-b39f-e32cb4f9d60b	seed-bulk-course-4	adfe57e9-9c30-4100-b406-6a4347f216bb	TEACHER	2026-05-27 15:12:03.013
51fc0c1a-b41f-4934-83b3-c2ad657402b8	seed-bulk-course-5	adfe57e9-9c30-4100-b406-6a4347f216bb	TEACHER	2026-05-27 15:12:03.016
46fe8e25-4c70-4e9d-9617-84307f9bcb5e	seed-bulk-course-6	adfe57e9-9c30-4100-b406-6a4347f216bb	TEACHER	2026-05-27 15:12:03.018
9c40a29c-d670-4919-8057-13ab0c2b0f84	seed-bulk-course-7	adfe57e9-9c30-4100-b406-6a4347f216bb	TEACHER	2026-05-27 15:12:03.021
47150a28-57ec-4372-8fec-b85ffa2093b5	seed-bulk-course-8	adfe57e9-9c30-4100-b406-6a4347f216bb	TEACHER	2026-05-27 15:12:03.024
e53f6444-546d-4294-b4eb-c7fb3fc82909	seed-bulk-course-9	adfe57e9-9c30-4100-b406-6a4347f216bb	TEACHER	2026-05-27 15:12:03.026
8ab0240e-dcef-4547-a9cb-f0b1c38f1d8b	seed-bulk-course-10	adfe57e9-9c30-4100-b406-6a4347f216bb	TEACHER	2026-05-27 15:12:03.03
5b51f200-a469-42f5-90b1-9c9b8b76f0c2	seed-bulk-course-11	adfe57e9-9c30-4100-b406-6a4347f216bb	TEACHER	2026-05-27 15:12:03.033
39cba2e1-b1cb-42e4-8d3b-55bd1aa02238	seed-bulk-course-12	adfe57e9-9c30-4100-b406-6a4347f216bb	TEACHER	2026-05-27 15:12:03.035
33a0b35f-543e-4802-a2e3-00366058b2b4	3341e1a0-a27b-4b51-8ff5-243a315a2253	bd84e05c-985f-4fc8-9912-290091f2ceb7	TEACHER	2026-05-27 15:15:34.354
14ffe6f1-3927-413f-9e6c-1966546b510c	368ac38c-0f9c-4249-b3fc-1d615c831b07	7305fce2-09bc-4c08-bacb-0ae967a5e301	TEACHER	2026-05-27 15:17:35.695
3111a349-395c-4fae-9f42-05273ba5542c	d69f6c6d-a56e-4b37-a84b-474094d8e13a	63b2c40b-65a6-45a0-8c35-6cb551cd52fb	TEACHER	2026-05-27 15:38:59.363
\.


--
-- TOC entry 5076 (class 0 OID 32886)
-- Dependencies: 254
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, title, description, language, level, published, rating_average, created_at, updated_at) FROM stdin;
seed-course-intro	Introduction	Seed course for local development.	en	A1	t	5.000	2026-04-12 18:22:24.268	2026-04-12 18:40:19.882
seed-course-fr-draft	Français: phonétique (черновик)	Будущий курс по произношению и связке букв; пока скрыт из каталога для демонстрации неопубликованных курсов.	fr	A2	f	\N	2026-04-24 22:26:25.225	2026-04-24 22:26:25.225
368ac38c-0f9c-4249-b3fc-1d615c831b07	Integration Course	Created by integration test.	en	A1	f	\N	2026-05-27 15:17:35.692	2026-05-27 15:17:35.692
seed-bulk-course-4	Практикум по английскому: переговорам с клиентом (модуль 4)	Демо-курс для проверки функционала преподавателя: понятная теория, практические задания и прозрачные правильные ответы. Уровень: A2, язык: en.	en	A2	t	5.000	2026-05-27 15:12:03.011	2026-05-31 14:17:35.747
seed-bulk-course-5	Практикум по испанскому: управлению задачами (модуль 5)	Демо-курс для проверки функционала преподавателя: понятная теория, практические задания и прозрачные правильные ответы. Уровень: B1, язык: es.	es	B1	t	4.000	2026-05-27 15:12:03.014	2026-05-31 14:17:35.749
seed-bulk-course-6	Практикум по немецкому: обратной связи в команде (модуль 6)	Демо-курс для проверки функционала преподавателя: понятная теория, практические задания и прозрачные правильные ответы. Уровень: A2, язык: de.	de	A2	t	5.000	2026-05-27 15:12:03.017	2026-05-31 14:17:35.75
seed-bulk-course-8	Практикум по английскому: рабочим созвонам (модуль 8)	Демо-курс для проверки функционала преподавателя: понятная теория, практические задания и прозрачные правильные ответы. Уровень: A2, язык: en.	en	A2	t	5.000	2026-05-27 15:12:03.022	2026-05-31 14:17:35.755
seed-bulk-course-9	Практикум по немецкому: презентациям и питчам (модуль 9)	Демо-курс для проверки функционала преподавателя: понятная теория, практические задания и прозрачные правильные ответы. Уровень: B1, язык: de.	de	B1	t	4.000	2026-05-27 15:12:03.025	2026-05-31 14:17:35.757
seed-bulk-course-10	Практикум по испанскому: переговорам с клиентом (модуль 10)	Демо-курс для проверки функционала преподавателя: понятная теория, практические задания и прозрачные правильные ответы. Уровень: A2, язык: es.	es	A2	t	5.000	2026-05-27 15:12:03.028	2026-05-31 14:17:35.758
seed-bulk-course-11	Практикум по английскому: управлению задачами (модуль 11)	Демо-курс для проверки функционала преподавателя: понятная теория, практические задания и прозрачные правильные ответы. Уровень: B1, язык: en.	en	B1	t	4.000	2026-05-27 15:12:03.031	2026-05-31 14:17:35.759
seed-bulk-course-12	Практикум по немецкому: обратной связи в команде (модуль 12)	Демо-курс для проверки функционала преподавателя: понятная теория, практические задания и прозрачные правильные ответы. Уровень: A2, язык: de.	de	A2	t	5.000	2026-05-27 15:12:03.034	2026-05-31 14:17:35.762
seed-bulk-course-1	Практикум по английскому: деловой переписке (модуль 1)	Демо-курс для проверки функционала преподавателя: понятная теория, практические задания и прозрачные правильные ответы. Уровень: B1, язык: en.	en	B1	t	4.000	2026-05-27 15:12:03.001	2026-05-31 14:17:35.74
seed-bulk-course-2	Практикум по английскому: рабочим созвонам (модуль 2)	Демо-курс для проверки функционала преподавателя: понятная теория, практические задания и прозрачные правильные ответы. Уровень: A2, язык: en.	en	A2	t	5.000	2026-05-27 15:12:03.005	2026-05-31 14:17:35.742
seed-bulk-course-3	Практикум по немецкому: презентациям и питчам (модуль 3)	Демо-курс для проверки функционала преподавателя: понятная теория, практические задания и прозрачные правильные ответы. Уровень: B1, язык: de.	de	B1	t	4.000	2026-05-27 15:12:03.008	2026-05-31 14:17:35.744
seed-bulk-course-7	Практикум по английскому: деловой переписке (модуль 7)	Демо-курс для проверки функционала преподавателя: понятная теория, практические задания и прозрачные правильные ответы. Уровень: B1, язык: en.	en	B1	t	4.000	2026-05-27 15:12:03.019	2026-05-31 14:17:35.753
3341e1a0-a27b-4b51-8ff5-243a315a2253	Integration Course	Created by integration test.	en	A1	f	\N	2026-05-27 15:15:34.343	2026-05-27 15:15:34.343
d69f6c6d-a56e-4b37-a84b-474094d8e13a	Integration Course	Created by integration test.	en	A1	f	\N	2026-05-27 15:38:59.359	2026-05-27 15:38:59.359
seed-course-en-a1	Английский с нуля: алфавит, цифры и приветствия	Практический мини-курс для тех, кто только начинает. Вы освоите произношение базовых букв, научитесь представляться и задавать простые вопросы. Каждый урок сопровождается короткими упражнениями на закрепление.	en	A1	t	5.000	2026-04-24 22:26:25.22	2026-05-31 14:17:35.513
seed-course-en-b1	Business English: встречи и переговоры	Разбор типовых сценариев: созвон с коллегами, повестка дня, вежливые формулы согласия и несогласия, фиксация договорённостей. Материалы ориентированы на работу в международных командах.	en	B1	t	4.000	2026-04-24 22:26:25.223	2026-05-31 14:17:35.517
\.


--
-- TOC entry 5081 (class 0 OID 32960)
-- Dependencies: 259
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (id, user_id, course_id, progress, created_at, updated_at) FROM stdin;
55aff4c9-57a2-436a-a980-351232e693e3	e1ad91ad-7a95-4176-8659-d246165ecdb4	seed-course-intro	0	2026-04-12 18:22:24.282	2026-04-12 18:22:24.282
0916a25d-ba85-47f8-87ec-8ea6f12962ad	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-a1	100	2026-04-24 22:26:25.264	2026-05-31 14:17:35.784
4967a64b-2fb2-4a73-a8e6-074345704b6f	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-b1	0	2026-04-24 22:26:25.266	2026-05-31 14:17:35.788
17b3041b-7989-40fc-a489-8ef2b9b4bfd3	371f8e8a-69df-4ec8-aac4-2a2eceb23dfb	seed-bulk-course-2	0	2026-05-27 15:12:03.287	2026-05-31 14:17:35.821
faf5a745-8aed-41dd-a17d-b738b9f7918a	371f8e8a-69df-4ec8-aac4-2a2eceb23dfb	seed-bulk-course-5	0	2026-05-27 15:12:03.291	2026-05-31 14:17:35.824
d4620341-90f2-4324-a76c-7b6a7dc24ae4	ec47cc44-6274-4d50-a9c1-6c9bf339eafb	seed-bulk-course-6	0	2026-05-27 15:12:03.3	2026-05-31 14:17:35.826
230a17f7-6c8d-40d9-a77a-ab9648171754	ec47cc44-6274-4d50-a9c1-6c9bf339eafb	seed-bulk-course-3	0	2026-05-27 15:12:03.298	2026-05-31 14:17:35.829
3856e849-6462-4b4f-beba-e826d43e3096	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-course-en-a1	75	2026-04-24 22:27:15.583	2026-04-24 22:36:41.012
f8becd74-f5f3-4a8a-a510-821a5a0f8f53	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-course-en-b1	0	2026-04-24 22:38:05.979	2026-04-24 22:38:05.979
d392a12b-42e8-4cba-a914-5060118f1535	fa576b75-3be7-456e-8c13-92560a68c42f	seed-bulk-course-4	0	2026-05-27 15:12:03.307	2026-05-31 14:17:35.832
e52769b8-192b-4b12-bfae-371d27645c79	seed-cohort-student-1	seed-course-en-a1	100	2026-05-01 11:38:50.396	2026-05-31 14:17:35.79
3ac1c85a-b53e-4e0b-ae05-828d0a2f8100	fa576b75-3be7-456e-8c13-92560a68c42f	seed-bulk-course-7	0	2026-05-27 15:12:03.309	2026-05-31 14:17:35.834
52d22f69-39a9-4ee6-a25b-3fa5f40a861f	a4ed5ec9-d376-41a2-8afb-fe53e494500e	seed-bulk-course-5	0	2026-05-27 15:12:03.317	2026-05-31 14:17:35.837
e2e1d7c3-2de1-4080-a126-a99b2b00b712	seed-cohort-student-1	seed-course-en-b1	100	2026-05-01 11:38:50.418	2026-05-31 14:17:35.793
11a516bb-cd3c-4c1d-9661-feb5896fb074	seed-cohort-student-2	seed-course-en-a1	100	2026-05-01 11:38:50.426	2026-05-31 14:17:35.795
37b552c6-38de-4a2e-aee0-93c98f767164	seed-cohort-student-2	seed-course-en-b1	100	2026-05-01 11:38:50.444	2026-05-31 14:17:35.798
d7ed502f-18d0-4986-9bed-1c35d9cbba88	seed-cohort-student-3	seed-course-en-a1	75	2026-05-01 11:38:50.451	2026-05-31 14:17:35.8
0637763b-94b8-4b15-ad19-af51a1deda39	seed-cohort-student-3	seed-course-en-b1	50	2026-05-01 11:38:50.468	2026-05-31 14:17:35.803
99cd66ac-cfec-4d39-ba21-7b705b7af805	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-intro	0	2026-05-07 19:18:30.356	2026-05-07 19:18:41.39
85db61eb-63f9-4a38-8bc8-0c7db27dff0c	seed-cohort-student-4	seed-course-en-a1	50	2026-05-01 11:38:50.472	2026-05-31 14:17:35.806
9fd01845-eff7-4b5e-ad40-4ed4c3d42e90	200d4cc2-567b-478a-aadd-1a1b6c6a3de2	seed-bulk-course-11	0	2026-05-27 15:12:03.343	2026-05-31 14:17:35.854
03c9bbad-132e-480b-a66e-8f82c339915b	a4ed5ec9-d376-41a2-8afb-fe53e494500e	seed-bulk-course-8	0	2026-05-27 15:12:03.319	2026-05-31 14:17:35.839
909df887-ecb0-4a6b-b20e-54c9701195bc	d7811cc8-33e3-4334-873e-cc79c799253f	seed-bulk-course-12	0	2026-05-27 15:12:03.351	2026-05-31 14:17:35.857
026bf7b7-d5bc-437e-8d60-56c8f54e6bf7	d7811cc8-33e3-4334-873e-cc79c799253f	seed-bulk-course-9	0	2026-05-27 15:12:03.349	2026-05-31 14:17:35.859
58f1e534-cca6-47cc-8a64-4c46e2d4bc44	3b180a56-18e5-4a7e-913f-1dfa2ea1557b	seed-bulk-course-6	0	2026-05-27 15:12:03.326	2026-05-31 14:17:35.841
52504aa7-e476-49a0-8471-a897fdf56bc9	seed-cohort-student-4	seed-course-en-b1	25	2026-05-01 11:38:50.485	2026-05-31 14:17:35.808
1e25fbbe-7deb-4b62-bb53-7f643f3bcc06	c396b5e6-3de5-4f8f-8102-213b5bba6f77	seed-bulk-course-10	0	2026-05-27 15:12:03.357	2026-05-31 14:17:35.863
d60443d7-39a8-43f6-8568-72c648e6770d	3b180a56-18e5-4a7e-913f-1dfa2ea1557b	seed-bulk-course-9	0	2026-05-27 15:12:03.327	2026-05-31 14:17:35.843
51673e64-54aa-48b0-a9bf-6bbca24d69e7	937659aa-d221-4720-b41c-c410cbad03fe	seed-bulk-course-7	0	2026-05-27 15:12:03.334	2026-05-31 14:17:35.847
44862884-2945-4921-b509-34bdecec05e8	937659aa-d221-4720-b41c-c410cbad03fe	seed-bulk-course-10	0	2026-05-27 15:12:03.336	2026-05-31 14:17:35.849
89f3b273-1244-496f-aa42-51a033811980	seed-cohort-student-5	seed-course-en-a1	25	2026-05-01 11:38:50.488	2026-05-31 14:17:35.81
88e24671-5fb5-465b-8c99-e5aa66a6c72f	seed-cohort-student-6	seed-course-en-a1	0	2026-05-01 11:38:50.495	2026-05-31 14:17:35.813
3cf5f70e-e2ae-48c0-a72f-33e3b98e443c	e121b451-ca46-4505-b500-88929d5f2b02	seed-bulk-course-4	0	2026-05-27 15:12:03.28	2026-05-31 14:17:35.816
aba161a3-25a7-45b2-82da-8c7b35f12db7	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-12	0	2026-05-27 15:19:06.536	2026-05-27 15:19:06.536
03990f13-7b15-47db-85ae-611aa6c57a05	c396b5e6-3de5-4f8f-8102-213b5bba6f77	seed-bulk-course-1	0	2026-05-27 15:12:03.359	2026-05-31 14:17:35.865
998eff7d-331f-48b5-bfca-ae764f25dfbf	200d4cc2-567b-478a-aadd-1a1b6c6a3de2	seed-bulk-course-8	0	2026-05-27 15:12:03.342	2026-05-31 14:17:35.851
45e90e26-e133-470b-98fc-f5fb722829f0	e121b451-ca46-4505-b500-88929d5f2b02	seed-bulk-course-1	50	2026-05-27 15:12:03.277	2026-05-31 14:17:35.818
\.


--
-- TOC entry 5080 (class 0 OID 32947)
-- Dependencies: 258
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercises (id, lesson_id, title, type, payload) FROM stdin;
seed-exercise-1	seed-lesson-1	Warm-up	mcq	{"answer": "a", "options": ["a", "b"]}
seed-en-a1-l2-ex1	seed-en-a1-l2	Нейтральное приветствие	text	{"maxScore": 10, "question": "Как одним словом поздороваться нейтрально-формально днём (не good morning)?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: hello", "correctAnswer": "hello"}
seed-en-a1-l2-ex2	seed-en-a1-l2	Первая встреча	text	{"maxScore": 10, "question": "Закончите фразу: Nice to meet you, ___. (одно слово, ответ на поздравление)\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: too", "correctAnswer": "too"}
seed-en-a1-l3-ex1	seed-en-a1-l3	Число twelve	text	{"maxScore": 10, "question": "Напишите цифрой число, которое на английском — *twelve*.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: 12", "correctAnswer": "12"}
seed-en-b1-l2-ex1	seed-en-b1-l2	Вежливое несогласие	single_choice	{"maxScore": 10, "question": "Какая формулировка звучит наиболее вежливо в деловой переписке?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: I'm not sure I fully agree", "correctAnswer": "I'm not sure I fully agree"}
seed-bulk-course-1-lesson-1-exercise-1	seed-bulk-course-1-lesson-1	Проверка 1.1	text	{"maxScore": 10, "question": "Как одним словом по-английски называется повестка встречи?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agenda", "correctAnswer": "agenda"}
seed-bulk-course-1-lesson-2-exercise-1	seed-bulk-course-1-lesson-2	Проверка 2.1	text	{"maxScore": 10, "question": "Выберите нейтрально-деловой вариант отказа (одно слово): \\"I ___ this proposal for now.\\"\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: decline", "correctAnswer": "decline"}
seed-bulk-course-1-lesson-2-exercise-2	seed-bulk-course-1-lesson-2	Проверка 2.2	text	{"maxScore": 10, "question": "Заполните пропуск: Could we ___ this in more detail tomorrow?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: discuss", "correctAnswer": "discuss"}
seed-bulk-course-1-lesson-3-exercise-1	seed-bulk-course-1-lesson-3	Проверка 3.1	text	{"maxScore": 10, "question": "Какое слово завершает фразу: Thank you for your quick ___.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: response", "correctAnswer": "response"}
seed-bulk-course-2-lesson-1-exercise-1	seed-bulk-course-2-lesson-1	Проверка 1.1	text	{"maxScore": 10, "question": "Как одним словом по-английски называется повестка встречи?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agenda", "correctAnswer": "agenda"}
seed-bulk-course-2-lesson-1-exercise-2	seed-bulk-course-2-lesson-1	Проверка 1.2	text	{"maxScore": 10, "question": "Дополните фразу вежливого согласия: I fully ___ with your point.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agree", "correctAnswer": "agree"}
seed-bulk-course-2-lesson-2-exercise-2	seed-bulk-course-2-lesson-2	Проверка 2.2	text	{"maxScore": 10, "question": "Заполните пропуск: Could we ___ this in more detail tomorrow?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: discuss", "correctAnswer": "discuss"}
seed-bulk-course-2-lesson-3-exercise-1	seed-bulk-course-2-lesson-3	Проверка 3.1	text	{"maxScore": 10, "question": "Какое слово завершает фразу: Thank you for your quick ___.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: response", "correctAnswer": "response"}
seed-bulk-course-2-lesson-3-exercise-2	seed-bulk-course-2-lesson-3	Проверка 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2: напишите слово \\"confirmed\\" в нижнем регистре.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: confirmed", "correctAnswer": "confirmed"}
seed-bulk-course-3-lesson-1-exercise-1	seed-bulk-course-3-lesson-1	Проверка 1.1	text	{"maxScore": 10, "question": "Как одним словом по-английски называется повестка встречи?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agenda", "correctAnswer": "agenda"}
seed-bulk-course-3-lesson-2-exercise-1	seed-bulk-course-3-lesson-2	Проверка 2.1	text	{"maxScore": 10, "question": "Выберите нейтрально-деловой вариант отказа (одно слово): \\"I ___ this proposal for now.\\"\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: decline", "correctAnswer": "decline"}
seed-bulk-course-3-lesson-2-exercise-2	seed-bulk-course-3-lesson-2	Проверка 2.2	text	{"maxScore": 10, "question": "Заполните пропуск: Could we ___ this in more detail tomorrow?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: discuss", "correctAnswer": "discuss"}
seed-bulk-course-3-lesson-3-exercise-1	seed-bulk-course-3-lesson-3	Проверка 3.1	text	{"maxScore": 10, "question": "Какое слово завершает фразу: Thank you for your quick ___.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: response", "correctAnswer": "response"}
seed-bulk-course-4-lesson-1-exercise-1	seed-bulk-course-4-lesson-1	Проверка 1.1	text	{"maxScore": 10, "question": "Как одним словом по-английски называется повестка встречи?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agenda", "correctAnswer": "agenda"}
seed-bulk-course-4-lesson-2-exercise-2	seed-bulk-course-4-lesson-2	Проверка 2.2	text	{"maxScore": 10, "question": "Заполните пропуск: Could we ___ this in more detail tomorrow?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: discuss", "correctAnswer": "discuss"}
seed-bulk-course-4-lesson-3-exercise-1	seed-bulk-course-4-lesson-3	Проверка 3.1	text	{"maxScore": 10, "question": "Какое слово завершает фразу: Thank you for your quick ___.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: response", "correctAnswer": "response"}
seed-bulk-course-4-lesson-3-exercise-2	seed-bulk-course-4-lesson-3	Проверка 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 4: напишите слово \\"confirmed\\" в нижнем регистре.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: confirmed", "correctAnswer": "confirmed"}
seed-bulk-course-5-lesson-1-exercise-2	seed-bulk-course-5-lesson-1	Проверка 1.2	text	{"maxScore": 10, "question": "Дополните фразу вежливого согласия: I fully ___ with your point.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agree", "correctAnswer": "agree"}
seed-bulk-course-5-lesson-2-exercise-1	seed-bulk-course-5-lesson-2	Проверка 2.1	text	{"maxScore": 10, "question": "Выберите нейтрально-деловой вариант отказа (одно слово): \\"I ___ this proposal for now.\\"\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: decline", "correctAnswer": "decline"}
seed-bulk-course-5-lesson-2-exercise-2	seed-bulk-course-5-lesson-2	Проверка 2.2	text	{"maxScore": 10, "question": "Заполните пропуск: Could we ___ this in more detail tomorrow?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: discuss", "correctAnswer": "discuss"}
seed-bulk-course-5-lesson-3-exercise-1	seed-bulk-course-5-lesson-3	Проверка 3.1	text	{"maxScore": 10, "question": "Какое слово завершает фразу: Thank you for your quick ___.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: response", "correctAnswer": "response"}
seed-bulk-course-6-lesson-1-exercise-1	seed-bulk-course-6-lesson-1	Проверка 1.1	text	{"maxScore": 10, "question": "Как одним словом по-английски называется повестка встречи?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agenda", "correctAnswer": "agenda"}
seed-bulk-course-6-lesson-1-exercise-2	seed-bulk-course-6-lesson-1	Проверка 1.2	text	{"maxScore": 10, "question": "Дополните фразу вежливого согласия: I fully ___ with your point.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agree", "correctAnswer": "agree"}
seed-bulk-course-6-lesson-2-exercise-2	seed-bulk-course-6-lesson-2	Проверка 2.2	text	{"maxScore": 10, "question": "Заполните пропуск: Could we ___ this in more detail tomorrow?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: discuss", "correctAnswer": "discuss"}
seed-bulk-course-6-lesson-3-exercise-1	seed-bulk-course-6-lesson-3	Проверка 3.1	text	{"maxScore": 10, "question": "Какое слово завершает фразу: Thank you for your quick ___.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: response", "correctAnswer": "response"}
seed-bulk-course-6-lesson-3-exercise-2	seed-bulk-course-6-lesson-3	Проверка 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 6: напишите слово \\"confirmed\\" в нижнем регистре.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: confirmed", "correctAnswer": "confirmed"}
seed-bulk-course-7-lesson-1-exercise-2	seed-bulk-course-7-lesson-1	Проверка 1.2	text	{"maxScore": 10, "question": "Дополните фразу вежливого согласия: I fully ___ with your point.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agree", "correctAnswer": "agree"}
seed-bulk-course-7-lesson-2-exercise-1	seed-bulk-course-7-lesson-2	Проверка 2.1	text	{"maxScore": 10, "question": "Выберите нейтрально-деловой вариант отказа (одно слово): \\"I ___ this proposal for now.\\"\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: decline", "correctAnswer": "decline"}
seed-bulk-course-7-lesson-2-exercise-2	seed-bulk-course-7-lesson-2	Проверка 2.2	text	{"maxScore": 10, "question": "Заполните пропуск: Could we ___ this in more detail tomorrow?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: discuss", "correctAnswer": "discuss"}
seed-bulk-course-7-lesson-3-exercise-1	seed-bulk-course-7-lesson-3	Проверка 3.1	text	{"maxScore": 10, "question": "Какое слово завершает фразу: Thank you for your quick ___.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: response", "correctAnswer": "response"}
seed-bulk-course-8-lesson-1-exercise-1	seed-bulk-course-8-lesson-1	Проверка 1.1	text	{"maxScore": 10, "question": "Как одним словом по-английски называется повестка встречи?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agenda", "correctAnswer": "agenda"}
seed-bulk-course-8-lesson-1-exercise-2	seed-bulk-course-8-lesson-1	Проверка 1.2	text	{"maxScore": 10, "question": "Дополните фразу вежливого согласия: I fully ___ with your point.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agree", "correctAnswer": "agree"}
seed-bulk-course-8-lesson-3-exercise-1	seed-bulk-course-8-lesson-3	Проверка 3.1	text	{"maxScore": 10, "question": "Какое слово завершает фразу: Thank you for your quick ___.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: response", "correctAnswer": "response"}
seed-bulk-course-9-lesson-1-exercise-1	seed-bulk-course-9-lesson-1	Проверка 1.1	text	{"maxScore": 10, "question": "Как одним словом по-английски называется повестка встречи?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agenda", "correctAnswer": "agenda"}
seed-bulk-course-9-lesson-1-exercise-2	seed-bulk-course-9-lesson-1	Проверка 1.2	text	{"maxScore": 10, "question": "Дополните фразу вежливого согласия: I fully ___ with your point.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agree", "correctAnswer": "agree"}
seed-bulk-course-9-lesson-2-exercise-1	seed-bulk-course-9-lesson-2	Проверка 2.1	text	{"maxScore": 10, "question": "Выберите нейтрально-деловой вариант отказа (одно слово): \\"I ___ this proposal for now.\\"\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: decline", "correctAnswer": "decline"}
seed-bulk-course-9-lesson-3-exercise-1	seed-bulk-course-9-lesson-3	Проверка 3.1	text	{"maxScore": 10, "question": "Какое слово завершает фразу: Thank you for your quick ___.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: response", "correctAnswer": "response"}
seed-bulk-course-9-lesson-3-exercise-2	seed-bulk-course-9-lesson-3	Проверка 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3: напишите слово \\"confirmed\\" в нижнем регистре.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: confirmed", "correctAnswer": "confirmed"}
seed-bulk-course-10-lesson-1-exercise-2	seed-bulk-course-10-lesson-1	Проверка 1.2	text	{"maxScore": 10, "question": "Дополните фразу вежливого согласия: I fully ___ with your point.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agree", "correctAnswer": "agree"}
seed-bulk-course-10-lesson-2-exercise-1	seed-bulk-course-10-lesson-2	Проверка 2.1	text	{"maxScore": 10, "question": "Выберите нейтрально-деловой вариант отказа (одно слово): \\"I ___ this proposal for now.\\"\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: decline", "correctAnswer": "decline"}
seed-bulk-course-10-lesson-2-exercise-2	seed-bulk-course-10-lesson-2	Проверка 2.2	text	{"maxScore": 10, "question": "Заполните пропуск: Could we ___ this in more detail tomorrow?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: discuss", "correctAnswer": "discuss"}
seed-bulk-course-10-lesson-3-exercise-2	seed-bulk-course-10-lesson-3	Проверка 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 4: напишите слово \\"confirmed\\" в нижнем регистре.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: confirmed", "correctAnswer": "confirmed"}
seed-bulk-course-11-lesson-1-exercise-1	seed-bulk-course-11-lesson-1	Проверка 1.1	text	{"maxScore": 10, "question": "Как одним словом по-английски называется повестка встречи?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agenda", "correctAnswer": "agenda"}
seed-bulk-course-11-lesson-1-exercise-2	seed-bulk-course-11-lesson-1	Проверка 1.2	text	{"maxScore": 10, "question": "Дополните фразу вежливого согласия: I fully ___ with your point.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agree", "correctAnswer": "agree"}
seed-bulk-course-11-lesson-2-exercise-2	seed-bulk-course-11-lesson-2	Проверка 2.2	text	{"maxScore": 10, "question": "Заполните пропуск: Could we ___ this in more detail tomorrow?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: discuss", "correctAnswer": "discuss"}
seed-bulk-course-11-lesson-3-exercise-1	seed-bulk-course-11-lesson-3	Проверка 3.1	text	{"maxScore": 10, "question": "Какое слово завершает фразу: Thank you for your quick ___.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: response", "correctAnswer": "response"}
seed-bulk-course-11-lesson-3-exercise-2	seed-bulk-course-11-lesson-3	Проверка 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 5: напишите слово \\"confirmed\\" в нижнем регистре.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: confirmed", "correctAnswer": "confirmed"}
seed-bulk-course-12-lesson-1-exercise-2	seed-bulk-course-12-lesson-1	Проверка 1.2	text	{"maxScore": 10, "question": "Дополните фразу вежливого согласия: I fully ___ with your point.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agree", "correctAnswer": "agree"}
seed-bulk-course-12-lesson-2-exercise-1	seed-bulk-course-12-lesson-2	Проверка 2.1	text	{"maxScore": 10, "question": "Выберите нейтрально-деловой вариант отказа (одно слово): \\"I ___ this proposal for now.\\"\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: decline", "correctAnswer": "decline"}
seed-bulk-course-12-lesson-2-exercise-2	seed-bulk-course-12-lesson-2	Проверка 2.2	text	{"maxScore": 10, "question": "Заполните пропуск: Could we ___ this in more detail tomorrow?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: discuss", "correctAnswer": "discuss"}
seed-en-a1-l1-ex1	seed-en-a1-l1	Буква после D	text	{"maxScore": 5, "question": "Какая буква английского алфавита идёт сразу после **D**?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: E", "correctAnswer": "E"}
seed-en-a1-l1-ex2	seed-en-a1-l1	Количество гласных	text	{"maxScore": 5, "question": "Сколько гласных букв в английском алфавите? Ответ числом.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: 5", "correctAnswer": "5"}
seed-en-b1-l1-ex1	seed-en-b1-l1	Синоним повестки	text	{"maxScore": 10, "question": "Одним английским словом: документ с пунктами обсуждения на встрече (часто в начале письма).\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agenda", "correctAnswer": "agenda"}
seed-bulk-course-1-lesson-1-exercise-2	seed-bulk-course-1-lesson-1	Проверка 1.2	text	{"maxScore": 10, "question": "Дополните фразу вежливого согласия: I fully ___ with your point.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agree", "correctAnswer": "agree"}
seed-bulk-course-1-lesson-3-exercise-2	seed-bulk-course-1-lesson-3	Проверка 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1: напишите слово \\"confirmed\\" в нижнем регистре.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: confirmed", "correctAnswer": "confirmed"}
seed-bulk-course-2-lesson-2-exercise-1	seed-bulk-course-2-lesson-2	Проверка 2.1	text	{"maxScore": 10, "question": "Выберите нейтрально-деловой вариант отказа (одно слово): \\"I ___ this proposal for now.\\"\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: decline", "correctAnswer": "decline"}
seed-bulk-course-3-lesson-1-exercise-2	seed-bulk-course-3-lesson-1	Проверка 1.2	text	{"maxScore": 10, "question": "Дополните фразу вежливого согласия: I fully ___ with your point.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agree", "correctAnswer": "agree"}
seed-bulk-course-3-lesson-3-exercise-2	seed-bulk-course-3-lesson-3	Проверка 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3: напишите слово \\"confirmed\\" в нижнем регистре.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: confirmed", "correctAnswer": "confirmed"}
seed-bulk-course-4-lesson-1-exercise-2	seed-bulk-course-4-lesson-1	Проверка 1.2	text	{"maxScore": 10, "question": "Дополните фразу вежливого согласия: I fully ___ with your point.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agree", "correctAnswer": "agree"}
seed-bulk-course-4-lesson-2-exercise-1	seed-bulk-course-4-lesson-2	Проверка 2.1	text	{"maxScore": 10, "question": "Выберите нейтрально-деловой вариант отказа (одно слово): \\"I ___ this proposal for now.\\"\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: decline", "correctAnswer": "decline"}
seed-bulk-course-5-lesson-1-exercise-1	seed-bulk-course-5-lesson-1	Проверка 1.1	text	{"maxScore": 10, "question": "Как одним словом по-английски называется повестка встречи?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agenda", "correctAnswer": "agenda"}
seed-bulk-course-5-lesson-3-exercise-2	seed-bulk-course-5-lesson-3	Проверка 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 5: напишите слово \\"confirmed\\" в нижнем регистре.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: confirmed", "correctAnswer": "confirmed"}
seed-bulk-course-6-lesson-2-exercise-1	seed-bulk-course-6-lesson-2	Проверка 2.1	text	{"maxScore": 10, "question": "Выберите нейтрально-деловой вариант отказа (одно слово): \\"I ___ this proposal for now.\\"\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: decline", "correctAnswer": "decline"}
seed-bulk-course-7-lesson-1-exercise-1	seed-bulk-course-7-lesson-1	Проверка 1.1	text	{"maxScore": 10, "question": "Как одним словом по-английски называется повестка встречи?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agenda", "correctAnswer": "agenda"}
seed-bulk-course-7-lesson-3-exercise-2	seed-bulk-course-7-lesson-3	Проверка 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1: напишите слово \\"confirmed\\" в нижнем регистре.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: confirmed", "correctAnswer": "confirmed"}
seed-bulk-course-8-lesson-2-exercise-1	seed-bulk-course-8-lesson-2	Проверка 2.1	text	{"maxScore": 10, "question": "Выберите нейтрально-деловой вариант отказа (одно слово): \\"I ___ this proposal for now.\\"\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: decline", "correctAnswer": "decline"}
seed-bulk-course-8-lesson-2-exercise-2	seed-bulk-course-8-lesson-2	Проверка 2.2	text	{"maxScore": 10, "question": "Заполните пропуск: Could we ___ this in more detail tomorrow?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: discuss", "correctAnswer": "discuss"}
seed-bulk-course-8-lesson-3-exercise-2	seed-bulk-course-8-lesson-3	Проверка 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2: напишите слово \\"confirmed\\" в нижнем регистре.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: confirmed", "correctAnswer": "confirmed"}
seed-bulk-course-9-lesson-2-exercise-2	seed-bulk-course-9-lesson-2	Проверка 2.2	text	{"maxScore": 10, "question": "Заполните пропуск: Could we ___ this in more detail tomorrow?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: discuss", "correctAnswer": "discuss"}
seed-bulk-course-10-lesson-1-exercise-1	seed-bulk-course-10-lesson-1	Проверка 1.1	text	{"maxScore": 10, "question": "Как одним словом по-английски называется повестка встречи?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agenda", "correctAnswer": "agenda"}
seed-bulk-course-10-lesson-3-exercise-1	seed-bulk-course-10-lesson-3	Проверка 3.1	text	{"maxScore": 10, "question": "Какое слово завершает фразу: Thank you for your quick ___.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: response", "correctAnswer": "response"}
seed-bulk-course-11-lesson-2-exercise-1	seed-bulk-course-11-lesson-2	Проверка 2.1	text	{"maxScore": 10, "question": "Выберите нейтрально-деловой вариант отказа (одно слово): \\"I ___ this proposal for now.\\"\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: decline", "correctAnswer": "decline"}
seed-bulk-course-12-lesson-1-exercise-1	seed-bulk-course-12-lesson-1	Проверка 1.1	text	{"maxScore": 10, "question": "Как одним словом по-английски называется повестка встречи?\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: agenda", "correctAnswer": "agenda"}
seed-bulk-course-12-lesson-3-exercise-1	seed-bulk-course-12-lesson-3	Проверка 3.1	text	{"maxScore": 10, "question": "Какое слово завершает фразу: Thank you for your quick ___.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: response", "correctAnswer": "response"}
seed-bulk-course-12-lesson-3-exercise-2	seed-bulk-course-12-lesson-3	Проверка 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 6: напишите слово \\"confirmed\\" в нижнем регистре.\\n\\n[Демо-подсказка для быстрого теста] Правильный ответ: confirmed", "correctAnswer": "confirmed"}
\.


--
-- TOC entry 5084 (class 0 OID 33017)
-- Dependencies: 262
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, user_id, course_id, created_at) FROM stdin;
9043dfe4-44dd-45e7-a622-6f09c41b5fd4	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-course-intro	2026-04-24 22:22:47.466
8bb3b526-dbd5-4ccf-9d44-1c93a098ac5b	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-b1	2026-04-24 22:26:25.28
40cc7abd-f265-446b-910b-0a1b53a6fbef	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-course-en-a1	2026-04-24 22:30:11.281
47265f87-ba38-4684-9fc9-47ef9ff71752	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-a1	2026-05-08 08:03:00.311
4d6074b6-2322-4849-a962-afa7721bb9bc	e121b451-ca46-4505-b500-88929d5f2b02	seed-bulk-course-2	2026-05-27 15:12:03.283
fff9e799-90f7-46f7-a9ed-0052ac5a3daf	371f8e8a-69df-4ec8-aac4-2a2eceb23dfb	seed-bulk-course-3	2026-05-27 15:12:03.293
63b537c7-ce9a-4722-a3c2-cfa4e725b0c1	ec47cc44-6274-4d50-a9c1-6c9bf339eafb	seed-bulk-course-4	2026-05-27 15:12:03.302
a2b7073b-c729-4cc0-939d-9d5a58a638ec	fa576b75-3be7-456e-8c13-92560a68c42f	seed-bulk-course-5	2026-05-27 15:12:03.311
4db38db3-5272-4bbb-be12-91379ea8509e	a4ed5ec9-d376-41a2-8afb-fe53e494500e	seed-bulk-course-6	2026-05-27 15:12:03.32
06367169-001e-453b-a3b4-817106d17b73	3b180a56-18e5-4a7e-913f-1dfa2ea1557b	seed-bulk-course-7	2026-05-27 15:12:03.328
165c0ee2-f4fc-414d-ab29-1490404b2e9c	937659aa-d221-4720-b41c-c410cbad03fe	seed-bulk-course-8	2026-05-27 15:12:03.337
84ed3be8-eec7-40a6-b8c6-4226dd9d05c6	200d4cc2-567b-478a-aadd-1a1b6c6a3de2	seed-bulk-course-9	2026-05-27 15:12:03.344
4e724e28-4c7a-4c90-98d3-87ea9f1cdbed	d7811cc8-33e3-4334-873e-cc79c799253f	seed-bulk-course-10	2026-05-27 15:12:03.352
416d75a4-e9cc-467f-858c-4742b59bf755	c396b5e6-3de5-4f8f-8102-213b5bba6f77	seed-bulk-course-11	2026-05-27 15:12:03.361
\.


--
-- TOC entry 5079 (class 0 OID 32934)
-- Dependencies: 257
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, course_id, title, sort_order, content) FROM stdin;
seed-lesson-1	seed-course-intro	First lesson	1	Welcome to the platform.
seed-bulk-course-1-lesson-1	seed-bulk-course-1	Урок 1. Лексика и термины	1	## Теория: базовая лексика (B1)\n- Тема урока: деловой переписке.\n- Разберите 8 ключевых слов и 3 устойчивые фразы.\n\n## Практика\n1. Составьте 3 коротких предложения по теме.\n2. Подчеркните главное слово в каждом предложении.
seed-bulk-course-1-lesson-2	seed-bulk-course-1	Урок 2. Грамматика и формулировки	2	## Теория: грамматика в контексте\n- Как строится утвердительное предложение по теме "деловой переписке".\n- Типичные ошибки студентов уровня B1 и как их исправлять.\n\n## Практика\nПреобразуйте 4 фразы из разговорного стиля в нейтрально-деловой.
seed-en-a1-l1	seed-course-en-a1	Урок 1. Алфавит и произношение	1	## Цели урока\n- Узнать английский алфавив и типичные названия букв в эфире.\n- Потренировать пару минимальных пар звуков (например, **i** / **ee**).\n\n## Краткая теория\nВ английском 26 букв; гласные **A E I O U**, остальные — согласные. На уровне A1 достаточно уверенно читать буквы по одной (диктовка e-mail, аббревиатуры).\n\n## Практика\n1. Прочитайте алфавит вслух два раза.\n2. Запишите своё имя латиницей и проговорите по буквам.
seed-en-a1-l2	seed-course-en-a1	Урок 2. Приветствия и прощания	2	## Диалоги\n- **Hello** / **Hi** — нейтральное и неформальное приветствие.\n- **Good morning** — до полудня; **Good evening** — после работы.\n\n## Формулы вежливости\n**Nice to meet you** — при первом знакомстве. Ответ часто: **Nice to meet you too**.\n\n## Домашнее задание\nСоставьте 4 реплики: поздороваться, представиться, спросить "How are you?", попрощаться.
seed-en-a1-l3	seed-course-en-a1	Урок 3. Цифры и даты	3	## Числа 0–20\nЗапомните порядок: *zero, one, two … twenty*.\n\n## Год и день рождения\nГод читают по парам цифр: **1998** — *nineteen ninety-eight*.\n\n## Задание\nНазовите свой день рождения на английском (день + месяц + год).
seed-en-b1-l1	seed-course-en-b1	Повестка и тайминг	1	## Структура встречи\n1. **Opening** — цель и ожидания.\n2. **Agenda** — пункты по времени.\n3. **Action items** — кто что делает к какому сроку.\n\n## Полезные фразы\n- *Let's stick to the agenda.*\n- *I'd like to table this for our next call.*
seed-en-b1-l2	seed-course-en-b1	Согласие и мягкое несогласие	2	## Согласие\n*I agree with you on this point.*\n\n## Мягкий отказ\n*I'm not sure I fully agree — could we look at the data again?*\n\nИзбегайте резкого **You're wrong** в переписке с партнёрами.
seed-fr-draft-l1	seed-course-fr-draft	Naso voyelles	1	Черновик: nasales **an, in, on** — примеры будут добавлены.
seed-bulk-course-1-lesson-3	seed-bulk-course-1	Урок 3. Деловая коммуникация	3	## Теория: коммуникация на практике\n- Микродиалог по теме "деловой переписке".\n- Шаблон для самооценки ответа перед отправкой преподавателю.\n\n## Практика\nНапишите короткий ответ коллеге (2-3 предложения) с вежливой формулировкой.
seed-bulk-course-2-lesson-1	seed-bulk-course-2	Урок 1. Лексика и термины	1	## Теория: базовая лексика (A2)\n- Тема урока: рабочим созвонам.\n- Разберите 8 ключевых слов и 3 устойчивые фразы.\n\n## Практика\n1. Составьте 3 коротких предложения по теме.\n2. Подчеркните главное слово в каждом предложении.
seed-bulk-course-2-lesson-2	seed-bulk-course-2	Урок 2. Грамматика и формулировки	2	## Теория: грамматика в контексте\n- Как строится утвердительное предложение по теме "рабочим созвонам".\n- Типичные ошибки студентов уровня A2 и как их исправлять.\n\n## Практика\nПреобразуйте 4 фразы из разговорного стиля в нейтрально-деловой.
seed-bulk-course-2-lesson-3	seed-bulk-course-2	Урок 3. Деловая коммуникация	3	## Теория: коммуникация на практике\n- Микродиалог по теме "рабочим созвонам".\n- Шаблон для самооценки ответа перед отправкой преподавателю.\n\n## Практика\nНапишите короткий ответ коллеге (2-3 предложения) с вежливой формулировкой.
seed-bulk-course-3-lesson-1	seed-bulk-course-3	Урок 1. Лексика и термины	1	## Теория: базовая лексика (B1)\n- Тема урока: презентациям и питчам.\n- Разберите 8 ключевых слов и 3 устойчивые фразы.\n\n## Практика\n1. Составьте 3 коротких предложения по теме.\n2. Подчеркните главное слово в каждом предложении.
seed-bulk-course-3-lesson-2	seed-bulk-course-3	Урок 2. Грамматика и формулировки	2	## Теория: грамматика в контексте\n- Как строится утвердительное предложение по теме "презентациям и питчам".\n- Типичные ошибки студентов уровня B1 и как их исправлять.\n\n## Практика\nПреобразуйте 4 фразы из разговорного стиля в нейтрально-деловой.
seed-bulk-course-3-lesson-3	seed-bulk-course-3	Урок 3. Деловая коммуникация	3	## Теория: коммуникация на практике\n- Микродиалог по теме "презентациям и питчам".\n- Шаблон для самооценки ответа перед отправкой преподавателю.\n\n## Практика\nНапишите короткий ответ коллеге (2-3 предложения) с вежливой формулировкой.
seed-bulk-course-4-lesson-1	seed-bulk-course-4	Урок 1. Лексика и термины	1	## Теория: базовая лексика (A2)\n- Тема урока: переговорам с клиентом.\n- Разберите 8 ключевых слов и 3 устойчивые фразы.\n\n## Практика\n1. Составьте 3 коротких предложения по теме.\n2. Подчеркните главное слово в каждом предложении.
seed-bulk-course-4-lesson-2	seed-bulk-course-4	Урок 2. Грамматика и формулировки	2	## Теория: грамматика в контексте\n- Как строится утвердительное предложение по теме "переговорам с клиентом".\n- Типичные ошибки студентов уровня A2 и как их исправлять.\n\n## Практика\nПреобразуйте 4 фразы из разговорного стиля в нейтрально-деловой.
seed-bulk-course-4-lesson-3	seed-bulk-course-4	Урок 3. Деловая коммуникация	3	## Теория: коммуникация на практике\n- Микродиалог по теме "переговорам с клиентом".\n- Шаблон для самооценки ответа перед отправкой преподавателю.\n\n## Практика\nНапишите короткий ответ коллеге (2-3 предложения) с вежливой формулировкой.
seed-bulk-course-5-lesson-1	seed-bulk-course-5	Урок 1. Лексика и термины	1	## Теория: базовая лексика (B1)\n- Тема урока: управлению задачами.\n- Разберите 8 ключевых слов и 3 устойчивые фразы.\n\n## Практика\n1. Составьте 3 коротких предложения по теме.\n2. Подчеркните главное слово в каждом предложении.
seed-bulk-course-5-lesson-2	seed-bulk-course-5	Урок 2. Грамматика и формулировки	2	## Теория: грамматика в контексте\n- Как строится утвердительное предложение по теме "управлению задачами".\n- Типичные ошибки студентов уровня B1 и как их исправлять.\n\n## Практика\nПреобразуйте 4 фразы из разговорного стиля в нейтрально-деловой.
seed-bulk-course-5-lesson-3	seed-bulk-course-5	Урок 3. Деловая коммуникация	3	## Теория: коммуникация на практике\n- Микродиалог по теме "управлению задачами".\n- Шаблон для самооценки ответа перед отправкой преподавателю.\n\n## Практика\nНапишите короткий ответ коллеге (2-3 предложения) с вежливой формулировкой.
seed-bulk-course-6-lesson-1	seed-bulk-course-6	Урок 1. Лексика и термины	1	## Теория: базовая лексика (A2)\n- Тема урока: обратной связи в команде.\n- Разберите 8 ключевых слов и 3 устойчивые фразы.\n\n## Практика\n1. Составьте 3 коротких предложения по теме.\n2. Подчеркните главное слово в каждом предложении.
seed-bulk-course-6-lesson-2	seed-bulk-course-6	Урок 2. Грамматика и формулировки	2	## Теория: грамматика в контексте\n- Как строится утвердительное предложение по теме "обратной связи в команде".\n- Типичные ошибки студентов уровня A2 и как их исправлять.\n\n## Практика\nПреобразуйте 4 фразы из разговорного стиля в нейтрально-деловой.
seed-bulk-course-6-lesson-3	seed-bulk-course-6	Урок 3. Деловая коммуникация	3	## Теория: коммуникация на практике\n- Микродиалог по теме "обратной связи в команде".\n- Шаблон для самооценки ответа перед отправкой преподавателю.\n\n## Практика\nНапишите короткий ответ коллеге (2-3 предложения) с вежливой формулировкой.
seed-bulk-course-7-lesson-1	seed-bulk-course-7	Урок 1. Лексика и термины	1	## Теория: базовая лексика (B1)\n- Тема урока: деловой переписке.\n- Разберите 8 ключевых слов и 3 устойчивые фразы.\n\n## Практика\n1. Составьте 3 коротких предложения по теме.\n2. Подчеркните главное слово в каждом предложении.
seed-bulk-course-7-lesson-2	seed-bulk-course-7	Урок 2. Грамматика и формулировки	2	## Теория: грамматика в контексте\n- Как строится утвердительное предложение по теме "деловой переписке".\n- Типичные ошибки студентов уровня B1 и как их исправлять.\n\n## Практика\nПреобразуйте 4 фразы из разговорного стиля в нейтрально-деловой.
seed-bulk-course-7-lesson-3	seed-bulk-course-7	Урок 3. Деловая коммуникация	3	## Теория: коммуникация на практике\n- Микродиалог по теме "деловой переписке".\n- Шаблон для самооценки ответа перед отправкой преподавателю.\n\n## Практика\nНапишите короткий ответ коллеге (2-3 предложения) с вежливой формулировкой.
seed-bulk-course-8-lesson-1	seed-bulk-course-8	Урок 1. Лексика и термины	1	## Теория: базовая лексика (A2)\n- Тема урока: рабочим созвонам.\n- Разберите 8 ключевых слов и 3 устойчивые фразы.\n\n## Практика\n1. Составьте 3 коротких предложения по теме.\n2. Подчеркните главное слово в каждом предложении.
seed-bulk-course-8-lesson-2	seed-bulk-course-8	Урок 2. Грамматика и формулировки	2	## Теория: грамматика в контексте\n- Как строится утвердительное предложение по теме "рабочим созвонам".\n- Типичные ошибки студентов уровня A2 и как их исправлять.\n\n## Практика\nПреобразуйте 4 фразы из разговорного стиля в нейтрально-деловой.
seed-bulk-course-8-lesson-3	seed-bulk-course-8	Урок 3. Деловая коммуникация	3	## Теория: коммуникация на практике\n- Микродиалог по теме "рабочим созвонам".\n- Шаблон для самооценки ответа перед отправкой преподавателю.\n\n## Практика\nНапишите короткий ответ коллеге (2-3 предложения) с вежливой формулировкой.
seed-bulk-course-9-lesson-1	seed-bulk-course-9	Урок 1. Лексика и термины	1	## Теория: базовая лексика (B1)\n- Тема урока: презентациям и питчам.\n- Разберите 8 ключевых слов и 3 устойчивые фразы.\n\n## Практика\n1. Составьте 3 коротких предложения по теме.\n2. Подчеркните главное слово в каждом предложении.
seed-bulk-course-9-lesson-2	seed-bulk-course-9	Урок 2. Грамматика и формулировки	2	## Теория: грамматика в контексте\n- Как строится утвердительное предложение по теме "презентациям и питчам".\n- Типичные ошибки студентов уровня B1 и как их исправлять.\n\n## Практика\nПреобразуйте 4 фразы из разговорного стиля в нейтрально-деловой.
seed-bulk-course-9-lesson-3	seed-bulk-course-9	Урок 3. Деловая коммуникация	3	## Теория: коммуникация на практике\n- Микродиалог по теме "презентациям и питчам".\n- Шаблон для самооценки ответа перед отправкой преподавателю.\n\n## Практика\nНапишите короткий ответ коллеге (2-3 предложения) с вежливой формулировкой.
seed-bulk-course-10-lesson-1	seed-bulk-course-10	Урок 1. Лексика и термины	1	## Теория: базовая лексика (A2)\n- Тема урока: переговорам с клиентом.\n- Разберите 8 ключевых слов и 3 устойчивые фразы.\n\n## Практика\n1. Составьте 3 коротких предложения по теме.\n2. Подчеркните главное слово в каждом предложении.
seed-bulk-course-10-lesson-2	seed-bulk-course-10	Урок 2. Грамматика и формулировки	2	## Теория: грамматика в контексте\n- Как строится утвердительное предложение по теме "переговорам с клиентом".\n- Типичные ошибки студентов уровня A2 и как их исправлять.\n\n## Практика\nПреобразуйте 4 фразы из разговорного стиля в нейтрально-деловой.
seed-bulk-course-10-lesson-3	seed-bulk-course-10	Урок 3. Деловая коммуникация	3	## Теория: коммуникация на практике\n- Микродиалог по теме "переговорам с клиентом".\n- Шаблон для самооценки ответа перед отправкой преподавателю.\n\n## Практика\nНапишите короткий ответ коллеге (2-3 предложения) с вежливой формулировкой.
seed-bulk-course-11-lesson-1	seed-bulk-course-11	Урок 1. Лексика и термины	1	## Теория: базовая лексика (B1)\n- Тема урока: управлению задачами.\n- Разберите 8 ключевых слов и 3 устойчивые фразы.\n\n## Практика\n1. Составьте 3 коротких предложения по теме.\n2. Подчеркните главное слово в каждом предложении.
seed-bulk-course-11-lesson-2	seed-bulk-course-11	Урок 2. Грамматика и формулировки	2	## Теория: грамматика в контексте\n- Как строится утвердительное предложение по теме "управлению задачами".\n- Типичные ошибки студентов уровня B1 и как их исправлять.\n\n## Практика\nПреобразуйте 4 фразы из разговорного стиля в нейтрально-деловой.
seed-bulk-course-11-lesson-3	seed-bulk-course-11	Урок 3. Деловая коммуникация	3	## Теория: коммуникация на практике\n- Микродиалог по теме "управлению задачами".\n- Шаблон для самооценки ответа перед отправкой преподавателю.\n\n## Практика\nНапишите короткий ответ коллеге (2-3 предложения) с вежливой формулировкой.
seed-bulk-course-12-lesson-1	seed-bulk-course-12	Урок 1. Лексика и термины	1	## Теория: базовая лексика (A2)\n- Тема урока: обратной связи в команде.\n- Разберите 8 ключевых слов и 3 устойчивые фразы.\n\n## Практика\n1. Составьте 3 коротких предложения по теме.\n2. Подчеркните главное слово в каждом предложении.
seed-bulk-course-12-lesson-2	seed-bulk-course-12	Урок 2. Грамматика и формулировки	2	## Теория: грамматика в контексте\n- Как строится утвердительное предложение по теме "обратной связи в команде".\n- Типичные ошибки студентов уровня A2 и как их исправлять.\n\n## Практика\nПреобразуйте 4 фразы из разговорного стиля в нейтрально-деловой.
seed-bulk-course-12-lesson-3	seed-bulk-course-12	Урок 3. Деловая коммуникация	3	## Теория: коммуникация на практике\n- Микродиалог по теме "обратной связи в команде".\n- Шаблон для самооценки ответа перед отправкой преподавателю.\n\n## Практика\nНапишите короткий ответ коллеге (2-3 предложения) с вежливой формулировкой.
\.


--
-- TOC entry 5085 (class 0 OID 33029)
-- Dependencies: 263
-- Data for Name: reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reminders (id, user_id, course_id, title, remind_at, created_at, delivered_at, email_sent_at, acknowledged_at) FROM stdin;
ecaec6d3-b7ee-4fbf-b0f5-641002fa263b	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	\N	fafas	2027-01-30 20:10:00+03	2026-04-25 01:30:33.231+03	\N	\N	\N
c9ef5ecc-b3c8-4eee-b07e-d7931c44e0ad	a4ed5ec9-d376-41a2-8afb-fe53e494500e	seed-bulk-course-6	Bulk reminder 5	2026-06-01 18:12:03.036+03	2026-05-27 18:12:03.324+03	\N	\N	\N
c1bb9c2e-3b4f-4181-95f0-ec6e38f9ae46	3b180a56-18e5-4a7e-913f-1dfa2ea1557b	seed-bulk-course-7	Bulk reminder 6	2026-06-01 18:12:03.036+03	2026-05-27 18:12:03.333+03	\N	\N	\N
265a3bbc-0a0b-40ad-8133-ff05b88db1e0	937659aa-d221-4720-b41c-c410cbad03fe	seed-bulk-course-8	Bulk reminder 7	2026-06-01 18:12:03.036+03	2026-05-27 18:12:03.341+03	\N	\N	\N
da84e0a5-ae53-46d0-beaf-02ee6d7db6dd	200d4cc2-567b-478a-aadd-1a1b6c6a3de2	seed-bulk-course-9	Bulk reminder 8	2026-06-01 18:12:03.036+03	2026-05-27 18:12:03.347+03	\N	\N	\N
296adb8a-b490-4eb4-a91a-21f7784af600	d7811cc8-33e3-4334-873e-cc79c799253f	seed-bulk-course-10	Bulk reminder 9	2026-06-01 18:12:03.036+03	2026-05-27 18:12:03.353+03	\N	\N	\N
be71ef0e-604e-425a-a491-3943598de55a	c396b5e6-3de5-4f8f-8102-213b5bba6f77	seed-bulk-course-11	Bulk reminder 10	2026-06-01 18:12:03.036+03	2026-05-27 18:12:03.362+03	\N	\N	\N
4101265c-1ac2-4c46-82ca-4e3861a85d10	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-a1	Повторить урок 2 (приветствия)	2026-06-03 17:17:35.522+03	2026-05-31 17:17:35.525+03	\N	\N	\N
b1d5cffd-5019-4455-b21e-20bc7429f56c	b82b4e3a-013b-46d8-8961-2e0eb889af9e	\N	Повторить урок 2 (приветствия)	2026-05-31 17:51:00+03	2026-05-31 17:50:09.021+03	\N	\N	\N
4a2e3f92-69d1-4c50-868f-bfa981d07868	e121b451-ca46-4505-b500-88929d5f2b02	seed-bulk-course-2	Bulk reminder 1	2026-06-01 18:12:03.036+03	2026-05-27 18:12:03.285+03	\N	\N	\N
f8f901c1-8680-4fe8-a957-151a5e6d531c	371f8e8a-69df-4ec8-aac4-2a2eceb23dfb	seed-bulk-course-3	Bulk reminder 2	2026-06-01 18:12:03.036+03	2026-05-27 18:12:03.295+03	\N	\N	\N
012d5871-ff6b-4c1b-bcf4-a37640986c96	ec47cc44-6274-4d50-a9c1-6c9bf339eafb	seed-bulk-course-4	Bulk reminder 3	2026-06-01 18:12:03.036+03	2026-05-27 18:12:03.304+03	\N	\N	\N
67971593-e3e3-4346-b771-0c96047dff13	fa576b75-3be7-456e-8c13-92560a68c42f	seed-bulk-course-5	Bulk reminder 4	2026-06-01 18:12:03.036+03	2026-05-27 18:12:03.313+03	\N	\N	\N
\.


--
-- TOC entry 5073 (class 0 OID 32857)
-- Dependencies: 251
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (code) FROM stdin;
STUDENT
TEACHER
ADMIN
\.


--
-- TOC entry 5083 (class 0 OID 33003)
-- Dependencies: 261
-- Data for Name: submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.submissions (id, user_id, exercise_id, score, payload, created_at) FROM stdin;
ffe4b7fb-b04c-4973-9eae-a1b39c8faaee	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-exercise-1	0	{"answer": "ASFASFSA", "correct": false}	2026-04-24 22:20:04.081
d74f36dc-267a-46bd-a350-0699e3229de1	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-exercise-1	0	{"answer": "ASFASFSAASFAS", "correct": false}	2026-04-24 22:20:08.519
83563a1c-66ea-4b06-ba0c-f99093098167	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-exercise-1	0	{"answer": "ASFASFSAASFAS", "correct": false}	2026-04-24 22:20:15.54
264c0957-277d-4676-8354-1bd1fa05b94a	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-exercise-1	0	{"answer": "ASFASFSAASFAS", "correct": false}	2026-04-24 22:20:15.891
904f25cd-35e1-4cd6-92fc-2abe39b079c5	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-exercise-1	0	{"answer": "AFAFSA", "correct": false}	2026-04-24 22:20:37.003
54e28fc8-594e-4d21-b1de-2afe400c3c07	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-exercise-1	0	{"answer": "AFASFA", "correct": false}	2026-04-24 22:22:37.539
767c61a4-6ef9-4bd4-b856-44092e011a26	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l1-ex1	5	{"answer": "E", "correct": true}	2026-04-24 22:26:25.294
8483277a-9892-4834-a3d9-329cd780e610	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-en-a1-l1-ex1	5	{"answer": "E", "correct": true}	2026-04-24 22:27:19.285
5e77b9ff-de9a-49fa-a8c3-75db02059e04	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-en-a1-l1-ex2	5	{"answer": "5", "correct": true}	2026-04-24 22:27:51.999
9b813377-a25b-4bf2-9d2d-36b50acc9948	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-en-a1-l1-ex2	5	{"answer": "5", "correct": true}	2026-04-24 22:27:52.929
7ed6fcf9-0094-437a-a06a-1562f70240d4	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-en-a1-l1-ex2	0	{"answer": "6", "correct": false}	2026-04-24 22:27:55.926
0ce30141-9c43-468f-b75e-ce7664d606df	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-en-a1-l1-ex2	5	{"answer": "5", "correct": true}	2026-04-24 22:27:59.642
f589b217-1e6e-49ba-9d3f-865d3e103058	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-en-a1-l1-ex1	5	{"answer": "E", "correct": true}	2026-04-24 22:29:00.124
4b5d3758-bbba-4390-accb-68e1a718a932	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-en-a1-l1-ex2	5	{"answer": "5", "correct": true}	2026-04-24 22:29:01.06
d874b42c-bf02-44ba-8961-302034ccd7d6	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-en-a1-l2-ex1	0	{"answer": "hi", "correct": false}	2026-04-24 22:29:56.91
0408e903-6d68-431f-8e97-f4f75225c428	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-en-a1-l2-ex2	10	{"answer": "too", "correct": true}	2026-04-24 22:30:04.506
87b7bead-11dd-4b8b-855d-3026b8d43008	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-en-a1-l3-ex1	10	{"answer": "12", "correct": true}	2026-04-24 22:31:50.322
0ffe1968-a4e7-4ba9-a3ff-f256ab408367	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-en-a1-l1-ex1	5	{"answer": "E", "correct": true}	2026-04-24 22:36:16.657
48f2cd87-65e8-484c-8b20-09f74c8a87a9	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-en-a1-l1-ex2	0	{"answer": "6", "correct": false}	2026-04-24 22:36:21.199
bc5fabf9-9e7e-49a3-a784-b93b03f58a5f	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-en-a1-l1-ex2	5	{"answer": "5", "correct": true}	2026-04-24 22:36:25.787
seed-cohort-sub-1-a1-seed-en-a1-l1-ex2	seed-cohort-student-1	seed-en-a1-l1-ex2	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-cohort-sub-1-a1-seed-en-a1-l2-ex2	seed-cohort-student-1	seed-en-a1-l2-ex2	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-cohort-sub-1-a1-seed-en-a1-l3-ex1	seed-cohort-student-1	seed-en-a1-l3-ex1	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-cohort-sub-1-b1-seed-en-b1-l1-ex1	seed-cohort-student-1	seed-en-b1-l1-ex1	10	{"answer": "agenda", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-cohort-sub-1-b1-seed-en-b1-l2-ex1	seed-cohort-student-1	seed-en-b1-l2-ex1	10	{"answer": "I'm not sure I fully agree", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-cohort-sub-2-a1-seed-en-a1-l1-ex1	seed-cohort-student-2	seed-en-a1-l1-ex1	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-cohort-sub-2-a1-seed-en-a1-l1-ex2	seed-cohort-student-2	seed-en-a1-l1-ex2	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-cohort-sub-2-a1-seed-en-a1-l2-ex1	seed-cohort-student-2	seed-en-a1-l2-ex1	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-cohort-sub-2-a1-seed-en-a1-l2-ex2	seed-cohort-student-2	seed-en-a1-l2-ex2	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-cohort-sub-2-a1-seed-en-a1-l3-ex1	seed-cohort-student-2	seed-en-a1-l3-ex1	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-cohort-sub-2-b1-seed-en-b1-l1-ex1	seed-cohort-student-2	seed-en-b1-l1-ex1	10	{"answer": "agenda", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-cohort-sub-3-a1-seed-en-a1-l1-ex1	seed-cohort-student-3	seed-en-a1-l1-ex1	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-26 09:00:00
seed-cohort-sub-3-a1-seed-en-a1-l1-ex2	seed-cohort-student-3	seed-en-a1-l1-ex2	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-26 09:00:00
seed-cohort-sub-3-a1-seed-en-a1-l2-ex1	seed-cohort-student-3	seed-en-a1-l2-ex1	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-26 09:00:00
seed-cohort-sub-3-a1-seed-en-a1-l2-ex2	seed-cohort-student-3	seed-en-a1-l2-ex2	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-26 09:00:00
seed-cohort-sub-4-a1-seed-en-a1-l1-ex1	seed-cohort-student-4	seed-en-a1-l1-ex1	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-21 09:00:00
seed-cohort-sub-4-a1-seed-en-a1-l1-ex2	seed-cohort-student-4	seed-en-a1-l1-ex2	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-21 09:00:00
seed-cohort-sub-4-a1-seed-en-a1-l2-ex1	seed-cohort-student-4	seed-en-a1-l2-ex1	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-21 09:00:00
seed-cohort-sub-4-b1-seed-en-b1-l1-ex1	seed-cohort-student-4	seed-en-b1-l1-ex1	5	{"answer": "partial", "cohort": true, "correct": false}	2026-05-21 09:00:00
seed-cohort-sub-5-a1-seed-en-a1-l1-ex1	seed-cohort-student-5	seed-en-a1-l1-ex1	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-01 09:00:00
seed-cohort-sub-5-a1-seed-en-a1-l1-ex2	seed-cohort-student-5	seed-en-a1-l1-ex2	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-01 09:00:00
seed-cohort-sub-1-a1-seed-en-a1-l2-ex1	seed-cohort-student-1	seed-en-a1-l2-ex1	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-bulk-submission-student-1-1	e121b451-ca46-4505-b500-88929d5f2b02	seed-bulk-course-1-lesson-1-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.366
seed-bulk-submission-student-1-2	e121b451-ca46-4505-b500-88929d5f2b02	seed-bulk-course-1-lesson-1-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.368
seed-bulk-submission-student-1-3	e121b451-ca46-4505-b500-88929d5f2b02	seed-bulk-course-1-lesson-2-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.369
seed-bulk-submission-student-2-1	371f8e8a-69df-4ec8-aac4-2a2eceb23dfb	seed-bulk-course-1-lesson-2-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.371
seed-bulk-submission-student-2-2	371f8e8a-69df-4ec8-aac4-2a2eceb23dfb	seed-bulk-course-1-lesson-3-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.374
seed-bulk-submission-student-2-3	371f8e8a-69df-4ec8-aac4-2a2eceb23dfb	seed-bulk-course-1-lesson-3-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.375
seed-bulk-submission-student-3-1	ec47cc44-6274-4d50-a9c1-6c9bf339eafb	seed-bulk-course-2-lesson-1-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.377
seed-bulk-submission-student-3-2	ec47cc44-6274-4d50-a9c1-6c9bf339eafb	seed-bulk-course-2-lesson-1-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.378
seed-bulk-submission-student-3-3	ec47cc44-6274-4d50-a9c1-6c9bf339eafb	seed-bulk-course-2-lesson-2-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.38
seed-bulk-submission-student-4-1	fa576b75-3be7-456e-8c13-92560a68c42f	seed-bulk-course-2-lesson-2-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.383
d54fbd8c-a7c9-4897-99f2-266320210610	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-exercise-1	0	{"answer": "", "correct": false}	2026-05-07 19:18:35.321
9bf4cb1a-6f8b-4e4e-ae55-29261ad78e9f	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-exercise-1	0	{"answer": "цафаф", "correct": false}	2026-05-07 19:18:40.585
9abee99c-41a3-4e9e-b4c9-af5e3926a096	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-exercise-1	0	{"answer": "цафаф", "correct": false}	2026-05-07 19:18:41.383
6a9db088-0fc5-47ac-9891-00f405ccbdf9	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l1-ex2	0	{"answer": "31", "correct": false}	2026-05-07 19:18:58.018
seed-bulk-submission-student-4-2	fa576b75-3be7-456e-8c13-92560a68c42f	seed-bulk-course-2-lesson-3-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.384
seed-bulk-submission-student-4-3	fa576b75-3be7-456e-8c13-92560a68c42f	seed-bulk-course-2-lesson-3-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.385
seed-bulk-submission-student-5-1	a4ed5ec9-d376-41a2-8afb-fe53e494500e	seed-bulk-course-3-lesson-1-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.387
8d7b4687-9b4d-4c24-b312-8faa5167b0e5	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l1-ex2	5	{"answer": "5", "correct": true}	2026-05-07 19:19:22.826
56ba6164-a17e-419d-bb1a-a53f8370d1c7	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l2-ex1	0	{"answer": "Hi", "correct": false}	2026-05-07 19:22:56.757
a1406391-26b0-483c-ae03-f445d463907e	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l2-ex1	0	{"answer": "hi", "correct": false}	2026-05-07 19:23:11.887
ce31b9e4-c542-4567-91f0-bc6a68809a97	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l2-ex1	0	{"answer": "hi", "correct": false}	2026-05-07 19:23:13.168
06379281-d5fb-46d3-aae9-9ede9892adfe	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l2-ex1	10	{"answer": "Hello", "correct": true}	2026-05-07 19:23:18.904
fdbd9665-ce43-443d-89c3-9a48e2129504	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l2-ex2	10	{"answer": "too", "correct": true}	2026-05-07 19:23:30.613
95eea040-2ced-4eea-894f-2eea0d83c8f6	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l3-ex1	10	{"answer": "12", "correct": true}	2026-05-07 19:23:39.984
seed-cohort-sub-1-a1-seed-en-a1-l1-ex1	seed-cohort-student-1	seed-en-a1-l1-ex1	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-bulk-submission-student-5-2	a4ed5ec9-d376-41a2-8afb-fe53e494500e	seed-bulk-course-3-lesson-1-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.391
seed-bulk-submission-student-5-3	a4ed5ec9-d376-41a2-8afb-fe53e494500e	seed-bulk-course-3-lesson-2-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.392
seed-bulk-submission-student-6-1	3b180a56-18e5-4a7e-913f-1dfa2ea1557b	seed-bulk-course-3-lesson-2-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.393
seed-bulk-submission-student-6-2	3b180a56-18e5-4a7e-913f-1dfa2ea1557b	seed-bulk-course-3-lesson-3-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.394
seed-bulk-submission-student-6-3	3b180a56-18e5-4a7e-913f-1dfa2ea1557b	seed-bulk-course-3-lesson-3-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.397
seed-bulk-submission-student-7-1	937659aa-d221-4720-b41c-c410cbad03fe	seed-bulk-course-4-lesson-1-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.399
seed-bulk-submission-student-7-2	937659aa-d221-4720-b41c-c410cbad03fe	seed-bulk-course-4-lesson-1-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.401
seed-bulk-submission-student-7-3	937659aa-d221-4720-b41c-c410cbad03fe	seed-bulk-course-4-lesson-2-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.402
seed-bulk-submission-student-8-1	200d4cc2-567b-478a-aadd-1a1b6c6a3de2	seed-bulk-course-4-lesson-2-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.404
seed-bulk-submission-student-8-2	200d4cc2-567b-478a-aadd-1a1b6c6a3de2	seed-bulk-course-4-lesson-3-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.406
seed-bulk-submission-student-8-3	200d4cc2-567b-478a-aadd-1a1b6c6a3de2	seed-bulk-course-4-lesson-3-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.408
seed-bulk-submission-student-9-1	d7811cc8-33e3-4334-873e-cc79c799253f	seed-bulk-course-5-lesson-1-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.409
seed-bulk-submission-student-9-2	d7811cc8-33e3-4334-873e-cc79c799253f	seed-bulk-course-5-lesson-1-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.41
seed-bulk-submission-student-9-3	d7811cc8-33e3-4334-873e-cc79c799253f	seed-bulk-course-5-lesson-2-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.411
seed-bulk-submission-student-10-1	c396b5e6-3de5-4f8f-8102-213b5bba6f77	seed-bulk-course-5-lesson-2-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.414
seed-bulk-submission-student-10-2	c396b5e6-3de5-4f8f-8102-213b5bba6f77	seed-bulk-course-5-lesson-3-exercise-1	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.416
seed-bulk-submission-student-10-3	c396b5e6-3de5-4f8f-8102-213b5bba6f77	seed-bulk-course-5-lesson-3-exercise-2	10	{"seed": true, "answer": "model-answer", "correct": true}	2026-05-27 15:12:03.417
seed-cohort-sub-2-b1-seed-en-b1-l2-ex1	seed-cohort-student-2	seed-en-b1-l2-ex1	10	{"answer": "I'm not sure I fully agree", "cohort": true, "correct": true}	2026-05-28 09:00:00
seed-cohort-sub-3-b1-seed-en-b1-l1-ex1	seed-cohort-student-3	seed-en-b1-l1-ex1	10	{"answer": "agenda", "cohort": true, "correct": true}	2026-05-26 09:00:00
\.


--
-- TOC entry 5075 (class 0 OID 32877)
-- Dependencies: 253
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_code) FROM stdin;
5710ecb0-6b4b-415f-aae6-325ef368540a	TEACHER
e1ad91ad-7a95-4176-8659-d246165ecdb4	STUDENT
4bcdde6c-d826-4f7e-af82-44b411e1a294	STUDENT
0efe9852-f538-43ab-bb6b-cae9e0cc22d8	STUDENT
7c0d2167-b11f-4fe3-99a3-e6d1de0df963	TEACHER
5b99cf3d-d2ac-4648-a42a-40c67a907717	TEACHER
99a60528-98df-444f-98ee-c690f84830f9	STUDENT
1a79209a-2bb4-4858-93ac-b016e794426f	STUDENT
44e4ca79-1a2e-4811-a7ec-70305fde9277	TEACHER
a9b6a77e-b307-4be4-9dcf-b09a71c137c5	TEACHER
1237e3df-d4e4-4b1f-a396-ec9d7d3a4123	STUDENT
75596e21-ccf1-4e77-912e-5e842f256dd1	TEACHER
a88406e7-62c0-4dd0-abe2-a1d4723eded7	STUDENT
5f5b65d7-b202-4d0b-888e-6d83d10fe69e	STUDENT
8353d1d0-c1c7-4455-94f6-ed505db1aecc	TEACHER
57ecfdd9-95ba-46e5-b999-5939314ef3ea	STUDENT
75acde4b-8101-47c6-af43-c31c6f973d7c	TEACHER
b82b4e3a-013b-46d8-8961-2e0eb889af9e	STUDENT
6209e616-f775-42c3-a787-58f9dd9b723b	TEACHER
c63d56be-7975-4466-b991-734bf22edc0f	STUDENT
1c34082c-acf5-495f-9be3-684f86d958cd	TEACHER
8796334d-2a75-42b6-80d3-00400866b04e	STUDENT
seed-cohort-student-1	STUDENT
seed-cohort-student-2	STUDENT
seed-cohort-student-3	STUDENT
seed-cohort-student-4	STUDENT
seed-cohort-student-5	STUDENT
seed-cohort-student-6	STUDENT
6bcc0a12-ed38-4e4b-97b9-69195af8c801	TEACHER
4694fa51-5551-4043-ae3a-1188b07a5b74	STUDENT
0f4d4d9d-176c-422f-b17e-c415d960e641	TEACHER
a87d5116-fab5-430b-90f9-bdbea2721413	STUDENT
34a953be-2f79-4303-9b6a-f9855c301ef9	TEACHER
298bc462-8954-45cc-81a5-9b72a5ef9ec1	STUDENT
63055ce4-af28-4222-bac6-74a844a18dc3	TEACHER
d6c1c8a0-0c0b-4d41-a68a-e141ed68dabe	STUDENT
d0539db0-4a20-442d-bcb1-8923c87dba5d	TEACHER
489b674c-ad2d-4b11-8fe6-01b81208de37	STUDENT
c741d4bb-6c6d-4580-b844-f67c9d1e4a67	TEACHER
3535dea8-538c-476a-8be4-fed50a4e3507	STUDENT
1db3af6d-059f-4e97-af32-602f947adc9d	TEACHER
4dffb388-8c28-4372-a729-c485b159837d	STUDENT
89c903ae-97fd-408f-ac99-750fe21be5e3	TEACHER
38fcb782-1031-4fc5-af73-c22ff65eb143	STUDENT
d18fea24-e53c-4793-b907-46fadaee220a	STUDENT
b72345ff-fa23-4438-b76c-6f0197eba962	TEACHER
70573aa7-21e9-4e58-a98e-6000fff8599c	TEACHER
cab8b56c-98cd-41b4-9ab1-895cdb4d8bee	STUDENT
a7a5961e-97a4-46d5-8036-1262381ad5f6	TEACHER
f16e5210-2b06-4110-a8a1-5ae9350997cf	STUDENT
16763169-c947-4ced-a673-26069496c8b7	TEACHER
853fce3b-ffbd-45fb-b46c-082cacfddb00	STUDENT
e5f37efb-2d0b-44da-a224-270e7261425f	TEACHER
916fa656-217c-4c9f-b238-3961af928898	STUDENT
adfe57e9-9c30-4100-b406-6a4347f216bb	TEACHER
e121b451-ca46-4505-b500-88929d5f2b02	STUDENT
371f8e8a-69df-4ec8-aac4-2a2eceb23dfb	STUDENT
ec47cc44-6274-4d50-a9c1-6c9bf339eafb	STUDENT
fa576b75-3be7-456e-8c13-92560a68c42f	STUDENT
a4ed5ec9-d376-41a2-8afb-fe53e494500e	STUDENT
3b180a56-18e5-4a7e-913f-1dfa2ea1557b	STUDENT
937659aa-d221-4720-b41c-c410cbad03fe	STUDENT
200d4cc2-567b-478a-aadd-1a1b6c6a3de2	STUDENT
d7811cc8-33e3-4334-873e-cc79c799253f	STUDENT
c396b5e6-3de5-4f8f-8102-213b5bba6f77	STUDENT
bd84e05c-985f-4fc8-9912-290091f2ceb7	TEACHER
a29321fb-3fba-424d-b7ce-1b274190dccc	STUDENT
7305fce2-09bc-4c08-bacb-0ae967a5e301	TEACHER
b225fb5b-11f1-48ef-9f2f-ae81d9a51dc5	STUDENT
63b2c40b-65a6-45a0-8c35-6cb551cd52fb	TEACHER
c3506675-0e47-4d76-9cc0-cd272fe66818	STUDENT
\.


--
-- TOC entry 5074 (class 0 OID 32863)
-- Dependencies: 252
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, name, created_at, updated_at) FROM stdin;
5710ecb0-6b4b-415f-aae6-325ef368540a	teacher@vsvh.local	$2b$10$MLpv19WIIlIFQkMWKWReAOa57NNpaZju6OP7bwIIrJhSknsMS85m.	Demo Teacher	2026-04-12 18:22:24.245	2026-04-12 18:22:24.245
e1ad91ad-7a95-4176-8659-d246165ecdb4	student@vsvh.local	$2b$10$MLpv19WIIlIFQkMWKWReAOa57NNpaZju6OP7bwIIrJhSknsMS85m.	Demo Student	2026-04-12 18:22:24.263	2026-04-12 18:22:24.263
4bcdde6c-d826-4f7e-af82-44b411e1a294	e2e@vsvh.local	$2b$10$.678TKT7LuQn5D4CnP6xpOe7ZRR/mj6Wum4k68DHPMFgc1p0VsqTm	E	2026-04-12 18:27:22.367	2026-04-12 18:27:22.367
0efe9852-f538-43ab-bb6b-cae9e0cc22d8	e2e-20260412212734@vsvh.local	$2b$10$Y/KUIIllVqWeZyj8qBo7p.VXg6iR9aJ/YdRd30fI0kWRLVdznazmS	E2E User	2026-04-12 18:27:34.821	2026-04-12 18:27:34.821
7c0d2167-b11f-4fe3-99a3-e6d1de0df963	teacher-e2e-1460061221@vsvh.local	$2b$10$QRXU8.kSJpPcNyNnaLzNceHhZPHRY6rhyE9W6Ye3Gwi/bJOfVCJ9e	T	2026-04-12 18:27:35.162	2026-04-12 18:27:35.162
5b99cf3d-d2ac-4648-a42a-40c67a907717	sfafqwa@gmail.com	$2b$10$rH1OVNG9ePD9KGfeSwiicO6rytNdwIRq9DZeNL4vGkNAnYmwk9j5O	Вадим	2026-04-17 08:16:50.254	2026-04-17 08:16:50.254
99a60528-98df-444f-98ee-c690f84830f9	slava@gmail.com	$2b$10$OVjwdBi.M7qRN6DOH4C2JuX3KA9HsX5mnx.8mqlWtH5GiOL0HVkv2	Слава	2026-04-17 08:34:43.191	2026-04-17 08:34:43.191
1a79209a-2bb4-4858-93ac-b016e794426f	slavick.voronoff2016@gmail.com	$2b$10$NHQosZPE.ko.DRowy.QqVeXm96m7KVbNnJd8UbtYoQXGFJFRXgkWm	Слава	2026-04-21 19:52:49.14	2026-04-21 19:52:49.14
44e4ca79-1a2e-4811-a7ec-70305fde9277	voronoff.igor2016@gmail.com	$2b$10$DRpU7EYIYE7dvJiVrBPRsebN1DXfqSSyZ2c9lkedeoD1GxonGmxd2	Игорь	2026-04-21 20:09:50.019	2026-04-21 20:09:50.019
a9b6a77e-b307-4be4-9dcf-b09a71c137c5	it-teacher-1777068472956@example.com	$2b$10$zN.gU0qJ0pocn6SLTSYFqOfG4dTI0ialT2uKkwZNv0nDLk0kodTT.	Integration Teacher	2026-04-24 22:07:53.402	2026-04-24 22:07:53.402
1237e3df-d4e4-4b1f-a396-ec9d7d3a4123	it-student-1777068473547@example.com	$2b$10$lBTpTD5LtLDJ9tgEuikJLOWPNz3.F/UeJBNFblVY9j4nuaOGs/0Aa	Integration Student	2026-04-24 22:07:53.637	2026-04-24 22:07:53.637
75596e21-ccf1-4e77-912e-5e842f256dd1	it-teacher-1777068502463@example.com	$2b$10$.WQPzeXnawkc9dxtlxcMluzbXHZoj3mOgj58kZsBTNaYQmuufxoWm	Integration Teacher	2026-04-24 22:08:22.804	2026-04-24 22:08:22.804
a88406e7-62c0-4dd0-abe2-a1d4723eded7	it-student-1777068502895@example.com	$2b$10$kPv5Kki8zEWxii.CrjiTDOEkmBrLH6ABjRG.XLLEOIy/3eoM9JLTS	Integration Student	2026-04-24 22:08:22.972	2026-04-24 22:08:22.972
5f5b65d7-b202-4d0b-888e-6d83d10fe69e	slavick@gmail.com	$2b$10$II3Za9Cgr97WBq.YQBiqAeda62cDWHK5lr091dT9CmQRJ8mUslNm6	Slava	2026-04-24 22:16:17.051	2026-04-24 22:16:17.051
8353d1d0-c1c7-4455-94f6-ed505db1aecc	it-teacher-1777069322485@example.com	$2b$10$wYux/h3hedXm7qzuW03YheOv.CyM4V7Qmu3gGLUuHNdliSd2Vp9Ha	Integration Teacher	2026-04-24 22:22:02.809	2026-04-24 22:22:02.809
57ecfdd9-95ba-46e5-b999-5939314ef3ea	it-student-1777069322894@example.com	$2b$10$js3BIiZwAZD/sQR3GiGdfOnKmOC.Zi0K/crtU7.RB9ZiUnvC5wzGi	Integration Student	2026-04-24 22:22:02.969	2026-04-24 22:22:02.969
75acde4b-8101-47c6-af43-c31c6f973d7c	elena.morozova@vsvh.demo	$2b$10$UftxOSMIXUXILr4POlGmnOsfAn0rzX4xAdDuZ9sA4X5liw6V8y4sK	Елена Морозова	2026-04-24 22:26:25.134	2026-04-24 22:26:25.134
b82b4e3a-013b-46d8-8961-2e0eb889af9e	ivan.volkov@vsvh.demo	$2b$10$fFf7M8s8ZlSa3evOwML0L.l/x9bUfmACUc66DGVOPcPmDiio1uu76	Иван Волков	2026-04-24 22:26:25.214	2026-04-24 22:26:25.214
6209e616-f775-42c3-a787-58f9dd9b723b	it-teacher-1777070151841@example.com	$2b$10$Fss4bfIFCtDWALTm/NNCbuG1w8Tkw.8q2XUOitn56rhgKg8y0et1O	Integration Teacher	2026-04-24 22:35:52.06	2026-04-24 22:35:52.06
c63d56be-7975-4466-b991-734bf22edc0f	it-student-1777070152144@example.com	$2b$10$tb0d/7U1.k7HzgKQm2w8JOjTONxz85X.z1a7HBzlrZGSFdjx3J8rS	Integration Student	2026-04-24 22:35:52.232	2026-04-24 22:35:52.232
1c34082c-acf5-495f-9be3-684f86d958cd	qa-teacher-1777633956066@example.com	$2b$10$Rh4mM.K0GW.zYJVPdpPYX.I0g4zQJlKNxDTYNO/HJ3saekkNm8MLS	QA Teacher	2026-05-01 11:12:36.397	2026-05-01 11:12:36.397
8796334d-2a75-42b6-80d3-00400866b04e	qa-student-1777633956066@example.com	$2b$10$NqCa8ISzkikgsv39clXCXelCBXdbVg1c4UhL/UnZxPTRykWUa2Hny	QA Student Updated	2026-05-01 11:12:36.6	2026-05-01 11:12:38.79
seed-cohort-student-1	seed-cohort-student-1@vsvh.demo	$2b$10$nf22iZLrJJ1R16X13CtgYOoy2OXnPsHKSvCO7s306HH/kFNraljHa	Анна Петрова	2026-05-01 11:38:50.042	2026-05-01 11:38:50.042
seed-cohort-student-2	seed-cohort-student-2@vsvh.demo	$2b$10$X7w64CEzObPOXWxvJB5.D.pcsYA7hYU9r.8MSR4GqKGiTINKj9sRe	Сергей Соколов	2026-05-01 11:38:50.114	2026-05-01 11:38:50.114
seed-cohort-student-3	seed-cohort-student-3@vsvh.demo	$2b$10$RofhnVBgJTP7VKT3N.6exebTKZtAqg0aZN5QeHF.lgQVwogJK6nvu	Мария Кузнецова	2026-05-01 11:38:50.184	2026-05-01 11:38:50.184
seed-cohort-student-4	seed-cohort-student-4@vsvh.demo	$2b$10$rT5bUueViPbzUcyFoFFw.ebL3hPQ6YCTkRBApEqhyC5/330C6GmEe	Дмитрий Орлов	2026-05-01 11:38:50.253	2026-05-01 11:38:50.253
seed-cohort-student-5	seed-cohort-student-5@vsvh.demo	$2b$10$KFEbIDH8mr7VcxnyugbApOiPBVpCrt.wr7e2YNphJOZSXAYg1Kpai	Ольга Соловьёва	2026-05-01 11:38:50.324	2026-05-01 11:38:50.324
seed-cohort-student-6	seed-cohort-student-6@vsvh.demo	$2b$10$7nOD5EGNS/a95LAG.IYHnOq6p9lWJufN3InIjt2U8XiyxRBtowEni	Никита Лебедев	2026-05-01 11:38:50.393	2026-05-01 11:38:50.393
6bcc0a12-ed38-4e4b-97b9-69195af8c801	it-teacher-1777635609392@example.com	$2b$10$bUopZWZBzJkNVIJO34inPeIOCXzdZJKMhvbIpB4NtCUDl7zMKP5Q.	Integration Teacher	2026-05-01 11:40:09.847	2026-05-01 11:40:09.847
4694fa51-5551-4043-ae3a-1188b07a5b74	it-student-1777635609948@example.com	$2b$10$svwjNVJVStyfiuEOv18Vm.rWx/LxaDOA4GY0D9jz4eUK.UwqC5JBG	Integration Student	2026-05-01 11:40:10.023	2026-05-01 11:40:10.023
0f4d4d9d-176c-422f-b17e-c415d960e641	it-teacher-1778180475981@example.com	$2b$10$LHIWrd7NN0GwYsPRgTmTJ.XG4hTW5OOltowcZRAzbhMTFIbeqgW/a	Integration Teacher	2026-05-07 19:01:16.394	2026-05-07 19:01:16.394
a87d5116-fab5-430b-90f9-bdbea2721413	it-student-1778180476570@example.com	$2b$10$LoK76EzAI8RAO2j7fbcYh.I24M3QnGClaoczF7gTUbeWtkX0WWVdi	Integration Student	2026-05-07 19:01:16.65	2026-05-07 19:01:16.65
34a953be-2f79-4303-9b6a-f9855c301ef9	it-teacher-1778180932727@example.com	$2b$10$uuElgPT6KSLoBKVKg8Y5H.vo2Ixj2t6IajSnUs2Ot6lBTLs/6OobW	Integration Teacher	2026-05-07 19:08:53.107	2026-05-07 19:08:53.107
298bc462-8954-45cc-81a5-9b72a5ef9ec1	it-student-1778180933343@example.com	$2b$10$HqlOGhHw0oJPb5qnzUqZaeC/MQxbxDzPHbzsBSZYVHZw.2fxgCDyG	Integration Student	2026-05-07 19:08:53.457	2026-05-07 19:08:53.457
63055ce4-af28-4222-bac6-74a844a18dc3	it-teacher-1778181008004@example.com	$2b$10$DfDljaU1mYQTf2GUavyYgeFWf0KJsx5U14xqwF4gTez0Ub84bA5Yq	Integration Teacher	2026-05-07 19:10:08.333	2026-05-07 19:10:08.333
d6c1c8a0-0c0b-4d41-a68a-e141ed68dabe	it-student-1778181008493@example.com	$2b$10$xCtnGrtknyfDIzwgQHkHDuFna457.hAxdT0rxhpvPfJ/BJb.yI4EK	Integration Student	2026-05-07 19:10:08.571	2026-05-07 19:10:08.571
d0539db0-4a20-442d-bcb1-8923c87dba5d	it-teacher-1778181041434@example.com	$2b$10$kBI80ym9xZvamttT7/qzUOlKq5xe6EY9s04.s.7SzGd5H35k362bW	Integration Teacher	2026-05-07 19:10:41.654	2026-05-07 19:10:41.654
489b674c-ad2d-4b11-8fe6-01b81208de37	it-student-1778181041807@example.com	$2b$10$50uJCv7JxuL9/Sv03kXwsepmL3LiJcAAN4hApb4JOQ1sqmoMRFjVK	Integration Student	2026-05-07 19:10:41.886	2026-05-07 19:10:41.886
c741d4bb-6c6d-4580-b844-f67c9d1e4a67	it-teacher-1778182500763@example.com	$2b$10$6TdfGvb9vn3s6Ajkfiln6OKB.ltM2DLpug74PySRnxBJAZtAV0Q6m	Integration Teacher	2026-05-07 19:35:00.98	2026-05-07 19:35:00.98
3535dea8-538c-476a-8be4-fed50a4e3507	it-student-1778182501168@example.com	$2b$10$M/g945AEDqVfzWLPs0j9ouIqtp4nohm0tKT4EveQ9HDXu9OHPHJWa	Integration Student	2026-05-07 19:35:01.26	2026-05-07 19:35:01.26
1db3af6d-059f-4e97-af32-602f947adc9d	it-teacher-1778184436626@example.com	$2b$10$Ap4umxkaJmhr1v5mmfYWpOS/CH/mct8jHRUtKzOGPXlh5ZL0qhyai	Integration Teacher	2026-05-07 20:07:17.013	2026-05-07 20:07:17.013
4dffb388-8c28-4372-a729-c485b159837d	it-student-1778184437323@example.com	$2b$10$t9m32A38lOnEUVWqvzNaWeKJDzJR5b8FbWa5YeAQ..sFpK8vp125S	Integration Student	2026-05-07 20:07:17.458	2026-05-07 20:07:17.458
89c903ae-97fd-408f-ac99-750fe21be5e3	it-teacher-1778184590042@example.com	$2b$10$i7TG9R6QppVNUbkOdU691OrtY0klnMGP6Y7ula70RmHTgWonyP3v6	Integration Teacher	2026-05-07 20:09:50.291	2026-05-07 20:09:50.291
38fcb782-1031-4fc5-af73-c22ff65eb143	it-student-1778184590519@example.com	$2b$10$jaDDKWpbDzELaCUfhNN5GOkXShYFbS0vPQRnj5.qY1Bh1VI3HE3Te	Integration Student	2026-05-07 20:09:50.648	2026-05-07 20:09:50.648
d18fea24-e53c-4793-b907-46fadaee220a	1@gmail.com	$2b$10$n42nq7iw2YIriWhPBOUAUOEqKPmhW87s6Lt3EHkyOvQZKx1nIi30S	2525aVy	2026-05-25 10:52:23.049	2026-05-25 10:52:23.049
b72345ff-fa23-4438-b76c-6f0197eba962	teacher@gmail.com	$2b$10$iRDYlK/AmfQpw0MhvEKceeMevt0XT8VWFodBQ4BToc3PcfLhmQdRK	ap[gja[sgjaw[ej	2026-05-25 10:54:33.696	2026-05-25 10:54:33.696
70573aa7-21e9-4e58-a98e-6000fff8599c	it-teacher-1779817170287@example.com	$2b$10$YsUcJ/ZIZ8QljBLudr8hOOaLFqHkbfOPA3efG6loBOsHUoWeCqFO2	Integration Teacher	2026-05-26 17:39:30.677	2026-05-26 17:39:30.677
cab8b56c-98cd-41b4-9ab1-895cdb4d8bee	it-student-1779817170881@example.com	$2b$10$SNLS.oO3l5j7YqBAXBxxn.DoUd22Vv66g6a6Z9fw8CE0SiUeXZGZy	Integration Student	2026-05-26 17:39:30.97	2026-05-26 17:39:30.97
a7a5961e-97a4-46d5-8036-1262381ad5f6	it-teacher-1779827134226@example.com	$2b$10$5RLX/iTh2KMbJbovamfEse76eYutbM6SOilDnjbOLhl7Arpzik9P2	Integration Teacher	2026-05-26 20:25:34.614	2026-05-26 20:25:34.614
f16e5210-2b06-4110-a8a1-5ae9350997cf	it-student-1779827134813@example.com	$2b$10$Mqk1sL88BXhKfqjIyYYA..He5nPJojI1PdlYDOAdwkpECqibFwTH.	Integration Student	2026-05-26 20:25:34.9	2026-05-26 20:25:34.9
16763169-c947-4ced-a673-26069496c8b7	it-teacher-1779894021177@example.com	$2b$10$kjrS8GPRXKNVh29Fs0hrxuJVOmTdjgMvEi1b09K7ZFntcXi8Q2aHq	Integration Teacher	2026-05-27 15:00:21.667	2026-05-27 15:00:21.667
853fce3b-ffbd-45fb-b46c-082cacfddb00	it-student-1779894021851@example.com	$2b$10$aDz4vzSGjABx.sGmMd169erJnrhTloO7xxdxvjz1YeyGZEcfux0hO	Integration Student	2026-05-27 15:00:21.934	2026-05-27 15:00:21.934
e5f37efb-2d0b-44da-a224-270e7261425f	it-teacher-1779894525131@example.com	$2b$10$1hAGUvPBfw6aAXVwjaJBVubqbuoYtBrJ4WaBRIwmuRq4BAKqqhpQS	Integration Teacher	2026-05-27 15:08:45.362	2026-05-27 15:08:45.362
916fa656-217c-4c9f-b238-3961af928898	it-student-1779894525552@example.com	$2b$10$GYDMJF.KBWnAUbdGTBTt8umYJ/dZjreVxtkR/IxmjGH3fwm96txUG	Integration Student	2026-05-27 15:08:45.633	2026-05-27 15:08:45.633
adfe57e9-9c30-4100-b406-6a4347f216bb	seed.bulk.teacher@vsvh.demo	$2b$10$H7MBTMjg65CieARKp2cIxe7DTX6udI/fxaOr2mX/IOq.etxm1OqKe	Seed Bulk Teacher	2026-05-27 15:12:02.301	2026-05-27 15:12:02.301
e121b451-ca46-4505-b500-88929d5f2b02	seed.bulk.student1@vsvh.demo	$2b$10$tTTk80npgPF2P.Ll7EHgQeFrG6kaGphjELhVsXkCsuCbOJbC2Gy2G	Seed Student 1	2026-05-27 15:12:02.374	2026-05-27 15:12:02.374
371f8e8a-69df-4ec8-aac4-2a2eceb23dfb	seed.bulk.student2@vsvh.demo	$2b$10$1luulyJv0b/yd1VV26FrYe2BPdIhvcbpeZwiJLf8YrQXBkCF1NdJe	Seed Student 2	2026-05-27 15:12:02.443	2026-05-27 15:12:02.443
ec47cc44-6274-4d50-a9c1-6c9bf339eafb	seed.bulk.student3@vsvh.demo	$2b$10$q2OU9EyvMa6c3oa9KnnL2eKOVDJVrT99td8UouINPKbUdEmUcNYu2	Seed Student 3	2026-05-27 15:12:02.513	2026-05-27 15:12:02.513
fa576b75-3be7-456e-8c13-92560a68c42f	seed.bulk.student4@vsvh.demo	$2b$10$.wfhuX2SamSHfBMrCWNycelU.2Lxml1Ja95uC7ovZOaY..dU9HaCK	Seed Student 4	2026-05-27 15:12:02.581	2026-05-27 15:12:02.581
a4ed5ec9-d376-41a2-8afb-fe53e494500e	seed.bulk.student5@vsvh.demo	$2b$10$qZsQvSD2mNofvErmNCAAwuvn.u0WaPK51PQDHPLYiXV3NYC38QawW	Seed Student 5	2026-05-27 15:12:02.65	2026-05-27 15:12:02.65
3b180a56-18e5-4a7e-913f-1dfa2ea1557b	seed.bulk.student6@vsvh.demo	$2b$10$btVjrCtHjuIcz8D.vEvwq.QZ7GVaJI/JCgVXwKfs3xy8X/nqeb5DG	Seed Student 6	2026-05-27 15:12:02.719	2026-05-27 15:12:02.719
937659aa-d221-4720-b41c-c410cbad03fe	seed.bulk.student7@vsvh.demo	$2b$10$GQYWkFS.PHyAbDuw8LO1nuBa1B7leTksP6lfeT5ZqUQGGXPnrd8.K	Seed Student 7	2026-05-27 15:12:02.787	2026-05-27 15:12:02.787
200d4cc2-567b-478a-aadd-1a1b6c6a3de2	seed.bulk.student8@vsvh.demo	$2b$10$E2HhFlp7yJd4CSCVO26ptOh6t4bPSBy/klb/K0ny.O23nIgyacVDi	Seed Student 8	2026-05-27 15:12:02.857	2026-05-27 15:12:02.857
d7811cc8-33e3-4334-873e-cc79c799253f	seed.bulk.student9@vsvh.demo	$2b$10$rWozlHmIZVTpArCJUntZ/uwuckpBuW3J5niwXktS.htsG9Dv3ojWK	Seed Student 9	2026-05-27 15:12:02.927	2026-05-27 15:12:02.927
c396b5e6-3de5-4f8f-8102-213b5bba6f77	seed.bulk.student10@vsvh.demo	$2b$10$vaUjzTyuazckReYE4pQB0OPlOclTnyvPetLUvUONKB1UW4KQNhTrW	Seed Student 10	2026-05-27 15:12:02.998	2026-05-27 15:12:02.998
bd84e05c-985f-4fc8-9912-290091f2ceb7	it-teacher-1779894933987@example.com	$2b$10$NzTD9jE42ofDmncJy2jTKuQSWNVX5lHoKK5M8dAtb61uHwvEcUArS	Integration Teacher	2026-05-27 15:15:34.299	2026-05-27 15:15:34.299
a29321fb-3fba-424d-b7ce-1b274190dccc	it-student-1779894934539@example.com	$2b$10$M.JWCwRb713qlakdWDU70uf4PsRCF7AExO.ueTNwxcmnbSJsbK6Qa	Integration Student	2026-05-27 15:15:34.615	2026-05-27 15:15:34.615
7305fce2-09bc-4c08-bacb-0ae967a5e301	it-teacher-1779895055324@example.com	$2b$10$QRpboxrlDJet2o9xe/iuRuGEbTYwRL7iCGDVFh.BYjc3hm5RNJsr.	Integration Teacher	2026-05-27 15:17:35.651	2026-05-27 15:17:35.651
b225fb5b-11f1-48ef-9f2f-ae81d9a51dc5	it-student-1779895055844@example.com	$2b$10$LsecG2dBC.qLDT7Ka89og.4HfbszIecxlTLKNqymgN1Vp5Y0kuNim	Integration Student	2026-05-27 15:17:35.928	2026-05-27 15:17:35.928
63b2c40b-65a6-45a0-8c35-6cb551cd52fb	it-teacher-1779896338970@example.com	$2b$10$DOMldTRZ11cJ/ghsbKBsC.9Spo8y/gD38YEaywp.SuJFlr28zXciy	Integration Teacher	2026-05-27 15:38:59.318	2026-05-27 15:38:59.318
c3506675-0e47-4d76-9cc0-cd272fe66818	it-student-1779896339526@example.com	$2b$10$5Jp68LRl.YE1mp12Qb/K5.Le.xK1oetFb16Ubdn18C7bTR59s18fK	Integration Student	2026-05-27 15:38:59.604	2026-05-27 15:38:59.604
\.


--
-- TOC entry 4863 (class 2606 OID 32838)
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 4895 (class 2606 OID 32990)
-- Name: certificates certificates_document_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_document_number_key UNIQUE (document_number);


--
-- TOC entry 4897 (class 2606 OID 32988)
-- Name: certificates certificates_enrollment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_enrollment_id_key UNIQUE (enrollment_id);


--
-- TOC entry 4899 (class 2606 OID 32986)
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- TOC entry 4882 (class 2606 OID 32933)
-- Name: course_reviews course_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4876 (class 2606 OID 32917)
-- Name: course_staff course_staff_course_id_user_id_staff_role_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_staff
    ADD CONSTRAINT course_staff_course_id_user_id_staff_role_key UNIQUE (course_id, user_id, staff_role);


--
-- TOC entry 4878 (class 2606 OID 32915)
-- Name: course_staff course_staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_staff
    ADD CONSTRAINT course_staff_pkey PRIMARY KEY (id);


--
-- TOC entry 4872 (class 2606 OID 32902)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 4892 (class 2606 OID 32974)
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 4889 (class 2606 OID 32959)
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (id);


--
-- TOC entry 4904 (class 2606 OID 33028)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 4886 (class 2606 OID 32946)
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- TOC entry 4907 (class 2606 OID 33041)
-- Name: reminders reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_pkey PRIMARY KEY (id);


--
-- TOC entry 4865 (class 2606 OID 32862)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (code);


--
-- TOC entry 4901 (class 2606 OID 33016)
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4870 (class 2606 OID 32885)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_code);


--
-- TOC entry 4868 (class 2606 OID 32876)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4880 (class 1259 OID 33048)
-- Name: course_reviews_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX course_reviews_course_id_idx ON public.course_reviews USING btree (course_id);


--
-- TOC entry 4883 (class 1259 OID 33043)
-- Name: course_reviews_user_id_course_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX course_reviews_user_id_course_id_key ON public.course_reviews USING btree (user_id, course_id);


--
-- TOC entry 4874 (class 1259 OID 33047)
-- Name: course_staff_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX course_staff_course_id_idx ON public.course_staff USING btree (course_id);


--
-- TOC entry 4879 (class 1259 OID 33150)
-- Name: course_staff_user_id_staff_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX course_staff_user_id_staff_role_idx ON public.course_staff USING btree (user_id, staff_role);


--
-- TOC entry 4873 (class 1259 OID 33049)
-- Name: courses_rating_average_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX courses_rating_average_idx ON public.courses USING btree (rating_average);


--
-- TOC entry 4890 (class 1259 OID 33146)
-- Name: enrollments_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX enrollments_course_id_idx ON public.enrollments USING btree (course_id);


--
-- TOC entry 4893 (class 1259 OID 33044)
-- Name: enrollments_user_id_course_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX enrollments_user_id_course_id_key ON public.enrollments USING btree (user_id, course_id);


--
-- TOC entry 4887 (class 1259 OID 33148)
-- Name: exercises_lesson_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX exercises_lesson_id_idx ON public.exercises USING btree (lesson_id);


--
-- TOC entry 4905 (class 1259 OID 33046)
-- Name: favorites_user_id_course_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX favorites_user_id_course_id_key ON public.favorites USING btree (user_id, course_id);


--
-- TOC entry 4884 (class 1259 OID 33147)
-- Name: lessons_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lessons_course_id_idx ON public.lessons USING btree (course_id);


--
-- TOC entry 4902 (class 1259 OID 33149)
-- Name: submissions_user_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX submissions_user_id_created_at_idx ON public.submissions USING btree (user_id, created_at DESC);


--
-- TOC entry 4866 (class 1259 OID 33042)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 4918 (class 2606 OID 33100)
-- Name: certificates certificates_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4912 (class 2606 OID 33075)
-- Name: course_reviews course_reviews_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4913 (class 2606 OID 33070)
-- Name: course_reviews course_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4910 (class 2606 OID 33060)
-- Name: course_staff course_staff_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_staff
    ADD CONSTRAINT course_staff_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4911 (class 2606 OID 33065)
-- Name: course_staff course_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_staff
    ADD CONSTRAINT course_staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4916 (class 2606 OID 33095)
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4917 (class 2606 OID 33090)
-- Name: enrollments enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4915 (class 2606 OID 33085)
-- Name: exercises exercises_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4921 (class 2606 OID 33130)
-- Name: favorites favorites_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4922 (class 2606 OID 33125)
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4914 (class 2606 OID 33080)
-- Name: lessons lessons_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4923 (class 2606 OID 33140)
-- Name: reminders reminders_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4924 (class 2606 OID 33135)
-- Name: reminders reminders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4919 (class 2606 OID 33120)
-- Name: submissions submissions_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4920 (class 2606 OID 33115)
-- Name: submissions submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4908 (class 2606 OID 33055)
-- Name: user_roles user_roles_role_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_code_fkey FOREIGN KEY (role_code) REFERENCES public.roles(code) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4909 (class 2606 OID 33050)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-06-01 11:04:57

--
-- PostgreSQL database dump complete
--

\unrestrict 6ocCKcGsgYcziJkOswbWseeZWBcnOLS9zHTcinMy3bFFbBcv5kdX9OUEyum8bEz

