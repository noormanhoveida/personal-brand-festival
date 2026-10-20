--
-- PostgreSQL database dump
--

\restrict Hz3cxyDBpkOWlfnr1chsw8xMcGbqUFy1rEXKvoDx9125IbSRsgy7dAIn3PMy5u1

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AnswerStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AnswerStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED'
);


ALTER TYPE public."AnswerStatus" OWNER TO postgres;

--
-- Name: ApprovalStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ApprovalStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."ApprovalStatus" OWNER TO postgres;

--
-- Name: BootcampStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BootcampStatus" AS ENUM (
    'LOCKED',
    'COMING_SOON',
    'ACTIVE',
    'DEADLINE_APPROACHING',
    'SUBMITTED',
    'COMPLETED'
);


ALTER TYPE public."BootcampStatus" OWNER TO postgres;

--
-- Name: EndorsementVote; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EndorsementVote" AS ENUM (
    'ENDORSE',
    'REJECT'
);


ALTER TYPE public."EndorsementVote" OWNER TO postgres;

--
-- Name: EvaluationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EvaluationStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED'
);


ALTER TYPE public."EvaluationStatus" OWNER TO postgres;

--
-- Name: FeedbackVisibility; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."FeedbackVisibility" AS ENUM (
    'ANONYMOUS',
    'PUBLIC',
    'PRIVATE',
    'EVALUATOR_ONLY'
);


ALTER TYPE public."FeedbackVisibility" OWNER TO postgres;

--
-- Name: FormStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."FormStatus" AS ENUM (
    'DRAFT',
    'ACTIVE',
    'ARCHIVED'
);


ALTER TYPE public."FormStatus" OWNER TO postgres;

--
-- Name: FormType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."FormType" AS ENUM (
    'EVALUATION',
    'PRE_ASSESSMENT'
);


ALTER TYPE public."FormType" OWNER TO postgres;

--
-- Name: LeaderboardKind; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LeaderboardKind" AS ENUM (
    'SYSTEM',
    'CUSTOM'
);


ALTER TYPE public."LeaderboardKind" OWNER TO postgres;

--
-- Name: LiveSessionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LiveSessionStatus" AS ENUM (
    'OPEN',
    'GROUPED',
    'CLOSED'
);


ALTER TYPE public."LiveSessionStatus" OWNER TO postgres;

--
-- Name: MediaType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MediaType" AS ENUM (
    'PROFILE_PORTRAIT',
    'HERO_PORTRAIT',
    'PROFESSIONAL',
    'LIFESTYLE',
    'GALLERY'
);


ALTER TYPE public."MediaType" OWNER TO postgres;

--
-- Name: QuestionInputType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."QuestionInputType" AS ENUM (
    'TEXT',
    'LINK',
    'PHOTO',
    'TRAIT_TAG',
    'SINGLE_CHOICE',
    'MULTI_CHOICE'
);


ALTER TYPE public."QuestionInputType" OWNER TO postgres;

--
-- Name: ResponseStage; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ResponseStage" AS ENUM (
    'BEFORE',
    'AFTER',
    'REVISION'
);


ALTER TYPE public."ResponseStage" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'VISITOR',
    'PARTICIPANT',
    'EVALUATOR',
    'BOOTCAMP_MANAGER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: Visibility; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Visibility" AS ENUM (
    'PRIVATE',
    'EVALUATOR_ONLY',
    'PARTICIPANTS_ONLY',
    'PUBLIC'
);


ALTER TYPE public."Visibility" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ActivityLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ActivityLog" (
    id text NOT NULL,
    "userId" text NOT NULL,
    action text NOT NULL,
    meta jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ActivityLog" OWNER TO postgres;

--
-- Name: Bootcamp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Bootcamp" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    instructor text,
    "coverImageUrl" text,
    date timestamp(3) without time zone NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    status public."BootcampStatus" DEFAULT 'COMING_SOON'::public."BootcampStatus" NOT NULL,
    deadline timestamp(3) without time zone,
    "journeySectionId" text,
    "teaserVideoUrl" text,
    "recordingUrl" text
);


ALTER TABLE public."Bootcamp" OWNER TO postgres;

--
-- Name: BootcampAccess; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BootcampAccess" (
    id text NOT NULL,
    "bootcampId" text NOT NULL,
    "participantId" text NOT NULL,
    "grantedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."BootcampAccess" OWNER TO postgres;

--
-- Name: ChallengeSubmission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChallengeSubmission" (
    id text NOT NULL,
    "challengeId" text NOT NULL,
    "participantId" text NOT NULL,
    "textContent" text,
    "photoUrl" text,
    "documentUrl" text,
    "linkUrl" text,
    "submittedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "sentToInstructorAt" timestamp(3) without time zone
);


ALTER TABLE public."ChallengeSubmission" OWNER TO postgres;

--
-- Name: ChallengeSubmissionVersion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChallengeSubmissionVersion" (
    id text NOT NULL,
    "challengeSubmissionId" text NOT NULL,
    "versionNumber" integer NOT NULL,
    "textContent" text,
    "photoUrl" text,
    "documentUrl" text,
    "linkUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ChallengeSubmissionVersion" OWNER TO postgres;

--
-- Name: EmailVerificationCode; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EmailVerificationCode" (
    id text NOT NULL,
    "userId" text NOT NULL,
    code text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EmailVerificationCode" OWNER TO postgres;

--
-- Name: Evaluation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Evaluation" (
    id text NOT NULL,
    "participantId" text NOT NULL,
    "evaluatorUserId" text NOT NULL,
    status public."EvaluationStatus" DEFAULT 'DRAFT'::public."EvaluationStatus" NOT NULL,
    "transformationScore" double precision,
    "finalScore" double precision,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Evaluation" OWNER TO postgres;

--
-- Name: EvaluationCriterion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EvaluationCriterion" (
    id text NOT NULL,
    key text NOT NULL,
    title text NOT NULL,
    description text,
    weight double precision NOT NULL
);


ALTER TABLE public."EvaluationCriterion" OWNER TO postgres;

--
-- Name: EvaluationScore; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EvaluationScore" (
    id text NOT NULL,
    "evaluationId" text NOT NULL,
    "criterionId" text NOT NULL,
    score double precision NOT NULL,
    comment text
);


ALTER TABLE public."EvaluationScore" OWNER TO postgres;

--
-- Name: EvaluatorAssignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EvaluatorAssignment" (
    id text NOT NULL,
    "evaluatorUserId" text NOT NULL,
    "participantId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EvaluatorAssignment" OWNER TO postgres;

--
-- Name: FeedbackRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FeedbackRequest" (
    id text NOT NULL,
    "requesterId" text NOT NULL,
    "linkToken" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone
);


ALTER TABLE public."FeedbackRequest" OWNER TO postgres;

--
-- Name: FeedbackResponse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FeedbackResponse" (
    id text NOT NULL,
    "requestId" text NOT NULL,
    "authorParticipantId" text,
    "authorName" text,
    answers jsonb NOT NULL,
    visibility public."FeedbackVisibility" DEFAULT 'PRIVATE'::public."FeedbackVisibility" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."FeedbackResponse" OWNER TO postgres;

--
-- Name: Form; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Form" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    "isActive" boolean DEFAULT false NOT NULL,
    status public."FormStatus" DEFAULT 'DRAFT'::public."FormStatus" NOT NULL,
    "themeConfig" jsonb,
    "startsAt" timestamp(3) without time zone,
    "endsAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "bootcampId" text,
    "bootcampStatusTrigger" public."BootcampStatus",
    type public."FormType" DEFAULT 'EVALUATION'::public."FormType" NOT NULL
);


ALTER TABLE public."Form" OWNER TO postgres;

--
-- Name: FormAnswer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FormAnswer" (
    id text NOT NULL,
    "formId" text NOT NULL,
    "participantId" text,
    "guestEmail" text,
    "guestName" text,
    status public."AnswerStatus" DEFAULT 'DRAFT'::public."AnswerStatus" NOT NULL,
    "totalScore" double precision,
    "submittedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FormAnswer" OWNER TO postgres;

--
-- Name: FormAnswerItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FormAnswerItem" (
    id text NOT NULL,
    "answerId" text NOT NULL,
    "formQuestionId" text NOT NULL,
    value jsonb NOT NULL,
    "autoScore" double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."FormAnswerItem" OWNER TO postgres;

--
-- Name: FormQuestion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FormQuestion" (
    id text NOT NULL,
    "formId" text NOT NULL,
    "questionId" text,
    label text NOT NULL,
    "helpText" text,
    "inputType" public."QuestionInputType" DEFAULT 'TEXT'::public."QuestionInputType" NOT NULL,
    options text[] DEFAULT ARRAY[]::text[],
    "isRequired" boolean DEFAULT true NOT NULL,
    weight double precision,
    "order" integer DEFAULT 0 NOT NULL,
    config jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."FormQuestion" OWNER TO postgres;

--
-- Name: JourneySection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JourneySection" (
    id text NOT NULL,
    key text NOT NULL,
    title text NOT NULL,
    description text,
    "order" integer NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" text
);


ALTER TABLE public."JourneySection" OWNER TO postgres;

--
-- Name: LandingSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LandingSetting" (
    key text NOT NULL,
    data jsonb NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LandingSetting" OWNER TO postgres;

--
-- Name: Leaderboard; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Leaderboard" (
    id text NOT NULL,
    key text,
    kind public."LeaderboardKind" NOT NULL,
    title text NOT NULL,
    description text,
    "createdByUserId" text,
    published boolean DEFAULT false NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Leaderboard" OWNER TO postgres;

--
-- Name: LeaderboardEntry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LeaderboardEntry" (
    id text NOT NULL,
    "leaderboardId" text NOT NULL,
    "participantId" text NOT NULL,
    score double precision NOT NULL,
    note text,
    "scoredByUserId" text NOT NULL,
    "scoredAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."LeaderboardEntry" OWNER TO postgres;

--
-- Name: LiveGroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LiveGroup" (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."LiveGroup" OWNER TO postgres;

--
-- Name: LiveMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LiveMessage" (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    "groupId" text,
    "senderId" text NOT NULL,
    "receiverId" text,
    content text,
    "fileUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."LiveMessage" OWNER TO postgres;

--
-- Name: LivePresence; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LivePresence" (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    "participantId" text NOT NULL,
    online boolean DEFAULT true NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastSeenAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "groupId" text
);


ALTER TABLE public."LivePresence" OWNER TO postgres;

--
-- Name: LiveSession; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LiveSession" (
    id text NOT NULL,
    "bootcampId" text NOT NULL,
    status public."LiveSessionStatus" DEFAULT 'OPEN'::public."LiveSessionStatus" NOT NULL,
    "taskBrief" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "groupedAt" timestamp(3) without time zone,
    "closedAt" timestamp(3) without time zone
);


ALTER TABLE public."LiveSession" OWNER TO postgres;

--
-- Name: Media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Media" (
    id text NOT NULL,
    "participantId" text NOT NULL,
    type public."MediaType" NOT NULL,
    url text NOT NULL,
    "mimeType" text NOT NULL,
    "sizeBytes" integer NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Media" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: ParticipantProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ParticipantProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    mobile text NOT NULL,
    province text NOT NULL,
    city text NOT NULL,
    "educationLevel" text,
    "fieldOfStudy" text,
    "professionalField" text,
    occupation text,
    bio text,
    interests text[],
    "regionId" text,
    slug text NOT NULL,
    "pageVisibility" public."Visibility" DEFAULT 'PRIVATE'::public."Visibility" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ParticipantProfile" OWNER TO postgres;

--
-- Name: PersonalPage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PersonalPage" (
    id text NOT NULL,
    "participantId" text NOT NULL,
    tagline text,
    "identityWords" text[],
    "strengthsJson" jsonb,
    "valuesJson" jsonb,
    "introText" text,
    "introMediaUrl" text,
    "roadmapText" text,
    featured boolean DEFAULT false NOT NULL,
    finalist boolean DEFAULT false NOT NULL,
    "winnerCategory" text,
    "publishedAt" timestamp(3) without time zone
);


ALTER TABLE public."PersonalPage" OWNER TO postgres;

--
-- Name: PhoneVerificationCode; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PhoneVerificationCode" (
    id text NOT NULL,
    "userId" text NOT NULL,
    code text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PhoneVerificationCode" OWNER TO postgres;

--
-- Name: PreAssessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PreAssessment" (
    id text NOT NULL,
    "participantId" text NOT NULL,
    university text,
    "linkedinUrl" text,
    "personalWebsiteUrl" text,
    "instagramHandle" text,
    "programGoal" text,
    "goalDescription" text,
    "selfAssessment" jsonb NOT NULL,
    "qualitativeAnswers" jsonb NOT NULL,
    "digitalPresence" jsonb NOT NULL,
    "coordinatorNote" text,
    "submittedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PreAssessment" OWNER TO postgres;

--
-- Name: Question; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Question" (
    id text NOT NULL,
    text text NOT NULL,
    stage public."ResponseStage" NOT NULL,
    "inputType" public."QuestionInputType" DEFAULT 'TEXT'::public."QuestionInputType" NOT NULL,
    options text[] DEFAULT ARRAY[]::text[],
    "situationId" text,
    "traitId" text,
    "correctOption" text,
    "weightCorrect" integer,
    "weightIncorrect" integer,
    "journeySectionId" text,
    "bootcampId" text,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Question" OWNER TO postgres;

--
-- Name: RefreshToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RefreshToken" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "tokenHash" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    revoked boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RefreshToken" OWNER TO postgres;

--
-- Name: Region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Region" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Region" OWNER TO postgres;

--
-- Name: Response; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Response" (
    id text NOT NULL,
    "participantId" text NOT NULL,
    "questionId" text NOT NULL,
    visibility public."Visibility" DEFAULT 'PRIVATE'::public."Visibility" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "selfTransformationScore" integer,
    "reviewerScore" integer,
    "reviewerFeedback" text
);


ALTER TABLE public."Response" OWNER TO postgres;

--
-- Name: ResponseVersion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ResponseVersion" (
    id text NOT NULL,
    "responseId" text NOT NULL,
    "versionNumber" integer NOT NULL,
    content text NOT NULL,
    stage public."ResponseStage" NOT NULL,
    "bootcampId" text,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "autoScore" double precision,
    "approvalStatus" public."ApprovalStatus" DEFAULT 'PENDING'::public."ApprovalStatus" NOT NULL,
    "approvedBy" text,
    "approvedAt" timestamp(3) without time zone
);


ALTER TABLE public."ResponseVersion" OWNER TO postgres;

--
-- Name: Situation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Situation" (
    id text NOT NULL,
    key text NOT NULL,
    title text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Situation" OWNER TO postgres;

--
-- Name: Skill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Skill" (
    id text NOT NULL,
    "participantId" text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Skill" OWNER TO postgres;

--
-- Name: SkillEndorsement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SkillEndorsement" (
    id text NOT NULL,
    "skillId" text NOT NULL,
    "endorserName" text,
    vote public."EndorsementVote" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SkillEndorsement" OWNER TO postgres;

--
-- Name: Task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Task" (
    id text NOT NULL,
    "bootcampId" text NOT NULL,
    title text NOT NULL,
    description text
);


ALTER TABLE public."Task" OWNER TO postgres;

--
-- Name: TaskSubmission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TaskSubmission" (
    id text NOT NULL,
    "taskId" text NOT NULL,
    "participantId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "approvalStatus" public."ApprovalStatus" DEFAULT 'PENDING'::public."ApprovalStatus" NOT NULL,
    "approvedBy" text,
    "approvedAt" timestamp(3) without time zone,
    score double precision
);


ALTER TABLE public."TaskSubmission" OWNER TO postgres;

--
-- Name: Trait; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Trait" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Trait" OWNER TO postgres;

--
-- Name: TraitWeight; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TraitWeight" (
    id text NOT NULL,
    "traitId" text NOT NULL,
    "situationId" text NOT NULL,
    weight double precision NOT NULL,
    text text,
    "mismatchWeight" double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."TraitWeight" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text,
    "passwordHash" text NOT NULL,
    role public."Role" DEFAULT 'PARTICIPANT'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    phone text,
    "phoneVerified" boolean DEFAULT false NOT NULL,
    "passwordResetCodeHash" text,
    "passwordResetExpiresAt" timestamp without time zone
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: WeeklyChallenge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WeeklyChallenge" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "instructorName" text,
    "instructorEmail" text,
    "opensAt" timestamp(3) without time zone,
    deadline timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdByUserId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WeeklyChallenge" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: ActivityLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ActivityLog" (id, "userId", action, meta, "createdAt") FROM stdin;
\.


--
-- Data for Name: Bootcamp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Bootcamp" (id, title, description, instructor, "coverImageUrl", date, "startTime", "endTime", status, deadline, "journeySectionId", "teaserVideoUrl", "recordingUrl") FROM stdin;
d317a886-786d-4077-b4dc-9243507c2275	آکادمی هوش یار؛ جلسه دوم؛ با مدرک حرف بزن؛ از ادعا تا روایت	چرا باید مرا باور کنند؟ و داستان من چیست؟\nاگر همین حالا کسی بخواهد حرف شما را راستی‌آزمایی کند، چقدر مدرک آمادهٔ ارائه دارید؟	آقای سعید میرشاهی	\N	2026-10-11 19:00:00	2026-10-11 19:00:00	2026-10-11 20:30:00	ACTIVE	\N	416299f6-e1d1-4205-8070-75a5c8101f81	\N	\N
0c753d22-b105-458e-b5eb-0e97105dad14	آکادمی هوش یار؛ جلسه اول؛ پرونده من	من کی هستم؟ چه چیزی مرا متفاوت می کند؟ چرا باید مرا باور کنند؟ داستان من چیست؟	آقای آرمین اروجی	https://pbfestival.ir/uploads/754cf955-256f-4ca2-8f40-b0ed94c96ebe.png	2026-10-03 14:19:00	2026-10-03 14:19:00	2026-10-03 14:19:00	COMPLETED	\N	\N	https://pbfestival.ir/uploads/1d402451-dfec-4e9a-aa9f-fa409a8e6a12.mp4	https://drive.google.com/file/d/1FwIUEDcE2P9G9h4xKvxSxrCDEl3INOhM/view?usp=drivesdk
\.


--
-- Data for Name: BootcampAccess; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BootcampAccess" (id, "bootcampId", "participantId", "grantedAt") FROM stdin;
5db2670c-b1e2-4685-983f-d9633115da62	0c753d22-b105-458e-b5eb-0e97105dad14	d3fa51ef-b17a-49f0-8b6e-da5943681ced	2026-10-05 12:13:08.845
3188a23c-8221-467d-ad2f-2646520ed249	0c753d22-b105-458e-b5eb-0e97105dad14	c41544a9-9932-4ddc-8e3d-170652b7ecb0	2026-10-06 08:37:57.789
1cb6ccc4-cbf3-4768-b79a-7f3969eadffa	0c753d22-b105-458e-b5eb-0e97105dad14	54832d93-ca2a-4d09-8ec4-39d6b00adb46	2026-10-06 08:37:58.725
4dbf89d1-5d86-464a-917d-999940bb23a9	0c753d22-b105-458e-b5eb-0e97105dad14	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	2026-10-06 08:37:59.467
c9b3dbf7-d264-4d87-b2b4-5738091b6e1c	0c753d22-b105-458e-b5eb-0e97105dad14	17018422-10ed-4495-b180-ec4b7ee69ad8	2026-10-08 11:29:28.761
aca6b9c5-9fc4-42b4-a053-83a3d12ea1f5	0c753d22-b105-458e-b5eb-0e97105dad14	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	2026-10-09 17:55:57.194
001605d0-3516-41a2-a434-cb78559684b6	0c753d22-b105-458e-b5eb-0e97105dad14	cec264cc-c421-4069-8154-331731108821	2026-10-10 18:14:14.244
88903d12-b869-4fd7-bb4b-3781d4771a4a	0c753d22-b105-458e-b5eb-0e97105dad14	ee64d124-1c6f-4fdf-badc-e1d596010245	2026-10-10 18:14:22.332
dcaddbcb-5e3c-49e9-8b9c-f5aa510bab98	0c753d22-b105-458e-b5eb-0e97105dad14	cf562c3e-e18a-4d28-8ebe-2d2779a8e0fa	2026-10-10 18:14:23.517
\.


--
-- Data for Name: ChallengeSubmission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChallengeSubmission" (id, "challengeId", "participantId", "textContent", "photoUrl", "documentUrl", "linkUrl", "submittedAt", "updatedAt", "sentToInstructorAt") FROM stdin;
7a51198c-8784-4885-a24f-0e50631812cb	ec82a9d3-4b57-4e52-99b8-e13fe45ea171	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	یک نمونه ی اولیه از پاسخ که بروزرسانی شده	\N	\N	www.nadaram.com	2026-10-09 17:14:37.421	2026-10-09 17:17:56.947	\N
6c16fb41-4dbb-4c9f-83ea-cdc6269804d3	ec82a9d3-4b57-4e52-99b8-e13fe45ea171	54832d93-ca2a-4d09-8ec4-39d6b00adb46	من مبین هستم، کار با اکسل انجام میدم.\nبرنامه نویسی و شروع کردم	https://pbfestival.ir/uploads/82014f95-578b-4435-8bbd-32a37d467404.jpg	\N	-	2026-10-09 17:14:50.186	2026-10-09 17:15:47.908	\N
533c744d-10c4-4b36-95cc-67bc4dace10a	ec82a9d3-4b57-4e52-99b8-e13fe45ea171	d3fa51ef-b17a-49f0-8b6e-da5943681ced	۳۴	\N	\N	\N	2026-10-09 17:12:45.391	2026-10-10 06:10:20.18	\N
862bbf81-f39a-4c3e-9bb8-3e6a7b0fc2f3	6fd47bba-afbf-427d-bba5-2ced9c7895b4	d3fa51ef-b17a-49f0-8b6e-da5943681ced	۳ چیزی که واقعاً به آن‌ها اهمیت می‌دهم:\nاصالت و خروجیِ عریان؛ نه شوآف: حالم از پُزهای توخالی، لفاظی‌های لینکدینی و نقاب‌های قشنگ به‌هم می‌خورد. برای من تنها چیزی که اصالت دارد این است که «در عمل چه چیزی ساخته‌ای و چقدر کار می‌کند؟» حقیقتِ تلخ را به هر دروغ تسلی‌بخش و شیک ترجیح می‌دهم.\nاستقلال در تصمیم و عاملیت: این‌که فرمان دست خودم باشد. تحمل این را ندارم که بازیچهٔ بوروکراسی، قواعد احمقانه یا مدیرانی باشم که فهم‌شان به اندازه یک خط کد هم نیست. برای وقت، هوش و آزادی عملم ارزش قائلم.\nوضوح و سیستماتیک بودن: هر چیزی که مبهم، شلخته و بی‌قاعده باشد مغزم را فرسوده می‌کند. روابط، کارها و استراتژی‌ها باید خطوط تمیز و تعریف‌شده داشته باشند؛ اهل «حالا ببینیم چی میشه» نیستم.\n۳ چیزی که در آن‌ها خوبم:\nتبدیل آشوب به ساختار: هر چقدر هم یک ایده خام، پخش‌وپلا و گیج‌کننده باشد، سریع به لایه‌های منطقی تجزیه‌اش می‌کنم، باگ‌هایش را می‌کشم بیرون و از آن یک سیستم اجرایی و قابل فهم می‌سازم.\nتاب‌آوری و به خط پایان رساندن: وقتی بقیه وسط راه به خاطر اصطکاک یا سختی ماجرا بهانه‌تراشی می‌کنند و کم می‌آورند، من سرم را پایین می‌اندازم، مسائل را دانه به دانه حل می‌کنم و کار را تحویل می‌دهم؛ اهل نیمه‌کاره رها کردن نیستم.\nعیب‌یابی رادیکال و دیدن تناقض‌ها: چشم بسیار تیزی برای دیدن نقص‌ها دارم. فرقی نمی‌کند یک خطای منطقی در یک برنامه باشد یا یک تناقضِ رفتاری در یک انسان؛ زودتر از بقیه متوجه می‌شوم که کجای کار می‌لنگد.\n۲ چیزی که باید در خودم بهتر کنم:\nمدیریت اصطکاک با کندی و حماقت دیگران: باید یاد بگیرم که دنیا سیستم‌عامل نیست و انسان‌ها با کدهای دستوری کار نمی‌کنند. پذیرش این‌که بیشتر آدم‌ها غیرمنطقی، بی‌انگیزه و ترسو هستند، کمک می‌کند این‌قدر بیهوده حرص نخورم و انرژی روانی‌ام را سر ناکارآمدی دیگران تلف نکنم.\nکم کردن وسواس کمال‌گرایی و واگذاری کنترل: استاندارد بالایی که دارم باعث می‌شود ترجیح بدهم همه بار را خودم بکشم تا مبادا خراب شود. باید یاد بگیرم «خوبِ به‌موقع» را به «عالیِ فرساینده» ترجیح بدهم و دست از کنترل جزء‌به‌جزء بردارم.\n۱ چیزی که دوست دارم به خاطرش شناخته شوم:\n«آن آدم کاربلد و سرسختی که وقتی همه در توهم و حرف زدن بودند، کار واقعی و استاندارد تحویل داد و پای حقیقت ایستاد.»\nنمی‌خواهم صرفاً مشهور یا دوست‌داشتنی باشم؛ ترجیح می‌دهم آدم‌ها به عمق، اثرگذاری و استانداردِ دست‌نیافتنی کارم احترام بگذارند.\nسوال نهایی: «آیا این رزومه، بیشتر تو را نشان می‌دهد یا رزومه واقعی‌ات؟»\nبدون شک همین.\nرزومه سنتیِ من یک شناسنامهٔ تکراری برای راضی کردن سیستم‌های اداری و اسکنرهای استخدام است؛ کاغذی که صرفاً می‌گوید در چه تاریخ‌هایی توانسته‌ام خودم را درون چارچوب‌های تحمیلی دیگران جا بدهم.\n\nاما این متن، منطق تصمیم‌گیری، هزینه‌های روانی، وسواس‌ها و جهت قطب‌نمای درونی من است. رزومه سنتی می‌گوید ابزارم چیست؛ این رزومه نشان می‌دهد چرا و با چه موتوری با آن ابزار می‌جنگم.	https://pbfestival.ir/uploads/605093e4-9508-4234-b5e2-d11db5d2d05b.png	\N	\N	2026-10-10 17:01:48.849	2026-10-10 17:04:46.986	\N
7ca8b932-a56b-4424-955f-5e8160d49a85	6fd47bba-afbf-427d-bba5-2ced9c7895b4	11d2f94d-d6f2-4a67-a9d4-284420a26bda	1- تولید محتوا\n2- جشنواره بار دانش\n3- آکادمی و بوت کمپ ها	https://pbfestival.ir/uploads/a8502c68-a336-4017-a279-6e8fe962ec71.jpg	https://pbfestival.ir/uploads/e7321768-ab25-4fd3-a412-1ea275d5c23b.jpg	https://www.varzesh3.com/football/match/496026/%D8%A8%D8%A7%D8%B2%DB%8C-%D8%A7%D9%84%D8%BA%D8%B1%D8%A7%D9%81%D9%87-%D8%A7%D8%B3%D8%AA%D9%82%D9%84%D8%A7%D9%84	2026-10-10 18:22:04.137	2026-10-10 18:24:16.442	\N
\.


--
-- Data for Name: ChallengeSubmissionVersion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChallengeSubmissionVersion" (id, "challengeSubmissionId", "versionNumber", "textContent", "photoUrl", "documentUrl", "linkUrl", "createdAt") FROM stdin;
8dbec673-551b-49b1-94b3-5a826166094f	533c744d-10c4-4b36-95cc-67bc4dace10a	1	۹۹۹۹۹	\N	\N	\N	2026-10-09 17:12:45.391
d77c3c65-1486-434d-a00f-be0cfe1e3950	7a51198c-8784-4885-a24f-0e50631812cb	1	یک نمونه ی اولیه از پاسخ که بروزرسانی شده	\N	\N	www.nadaram.com	2026-10-09 17:14:37.421
48412cf2-1c9c-4d76-b2c5-180f89abd018	6c16fb41-4dbb-4c9f-83ea-cdc6269804d3	1	من مبین هستم، کار با اکسل انجام میدم.\nبرنامه نویسی و شروع کردم	https://pbfestival.ir/uploads/82014f95-578b-4435-8bbd-32a37d467404.jpg	\N	-	2026-10-09 17:14:50.186
ca9830a0-bb2d-4d9e-9c5b-c7578d228289	862bbf81-f39a-4c3e-9bb8-3e6a7b0fc2f3	1	۳ چیزی که واقعاً به آن‌ها اهمیت می‌دهم:\nاصالت و خروجیِ عریان؛ نه شوآف: حالم از پُزهای توخالی، لفاظی‌های لینکدینی و نقاب‌های قشنگ به‌هم می‌خورد. برای من تنها چیزی که اصالت دارد این است که «در عمل چه چیزی ساخته‌ای و چقدر کار می‌کند؟» حقیقتِ تلخ را به هر دروغ تسلی‌بخش و شیک ترجیح می‌دهم.\nاستقلال در تصمیم و عاملیت: این‌که فرمان دست خودم باشد. تحمل این را ندارم که بازیچهٔ بوروکراسی، قواعد احمقانه یا مدیرانی باشم که فهم‌شان به اندازه یک خط کد هم نیست. برای وقت، هوش و آزادی عملم ارزش قائلم.\nوضوح و سیستماتیک بودن: هر چیزی که مبهم، شلخته و بی‌قاعده باشد مغزم را فرسوده می‌کند. روابط، کارها و استراتژی‌ها باید خطوط تمیز و تعریف‌شده داشته باشند؛ اهل «حالا ببینیم چی میشه» نیستم.\n۳ چیزی که در آن‌ها خوبم:\nتبدیل آشوب به ساختار: هر چقدر هم یک ایده خام، پخش‌وپلا و گیج‌کننده باشد، سریع به لایه‌های منطقی تجزیه‌اش می‌کنم، باگ‌هایش را می‌کشم بیرون و از آن یک سیستم اجرایی و قابل فهم می‌سازم.\nتاب‌آوری و به خط پایان رساندن: وقتی بقیه وسط راه به خاطر اصطکاک یا سختی ماجرا بهانه‌تراشی می‌کنند و کم می‌آورند، من سرم را پایین می‌اندازم، مسائل را دانه به دانه حل می‌کنم و کار را تحویل می‌دهم؛ اهل نیمه‌کاره رها کردن نیستم.\nعیب‌یابی رادیکال و دیدن تناقض‌ها: چشم بسیار تیزی برای دیدن نقص‌ها دارم. فرقی نمی‌کند یک خطای منطقی در یک برنامه باشد یا یک تناقضِ رفتاری در یک انسان؛ زودتر از بقیه متوجه می‌شوم که کجای کار می‌لنگد.\n۲ چیزی که باید در خودم بهتر کنم:\nمدیریت اصطکاک با کندی و حماقت دیگران: باید یاد بگیرم که دنیا سیستم‌عامل نیست و انسان‌ها با کدهای دستوری کار نمی‌کنند. پذیرش این‌که بیشتر آدم‌ها غیرمنطقی، بی‌انگیزه و ترسو هستند، کمک می‌کند این‌قدر بیهوده حرص نخورم و انرژی روانی‌ام را سر ناکارآمدی دیگران تلف نکنم.\nکم کردن وسواس کمال‌گرایی و واگذاری کنترل: استاندارد بالایی که دارم باعث می‌شود ترجیح بدهم همه بار را خودم بکشم تا مبادا خراب شود. باید یاد بگیرم «خوبِ به‌موقع» را به «عالیِ فرساینده» ترجیح بدهم و دست از کنترل جزء‌به‌جزء بردارم.\n۱ چیزی که دوست دارم به خاطرش شناخته شوم:\n«آن آدم کاربلد و سرسختی که وقتی همه در توهم و حرف زدن بودند، کار واقعی و استاندارد تحویل داد و پای حقیقت ایستاد.»\nنمی‌خواهم صرفاً مشهور یا دوست‌داشتنی باشم؛ ترجیح می‌دهم آدم‌ها به عمق، اثرگذاری و استانداردِ دست‌نیافتنی کارم احترام بگذارند.\nسوال نهایی: «آیا این رزومه، بیشتر تو را نشان می‌دهد یا رزومه واقعی‌ات؟»\nبدون شک همین.\nرزومه سنتیِ من یک شناسنامهٔ تکراری برای راضی کردن سیستم‌های اداری و اسکنرهای استخدام است؛ کاغذی که صرفاً می‌گوید در چه تاریخ‌هایی توانسته‌ام خودم را درون چارچوب‌های تحمیلی دیگران جا بدهم.\n\nاما این متن، منطق تصمیم‌گیری، هزینه‌های روانی، وسواس‌ها و جهت قطب‌نمای درونی من است. رزومه سنتی می‌گوید ابزارم چیست؛ این رزومه نشان می‌دهد چرا و با چه موتوری با آن ابزار می‌جنگم.	\N	\N	\N	2026-10-10 17:01:48.861
09393e58-6fb5-4460-b8aa-a04995ff6710	862bbf81-f39a-4c3e-9bb8-3e6a7b0fc2f3	2	۳ چیزی که واقعاً به آن‌ها اهمیت می‌دهم:\nاصالت و خروجیِ عریان؛ نه شوآف: حالم از پُزهای توخالی، لفاظی‌های لینکدینی و نقاب‌های قشنگ به‌هم می‌خورد. برای من تنها چیزی که اصالت دارد این است که «در عمل چه چیزی ساخته‌ای و چقدر کار می‌کند؟» حقیقتِ تلخ را به هر دروغ تسلی‌بخش و شیک ترجیح می‌دهم.\nاستقلال در تصمیم و عاملیت: این‌که فرمان دست خودم باشد. تحمل این را ندارم که بازیچهٔ بوروکراسی، قواعد احمقانه یا مدیرانی باشم که فهم‌شان به اندازه یک خط کد هم نیست. برای وقت، هوش و آزادی عملم ارزش قائلم.\nوضوح و سیستماتیک بودن: هر چیزی که مبهم، شلخته و بی‌قاعده باشد مغزم را فرسوده می‌کند. روابط، کارها و استراتژی‌ها باید خطوط تمیز و تعریف‌شده داشته باشند؛ اهل «حالا ببینیم چی میشه» نیستم.\n۳ چیزی که در آن‌ها خوبم:\nتبدیل آشوب به ساختار: هر چقدر هم یک ایده خام، پخش‌وپلا و گیج‌کننده باشد، سریع به لایه‌های منطقی تجزیه‌اش می‌کنم، باگ‌هایش را می‌کشم بیرون و از آن یک سیستم اجرایی و قابل فهم می‌سازم.\nتاب‌آوری و به خط پایان رساندن: وقتی بقیه وسط راه به خاطر اصطکاک یا سختی ماجرا بهانه‌تراشی می‌کنند و کم می‌آورند، من سرم را پایین می‌اندازم، مسائل را دانه به دانه حل می‌کنم و کار را تحویل می‌دهم؛ اهل نیمه‌کاره رها کردن نیستم.\nعیب‌یابی رادیکال و دیدن تناقض‌ها: چشم بسیار تیزی برای دیدن نقص‌ها دارم. فرقی نمی‌کند یک خطای منطقی در یک برنامه باشد یا یک تناقضِ رفتاری در یک انسان؛ زودتر از بقیه متوجه می‌شوم که کجای کار می‌لنگد.\n۲ چیزی که باید در خودم بهتر کنم:\nمدیریت اصطکاک با کندی و حماقت دیگران: باید یاد بگیرم که دنیا سیستم‌عامل نیست و انسان‌ها با کدهای دستوری کار نمی‌کنند. پذیرش این‌که بیشتر آدم‌ها غیرمنطقی، بی‌انگیزه و ترسو هستند، کمک می‌کند این‌قدر بیهوده حرص نخورم و انرژی روانی‌ام را سر ناکارآمدی دیگران تلف نکنم.\nکم کردن وسواس کمال‌گرایی و واگذاری کنترل: استاندارد بالایی که دارم باعث می‌شود ترجیح بدهم همه بار را خودم بکشم تا مبادا خراب شود. باید یاد بگیرم «خوبِ به‌موقع» را به «عالیِ فرساینده» ترجیح بدهم و دست از کنترل جزء‌به‌جزء بردارم.\n۱ چیزی که دوست دارم به خاطرش شناخته شوم:\n«آن آدم کاربلد و سرسختی که وقتی همه در توهم و حرف زدن بودند، کار واقعی و استاندارد تحویل داد و پای حقیقت ایستاد.»\nنمی‌خواهم صرفاً مشهور یا دوست‌داشتنی باشم؛ ترجیح می‌دهم آدم‌ها به عمق، اثرگذاری و استانداردِ دست‌نیافتنی کارم احترام بگذارند.\nسوال نهایی: «آیا این رزومه، بیشتر تو را نشان می‌دهد یا رزومه واقعی‌ات؟»\nبدون شک همین.\nرزومه سنتیِ من یک شناسنامهٔ تکراری برای راضی کردن سیستم‌های اداری و اسکنرهای استخدام است؛ کاغذی که صرفاً می‌گوید در چه تاریخ‌هایی توانسته‌ام خودم را درون چارچوب‌های تحمیلی دیگران جا بدهم.\n\nاما این متن، منطق تصمیم‌گیری، هزینه‌های روانی، وسواس‌ها و جهت قطب‌نمای درونی من است. رزومه سنتی می‌گوید ابزارم چیست؛ این رزومه نشان می‌دهد چرا و با چه موتوری با آن ابزار می‌جنگم.	https://pbfestival.ir/uploads/d29e5807-e000-4c5b-a1ee-c9bd97c4b924.png	\N	\N	2026-10-10 17:04:18.477
c61f4ad3-c489-41b1-af7a-bd40fb3a05fc	862bbf81-f39a-4c3e-9bb8-3e6a7b0fc2f3	3	۳ چیزی که واقعاً به آن‌ها اهمیت می‌دهم:\nاصالت و خروجیِ عریان؛ نه شوآف: حالم از پُزهای توخالی، لفاظی‌های لینکدینی و نقاب‌های قشنگ به‌هم می‌خورد. برای من تنها چیزی که اصالت دارد این است که «در عمل چه چیزی ساخته‌ای و چقدر کار می‌کند؟» حقیقتِ تلخ را به هر دروغ تسلی‌بخش و شیک ترجیح می‌دهم.\nاستقلال در تصمیم و عاملیت: این‌که فرمان دست خودم باشد. تحمل این را ندارم که بازیچهٔ بوروکراسی، قواعد احمقانه یا مدیرانی باشم که فهم‌شان به اندازه یک خط کد هم نیست. برای وقت، هوش و آزادی عملم ارزش قائلم.\nوضوح و سیستماتیک بودن: هر چیزی که مبهم، شلخته و بی‌قاعده باشد مغزم را فرسوده می‌کند. روابط، کارها و استراتژی‌ها باید خطوط تمیز و تعریف‌شده داشته باشند؛ اهل «حالا ببینیم چی میشه» نیستم.\n۳ چیزی که در آن‌ها خوبم:\nتبدیل آشوب به ساختار: هر چقدر هم یک ایده خام، پخش‌وپلا و گیج‌کننده باشد، سریع به لایه‌های منطقی تجزیه‌اش می‌کنم، باگ‌هایش را می‌کشم بیرون و از آن یک سیستم اجرایی و قابل فهم می‌سازم.\nتاب‌آوری و به خط پایان رساندن: وقتی بقیه وسط راه به خاطر اصطکاک یا سختی ماجرا بهانه‌تراشی می‌کنند و کم می‌آورند، من سرم را پایین می‌اندازم، مسائل را دانه به دانه حل می‌کنم و کار را تحویل می‌دهم؛ اهل نیمه‌کاره رها کردن نیستم.\nعیب‌یابی رادیکال و دیدن تناقض‌ها: چشم بسیار تیزی برای دیدن نقص‌ها دارم. فرقی نمی‌کند یک خطای منطقی در یک برنامه باشد یا یک تناقضِ رفتاری در یک انسان؛ زودتر از بقیه متوجه می‌شوم که کجای کار می‌لنگد.\n۲ چیزی که باید در خودم بهتر کنم:\nمدیریت اصطکاک با کندی و حماقت دیگران: باید یاد بگیرم که دنیا سیستم‌عامل نیست و انسان‌ها با کدهای دستوری کار نمی‌کنند. پذیرش این‌که بیشتر آدم‌ها غیرمنطقی، بی‌انگیزه و ترسو هستند، کمک می‌کند این‌قدر بیهوده حرص نخورم و انرژی روانی‌ام را سر ناکارآمدی دیگران تلف نکنم.\nکم کردن وسواس کمال‌گرایی و واگذاری کنترل: استاندارد بالایی که دارم باعث می‌شود ترجیح بدهم همه بار را خودم بکشم تا مبادا خراب شود. باید یاد بگیرم «خوبِ به‌موقع» را به «عالیِ فرساینده» ترجیح بدهم و دست از کنترل جزء‌به‌جزء بردارم.\n۱ چیزی که دوست دارم به خاطرش شناخته شوم:\n«آن آدم کاربلد و سرسختی که وقتی همه در توهم و حرف زدن بودند، کار واقعی و استاندارد تحویل داد و پای حقیقت ایستاد.»\nنمی‌خواهم صرفاً مشهور یا دوست‌داشتنی باشم؛ ترجیح می‌دهم آدم‌ها به عمق، اثرگذاری و استانداردِ دست‌نیافتنی کارم احترام بگذارند.\nسوال نهایی: «آیا این رزومه، بیشتر تو را نشان می‌دهد یا رزومه واقعی‌ات؟»\nبدون شک همین.\nرزومه سنتیِ من یک شناسنامهٔ تکراری برای راضی کردن سیستم‌های اداری و اسکنرهای استخدام است؛ کاغذی که صرفاً می‌گوید در چه تاریخ‌هایی توانسته‌ام خودم را درون چارچوب‌های تحمیلی دیگران جا بدهم.\n\nاما این متن، منطق تصمیم‌گیری، هزینه‌های روانی، وسواس‌ها و جهت قطب‌نمای درونی من است. رزومه سنتی می‌گوید ابزارم چیست؛ این رزومه نشان می‌دهد چرا و با چه موتوری با آن ابزار می‌جنگم.	https://pbfestival.ir/uploads/605093e4-9508-4234-b5e2-d11db5d2d05b.png	\N	\N	2026-10-10 17:04:46.99
52f7116e-164d-425e-983d-83d597dfa1c7	7ca8b932-a56b-4424-955f-5e8160d49a85	1	1- توانایی بررسی دقیق خروجی ها\n2- مدلسازی مالی\n3- تدوین استراتژی مالی	https://pbfestival.ir/uploads/a8502c68-a336-4017-a279-6e8fe962ec71.jpg	https://pbfestival.ir/uploads/e7321768-ab25-4fd3-a412-1ea275d5c23b.jpg	https://www.varzesh3.com/football/match/496026/%D8%A8%D8%A7%D8%B2%DB%8C-%D8%A7%D9%84%D8%BA%D8%B1%D8%A7%D9%81%D9%87-%D8%A7%D8%B3%D8%AA%D9%82%D9%84%D8%A7%D9%84	2026-10-10 18:22:04.153
48eeb3e0-5a31-4ae1-b8cf-e6dbdc4b05ab	7ca8b932-a56b-4424-955f-5e8160d49a85	2	1- تولید محتوا\n2- جشنواره بار دانش\n3- آکادمی و بوت کمپ ها	https://pbfestival.ir/uploads/a8502c68-a336-4017-a279-6e8fe962ec71.jpg	https://pbfestival.ir/uploads/e7321768-ab25-4fd3-a412-1ea275d5c23b.jpg	https://www.varzesh3.com/football/match/496026/%D8%A8%D8%A7%D8%B2%DB%8C-%D8%A7%D9%84%D8%BA%D8%B1%D8%A7%D9%81%D9%87-%D8%A7%D8%B3%D8%AA%D9%82%D9%84%D8%A7%D9%84	2026-10-10 18:24:16.449
\.


--
-- Data for Name: EmailVerificationCode; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EmailVerificationCode" (id, "userId", code, "expiresAt", "createdAt") FROM stdin;
acc58c52-d103-40bf-98c5-f73e31aba7b1	61deccf7-d89b-48c9-bef7-1c164bf76a5b	970472	2026-10-10 04:32:57.97	2026-10-10 04:17:57.973
\.


--
-- Data for Name: Evaluation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Evaluation" (id, "participantId", "evaluatorUserId", status, "transformationScore", "finalScore", comment, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: EvaluationCriterion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EvaluationCriterion" (id, key, title, description, weight) FROM stdin;
\.


--
-- Data for Name: EvaluationScore; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EvaluationScore" (id, "evaluationId", "criterionId", score, comment) FROM stdin;
\.


--
-- Data for Name: EvaluatorAssignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EvaluatorAssignment" (id, "evaluatorUserId", "participantId", "createdAt") FROM stdin;
6345c8e5-9b83-467c-ae95-9512ab2ea560	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	cec264cc-c421-4069-8154-331731108821	2026-10-12 15:05:25.026
b093364c-257e-464d-91c6-aff1ec207169	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	11d2f94d-d6f2-4a67-a9d4-284420a26bda	2026-10-12 15:05:25.06
878a812f-7ef2-4ae1-bb2f-8594f5d0de1e	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	17018422-10ed-4495-b180-ec4b7ee69ad8	2026-10-12 15:05:25.313
f1d41e1f-69e0-4d9e-8e75-bb036d8e96ea	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	2026-10-12 15:05:25.317
e9e81289-7301-4c5b-8143-44ded40518dc	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	2026-10-12 15:05:25.548
343c7ef9-8fbd-4b20-b206-5143555cbc1b	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	54832d93-ca2a-4d09-8ec4-39d6b00adb46	2026-10-12 15:05:25.563
e8c953b5-3e9f-4ce6-bbc9-fbc058c190b2	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	3f53f3bf-51ab-4a9b-9e31-17533f596a3c	2026-10-12 15:05:25.662
9062bff1-6f48-49e4-8f92-25d1d852f447	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	cf562c3e-e18a-4d28-8ebe-2d2779a8e0fa	2026-10-12 15:05:25.726
c16c8c06-1421-4983-8eb1-7b945bf38864	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	19b13d97-5903-473a-9492-5a14aa749278	2026-10-12 15:05:25.734
dec51d08-0886-4895-bd2c-c46e6c67d878	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	ee64d124-1c6f-4fdf-badc-e1d596010245	2026-10-12 15:05:25.737
ff67836d-277a-4ae3-a7b8-1728c8f973b3	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	c41544a9-9932-4ddc-8e3d-170652b7ecb0	2026-10-12 15:05:25.807
7b19e505-0a77-49f1-8d6c-f2a68df44e0d	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	d3fa51ef-b17a-49f0-8b6e-da5943681ced	2026-10-12 15:05:25.809
\.


--
-- Data for Name: FeedbackRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeedbackRequest" (id, "requesterId", "linkToken", "createdAt", "expiresAt") FROM stdin;
a7242696-e25e-4598-bf2f-6704d32060ee	d3fa51ef-b17a-49f0-8b6e-da5943681ced	9c6a81e658b4880884a5f1eb7a7d81efc84532d62165a61c	2026-10-09 17:19:35.691	\N
3cf1569f-720c-49ac-9dde-cbb3ac84107e	54832d93-ca2a-4d09-8ec4-39d6b00adb46	e342b96eaaa9554d84666b5c5da1bbe1cf7801ff881feeb9	2026-10-09 17:19:39.749	\N
9f14a463-cbff-47ec-a596-708f52d65db9	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	5b9b07a2cd9449c582ca1137c6ef609bf254c4466526fe59	2026-10-09 17:31:25.123	\N
\.


--
-- Data for Name: FeedbackResponse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeedbackResponse" (id, "requestId", "authorParticipantId", "authorName", answers, visibility, "createdAt") FROM stdin;
b53d4af5-0279-4c2c-9eb2-65f8d7f380c5	a7242696-e25e-4598-bf2f-6704d32060ee	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	محمدقلی	{"q1": "زود تند سریع خفن", "q2": "قوت", "q3": "انتخابی مطمئن", "q4": "عالی", "q5": "همه زمینه ها", "q6": "مهندس"}	PRIVATE	2026-10-09 17:26:04.725
9440ab65-e3a8-452c-a151-0fc7a99f6944	9f14a463-cbff-47ec-a596-708f52d65db9	d3fa51ef-b17a-49f0-8b6e-da5943681ced	Noor	{"q1": "Bjdjdj", "q2": "Fjjcjx", "q3": "Hdjhd", "q4": "Jhdhd", "q5": "Jhxhd", "q6": "Jjdjc"}	PRIVATE	2026-10-09 17:32:34.224
a7160141-b57e-41c5-be24-4ae588813ea9	9f14a463-cbff-47ec-a596-708f52d65db9	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	محمدقلی	{"q1": "زود تند سریع خفن", "q2": "قوت", "q3": "تمایز", "q4": "حرفه ای", "q5": "همه زمینه ها", "q6": "مهندس طراح مشاور"}	PRIVATE	2026-10-09 17:32:43.491
\.


--
-- Data for Name: Form; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Form" (id, title, slug, description, "isActive", status, "themeConfig", "startsAt", "endsAt", "createdAt", "updatedAt", "bootcampId", "bootcampStatusTrigger", type) FROM stdin;
cmuzf8rii0000oj1s4piouajz	فرم نظر سنجی بوت کمپ ۱ (پرونده من)	firstbootcamp	\N	t	ACTIVE	\N	\N	\N	2026-10-08 10:56:39.498	2026-10-08 11:27:21.543	0c753d22-b105-458e-b5eb-0e97105dad14	\N	EVALUATION
cmv5fv9sy00002qtyjnbhpfoy	فرم نظر سنجی آکادمی ۲ (از ادعا تا روایت)	secondacademy	هم‌مسیر گرامی، سلام؛\nدر جلسه اخیر (سرفصل دوم: از ادعا تا روایت)، دور هم جمع شدیم تا یک‌بار برای همیشه یاد بگیریم چطور مرز پررنگ میان «ادعاهای توخالی» و «شواهد ملموس (Evidence)» را پیدا کنیم؛ یاد گرفتیم که چگونه پورتفولیوی قابل‌اتکا بسازیم، ساختار روایتمان را بر پایه واقعیت بنا کنیم و تجربیات واقعی‌مان را به دارایی پایدار برند شخصی تبدیل کنیم.\n\nحالا دقیقاً نوبت خود ماست که پای حرف‌هایمان بایستیم!\n\nما در این مجموعه اهل کلیشه‌های رایج و فرم‌های نمایشی «همه چیز عالی بود» نیستیم؛ چرا که می‌دانیم بازخورد غیرشفاف صرفاً یک «ادعای بی‌فایده» است. فرم زیر برای این طراحی شده که شواهد واقعی شما را از کیفیت ارائه مدرس، کاربردی بودن پرونده‌ها و چالش‌های فنی پلتفرم جمع‌آوری کند.\n\nیک نکته مهم: پاسخ‌های بدون تعارف، منتقدانه و صادقانه شما دقیقاً همان دیتای نابی است که کمک می‌کند در گام‌های بعدی، آموزش‌ها دقیق‌تر، واقعی‌تر و بدون اتلاف وقت ارائه شوند. تکمیل این فرم حدود ۳ تا ۴ دقیقه از زمان شما را می‌گیرد.\nپیشاپیش از صراحت و همراهی‌تان سپاسگزاریم.	t	ACTIVE	\N	\N	\N	2026-10-12 16:00:46.651	2026-10-12 20:22:25.472	d317a886-786d-4077-b4dc-9243507c2275	\N	EVALUATION
\.


--
-- Data for Name: FormAnswer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FormAnswer" (id, "formId", "participantId", "guestEmail", "guestName", status, "totalScore", "submittedAt", "createdAt", "updatedAt") FROM stdin;
cmuzh2vzg0001zfrwdlvri4cl	cmuzf8rii0000oj1s4piouajz	d3fa51ef-b17a-49f0-8b6e-da5943681ced	nooreddin.hoveida@gmail.com	nooreddin.hoveida@gmail.com	SUBMITTED	\N	2026-10-08 11:48:04.586	2026-10-08 11:48:04.588	2026-10-08 11:48:04.588
cmuzh5qmz000izfrw4blr41xc	cmuzf8rii0000oj1s4piouajz	17018422-10ed-4495-b180-ec4b7ee69ad8	nailofnilufarhoveida@gmail.com	nailofnilufarhoveida@gmail.com	SUBMITTED	\N	2026-10-08 11:50:17.626	2026-10-08 11:50:17.627	2026-10-08 11:50:17.627
cmuziq4fk0011zfrwmuncwuzw	cmuzf8rii0000oj1s4piouajz	\N	nilufar.ataeiyan@gmail.com	nilufar.ataeiyan@gmail.com	SUBMITTED	\N	2026-10-08 12:34:08.239	2026-10-08 12:34:08.241	2026-10-08 12:34:08.241
cmv5ghw73000o2qtyl33834sm	cmv5fv9sy00002qtyjnbhpfoy	d3fa51ef-b17a-49f0-8b6e-da5943681ced	nooreddin.hoveida@gmail.com	nooreddin.hoveida@gmail.com	SUBMITTED	\N	2026-10-12 16:18:22.142	2026-10-12 16:18:22.144	2026-10-12 16:18:22.144
\.


--
-- Data for Name: FormAnswerItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FormAnswerItem" (id, "answerId", "formQuestionId", value, "autoScore", "createdAt") FROM stdin;
cmuzh2vzg0003zfrwz4dl5ioj	cmuzh2vzg0001zfrwdlvri4cl	cmuzfb28e0004oj1sk9pkzl30	"\\"۱ - اصلاً برام جا نیفتاد (هنوز به خلاق بودنم بدون مدرک ایمان دارم!)\\""	\N	2026-10-08 11:48:04.588
cmuzh2vzg0004zfrwn789p3t7	cmuzh2vzg0001zfrwdlvri4cl	cmuzfcn140008oj1soyphtm8i	"\\"۱ - کاملاً گیجم\\""	\N	2026-10-08 11:48:04.588
cmuzh2vzg0005zfrwioom1kst	cmuzh2vzg0001zfrwdlvri4cl	cmuzfdzmh000aoj1sa9c0a0k1	"\\"۱ - تأثیری نداشت\\""	\N	2026-10-08 11:48:04.588
cmuzh2vzg0006zfrwpu9ixr4e	cmuzh2vzg0001zfrwdlvri4cl	cmuzffavw000coj1scs2w5mt4	"\\"۱ - هیچی، باز هم می‌خوام همه چیز رو بنویسم\\""	\N	2026-10-08 11:48:04.588
cmuzh2vzg0007zfrw4rw84eux	cmuzh2vzg0001zfrwdlvri4cl	cmuzfgfjx000eoj1sf8qh7mps	"\\"۱ - کاملاً تئوری و دور از واقعیت بود\\""	\N	2026-10-08 11:48:04.588
cmuzh2vzg0008zfrwk3mcblkr	cmuzh2vzg0001zfrwdlvri4cl	cmuzfgtxn000goj1s8s2vfj42	"\\"ی\\""	\N	2026-10-08 11:48:04.588
cmuzh2vzg0009zfrwqfjyygn2	cmuzh2vzg0001zfrwdlvri4cl	cmuzfh75i000ioj1sdwnpk07x	"\\"ی\\""	\N	2026-10-08 11:48:04.588
cmuzh2vzg000azfrw5zq1f0is	cmuzh2vzg0001zfrwdlvri4cl	cmuzfz8ee0001ry1h6r4wyy7s	"\\"۲\\""	\N	2026-10-08 11:48:04.588
cmuzh2vzg000czfrwxf1t1q9s	cmuzh2vzg0001zfrwdlvri4cl	cmuzg19qs0007ry1hpon17l0h	"\\"۱\\""	\N	2026-10-08 11:48:04.588
cmuzh2vzg000dzfrwx2kshhzz	cmuzh2vzg0001zfrwdlvri4cl	cmuzg2ngd0009ry1h6aqivese	"\\"۲\\""	\N	2026-10-08 11:48:04.588
cmuzh2vzg000ezfrwcoy5kju0	cmuzh2vzg0001zfrwdlvri4cl	cmuzg37sw000bry1hgtyhwrjl	"\\"۲\\""	\N	2026-10-08 11:48:04.588
cmuzh2vzg000fzfrw862hej9d	cmuzh2vzg0001zfrwdlvri4cl	cmuzg3sse000dry1htxao1c73	"\\"۱\\""	\N	2026-10-08 11:48:04.588
cmuzh2vzg000gzfrwa8zmzm69	cmuzh2vzg0001zfrwdlvri4cl	cmuzg0l9a0005ry1hc4t5b163	"\\"۱\\""	\N	2026-10-08 11:48:04.588
cmuzh5qmz000kzfrwdp98djv0	cmuzh5qmz000izfrw4blr41xc	cmuzfb28e0004oj1sk9pkzl30	"\\"۲ - کم\\""	\N	2026-10-08 11:50:17.627
cmuzh5qmz000lzfrwctundh4x	cmuzh5qmz000izfrw4blr41xc	cmuzfcn140008oj1soyphtm8i	"\\"۳ - دست‌وپاشکسته می‌تونم بنویسم\\""	\N	2026-10-08 11:50:17.627
cmuzh5qmz000mzfrw25lx4rl3	cmuzh5qmz000izfrw4blr41xc	cmuzfdzmh000aoj1sa9c0a0k1	"\\"۴ - دیدم رو خیلی بازتر کرد\\""	\N	2026-10-08 11:50:17.627
cmuzh5qmz000nzfrwpnokxzen	cmuzh5qmz000izfrw4blr41xc	cmuzffavw000coj1scs2w5mt4	"\\"۳ - متوسط\\""	\N	2026-10-08 11:50:17.627
cmuzh5qmz000ozfrwjya7giiv	cmuzh5qmz000izfrw4blr41xc	cmuzfgfjx000eoj1sf8qh7mps	"\\" - شدیداً عملیاتی و راهگشا\\""	\N	2026-10-08 11:50:17.627
cmuzh5qmz000pzfrwih7iwie7	cmuzh5qmz000izfrw4blr41xc	cmuzfgtxn000goj1s8s2vfj42	"\\"ب\\""	\N	2026-10-08 11:50:17.627
cmuzh5qmz000qzfrwlg6ogolv	cmuzh5qmz000izfrw4blr41xc	cmuzfh75i000ioj1sdwnpk07x	"\\"ب\\""	\N	2026-10-08 11:50:17.627
cmuzh5qmz000rzfrw6b4zy84r	cmuzh5qmz000izfrw4blr41xc	cmuzfz8ee0001ry1h6r4wyy7s	"\\"۲\\""	\N	2026-10-08 11:50:17.627
cmuzh5qmz000tzfrwh0l938h6	cmuzh5qmz000izfrw4blr41xc	cmuzg0l9a0005ry1hc4t5b163	"\\"۲\\""	\N	2026-10-08 11:50:17.627
cmuzh5qmz000uzfrwus3v1oju	cmuzh5qmz000izfrw4blr41xc	cmuzg19qs0007ry1hpon17l0h	"\\"۲\\""	\N	2026-10-08 11:50:17.627
cmuzh5qmz000vzfrw4nkplgyo	cmuzh5qmz000izfrw4blr41xc	cmuzg2ngd0009ry1h6aqivese	"\\"۴\\""	\N	2026-10-08 11:50:17.627
cmuzh5qmz000wzfrwxv5ikh7d	cmuzh5qmz000izfrw4blr41xc	cmuzg37sw000bry1hgtyhwrjl	"\\"۳\\""	\N	2026-10-08 11:50:17.627
cmuzh5qmz000xzfrwe2dpf2fg	cmuzh5qmz000izfrw4blr41xc	cmuzg3sse000dry1htxao1c73	"\\"۵\\""	\N	2026-10-08 11:50:17.627
cmuziq4fl0013zfrwd00lqvif	cmuziq4fk0011zfrwmuncwuzw	cmuzfb28e0004oj1sk9pkzl30	"\\"۳ - تا حدودی\\""	\N	2026-10-08 12:34:08.241
cmuziq4fl0014zfrw6xore8zo	cmuziq4fk0011zfrwmuncwuzw	cmuzfcn140008oj1soyphtm8i	"\\"۱ - کاملاً گیجم\\""	\N	2026-10-08 12:34:08.241
cmuziq4fl0015zfrwtiavg3kq	cmuziq4fk0011zfrwmuncwuzw	cmuzfdzmh000aoj1sa9c0a0k1	"\\"۲ - خیلی کم\\""	\N	2026-10-08 12:34:08.241
cmuziq4fl0016zfrwdylnzosd	cmuziq4fk0011zfrwmuncwuzw	cmuzffavw000coj1scs2w5mt4	"\\"۳ - متوسط\\""	\N	2026-10-08 12:34:08.241
cmuziq4fl0017zfrw2be4vy5n	cmuziq4fk0011zfrwmuncwuzw	cmuzfgfjx000eoj1sf8qh7mps	"\\"۴ - کاربردی و ملموس\\""	\N	2026-10-08 12:34:08.241
cmuziq4fl0018zfrwjpdw8llz	cmuziq4fk0011zfrwmuncwuzw	cmuzfgtxn000goj1s8s2vfj42	"\\"h\\""	\N	2026-10-08 12:34:08.241
cmuziq4fl0019zfrwzg6vzau9	cmuziq4fk0011zfrwmuncwuzw	cmuzfh75i000ioj1sdwnpk07x	"\\"h\\""	\N	2026-10-08 12:34:08.241
cmuziq4fl001azfrw8370xqgk	cmuziq4fk0011zfrwmuncwuzw	cmuzfz8ee0001ry1h6r4wyy7s	"\\"۲\\""	\N	2026-10-08 12:34:08.241
cmuziq4fl001bzfrwizalm3iw	cmuziq4fk0011zfrwmuncwuzw	cmuzg0l9a0005ry1hc4t5b163	"\\"۳\\""	\N	2026-10-08 12:34:08.241
cmuziq4fl001czfrwkdbg4skw	cmuziq4fk0011zfrwmuncwuzw	cmuzg19qs0007ry1hpon17l0h	"\\"۴\\""	\N	2026-10-08 12:34:08.241
cmuziq4fl001dzfrwj8ajsonc	cmuziq4fk0011zfrwmuncwuzw	cmuzg2ngd0009ry1h6aqivese	"\\"۵\\""	\N	2026-10-08 12:34:08.241
cmuziq4fl001ezfrwnl8dhu46	cmuziq4fk0011zfrwmuncwuzw	cmuzg37sw000bry1hgtyhwrjl	"\\"۱\\""	\N	2026-10-08 12:34:08.241
cmuziq4fl001fzfrwk417z1hd	cmuziq4fk0011zfrwmuncwuzw	cmuzg3sse000dry1htxao1c73	"\\"۲\\""	\N	2026-10-08 12:34:08.241
cmuziq4fl001gzfrw1mgrbu44	cmuziq4fk0011zfrwmuncwuzw	cmuzhdr84000zzfrwpgx8i1j3	"\\"3\\""	\N	2026-10-08 12:34:08.241
cmv5ghw73000q2qtyyrb1wy39	cmv5ghw73000o2qtyl33834sm	cmv5fwucn00022qtyarkri523	"\\" تا حدی کاربردی بود، اما نیاز به مثال‌های واقعی‌تر و عمیق‌تر داشت.\\""	\N	2026-10-12 16:18:22.144
cmv5ghw73000r2qtymcick79z	cmv5ghw73000o2qtyl33834sm	cmv5fy96f00042qty7uywgb97	["شناسایی و غربالگری کارت‌های گمراه‌کننده یا داده‌های غیرمعتبر در رزومه/روایت", "تفکیک مرز باریک بین «لاف و ادعا» با «شواهد قابل‌اثبات»"]	\N	2026-10-12 16:18:22.144
cmv5ghw73000s2qtyf9vdkmar	cmv5ghw73000o2qtyl33834sm	cmv5fza9l00062qtymrhphvg3	"\\"توضیحات دنباله دار و حوصله سر بر مدرس در بعضی موارد\\""	\N	2026-10-12 16:18:22.144
cmv5ghw74000t2qty8id46dk6	cmv5ghw73000o2qtyl33834sm	cmv5g0ctg00082qtym2mehxox	"\\"خوب و مسلط، گرچه در بخش‌هایی ریتم ارائه یکنواخت و کسل‌کننده شد.\\""	\N	2026-10-12 16:18:22.144
cmv5ghw74000u2qty1jlhz302	cmv5ghw73000o2qtyl33834sm	cmv5g1b61000a2qty4pb9gaca	"\\"کلی‌گویی کرد اما جهت کلی را نشان داد.\\""	\N	2026-10-12 16:18:22.144
cmv5ghw74000v2qtywezh4hn1	cmv5ghw73000o2qtyl33834sm	cmv5g1p3i000c2qtyxrwtitgd	"\\"وقتی نمونه ای رو می خواهند بررسی کنن طرز بیان صحیح اون موارد رو هم بگویند.مثلا برای چاشنی نت نگفتند دقیقا چه ادبیاتی باید برای معرفی خودشون بگویند.\\""	\N	2026-10-12 16:18:22.144
cmv5ghw74000w2qty6v1j75be	cmv5ghw73000o2qtyl33834sm	cmv5g2mx0000e2qtyhupodk90	"\\"مشکلات فنی مکرر (قطعی صدا، لگ تصویر یا پلتفرم) تمرکز را گرفت.\\""	\N	2026-10-12 16:18:22.144
cmv5ghw74000x2qty889er9dx	cmv5ghw73000o2qtyl33834sm	cmv5g466d000i2qtyqleaa7fx	[" تأخیر در شروع یا ناهماهنگی در ورود به پلتفرم", " فونت‌های ناخوانا یا شلوغی بیش از حد اسلایدها/فایل‌ها", " عدم مدیریت چت و حاشیه‌های شرکت‌کنندگان"]	\N	2026-10-12 16:18:22.144
cmv5ghw74000y2qtyej20q92v	cmv5ghw73000o2qtyl33834sm	cmv5g5e6l000k2qtywf72dtx7	"\\"احتمالش متوسطه \\""	\N	2026-10-12 16:18:22.144
cmv5ghw74000z2qtyz41ph69i	cmv5ghw73000o2qtyl33834sm	cmv5g6jag000m2qty42bengei	"\\"از همین امروز دست‌به‌کار می‌شوم و شواهد پورتفولیو را جمع‌آوری می‌کنم.\\""	\N	2026-10-12 16:18:22.144
\.


--
-- Data for Name: FormQuestion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FormQuestion" (id, "formId", "questionId", label, "helpText", "inputType", options, "isRequired", weight, "order", config, "createdAt") FROM stdin;
cmuzfgtxn000goj1s8s2vfj42	cmuzf8rii0000oj1s4piouajz	\N	اگر بخوای همین الان بیانیه برند شخصی خودت (یا کاراکتری که تو کارگاه روش کار کردی) رو توی یک یا دو جمله برامون بنویسی، چی می‌نویسی؟	\N	TEXT	{}	t	\N	5	\N	2026-10-08 11:02:55.884
cmuzfh75i000ioj1sdwnpk07x	cmuzf8rii0000oj1s4piouajz	\N	کدوم بخش از محتوای این جلسه برات غافلگیرکننده بود یا باعث شد بگی “اوه! من تا دیروز اشتباه فکر می‌کردم”؟ اگر هم نقدی داری که محتوا کجا اضافه یا الکی پیچیده بود، بی‌تعارف برامون بنویس.	\N	TEXT	{}	t	\N	6	\N	2026-10-08 11:03:13.014
cmuzfb28e0004oj1sk9pkzl30	cmuzf8rii0000oj1s4piouajz	\N	«قبل از این جلسه شاید فکر می‌کردیم گفتنِ صفت‌هایی مثل “من خیلی پرانرژی و خلاقم” یعنی برند شخصی! چقدر الان برات جا افتاده که هر ادعایی داری باید براش سند و مدرک ملموس بیاری؟»	\N	SINGLE_CHOICE	{"۱ - اصلاً برام جا نیفتاد (هنوز به خلاق بودنم بدون مدرک ایمان دارم!)","۲ - کم","۳ - تا حدودی","۴ - زیاد","۵ - کاملاً شفاف شد؛ فهمیدم ادعای بدون مدرک یعنی باد هوا"}	t	\N	0	\N	2026-10-08 10:58:26.702
cmuzfcn140008oj1soyphtm8i	cmuzf8rii0000oj1s4piouajz	\N	اگر همین الان ازت بخوایم بیانیه برندت رو بنویسی (که کی هستی، به کی کمک می‌کنی و چه گره‌ای رو باز می‌کنی)، چقدر احساس می‌کنی چارچوب و فرمولش برات شفافه؟	\N	SINGLE_CHOICE	{"۱ - کاملاً گیجم","۲ - هنوز مبهمه","۳ - دست‌وپاشکسته می‌تونم بنویسم","۴ - خوب و مسلطم","۵ - عالی؛ فرمول رو دقیق بلدم و می‌تونم پیاده‌اش کنم"}	t	\N	1	\N	2026-10-08 10:59:40.312
cmuzfdzmh000aoj1sa9c0a0k1	cmuzf8rii0000oj1s4piouajz	\N	چقدر این کارگاه کمکت کرد بفهمی تصویری که خودت از خودت توی آینه داری، ممکنه با تصویری که بقیه ازت می‌بینن زمین تا آسمون فرق داشته باشه؟	\N	SINGLE_CHOICE	{"۱ - تأثیری نداشت","۲ - خیلی کم","۳ - متوجه شدم ولی برام حل نشده","۴ - دیدم رو خیلی بازتر کرد","۵ - چشم‌هام باز شد؛ فهمیدم تا بازخورد دیگران نباشه تصویرم ناقصه"}	t	\N	2	\N	2026-10-08 11:00:43.289
cmuzffavw000coj1scs2w5mt4	cmuzf8rii0000oj1s4piouajz	\N	چقدر یاد گرفتی که از بین صدتا ویژگی و مهارت، دقیقاً دست بذاری روی اون ۲-۳ تایی که قراره تو بازار متمایزت کنن و بارِ برندت رو به دوش بکشن؟	\N	SINGLE_CHOICE	{"۱ - هیچی، باز هم می‌خوام همه چیز رو بنویسم","۲ - کم","۳ - متوسط","۴ - خوب","۵ - کاملاً مسلط شدم به غربال کردن ویژگی‌ها"}	t	\N	3	\N	2026-10-08 11:01:44.517
cmuzfgfjx000eoj1sf8qh7mps	cmuzf8rii0000oj1s4piouajz	\N	تمرین‌هایی که مطرح شد (مثل مصاحبه و پر کردن فرم‌ها) چقدر به دردت خوردن و احساس کردی قابلیت پیاده‌سازی دارن، نه اینکه صرفاً تئوری‌های قشنگ کتابی باشن؟	\N	SINGLE_CHOICE	{"۱ - کاملاً تئوری و دور از واقعیت بود","۲ - کم‌کاربرد","۳ - قابل‌قبول","۴ - کاربردی و ملموس"," - شدیداً عملیاتی و راهگشا"}	t	\N	4	\N	2026-10-08 11:02:37.245
cmuzg0l9a0005ry1hc4t5b163	cmuzf8rii0000oj1s4piouajz	\N	چقدر به نظرتون مدرس روی کلاس مسلط بود و اجازه نداد جلسه خسته‌کننده یا یک‌طرفه بشه؟	(۱: کسل‌کننده و روخوانی از اسلاید | ۵: پرانرژی، مسلط و تعاملی)	SINGLE_CHOICE	{۱,۲,۳,۴,۵}	t	\N	9	\N	2026-10-08 11:18:17.758
cmuzfz8ee0001ry1h6r4wyy7s	cmuzf8rii0000oj1s4piouajz	\N	مدرس چقدر مطالب پیچیده رو با مثال‌های ساده و ملموس توضیح داد؟	(۱: خیلی گنگ و پیچیده | ۵: مثل آب خوردن و فوق‌العاده شفاف)	SINGLE_CHOICE	{۱,۲,۳,۴,۵}	t	\N	7	\N	2026-10-08 11:17:14.419
cmuzg19qs0007ry1hpon17l0h	cmuzf8rii0000oj1s4piouajz	\N	تسلط مدرس روی پاسخ به سؤالات و گره‌گشایی از ذهن بچه‌ها چطور بود؟	(۱: ضعیف و طفره‌رونده | ۵: کاملاً مسلط، منطقی و قانع‌کننده)	SINGLE_CHOICE	{۱,۲,۳,۴,۵}	t	\N	10	\N	2026-10-08 11:18:49.492
cmuzg2ngd0009ry1h6aqivese	cmuzf8rii0000oj1s4piouajz	\N	کیفیت صدا، تصویر و پایداری پلتفرم چطور بود؟ (قطعی، لگ یا نویز اذیتت کرد؟)	(۱: فاجعه و پر از قطعی | ۵: عالی، بدون لگ و با کیفیت شفاف)	SINGLE_CHOICE	{۱,۲,۳,۴,۵}	t	\N	11	\N	2026-10-08 11:19:53.917
cmuzg37sw000bry1hgtyhwrjl	cmuzf8rii0000oj1s4piouajz	\N	شروع و پایان جلسه و زمان اختصاص‌داده‌شده به تمرین‌ها چقدر منظم و طبق برنامه پیش رفت؟	(۱: شلخته و با اتلاف وقت زیاد | ۵: کاملاً سروقت و دقیق)	SINGLE_CHOICE	{۱,۲,۳,۴,۵}	t	\N	12	\N	2026-10-08 11:20:20.286
cmuzg3sse000dry1htxao1c73	cmuzf8rii0000oj1s4piouajz	\N	اطلاع‌رسانی لینک ورود، هماهنگی‌ها و ارسال فایل تمرین‌ها چقدر به‌موقع و تر‌وتمیز انجام شد؟	(۱: ناهماهنگ و با تأخیر | ۵: بی‌نقص و به‌موقع)	SINGLE_CHOICE	{۱,۲,۳,۴,۵}	t	\N	13	\N	2026-10-08 11:20:47.436
cmv5fwucn00022qtyarkri523	cmv5fv9sy00002qtyjnbhpfoy	\N	محتوای ارائه شده درباره «تبدیل ادعا به روایت و مستندسازی شواهد»، چقدر فراتر از بدیهیاتِ انگیزشی و کلیشه‌های فضای مجازی بود؟	\N	SINGLE_CHOICE	{"کاملاً عملیاتی و چارچوب‌مند بود؛ دقیقاً یاد گرفتم چطور شواهد (Evidence) بسازم."," تا حدی کاربردی بود، اما نیاز به مثال‌های واقعی‌تر و عمیق‌تر داشت.","بیشتر به تکرار بدیهیات و حرف‌های انگیزشی گذشت و ابزار ملموسی به دستم نداد."," محتوا با نیاز و سطح فعلی من همخوانی نداشت."}	t	\N	0	\N	2026-10-12 16:01:59.975
cmuzhdr84000zzfrwpgx8i1j3	cmuzf8rii0000oj1s4piouajz	\N	چقدر به نظرتون مدرس روی کلاس مسلط بود و اجازه نداد جلسه خسته‌کننده یا یک‌طرفه بشه؟	(۱: کسل‌کننده و روخوانی از اسلاید | ۵: پرانرژی، مسلط و تعاملی)	SINGLE_CHOICE	{1,2,3,4,5}	t	\N	14	\N	2026-10-08 11:56:31.614
cmv5fy96f00042qty7uywgb97	cmv5fv9sy00002qtyjnbhpfoy	\N	پس از اتمام این وبینار، احساس می‌کنید روی کدام‌یک از مهارت‌ها/مفاهیم زیر تسلط کافی برای اجرا پیدا کرده‌اید؟	(می‌توانید چند گزینه انتخاب کنید)	MULTI_CHOICE	{"تفکیک مرز باریک بین «لاف و ادعا» با «شواهد قابل‌اثبات»","پیاده‌سازی ساختار روایت پنج‌مرحله‌ای (قبل، چالش، تصمیم، اقدام، نتیجه)","شناسایی و غربالگری کارت‌های گمراه‌کننده یا داده‌های غیرمعتبر در رزومه/روایت"," ثبت اصولی لاگ استفاده از هوش مصنوعی (AI Usage Log)","هیچ‌کدام؛ هنوز ابهام دارم و نمی‌دانم از کجا باید شروع کنم."}	t	\N	1	\N	2026-10-12 16:03:05.847
cmv5fza9l00062qtymrhphvg3	cmv5fv9sy00002qtyjnbhpfoy	\N	اگر قرار بود یک بخش از محتوای این وبینار را به‌خاطر «غیرکاربردی بودن» یا «کش‌آمدن بی‌مورد» کاملاً حذف یا بازنویسی کنید، آن بخش کدام بود و چرا؟	\N	TEXT	{}	t	\N	2	\N	2026-10-12 16:03:53.913
cmv5g0ctg00082qtym2mehxox	cmv5fv9sy00002qtyjnbhpfoy	\N	عملکرد مدرس در مدیریت زمان، حل سناریوها و همراه کردن ذهن شرکت‌کنندگان را چطور دیدید؟	\N	SINGLE_CHOICE	{"فوق‌العاده؛ کلاس کاملاً تعاملی و بر پایه حل مسئله و چالش هدایت شد.","خوب و مسلط، گرچه در بخش‌هایی ریتم ارائه یکنواخت و کسل‌کننده شد.","متوسط؛ مدرس بیشتر متکلم‌وحده بود و تعامل با مخاطب صوری پیش رفت.","ضعیف؛ پرسش‌ها سطحی ماندند و چالش پرونده‌ها باز نشد."}	t	\N	3	\N	2026-10-12 16:04:43.876
cmv5g1b61000a2qty4pb9gaca	cmv5fv9sy00002qtyjnbhpfoy	\N	پاسخ‌های مدرس به ابهامات شرکت‌کنندگان و سؤالات چالش‌برانگیز چقدر قانع‌کننده و دارای پشتوانه منطقی بود؟	\N	SINGLE_CHOICE	{" دقیق، مستند و راه‌گشا؛ ابهام باقی نماند.","کلی‌گویی کرد اما جهت کلی را نشان داد."," از پاسخ مستقیم به چالش‌های جدی طفره رفت یا پاسخ‌ها شفاف نبود."," فرصت کافی برای طرح سؤال یا رسیدگی به ابهامات داده نشد."}	t	\N	4	\N	2026-10-12 16:05:28.393
cmv5g1p3i000c2qtyxrwtitgd	cmv5fv9sy00002qtyjnbhpfoy	\N	یک پیشنهاد بی‌تعارف برای مدرس: برای وبینار بعدی چه رفتاری را در تدریس خود ادامه دهد و چه چیزی را فوراً متوقف کند؟	\N	TEXT	{}	t	\N	5	\N	2026-10-12 16:05:46.447
cmv5g2mx0000e2qtyhupodk90	cmv5fv9sy00002qtyjnbhpfoy	\N	کیفیت زیرساخت فنی وبینار (وضوح صدا، تصویر، اشتراک‌گذاری اسلایدها و پایداری پلتفرم) در چه سطحی بود؟	\N	SINGLE_CHOICE	{"بی‌نقص و روان؛ بدون قطعی و افت کیفیت."," قطعی جزئی رخ داد ولی رشته کلام و تمرکز به هم نریخت.","مشکلات فنی مکرر (قطعی صدا، لگ تصویر یا پلتفرم) تمرکز را گرفت.","فاجعه فنی؛ بخش زیادی از زمان صرف هماهنگی و عیب‌یابی شد."}	t	\N	6	\N	2026-10-12 16:06:30.246
cmv5g466d000i2qtyqleaa7fx	cmv5fv9sy00002qtyjnbhpfoy	\N	در طول رویداد با کدام‌یک از مشکلات زیر مواجه شدید؟	(انتخاب همه موارد مرتبط)	MULTI_CHOICE	{" تأخیر در شروع یا ناهماهنگی در ورود به پلتفرم","صدای نامناسب، نویز یا اکو از سمت ارائه‌دهنده"," فونت‌های ناخوانا یا شلوغی بیش از حد اسلایدها/فایل‌ها"," عدم مدیریت چت و حاشیه‌های شرکت‌کنندگان","هیچ مشکلی وجود نداشت؛ تجربه کاملاً روان بود."}	t	\N	8	\N	2026-10-12 16:07:41.893
cmv5g5e6l000k2qtywf72dtx7	cmv5fv9sy00002qtyjnbhpfoy	\N	با در نظر گرفتن زمانی که در این وبینار صرف کردید، چقدر احتمال دارد این وبینار را به دوستی که واقعاً برای وقتش ارزش قائل است پیشنهاد کنید؟	\N	TEXT	{}	t	\N	9	\N	2026-10-12 16:08:38.925
cmv5g6jag000m2qty42bengei	cmv5fv9sy00002qtyjnbhpfoy	\N	بعد از پایان جلسه، برنامه شما برای تمرین‌های عملی (مانند ثبت شواهد یا لاگ هوش مصنوعی) چیست؟	\N	SINGLE_CHOICE	{"از همین امروز دست‌به‌کار می‌شوم و شواهد پورتفولیو را جمع‌آوری می‌کنم.","اگر فایل ضبط‌شده و مستندات تکمیلی ارسال شود، تمرین‌ها را انجام می‌دهم."," احساس می‌کنم هنوز نقشه راه شفافی برای پیاده‌سازی ندارم.","قصد انجام تمرین‌ها را ندارم؛ صرفاً جنبه آشنایی داشت."}	t	\N	10	\N	2026-10-12 16:09:32.2
\.


--
-- Data for Name: JourneySection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JourneySection" (id, key, title, description, "order", "deletedAt", "deletedBy") FROM stdin;
faa2ea3f-9c44-4d4a-bf21-715a30b7e38d	۱	گام ۱: حساب‌کشی از مهارت‌ها؛ واقعاً چی بلدی؟	بیا تعارف رو بذاریم کنار. کلماتی مثل «باهوش»، «خلاق» و «پرتلاش» ویژگی شخصیتی‌ان، نه مهارتی که بشه براش فاکتور زد! مهارت چیزیه که براش خروجی ملموس داری.	0	2026-10-12 14:05:04.696	\N
8ea9bc72-7175-4ba8-8b56-eb7fc38e0642	first step	گام اول	حساب‌کشی از مهارت‌ها؛ واقعاً چی بلدی؟\nبیا تعارف رو بذاریم کنار. کلماتی مثل «باهوش»، «خلاق» و «پرتلاش» ویژگی شخصیتی‌ان، نه مهارتی که بشه براش فاکتور زد! مهارت چیزیه که براش خروجی ملموس داری.	1	2026-10-12 14:43:30.839	\N
f53db634-4ac8-4b32-971a-6528466cdb66	step 1	گام ۱: ممیزی و حساب‌کشی از مهارت‌ها	ثبت ابزار و مهارت عملیاتی	2	\N	\N
d70a73b4-8e04-43cb-a1ad-5291f3bedb89	step 2	گام ۲: تفکیک علاقه واقعی از جوگیری مقطعی	فیلتر اشتیاق پایدار	3	\N	\N
33ea8862-3f09-4592-a3ed-fd54cca6fc76	step 3	گام ۳: اعتبارسنجی نیاز و جیب بازار	رصد تقاضای فعال	4	\N	\N
2cc2e6d5-fd20-4c42-b2bd-f9d38408387f	step 4	گام ۴: تعریف نیچ‌مارکت (Niche Market)	باریک کردن دایره تمرکز	5	\N	\N
09fa2996-1022-4e0d-8738-d2938576d994	step 5	گام ۵: بیانیه ارزش ۳۰ ثانیه‌ای (Elevator Pitch)	فرمول ارزش منحصربه‌فرد	6	\N	\N
416299f6-e1d1-4205-8070-75a5c8101f81	step 6	گام ۶: ارتقای ویترین و پروفایل حرفه‌ای	کارت ویزیت دیجیتال	7	\N	\N
9540bbae-b17e-451e-a508-8c89b134d25d	step 7	گام ۷: یادگیری در ملأ عام (Learn in Public)	شکستن سکوت و اولین اشتراک‌گذاری	8	\N	\N
c0c9f198-e1fa-431c-9eb2-57f7abe067a0	step 8	گام ۸: سند غیرقابل‌انکار تخصص (Proof of Work)	رو کردن خروجی کار	9	\N	\N
42ff2d73-416f-49dc-9306-7299a9ce0263	step 9	گام ۹: تعامل و شبکه‌سازی تحلیلی	رد پای حرفه‌ای زیر نظر اهل فن	10	\N	\N
6918b438-7753-49d6-b640-18fa248817a6	step 10	گام ۱۰: بستن عهد استمرار محتوایی	تعهد زمانی به برند شخصی	11	\N	\N
\.


--
-- Data for Name: LandingSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LandingSetting" (key, data, "updatedAt") FROM stdin;
home_cms	{"sections": [{"id": "steps-section", "badge": "گام‌های مسیر", "items": [{"id": "step-1", "desc": "سنجش ۱۴ شاخصه کلیدی رفتاری، فن‌بیان و نحوه تصمیم‌گیری در شرایط واقعی.", "icon": "🧬", "title": "هویت و خودشناسی", "stepNumber": "۰۱"}, {"id": "step-2", "desc": "آینه ۳۶۰ درجه برای شفاف‌سازی تصویری که کارفرما، شبکه همکاران و اساتید از شما دارند.", "icon": "🪞", "title": "کشف زاویه دید دیگران", "stepNumber": "۰۲"}, {"id": "step-3", "desc": "بوت‌کمپ‌های تخصصی، سناریونویسی پرزنت و منتورینگ اختصاصی با رهبران صنعت.", "icon": "⚡", "title": "بازآفرینی و مهارت‌آموزی", "stepNumber": "۰۳"}, {"id": "step-4", "desc": "معرفی به جشنواره کشوری، دریافت شناسنامه هویت حرفه‌ای و ورود به شبکه فرصت‌ها.", "icon": "🚀", "title": "ویترین ملی و اتصال", "stepNumber": "۰۴"}], "title": "مسیر گام‌به‌گام برندسازی شخصی"}, {"id": "features-section", "badge": "ماتریس رفتار و بازخورد", "items": [{"id": "feat-1", "desc": "از خودشناسی تا معرفی عمومی در هشت فاز داده‌محور؛ با تحلیل ۴ سناریوی واقعی کاری، مصاحبه و سرمایه‌گذاری.", "icon": "📊", "badge": "ماتریس رفتار", "title": "مسیر هوشمند برند شخصی", "stepNumber": ""}, {"id": "feat-2", "desc": "ترکیب ادراک فردی با بازخورد واقعی هم‌تیمی‌ها، منتورها و کارفرمایان جهت کشف نقاط کور اثرگذاری.", "icon": "🎯", "badge": "بازخورد هوشمند", "title": "ارزیابی ۳۶۰ درجه (My Mirror)", "stepNumber": ""}, {"id": "feat-3", "desc": "یک هویت آنلاین معتبر با لینک اختصاصی و تاییدیه داوران برای درخشش در بازار کار و اکوسیستم کارآفرینی.", "icon": "💎", "badge": "شناسنامه حرفه‌ای", "title": "شناسنامه عمومی و رتبه ملی", "stepNumber": ""}], "title": "ویژگی‌ها و ابزارهای متمایز پلتفرم"}]}	2026-10-11 12:27:55.295
\.


--
-- Data for Name: Leaderboard; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Leaderboard" (id, key, kind, title, description, "createdByUserId", published, "publishedAt", "createdAt") FROM stdin;
178566ce-1512-45e2-a95b-4855f118e876	pre_assessment_score	SYSTEM	بیشترین امتیاز در پیش‌ارزیابی	میانگین «وضعیت فعلی» در ۶ محور خودارزیابی فرم پیش‌ارزیابی (از ۱۰۰).	\N	t	2026-09-25 18:49:48.79	2026-09-25 12:41:21.558
ea50da2f-30f9-4ff5-bc38-4b2a3815428a	final_evaluation_score	SYSTEM	بیشترین امتیاز در ارزیابی نهایی	امتیاز نهایی آخرین ارزیابی ثبت‌شده (finalScore) توسط ارزیاب.	\N	t	2026-09-25 18:49:49.755	2026-09-25 12:41:21.558
a69c6952-1e9f-4833-85a9-4fc47ee11132	site_activity	SYSTEM	بیشترین فعالیت در سایت	مجموع پاسخ‌های ثبت‌شده، تکالیف ارسالی، چالش‌های هفتگی، پیام‌های کار گروهی و رسانه‌های آپلودشده.	\N	t	2026-09-25 18:49:52.451	2026-09-25 12:41:21.558
e34c5978-f8a9-4013-b753-1caa5e3778ce	transformation_progress	SYSTEM	بیشترین پیشرفت از قبل تا بعد جشنواره	امتیاز پیشرفت (transformationScore) ثبت‌شده توسط ارزیاب در آخرین ارزیابی.	\N	t	2026-09-25 18:49:54.744	2026-09-25 12:41:21.558
27dd2913-cea8-4851-943d-c072ab77511f	task_scores	SYSTEM	بیشترین امتیاز دریافتی در تکالیف	مجموع امتیاز تکالیف تأییدشده‌ی بوت‌کمپ‌ها و وبینارها.	\N	t	2026-09-25 18:49:58.68	2026-09-25 12:41:21.558
45668d04-589c-4d13-a268-4ce43154c29b	feedback_received	SYSTEM	بیشترین تعداد دریافت بازخورد	تعداد پاسخ‌های دریافتی روی لینک‌های «آینه من».	\N	t	2026-09-25 18:50:01.229	2026-09-25 12:41:21.558
2dd682db-3afb-4219-8f23-4dad16899c32	skill_endorsements	SYSTEM	بیشترین دریافت تاییدیه مهارت‌ها	تعداد تأییدهای (نه ردها) دریافتی روی مهارت‌های ثبت‌شده.	\N	t	2026-09-25 18:50:04.545	2026-09-25 12:41:21.558
c9b80f90-68df-4662-b267-495a4092afe0	live_group_participation	SYSTEM	بیشترین مشارکت در کار گروهی زنده	تعداد پیام‌های ارسالی در چت گروهی جلسات زنده‌ی بوت‌کمپ.	\N	t	2026-09-25 18:50:08.133	2026-09-25 12:41:21.559
\.


--
-- Data for Name: LeaderboardEntry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LeaderboardEntry" (id, "leaderboardId", "participantId", score, note, "scoredByUserId", "scoredAt") FROM stdin;
\.


--
-- Data for Name: LiveGroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LiveGroup" (id, "sessionId", name, "createdAt") FROM stdin;
b12d16bf-39b5-4a9d-9130-1fb0be9d154f	b3c55a4a-950f-4521-9464-aebc9f6b346a	گروه 1	2026-10-09 17:59:46.395
3cfd3c63-5f65-431a-869f-5049c8f3e1e1	b3c55a4a-950f-4521-9464-aebc9f6b346a	گروه 2	2026-10-09 17:59:46.4
\.


--
-- Data for Name: LiveMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LiveMessage" (id, "sessionId", "groupId", "senderId", "receiverId", content, "fileUrl", "createdAt") FROM stdin;
93822906-474c-49d3-9e60-43fe8e4216bc	b3c55a4a-950f-4521-9464-aebc9f6b346a	b12d16bf-39b5-4a9d-9130-1fb0be9d154f	17018422-10ed-4495-b180-ec4b7ee69ad8	\N	salam	\N	2026-10-09 17:59:55.444
53859d79-969d-4e59-a7df-aecaeaad5cfb	b3c55a4a-950f-4521-9464-aebc9f6b346a	b12d16bf-39b5-4a9d-9130-1fb0be9d154f	3f53f3bf-51ab-4a9b-9e31-17533f596a3c	\N	پیام تستی از یاسر برای گروه 1	\N	2026-10-09 18:00:05.907
\.


--
-- Data for Name: LivePresence; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LivePresence" (id, "sessionId", "participantId", online, "joinedAt", "lastSeenAt", "groupId") FROM stdin;
34a137a1-9d4f-4190-b7be-e44a167372de	b3c55a4a-950f-4521-9464-aebc9f6b346a	3f53f3bf-51ab-4a9b-9e31-17533f596a3c	t	2026-10-09 17:58:21.499	2026-10-09 17:59:27.575	b12d16bf-39b5-4a9d-9130-1fb0be9d154f
213ec6a8-72b9-4c44-a206-1c6711ced224	b3c55a4a-950f-4521-9464-aebc9f6b346a	ee64d124-1c6f-4fdf-badc-e1d596010245	t	2026-10-09 17:58:29.21	2026-10-09 17:58:29.21	3cfd3c63-5f65-431a-869f-5049c8f3e1e1
058135e0-b76b-47d5-9575-50672a8ef225	b3c55a4a-950f-4521-9464-aebc9f6b346a	19b13d97-5903-473a-9492-5a14aa749278	t	2026-10-09 18:01:41.197	2026-10-09 18:01:41.197	\N
fe727e9b-3c57-4747-8821-69126970e855	b3c55a4a-950f-4521-9464-aebc9f6b346a	17018422-10ed-4495-b180-ec4b7ee69ad8	t	2026-10-09 17:56:30.783	2026-10-10 16:07:18.945	b12d16bf-39b5-4a9d-9130-1fb0be9d154f
\.


--
-- Data for Name: LiveSession; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LiveSession" (id, "bootcampId", status, "taskBrief", "createdAt", "groupedAt", "closedAt") FROM stdin;
b3c55a4a-950f-4521-9464-aebc9f6b346a	0c753d22-b105-458e-b5eb-0e97105dad14	GROUPED	\N	2026-10-09 17:55:15.433	2026-10-09 17:59:46.403	\N
\.


--
-- Data for Name: Media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Media" (id, "participantId", type, url, "mimeType", "sizeBytes", "order", "createdAt") FROM stdin;
002ceeb6-bbe8-4966-b12a-f451056295b3	d3fa51ef-b17a-49f0-8b6e-da5943681ced	PROFILE_PORTRAIT	https://pbfestival.ir/uploads/b22a1dba-79c1-4edd-92e7-a86bad32b973.jpg	image/jpeg	31761	0	2026-10-02 10:53:50.674
6b801367-84d4-48b9-b0f3-9d7781f46bee	54832d93-ca2a-4d09-8ec4-39d6b00adb46	PROFILE_PORTRAIT	https://pbfestival.ir/uploads/4dba372d-d3b4-455b-8c44-d08c3ae4ba57.png	image/png	1623927	0	2026-10-03 19:35:38.539
d2f07148-542e-4755-a761-26787863c790	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	GALLERY	https://pbfestival.ir/uploads/32bae90e-80f9-407d-88eb-356df2a47395.png	image/png	16728	0	2026-10-09 17:06:47.618
0ed49d81-2467-4651-ae62-50b95d6653dc	54832d93-ca2a-4d09-8ec4-39d6b00adb46	GALLERY	https://pbfestival.ir/uploads/b3d2f257-84ad-4101-8c2a-c9b1210daefa.jpg	image/jpeg	26680	0	2026-10-09 17:07:19.091
f4eec527-1168-4661-92c7-6a516d49b17d	54832d93-ca2a-4d09-8ec4-39d6b00adb46	GALLERY	https://pbfestival.ir/uploads/fae4338a-480f-471d-956c-ee2b612b27a4.jpg	image/jpeg	26680	0	2026-10-09 17:07:25.743
80dddc02-0e57-4b34-a33b-417a4d4848f3	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	PROFILE_PORTRAIT	https://pbfestival.ir/uploads/b4d02958-fa30-4692-9064-136e21bd6222.jpg	image/jpeg	345688	0	2026-10-12 20:11:35.458
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "userId", message, read, "createdAt") FROM stdin;
\.


--
-- Data for Name: ParticipantProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ParticipantProfile" (id, "userId", "firstName", "lastName", mobile, province, city, "educationLevel", "fieldOfStudy", "professionalField", occupation, bio, interests, "regionId", slug, "pageVisibility", "createdAt", "updatedAt") FROM stdin;
2fc896b6-69a3-4efc-9f56-760cfca830a9	19be1b9e-7d5b-4482-8a06-f4776a34708f	عاطفه	لاکی	09035731324	بیرجند	بیرجند	لیسانس	بهداشت حرفه ای	کارشناس بهداشت حرفه ای	کارشناس بهداشت حرفه ای در بیمارستان		{"طراحی پوستر و کارت"}	db98ec12-343d-4b1d-9670-b8466d77c725	user-8	PRIVATE	2026-10-13 06:16:02.237	2026-10-13 06:16:02.237
c41544a9-9932-4ddc-8e3d-170652b7ecb0	320ef40a-48b5-4a51-badb-18f84eb0057f	احسان	علیزاده	09366197130	گیلان	سنگر	ماشین دارم بله	ماشین دارم بله	ماشین دارم بله	ماشین دارم بله	ماشین دارم بله\nماشین دارم بله\nماشین دارم بله	{همسر}	\N	member-ixvvi5	PUBLIC	2026-09-25 15:17:47.478	2026-09-25 15:50:51.941
54832d93-ca2a-4d09-8ec4-39d6b00adb46	a01ae82f-2df3-462d-9e3d-c4b07e781343	مبین	بهرام نژاد	09150912889	خراسان رضوی	مشهد	کارشناسی	مهندسی صنایع		مدیر تولید		{}	\N	member-telk2a	PRIVATE	2026-09-25 17:50:46.285	2026-10-03 19:35:51.856
17018422-10ed-4495-b180-ec4b7ee69ad8	18d7430e-d30d-4da9-aceb-70a2648de7ae	nilufar	Hoveida	09307780976	خراسان	مشهد	کارشناسی	معماری	زیبایی ناخن	خدمات زیبایی ناخن		{}	\N	nilufar-hoveida	PRIVATE	2026-10-08 10:13:24.946	2026-10-08 10:13:24.946
cf562c3e-e18a-4d28-8ebe-2d2779a8e0fa	ee49f63f-9e8d-406d-a4ef-a0a471a51861	مبین	بهرام نژاد	09150912889	خراسان رضوی	مشهد	کارشناسی	مهندسی صنایع		مدیر تولید		{}	\N	user	PRIVATE	2026-10-09 16:57:01.703	2026-10-09 16:57:01.703
d561fd2e-bce0-46ea-aa68-e3f3ef548c58	7c8e96ca-9eeb-442e-94f5-2679e226493c	رحیم	غلامی	09224898737	خراسان رضوی	مشهد	کارشناسی ارشد	مدیریت مالی	سرمایه گذاری	مدیر سرمایه گذاری		{}	\N	member-l8tcaf	PRIVATE	2026-09-25 19:04:20.138	2026-10-09 17:35:12.77
ee64d124-1c6f-4fdf-badc-e1d596010245	369bfe81-8808-4dcc-b95a-3b3e853093bc	Nilufar	Ataeiyan	09360978100	khorasan	mashhad	master	xvc				{}	\N	nilufar-ataeiyan	PRIVATE	2026-10-09 17:57:57.422	2026-10-09 17:57:57.422
3f53f3bf-51ab-4a9b-9e31-17533f596a3c	07094648-082e-4cf4-bc9e-22a008d15a24	یاسر تستی	نوروززاده تستی	09366095686	خراسان رضوی	مشهد	کارشناسی ارشد					{}	\N	user-2	PRIVATE	2026-10-09 17:58:10.822	2026-10-09 17:58:10.822
19b13d97-5903-473a-9492-5a14aa749278	ac1ee269-acf6-4461-b75a-4a844e8f0643	رحیم	تست	09224898737	خراسان	مشهد						{}	\N	user-3	PRIVATE	2026-10-09 18:01:24.551	2026-10-09 18:01:24.551
cec264cc-c421-4069-8154-331731108821	e4a74b08-de5b-47d0-90c3-d58f4bad33a0	آسیه	فروردین	09151077581	تهران	تهران	کارشناسی ارشد	زبانشناسی	تولید محتوا	تولید کننده محتوا		{}	\N	user-4	PRIVATE	2026-10-10 04:30:05.396	2026-10-10 04:30:05.396
d3fa51ef-b17a-49f0-8b6e-da5943681ced	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	نورالدین	هویدا	09150036518	مشهد	مشهد	فوق لیسانس	مدیریت پروژه	برنامه نویسی			{}	831852b8-e625-485b-acf1-3bbc3013272e	member-8iwgdv	PUBLIC	2026-09-25 12:41:21.31	2026-10-10 17:02:14.423
11d2f94d-d6f2-4a67-a9d4-284420a26bda	33347108-378b-4752-8aa1-2049715b6621	رحیم تست	غلامی تست	09224898737	مشهد	مشهد						{}	831852b8-e625-485b-acf1-3bbc3013272e	user-5	PRIVATE	2026-10-10 18:19:20.603	2026-10-10 18:19:20.603
51c2ad4e-b0d4-41aa-834c-83933510bb31	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	نورالدین	هویدا	09307780976	مشهد	مشهد	فوق لیسانس	مدیریت پروژه				{}	831852b8-e625-485b-acf1-3bbc3013272e	user-6	PRIVATE	2026-10-12 15:07:58.781	2026-10-12 15:07:58.781
93e1e97d-2f8e-49c3-8eac-1a26547ec29a	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	یاسر	نوروززاده	09150036519	مشهد	مشهد	کارشناسی ارشد	مدیریت استراتژیک		مدیر ارتباطات سازمانی شرکت اکو	به قول جی.آر.آر مارتین؛ "باید بریم دنبال طلای فراموش شده‌مان پیش از آنکه روز به پایان برسد". 	{}	831852b8-e625-485b-acf1-3bbc3013272e	member-to6gds	PUBLIC	2026-09-30 16:40:50.33	2026-10-12 20:13:30.061
f5297151-99dc-43ee-80dc-29e1c687fe38	fd7ef889-bafb-4a6b-8bcf-e0527425a4b2	نجمه	معصومی نژاد	09374626077	مشهد	مشهد	لیسانس	مشاوره	مشاوره کودکان با نیاز های خاص	مشاور کودکان با نیاز های خاص		{}	831852b8-e625-485b-acf1-3bbc3013272e	user-7	PRIVATE	2026-10-12 20:36:57.629	2026-10-12 20:36:57.629
\.


--
-- Data for Name: PersonalPage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PersonalPage" (id, "participantId", tagline, "identityWords", "strengthsJson", "valuesJson", "introText", "introMediaUrl", "roadmapText", featured, finalist, "winnerCategory", "publishedAt") FROM stdin;
0a472e2f-65d2-4e94-9b20-46b55c6ea9b3	d3fa51ef-b17a-49f0-8b6e-da5943681ced	چیزی که تو را نکشد تو را قوی تر می کند.	{خلاق,منعطف,"مسئولیت پذیر",مدیر}	\N	\N	\N	\N	\N	f	f	\N	2026-09-25 12:44:12.573
5316b053-02b5-499b-aeaf-91e4f2952fa1	c41544a9-9932-4ddc-8e3d-170652b7ecb0	بشکاف برو جلو	{}	\N	\N	ماشین دارم 	\N	همسر	f	f	\N	2026-09-25 15:50:51.94
ad175bd0-2141-4f42-ab72-ef5c6c7c1176	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	We must away, ere break of day, to find our long-forgotten gold	{"جزئی نگر",فرایندمحور}	\N	\N	بواسطه‌ی تجربیاتم میتونم به افرادی که میخوان تصمیمات شغلی یا تحصیلی بگیرن کمک کنم. همچنین یکی از مهارت‌هام بهبود دادن فرایندهای شرکت‌هایی هست که احساس می‌کنن کُند شدن و بروکراسی در اون‌ها داره زیاد میشه.	\N	\N	f	f	افرین	2026-09-30 16:43:45.171
\.


--
-- Data for Name: PhoneVerificationCode; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PhoneVerificationCode" (id, "userId", code, "expiresAt", "createdAt") FROM stdin;
a966241e-e22c-41b3-8381-035bc38a474a	ee52d100-cd63-4370-a7df-4b9efdc46e6b	378552	2026-10-11 07:57:52.055	2026-10-11 07:42:52.057
71b1e0cf-247f-41ad-9071-501ecf89fcb3	760ca9d7-df2b-411a-bb19-17d3d27ac685	748071	2026-10-11 10:40:21.012	2026-10-11 10:24:46.109
\.


--
-- Data for Name: PreAssessment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PreAssessment" (id, "participantId", university, "linkedinUrl", "personalWebsiteUrl", "instagramHandle", "programGoal", "goalDescription", "selfAssessment", "qualitativeAnswers", "digitalPresence", "coordinatorNote", "submittedAt", "updatedAt") FROM stdin;
214a4d12-feb4-4765-8a5b-e69ef253e7bf	d3fa51ef-b17a-49f0-8b6e-da5943681ced	آزاد مشهد	\N	\N	\N	توسعه شبکه حرفه‌ای	\N	[{"axis": "تخصص و دانش فنی", "target": 10, "current": 4}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 10, "current": 6}, {"axis": "شبکه حرفه‌ای", "target": 10, "current": 4}, {"axis": "پورتفولیو / نمونه‌کار", "target": 9, "current": 1}, {"axis": "حضور آنلاین", "target": 8, "current": 1}, {"axis": "شهرت در حوزه", "target": 8, "current": 1}]	[{"answer": "علاقه مند به یادگیری و طراحی سیستم ", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "انعطاف در برخورد با دیگران", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "تمام کسانی که کسب و کار سنتی دارند و تمام کسانی که هدف برگزاری یک رویداد آموزی دارند", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "من پیش بینیم مهاجرت به آمریکا هستش و بعنوان یک برنامه نویس بازی های آموزشی", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "پرزنت کردن خودم", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "بله", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": true, "quality": 1, "platform": "لینکدین", "followers": 20, "lastUpdate": ""}, {"has": true, "quality": 1, "platform": "اینستاگرام", "followers": 500, "lastUpdate": ""}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-09-25 14:55:59.642	2026-09-25 14:55:59.642
02e67687-d24e-4bc0-b8b2-766f05b3d9f7	17018422-10ed-4495-b180-ec4b7ee69ad8	آزاد زاهدان	\N	\N	\N	آشنایی با مفاهیم برند شخصی	\N	[{"axis": "تخصص و دانش فنی", "target": 8, "current": 5}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 8, "current": 5}, {"axis": "شبکه حرفه‌ای", "target": 8, "current": 5}, {"axis": "پورتفولیو / نمونه‌کار", "target": 8, "current": 5}, {"axis": "حضور آنلاین", "target": 8, "current": 5}, {"axis": "شهرت در حوزه", "target": 8, "current": 5}]	[{"answer": "ب", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "ب", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "ب", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "ب", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "ب", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "ب", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": false, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-08 11:49:42.639	2026-10-08 11:49:42.639
4de566be-2e8f-4bb3-8391-8aaebc839fea	cf562c3e-e18a-4d28-8ebe-2d2779a8e0fa	اقبال لاهوری	-	-	-	توسعه شبکه حرفه‌ای	\N	[{"axis": "تخصص و دانش فنی", "target": 8, "current": 5}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 8, "current": 5}, {"axis": "شبکه حرفه‌ای", "target": 8, "current": 5}, {"axis": "پورتفولیو / نمونه‌کار", "target": 8, "current": 5}, {"axis": "حضور آنلاین", "target": 8, "current": 5}, {"axis": "شهرت در حوزه", "target": 8, "current": 5}]	[{"answer": "-", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "-", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "-", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "-", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "-", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "-", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": true, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": ""}, {"has": true, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": ""}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-09 17:02:26.258	2026-10-09 17:02:26.258
467766ca-30f4-4665-a38e-ab708dd7da6c	ee64d124-1c6f-4fdf-badc-e1d596010245	ازاد زاهدان	\N	\N	\N	آشنایی با مفاهیم برند شخصی	\N	[{"axis": "تخصص و دانش فنی", "target": 8, "current": 5}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 8, "current": 5}, {"axis": "شبکه حرفه‌ای", "target": 8, "current": 5}, {"axis": "پورتفولیو / نمونه‌کار", "target": 8, "current": 5}, {"axis": "حضور آنلاین", "target": 8, "current": 5}, {"axis": "شهرت در حوزه", "target": 8, "current": 5}]	[{"answer": "ت", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "ت", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "ت", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "ت", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "ت", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "ت", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": false, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-10 18:16:51.023	2026-10-10 18:16:51.023
134ff38b-7ffc-4555-bbba-41215a7479da	3f53f3bf-51ab-4a9b-9e31-17533f596a3c	fsdf	sdfsdf	sdfsdfs	sdfsdf	آشنایی با مفاهیم برند شخصی	sdffsdf	[{"axis": "تخصص و دانش فنی", "target": 8, "current": 5}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 8, "current": 5}, {"axis": "شبکه حرفه‌ای", "target": 8, "current": 5}, {"axis": "پورتفولیو / نمونه‌کار", "target": 8, "current": 5}, {"axis": "حضور آنلاین", "target": 8, "current": 5}, {"axis": "شهرت در حوزه", "target": 8, "current": 5}]	[{"answer": "asd", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "ads", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "asd", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "asd", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "asdasd", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "azdfa", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": true, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": ""}, {"has": true, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": ""}, {"has": true, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": ""}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-12 18:11:17.432	2026-10-12 18:11:17.432
\.


--
-- Data for Name: Question; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Question" (id, text, stage, "inputType", options, "situationId", "traitId", "correctOption", "weightCorrect", "weightIncorrect", "journeySectionId", "bootcampId", "order") FROM stdin;
2f59d45e-a24b-4e77-ab2e-9d26cfe7b06b	سه ویژگی متمایز کننده از خودت بنویس	AFTER	TEXT	{}	\N	\N	\N	\N	\N	\N	0c753d22-b105-458e-b5eb-0e97105dad14	0
8dca074d-6d4f-4f51-b476-226a7adaba5e	حوزه‌ی اصلی مهارتت به کدوم نزدیک‌تره؟	BEFORE	MULTI_CHOICE	{"کدنویسی و فنی","طراحی و بصری","بازاریابی و فروش","تولید محتوا و رسانه","تحلیل و مدیریت"}	\N	\N	\N	\N	\N	\N	\N	0
43ce0a86-fa9c-4f09-a401-3c25dd43a55c	۲ تا مهارت سخت یا ابزار تخصصی که در حال حاضر می‌تونی باهاشون یک پروژه یا خروجی واقعی بدون کمک دیگران تحویل بدی رو بنویس.	BEFORE	TEXT	{}	\N	\N	\N	\N	\N	f53db634-4ac8-4b32-971a-6528466cdb66	\N	0
5f5af80c-1cf0-49bd-b6b2-d99cb42a055a	چه موضوع تخصصی هست که حتی اگر تا ۶ ماه آینده هیچ درآمدی ازش نداشته باشی، باز هم حاضری هر هفته ۵ ساعت با اشتیاق براش وقت بذاری و یاد بگیری؟	BEFORE	TEXT	{}	\N	\N	\N	\N	\N	d70a73b4-8e04-43cb-a1ad-5291f3bedb89	\N	0
2880137d-ba59-4cd6-bfe7-c73d93a70e39	وضعیت تقاضا و آگهی‌های واقعی برای مهارتی که انتخاب کردی در بازار فعلی چطوره؟	BEFORE	SINGLE_CHOICE	{"الف) تقاضای بالا و مستمر (آگهی‌ها و پروژه‌های استخدام فراوان)","ب) تقاضای تخصصی و محدود (پروژه‌ها هست اما باید شبکه ارتباطی داشته باشی)","ج) بازار سنتی و نیازمند فرهنگ‌سازی (مخاطب هنوز ارزشش رو نمی‌دونه)","د) دقیقاً نمی‌دونم، هنوز سرچ جدی نکردم"}	\N	\N	\N	\N	\N	33ea8862-3f09-4592-a3ed-fd54cca6fc76	\N	0
93960152-dc80-43d6-a793-a1f9acccd47e	عنوان حوزه فعالیتت رو به یک صنعت خاص یا یک درد مشخص از مخاطب محدود کن و در قالب یک عبارت بنویس.	BEFORE	TEXT	{}	\N	\N	\N	\N	\N	2cc2e6d5-fd20-4c42-b2bd-f9d38408387f	\N	0
148ae6be-1d0a-48bd-898e-f30000ddc11a	این جمله رو کامل کن: من به [مخاطب هدف من] کمک می‌کنم تا بدون [چالش و دردسر رایج]، به [نتیجه ملموس و مشخص] برسه.	BEFORE	TEXT	{}	\N	\N	\N	\N	\N	09fa2996-1022-4e0d-8738-d2938576d994	\N	0
ba0c91ec-2c9d-4230-93ff-f70e88eb16c8	لینک پروفایل لینکدین یا صفحه کاری اصلی‌ات رو که عکس استاندارد، عنوان شغلی جدید و بیو شفاف روش اعمال کردی بذار	BEFORE	LINK	{}	\N	\N	\N	\N	\N	416299f6-e1d1-4205-8070-75a5c8101f81	\N	0
37d06527-3356-456f-a05d-c0df5d1c325f	لینک پستی رو بذار که در اون یک چالش فنی، کتاب خوانده‌شده، ابزار جدید یا تجربه یادگیری اخیرت رو برای بقیه مستند کردی.	BEFORE	LINK	{}	\N	\N	\N	\N	\N	9540bbae-b17e-451e-a508-8c89b134d25d	\N	0
4969e0aa-1f28-4f93-9826-6be32f1feef8	لینک یک نمونه‌کار زنده، گیت‌هاب، پورتفولیو، قالب کاربردی، یا فایل تحلیلی از پروژه‌ای که شخصاً انجام دادی رو وارد کن.	BEFORE	TEXT	{}	\N	\N	\N	\N	\N	c0c9f198-e1fa-431c-9eb2-57f7abe067a0	\N	0
758bd29b-067d-4dbf-b150-37849672ce35	لینک یک نمونه‌کار زنده، گیت‌هاب، پورتفولیو، قالب کاربردی، یا فایل تحلیلی از پروژه‌ای که شخصاً انجام دادی رو وارد کن.	BEFORE	LINK	{}	\N	\N	\N	\N	\N	c0c9f198-e1fa-431c-9eb2-57f7abe067a0	\N	0
94e27ad3-bb7f-4997-ae38-8628b9062302	متن کامنت تخصصی و تحلیلیِ حداقل ۳ خطی که زیر پست یکی از افراد شاخص حوزه خودت نوشتی رو کپی کن و اینجا بذار.	BEFORE	TEXT	{}	\N	\N	\N	\N	\N	42ff2d73-416f-49dc-9306-7299a9ce0263	\N	0
6113b5a0-c8dc-455c-b7fb-bc91986209c4	واقع‌بینانه‌ترین ریتمی که می‌تونی برای ۴ هفته آینده بدون هیچ بهانه‌ای بهش متعهد باشی کدومه؟	BEFORE	SINGLE_CHOICE	{"الف) هفته‌ای ۱ پست تخصصی + ۲۰ دقیقه تعامل در شبکه‌های حرفه‌ای","ب) هفته‌ای ۲ پست کاربردی + ۳۰ دقیقه تعامل روزانه","ج) هفته‌ای ۳ پست و تعامل فعال مستمر"}	\N	\N	\N	\N	\N	6918b438-7753-49d6-b640-18fa248817a6	\N	0
\.


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RefreshToken" (id, "userId", "tokenHash", "expiresAt", revoked, "createdAt") FROM stdin;
0e5b6051-2878-4fb1-baf4-3e81dedb3c7e	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	7d4901e38e0089e2331c4333325b8f587add253202ce68ca1ce04461a60626c5	2026-11-11 18:11:28.334	f	2026-10-12 18:11:28.335
f68f165d-af49-4ea4-8c29-e300969b7fd8	369bfe81-8808-4dcc-b95a-3b3e853093bc	7d1e44d6c67c6d635bcd06a0b6cf89e297ba129c502d98e1ebe923abfc498866	2026-10-25 13:58:17.503	f	2026-09-25 13:58:17.504
083233f5-3c19-4e79-a2f3-86423e279760	369bfe81-8808-4dcc-b95a-3b3e853093bc	ca94a0e26fa8652fdb04b340a868f3f36c1b269b1923c0fae6d001b60bd30354	2026-10-25 14:50:04.82	f	2026-09-25 14:50:04.821
81661104-ac8a-4ba8-8d71-76d5d0741a96	320ef40a-48b5-4a51-badb-18f84eb0057f	de053e6e86e9322e582cbe50c19058958700faf922242c81564376b102748081	2026-10-25 15:15:35.361	f	2026-09-25 15:15:35.362
09bdbb86-be96-4368-88d5-cf54bfba6435	320ef40a-48b5-4a51-badb-18f84eb0057f	e23a3c983e15aaedd7e82d02e7a75762376d29a847255ee32e1f5f5811f22499	2026-10-25 15:16:39.194	f	2026-09-25 15:16:39.195
596a37b2-b2d0-4f5c-9010-b791cadfcadc	320ef40a-48b5-4a51-badb-18f84eb0057f	a2b6b3c9711e570cfcb2543059fac359a4d44a09a795e9e7845ead4c56b344cc	2026-10-25 15:27:59.662	f	2026-09-25 15:27:59.663
6efd1a81-8fa8-4eae-bc20-9a9a7509933c	320ef40a-48b5-4a51-badb-18f84eb0057f	b59fbeb24bf10edba8b268bd924e58dc16ac12236cb9c0fb16c5122116f933d7	2026-10-25 15:48:48.238	f	2026-09-25 15:48:48.24
475f4aa1-2eb3-429e-9e70-1d91e60fb442	320ef40a-48b5-4a51-badb-18f84eb0057f	5d3c5d88d0e471c47f6736c71b303fd1bfe89af14275ded910959d9b3602c0d7	2026-10-25 15:51:33.856	f	2026-09-25 15:51:33.857
4a4cb89b-e389-4614-806f-59f011369b9b	320ef40a-48b5-4a51-badb-18f84eb0057f	d32d69ef1bbf0a1b20fd6e324457bdd2919b88f85c5ca5a9ec429c452059d507	2026-10-25 15:52:49.267	f	2026-09-25 15:52:49.268
23d0ddf7-ae2b-4aaf-a857-0807e36bff77	a01ae82f-2df3-462d-9e3d-c4b07e781343	a569bd27cb22319a61208d8622c65e0f4fd9a45f0a24271c5355727b91884f36	2026-10-25 17:49:12.447	f	2026-09-25 17:49:12.448
05a6e326-76f3-414f-a18a-3a592547906d	a01ae82f-2df3-462d-9e3d-c4b07e781343	bbd4c1331d15f9560d60a681b7ef531ba61c1f84aa551fc6344b45978541accd	2026-10-25 17:49:54.896	f	2026-09-25 17:49:54.897
95ae6376-254c-4aa3-ba1a-50dae0eff3a8	7c8e96ca-9eeb-442e-94f5-2679e226493c	842ee3c6bf0657c8cf4f72937b4122a105cde21ce67a7608b5a581ac0a08c832	2026-10-25 19:03:26.228	f	2026-09-25 19:03:26.229
67ad4e34-5266-4c54-b2dd-1423cbe575f6	7c8e96ca-9eeb-442e-94f5-2679e226493c	bb1a21da1edc4d60f105fd8c12db51c51a7e519a1dc6a2e1515f16c50beb0344	2026-10-25 19:03:39.578	f	2026-09-25 19:03:39.579
a68ccda8-31c9-4f4e-93b0-a771167f0d4e	320ef40a-48b5-4a51-badb-18f84eb0057f	34e36e358be11fb489d2576dd3c78b782f837957ae989c534358585a5ae8de6e	2026-10-29 20:41:43.573	f	2026-09-29 20:41:43.576
5eca546a-d497-4513-9e63-f25d2eb11add	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	6f96ac438898a0046b8a445fdc5e2854b071cdb2a85be5aa4123caf05e274744	2026-10-30 07:27:07.635	f	2026-09-30 07:27:07.636
b5dfebfe-c92f-4280-8a75-a59fab5eb209	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	d37ac51d7e9f95c344cff60b7fdc7f7a493d6ade37f138a0d87b8d57f3525341	2026-10-30 16:37:49.631	f	2026-09-30 16:37:49.632
d67e2429-24b7-4dee-9059-07680aca6c41	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	4f21f56f314a9f9da7193941b42eec5773335e246bd7321c885db3533e5eb75b	2026-10-30 16:46:35.583	f	2026-09-30 16:46:35.584
07fb6e2b-1a2f-4c62-9a55-5e1cbc3a66b2	369bfe81-8808-4dcc-b95a-3b3e853093bc	72b9f0b9cf2da48e010e838c9d5f58a2954c691047f8b5956aba7d776406ba9b	2026-11-01 10:50:45.627	f	2026-10-02 10:50:45.629
3b9741e6-2b87-4475-aca5-cc2474a86abc	18d7430e-d30d-4da9-aceb-70a2648de7ae	72be2332b0033d63c511ac93adda1d00c7839f35b4d83e0743d13bae0363956a	2026-11-11 13:58:30.42	f	2026-10-12 13:58:30.421
8cf7ca8a-1eca-4a1a-8721-6681c46a6f37	19be1b9e-7d5b-4482-8a06-f4776a34708f	b5d4e562372c956c588afff78cb891fd81719c8fd68866ca15bbf862b9e3350a	2026-11-12 06:14:38.631	f	2026-10-13 06:14:38.632
c85d3a60-4191-42eb-bf89-49e5d7391196	a01ae82f-2df3-462d-9e3d-c4b07e781343	ec4a1cd64133367e76ae10d47ca306ae43f433b0312f392b3159798750fcc5b3	2026-11-02 09:08:59.807	f	2026-10-03 09:08:59.808
a528450d-42cd-45aa-84f9-6228bc57458a	a01ae82f-2df3-462d-9e3d-c4b07e781343	821bedb7539bf522b4e3eb0c44e967a8fc7e66cc7793e63f8e7f24497ab67749	2026-11-02 09:10:04.835	f	2026-10-03 09:10:04.836
2b9d5101-bd32-4edf-a814-7700c27678d8	a01ae82f-2df3-462d-9e3d-c4b07e781343	57bb82b3f19c461b43a083fa7ca3240893ce1ae3b9400174c99c897390b12c86	2026-11-02 09:11:15.426	f	2026-10-03 09:11:15.428
e5fbcf4a-27f5-4e78-b647-d3155d97f340	7c8e96ca-9eeb-442e-94f5-2679e226493c	5053f45cfc972d01cf765a0d7c505eec489b6b4b35c7e7d8e4e3de2d6a517a6c	2026-11-02 14:17:52.718	f	2026-10-03 14:17:52.719
32722942-b9aa-429e-9e8e-8050d6f3662a	7c8e96ca-9eeb-442e-94f5-2679e226493c	e3c4f572b508315d6b06c22e1cc4385732d76ea5415e84195e0a30cd6840f7d5	2026-11-02 14:18:47.206	f	2026-10-03 14:18:47.207
b063bcbd-bd3d-419a-bfcd-38d2957cba4a	a01ae82f-2df3-462d-9e3d-c4b07e781343	6dc9a6cbbb63c1a6fcd748407982ef34b193b3b2f5e18cad130250724b2dd474	2026-11-02 14:46:32.543	f	2026-10-03 14:46:32.544
68f9bd68-f2b6-495d-b3be-436f34b655c4	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	dd6e5c965de115ac0968277d04676a949128c90decfa725c275aff57ab3eb4c9	2026-11-11 14:02:23.861	t	2026-10-12 14:02:23.862
626034fb-9d5b-4521-a10a-c28feaccf485	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	3863d5d9f7728f66d64c96a8012b631dc539e577c0689c990018993eb7e91e27	2026-11-11 14:03:11.435	t	2026-10-12 14:03:11.436
e88109eb-7022-4574-8142-7e71eeac5b2e	a01ae82f-2df3-462d-9e3d-c4b07e781343	d1350cd83210299a6ff43a758b5a66f601af62928d832ad254e59797273edc5e	2026-11-02 19:35:01.292	f	2026-10-03 19:35:01.293
0cb0f45d-405b-4a8d-8a15-44362b53f566	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	6526078a9efb54f8a0b16c24cb7ea90276f068ad785b73bb7ded899a69e12ba9	2026-11-11 15:04:14.106	f	2026-10-12 15:04:14.107
c3ae2f95-ad36-4aec-9c1f-4a4544f0afa6	07094648-082e-4cf4-bc9e-22a008d15a24	622da485be99d3052c9261cc69d27e8c8b641266cc43048f90ec79460d8d6565	2026-11-08 17:57:00.297	t	2026-10-09 17:57:00.299
6b64562f-148e-43ee-89ab-14f3839dfb8b	369bfe81-8808-4dcc-b95a-3b3e853093bc	7ab1852578048fe50799a74ec0baf4a28a9abc7a49f90abc834deb3dc4d2c39e	2026-11-07 12:32:14.517	f	2026-10-08 12:32:14.52
2d73ae8d-5805-405e-9f97-56e6aa13c0e7	369bfe81-8808-4dcc-b95a-3b3e853093bc	3f5179ef66ec76d5e4c2bee02e521ff65e4c8999820497db11b017b72812fe0f	2026-11-07 12:35:02.774	f	2026-10-08 12:35:02.775
5e600988-cbd8-480e-90d3-7126d67d450f	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	b036d75225216212dbea60530ee4d98c81828e3fc236ed86459b8502a2325554	2026-11-08 15:10:30.322	f	2026-10-09 15:10:30.324
7cb27310-ae02-47a0-b20a-bd8e7c36ba90	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	16f060653e2ca797d686833527d171cab33edaf661a9e96413726bfdf11d549d	2026-11-08 15:11:41.113	f	2026-10-09 15:11:41.115
c3471f11-b05e-438e-8414-8f4f50f06745	7c8e96ca-9eeb-442e-94f5-2679e226493c	b4530b52f8ae17de0767108e5b066487f6229011791b7870ab4eca8c1c59db94	2026-11-08 16:49:20.066	f	2026-10-09 16:49:20.067
c2bfb902-95bd-4914-b2f4-b53d3831c45c	7c8e96ca-9eeb-442e-94f5-2679e226493c	975840f4d3e59997e437a0c554da7b7b1662646ebe259edb1bfacf491421b21d	2026-11-08 16:49:31.774	f	2026-10-09 16:49:31.775
5bc4ba47-0b3d-4dc8-91a0-bfd4e1421a6b	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	3f1156712d27628846299252e3af40c841d1aa3485df1646c6e7bb13b4141c0d	2026-11-08 16:49:57.7	f	2026-10-09 16:49:57.701
6b353885-fad4-4085-82db-473709b04f3e	ee49f63f-9e8d-406d-a4ef-a0a471a51861	fbf4643740c92a7026599ea06524826c111bb711df7ab0c837d1f656edf3227d	2026-11-08 16:50:40.149	f	2026-10-09 16:50:40.151
d447f900-7391-4feb-9522-e2c08c8dd5b1	ee49f63f-9e8d-406d-a4ef-a0a471a51861	918a71b60198005c3be61811697866c460a45d110f4fbd385187fd6f8dd0ea55	2026-11-08 16:51:01.312	f	2026-10-09 16:51:01.313
8318c6d6-c121-4fc0-b32b-f309f412152d	7c8e96ca-9eeb-442e-94f5-2679e226493c	d23c3368f332b7a8ab6c406d0d1a76ab252063298cf81d2595e31107e26023a7	2026-11-08 17:00:07.139	f	2026-10-09 17:00:07.14
63db3482-fd25-49bf-85ae-aba625460cb3	ee49f63f-9e8d-406d-a4ef-a0a471a51861	4a421352c81ab15c33a26ec1ae152a03c539084de585fc08bc8d6638e938e9f5	2026-11-08 17:01:26.367	t	2026-10-09 17:01:26.37
9fe096ce-ed65-40df-9197-6b7ae3312ee7	ee49f63f-9e8d-406d-a4ef-a0a471a51861	5eab6e0b3c57d5e44ce491d4a9aa9234ff811580483166a657e0a6e4c3e0abdf	2026-11-08 17:04:46.127	t	2026-10-09 17:04:46.128
aaf8db9c-79bf-4bf9-93bb-0e0abc6358c3	a01ae82f-2df3-462d-9e3d-c4b07e781343	c1e6071f0ebbebb2d4658ceb5d66e041c84a8010796381b73b307653ac49c4d3	2026-11-08 17:06:20.227	f	2026-10-09 17:06:20.23
7916675d-e6cc-4cc8-8abf-51c2729bfd08	7c8e96ca-9eeb-442e-94f5-2679e226493c	ac805bdc817dda3787d83e3875dcfbd6de96b352c9c69062f8bdff908d971386	2026-11-08 17:42:39.048	f	2026-10-09 17:42:39.049
1d47073a-2ef0-49e9-b655-73bf9c0eae2c	7c8e96ca-9eeb-442e-94f5-2679e226493c	0534e961fa9dc152bc1e4e2bdc62527dea14cc53cfd1d4ac5aef088bdf80de38	2026-11-08 17:47:10.144	f	2026-10-09 17:47:10.145
f6c09667-56d9-4e4d-b182-0b8510f9d560	07094648-082e-4cf4-bc9e-22a008d15a24	fc1e241b2562a16aeda74f3372b24273926fc2680518241d7ac340cbff76732d	2026-11-08 17:56:45.749	f	2026-10-09 17:56:45.75
c36f8d99-3d70-4979-b2ea-9d98fcddf567	369bfe81-8808-4dcc-b95a-3b3e853093bc	bcf957c3194d41721ca210e804d1f6725cc6859010e5e5ffc9de77c16f55a4ce	2026-11-08 17:57:12.524	f	2026-10-09 17:57:12.526
742e1e15-71e4-4ab7-bca9-024612c44aae	ac1ee269-acf6-4461-b75a-4a844e8f0643	4b4297bc9017af6e3ae1742094923941de5303a0ef818977fbd8b5196a42ce6d	2026-11-08 18:00:44.616	f	2026-10-09 18:00:44.617
3eff3470-f234-4778-830b-e5384bc150f3	ac1ee269-acf6-4461-b75a-4a844e8f0643	980c6e959f58b409c7dca10b465065b0717ee61465bce892bf478a61002be065	2026-11-08 18:01:05.935	f	2026-10-09 18:01:05.936
c0dd4e71-00fd-4db2-8ced-c47783f92e32	e4a74b08-de5b-47d0-90c3-d58f4bad33a0	43725f8f7b6f0be4fdcd2ebfa4d9de1ad11d8fb86c71a3fa0017fdb68faf732c	2026-11-09 04:27:26.345	f	2026-10-10 04:27:26.347
8fc13e95-27ee-4c5e-aed1-1d28a14c35b3	e4a74b08-de5b-47d0-90c3-d58f4bad33a0	633b7286f4cc9de514787ef89404b4c0aea50e78d849470c8a53a4f9b350ed21	2026-11-09 04:29:00.882	f	2026-10-10 04:29:00.883
45c06422-7ec9-4b18-9132-b605e6dbf245	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	0a96962a8f5c6464e17c054a45cf646d3a03141acc9d277be2a00e1abf95860c	2026-11-11 17:48:31.902	f	2026-10-12 17:48:31.905
aac45207-0c3b-419d-b4b1-1368b64b22ee	369bfe81-8808-4dcc-b95a-3b3e853093bc	9c65aa729fa0bbd08765b72b4829f9ac8723e57b8e5f235d53536c590246e603	2026-11-09 18:15:55.582	f	2026-10-10 18:15:55.583
3f6bc863-75be-42a4-965b-d3cb7caa05ea	33347108-378b-4752-8aa1-2049715b6621	ad69d44baeb1477ce3ec7c5ea9bdf667851e2aa6e4f8e7af9e727b4bd9df5476	2026-11-09 18:18:37.765	f	2026-10-10 18:18:37.767
7612af78-9cba-4ea9-9f8c-b08c1d2c8ce7	33347108-378b-4752-8aa1-2049715b6621	8251f6e0bc9b718315e3249e96009986b6accb963a852294f01cada2ddc61b35	2026-11-09 18:18:47.721	f	2026-10-10 18:18:47.722
282d8415-b654-438c-8b24-5bc46c1be0b2	320ef40a-48b5-4a51-badb-18f84eb0057f	5bcdf451d9a4b6b93a3c430dcbe5bdd160a67482a9abaa3b1c951e0c1bbf1258	2026-11-09 23:21:38.789	f	2026-10-10 23:21:38.79
ee2e9a42-eb37-4d10-8061-48c24bb01f6d	221f98d8-a8e2-488e-bd65-d5aac7dd12a7	2c264722e47371c32269d948a99648ecf4a8caf826aa9ed78f37c28a190e2048	2026-11-10 08:14:53.82	f	2026-10-11 08:14:53.822
fed178c9-b42e-40c8-bc5f-144673a8f384	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	96dfd345c36c4f7cd990c01de34b19a55c73c521f024d3a8b95b6a9a2fe09d6f	2026-11-10 10:21:22.802	f	2026-10-11 10:21:22.804
706181d0-7b65-47bc-a281-fccad3f25148	fd7ef889-bafb-4a6b-8bcf-e0527425a4b2	d9bbd9942a3d33062437b5def65eaa4847c23988292ed0c18556b59d1f78ce4d	2026-11-10 10:26:48.931	f	2026-10-11 10:26:48.932
5b9217aa-2bd4-47f8-a07a-d0a809ea784e	320ef40a-48b5-4a51-badb-18f84eb0057f	2ce83c35e3c4ccbd84802e7900b0c2b59b9aa6bed7c6329acf10adb2b2bbe832	2026-11-10 10:48:06.658	f	2026-10-11 10:48:06.659
\.


--
-- Data for Name: Region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Region" (id, name) FROM stdin;
3c9c98d3-164e-47c4-a166-b38dc648d950	تهران
831852b8-e625-485b-acf1-3bbc3013272e	مشهد
db98ec12-343d-4b1d-9670-b8466d77c725	بیرجند
1d8e30bd-ed28-4631-bc37-81d00df13b35	زاهدان
2d6a67f6-d578-41a6-a971-da9517962f11	محلات
eecb60c8-7896-4aa7-976b-461395b29994	سیرجان و شهربابک
e4b8ae58-d72c-4063-9d37-c8b36a20e040	کرمان
\.


--
-- Data for Name: Response; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Response" (id, "participantId", "questionId", visibility, "createdAt", "selfTransformationScore", "reviewerScore", "reviewerFeedback") FROM stdin;
9d4434bf-e71b-4d8d-a770-4c2b8e33eec4	d3fa51ef-b17a-49f0-8b6e-da5943681ced	8dca074d-6d4f-4f51-b476-226a7adaba5e	PRIVATE	2026-10-11 17:03:09.912	\N	\N	\N
355c5b85-690a-4a5c-9042-6c573120841f	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	5f5af80c-1cf0-49bd-b6b2-d99cb42a055a	PRIVATE	2026-10-12 20:19:58.337	\N	\N	\N
\.


--
-- Data for Name: ResponseVersion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ResponseVersion" (id, "responseId", "versionNumber", content, stage, "bootcampId", "createdBy", "createdAt", "autoScore", "approvalStatus", "approvedBy", "approvedAt") FROM stdin;
61a6073e-83e6-415d-a4a5-1a075f559fbe	9d4434bf-e71b-4d8d-a770-4c2b8e33eec4	1	["کدنویسی و فنی","تحلیل و مدیریت"]	BEFORE	\N	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	2026-10-11 17:03:09.912	\N	APPROVED	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	2026-10-12 15:18:32.257
1c5a0d97-1db6-4338-8f41-922761d4d106	355c5b85-690a-4a5c-9042-6c573120841f	1	تحلیل داده	BEFORE	\N	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	2026-10-12 20:19:58.337	\N	PENDING	\N	\N
\.


--
-- Data for Name: Situation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Situation" (id, key, title, "createdAt") FROM stdin;
\.


--
-- Data for Name: Skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Skill" (id, "participantId", name, "createdAt") FROM stdin;
e42ecf80-5cd3-4b44-8b06-422c79aff28c	d3fa51ef-b17a-49f0-8b6e-da5943681ced	excel	2026-09-25 12:41:48.154
b4b69f1d-183e-4c07-b79f-30c4ae62233c	d3fa51ef-b17a-49f0-8b6e-da5943681ced	nodeJs	2026-09-25 12:41:53.83
38ff2676-8532-4f4b-aff2-d7f72088cb7a	d3fa51ef-b17a-49f0-8b6e-da5943681ced	react	2026-09-25 12:41:58.594
a8909e59-0ca2-43a9-816b-9cd709281d9a	d3fa51ef-b17a-49f0-8b6e-da5943681ced	vite	2026-09-25 12:42:01.022
f4f89261-aa48-4920-8d58-343459da68f0	d3fa51ef-b17a-49f0-8b6e-da5943681ced	saas	2026-09-25 12:42:04.238
f72e6f8a-31b9-41ef-a207-c585c05e0754	d3fa51ef-b17a-49f0-8b6e-da5943681ced	MSProject	2026-09-25 12:42:16.454
5d4f1d2b-98a4-457d-a775-2c53574aaa1f	d3fa51ef-b17a-49f0-8b6e-da5943681ced	AutoCad	2026-09-25 12:42:19.878
7d4558da-ddf0-4788-ad73-37e204b3fdfd	c41544a9-9932-4ddc-8e3d-170652b7ecb0	رانندگی	2026-09-25 15:18:28.027
e788dd15-4735-4561-825c-4474127b0d70	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	آفیس	2026-09-30 16:42:39.913
c32269c6-c94c-4717-9ea7-eb596d2e428c	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	پایتون	2026-09-30 16:42:48.551
d244d6b2-2a4b-4608-ac72-b4ed6756ce41	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	زبان انگلیسی	2026-09-30 16:42:57.722
bf0107af-f743-4311-b5ef-f36df47ad841	d3fa51ef-b17a-49f0-8b6e-da5943681ced	پایتون	2026-10-09 17:24:42.404
512c208f-b699-409e-88b4-6509919b5e57	d3fa51ef-b17a-49f0-8b6e-da5943681ced	زبان انگلیسی	2026-10-09 17:24:42.409
29f2b5af-491a-4612-89cd-bfbe27b0523e	d3fa51ef-b17a-49f0-8b6e-da5943681ced	رانندگی	2026-10-09 17:24:42.416
b3aca0ae-a6d1-4a8e-a95c-754f0a8f4420	d3fa51ef-b17a-49f0-8b6e-da5943681ced	اتوکد	2026-10-09 17:24:42.422
3369d43c-1837-49c4-9bbb-3eaf8c9e1381	d3fa51ef-b17a-49f0-8b6e-da5943681ced	آفیس	2026-10-09 17:24:42.429
bf6dad9a-d4d2-4a3e-936a-0dbb0e7eb466	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	AutoCad	2026-10-09 17:32:34.383
92ae8a4e-f6ad-4644-b086-b236d7fe6421	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	اکسل	2026-10-09 17:35:01.095
1600b9dd-ff41-4a1d-9b5f-dac35bccc2f8	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	python	2026-10-09 17:35:04.609
f00f61ab-71e7-4639-8c69-0733662f79eb	cec264cc-c421-4069-8154-331731108821	مدیریت	2026-10-10 04:30:40.632
9238b658-9a7b-4b0f-9c19-6d59c4614d45	2fc896b6-69a3-4efc-9f56-760cfca830a9	پاورپوینت	2026-10-13 06:17:51.14
7b0f6466-7f6d-4fe4-ae1d-950bd0e07faa	2fc896b6-69a3-4efc-9f56-760cfca830a9	ورد	2026-10-13 06:18:04.099
0e63b941-0857-4afe-b25a-8bfab2017fd3	2fc896b6-69a3-4efc-9f56-760cfca830a9	کنوا	2026-10-13 06:18:13.614
37d48939-4ec2-4a5d-a322-ac6ec95529d9	2fc896b6-69a3-4efc-9f56-760cfca830a9	اکسل	2026-10-13 06:18:19.155
\.


--
-- Data for Name: SkillEndorsement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SkillEndorsement" (id, "skillId", "endorserName", vote, "createdAt") FROM stdin;
2c9ee45f-a72e-429c-a3dc-d6a1bb0ac112	7d4558da-ddf0-4788-ad73-37e204b3fdfd	\N	REJECT	2026-09-25 16:44:39.512
2844abe3-abee-4e01-90bd-ae9ded74dc2b	e42ecf80-5cd3-4b44-8b06-422c79aff28c	\N	ENDORSE	2026-09-25 19:49:43.245
a792b86c-16a6-4e00-baf5-e59b5c401fdd	b4b69f1d-183e-4c07-b79f-30c4ae62233c	\N	ENDORSE	2026-09-25 19:49:44.053
8d485372-99c0-464c-ad5f-d9648f6a89ac	38ff2676-8532-4f4b-aff2-d7f72088cb7a	\N	ENDORSE	2026-09-25 19:49:44.421
2e969dd5-1ac7-4804-af2f-de4225a42f21	a8909e59-0ca2-43a9-816b-9cd709281d9a	\N	ENDORSE	2026-09-25 19:49:45.263
fa5e0289-8be3-4b8c-86c1-96146f2585cf	f4f89261-aa48-4920-8d58-343459da68f0	\N	ENDORSE	2026-09-25 19:49:47.647
76476aba-4fbc-4bc4-bf23-b57a8094cb73	f72e6f8a-31b9-41ef-a207-c585c05e0754	\N	ENDORSE	2026-09-25 19:49:51.395
dfd09233-10cc-4187-8f36-f86aea1f6b2b	5d4f1d2b-98a4-457d-a775-2c53574aaa1f	\N	ENDORSE	2026-09-25 19:49:52.044
94c15506-3bcc-4d3c-a2f0-faa0fd756f4d	b4b69f1d-183e-4c07-b79f-30c4ae62233c	\N	ENDORSE	2026-09-25 19:50:02.922
8f513281-d1dc-4f83-8e10-7574ed7547b5	e42ecf80-5cd3-4b44-8b06-422c79aff28c	\N	ENDORSE	2026-09-25 19:50:02.926
41b713d5-0a13-46d0-b0a6-b696eaa5a989	f72e6f8a-31b9-41ef-a207-c585c05e0754	\N	ENDORSE	2026-09-25 19:50:02.932
464e574c-4b8f-4211-ab09-7261837de36f	5d4f1d2b-98a4-457d-a775-2c53574aaa1f	\N	ENDORSE	2026-09-25 19:50:02.937
032031f9-02c9-4127-9559-281d13ff8266	a8909e59-0ca2-43a9-816b-9cd709281d9a	\N	ENDORSE	2026-09-25 19:50:02.941
2b2cb4b4-7eb0-4dd0-8075-7d4d536ee555	f4f89261-aa48-4920-8d58-343459da68f0	\N	ENDORSE	2026-09-25 19:50:02.944
ccf85c7e-55dc-4c5c-ba07-6556279f1d39	38ff2676-8532-4f4b-aff2-d7f72088cb7a	\N	ENDORSE	2026-09-25 19:50:02.948
03fa7fa3-d640-4352-9ece-6b55865a62a5	7d4558da-ddf0-4788-ad73-37e204b3fdfd	\N	ENDORSE	2026-09-29 22:15:31.112
d66ba32c-847c-40a4-9359-7f01fa04e215	e788dd15-4735-4561-825c-4474127b0d70	\N	ENDORSE	2026-10-03 15:49:46.749
c7a92377-362f-43c1-b858-fe333f619347	c32269c6-c94c-4717-9ea7-eb596d2e428c	\N	ENDORSE	2026-10-03 15:49:49.312
9555b287-f2a1-4ef9-9073-c648ffbd243e	d244d6b2-2a4b-4608-ac72-b4ed6756ce41	\N	ENDORSE	2026-10-03 15:49:50.08
fc1c3c85-f5e3-4849-ac11-3e7cf6957b8a	c32269c6-c94c-4717-9ea7-eb596d2e428c	\N	ENDORSE	2026-10-03 15:50:15.581
32b22eba-4526-42c3-a163-bf145c93c7ac	d244d6b2-2a4b-4608-ac72-b4ed6756ce41	\N	ENDORSE	2026-10-03 15:50:15.586
1773b194-2bd0-48ad-b880-7b58e37bae59	e788dd15-4735-4561-825c-4474127b0d70	\N	ENDORSE	2026-10-03 15:50:15.591
111b0d51-488b-4f36-b3b7-a7b4c7ed09e9	5d4f1d2b-98a4-457d-a775-2c53574aaa1f	\N	ENDORSE	2026-10-09 17:24:42.353
1b408960-3901-4119-8983-6d8e793314a7	f72e6f8a-31b9-41ef-a207-c585c05e0754	\N	ENDORSE	2026-10-09 17:24:42.376
bdf9f791-1a76-4d2f-8922-ba9d024c6432	e42ecf80-5cd3-4b44-8b06-422c79aff28c	\N	ENDORSE	2026-10-09 17:24:42.381
860257c5-08a3-4838-a335-b0a610e47280	b4b69f1d-183e-4c07-b79f-30c4ae62233c	\N	ENDORSE	2026-10-09 17:24:42.388
b4d95b2c-f082-496a-9489-0261212e3ea7	38ff2676-8532-4f4b-aff2-d7f72088cb7a	\N	ENDORSE	2026-10-09 17:24:42.394
e0502ede-8113-4738-b183-77bceeade10f	f4f89261-aa48-4920-8d58-343459da68f0	\N	ENDORSE	2026-10-09 17:24:42.398
b18d8808-3154-43e4-9ec2-0e63ac56cce7	a8909e59-0ca2-43a9-816b-9cd709281d9a	\N	ENDORSE	2026-10-09 17:24:42.402
bbb32fcc-a1a5-48ab-9667-74cab44afc86	bf0107af-f743-4311-b5ef-f36df47ad841	\N	ENDORSE	2026-10-09 17:24:42.407
467ce1c3-b0d4-4dae-8901-3b301ccea238	512c208f-b699-409e-88b4-6509919b5e57	\N	ENDORSE	2026-10-09 17:24:42.414
47d3641a-37bb-4d34-ae7a-41d3858931d0	29f2b5af-491a-4612-89cd-bfbe27b0523e	\N	ENDORSE	2026-10-09 17:24:42.42
590609d9-49ae-4dff-96eb-65a18e74f3cd	b3aca0ae-a6d1-4a8e-a95c-754f0a8f4420	\N	ENDORSE	2026-10-09 17:24:42.427
b08842cc-abc9-4311-8b6d-a985e93848cc	3369d43c-1837-49c4-9bbb-3eaf8c9e1381	\N	ENDORSE	2026-10-09 17:24:42.432
718dd764-959c-445e-ae5f-581dd983fb82	f72e6f8a-31b9-41ef-a207-c585c05e0754	محمدقلی	ENDORSE	2026-10-09 17:26:04.874
7ce18713-572e-4609-bf4d-1a3d874124de	e42ecf80-5cd3-4b44-8b06-422c79aff28c	محمدقلی	ENDORSE	2026-10-09 17:26:04.894
13b8b653-562c-4888-ae27-694f1c1a4b1c	b4b69f1d-183e-4c07-b79f-30c4ae62233c	محمدقلی	ENDORSE	2026-10-09 17:26:04.912
0f432a2d-4080-403f-a786-d55aa0b30dcc	bf6dad9a-d4d2-4a3e-936a-0dbb0e7eb466	Noor	ENDORSE	2026-10-09 17:32:34.388
071099a0-5547-402f-9da7-19c810c25007	e788dd15-4735-4561-825c-4474127b0d70	Noor	ENDORSE	2026-10-09 17:32:34.397
09ad47da-a21a-4e39-afbf-fe03584c9b59	c32269c6-c94c-4717-9ea7-eb596d2e428c	Noor	ENDORSE	2026-10-09 17:32:34.406
\.


--
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Task" (id, "bootcampId", title, description) FROM stdin;
6f829fe2-da0f-4117-aeb8-4c94e1e4ac73	0c753d22-b105-458e-b5eb-0e97105dad14	test	\N
\.


--
-- Data for Name: TaskSubmission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TaskSubmission" (id, "taskId", "participantId", content, "createdAt", "approvalStatus", "approvedBy", "approvedAt", score) FROM stdin;
\.


--
-- Data for Name: Trait; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Trait" (id, name) FROM stdin;
\.


--
-- Data for Name: TraitWeight; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TraitWeight" (id, "traitId", "situationId", weight, text, "mismatchWeight") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, "passwordHash", role, "createdAt", "updatedAt", "emailVerified", phone, "phoneVerified", "passwordResetCodeHash", "passwordResetExpiresAt") FROM stdin;
760ca9d7-df2b-411a-bb19-17d3d27ac685	\N	$2b$12$lI7u26IyC5oFeZ82xt7tmuF1jGDvr8rraEO.0DXa.dHREehHx6kbu	PARTICIPANT	2026-10-11 10:24:46.103	2026-10-11 10:24:46.103	f	09374626077	f	\N	\N
369bfe81-8808-4dcc-b95a-3b3e853093bc	nilufar.ataeiyan@gmail.com	$2b$12$0pLjL5P7qlhycY3qx.bkYefvwPUYTPI0gB705QbMmkBhBZAlNMTvy	PARTICIPANT	2026-09-25 12:50:27.362	2026-09-25 13:58:17.498	t	\N	f	\N	\N
320ef40a-48b5-4a51-badb-18f84eb0057f	defantuv2@gmail.com	$2b$12$MSk1eJ5JiD6SLhFjm5hate.coX2WbgdKCHwQUElEmvGcvVTGAN8AG	ADMIN	2026-09-25 15:14:56.038	2026-09-25 15:23:44.235	t	\N	f	\N	\N
fd7ef889-bafb-4a6b-8bcf-e0527425a4b2	najme2185@gmail.com	$2b$12$rwXS/JUFfUvmpmELm0ZzleBW19eFKhqLkPyARhz1gp7zkaaA/uNDi	PARTICIPANT	2026-10-11 10:25:56.158	2026-10-11 10:26:48.891	t	\N	f	\N	\N
18d7430e-d30d-4da9-aceb-70a2648de7ae	nailofnilufarhoveida@gmail.com	$2b$12$Yu/dTX5nrYxGUblmCGr85.nwqeqvDUe/P1JmfvpPWAX6AZUPb7WBm	PARTICIPANT	2026-09-25 12:46:11.781	2026-10-12 13:58:07.832	t	\N	f	\N	\N
b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	nooreddin.hoveida@gmail.com	$2b$12$PIh.WpI/bRew89CM7MR3Ueds6JN1vj6rw79wGYjAUxIdgZBxzLxLa	ADMIN	2026-09-25 12:39:25.78	2026-10-12 14:01:53.767	t	\N	f	\N	\N
d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	nooroddin.hoveida@gmail.com	$2b$12$O8IMU7K4x9Z69sKlOtqZ5uP0XE2r04NlcZ2FUX5neFDhGm1XoaFyi	EVALUATOR	2026-10-11 10:20:59.683	2026-10-12 15:03:09.418	t	\N	f	\N	\N
2cd4df68-138c-4d6d-9f52-3eda8f3eca49	yasern.business@gmail.com	$2b$12$vQQhtaY/ThSzLV1NnLDgWuXNzsoCRmphXdjvoNttwXLfHJRbj2T5W	ADMIN	2026-09-30 07:26:27.723	2026-09-30 10:07:11.922	t	\N	f	\N	\N
ee49f63f-9e8d-406d-a4ef-a0a471a51861	mobinmb13771994@gmail.com	$2b$12$U3Mf849Pg0Q7gw1lHmfireZ4kb71CynE.yb5fnTUqebP0toboIWBS	PARTICIPANT	2026-10-09 16:50:10.234	2026-10-09 16:50:40.135	t	\N	f	\N	\N
7c8e96ca-9eeb-442e-94f5-2679e226493c	rahimgholami1998@gmail.com	$2b$12$EbP8QcB1Dbd2mtaenq4DGOtOxI8RH.nzkFWtiBAbUEHpDOryQQXAK	ADMIN	2026-09-25 19:02:30.04	2026-10-09 16:59:26.464	t	\N	f	\N	\N
a01ae82f-2df3-462d-9e3d-c4b07e781343	Mobinmb13771994@gmail.com	$2b$12$UuzLT9ij0RXDjVpa/PMIxO6Nf80ixHiMhEzFvIjtU.OP7i.2uiU12	ADMIN	2026-09-25 17:48:40.959	2026-10-09 16:59:29.266	t	\N	f	\N	\N
07094648-082e-4cf4-bc9e-22a008d15a24	norouzzadeh.yaser@gmail.com	$2b$12$27a9uNsYc5R4Qhgx0bRLH.chixF.550NSrOeatHH1XOTBUN9YulFK	PARTICIPANT	2026-10-09 17:56:24.428	2026-10-09 17:56:45.743	t	\N	f	\N	\N
ac1ee269-acf6-4461-b75a-4a844e8f0643	wesirom861@meinvr.com	$2b$12$5EGXKnsezV/Tz7HwaPjVLu9xNIfhqTwmpHPhVAKIRBssOvDSeiE5e	PARTICIPANT	2026-10-09 18:00:28.702	2026-10-09 18:00:44.609	t	\N	f	\N	\N
61deccf7-d89b-48c9-bef7-1c164bf76a5b	Asiyehfarvardin@gmail.com	$2b$12$D59oC/ez/gpzGF8VtmdqSuNnNIzv3Z0IW0ZA7uMSxE7M/d7PsEewW	PARTICIPANT	2026-10-10 04:17:57.956	2026-10-10 04:17:57.956	f	\N	f	\N	\N
e4a74b08-de5b-47d0-90c3-d58f4bad33a0	Akeb.tertiary.iran@gmail.com	$2b$12$5ApFj0ZtK1zfo/c1EYi8fuJvTy0Yt/4ox6cBLCZDVZSRqFu5EMRPy	PARTICIPANT	2026-10-10 04:26:56.679	2026-10-10 04:27:26.302	t	\N	f	\N	\N
33347108-378b-4752-8aa1-2049715b6621	1x69jxs8sx@ooynib.com	$2b$12$/bXStjbG5FJHzX/p82M84uGLUQY23yQBpegtXo90ETYh1P9Y74rhK	PARTICIPANT	2026-10-10 18:17:38.442	2026-10-10 18:18:37.754	t	\N	f	\N	\N
ee52d100-cd63-4370-a7df-4b9efdc46e6b	\N	$2b$12$uMgFPLtD7FRZHtQLDTE9KOYw0PMSbiLYrhLkSZW9t8btVrC5HmewC	PARTICIPANT	2026-10-11 07:42:52.042	2026-10-11 07:42:52.042	f	09150036518	f	\N	\N
221f98d8-a8e2-488e-bd65-d5aac7dd12a7	\N	$2b$12$IKgh3niB.xdwYtNS4v/TbO5kiGR7vU9lY5Y1wwVVsrMumGrLdz0k.	PARTICIPANT	2026-10-11 08:13:57.663	2026-10-11 08:14:53.794	f	09123456789	t	\N	\N
19be1b9e-7d5b-4482-8a06-f4776a34708f	atefeh1995atefeh@gmail.com	$2b$12$agQPm0A/LcP6mt1ScfNvo.PeODmerEBNzZNvnVTlSVWtdlheqZXwK	PARTICIPANT	2026-10-13 06:14:17.184	2026-10-13 06:14:38.621	t	\N	f	\N	\N
\.


--
-- Data for Name: WeeklyChallenge; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WeeklyChallenge" (id, title, description, "instructorName", "instructorEmail", "opensAt", deadline, "isActive", "createdByUserId", "createdAt") FROM stdin;
04392c0c-2bc3-40e3-aad1-d5b80877a6a2	ماموریت 2	چرا باید حرفمو باور کنن؟\nچه شواهدی داری که بتونی با کمک اون ها خودت رو قابل باورتر معرفی کنی؟ سعی کن سه داستان واقعی از چالش های مرتبط که تونستی حل کنی رو تعریف کنی.			\N	\N	f	7c8e96ca-9eeb-442e-94f5-2679e226493c	2026-10-03 14:22:53.493
5f10076e-7be8-4d4e-a508-ace10cea9281	ماموریت 8	سه دقیقه روی صحنه\nچطور همه چیز در مورد برند شخصی خودم رو کنار هم بگذارم و بتونم ازشون دفاع کنم؟			\N	\N	f	7c8e96ca-9eeb-442e-94f5-2679e226493c	2026-10-03 14:29:21.169
26531466-0cf2-490b-9f1f-16f29fd1e784	ماموریت 7	بقیه تو رو چطور میبینن؟\nدیگران چطور منو میبینن و چطور از این استفاده کنم؟ یک نقشه ارتباطات بین تصور دیگران در حالت های مختلف از خودم بسازم. آیا فاصله ای بین تصویری که من از خودم دارم با تصور بقیه از من وجود داره؟			\N	\N	f	7c8e96ca-9eeb-442e-94f5-2679e226493c	2026-10-03 14:28:39.974
7e6c847f-d30b-46fd-a149-78087b36b37d	ماموریت 6	یه ظاهر ثابت برای خودت بساز!\nبرند من چه شکلیه؟ اصلا شکل خاصی براش ایجاد کردم؟ تا حالا برند خودم رو از دید بقیه افراد بررسی کردم؟ یک لوگو یا یک مهر اختصاصی برای برند خودم دارم؟			\N	\N	f	7c8e96ca-9eeb-442e-94f5-2679e226493c	2026-10-03 14:27:26.246
86ed222a-cde9-49f7-9ed0-86fd5f05756d	ماموریت 5	اسمتو سرچ کن!\nتا حالا تست کردی اگر اسمت رو سرچ کنی چه اطلاعاتی از تو نمایش داده میشه؟ اصلا اطلاعاتی ازت وجود داره که افراد تو رو بشناسن؟\nبهتره کجا دیده بشی و درباره چی حرف بزنی؟			\N	\N	f	7c8e96ca-9eeb-442e-94f5-2679e226493c	2026-10-03 14:26:22.164
d11a29de-63e4-4513-af1f-1accb0cc83b9	ماموریت 4	با هر کس یه جور حرف نزن.\nباید اول مخاطب رو بشناسی و از خودت سوال کنی که چطور پیامم رو درست به هر مخاطب برسونم؟\nیک جدول برای ارتباط با مخاطب های مختلف تشکیل بده و برای هر کدوم آمادگی داشته باش.			\N	\N	f	7c8e96ca-9eeb-442e-94f5-2679e226493c	2026-10-03 14:24:46.819
48cf8883-e24c-4d1c-a9b9-4143617ddc25	ماموریت 3	خودتو تو 30 ثانیه معرفی کن.\nچطور میتونی خودت رو در کمترین زمان ممکن به بهترین روش معرفی کنی؟ متن معرفی کوتاه خودت رو مرور کن و روی کاغذ بیار.			\N	\N	f	7c8e96ca-9eeb-442e-94f5-2679e226493c	2026-10-03 14:23:43.723
ec82a9d3-4b57-4e52-99b8-e13fe45ea171	مأموریت ۱: کشف دارایی متمایزکننده	«من که هستم و چه کاری را بهتر از همه انجام می‌دهم؟»\n\n«در چه کاری دیگران همیشه سراغ تو میان یا ازت کمک می‌خوان؟» (مثلاً عیب‌یابی ماشین، آرام‌کردن جمع، طراحی، کار با اکسل).«یک نمونه واقعی از کاری که انجام دادی و به خودت افتخار کردی چی بود؟» (حتی پروژه‌های دانشگاهی، کارهای داوطلبانه جماعتی یا یک حل اختلاف ساده).   «چه ارزشی در کار یا زندگیت خط قرمز توئه؟» (مثل خوش‌قولی، دقت وسواسی، شفافیت مالی، صداقت).			\N	1405-07-15 00:00:00	f	320ef40a-48b5-4a51-badb-18f84eb0057f	2026-09-25 15:49:44.703
6fd47bba-afbf-427d-bba5-2ced9c7895b4	ماموریت اول : رزومه بدون رزومه	یک رزومه برای خودت بنویس،\nاما هیچ‌کدام از اطلاعات معمول رزومه را استفاده نکن.\n\nاز مطالب زیر نباید استفاده کنی:\n\n❌ رشته\n❌ دانشگاه\n❌ معدل\n❌ سابقه کار\n،\nفقط از اینها استفاده کن:\n\n۳ چیزی که به آنها اهمیت می‌دهم\n\n۳ چیزی که در آن خوبم\n\n۲ چیزی که باید در خودم بهتر کنم\n\n۱ چیزی که به خاطرش ( یا دوست دارم به خاطرش شوم ) شناخته میشوم\n\nسوال نهایی:\n«آیا این رزومه، بیشتر تو را نشان می‌دهد یا رزومه واقعی‌ات؟»			\N	\N	t	a01ae82f-2df3-462d-9e3d-c4b07e781343	2026-10-10 14:21:08.258
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
bd5ad1c5-0bf9-46ab-a5a9-02efbd083195	9ff2e9d16bf2b6cb755ac6e3172ee89d9cf507cb09213a44fe70624148afd3a1	2026-09-25 12:39:07.751026+00	20260916082840_add_email_verification	\N	\N	2026-09-25 12:39:07.041386+00	1
\.


--
-- Name: ActivityLog ActivityLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_pkey" PRIMARY KEY (id);


--
-- Name: BootcampAccess BootcampAccess_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BootcampAccess"
    ADD CONSTRAINT "BootcampAccess_pkey" PRIMARY KEY (id);


--
-- Name: Bootcamp Bootcamp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bootcamp"
    ADD CONSTRAINT "Bootcamp_pkey" PRIMARY KEY (id);


--
-- Name: ChallengeSubmissionVersion ChallengeSubmissionVersion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChallengeSubmissionVersion"
    ADD CONSTRAINT "ChallengeSubmissionVersion_pkey" PRIMARY KEY (id);


--
-- Name: ChallengeSubmission ChallengeSubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChallengeSubmission"
    ADD CONSTRAINT "ChallengeSubmission_pkey" PRIMARY KEY (id);


--
-- Name: EmailVerificationCode EmailVerificationCode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmailVerificationCode"
    ADD CONSTRAINT "EmailVerificationCode_pkey" PRIMARY KEY (id);


--
-- Name: EvaluationCriterion EvaluationCriterion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EvaluationCriterion"
    ADD CONSTRAINT "EvaluationCriterion_pkey" PRIMARY KEY (id);


--
-- Name: EvaluationScore EvaluationScore_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EvaluationScore"
    ADD CONSTRAINT "EvaluationScore_pkey" PRIMARY KEY (id);


--
-- Name: Evaluation Evaluation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Evaluation"
    ADD CONSTRAINT "Evaluation_pkey" PRIMARY KEY (id);


--
-- Name: EvaluatorAssignment EvaluatorAssignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EvaluatorAssignment"
    ADD CONSTRAINT "EvaluatorAssignment_pkey" PRIMARY KEY (id);


--
-- Name: FeedbackRequest FeedbackRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeedbackRequest"
    ADD CONSTRAINT "FeedbackRequest_pkey" PRIMARY KEY (id);


--
-- Name: FeedbackResponse FeedbackResponse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeedbackResponse"
    ADD CONSTRAINT "FeedbackResponse_pkey" PRIMARY KEY (id);


--
-- Name: FormAnswerItem FormAnswerItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FormAnswerItem"
    ADD CONSTRAINT "FormAnswerItem_pkey" PRIMARY KEY (id);


--
-- Name: FormAnswer FormAnswer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FormAnswer"
    ADD CONSTRAINT "FormAnswer_pkey" PRIMARY KEY (id);


--
-- Name: FormQuestion FormQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FormQuestion"
    ADD CONSTRAINT "FormQuestion_pkey" PRIMARY KEY (id);


--
-- Name: Form Form_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Form"
    ADD CONSTRAINT "Form_pkey" PRIMARY KEY (id);


--
-- Name: JourneySection JourneySection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JourneySection"
    ADD CONSTRAINT "JourneySection_pkey" PRIMARY KEY (id);


--
-- Name: LandingSetting LandingSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LandingSetting"
    ADD CONSTRAINT "LandingSetting_pkey" PRIMARY KEY (key);


--
-- Name: LeaderboardEntry LeaderboardEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LeaderboardEntry"
    ADD CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY (id);


--
-- Name: Leaderboard Leaderboard_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Leaderboard"
    ADD CONSTRAINT "Leaderboard_pkey" PRIMARY KEY (id);


--
-- Name: LiveGroup LiveGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LiveGroup"
    ADD CONSTRAINT "LiveGroup_pkey" PRIMARY KEY (id);


--
-- Name: LiveMessage LiveMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LiveMessage"
    ADD CONSTRAINT "LiveMessage_pkey" PRIMARY KEY (id);


--
-- Name: LivePresence LivePresence_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LivePresence"
    ADD CONSTRAINT "LivePresence_pkey" PRIMARY KEY (id);


--
-- Name: LiveSession LiveSession_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LiveSession"
    ADD CONSTRAINT "LiveSession_pkey" PRIMARY KEY (id);


--
-- Name: Media Media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: ParticipantProfile ParticipantProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ParticipantProfile"
    ADD CONSTRAINT "ParticipantProfile_pkey" PRIMARY KEY (id);


--
-- Name: PersonalPage PersonalPage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonalPage"
    ADD CONSTRAINT "PersonalPage_pkey" PRIMARY KEY (id);


--
-- Name: PhoneVerificationCode PhoneVerificationCode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhoneVerificationCode"
    ADD CONSTRAINT "PhoneVerificationCode_pkey" PRIMARY KEY (id);


--
-- Name: PreAssessment PreAssessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PreAssessment"
    ADD CONSTRAINT "PreAssessment_pkey" PRIMARY KEY (id);


--
-- Name: Question Question_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY (id);


--
-- Name: RefreshToken RefreshToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY (id);


--
-- Name: Region Region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Region"
    ADD CONSTRAINT "Region_pkey" PRIMARY KEY (id);


--
-- Name: ResponseVersion ResponseVersion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ResponseVersion"
    ADD CONSTRAINT "ResponseVersion_pkey" PRIMARY KEY (id);


--
-- Name: Response Response_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Response"
    ADD CONSTRAINT "Response_pkey" PRIMARY KEY (id);


--
-- Name: Situation Situation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Situation"
    ADD CONSTRAINT "Situation_pkey" PRIMARY KEY (id);


--
-- Name: SkillEndorsement SkillEndorsement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillEndorsement"
    ADD CONSTRAINT "SkillEndorsement_pkey" PRIMARY KEY (id);


--
-- Name: Skill Skill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_pkey" PRIMARY KEY (id);


--
-- Name: TaskSubmission TaskSubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaskSubmission"
    ADD CONSTRAINT "TaskSubmission_pkey" PRIMARY KEY (id);


--
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (id);


--
-- Name: TraitWeight TraitWeight_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TraitWeight"
    ADD CONSTRAINT "TraitWeight_pkey" PRIMARY KEY (id);


--
-- Name: Trait Trait_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Trait"
    ADD CONSTRAINT "Trait_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: WeeklyChallenge WeeklyChallenge_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WeeklyChallenge"
    ADD CONSTRAINT "WeeklyChallenge_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: BootcampAccess_bootcampId_participantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BootcampAccess_bootcampId_participantId_key" ON public."BootcampAccess" USING btree ("bootcampId", "participantId");


--
-- Name: ChallengeSubmissionVersion_challengeSubmissionId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChallengeSubmissionVersion_challengeSubmissionId_createdAt_idx" ON public."ChallengeSubmissionVersion" USING btree ("challengeSubmissionId", "createdAt");


--
-- Name: ChallengeSubmissionVersion_challengeSubmissionId_versionNum_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ChallengeSubmissionVersion_challengeSubmissionId_versionNum_key" ON public."ChallengeSubmissionVersion" USING btree ("challengeSubmissionId", "versionNumber");


--
-- Name: ChallengeSubmission_challengeId_participantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ChallengeSubmission_challengeId_participantId_key" ON public."ChallengeSubmission" USING btree ("challengeId", "participantId");


--
-- Name: EmailVerificationCode_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EmailVerificationCode_userId_key" ON public."EmailVerificationCode" USING btree ("userId");


--
-- Name: EvaluationCriterion_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EvaluationCriterion_key_key" ON public."EvaluationCriterion" USING btree (key);


--
-- Name: EvaluationScore_evaluationId_criterionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EvaluationScore_evaluationId_criterionId_key" ON public."EvaluationScore" USING btree ("evaluationId", "criterionId");


--
-- Name: EvaluatorAssignment_evaluatorUserId_participantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EvaluatorAssignment_evaluatorUserId_participantId_key" ON public."EvaluatorAssignment" USING btree ("evaluatorUserId", "participantId");


--
-- Name: FeedbackRequest_linkToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FeedbackRequest_linkToken_key" ON public."FeedbackRequest" USING btree ("linkToken");


--
-- Name: FormQuestion_formId_order_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FormQuestion_formId_order_key" ON public."FormQuestion" USING btree ("formId", "order");


--
-- Name: Form_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Form_slug_key" ON public."Form" USING btree (slug);


--
-- Name: JourneySection_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "JourneySection_key_key" ON public."JourneySection" USING btree (key);


--
-- Name: LeaderboardEntry_leaderboardId_participantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LeaderboardEntry_leaderboardId_participantId_key" ON public."LeaderboardEntry" USING btree ("leaderboardId", "participantId");


--
-- Name: Leaderboard_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Leaderboard_key_key" ON public."Leaderboard" USING btree (key);


--
-- Name: LiveMessage_groupId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LiveMessage_groupId_idx" ON public."LiveMessage" USING btree ("groupId");


--
-- Name: LiveMessage_receiverId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LiveMessage_receiverId_idx" ON public."LiveMessage" USING btree ("receiverId");


--
-- Name: LivePresence_sessionId_participantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LivePresence_sessionId_participantId_key" ON public."LivePresence" USING btree ("sessionId", "participantId");


--
-- Name: ParticipantProfile_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ParticipantProfile_slug_key" ON public."ParticipantProfile" USING btree (slug);


--
-- Name: ParticipantProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ParticipantProfile_userId_key" ON public."ParticipantProfile" USING btree ("userId");


--
-- Name: PersonalPage_participantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PersonalPage_participantId_key" ON public."PersonalPage" USING btree ("participantId");


--
-- Name: PhoneVerificationCode_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PhoneVerificationCode_userId_key" ON public."PhoneVerificationCode" USING btree ("userId");


--
-- Name: PreAssessment_participantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PreAssessment_participantId_key" ON public."PreAssessment" USING btree ("participantId");


--
-- Name: Question_traitId_situationId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Question_traitId_situationId_key" ON public."Question" USING btree ("traitId", "situationId");


--
-- Name: ResponseVersion_responseId_versionNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ResponseVersion_responseId_versionNumber_key" ON public."ResponseVersion" USING btree ("responseId", "versionNumber");


--
-- Name: Situation_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Situation_key_key" ON public."Situation" USING btree (key);


--
-- Name: Skill_participantId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Skill_participantId_name_key" ON public."Skill" USING btree ("participantId", name);


--
-- Name: TraitWeight_traitId_situationId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TraitWeight_traitId_situationId_key" ON public."TraitWeight" USING btree ("traitId", "situationId");


--
-- Name: Trait_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Trait_name_key" ON public."Trait" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: ActivityLog ActivityLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BootcampAccess BootcampAccess_bootcampId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BootcampAccess"
    ADD CONSTRAINT "BootcampAccess_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES public."Bootcamp"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BootcampAccess BootcampAccess_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BootcampAccess"
    ADD CONSTRAINT "BootcampAccess_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Bootcamp Bootcamp_journeySectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bootcamp"
    ADD CONSTRAINT "Bootcamp_journeySectionId_fkey" FOREIGN KEY ("journeySectionId") REFERENCES public."JourneySection"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ChallengeSubmissionVersion ChallengeSubmissionVersion_challengeSubmissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChallengeSubmissionVersion"
    ADD CONSTRAINT "ChallengeSubmissionVersion_challengeSubmissionId_fkey" FOREIGN KEY ("challengeSubmissionId") REFERENCES public."ChallengeSubmission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChallengeSubmission ChallengeSubmission_challengeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChallengeSubmission"
    ADD CONSTRAINT "ChallengeSubmission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES public."WeeklyChallenge"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChallengeSubmission ChallengeSubmission_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChallengeSubmission"
    ADD CONSTRAINT "ChallengeSubmission_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EmailVerificationCode EmailVerificationCode_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmailVerificationCode"
    ADD CONSTRAINT "EmailVerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EvaluationScore EvaluationScore_criterionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EvaluationScore"
    ADD CONSTRAINT "EvaluationScore_criterionId_fkey" FOREIGN KEY ("criterionId") REFERENCES public."EvaluationCriterion"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EvaluationScore EvaluationScore_evaluationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EvaluationScore"
    ADD CONSTRAINT "EvaluationScore_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES public."Evaluation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Evaluation Evaluation_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Evaluation"
    ADD CONSTRAINT "Evaluation_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EvaluatorAssignment EvaluatorAssignment_evaluatorUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EvaluatorAssignment"
    ADD CONSTRAINT "EvaluatorAssignment_evaluatorUserId_fkey" FOREIGN KEY ("evaluatorUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EvaluatorAssignment EvaluatorAssignment_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EvaluatorAssignment"
    ADD CONSTRAINT "EvaluatorAssignment_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeedbackRequest FeedbackRequest_requesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeedbackRequest"
    ADD CONSTRAINT "FeedbackRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeedbackResponse FeedbackResponse_authorParticipantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeedbackResponse"
    ADD CONSTRAINT "FeedbackResponse_authorParticipantId_fkey" FOREIGN KEY ("authorParticipantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FeedbackResponse FeedbackResponse_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeedbackResponse"
    ADD CONSTRAINT "FeedbackResponse_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES public."FeedbackRequest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FormAnswerItem FormAnswerItem_answerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FormAnswerItem"
    ADD CONSTRAINT "FormAnswerItem_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES public."FormAnswer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FormAnswerItem FormAnswerItem_formQuestionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FormAnswerItem"
    ADD CONSTRAINT "FormAnswerItem_formQuestionId_fkey" FOREIGN KEY ("formQuestionId") REFERENCES public."FormQuestion"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FormAnswer FormAnswer_formId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FormAnswer"
    ADD CONSTRAINT "FormAnswer_formId_fkey" FOREIGN KEY ("formId") REFERENCES public."Form"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FormAnswer FormAnswer_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FormAnswer"
    ADD CONSTRAINT "FormAnswer_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FormQuestion FormQuestion_formId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FormQuestion"
    ADD CONSTRAINT "FormQuestion_formId_fkey" FOREIGN KEY ("formId") REFERENCES public."Form"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FormQuestion FormQuestion_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FormQuestion"
    ADD CONSTRAINT "FormQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Form Form_bootcampId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Form"
    ADD CONSTRAINT "Form_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES public."Bootcamp"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LeaderboardEntry LeaderboardEntry_leaderboardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LeaderboardEntry"
    ADD CONSTRAINT "LeaderboardEntry_leaderboardId_fkey" FOREIGN KEY ("leaderboardId") REFERENCES public."Leaderboard"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LeaderboardEntry LeaderboardEntry_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LeaderboardEntry"
    ADD CONSTRAINT "LeaderboardEntry_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LiveGroup LiveGroup_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LiveGroup"
    ADD CONSTRAINT "LiveGroup_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."LiveSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LiveMessage LiveMessage_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LiveMessage"
    ADD CONSTRAINT "LiveMessage_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."LiveGroup"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LiveMessage LiveMessage_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LiveMessage"
    ADD CONSTRAINT "LiveMessage_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LiveMessage LiveMessage_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LiveMessage"
    ADD CONSTRAINT "LiveMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LiveMessage LiveMessage_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LiveMessage"
    ADD CONSTRAINT "LiveMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."LiveSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LivePresence LivePresence_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LivePresence"
    ADD CONSTRAINT "LivePresence_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."LiveGroup"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LivePresence LivePresence_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LivePresence"
    ADD CONSTRAINT "LivePresence_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LivePresence LivePresence_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LivePresence"
    ADD CONSTRAINT "LivePresence_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."LiveSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LiveSession LiveSession_bootcampId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LiveSession"
    ADD CONSTRAINT "LiveSession_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES public."Bootcamp"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Media Media_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ParticipantProfile ParticipantProfile_regionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ParticipantProfile"
    ADD CONSTRAINT "ParticipantProfile_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES public."Region"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ParticipantProfile ParticipantProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ParticipantProfile"
    ADD CONSTRAINT "ParticipantProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PersonalPage PersonalPage_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonalPage"
    ADD CONSTRAINT "PersonalPage_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PhoneVerificationCode PhoneVerificationCode_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhoneVerificationCode"
    ADD CONSTRAINT "PhoneVerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PreAssessment PreAssessment_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PreAssessment"
    ADD CONSTRAINT "PreAssessment_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Question Question_bootcampId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES public."Bootcamp"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Question Question_journeySectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_journeySectionId_fkey" FOREIGN KEY ("journeySectionId") REFERENCES public."JourneySection"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Question Question_situationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_situationId_fkey" FOREIGN KEY ("situationId") REFERENCES public."Situation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Question Question_traitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES public."Trait"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RefreshToken RefreshToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ResponseVersion ResponseVersion_responseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ResponseVersion"
    ADD CONSTRAINT "ResponseVersion_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES public."Response"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Response Response_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Response"
    ADD CONSTRAINT "Response_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Response Response_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Response"
    ADD CONSTRAINT "Response_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SkillEndorsement SkillEndorsement_skillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillEndorsement"
    ADD CONSTRAINT "SkillEndorsement_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES public."Skill"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Skill Skill_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TaskSubmission TaskSubmission_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaskSubmission"
    ADD CONSTRAINT "TaskSubmission_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TaskSubmission TaskSubmission_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaskSubmission"
    ADD CONSTRAINT "TaskSubmission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public."Task"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Task Task_bootcampId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES public."Bootcamp"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TraitWeight TraitWeight_situationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TraitWeight"
    ADD CONSTRAINT "TraitWeight_situationId_fkey" FOREIGN KEY ("situationId") REFERENCES public."Situation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TraitWeight TraitWeight_traitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TraitWeight"
    ADD CONSTRAINT "TraitWeight_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES public."Trait"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Hz3cxyDBpkOWlfnr1chsw8xMcGbqUFy1rEXKvoDx9125IbSRsgy7dAIn3PMy5u1

