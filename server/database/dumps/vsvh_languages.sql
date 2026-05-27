--
-- PostgreSQL database dump
--

\restrict cBwqMrsQMEnXRupFfgODUsR0iQmmtDrlqiJCzU5HMXT4hjVVrgCFH7Pfcy0WniI

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-27 01:42:23

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
-- TOC entry 898 (class 1247 OID 32848)
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
-- TOC entry 895 (class 1247 OID 32840)
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
-- TOC entry 246 (class 1259 OID 32833)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 32975)
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
-- TOC entry 252 (class 1259 OID 32918)
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
-- TOC entry 251 (class 1259 OID 32903)
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
-- TOC entry 250 (class 1259 OID 32886)
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
-- TOC entry 255 (class 1259 OID 32960)
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
-- TOC entry 254 (class 1259 OID 32947)
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
-- TOC entry 258 (class 1259 OID 33017)
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
-- TOC entry 253 (class 1259 OID 32934)
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
-- TOC entry 259 (class 1259 OID 33029)
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
-- TOC entry 247 (class 1259 OID 32857)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    code public."Role" NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 33003)
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
-- TOC entry 249 (class 1259 OID 32877)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id text NOT NULL,
    role_code public."Role" NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 32863)
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
-- TOC entry 5068 (class 0 OID 32833)
-- Dependencies: 246
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
-- TOC entry 5078 (class 0 OID 32975)
-- Dependencies: 256
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificates (id, enrollment_id, document_number, issued_at) FROM stdin;
seed-bulk-certificate-1	f69ca652-89ee-4116-9b05-824c06b467e7	VSVH-SEED-2026-0001	2026-05-01 11:38:50.838
seed-bulk-certificate-2	05a3a4dd-fbea-4a75-a729-ab8536ff12f2	VSVH-SEED-2026-0002	2026-05-01 11:38:50.841
seed-bulk-certificate-3	937a3fb3-d4ce-4847-980b-6abc3cb006df	VSVH-SEED-2026-0003	2026-05-01 11:38:50.843
seed-bulk-certificate-4	176eec5d-a975-4e9c-a669-db0efbda4e84	VSVH-SEED-2026-0004	2026-05-01 11:38:50.846
seed-bulk-certificate-5	303ea9a5-2faf-405b-80d1-d4b0ecedff59	VSVH-SEED-2026-0005	2026-05-01 11:38:50.848
seed-bulk-certificate-6	085a02cd-5841-4d11-bca0-875905d5a7e4	VSVH-SEED-2026-0006	2026-05-01 11:38:50.85
7f24b620-8fae-4afc-943e-cb74900b37c0	0916a25d-ba85-47f8-87ec-8ea6f12962ad	VSVH-2026-C9C439A3	2026-05-07 19:23:51.002
seed-cert-cohort-1-a1	e52769b8-192b-4b12-bfae-371d27645c79	VSVH-2026-COHORT-1-A1	2026-05-23 09:00:00
seed-cert-cohort-1-b1	e2e1d7c3-2de1-4080-a126-a99b2b00b712	VSVH-2026-COHORT-1-B1	2026-05-23 09:00:00
seed-cert-cohort-2-a1	11a516bb-cd3c-4c1d-9661-feb5896fb074	VSVH-2026-COHORT-2-A1	2026-05-23 09:00:00
seed-cert-cohort-2-b1	37b552c6-38de-4a2e-aee0-93c98f767164	VSVH-2026-COHORT-2-B1	2026-05-23 09:00:00
\.


--
-- TOC entry 5074 (class 0 OID 32918)
-- Dependencies: 252
-- Data for Name: course_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_reviews (id, user_id, course_id, rating, comment, created_at, updated_at) FROM stdin;
0e12590b-de11-4e9c-b8ad-0bdf50b1f18f	e1ad91ad-7a95-4176-8659-d246165ecdb4	seed-course-intro	5	Seed review for catalog minRating checks.	2026-04-12 18:40:19.874	2026-04-12 18:40:19.874
b75aad6b-27a3-4706-9464-db6816b796fb	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-a1	5	Очень понятно для старта, особенно урок про приветствия.	2026-04-24 22:26:25.27	2026-04-24 22:26:25.27
94fe1eca-e3c6-4e3f-8ca8-f26b95808d6c	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-b1	4	Полезно для созвонов; хотелось бы больше примеров писем.	2026-04-24 22:26:25.272	2026-04-24 22:26:25.272
55be0b09-a4ff-401d-9ba9-815d80fd834b	bd7f5458-d4fc-427e-90d7-dbf85d4cf41b	seed-bulk-course-1	4	Seed review for bulk course 1	2026-05-01 11:33:25.594	2026-05-01 11:33:25.594
9aa68d71-5587-4c03-93c8-a70c4f83a489	f2aa774e-fb5c-469b-9bf8-710cf58415f0	seed-bulk-course-2	5	Seed review for bulk course 2	2026-05-01 11:33:25.597	2026-05-01 11:33:25.597
6b5816fc-dead-4ecd-8b04-c22f0586da76	f3433594-e441-43a8-996a-4f9cbeb7c632	seed-bulk-course-3	4	Seed review for bulk course 3	2026-05-01 11:33:25.599	2026-05-01 11:33:25.599
b77bbc1a-4aa4-41d9-80c7-3f88250d64a6	8c59b1c5-aeef-408f-abd9-0f0480a92150	seed-bulk-course-4	5	Seed review for bulk course 4	2026-05-01 11:33:25.602	2026-05-01 11:33:25.602
2e026b63-f350-403c-bb04-b4da6c46d6a4	0083e3eb-4558-4cda-b979-156adf8274ff	seed-bulk-course-5	4	Seed review for bulk course 5	2026-05-01 11:33:25.604	2026-05-01 11:33:25.604
3205a406-1e1b-4122-9682-c77df38454d4	a7ff1105-747d-4b12-a507-a9535a9f51f0	seed-bulk-course-6	5	Seed review for bulk course 6	2026-05-01 11:33:25.606	2026-05-01 11:33:25.606
f77ae294-04a7-48f1-8f81-fe05abf94f18	fd5d0aa6-c15c-468b-81df-45fb675fad00	seed-bulk-course-7	4	Seed review for bulk course 7	2026-05-01 11:33:25.609	2026-05-01 11:33:25.609
bb057e87-0b50-4e12-8f99-100684633b1a	c4e7cafe-2491-4a88-a708-cbfbce627c75	seed-bulk-course-8	5	Seed review for bulk course 8	2026-05-01 11:33:25.612	2026-05-01 11:33:25.612
fe58ed22-ca77-44c1-9363-a9dc298cb91e	0e2700bf-d311-4d6e-80e2-a1098ff642a2	seed-bulk-course-9	4	Seed review for bulk course 9	2026-05-01 11:33:25.614	2026-05-01 11:33:25.614
23a215ff-e102-4629-9325-4c6a7249c8fa	7dbd9524-5297-4c0b-b04d-466e2743191f	seed-bulk-course-10	5	Seed review for bulk course 10	2026-05-01 11:33:25.617	2026-05-01 11:33:25.617
b7e0354c-a18c-4738-b7a6-e6b5651f9194	bd7f5458-d4fc-427e-90d7-dbf85d4cf41b	seed-bulk-course-11	4	Seed review for bulk course 11	2026-05-01 11:33:25.62	2026-05-01 11:33:25.62
cdc4b2fd-0058-4b8e-b3d6-bebd30518f4f	f2aa774e-fb5c-469b-9bf8-710cf58415f0	seed-bulk-course-12	5	Seed review for bulk course 12	2026-05-01 11:33:25.622	2026-05-01 11:33:25.622
1180a8ed-162d-4f18-929b-e6692f4a1419	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-10	3	АЫФАФЫВА	2026-05-07 19:10:02.685	2026-05-07 19:10:59.226
1ed895a6-d282-4491-bd08-7e942b3d862c	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-12	5	fqAFQWFQWFQWFWQQWFQWF	2026-05-26 17:51:52.031	2026-05-26 17:51:52.031
\.


--
-- TOC entry 5073 (class 0 OID 32903)
-- Dependencies: 251
-- Data for Name: course_staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_staff (id, course_id, user_id, staff_role, created_at) FROM stdin;
0bf71c91-468e-4b49-8225-3474096e1d08	seed-course-intro	5710ecb0-6b4b-415f-aae6-325ef368540a	TEACHER	2026-04-12 18:22:24.272
a5197889-8ae6-44d4-9a15-a802b8c96625	a8256b7b-7100-4ce0-ba7f-64877978e55a	44e4ca79-1a2e-4811-a7ec-70305fde9277	TEACHER	2026-04-21 20:13:13.312
a60a07a4-c8e3-40d9-bf83-6aeaa8000855	cae0fb98-b1e2-48ee-8db6-36923cb338a4	a9b6a77e-b307-4be4-9dcf-b09a71c137c5	TEACHER	2026-04-24 22:07:53.478
ae8ce414-a74e-4670-9f46-52a579edacb5	86fb1aec-444b-4444-a126-468c63ef1823	75596e21-ccf1-4e77-912e-5e842f256dd1	TEACHER	2026-04-24 22:08:22.845
f72cac7b-9bbe-4612-9de6-01d4048a53dd	3b8f3297-74bb-4e41-b6a0-1700d23b2fb9	8353d1d0-c1c7-4455-94f6-ed505db1aecc	TEACHER	2026-04-24 22:22:02.849
d59b608f-a4ef-4336-be39-98c20a6a9ad8	seed-course-en-a1	75acde4b-8101-47c6-af43-c31c6f973d7c	TEACHER	2026-04-24 22:26:25.23
6f19f2ac-8976-4dbf-96e6-f2cfccfb5ec0	seed-course-en-b1	75acde4b-8101-47c6-af43-c31c6f973d7c	TEACHER	2026-04-24 22:26:25.232
28ee96d9-33b4-4d32-9026-ad82898256b8	seed-course-fr-draft	75acde4b-8101-47c6-af43-c31c6f973d7c	TEACHER	2026-04-24 22:26:25.235
46d8c3e4-0f21-474d-921b-e228ef252a35	seed-course-en-a1	75acde4b-8101-47c6-af43-c31c6f973d7c	AUTHOR	2026-04-24 22:26:25.237
894aba5b-dbd7-4640-8d04-049da7e6581f	7cf7f418-39cd-4ba0-8e34-6d9ffd3e4eea	6209e616-f775-42c3-a787-58f9dd9b723b	TEACHER	2026-04-24 22:35:52.095
dcf3bac6-3848-40ca-aef2-e5f6dd3c04f0	8321371f-e4bc-4d0b-a3ba-7ddb4dd596ca	1c34082c-acf5-495f-9be3-684f86d958cd	TEACHER	2026-05-01 11:12:36.708
93ceb7f7-533b-43a2-8ffe-c7ae4aceec6e	3ad9fbd0-0ee6-44a7-9966-c2c01c01ef62	1c34082c-acf5-495f-9be3-684f86d958cd	TEACHER	2026-05-01 11:12:36.814
e4ad4097-c4bc-45bf-bdf2-6ad70fd2be2a	ec29073c-2ca4-475d-a026-e861cba8d2c9	1c34082c-acf5-495f-9be3-684f86d958cd	TEACHER	2026-05-01 11:12:36.918
aa7f8849-6b3b-4b46-a768-6c1c0e51c6b1	9f8bd517-9b42-41f0-8d9a-136f2f4a9280	1c34082c-acf5-495f-9be3-684f86d958cd	TEACHER	2026-05-01 11:12:37.004
98afa179-890a-4c43-9b0b-d844a67b1ed5	seed-bulk-course-1	bb53f571-5886-48e4-9f1a-6aa23c919f68	TEACHER	2026-05-01 11:33:25.335
e74395c9-1d00-4ee4-83d9-069bb6ec7e35	seed-bulk-course-2	bb53f571-5886-48e4-9f1a-6aa23c919f68	TEACHER	2026-05-01 11:33:25.338
217491ad-d63b-4cc4-aca0-269b926295dc	seed-bulk-course-3	bb53f571-5886-48e4-9f1a-6aa23c919f68	TEACHER	2026-05-01 11:33:25.341
1ba038d6-e2c1-43be-a19b-2696048db904	seed-bulk-course-4	bb53f571-5886-48e4-9f1a-6aa23c919f68	TEACHER	2026-05-01 11:33:25.343
35a5fde4-9df3-463f-a34b-93b2664083d7	seed-bulk-course-5	bb53f571-5886-48e4-9f1a-6aa23c919f68	TEACHER	2026-05-01 11:33:25.345
1af2485a-df7e-4a75-8aab-a5601daa977e	seed-bulk-course-6	bb53f571-5886-48e4-9f1a-6aa23c919f68	TEACHER	2026-05-01 11:33:25.348
8bef5fa4-51aa-4b1a-a1dc-54fba68caab8	seed-bulk-course-7	bb53f571-5886-48e4-9f1a-6aa23c919f68	TEACHER	2026-05-01 11:33:25.351
ad0d1372-4a50-409c-9194-0beb18c7dec7	seed-bulk-course-8	bb53f571-5886-48e4-9f1a-6aa23c919f68	TEACHER	2026-05-01 11:33:25.353
5f4d55ee-def9-47f7-bf50-460b76a587aa	seed-bulk-course-9	bb53f571-5886-48e4-9f1a-6aa23c919f68	TEACHER	2026-05-01 11:33:25.355
97e41497-7e7e-4f6e-a392-75c8fef9540d	seed-bulk-course-10	bb53f571-5886-48e4-9f1a-6aa23c919f68	TEACHER	2026-05-01 11:33:25.358
8b060f95-ba11-46d3-b66a-abe1c144e585	seed-bulk-course-11	bb53f571-5886-48e4-9f1a-6aa23c919f68	TEACHER	2026-05-01 11:33:25.36
69777686-2a8b-4477-9cc3-4c477916afca	seed-bulk-course-12	bb53f571-5886-48e4-9f1a-6aa23c919f68	TEACHER	2026-05-01 11:33:25.363
d2e9bb57-6ee7-4b53-8ad4-ea4ea0d120ce	b1c34af4-fe2d-4da2-bbc8-b135b0a11d22	6bcc0a12-ed38-4e4b-97b9-69195af8c801	TEACHER	2026-05-01 11:40:09.894
58590a00-d5a6-41e5-b4bd-aaf1b71c3ca2	a47127ef-9770-418b-9d8f-6dd108aace1d	0f4d4d9d-176c-422f-b17e-c415d960e641	TEACHER	2026-05-07 19:01:16.444
a7d50a77-ab0c-4078-a23d-990832adae82	44917bf1-3564-48e7-ada2-cce4b248a03c	34a953be-2f79-4303-9b6a-f9855c301ef9	TEACHER	2026-05-07 19:08:53.168
ec035a7c-11ec-477d-ac49-f52d2a9635c4	83f0b7b5-9299-45b7-af47-6eaf428e3fca	63055ce4-af28-4222-bac6-74a844a18dc3	TEACHER	2026-05-07 19:10:08.372
657fb1eb-9ca3-43a3-8ca6-f0a88e700b6f	cd5f596c-4469-4ca5-baeb-e18967bbefa8	d0539db0-4a20-442d-bcb1-8923c87dba5d	TEACHER	2026-05-07 19:10:41.692
11e1e5ee-e098-41b1-b97a-e6a4ee775026	fad56e7d-d446-4215-9cd3-634adcd4e343	c741d4bb-6c6d-4580-b844-f67c9d1e4a67	TEACHER	2026-05-07 19:35:01.027
a43262b2-834c-4274-beea-fe75744ed411	a8c3ff65-c018-4594-ae37-e0646a6f5816	1db3af6d-059f-4e97-af32-602f947adc9d	TEACHER	2026-05-07 20:07:17.081
cbd862a5-6131-4d34-983e-c034576f0993	02615f48-595a-4e11-989e-684903a85b2b	89c903ae-97fd-408f-ac99-750fe21be5e3	TEACHER	2026-05-07 20:09:50.344
b6c4cae4-8fa1-4cc3-8efa-a89a770a664d	aaa1d1f6-b87b-4366-933d-4131d8efb419	75acde4b-8101-47c6-af43-c31c6f973d7c	TEACHER	2026-05-25 20:20:01.907
5a86e349-bf55-4414-8702-726ba9885e0e	71094cf3-d690-4212-b646-3b6ec6b98928	70573aa7-21e9-4e58-a98e-6000fff8599c	TEACHER	2026-05-26 17:39:30.744
f9046291-ee51-442f-aaee-c79fc3150465	6c1810db-e9c5-46c7-8600-bc073137201a	a7a5961e-97a4-46d5-8036-1262381ad5f6	TEACHER	2026-05-26 20:25:34.676
535e449b-f429-4bbe-8dda-893cd7d423a5	1e9d3fe1-55b0-48d4-a389-35a361d36067	75acde4b-8101-47c6-af43-c31c6f973d7c	TEACHER	2026-05-26 22:17:16.607
\.


--
-- TOC entry 5072 (class 0 OID 32886)
-- Dependencies: 250
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, title, description, language, level, published, rating_average, created_at, updated_at) FROM stdin;
seed-course-intro	Introduction	Seed course for local development.	en	A1	t	5.000	2026-04-12 18:22:24.268	2026-04-12 18:40:19.882
a8256b7b-7100-4ce0-ba7f-64877978e55a	K[]PK	ASFAWGWE	English	A1	f	\N	2026-04-21 20:13:13.305	2026-04-21 20:13:13.305
cae0fb98-b1e2-48ee-8db6-36923cb338a4	Integration Course	Created by integration test.	en	A1	f	\N	2026-04-24 22:07:53.47	2026-04-24 22:07:53.47
86fb1aec-444b-4444-a126-468c63ef1823	Integration Course	Created by integration test.	en	A1	f	\N	2026-04-24 22:08:22.843	2026-04-24 22:08:22.843
3b8f3297-74bb-4e41-b6a0-1700d23b2fb9	Integration Course	Created by integration test.	en	A1	f	\N	2026-04-24 22:22:02.847	2026-04-24 22:22:02.847
seed-course-fr-draft	Français: phonétique (черновик)	Будущий курс по произношению и связке букв; пока скрыт из каталога для демонстрации неопубликованных курсов.	fr	A2	f	\N	2026-04-24 22:26:25.225	2026-04-24 22:26:25.225
7cf7f418-39cd-4ba0-8e34-6d9ffd3e4eea	Integration Course	Created by integration test.	en	A1	f	\N	2026-04-24 22:35:52.093	2026-04-24 22:35:52.093
8321371f-e4bc-4d0b-a3ba-7ddb4dd596ca	QA Course A	Bootstrap course A for API tests.	en	A1	t	\N	2026-05-01 11:12:36.706	2026-05-01 11:12:36.706
3ad9fbd0-0ee6-44a7-9966-c2c01c01ef62	QA Course B	Second course for enrollment tests.	en	A2	t	\N	2026-05-01 11:12:36.813	2026-05-01 11:12:36.813
ec29073c-2ca4-475d-a026-e861cba8d2c9	QA Draft Course	Not in public catalog.	fr	A2	f	\N	2026-05-01 11:12:36.916	2026-05-01 11:12:36.916
9f8bd517-9b42-41f0-8d9a-136f2f4a9280	QA Isolate Course	For 403 submission test.	de	A1	t	\N	2026-05-01 11:12:37.003	2026-05-01 11:12:37.003
seed-course-en-b1	Business English: встречи и переговоры	Разбор типовых сценариев: созвон с коллегами, повестка дня, вежливые формулы согласия и несогласия, фиксация договорённостей. Материалы ориентированы на работу в международных командах.	en	B1	t	4.000	2026-04-24 22:26:25.223	2026-05-26 20:06:50.353
seed-bulk-course-2	Seed Bulk Course 2	Автосгенерированный курс для выполнения требования по минимальному объёму тестовых данных.	en	A2	t	5.000	2026-05-01 11:33:25.337	2026-05-26 20:06:50.556
seed-bulk-course-9	Seed Bulk Course 9	Автосгенерированный курс для выполнения требования по минимальному объёму тестовых данных.	de	B1	t	4.000	2026-05-01 11:33:25.354	2026-05-26 20:06:50.57
seed-bulk-course-10	Seed Bulk Course 10	Автосгенерированный курс для выполнения требования по минимальному объёму тестовых данных.	en	A2	t	4.000	2026-05-01 11:33:25.357	2026-05-26 20:06:50.572
seed-bulk-course-3	Seed Bulk Course 3	Автосгенерированный курс для выполнения требования по минимальному объёму тестовых данных.	de	B1	t	4.000	2026-05-01 11:33:25.34	2026-05-26 20:06:50.558
b1c34af4-fe2d-4da2-bbc8-b135b0a11d22	Integration Course	Created by integration test.	en	A1	f	\N	2026-05-01 11:40:09.892	2026-05-01 11:40:09.892
seed-bulk-course-4	Seed Bulk Course 4	Автосгенерированный курс для выполнения требования по минимальному объёму тестовых данных.	en	A2	t	5.000	2026-05-01 11:33:25.342	2026-05-26 20:06:50.56
seed-bulk-course-5	Seed Bulk Course 5	Автосгенерированный курс для выполнения требования по минимальному объёму тестовых данных.	en	B1	t	4.000	2026-05-01 11:33:25.344	2026-05-26 20:06:50.562
seed-bulk-course-6	Seed Bulk Course 6	Автосгенерированный курс для выполнения требования по минимальному объёму тестовых данных.	de	A2	t	5.000	2026-05-01 11:33:25.347	2026-05-26 20:06:50.564
seed-bulk-course-7	Seed Bulk Course 7	Автосгенерированный курс для выполнения требования по минимальному объёму тестовых данных.	en	B1	t	4.000	2026-05-01 11:33:25.35	2026-05-26 20:06:50.566
seed-bulk-course-11	Seed Bulk Course 11	Автосгенерированный курс для выполнения требования по минимальному объёму тестовых данных.	en	B1	t	4.000	2026-05-01 11:33:25.359	2026-05-26 20:06:50.574
aaa1d1f6-b87b-4366-933d-4131d8efb419	afafasfasf	afasfafasfas	English	A1	f	\N	2026-05-25 20:20:01.896	2026-05-25 20:20:01.896
a47127ef-9770-418b-9d8f-6dd108aace1d	Integration Course	Created by integration test.	en	A1	f	\N	2026-05-07 19:01:16.441	2026-05-07 19:01:16.441
44917bf1-3564-48e7-ada2-cce4b248a03c	Integration Course	Created by integration test.	en	A1	f	\N	2026-05-07 19:08:53.165	2026-05-07 19:08:53.165
83f0b7b5-9299-45b7-af47-6eaf428e3fca	Integration Course	Created by integration test.	en	A1	f	\N	2026-05-07 19:10:08.37	2026-05-07 19:10:08.37
cd5f596c-4469-4ca5-baeb-e18967bbefa8	Integration Course	Created by integration test.	en	A1	f	\N	2026-05-07 19:10:41.69	2026-05-07 19:10:41.69
seed-bulk-course-1	Seed Bulk Course 1	Автосгенерированный курс для выполнения требования по минимальному объёму тестовых данных.	en	B1	t	4.000	2026-05-01 11:33:25.334	2026-05-26 20:06:50.554
seed-bulk-course-8	Seed Bulk Course 8	Автосгенерированный курс для выполнения требования по минимальному объёму тестовых данных.	en	A2	t	5.000	2026-05-01 11:33:25.352	2026-05-26 20:06:50.568
fad56e7d-d446-4215-9cd3-634adcd4e343	Integration Course	Created by integration test.	en	A1	f	\N	2026-05-07 19:35:01.024	2026-05-07 19:35:01.024
a8c3ff65-c018-4594-ae37-e0646a6f5816	Integration Course	Created by integration test.	en	A1	f	\N	2026-05-07 20:07:17.077	2026-05-07 20:07:17.077
02615f48-595a-4e11-989e-684903a85b2b	Integration Course	Created by integration test.	en	A1	f	\N	2026-05-07 20:09:50.342	2026-05-07 20:09:50.342
seed-bulk-course-12	Seed Bulk Course 12	Автосгенерированный курс для выполнения требования по минимальному объёму тестовых данных.	de	A2	t	5.000	2026-05-01 11:33:25.361	2026-05-26 20:06:50.576
71094cf3-d690-4212-b646-3b6ec6b98928	Integration Course	Created by integration test.	en	A1	f	\N	2026-05-26 17:39:30.74	2026-05-26 17:39:30.74
seed-course-en-a1	Английский с нуля: алфавит, цифры и приветствия	Практический мини-курс для тех, кто только начинает. Вы освоите произношение базовых букв, научитесь представляться и задавать простые вопросы. Каждый урок сопровождается короткими упражнениями на закрепление.	en	A1	t	5.000	2026-04-24 22:26:25.22	2026-05-26 20:06:50.349
6c1810db-e9c5-46c7-8600-bc073137201a	Integration Course	Created by integration test.	en	A1	f	\N	2026-05-26 20:25:34.666	2026-05-26 20:25:34.666
1e9d3fe1-55b0-48d4-a389-35a361d36067	gdfg	dgdfg	English	A1	f	\N	2026-05-26 22:17:16.588	2026-05-26 22:17:16.588
\.


--
-- TOC entry 5077 (class 0 OID 32960)
-- Dependencies: 255
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (id, user_id, course_id, progress, created_at, updated_at) FROM stdin;
55aff4c9-57a2-436a-a980-351232e693e3	e1ad91ad-7a95-4176-8659-d246165ecdb4	seed-course-intro	0	2026-04-12 18:22:24.282	2026-04-12 18:22:24.282
054aef16-2041-4c40-a2ec-fa5128fd8021	f3433594-e441-43a8-996a-4f9cbeb7c632	seed-bulk-course-6	0	2026-05-01 11:33:25.499	2026-05-26 20:06:50.625
937a3fb3-d4ce-4847-980b-6abc3cb006df	f3433594-e441-43a8-996a-4f9cbeb7c632	seed-bulk-course-3	0	2026-05-01 11:33:25.498	2026-05-26 20:06:50.627
0916a25d-ba85-47f8-87ec-8ea6f12962ad	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-a1	100	2026-04-24 22:26:25.264	2026-05-26 20:06:50.583
4967a64b-2fb2-4a73-a8e6-074345704b6f	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-b1	0	2026-04-24 22:26:25.266	2026-05-26 20:06:50.586
e52769b8-192b-4b12-bfae-371d27645c79	seed-cohort-student-1	seed-course-en-a1	100	2026-05-01 11:38:50.396	2026-05-26 20:06:50.589
f4657828-60c2-4092-a8dc-bbb14577892f	fd5d0aa6-c15c-468b-81df-45fb675fad00	seed-bulk-course-7	0	2026-05-01 11:33:25.52	2026-05-26 20:06:50.643
7922b135-59ad-4cd4-8834-40096799b505	fd5d0aa6-c15c-468b-81df-45fb675fad00	seed-bulk-course-10	0	2026-05-01 11:33:25.521	2026-05-26 20:06:50.645
3856e849-6462-4b4f-beba-e826d43e3096	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-course-en-a1	75	2026-04-24 22:27:15.583	2026-04-24 22:36:41.012
f8becd74-f5f3-4a8a-a510-821a5a0f8f53	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-course-en-b1	0	2026-04-24 22:38:05.979	2026-04-24 22:38:05.979
0077350a-86d5-4b77-94ad-59ab05905f66	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-10	0	2026-05-07 18:41:05.84	2026-05-07 18:46:52.168
0637763b-94b8-4b15-ad19-af51a1deda39	seed-cohort-student-3	seed-course-en-b1	50	2026-05-01 11:38:50.468	2026-05-26 20:06:50.601
5220def0-da7b-43a1-b43f-bdd1f2f682b7	c4e7cafe-2491-4a88-a708-cbfbce627c75	seed-bulk-course-8	0	2026-05-01 11:33:25.525	2026-05-26 20:06:50.648
0ed936d6-a5d3-4ff7-bd37-3070322fcb21	8796334d-2a75-42b6-80d3-00400866b04e	8321371f-e4bc-4d0b-a3ba-7ddb4dd596ca	0	2026-05-01 11:12:37.456	2026-05-01 11:12:37.456
7c984bb2-1f3f-4e35-993f-52d29a684f30	c4e7cafe-2491-4a88-a708-cbfbce627c75	seed-bulk-course-11	0	2026-05-01 11:33:25.526	2026-05-26 20:06:50.651
60870052-d272-4b38-854c-f0afc6812398	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-8	0	2026-05-07 18:56:39.203	2026-05-07 18:56:39.203
cb66e6ce-d116-43d2-b2af-cae322cff341	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-12	0	2026-05-26 17:51:50.559	2026-05-26 17:51:50.559
85db61eb-63f9-4a38-8bc8-0c7db27dff0c	seed-cohort-student-4	seed-course-en-a1	50	2026-05-01 11:38:50.472	2026-05-26 20:06:50.604
52504aa7-e476-49a0-8471-a897fdf56bc9	seed-cohort-student-4	seed-course-en-b1	25	2026-05-01 11:38:50.485	2026-05-26 20:06:50.606
89f3b273-1244-496f-aa42-51a033811980	seed-cohort-student-5	seed-course-en-a1	25	2026-05-01 11:38:50.488	2026-05-26 20:06:50.608
88e24671-5fb5-465b-8c99-e5aa66a6c72f	seed-cohort-student-6	seed-course-en-a1	0	2026-05-01 11:38:50.495	2026-05-26 20:06:50.61
f69ca652-89ee-4116-9b05-824c06b467e7	bd7f5458-d4fc-427e-90d7-dbf85d4cf41b	seed-bulk-course-1	50	2026-05-01 11:33:25.484	2026-05-26 20:06:50.613
cf9cdb8d-0eb6-4ec5-866f-6d747fc5ab69	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-1	0	2026-05-07 18:44:52.727	2026-05-07 18:44:52.727
253bec6e-abd1-4bf0-b103-a9ceb6c89b25	0e2700bf-d311-4d6e-80e2-a1098ff642a2	seed-bulk-course-12	0	2026-05-01 11:33:25.531	2026-05-26 20:06:50.653
7871a660-81c4-4a8a-9ffa-f04eadcaa01c	0e2700bf-d311-4d6e-80e2-a1098ff642a2	seed-bulk-course-9	0	2026-05-01 11:33:25.53	2026-05-26 20:06:50.655
0b12f29c-34ab-4e0b-83f2-ef22aaa8a6ca	8c59b1c5-aeef-408f-abd9-0f0480a92150	seed-bulk-course-7	0	2026-05-01 11:33:25.505	2026-05-26 20:06:50.629
10ca2029-4d69-456c-a9c8-f5ebd9dba194	7dbd9524-5297-4c0b-b04d-466e2743191f	seed-bulk-course-1	0	2026-05-01 11:33:25.536	2026-05-26 20:06:50.658
99cd66ac-cfec-4d39-ba21-7b705b7af805	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-intro	0	2026-05-07 19:18:30.356	2026-05-07 19:18:41.39
7014e5f8-0f44-445c-b36d-796a9885e54a	7dbd9524-5297-4c0b-b04d-466e2743191f	seed-bulk-course-10	0	2026-05-01 11:33:25.535	2026-05-26 20:06:50.661
e2e1d7c3-2de1-4080-a126-a99b2b00b712	seed-cohort-student-1	seed-course-en-b1	100	2026-05-01 11:38:50.418	2026-05-26 20:06:50.591
176eec5d-a975-4e9c-a669-db0efbda4e84	8c59b1c5-aeef-408f-abd9-0f0480a92150	seed-bulk-course-4	0	2026-05-01 11:33:25.503	2026-05-26 20:06:50.631
6b5de71f-7e9a-414e-81dd-445d67b05888	bd7f5458-d4fc-427e-90d7-dbf85d4cf41b	seed-bulk-course-4	0	2026-05-01 11:33:25.485	2026-05-26 20:06:50.615
6fe9cf3c-5103-4350-a6d7-b6db6d9f8232	f2aa774e-fb5c-469b-9bf8-710cf58415f0	seed-bulk-course-5	0	2026-05-01 11:33:25.493	2026-05-26 20:06:50.619
11a516bb-cd3c-4c1d-9661-feb5896fb074	seed-cohort-student-2	seed-course-en-a1	100	2026-05-01 11:38:50.426	2026-05-26 20:06:50.594
05a3a4dd-fbea-4a75-a729-ab8536ff12f2	f2aa774e-fb5c-469b-9bf8-710cf58415f0	seed-bulk-course-2	0	2026-05-01 11:33:25.492	2026-05-26 20:06:50.622
a0ac8116-7aa3-4af2-b51a-f58df1de7a6c	d18fea24-e53c-4793-b907-46fadaee220a	seed-bulk-course-11	0	2026-05-25 10:53:20.007	2026-05-25 10:53:45.374
a1f8550c-751b-4376-bf55-b6170d7e89e0	0083e3eb-4558-4cda-b979-156adf8274ff	seed-bulk-course-8	0	2026-05-01 11:33:25.511	2026-05-26 20:06:50.634
37b552c6-38de-4a2e-aee0-93c98f767164	seed-cohort-student-2	seed-course-en-b1	100	2026-05-01 11:38:50.444	2026-05-26 20:06:50.596
d7ed502f-18d0-4986-9bed-1c35d9cbba88	seed-cohort-student-3	seed-course-en-a1	75	2026-05-01 11:38:50.451	2026-05-26 20:06:50.598
303ea9a5-2faf-405b-80d1-d4b0ecedff59	0083e3eb-4558-4cda-b979-156adf8274ff	seed-bulk-course-5	0	2026-05-01 11:33:25.51	2026-05-26 20:06:50.636
085a02cd-5841-4d11-bca0-875905d5a7e4	a7ff1105-747d-4b12-a507-a9535a9f51f0	seed-bulk-course-6	0	2026-05-01 11:33:25.515	2026-05-26 20:06:50.639
407a847b-c17c-4c62-b061-8492af48e1c9	a7ff1105-747d-4b12-a507-a9535a9f51f0	seed-bulk-course-9	0	2026-05-01 11:33:25.516	2026-05-26 20:06:50.641
\.


--
-- TOC entry 5076 (class 0 OID 32947)
-- Dependencies: 254
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercises (id, lesson_id, title, type, payload) FROM stdin;
seed-exercise-1	seed-lesson-1	Warm-up	mcq	{"answer": "a", "options": ["a", "b"]}
55099307-2e39-4c71-b30d-58d2a86ea9a8	9c57c4b7-a6b5-4b02-8fa6-38cff58ea735	New exercise	text	{"maxScore": 10, "question": "Question", "correctAnswer": "Answer"}
40830db9-0e87-4a2c-9488-eec691c2a3f7	9c57c4b7-a6b5-4b02-8fa6-38cff58ea735	New exercise	text	{"maxScore": 10, "question": "Question", "correctAnswer": "Answer"}
cb0c0841-af97-4d4a-a04f-f0748d70caa1	9c57c4b7-a6b5-4b02-8fa6-38cff58ea735	New exercise	text	{"maxScore": 10, "question": "Question", "correctAnswer": "Answer"}
seed-en-a1-l1-ex1	seed-en-a1-l1	Буква после D	text	{"maxScore": 5, "question": "Какая буква английского алфавита идёт сразу после **D**?", "correctAnswer": "E"}
seed-en-a1-l1-ex2	seed-en-a1-l1	Количество гласных	text	{"maxScore": 5, "question": "Сколько гласных букв в английском алфавите? Ответ числом.", "correctAnswer": "5"}
seed-en-a1-l2-ex1	seed-en-a1-l2	Нейтральное приветствие	text	{"maxScore": 10, "question": "Как одним словом поздороваться нейтрально-формально днём (не good morning)?", "correctAnswer": "hello"}
seed-en-a1-l2-ex2	seed-en-a1-l2	Первая встреча	text	{"maxScore": 10, "question": "Закончите фразу: Nice to meet you, ___. (одно слово, ответ на поздравление)", "correctAnswer": "too"}
seed-en-a1-l3-ex1	seed-en-a1-l3	Число twelve	text	{"maxScore": 10, "question": "Напишите цифрой число, которое на английском — *twelve*.", "correctAnswer": "12"}
seed-en-b1-l1-ex1	seed-en-b1-l1	Синоним повестки	text	{"maxScore": 10, "question": "Одним английским словом: документ с пунктами обсуждения на встрече (часто в начале письма).", "correctAnswer": "agenda"}
seed-en-b1-l2-ex1	seed-en-b1-l2	Вежливое несогласие	single_choice	{"maxScore": 10, "question": "Какая формулировка звучит наиболее вежливо в деловой переписке?", "correctAnswer": "I'm not sure I fully agree"}
69da77b6-a44f-4601-8ee1-6474e27f5f2e	0e651a14-30ef-41a3-bcf3-bc0792cfc272	Isolate Ex	text	{"maxScore": 10, "question": "Say x", "correctAnswer": "x"}
12d53b17-73ac-40e0-8a81-fbf5b4569f9f	8eb4b77e-9c21-4401-b7e0-94d53e9d4793	Main Exercise	text	{"maxScore": 10, "question": "Type ok", "correctAnswer": "ok"}
seed-bulk-course-1-lesson-1-exercise-1	seed-bulk-course-1-lesson-1	Bulk Exercise 1.1	text	{"maxScore": 10, "question": "Контрольный вопрос 1.1 для курса 1", "correctAnswer": "ok"}
seed-bulk-course-1-lesson-1-exercise-2	seed-bulk-course-1-lesson-1	Bulk Exercise 1.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1.2 для курса 1", "correctAnswer": "ok"}
seed-bulk-course-1-lesson-2-exercise-1	seed-bulk-course-1-lesson-2	Bulk Exercise 2.1	text	{"maxScore": 10, "question": "Контрольный вопрос 2.1 для курса 1", "correctAnswer": "ok"}
seed-bulk-course-1-lesson-2-exercise-2	seed-bulk-course-1-lesson-2	Bulk Exercise 2.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2.2 для курса 1", "correctAnswer": "ok"}
seed-bulk-course-1-lesson-3-exercise-1	seed-bulk-course-1-lesson-3	Bulk Exercise 3.1	text	{"maxScore": 10, "question": "Контрольный вопрос 3.1 для курса 1", "correctAnswer": "ok"}
seed-bulk-course-1-lesson-3-exercise-2	seed-bulk-course-1-lesson-3	Bulk Exercise 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3.2 для курса 1", "correctAnswer": "ok"}
seed-bulk-course-2-lesson-1-exercise-1	seed-bulk-course-2-lesson-1	Bulk Exercise 1.1	text	{"maxScore": 10, "question": "Контрольный вопрос 1.1 для курса 2", "correctAnswer": "ok"}
seed-bulk-course-2-lesson-1-exercise-2	seed-bulk-course-2-lesson-1	Bulk Exercise 1.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1.2 для курса 2", "correctAnswer": "ok"}
seed-bulk-course-2-lesson-2-exercise-1	seed-bulk-course-2-lesson-2	Bulk Exercise 2.1	text	{"maxScore": 10, "question": "Контрольный вопрос 2.1 для курса 2", "correctAnswer": "ok"}
seed-bulk-course-2-lesson-2-exercise-2	seed-bulk-course-2-lesson-2	Bulk Exercise 2.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2.2 для курса 2", "correctAnswer": "ok"}
seed-bulk-course-2-lesson-3-exercise-1	seed-bulk-course-2-lesson-3	Bulk Exercise 3.1	text	{"maxScore": 10, "question": "Контрольный вопрос 3.1 для курса 2", "correctAnswer": "ok"}
seed-bulk-course-2-lesson-3-exercise-2	seed-bulk-course-2-lesson-3	Bulk Exercise 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3.2 для курса 2", "correctAnswer": "ok"}
seed-bulk-course-3-lesson-1-exercise-1	seed-bulk-course-3-lesson-1	Bulk Exercise 1.1	text	{"maxScore": 10, "question": "Контрольный вопрос 1.1 для курса 3", "correctAnswer": "ok"}
seed-bulk-course-3-lesson-1-exercise-2	seed-bulk-course-3-lesson-1	Bulk Exercise 1.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1.2 для курса 3", "correctAnswer": "ok"}
seed-bulk-course-3-lesson-2-exercise-1	seed-bulk-course-3-lesson-2	Bulk Exercise 2.1	text	{"maxScore": 10, "question": "Контрольный вопрос 2.1 для курса 3", "correctAnswer": "ok"}
seed-bulk-course-3-lesson-2-exercise-2	seed-bulk-course-3-lesson-2	Bulk Exercise 2.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2.2 для курса 3", "correctAnswer": "ok"}
seed-bulk-course-3-lesson-3-exercise-1	seed-bulk-course-3-lesson-3	Bulk Exercise 3.1	text	{"maxScore": 10, "question": "Контрольный вопрос 3.1 для курса 3", "correctAnswer": "ok"}
seed-bulk-course-3-lesson-3-exercise-2	seed-bulk-course-3-lesson-3	Bulk Exercise 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3.2 для курса 3", "correctAnswer": "ok"}
seed-bulk-course-4-lesson-1-exercise-1	seed-bulk-course-4-lesson-1	Bulk Exercise 1.1	text	{"maxScore": 10, "question": "Контрольный вопрос 1.1 для курса 4", "correctAnswer": "ok"}
seed-bulk-course-4-lesson-1-exercise-2	seed-bulk-course-4-lesson-1	Bulk Exercise 1.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1.2 для курса 4", "correctAnswer": "ok"}
seed-bulk-course-4-lesson-2-exercise-1	seed-bulk-course-4-lesson-2	Bulk Exercise 2.1	text	{"maxScore": 10, "question": "Контрольный вопрос 2.1 для курса 4", "correctAnswer": "ok"}
seed-bulk-course-4-lesson-2-exercise-2	seed-bulk-course-4-lesson-2	Bulk Exercise 2.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2.2 для курса 4", "correctAnswer": "ok"}
seed-bulk-course-4-lesson-3-exercise-1	seed-bulk-course-4-lesson-3	Bulk Exercise 3.1	text	{"maxScore": 10, "question": "Контрольный вопрос 3.1 для курса 4", "correctAnswer": "ok"}
seed-bulk-course-4-lesson-3-exercise-2	seed-bulk-course-4-lesson-3	Bulk Exercise 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3.2 для курса 4", "correctAnswer": "ok"}
seed-bulk-course-5-lesson-1-exercise-1	seed-bulk-course-5-lesson-1	Bulk Exercise 1.1	text	{"maxScore": 10, "question": "Контрольный вопрос 1.1 для курса 5", "correctAnswer": "ok"}
seed-bulk-course-5-lesson-1-exercise-2	seed-bulk-course-5-lesson-1	Bulk Exercise 1.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1.2 для курса 5", "correctAnswer": "ok"}
seed-bulk-course-5-lesson-2-exercise-1	seed-bulk-course-5-lesson-2	Bulk Exercise 2.1	text	{"maxScore": 10, "question": "Контрольный вопрос 2.1 для курса 5", "correctAnswer": "ok"}
seed-bulk-course-5-lesson-2-exercise-2	seed-bulk-course-5-lesson-2	Bulk Exercise 2.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2.2 для курса 5", "correctAnswer": "ok"}
seed-bulk-course-5-lesson-3-exercise-1	seed-bulk-course-5-lesson-3	Bulk Exercise 3.1	text	{"maxScore": 10, "question": "Контрольный вопрос 3.1 для курса 5", "correctAnswer": "ok"}
seed-bulk-course-5-lesson-3-exercise-2	seed-bulk-course-5-lesson-3	Bulk Exercise 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3.2 для курса 5", "correctAnswer": "ok"}
seed-bulk-course-6-lesson-1-exercise-1	seed-bulk-course-6-lesson-1	Bulk Exercise 1.1	text	{"maxScore": 10, "question": "Контрольный вопрос 1.1 для курса 6", "correctAnswer": "ok"}
seed-bulk-course-6-lesson-1-exercise-2	seed-bulk-course-6-lesson-1	Bulk Exercise 1.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1.2 для курса 6", "correctAnswer": "ok"}
seed-bulk-course-6-lesson-2-exercise-1	seed-bulk-course-6-lesson-2	Bulk Exercise 2.1	text	{"maxScore": 10, "question": "Контрольный вопрос 2.1 для курса 6", "correctAnswer": "ok"}
seed-bulk-course-6-lesson-2-exercise-2	seed-bulk-course-6-lesson-2	Bulk Exercise 2.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2.2 для курса 6", "correctAnswer": "ok"}
seed-bulk-course-6-lesson-3-exercise-1	seed-bulk-course-6-lesson-3	Bulk Exercise 3.1	text	{"maxScore": 10, "question": "Контрольный вопрос 3.1 для курса 6", "correctAnswer": "ok"}
seed-bulk-course-6-lesson-3-exercise-2	seed-bulk-course-6-lesson-3	Bulk Exercise 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3.2 для курса 6", "correctAnswer": "ok"}
seed-bulk-course-7-lesson-1-exercise-1	seed-bulk-course-7-lesson-1	Bulk Exercise 1.1	text	{"maxScore": 10, "question": "Контрольный вопрос 1.1 для курса 7", "correctAnswer": "ok"}
seed-bulk-course-7-lesson-1-exercise-2	seed-bulk-course-7-lesson-1	Bulk Exercise 1.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1.2 для курса 7", "correctAnswer": "ok"}
seed-bulk-course-7-lesson-2-exercise-1	seed-bulk-course-7-lesson-2	Bulk Exercise 2.1	text	{"maxScore": 10, "question": "Контрольный вопрос 2.1 для курса 7", "correctAnswer": "ok"}
seed-bulk-course-7-lesson-2-exercise-2	seed-bulk-course-7-lesson-2	Bulk Exercise 2.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2.2 для курса 7", "correctAnswer": "ok"}
seed-bulk-course-7-lesson-3-exercise-1	seed-bulk-course-7-lesson-3	Bulk Exercise 3.1	text	{"maxScore": 10, "question": "Контрольный вопрос 3.1 для курса 7", "correctAnswer": "ok"}
seed-bulk-course-7-lesson-3-exercise-2	seed-bulk-course-7-lesson-3	Bulk Exercise 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3.2 для курса 7", "correctAnswer": "ok"}
seed-bulk-course-8-lesson-1-exercise-1	seed-bulk-course-8-lesson-1	Bulk Exercise 1.1	text	{"maxScore": 10, "question": "Контрольный вопрос 1.1 для курса 8", "correctAnswer": "ok"}
seed-bulk-course-8-lesson-1-exercise-2	seed-bulk-course-8-lesson-1	Bulk Exercise 1.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1.2 для курса 8", "correctAnswer": "ok"}
seed-bulk-course-8-lesson-2-exercise-1	seed-bulk-course-8-lesson-2	Bulk Exercise 2.1	text	{"maxScore": 10, "question": "Контрольный вопрос 2.1 для курса 8", "correctAnswer": "ok"}
seed-bulk-course-8-lesson-2-exercise-2	seed-bulk-course-8-lesson-2	Bulk Exercise 2.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2.2 для курса 8", "correctAnswer": "ok"}
seed-bulk-course-8-lesson-3-exercise-1	seed-bulk-course-8-lesson-3	Bulk Exercise 3.1	text	{"maxScore": 10, "question": "Контрольный вопрос 3.1 для курса 8", "correctAnswer": "ok"}
seed-bulk-course-8-lesson-3-exercise-2	seed-bulk-course-8-lesson-3	Bulk Exercise 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3.2 для курса 8", "correctAnswer": "ok"}
seed-bulk-course-9-lesson-1-exercise-1	seed-bulk-course-9-lesson-1	Bulk Exercise 1.1	text	{"maxScore": 10, "question": "Контрольный вопрос 1.1 для курса 9", "correctAnswer": "ok"}
seed-bulk-course-9-lesson-1-exercise-2	seed-bulk-course-9-lesson-1	Bulk Exercise 1.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1.2 для курса 9", "correctAnswer": "ok"}
seed-bulk-course-9-lesson-2-exercise-1	seed-bulk-course-9-lesson-2	Bulk Exercise 2.1	text	{"maxScore": 10, "question": "Контрольный вопрос 2.1 для курса 9", "correctAnswer": "ok"}
seed-bulk-course-9-lesson-2-exercise-2	seed-bulk-course-9-lesson-2	Bulk Exercise 2.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2.2 для курса 9", "correctAnswer": "ok"}
seed-bulk-course-9-lesson-3-exercise-1	seed-bulk-course-9-lesson-3	Bulk Exercise 3.1	text	{"maxScore": 10, "question": "Контрольный вопрос 3.1 для курса 9", "correctAnswer": "ok"}
seed-bulk-course-9-lesson-3-exercise-2	seed-bulk-course-9-lesson-3	Bulk Exercise 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3.2 для курса 9", "correctAnswer": "ok"}
seed-bulk-course-10-lesson-1-exercise-1	seed-bulk-course-10-lesson-1	Bulk Exercise 1.1	text	{"maxScore": 10, "question": "Контрольный вопрос 1.1 для курса 10", "correctAnswer": "ok"}
seed-bulk-course-10-lesson-1-exercise-2	seed-bulk-course-10-lesson-1	Bulk Exercise 1.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1.2 для курса 10", "correctAnswer": "ok"}
seed-bulk-course-10-lesson-2-exercise-1	seed-bulk-course-10-lesson-2	Bulk Exercise 2.1	text	{"maxScore": 10, "question": "Контрольный вопрос 2.1 для курса 10", "correctAnswer": "ok"}
seed-bulk-course-10-lesson-2-exercise-2	seed-bulk-course-10-lesson-2	Bulk Exercise 2.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2.2 для курса 10", "correctAnswer": "ok"}
seed-bulk-course-10-lesson-3-exercise-1	seed-bulk-course-10-lesson-3	Bulk Exercise 3.1	text	{"maxScore": 10, "question": "Контрольный вопрос 3.1 для курса 10", "correctAnswer": "ok"}
seed-bulk-course-10-lesson-3-exercise-2	seed-bulk-course-10-lesson-3	Bulk Exercise 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3.2 для курса 10", "correctAnswer": "ok"}
seed-bulk-course-11-lesson-1-exercise-1	seed-bulk-course-11-lesson-1	Bulk Exercise 1.1	text	{"maxScore": 10, "question": "Контрольный вопрос 1.1 для курса 11", "correctAnswer": "ok"}
seed-bulk-course-11-lesson-1-exercise-2	seed-bulk-course-11-lesson-1	Bulk Exercise 1.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1.2 для курса 11", "correctAnswer": "ok"}
seed-bulk-course-11-lesson-2-exercise-1	seed-bulk-course-11-lesson-2	Bulk Exercise 2.1	text	{"maxScore": 10, "question": "Контрольный вопрос 2.1 для курса 11", "correctAnswer": "ok"}
seed-bulk-course-11-lesson-2-exercise-2	seed-bulk-course-11-lesson-2	Bulk Exercise 2.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2.2 для курса 11", "correctAnswer": "ok"}
seed-bulk-course-11-lesson-3-exercise-1	seed-bulk-course-11-lesson-3	Bulk Exercise 3.1	text	{"maxScore": 10, "question": "Контрольный вопрос 3.1 для курса 11", "correctAnswer": "ok"}
seed-bulk-course-11-lesson-3-exercise-2	seed-bulk-course-11-lesson-3	Bulk Exercise 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3.2 для курса 11", "correctAnswer": "ok"}
seed-bulk-course-12-lesson-1-exercise-1	seed-bulk-course-12-lesson-1	Bulk Exercise 1.1	text	{"maxScore": 10, "question": "Контрольный вопрос 1.1 для курса 12", "correctAnswer": "ok"}
seed-bulk-course-12-lesson-1-exercise-2	seed-bulk-course-12-lesson-1	Bulk Exercise 1.2	text	{"maxScore": 10, "question": "Контрольный вопрос 1.2 для курса 12", "correctAnswer": "ok"}
seed-bulk-course-12-lesson-2-exercise-1	seed-bulk-course-12-lesson-2	Bulk Exercise 2.1	text	{"maxScore": 10, "question": "Контрольный вопрос 2.1 для курса 12", "correctAnswer": "ok"}
seed-bulk-course-12-lesson-2-exercise-2	seed-bulk-course-12-lesson-2	Bulk Exercise 2.2	text	{"maxScore": 10, "question": "Контрольный вопрос 2.2 для курса 12", "correctAnswer": "ok"}
seed-bulk-course-12-lesson-3-exercise-1	seed-bulk-course-12-lesson-3	Bulk Exercise 3.1	text	{"maxScore": 10, "question": "Контрольный вопрос 3.1 для курса 12", "correctAnswer": "ok"}
seed-bulk-course-12-lesson-3-exercise-2	seed-bulk-course-12-lesson-3	Bulk Exercise 3.2	text	{"maxScore": 10, "question": "Контрольный вопрос 3.2 для курса 12", "correctAnswer": "ok"}
\.


--
-- TOC entry 5080 (class 0 OID 33017)
-- Dependencies: 258
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, user_id, course_id, created_at) FROM stdin;
9043dfe4-44dd-45e7-a622-6f09c41b5fd4	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-course-intro	2026-04-24 22:22:47.466
8bb3b526-dbd5-4ccf-9d44-1c93a098ac5b	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-b1	2026-04-24 22:26:25.28
40cc7abd-f265-446b-910b-0a1b53a6fbef	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	seed-course-en-a1	2026-04-24 22:30:11.281
c9b6d589-5f7f-4442-85c9-6a2e681824eb	bd7f5458-d4fc-427e-90d7-dbf85d4cf41b	seed-bulk-course-2	2026-05-01 11:33:25.487
70b00741-f3e2-46f9-82ec-f27d0734ada4	f2aa774e-fb5c-469b-9bf8-710cf58415f0	seed-bulk-course-3	2026-05-01 11:33:25.494
dc27a282-deee-4006-8baa-7832375326cf	f3433594-e441-43a8-996a-4f9cbeb7c632	seed-bulk-course-4	2026-05-01 11:33:25.5
a73a02da-ba27-4c64-9042-6df0af9fa8c5	8c59b1c5-aeef-408f-abd9-0f0480a92150	seed-bulk-course-5	2026-05-01 11:33:25.506
ff7500bd-159e-4dac-8a71-811a6c10a0c6	0083e3eb-4558-4cda-b979-156adf8274ff	seed-bulk-course-6	2026-05-01 11:33:25.512
d20856c5-c125-4e3c-929f-3285db986e49	a7ff1105-747d-4b12-a507-a9535a9f51f0	seed-bulk-course-7	2026-05-01 11:33:25.517
24b57d14-08ca-4603-b179-e386645531ab	fd5d0aa6-c15c-468b-81df-45fb675fad00	seed-bulk-course-8	2026-05-01 11:33:25.522
4193ca42-e4dd-4d69-8d90-c0a32a16f5b5	c4e7cafe-2491-4a88-a708-cbfbce627c75	seed-bulk-course-9	2026-05-01 11:33:25.527
457725d5-57d0-4b6d-a38a-98ac81d48e0b	0e2700bf-d311-4d6e-80e2-a1098ff642a2	seed-bulk-course-10	2026-05-01 11:33:25.532
d627029b-5c24-4d34-989a-93e608c679e3	7dbd9524-5297-4c0b-b04d-466e2743191f	seed-bulk-course-11	2026-05-01 11:33:25.537
4cd6b34c-9d60-4f10-88a6-63828ec3857b	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-8	2026-05-07 18:34:06.637
be5e4add-eeb6-4f75-82a8-e3b14c2cf7bd	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-10	2026-05-07 18:46:03.365
47265f87-ba38-4684-9fc9-47ef9ff71752	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-a1	2026-05-08 08:03:00.311
c89e6a04-ca69-458b-9949-dfa7ea740334	d18fea24-e53c-4793-b907-46fadaee220a	seed-bulk-course-11	2026-05-25 10:53:25.457
\.


--
-- TOC entry 5075 (class 0 OID 32934)
-- Dependencies: 253
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, course_id, title, sort_order, content) FROM stdin;
seed-lesson-1	seed-course-intro	First lesson	1	Welcome to the platform.
9c57c4b7-a6b5-4b02-8fa6-38cff58ea735	a8256b7b-7100-4ce0-ba7f-64877978e55a	Новый урок	1	
seed-en-a1-l1	seed-course-en-a1	Урок 1. Алфавит и произношение	1	## Цели урока\n- Узнать английский алфавив и типичные названия букв в эфире.\n- Потренировать пару минимальных пар звуков (например, **i** / **ee**).\n\n## Краткая теория\nВ английском 26 букв; гласные **A E I O U**, остальные — согласные. На уровне A1 достаточно уверенно читать буквы по одной (диктовка e-mail, аббревиатуры).\n\n## Практика\n1. Прочитайте алфавит вслух два раза.\n2. Запишите своё имя латиницей и проговорите по буквам.
seed-en-a1-l2	seed-course-en-a1	Урок 2. Приветствия и прощания	2	## Диалоги\n- **Hello** / **Hi** — нейтральное и неформальное приветствие.\n- **Good morning** — до полудня; **Good evening** — после работы.\n\n## Формулы вежливости\n**Nice to meet you** — при первом знакомстве. Ответ часто: **Nice to meet you too**.\n\n## Домашнее задание\nСоставьте 4 реплики: поздороваться, представиться, спросить "How are you?", попрощаться.
seed-en-a1-l3	seed-course-en-a1	Урок 3. Цифры и даты	3	## Числа 0–20\nЗапомните порядок: *zero, one, two … twenty*.\n\n## Год и день рождения\nГод читают по парам цифр: **1998** — *nineteen ninety-eight*.\n\n## Задание\nНазовите свой день рождения на английском (день + месяц + год).
seed-en-b1-l1	seed-course-en-b1	Повестка и тайминг	1	## Структура встречи\n1. **Opening** — цель и ожидания.\n2. **Agenda** — пункты по времени.\n3. **Action items** — кто что делает к какому сроку.\n\n## Полезные фразы\n- *Let's stick to the agenda.*\n- *I'd like to table this for our next call.*
seed-en-b1-l2	seed-course-en-b1	Согласие и мягкое несогласие	2	## Согласие\n*I agree with you on this point.*\n\n## Мягкий отказ\n*I'm not sure I fully agree — could we look at the data again?*\n\nИзбегайте резкого **You're wrong** в переписке с партнёрами.
seed-fr-draft-l1	seed-course-fr-draft	Naso voyelles	1	Черновик: nasales **an, in, on** — примеры будут добавлены.
0e651a14-30ef-41a3-bcf3-bc0792cfc272	9f8bd517-9b42-41f0-8d9a-136f2f4a9280	Isolate Lesson	1	x
8eb4b77e-9c21-4401-b7e0-94d53e9d4793	8321371f-e4bc-4d0b-a3ba-7ddb4dd596ca	Lesson 1	1	Hello
seed-bulk-course-1-lesson-1	seed-bulk-course-1	Bulk Lesson 1	1	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-1-lesson-2	seed-bulk-course-1	Bulk Lesson 2	2	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-1-lesson-3	seed-bulk-course-1	Bulk Lesson 3	3	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-2-lesson-1	seed-bulk-course-2	Bulk Lesson 1	1	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-2-lesson-2	seed-bulk-course-2	Bulk Lesson 2	2	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-2-lesson-3	seed-bulk-course-2	Bulk Lesson 3	3	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-3-lesson-1	seed-bulk-course-3	Bulk Lesson 1	1	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-3-lesson-2	seed-bulk-course-3	Bulk Lesson 2	2	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-3-lesson-3	seed-bulk-course-3	Bulk Lesson 3	3	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-4-lesson-1	seed-bulk-course-4	Bulk Lesson 1	1	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-4-lesson-2	seed-bulk-course-4	Bulk Lesson 2	2	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-4-lesson-3	seed-bulk-course-4	Bulk Lesson 3	3	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-5-lesson-1	seed-bulk-course-5	Bulk Lesson 1	1	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-5-lesson-2	seed-bulk-course-5	Bulk Lesson 2	2	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-5-lesson-3	seed-bulk-course-5	Bulk Lesson 3	3	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-6-lesson-1	seed-bulk-course-6	Bulk Lesson 1	1	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-6-lesson-2	seed-bulk-course-6	Bulk Lesson 2	2	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-6-lesson-3	seed-bulk-course-6	Bulk Lesson 3	3	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-7-lesson-1	seed-bulk-course-7	Bulk Lesson 1	1	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-7-lesson-2	seed-bulk-course-7	Bulk Lesson 2	2	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-7-lesson-3	seed-bulk-course-7	Bulk Lesson 3	3	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-8-lesson-1	seed-bulk-course-8	Bulk Lesson 1	1	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-8-lesson-2	seed-bulk-course-8	Bulk Lesson 2	2	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-8-lesson-3	seed-bulk-course-8	Bulk Lesson 3	3	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-9-lesson-1	seed-bulk-course-9	Bulk Lesson 1	1	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-9-lesson-2	seed-bulk-course-9	Bulk Lesson 2	2	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-9-lesson-3	seed-bulk-course-9	Bulk Lesson 3	3	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-10-lesson-1	seed-bulk-course-10	Bulk Lesson 1	1	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-10-lesson-2	seed-bulk-course-10	Bulk Lesson 2	2	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-10-lesson-3	seed-bulk-course-10	Bulk Lesson 3	3	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-11-lesson-1	seed-bulk-course-11	Bulk Lesson 1	1	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-11-lesson-2	seed-bulk-course-11	Bulk Lesson 2	2	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-11-lesson-3	seed-bulk-course-11	Bulk Lesson 3	3	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-12-lesson-1	seed-bulk-course-12	Bulk Lesson 1	1	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-12-lesson-2	seed-bulk-course-12	Bulk Lesson 2	2	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
seed-bulk-course-12-lesson-3	seed-bulk-course-12	Bulk Lesson 3	3	Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.
\.


--
-- TOC entry 5081 (class 0 OID 33029)
-- Dependencies: 259
-- Data for Name: reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reminders (id, user_id, course_id, title, remind_at, created_at, delivered_at, email_sent_at, acknowledged_at) FROM stdin;
ecaec6d3-b7ee-4fbf-b0f5-641002fa263b	5f5b65d7-b202-4d0b-888e-6d83d10fe69e	\N	fafas	2027-01-30 20:10:00+03	2026-04-25 01:30:33.231+03	\N	\N	\N
30220412-14fb-4034-862e-8b309ec8a8f4	bd7f5458-d4fc-427e-90d7-dbf85d4cf41b	seed-bulk-course-2	Bulk reminder 1	2026-05-06 14:33:25.364+03	2026-05-01 14:33:25.489+03	2026-05-07 23:29:32.088+03	\N	\N
1b069282-d48f-4361-becd-e6046671fed0	f2aa774e-fb5c-469b-9bf8-710cf58415f0	seed-bulk-course-3	Bulk reminder 2	2026-05-06 14:33:25.364+03	2026-05-01 14:33:25.495+03	2026-05-07 23:29:32.102+03	\N	\N
369228c6-f838-497d-a03d-1eaa77de31a4	f3433594-e441-43a8-996a-4f9cbeb7c632	seed-bulk-course-4	Bulk reminder 3	2026-05-06 14:33:25.364+03	2026-05-01 14:33:25.501+03	2026-05-07 23:29:32.104+03	\N	\N
11eab95d-9461-4175-aaa7-cf0da9cc5461	8c59b1c5-aeef-408f-abd9-0f0480a92150	seed-bulk-course-5	Bulk reminder 4	2026-05-06 14:33:25.364+03	2026-05-01 14:33:25.507+03	2026-05-07 23:29:32.108+03	\N	\N
8a929a15-c60a-4734-a67b-b59169485493	0083e3eb-4558-4cda-b979-156adf8274ff	seed-bulk-course-6	Bulk reminder 5	2026-05-06 14:33:25.364+03	2026-05-01 14:33:25.513+03	2026-05-07 23:29:32.112+03	\N	\N
e7a2d889-4e19-417a-85a8-132a857ff9df	a7ff1105-747d-4b12-a507-a9535a9f51f0	seed-bulk-course-7	Bulk reminder 6	2026-05-06 14:33:25.364+03	2026-05-01 14:33:25.518+03	2026-05-07 23:29:32.117+03	\N	\N
874350a1-c615-4012-901e-8989256769d4	fd5d0aa6-c15c-468b-81df-45fb675fad00	seed-bulk-course-8	Bulk reminder 7	2026-05-06 14:33:25.364+03	2026-05-01 14:33:25.523+03	2026-05-07 23:29:32.12+03	\N	\N
4b99bbea-a66b-4bd0-8d1d-0d6292fb7a0b	c4e7cafe-2491-4a88-a708-cbfbce627c75	seed-bulk-course-9	Bulk reminder 8	2026-05-06 14:33:25.364+03	2026-05-01 14:33:25.528+03	2026-05-07 23:29:32.124+03	\N	\N
34d2e87b-2e55-4605-8389-4295bfa4054c	0e2700bf-d311-4d6e-80e2-a1098ff642a2	seed-bulk-course-10	Bulk reminder 9	2026-05-06 14:33:25.364+03	2026-05-01 14:33:25.533+03	2026-05-07 23:29:32.127+03	\N	\N
a45f092e-c018-4ed7-82f0-5994cfaeec58	7dbd9524-5297-4c0b-b04d-466e2743191f	seed-bulk-course-11	Bulk reminder 10	2026-05-06 14:33:25.364+03	2026-05-01 14:33:25.538+03	2026-05-07 23:29:32.13+03	\N	\N
94f84e02-facc-4046-b026-99e7b6f30df3	b82b4e3a-013b-46d8-8961-2e0eb889af9e	\N	sfafsd	2026-07-30 03:00:00+03	2026-05-25 23:26:05.759+03	\N	\N	\N
5a97ae07-de24-4169-9716-4239b58ef2dc	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-course-en-a1	Повторить урок 2 (приветствия)	2026-05-29 23:06:50.356+03	2026-05-26 23:06:50.358+03	\N	\N	\N
\.


--
-- TOC entry 5069 (class 0 OID 32857)
-- Dependencies: 247
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (code) FROM stdin;
STUDENT
TEACHER
ADMIN
\.


--
-- TOC entry 5079 (class 0 OID 33003)
-- Dependencies: 257
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
seed-bulk-submission-student-1-1	bd7f5458-d4fc-427e-90d7-dbf85d4cf41b	seed-bulk-course-1-lesson-1-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.56
seed-bulk-submission-student-1-2	bd7f5458-d4fc-427e-90d7-dbf85d4cf41b	seed-bulk-course-1-lesson-1-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.561
seed-bulk-submission-student-1-3	bd7f5458-d4fc-427e-90d7-dbf85d4cf41b	seed-bulk-course-1-lesson-2-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.563
seed-bulk-submission-student-2-1	f2aa774e-fb5c-469b-9bf8-710cf58415f0	seed-bulk-course-1-lesson-2-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.564
seed-bulk-submission-student-2-2	f2aa774e-fb5c-469b-9bf8-710cf58415f0	seed-bulk-course-1-lesson-3-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.565
seed-bulk-submission-student-2-3	f2aa774e-fb5c-469b-9bf8-710cf58415f0	seed-bulk-course-1-lesson-3-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.566
seed-bulk-submission-student-3-1	f3433594-e441-43a8-996a-4f9cbeb7c632	seed-bulk-course-2-lesson-1-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.567
seed-bulk-submission-student-3-2	f3433594-e441-43a8-996a-4f9cbeb7c632	seed-bulk-course-2-lesson-1-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.568
seed-bulk-submission-student-3-3	f3433594-e441-43a8-996a-4f9cbeb7c632	seed-bulk-course-2-lesson-2-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.569
seed-bulk-submission-student-4-1	8c59b1c5-aeef-408f-abd9-0f0480a92150	seed-bulk-course-2-lesson-2-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.571
seed-bulk-submission-student-4-2	8c59b1c5-aeef-408f-abd9-0f0480a92150	seed-bulk-course-2-lesson-3-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.572
seed-bulk-submission-student-4-3	8c59b1c5-aeef-408f-abd9-0f0480a92150	seed-bulk-course-2-lesson-3-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.573
seed-bulk-submission-student-5-1	0083e3eb-4558-4cda-b979-156adf8274ff	seed-bulk-course-3-lesson-1-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.574
seed-bulk-submission-student-5-2	0083e3eb-4558-4cda-b979-156adf8274ff	seed-bulk-course-3-lesson-1-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.575
seed-bulk-submission-student-5-3	0083e3eb-4558-4cda-b979-156adf8274ff	seed-bulk-course-3-lesson-2-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.576
seed-bulk-submission-student-6-1	a7ff1105-747d-4b12-a507-a9535a9f51f0	seed-bulk-course-3-lesson-2-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.578
seed-bulk-submission-student-6-2	a7ff1105-747d-4b12-a507-a9535a9f51f0	seed-bulk-course-3-lesson-3-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.579
seed-bulk-submission-student-6-3	a7ff1105-747d-4b12-a507-a9535a9f51f0	seed-bulk-course-3-lesson-3-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.58
seed-bulk-submission-student-7-1	fd5d0aa6-c15c-468b-81df-45fb675fad00	seed-bulk-course-4-lesson-1-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.581
seed-bulk-submission-student-7-2	fd5d0aa6-c15c-468b-81df-45fb675fad00	seed-bulk-course-4-lesson-1-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.582
seed-bulk-submission-student-7-3	fd5d0aa6-c15c-468b-81df-45fb675fad00	seed-bulk-course-4-lesson-2-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.583
seed-bulk-submission-student-8-1	c4e7cafe-2491-4a88-a708-cbfbce627c75	seed-bulk-course-4-lesson-2-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.584
seed-bulk-submission-student-8-2	c4e7cafe-2491-4a88-a708-cbfbce627c75	seed-bulk-course-4-lesson-3-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.585
seed-bulk-submission-student-8-3	c4e7cafe-2491-4a88-a708-cbfbce627c75	seed-bulk-course-4-lesson-3-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.586
seed-bulk-submission-student-9-1	0e2700bf-d311-4d6e-80e2-a1098ff642a2	seed-bulk-course-5-lesson-1-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.588
seed-bulk-submission-student-9-2	0e2700bf-d311-4d6e-80e2-a1098ff642a2	seed-bulk-course-5-lesson-1-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.589
seed-bulk-submission-student-9-3	0e2700bf-d311-4d6e-80e2-a1098ff642a2	seed-bulk-course-5-lesson-2-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.59
seed-bulk-submission-student-10-1	7dbd9524-5297-4c0b-b04d-466e2743191f	seed-bulk-course-5-lesson-2-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.591
seed-bulk-submission-student-10-2	7dbd9524-5297-4c0b-b04d-466e2743191f	seed-bulk-course-5-lesson-3-exercise-1	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.592
seed-bulk-submission-student-10-3	7dbd9524-5297-4c0b-b04d-466e2743191f	seed-bulk-course-5-lesson-3-exercise-2	10	{"seed": true, "answer": "ok", "correct": true}	2026-05-01 11:33:25.593
seed-cohort-sub-1-a1-seed-en-a1-l1-ex2	seed-cohort-student-1	seed-en-a1-l1-ex2	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-23 09:00:00
b4e1cf5c-ee37-4df2-a124-33f4ca8886fe	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-10-lesson-1-exercise-1	0	{"answer": "123123", "correct": false}	2026-05-07 18:41:21.424
4aa33e4c-806e-4702-8557-8d0d86f8bc8e	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-10-lesson-1-exercise-2	0	{"answer": "12421412", "correct": false}	2026-05-07 18:41:24.861
cff770a9-ea38-493c-83a2-dfc1cc22bbb4	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-10-lesson-1-exercise-1	0	{"answer": "1.1", "correct": false}	2026-05-07 18:46:47.605
52030bb6-9a07-456a-8031-d738bbbf82a8	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-10-lesson-1-exercise-1	0	{"answer": "10", "correct": false}	2026-05-07 18:46:51.271
ef0099be-abad-4e0b-a0c0-2f060c2ea05b	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-bulk-course-10-lesson-1-exercise-1	0	{"answer": "10", "correct": false}	2026-05-07 18:46:52.161
d54fbd8c-a7c9-4897-99f2-266320210610	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-exercise-1	0	{"answer": "", "correct": false}	2026-05-07 19:18:35.321
9bf4cb1a-6f8b-4e4e-ae55-29261ad78e9f	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-exercise-1	0	{"answer": "цафаф", "correct": false}	2026-05-07 19:18:40.585
9abee99c-41a3-4e9e-b4c9-af5e3926a096	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-exercise-1	0	{"answer": "цафаф", "correct": false}	2026-05-07 19:18:41.383
6a9db088-0fc5-47ac-9891-00f405ccbdf9	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l1-ex2	0	{"answer": "31", "correct": false}	2026-05-07 19:18:58.018
8d7b4687-9b4d-4c24-b312-8faa5167b0e5	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l1-ex2	5	{"answer": "5", "correct": true}	2026-05-07 19:19:22.826
56ba6164-a17e-419d-bb1a-a53f8370d1c7	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l2-ex1	0	{"answer": "Hi", "correct": false}	2026-05-07 19:22:56.757
a1406391-26b0-483c-ae03-f445d463907e	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l2-ex1	0	{"answer": "hi", "correct": false}	2026-05-07 19:23:11.887
seed-cohort-sub-1-a1-seed-en-a1-l2-ex1	seed-cohort-student-1	seed-en-a1-l2-ex1	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-23 09:00:00
seed-cohort-sub-1-a1-seed-en-a1-l2-ex2	seed-cohort-student-1	seed-en-a1-l2-ex2	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-23 09:00:00
seed-cohort-sub-1-a1-seed-en-a1-l3-ex1	seed-cohort-student-1	seed-en-a1-l3-ex1	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-23 09:00:00
seed-cohort-sub-1-b1-seed-en-b1-l1-ex1	seed-cohort-student-1	seed-en-b1-l1-ex1	10	{"answer": "agenda", "cohort": true, "correct": true}	2026-05-23 09:00:00
seed-cohort-sub-1-b1-seed-en-b1-l2-ex1	seed-cohort-student-1	seed-en-b1-l2-ex1	10	{"answer": "I'm not sure I fully agree", "cohort": true, "correct": true}	2026-05-23 09:00:00
seed-cohort-sub-2-a1-seed-en-a1-l1-ex1	seed-cohort-student-2	seed-en-a1-l1-ex1	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-23 09:00:00
seed-cohort-sub-2-a1-seed-en-a1-l1-ex2	seed-cohort-student-2	seed-en-a1-l1-ex2	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-23 09:00:00
seed-cohort-sub-2-a1-seed-en-a1-l2-ex1	seed-cohort-student-2	seed-en-a1-l2-ex1	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-23 09:00:00
seed-cohort-sub-2-a1-seed-en-a1-l2-ex2	seed-cohort-student-2	seed-en-a1-l2-ex2	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-23 09:00:00
seed-cohort-sub-2-a1-seed-en-a1-l3-ex1	seed-cohort-student-2	seed-en-a1-l3-ex1	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-23 09:00:00
seed-cohort-sub-2-b1-seed-en-b1-l1-ex1	seed-cohort-student-2	seed-en-b1-l1-ex1	10	{"answer": "agenda", "cohort": true, "correct": true}	2026-05-23 09:00:00
seed-cohort-sub-3-a1-seed-en-a1-l1-ex1	seed-cohort-student-3	seed-en-a1-l1-ex1	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-21 09:00:00
seed-cohort-sub-3-a1-seed-en-a1-l1-ex2	seed-cohort-student-3	seed-en-a1-l1-ex2	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-21 09:00:00
seed-cohort-sub-3-a1-seed-en-a1-l2-ex1	seed-cohort-student-3	seed-en-a1-l2-ex1	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-21 09:00:00
seed-cohort-sub-3-a1-seed-en-a1-l2-ex2	seed-cohort-student-3	seed-en-a1-l2-ex2	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-21 09:00:00
seed-cohort-sub-3-b1-seed-en-b1-l1-ex1	seed-cohort-student-3	seed-en-b1-l1-ex1	10	{"answer": "agenda", "cohort": true, "correct": true}	2026-05-21 09:00:00
seed-cohort-sub-4-a1-seed-en-a1-l1-ex1	seed-cohort-student-4	seed-en-a1-l1-ex1	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-16 09:00:00
seed-cohort-sub-4-a1-seed-en-a1-l1-ex2	seed-cohort-student-4	seed-en-a1-l1-ex2	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-16 09:00:00
seed-cohort-sub-4-a1-seed-en-a1-l2-ex1	seed-cohort-student-4	seed-en-a1-l2-ex1	10	{"answer": "seed", "cohort": true, "correct": true}	2026-05-16 09:00:00
seed-cohort-sub-4-b1-seed-en-b1-l1-ex1	seed-cohort-student-4	seed-en-b1-l1-ex1	5	{"answer": "partial", "cohort": true, "correct": false}	2026-05-16 09:00:00
seed-cohort-sub-5-a1-seed-en-a1-l1-ex1	seed-cohort-student-5	seed-en-a1-l1-ex1	5	{"answer": "seed", "cohort": true, "correct": true}	2026-04-26 09:00:00
seed-cohort-sub-5-a1-seed-en-a1-l1-ex2	seed-cohort-student-5	seed-en-a1-l1-ex2	5	{"answer": "seed", "cohort": true, "correct": true}	2026-04-26 09:00:00
ce31b9e4-c542-4567-91f0-bc6a68809a97	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l2-ex1	0	{"answer": "hi", "correct": false}	2026-05-07 19:23:13.168
06379281-d5fb-46d3-aae9-9ede9892adfe	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l2-ex1	10	{"answer": "Hello", "correct": true}	2026-05-07 19:23:18.904
fdbd9665-ce43-443d-89c3-9a48e2129504	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l2-ex2	10	{"answer": "too", "correct": true}	2026-05-07 19:23:30.613
95eea040-2ced-4eea-894f-2eea0d83c8f6	b82b4e3a-013b-46d8-8961-2e0eb889af9e	seed-en-a1-l3-ex1	10	{"answer": "12", "correct": true}	2026-05-07 19:23:39.984
57d4343b-35a1-4ba8-a0ef-1c4dd29f42cb	d18fea24-e53c-4793-b907-46fadaee220a	seed-bulk-course-11-lesson-1-exercise-1	0	{"answer": "awesgasgas", "correct": false}	2026-05-25 10:53:43.519
8e77282f-91f6-41de-92a1-a7fbe940d35e	d18fea24-e53c-4793-b907-46fadaee220a	seed-bulk-course-11-lesson-1-exercise-2	0	{"answer": "agfagawegegs", "correct": false}	2026-05-25 10:53:45.367
seed-cohort-sub-1-a1-seed-en-a1-l1-ex1	seed-cohort-student-1	seed-en-a1-l1-ex1	5	{"answer": "seed", "cohort": true, "correct": true}	2026-05-23 09:00:00
seed-cohort-sub-2-b1-seed-en-b1-l2-ex1	seed-cohort-student-2	seed-en-b1-l2-ex1	10	{"answer": "I'm not sure I fully agree", "cohort": true, "correct": true}	2026-05-23 09:00:00
\.


--
-- TOC entry 5071 (class 0 OID 32877)
-- Dependencies: 249
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
bb53f571-5886-48e4-9f1a-6aa23c919f68	TEACHER
bd7f5458-d4fc-427e-90d7-dbf85d4cf41b	STUDENT
f2aa774e-fb5c-469b-9bf8-710cf58415f0	STUDENT
f3433594-e441-43a8-996a-4f9cbeb7c632	STUDENT
8c59b1c5-aeef-408f-abd9-0f0480a92150	STUDENT
0083e3eb-4558-4cda-b979-156adf8274ff	STUDENT
a7ff1105-747d-4b12-a507-a9535a9f51f0	STUDENT
fd5d0aa6-c15c-468b-81df-45fb675fad00	STUDENT
c4e7cafe-2491-4a88-a708-cbfbce627c75	STUDENT
0e2700bf-d311-4d6e-80e2-a1098ff642a2	STUDENT
7dbd9524-5297-4c0b-b04d-466e2743191f	STUDENT
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
\.


--
-- TOC entry 5070 (class 0 OID 32863)
-- Dependencies: 248
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
bb53f571-5886-48e4-9f1a-6aa23c919f68	seed.bulk.teacher@vsvh.demo	$2b$10$p2FkJ5n0dHR6g5vkGEJJbeTDLmRujKT4K9lSLPVwq59/vu9F2dLG2	Seed Bulk Teacher	2026-05-01 11:33:24.646	2026-05-01 11:33:24.646
bd7f5458-d4fc-427e-90d7-dbf85d4cf41b	seed.bulk.student1@vsvh.demo	$2b$10$fXTcjV463cXTuyfuNE86sOworq7WpSYYf3Mr6tr0cbKRlL3JdScDm	Seed Student 1	2026-05-01 11:33:24.717	2026-05-01 11:33:24.717
f2aa774e-fb5c-469b-9bf8-710cf58415f0	seed.bulk.student2@vsvh.demo	$2b$10$bJUys5QrHVHx6JxuVS6bzOWOnljigxQEjz0GeZ.uf9qRC8ZIBWBe.	Seed Student 2	2026-05-01 11:33:24.785	2026-05-01 11:33:24.785
f3433594-e441-43a8-996a-4f9cbeb7c632	seed.bulk.student3@vsvh.demo	$2b$10$ngj3M.VnRt0c0el/QNuow.DnP7q2NIqt4dXzcM8zEYMUPPa/B0aGy	Seed Student 3	2026-05-01 11:33:24.855	2026-05-01 11:33:24.855
8c59b1c5-aeef-408f-abd9-0f0480a92150	seed.bulk.student4@vsvh.demo	$2b$10$RYvzcvdMBMyKOTOgw.jEVueIiWcKCYCpZabXDVj/gwZzGLAeQbhbq	Seed Student 4	2026-05-01 11:33:24.924	2026-05-01 11:33:24.924
0083e3eb-4558-4cda-b979-156adf8274ff	seed.bulk.student5@vsvh.demo	$2b$10$UAflBKI.RNAztUBofuzWM.GfvZieYxLEQkkLVokUH7ECswJvuhBly	Seed Student 5	2026-05-01 11:33:24.992	2026-05-01 11:33:24.992
a7ff1105-747d-4b12-a507-a9535a9f51f0	seed.bulk.student6@vsvh.demo	$2b$10$TKarqGscXCkPPxUJwyg8Sufw6Os5mCOYA2UAYIAvTDDBrzXZaKQ8m	Seed Student 6	2026-05-01 11:33:25.061	2026-05-01 11:33:25.061
fd5d0aa6-c15c-468b-81df-45fb675fad00	seed.bulk.student7@vsvh.demo	$2b$10$2vlKC04OeNQCwGziW57VEOry47DTAWeMy/EZOGeWWyPJzC3YAM8mO	Seed Student 7	2026-05-01 11:33:25.128	2026-05-01 11:33:25.128
c4e7cafe-2491-4a88-a708-cbfbce627c75	seed.bulk.student8@vsvh.demo	$2b$10$bWg9OAGknS4G1wH0BHP3Ze6kjt9JYNzvUMUDSwgrj4MSLquUaHEjW	Seed Student 8	2026-05-01 11:33:25.196	2026-05-01 11:33:25.196
0e2700bf-d311-4d6e-80e2-a1098ff642a2	seed.bulk.student9@vsvh.demo	$2b$10$I7x5iift9XQVeuruDeknGucZZqcRMgIeuPcEtEiDWQRwFfySWYcUG	Seed Student 9	2026-05-01 11:33:25.264	2026-05-01 11:33:25.264
7dbd9524-5297-4c0b-b04d-466e2743191f	seed.bulk.student10@vsvh.demo	$2b$10$.qES69kVnN76LT.RSHisBukUZV1dltA6PpETQC8XHs4Ia6KmO7tSa	Seed Student 10	2026-05-01 11:33:25.331	2026-05-01 11:33:25.331
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
\.


--
-- TOC entry 4859 (class 2606 OID 32838)
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 4891 (class 2606 OID 32990)
-- Name: certificates certificates_document_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_document_number_key UNIQUE (document_number);


--
-- TOC entry 4893 (class 2606 OID 32988)
-- Name: certificates certificates_enrollment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_enrollment_id_key UNIQUE (enrollment_id);


--
-- TOC entry 4895 (class 2606 OID 32986)
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- TOC entry 4878 (class 2606 OID 32933)
-- Name: course_reviews course_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4872 (class 2606 OID 32917)
-- Name: course_staff course_staff_course_id_user_id_staff_role_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_staff
    ADD CONSTRAINT course_staff_course_id_user_id_staff_role_key UNIQUE (course_id, user_id, staff_role);


--
-- TOC entry 4874 (class 2606 OID 32915)
-- Name: course_staff course_staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_staff
    ADD CONSTRAINT course_staff_pkey PRIMARY KEY (id);


--
-- TOC entry 4868 (class 2606 OID 32902)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 4888 (class 2606 OID 32974)
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 4885 (class 2606 OID 32959)
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 33028)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 4882 (class 2606 OID 32946)
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- TOC entry 4903 (class 2606 OID 33041)
-- Name: reminders reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_pkey PRIMARY KEY (id);


--
-- TOC entry 4861 (class 2606 OID 32862)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (code);


--
-- TOC entry 4897 (class 2606 OID 33016)
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4866 (class 2606 OID 32885)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_code);


--
-- TOC entry 4864 (class 2606 OID 32876)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4876 (class 1259 OID 33048)
-- Name: course_reviews_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX course_reviews_course_id_idx ON public.course_reviews USING btree (course_id);


--
-- TOC entry 4879 (class 1259 OID 33043)
-- Name: course_reviews_user_id_course_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX course_reviews_user_id_course_id_key ON public.course_reviews USING btree (user_id, course_id);


--
-- TOC entry 4870 (class 1259 OID 33047)
-- Name: course_staff_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX course_staff_course_id_idx ON public.course_staff USING btree (course_id);


--
-- TOC entry 4875 (class 1259 OID 33150)
-- Name: course_staff_user_id_staff_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX course_staff_user_id_staff_role_idx ON public.course_staff USING btree (user_id, staff_role);


--
-- TOC entry 4869 (class 1259 OID 33049)
-- Name: courses_rating_average_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX courses_rating_average_idx ON public.courses USING btree (rating_average);


--
-- TOC entry 4886 (class 1259 OID 33146)
-- Name: enrollments_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX enrollments_course_id_idx ON public.enrollments USING btree (course_id);


--
-- TOC entry 4889 (class 1259 OID 33044)
-- Name: enrollments_user_id_course_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX enrollments_user_id_course_id_key ON public.enrollments USING btree (user_id, course_id);


--
-- TOC entry 4883 (class 1259 OID 33148)
-- Name: exercises_lesson_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX exercises_lesson_id_idx ON public.exercises USING btree (lesson_id);


--
-- TOC entry 4901 (class 1259 OID 33046)
-- Name: favorites_user_id_course_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX favorites_user_id_course_id_key ON public.favorites USING btree (user_id, course_id);


--
-- TOC entry 4880 (class 1259 OID 33147)
-- Name: lessons_course_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lessons_course_id_idx ON public.lessons USING btree (course_id);


--
-- TOC entry 4898 (class 1259 OID 33149)
-- Name: submissions_user_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX submissions_user_id_created_at_idx ON public.submissions USING btree (user_id, created_at DESC);


--
-- TOC entry 4862 (class 1259 OID 33042)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 4914 (class 2606 OID 33100)
-- Name: certificates certificates_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4908 (class 2606 OID 33075)
-- Name: course_reviews course_reviews_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4909 (class 2606 OID 33070)
-- Name: course_reviews course_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_reviews
    ADD CONSTRAINT course_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4906 (class 2606 OID 33060)
-- Name: course_staff course_staff_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_staff
    ADD CONSTRAINT course_staff_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4907 (class 2606 OID 33065)
-- Name: course_staff course_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_staff
    ADD CONSTRAINT course_staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4912 (class 2606 OID 33095)
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4913 (class 2606 OID 33090)
-- Name: enrollments enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4911 (class 2606 OID 33085)
-- Name: exercises exercises_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4917 (class 2606 OID 33130)
-- Name: favorites favorites_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4918 (class 2606 OID 33125)
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4910 (class 2606 OID 33080)
-- Name: lessons lessons_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4919 (class 2606 OID 33140)
-- Name: reminders reminders_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4920 (class 2606 OID 33135)
-- Name: reminders reminders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4915 (class 2606 OID 33120)
-- Name: submissions submissions_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4916 (class 2606 OID 33115)
-- Name: submissions submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4904 (class 2606 OID 33055)
-- Name: user_roles user_roles_role_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_code_fkey FOREIGN KEY (role_code) REFERENCES public.roles(code) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4905 (class 2606 OID 33050)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-05-27 01:42:23

--
-- PostgreSQL database dump complete
--

\unrestrict cBwqMrsQMEnXRupFfgODUsR0iQmmtDrlqiJCzU5HMXT4hjVVrgCFH7Pfcy0WniI

