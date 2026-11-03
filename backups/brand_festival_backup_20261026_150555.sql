--
-- PostgreSQL database dump
--

\restrict Cq1APL12IStFBZPBIWnA59knHQlAEtvMvfav2h0xiP8Z7nWkKAQSFgygxtxak1f

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
-- Name: AnnouncementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AnnouncementType" AS ENUM (
    'INFO',
    'WARNING',
    'SUCCESS',
    'URGENT'
);


ALTER TYPE public."AnnouncementType" OWNER TO postgres;

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
-- Name: ArtifactMediaType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ArtifactMediaType" AS ENUM (
    'VIDEO',
    'AUDIO',
    'LINK',
    'DOCUMENT',
    'IMAGE'
);


ALTER TYPE public."ArtifactMediaType" OWNER TO postgres;

--
-- Name: ArtifactStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ArtifactStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."ArtifactStatus" OWNER TO postgres;

--
-- Name: BootcampRegistrationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BootcampRegistrationStatus" AS ENUM (
    'INITIAL',
    'PAID',
    'FINALIZED',
    'DONE'
);


ALTER TYPE public."BootcampRegistrationStatus" OWNER TO postgres;

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
-- Name: SenderRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SenderRole" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."SenderRole" OWNER TO postgres;

--
-- Name: SponsorPlacement; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SponsorPlacement" AS ENUM (
    'DASHBOARD',
    'LANDING_HERO',
    'LANDING_VERTICAL'
);


ALTER TYPE public."SponsorPlacement" OWNER TO postgres;

--
-- Name: SponsorSlideType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SponsorSlideType" AS ENUM (
    'IMAGE',
    'YOUTUBE'
);


ALTER TYPE public."SponsorSlideType" OWNER TO postgres;

--
-- Name: TicketStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TicketStatus" AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED'
);


ALTER TYPE public."TicketStatus" OWNER TO postgres;

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
-- Name: Announcement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Announcement" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    type public."AnnouncementType" DEFAULT 'INFO'::public."AnnouncementType" NOT NULL,
    "isGlobal" boolean DEFAULT true NOT NULL,
    "targetUserId" text,
    "isSent" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Announcement" OWNER TO postgres;

--
-- Name: Artifact; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Artifact" (
    id text NOT NULL,
    "participantId" text NOT NULL,
    axis text NOT NULL,
    "templateTitle" text NOT NULL,
    title text NOT NULL,
    description text,
    "mediaType" public."ArtifactMediaType" NOT NULL,
    "mediaUrl" text NOT NULL,
    "coverImageUrl" text,
    status public."ArtifactStatus" DEFAULT 'PENDING'::public."ArtifactStatus" NOT NULL,
    "adminNote" text,
    "averageRating" double precision DEFAULT 0 NOT NULL,
    "ratingsCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Artifact" OWNER TO postgres;

--
-- Name: ArtifactComment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ArtifactComment" (
    id text NOT NULL,
    "artifactId" text NOT NULL,
    "userId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "parentId" text,
    "likedUserIds" text[] DEFAULT ARRAY[]::text[] NOT NULL,
    "dislikedUserIds" text[] DEFAULT ARRAY[]::text[] NOT NULL
);


ALTER TABLE public."ArtifactComment" OWNER TO postgres;

--
-- Name: ArtifactRating; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ArtifactRating" (
    id text NOT NULL,
    "artifactId" text NOT NULL,
    "userId" text NOT NULL,
    score integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ArtifactRating" OWNER TO postgres;

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
    "recordingUrl" text,
    "paymentAccountHolderName" text,
    "paymentCardNumber" text
);


ALTER TABLE public."Bootcamp" OWNER TO postgres;

--
-- Name: BootcampAccess; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BootcampAccess" (
    id text NOT NULL,
    "bootcampId" text NOT NULL,
    "grantedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."BootcampAccess" OWNER TO postgres;

--
-- Name: BootcampRegistration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BootcampRegistration" (
    id text NOT NULL,
    "bootcampId" text NOT NULL,
    "fullName" text NOT NULL,
    mobile text NOT NULL,
    email text,
    "telegramId" text,
    "telegramPhone" text,
    notes text,
    status public."BootcampRegistrationStatus" DEFAULT 'INITIAL'::public."BootcampRegistrationStatus" NOT NULL,
    "trackingCode" text NOT NULL,
    "finalMessage" text,
    "cardLastDigits" text,
    "paidAt" timestamp(3) without time zone,
    "finalizedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BootcampRegistration" OWNER TO postgres;

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
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
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
-- Name: Sponsor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Sponsor" (
    id text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    tagline text,
    "slideType" public."SponsorSlideType" DEFAULT 'IMAGE'::public."SponsorSlideType" NOT NULL,
    "slideMediaUrl" text NOT NULL,
    placement public."SponsorPlacement" DEFAULT 'DASHBOARD'::public."SponsorPlacement" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "externalLinkLabel" text,
    "externalLinkUrl" text,
    "coverImageUrl" text,
    "fullDescription" text,
    "websiteUrl" text,
    "instagramUrl" text,
    "linkedinUrl" text,
    "telegramUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "clickCount" integer DEFAULT 0 NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Sponsor" OWNER TO postgres;

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
-- Name: Ticket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ticket" (
    id text NOT NULL,
    "userId" text NOT NULL,
    subject text NOT NULL,
    status public."TicketStatus" DEFAULT 'OPEN'::public."TicketStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Ticket" OWNER TO postgres;

--
-- Name: TicketMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TicketMessage" (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "senderId" text NOT NULL,
    "senderRole" public."SenderRole" DEFAULT 'USER'::public."SenderRole" NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TicketMessage" OWNER TO postgres;

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
    "passwordResetExpiresAt" timestamp(3) without time zone,
    "isBlocked" boolean DEFAULT false NOT NULL
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
-- Data for Name: Announcement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Announcement" (id, title, content, type, "isGlobal", "targetUserId", "isSent", "createdAt", "updatedAt") FROM stdin;
26a3c1e3-c1d7-47d5-b2db-6812b416c2bc	تکمیل پروفایل و صفحه عمومی	آمده‌اید که دیده شوید یا فقط فضایی اشغال کرده‌اید؟\nبیایید تعارف را کنار بگذاریم؛ داشتنِ یک حساب کاربریِ خالی در پلتفرم برند شخصی، هنر نیست. تا وقتی صفحه عمومی‌تان منتشر نشده و زیر ذره‌بینِ دیگران قرار نگرفته، فرقی با یک رزومه‌ی خاک‌خورده در کشوی میز ندارید.\nچرا همین امروز باید صفحه عمومی‌تان را منتشر کنید؟\nفرار از توهم تخصص: تا نظرات دیگران را نشنوید، نمی‌فهمید برند شخصی‌تان چقدر جذاب است و چقدر جای کار دارد.\nساختنِ اثرگذاری: برند شخصی بدون مخاطب و بازخورد، مثل حرف زدن با خودتان در آینه است.\nمعطل چه هستید؟ پروفایل‌تان را تکمیل کنید، دکمه‌ی انتشار را بزنید و اجازه دهید دیگران هم کار شما را ببینند.\nhttps://pbfestival.ir/dashboard/profile\nhttps://pbfestival.ir/dashboard/public-page	WARNING	t	\N	f	2026-10-20 11:33:02.45	2026-10-20 11:33:02.45
\.


--
-- Data for Name: Artifact; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Artifact" (id, "participantId", axis, "templateTitle", title, description, "mediaType", "mediaUrl", "coverImageUrl", status, "adminNote", "averageRating", "ratingsCount", "createdAt", "updatedAt") FROM stdin;
4243f00f-8981-4c9e-adc9-671e319cc0e3	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	تخصص من	kh	bnvbhv	dzfzfcsdfsf	LINK	https://pbfestival.ir/dashboard/artifacts	https://pbfestival.ir/dashboard/artifacts	REJECTED	\N	5	1	2026-10-21 17:26:27.672	2026-10-21 17:33:53.22
5563e2ab-9d51-4154-994a-7ac20789bf8c	2fc896b6-69a3-4efc-9f56-760cfca830a9	تخصص من	پایان‌نامه در ۹۰ ثانیه	ارائه مدل برند شخصی در عصر هوش مصنوعی	این یک اثر تستی برای بررسی ویترین و پخش‌کننده یوتیوب است.	VIDEO	https://www.youtube.com/watch?v=dQw4w9WgXcQ	\N	REJECTED	\N	3	2	2026-10-16 08:46:42.651	2026-10-21 17:33:55.018
15f1252f-3936-4ad8-9f9e-75fcb8f5ea4c	d3fa51ef-b17a-49f0-8b6e-da5943681ced	حرفه من	برند سازی شخصی	برند شخصی	\N	VIDEO	https://www.youtube.com/watch?v=BnOBTWANu7I&pp=ygUR2KjYsdmG2K8g2LTYrti124w%3D	\N	REJECTED	\N	2	1	2026-10-16 07:47:22.671	2026-10-21 17:33:56.257
\.


--
-- Data for Name: ArtifactComment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ArtifactComment" (id, "artifactId", "userId", content, "createdAt", "parentId", "likedUserIds", "dislikedUserIds") FROM stdin;
cf520fd5-4d1d-4d87-bc83-556591b3bf5c	5563e2ab-9d51-4154-994a-7ac20789bf8c	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	بسیار عالی	2026-10-17 20:23:40.354	\N	{}	{}
538ed110-5d4c-4a07-9329-0ae7e6d95199	15f1252f-3936-4ad8-9f9e-75fcb8f5ea4c	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	عالی	2026-10-18 07:42:45.194	\N	{e7573aa6-efb7-4d09-8690-92ea0bd5786f}	{}
3597f510-51a9-49e7-b3a2-6c7c8df27bf3	15f1252f-3936-4ad8-9f9e-75fcb8f5ea4c	e7573aa6-efb7-4d09-8690-92ea0bd5786f	عالی	2026-10-17 20:25:29.549	\N	{e7573aa6-efb7-4d09-8690-92ea0bd5786f}	{}
09f29aa1-f78f-4873-96c3-52d9b94dc5c4	5563e2ab-9d51-4154-994a-7ac20789bf8c	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	عالی	2026-10-18 07:52:11.213	\N	{}	{b5ebe5c2-35ac-4943-81dd-f4253d3d56c7}
861b1f09-6e55-4883-8d5a-8cf80b38cd73	4243f00f-8981-4c9e-adc9-671e319cc0e3	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	sadasdasd	2026-10-21 17:33:06.677	\N	{}	{}
\.


--
-- Data for Name: ArtifactRating; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ArtifactRating" (id, "artifactId", "userId", score, "createdAt", "updatedAt") FROM stdin;
00ebe5a5-3846-45f4-8e08-b7c6b23d6b67	15f1252f-3936-4ad8-9f9e-75fcb8f5ea4c	e7573aa6-efb7-4d09-8690-92ea0bd5786f	2	2026-10-17 20:25:12.903	2026-10-19 07:54:41.778
9c571b6f-a2d4-4bbb-a658-95a0f49a9b39	5563e2ab-9d51-4154-994a-7ac20789bf8c	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	4	2026-10-17 20:23:29.407	2026-10-19 07:55:40.672
f913bb36-f0a0-4ed1-ba32-aec689cb4bfa	5563e2ab-9d51-4154-994a-7ac20789bf8c	e7573aa6-efb7-4d09-8690-92ea0bd5786f	2	2026-10-17 20:24:31.183	2026-10-19 07:55:57.255
8fbb1156-1d8e-4524-bb24-29ec4a1bab14	4243f00f-8981-4c9e-adc9-671e319cc0e3	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	5	2026-10-21 17:31:26.271	2026-10-21 17:31:26.271
\.


--
-- Data for Name: Bootcamp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Bootcamp" (id, title, description, instructor, "coverImageUrl", date, "startTime", "endTime", status, deadline, "journeySectionId", "teaserVideoUrl", "recordingUrl", "paymentAccountHolderName", "paymentCardNumber") FROM stdin;
d317a886-786d-4077-b4dc-9243507c2275	آکادمی هوش یار؛ جلسه دوم؛ با مدرک حرف بزن؛ از ادعا تا روایت	چرا باید مرا باور کنند؟ و داستان من چیست؟\nاگر همین حالا کسی بخواهد حرف شما را راستی‌آزمایی کند، چقدر مدرک آمادهٔ ارائه دارید؟	آقای سعید میرشاهی	https://pbfestival.ir/uploads/dab378b4-a12e-450c-8d28-19fb740556c6.jpg	2026-10-11 19:00:00	2026-10-11 19:00:00	2026-10-11 20:30:00	COMPLETED	\N	416299f6-e1d1-4205-8070-75a5c8101f81	https://pbfestival.ir/uploads/6d94894c-6e32-4f93-985e-55cfa50a8c44.mp4	https://drive.google.com/file/d/1v9g7YFW1TMi9aA0UUZb1nfQiAH542cVn/view?usp=sharing	\N	\N
8043d09c-26e3-44a1-a1aa-74a995c6da83	آکادمی هوش یار : جلسه سوم : 30 ثانیه برای به یادماندن	<p style="text-align: right;">چطور خودم معرفی کنم ؟!<br>اگر فقط ۳۰ ثانیه فرصت داشتی، تا خودت را به یک کارفرما، سرمایه‌گذار، استاد یا یک فرد مهم معرفی کنی، اولین جمله‌ات چه بود؟</p>	آقای فرزاد زرین کوب	https://pbfestival.ir/uploads/95362c5d-349a-4423-a76f-fc328a9673b5.jpg	2026-10-18 18:00:00	2026-10-18 18:00:00	2026-10-18 07:12:00	COMPLETED	\N	\N	\N	https://drive.google.com/file/d/18xrtCtFLdF3MTL1XHqBrIIeMPDTZ-fd5/view?usp=sharing	\N	\N
68b6b388-db7b-44d1-91c6-4e17b250d509	آکادمی هوش یار؛ جلسه چهارم؛ با هر کسی یه جور حرف نزن.			https://pbfestival.ir/uploads/8b8f99b3-3288-413a-9a64-5fb0b72f0568.jpg	2026-10-24 11:10:00	2026-10-24 11:10:00	2026-10-24 11:10:00	COMING_SOON	\N	\N	\N	\N	\N	\N
69e63049-9731-4aca-a613-4a7a9c2becb3	آکادمی هوش یار؛ جلسه پنجم؛ اسمتو سرچ کن			https://pbfestival.ir/uploads/1ee69318-41b6-48e3-9696-c92421fb2dbf.jpg	2026-10-25 08:55:00	2026-10-25 08:55:00	2026-10-25 08:55:00	COMING_SOON	\N	\N	\N	\N	\N	\N
0c753d22-b105-458e-b5eb-0e97105dad14	آکادمی هوش یار؛ جلسه اول؛ پرونده من	من کی هستم؟ چه چیزی مرا متفاوت می کند؟ چرا باید مرا باور کنند؟ داستان من چیست؟	آقای آرمین اروجی	https://pbfestival.ir/uploads/6ad044db-11da-4480-9925-f8c641a90d38.jpg	2026-10-03 14:19:00	2026-10-03 14:19:00	2026-10-03 14:19:00	COMPLETED	\N	\N	https://pbfestival.ir/uploads/1d402451-dfec-4e9a-aa9f-fa409a8e6a12.mp4	https://drive.google.com/file/d/1FwIUEDcE2P9G9h4xKvxSxrCDEl3INOhM/view?usp=drivesdk	\N	\N
\.


--
-- Data for Name: BootcampAccess; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BootcampAccess" (id, "bootcampId", "grantedAt", "userId") FROM stdin;
5db2670c-b1e2-4685-983f-d9633115da62	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-05 12:13:08.845	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7
3188a23c-8221-467d-ad2f-2646520ed249	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-06 08:37:57.789	320ef40a-48b5-4a51-badb-18f84eb0057f
1cb6ccc4-cbf3-4768-b79a-7f3969eadffa	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-06 08:37:58.725	a01ae82f-2df3-462d-9e3d-c4b07e781343
4dbf89d1-5d86-464a-917d-999940bb23a9	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-06 08:37:59.467	7c8e96ca-9eeb-442e-94f5-2679e226493c
aca6b9c5-9fc4-42b4-a053-83a3d12ea1f5	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-09 17:55:57.194	2cd4df68-138c-4d6d-9f52-3eda8f3eca49
001605d0-3516-41a2-a434-cb78559684b6	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-10 18:14:14.244	e4a74b08-de5b-47d0-90c3-d58f4bad33a0
88903d12-b869-4fd7-bb4b-3781d4771a4a	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-10 18:14:22.332	369bfe81-8808-4dcc-b95a-3b3e853093bc
dcaddbcb-5e3c-49e9-8b9c-f5aa510bab98	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-10 18:14:23.517	ee49f63f-9e8d-406d-a4ef-a0a471a51861
bd24476b-b55c-4099-b01a-7daae9a279c1	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-13 17:52:54.87	fd7ef889-bafb-4a6b-8bcf-e0527425a4b2
e29bae37-2246-4ada-80b5-d74fc4204525	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-13 17:53:01.182	b06f3ac5-8e14-4d0d-8a46-158d2a197b59
35bf1bd4-a5cf-479e-b908-06bd2d680062	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-17 11:04:26.069	888c5b03-edf2-484d-aeee-f256da1d4669
5d4ae293-a3f3-4f49-8736-ff121575eac9	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 05:09:50.098	e7573aa6-efb7-4d09-8690-92ea0bd5786f
75460f43-9ec3-4980-bc3d-e335417bda37	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 05:09:58.12	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d
5babdbb5-a6b9-419b-b440-0d5ed217d0de	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-19 05:10:30.132	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d
6b73cb36-3761-4cc4-87c3-b75cd49bc2e8	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-19 05:11:10.241	e7573aa6-efb7-4d09-8690-92ea0bd5786f
5e12c413-04de-48d9-98e5-5a287857cba3	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 05:11:39.565	e7573aa6-efb7-4d09-8690-92ea0bd5786f
d252dde1-49cd-4080-beb2-3791360fffcb	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 10:11:39.598	c66be053-b333-4f81-bb36-8692bcf45240
455b9d5e-5cf5-4eee-984a-45090c526ae7	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-19 16:07:10.378	c66be053-b333-4f81-bb36-8692bcf45240
f52ae9d3-c2ba-4b6f-b23b-b3318c28ecd8	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-19 16:07:10.757	6348c3b9-944e-42ed-8c51-9ccc0b864bc5
623fa9d3-fd63-4c45-9a0a-c9289cddb764	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-19 16:07:10.85	74a58f55-f672-402f-accb-1fb932fbf2f7
7fd366d5-4bcf-486b-8cc2-6f4cca0aac55	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-19 16:07:10.894	d0d2e079-7ef8-4569-9dc8-22c16b8048ee
4c88fa4e-43d4-46ef-a890-85228a061f4c	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-19 16:07:10.946	085b6fc8-92c2-480b-b62f-d5b30db8b986
a67c70bd-b1a9-4f27-a8c7-498f73768e11	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-19 16:07:11.091	19be1b9e-7d5b-4482-8a06-f4776a34708f
a972850d-488d-4148-9089-5bad5d456315	0c753d22-b105-458e-b5eb-0e97105dad14	2026-10-19 16:07:11.146	61deccf7-d89b-48c9-bef7-1c164bf76a5b
74e7d733-8a58-4c8e-a041-1ada196090b7	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:20.146	c66be053-b333-4f81-bb36-8692bcf45240
db024984-913d-46c8-9bd7-1d0cb64ddf4f	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:20.389	6348c3b9-944e-42ed-8c51-9ccc0b864bc5
3d2bd05a-732c-45a5-bdcc-be97bb9c300e	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:20.45	74a58f55-f672-402f-accb-1fb932fbf2f7
e36bdcb4-ccf9-41b7-a989-d493ee24392d	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:20.502	d0d2e079-7ef8-4569-9dc8-22c16b8048ee
6acc4ee7-fb76-43fc-b4a8-eb3c06ec5f67	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:20.563	085b6fc8-92c2-480b-b62f-d5b30db8b986
813600b9-7717-4dd8-b4ee-3c75e990457f	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:20.616	888c5b03-edf2-484d-aeee-f256da1d4669
2151c544-1c0d-4bcf-9bad-8a7f627cfeb0	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:20.669	b06f3ac5-8e14-4d0d-8a46-158d2a197b59
86b66052-f1aa-4daf-9e7f-484126fa3684	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:20.73	19be1b9e-7d5b-4482-8a06-f4776a34708f
a819c7c2-a71b-4334-83dd-e3792311a162	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:20.78	fd7ef889-bafb-4a6b-8bcf-e0527425a4b2
8ddb41e5-6a55-4beb-aff8-1defb69d85d6	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:20.83	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d
c3036d85-5026-4400-85e3-f3ce4102c8a4	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:20.887	e4a74b08-de5b-47d0-90c3-d58f4bad33a0
e875bb92-e185-4082-bb31-1a2e0494f41c	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:20.943	61deccf7-d89b-48c9-bef7-1c164bf76a5b
bd43fb61-636b-4416-84a1-0d5e208a3604	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:20.995	ee49f63f-9e8d-406d-a4ef-a0a471a51861
35b97474-a491-4b68-af23-25d07fd5e769	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:21.043	2cd4df68-138c-4d6d-9f52-3eda8f3eca49
804925f5-0aef-44eb-bda3-20e55a7de1b4	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:21.111	7c8e96ca-9eeb-442e-94f5-2679e226493c
b59d5045-1644-46c2-9954-3867c8522822	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:21.165	a01ae82f-2df3-462d-9e3d-c4b07e781343
28000c40-1965-4991-810c-55dd3bd9ea0f	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:21.211	320ef40a-48b5-4a51-badb-18f84eb0057f
a70d44db-1be1-4a74-b5f8-9edb94de2b8f	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:21.278	369bfe81-8808-4dcc-b95a-3b3e853093bc
6a2db5c9-756f-4d3a-b387-0c4b4155ee97	d317a886-786d-4077-b4dc-9243507c2275	2026-10-19 16:07:21.335	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7
45fa0c23-c12a-49ff-995e-6843a9838db1	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:28.19	6348c3b9-944e-42ed-8c51-9ccc0b864bc5
266a1554-5fc1-4d50-af65-5e078a07a797	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:28.252	74a58f55-f672-402f-accb-1fb932fbf2f7
adf54140-70f0-45b9-a27b-61911a98ff10	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:28.336	d0d2e079-7ef8-4569-9dc8-22c16b8048ee
f011eb42-053f-478e-a324-47ad546c1ff4	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:28.396	085b6fc8-92c2-480b-b62f-d5b30db8b986
c381a089-11eb-4a17-ba1d-487e29a4158a	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:28.451	888c5b03-edf2-484d-aeee-f256da1d4669
b6861dbb-0755-4c80-ba87-dabb849588e8	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:28.524	b06f3ac5-8e14-4d0d-8a46-158d2a197b59
be5348f3-59f9-432c-9a98-fb8f16fd9957	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:28.574	19be1b9e-7d5b-4482-8a06-f4776a34708f
901fde3a-caa0-4df1-b2bf-8871cfee2732	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:28.632	fd7ef889-bafb-4a6b-8bcf-e0527425a4b2
006ce389-3197-47e3-9c87-ba625f78d892	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:28.693	e4a74b08-de5b-47d0-90c3-d58f4bad33a0
dbaf34d8-66f8-45f8-acca-76e133b10f93	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:28.755	61deccf7-d89b-48c9-bef7-1c164bf76a5b
12930d6a-e17c-48f5-aec2-79ac91ebadce	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:28.821	ee49f63f-9e8d-406d-a4ef-a0a471a51861
e6e3f24f-982c-4438-90e2-8624b33285dd	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:28.91	2cd4df68-138c-4d6d-9f52-3eda8f3eca49
9865642a-a1b0-4da7-b5ee-8cf5181cd8f4	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:28.969	7c8e96ca-9eeb-442e-94f5-2679e226493c
9cf3aa9e-653b-4320-88fc-cde5290d255f	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:29.032	a01ae82f-2df3-462d-9e3d-c4b07e781343
847f5705-93ba-4f62-a385-7acbdf36f28f	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:29.11	320ef40a-48b5-4a51-badb-18f84eb0057f
5c6b6cd3-1dd9-40e3-9794-72bf1130e1d1	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:29.19	369bfe81-8808-4dcc-b95a-3b3e853093bc
1f962104-1498-4be3-95e5-2984c184b5e2	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-19 16:07:29.244	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7
79db1483-a8f8-4358-b5a8-bfe59ee56783	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-23 15:26:51.887	97328cf8-3568-4495-a8c8-fb31d97ff017
d2cce0f1-5bc7-43b6-886f-22e5adaa6079	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-23 15:26:53.168	ac37c689-62d4-48c2-9414-db44ab5c575e
3aaefb59-c61e-4538-b2ba-9ed2815922a5	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-23 15:26:54.266	5ef7cef4-a0ea-4dc0-a7ac-2a025323baaf
a62be223-8e05-4805-8d9e-5ae531a95081	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-23 15:26:55.35	ae0abc8d-8a57-4c80-8fd8-967f4badce6d
c9e9ece6-1278-4526-857d-70fedc8f4a03	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-23 15:26:58.227	f69430dc-a828-47f1-8eb6-d7a1c7a49624
f1684645-ad83-4a22-ac13-de91b45866d3	8043d09c-26e3-44a1-a1aa-74a995c6da83	2026-10-23 15:26:59.047	62f57c70-9140-43d9-8cf4-52111f8fd3ef
\.


--
-- Data for Name: BootcampRegistration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BootcampRegistration" (id, "bootcampId", "fullName", mobile, email, "telegramId", "telegramPhone", notes, status, "trackingCode", "finalMessage", "cardLastDigits", "paidAt", "finalizedAt", "createdAt", "updatedAt") FROM stdin;
3a56a5c0-5115-4997-9561-ca91840fd6ac	8043d09c-26e3-44a1-a1aa-74a995c6da83	تست نورالدین	09120000000	\N	\N	\N	\N	INITIAL	cmvj7r5yc0005o8crm07wtqx8	\N	\N	\N	\N	2026-10-22 07:22:24.589	2026-10-22 07:22:24.589
98a119eb-72f6-4693-9f31-c9c4f79e2de4	8043d09c-26e3-44a1-a1aa-74a995c6da83	نورالدین هویدا	09150036518	\N	\N	\N	[لینک رسید پرداخت: https://pbfestival.ir/uploads/79816e35-6ca5-4b53-8717-0cd6975f6fba.png]	INITIAL	cmvkn891q0001ttc340piq5oi	\N	۱۲۳۴	\N	\N	2026-10-23 07:23:22.115	2026-10-23 07:23:22.115
0422ead0-3103-4fb6-8308-abb0355f7535	8043d09c-26e3-44a1-a1aa-74a995c6da83	نورالدین هویدا	09150036518	\N	\N	\N	\N	INITIAL	cmvkne2zw0003ttc34x4o01dw	\N	\N	\N	\N	2026-10-23 07:27:54.284	2026-10-23 07:27:54.284
8d6a0b75-71bb-4a8d-b055-b3567beee45e	8043d09c-26e3-44a1-a1aa-74a995c6da83	نورالدین هویدا	09150036518	\N	\N	\N	\N	INITIAL	cmvkofjtq0005ttc32seeaiyb	\N	\N	\N	\N	2026-10-23 07:57:02.366	2026-10-23 07:57:02.366
1dcac5c8-8890-47ce-a908-f4eb8adc1b68	d317a886-786d-4077-b4dc-9243507c2275	nooreddin hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvm9q01l0002flgo3610l5vr	\N	\N	\N	\N	2026-10-24 10:40:48.057	2026-10-24 10:40:48.057
a608252c-0129-456a-8396-f3331117a9bf	8043d09c-26e3-44a1-a1aa-74a995c6da83	nooreddin hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvm9q04i0004flgo9shc81hw	\N	\N	\N	\N	2026-10-24 10:40:48.162	2026-10-24 10:40:48.162
289cd931-aae7-44ab-a9cb-ec414a329ae5	d317a886-786d-4077-b4dc-9243507c2275	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvmad64t0007flgo2w8o39i2	\N	\N	\N	\N	2026-10-24 10:58:49.034	2026-10-24 10:58:49.034
43022fb9-fecc-4be4-b93f-5d871c45268b	8043d09c-26e3-44a1-a1aa-74a995c6da83	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvmad66q0009flgo4n2zfvw2	\N	\N	\N	\N	2026-10-24 10:58:49.106	2026-10-24 10:58:49.106
d1e7d310-f8d6-4fe4-9848-6f40449f3239	8043d09c-26e3-44a1-a1aa-74a995c6da83	نور هویدا	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvmatxbz000eflgorv4i316i	\N	\N	\N	\N	2026-10-24 11:11:50.783	2026-10-24 11:11:50.783
e239ad4f-a356-4454-ad5c-553934682178	8043d09c-26e3-44a1-a1aa-74a995c6da83	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvmbouhu0004pk5yiou9miuc	\N	\N	\N	\N	2026-10-24 11:35:53.442	2026-10-24 11:35:53.442
4832c0e6-d528-4789-bd9c-e2ca2975ab8e	d317a886-786d-4077-b4dc-9243507c2275	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvmboujo0006pk5yt0tu882u	\N	\N	\N	\N	2026-10-24 11:35:53.508	2026-10-24 11:35:53.508
68184172-7a2d-4d3e-831d-0306867eda1d	0c753d22-b105-458e-b5eb-0e97105dad14	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvmboulg0008pk5y64x3zzf6	\N	\N	\N	\N	2026-10-24 11:35:53.572	2026-10-24 11:35:53.572
2a7f59f9-8fed-45e5-9c13-1b330354d441	8043d09c-26e3-44a1-a1aa-74a995c6da83	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvmdq2rx000bpk5y81ezofi1	\N	\N	\N	\N	2026-10-24 12:32:50.062	2026-10-24 12:32:50.062
4adf2952-523e-4fc7-8cee-8e3c3075f607	d317a886-786d-4077-b4dc-9243507c2275	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvmju6mx000ipk5yukgfmxup	\N	\N	\N	\N	2026-10-24 15:23:59.385	2026-10-24 15:23:59.385
ffec11e1-5073-4cbc-9725-b9d3839ff0bf	8043d09c-26e3-44a1-a1aa-74a995c6da83	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvmju6or000kpk5ym1z8856a	\N	\N	\N	\N	2026-10-24 15:23:59.452	2026-10-24 15:23:59.452
e488a81a-7ff2-4ff2-b446-278c296c808e	d317a886-786d-4077-b4dc-9243507c2275	noor hoveida3	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvmkpxnw0003yu04qmagbrnr	\N	\N	\N	\N	2026-10-24 15:48:40.748	2026-10-24 15:48:40.748
45f6deac-0e51-4ddf-ad73-caa359c9d1bd	8043d09c-26e3-44a1-a1aa-74a995c6da83	noor hoveida3	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvmkpxq40005yu04fl8ln789	\N	\N	\N	\N	2026-10-24 15:48:40.828	2026-10-24 15:48:40.828
47d080b0-303b-4102-8420-5c8e093d2013	8043d09c-26e3-44a1-a1aa-74a995c6da83	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvnf8a6h000ayu04e9zosbvl	\N	\N	\N	\N	2026-10-25 06:02:45.257	2026-10-25 06:02:45.257
18ef0dd5-4094-4b94-8fa1-da7365beac66	d317a886-786d-4077-b4dc-9243507c2275	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvnf8a8o000cyu047jj2d2u1	\N	\N	\N	\N	2026-10-25 06:02:45.336	2026-10-25 06:02:45.336
e6ff93da-758a-4b07-84b3-bd2fbc855798	8043d09c-26e3-44a1-a1aa-74a995c6da83	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	درخواست دسترسی فیلم و محتوا (هزینه کمتر)	INITIAL	cmvnljsax0004sbmp9i3m3zya	\N	\N	\N	\N	2026-10-25 08:59:39.658	2026-10-25 08:59:39.658
2f3fb8c3-ed80-41d2-978e-be726187999e	68b6b388-db7b-44d1-91c6-4e17b250d509	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	\N	DONE	cmvnljrn90002sbmpig1ywglh	\N	\N	\N	2026-10-25 20:10:06.004	2026-10-25 08:59:38.806	2026-10-25 20:10:09.522
8989dee3-4710-4694-881a-c783e4055c4b	68b6b388-db7b-44d1-91c6-4e17b250d509	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	\N	DONE	cmvnh14ju000hyu0400n9jtq1	\N	۹۸۹۸	2026-10-25 20:05:35.746	\N	2026-10-25 06:53:10.602	2026-10-25 20:10:11.408
c33c68bf-fd77-4550-9d86-f80fc0c5034d	68b6b388-db7b-44d1-91c6-4e17b250d509	noor hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	\N	DONE	cmvnf8abf000eyu04u1dc4dn9	\N	۹۶۳۲	2026-10-25 20:05:06.047	\N	2026-10-25 06:02:45.435	2026-10-25 20:10:13.612
1c1ff8d5-67b3-4db7-91ac-7a3db8bbf29e	68b6b388-db7b-44d1-91c6-4e17b250d509	نور هویدا	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	\N	PAID	cmvmboufx0002pk5yo86grddo	\N	5454	2026-10-26 11:45:44.537	2026-10-25 19:11:30.065	2026-10-24 11:35:53.374	2026-10-26 11:45:44.544
7b93b4fd-db4b-4a34-9abc-c576965f83d2	68b6b388-db7b-44d1-91c6-4e17b250d509	نور هویدا	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	\N	PAID	cmvmdq2u6000dpk5yo3rsnoeg	\N	4567	2026-10-26 11:45:57.907	\N	2026-10-24 12:32:50.142	2026-10-26 11:45:57.908
e52019c3-5401-4887-8e9b-70ac1f42911d	68b6b388-db7b-44d1-91c6-4e17b250d509	نور هویدا	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	\N	PAID	cmvmju6r1000mpk5yj29th6n2	\N	4569	2026-10-26 11:46:51.382	\N	2026-10-24 15:23:59.533	2026-10-26 11:46:51.383
14e725bd-608d-4804-a668-d8401cd12c53	68b6b388-db7b-44d1-91c6-4e17b250d509	نور هویدا	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	\N	PAID	cmvmkpxtr0007yu0406ebgxao	\N	5555	2026-10-26 11:47:10.436	2026-10-25 20:05:52.497	2026-10-24 15:48:40.959	2026-10-26 11:47:10.439
c5c72b03-e888-40e1-b0ae-69f58246e504	68b6b388-db7b-44d1-91c6-4e17b250d509	noor۳۳۳۳ hoveida	09150036518	nuoroddin.hoveida@gmail.com	09150036518	\N	\N	PAID	cmvmatx83000cflgodo9cx4db	\N	\N	2026-10-25 19:11:24.238	\N	2026-10-24 11:11:50.643	2026-10-25 19:11:24.24
e089bd8e-d872-4c4e-8ea5-4e5aa7cb9af8	68b6b388-db7b-44d1-91c6-4e17b250d509	noor hoveida	09150036518	\N	\N	\N	\N	DONE	cmvnoqs9i0001z8fp6st8q0n8	\N	۶۶۶۶	\N	\N	2026-10-25 10:29:05.045	2026-10-25 20:10:02.56
da247c27-a035-4e79-ab11-bd2040c7df2a	68b6b388-db7b-44d1-91c6-4e17b250d509	امیرحسین  حمزه	09015029107	hmamirhossein34@gmail.com	\N	\N	\N	INITIAL	cmvotgdi100046lrs6qjgk6cj	\N	\N	\N	\N	2026-10-26 05:28:43.606	2026-10-26 05:28:43.606
e927829d-d2c9-46a7-95c3-0d989a7be099	68b6b388-db7b-44d1-91c6-4e17b250d509	نور هویدا	09150036518	nuoroddin.hoveida@gmail.com	\N	\N	[لینک رسید پرداخت: https://pbfestival.ir/uploads/89501e60-32e6-48af-972d-7cf673bab74f.png]	PAID	cmvnlpjim0006sbmpej4f7tnl	\N	5645	2026-10-26 11:47:27.891	\N	2026-10-25 09:04:08.203	2026-10-26 11:47:27.892
\.


--
-- Data for Name: ChallengeSubmission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChallengeSubmission" (id, "challengeId", "participantId", "textContent", "photoUrl", "documentUrl", "linkUrl", "submittedAt", "updatedAt", "sentToInstructorAt") FROM stdin;
7a51198c-8784-4885-a24f-0e50631812cb	ec82a9d3-4b57-4e52-99b8-e13fe45ea171	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	یک نمونه ی اولیه از پاسخ که بروزرسانی شده	\N	\N	www.nadaram.com	2026-10-09 17:14:37.421	2026-10-09 17:17:56.947	\N
6c16fb41-4dbb-4c9f-83ea-cdc6269804d3	ec82a9d3-4b57-4e52-99b8-e13fe45ea171	54832d93-ca2a-4d09-8ec4-39d6b00adb46	من مبین هستم، کار با اکسل انجام میدم.\nبرنامه نویسی و شروع کردم	https://pbfestival.ir/uploads/82014f95-578b-4435-8bbd-32a37d467404.jpg	\N	-	2026-10-09 17:14:50.186	2026-10-09 17:15:47.908	\N
533c744d-10c4-4b36-95cc-67bc4dace10a	ec82a9d3-4b57-4e52-99b8-e13fe45ea171	d3fa51ef-b17a-49f0-8b6e-da5943681ced	۳۴	\N	\N	\N	2026-10-09 17:12:45.391	2026-10-10 06:10:20.18	\N
862bbf81-f39a-4c3e-9bb8-3e6a7b0fc2f3	6fd47bba-afbf-427d-bba5-2ced9c7895b4	d3fa51ef-b17a-49f0-8b6e-da5943681ced	۳ چیزی که واقعاً به آن‌ها اهمیت می‌دهم:\nاصالت و خروجیِ عریان؛ نه شوآف: حالم از پُزهای توخالی، لفاظی‌های لینکدینی و نقاب‌های قشنگ به‌هم می‌خورد. برای من تنها چیزی که اصالت دارد این است که «در عمل چه چیزی ساخته‌ای و چقدر کار می‌کند؟» حقیقتِ تلخ را به هر دروغ تسلی‌بخش و شیک ترجیح می‌دهم.\nاستقلال در تصمیم و عاملیت: این‌که فرمان دست خودم باشد. تحمل این را ندارم که بازیچهٔ بوروکراسی، قواعد احمقانه یا مدیرانی باشم که فهم‌شان به اندازه یک خط کد هم نیست. برای وقت، هوش و آزادی عملم ارزش قائلم.\nوضوح و سیستماتیک بودن: هر چیزی که مبهم، شلخته و بی‌قاعده باشد مغزم را فرسوده می‌کند. روابط، کارها و استراتژی‌ها باید خطوط تمیز و تعریف‌شده داشته باشند؛ اهل «حالا ببینیم چی میشه» نیستم.\n۳ چیزی که در آن‌ها خوبم:\nتبدیل آشوب به ساختار: هر چقدر هم یک ایده خام، پخش‌وپلا و گیج‌کننده باشد، سریع به لایه‌های منطقی تجزیه‌اش می‌کنم، باگ‌هایش را می‌کشم بیرون و از آن یک سیستم اجرایی و قابل فهم می‌سازم.\nتاب‌آوری و به خط پایان رساندن: وقتی بقیه وسط راه به خاطر اصطکاک یا سختی ماجرا بهانه‌تراشی می‌کنند و کم می‌آورند، من سرم را پایین می‌اندازم، مسائل را دانه به دانه حل می‌کنم و کار را تحویل می‌دهم؛ اهل نیمه‌کاره رها کردن نیستم.\nعیب‌یابی رادیکال و دیدن تناقض‌ها: چشم بسیار تیزی برای دیدن نقص‌ها دارم. فرقی نمی‌کند یک خطای منطقی در یک برنامه باشد یا یک تناقضِ رفتاری در یک انسان؛ زودتر از بقیه متوجه می‌شوم که کجای کار می‌لنگد.\n۲ چیزی که باید در خودم بهتر کنم:\nمدیریت اصطکاک با کندی و حماقت دیگران: باید یاد بگیرم که دنیا سیستم‌عامل نیست و انسان‌ها با کدهای دستوری کار نمی‌کنند. پذیرش این‌که بیشتر آدم‌ها غیرمنطقی، بی‌انگیزه و ترسو هستند، کمک می‌کند این‌قدر بیهوده حرص نخورم و انرژی روانی‌ام را سر ناکارآمدی دیگران تلف نکنم.\nکم کردن وسواس کمال‌گرایی و واگذاری کنترل: استاندارد بالایی که دارم باعث می‌شود ترجیح بدهم همه بار را خودم بکشم تا مبادا خراب شود. باید یاد بگیرم «خوبِ به‌موقع» را به «عالیِ فرساینده» ترجیح بدهم و دست از کنترل جزء‌به‌جزء بردارم.\n۱ چیزی که دوست دارم به خاطرش شناخته شوم:\n«آن آدم کاربلد و سرسختی که وقتی همه در توهم و حرف زدن بودند، کار واقعی و استاندارد تحویل داد و پای حقیقت ایستاد.»\nنمی‌خواهم صرفاً مشهور یا دوست‌داشتنی باشم؛ ترجیح می‌دهم آدم‌ها به عمق، اثرگذاری و استانداردِ دست‌نیافتنی کارم احترام بگذارند.\nسوال نهایی: «آیا این رزومه، بیشتر تو را نشان می‌دهد یا رزومه واقعی‌ات؟»\nبدون شک همین.\nرزومه سنتیِ من یک شناسنامهٔ تکراری برای راضی کردن سیستم‌های اداری و اسکنرهای استخدام است؛ کاغذی که صرفاً می‌گوید در چه تاریخ‌هایی توانسته‌ام خودم را درون چارچوب‌های تحمیلی دیگران جا بدهم.\n\nاما این متن، منطق تصمیم‌گیری، هزینه‌های روانی، وسواس‌ها و جهت قطب‌نمای درونی من است. رزومه سنتی می‌گوید ابزارم چیست؛ این رزومه نشان می‌دهد چرا و با چه موتوری با آن ابزار می‌جنگم.	https://pbfestival.ir/uploads/605093e4-9508-4234-b5e2-d11db5d2d05b.png	\N	\N	2026-10-10 17:01:48.849	2026-10-10 17:04:46.986	\N
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
\.


--
-- Data for Name: EmailVerificationCode; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EmailVerificationCode" (id, "userId", code, "expiresAt", "createdAt") FROM stdin;
9244bc44-cb04-4a85-a36a-312c75ab3702	ce58c88e-f936-4852-9989-b0d0616d6dbe	610187	2026-10-26 12:20:22.363	2026-10-26 12:05:22.364
acc58c52-d103-40bf-98c5-f73e31aba7b1	61deccf7-d89b-48c9-bef7-1c164bf76a5b	970472	2026-10-10 04:32:57.97	2026-10-10 04:17:57.973
82324996-a82a-4b39-9cf9-751d6d552a7f	ac37c689-62d4-48c2-9414-db44ab5c575e	442129	2026-10-19 18:49:21.16	2026-10-19 18:34:21.161
\.


--
-- Data for Name: Evaluation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Evaluation" (id, "participantId", "evaluatorUserId", status, "transformationScore", "finalScore", comment, "createdAt", "updatedAt") FROM stdin;
90b60d22-479b-4b90-bd26-8fdd9a5f25f3	d3fa51ef-b17a-49f0-8b6e-da5943681ced	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	DRAFT	\N	\N	\N	2026-10-13 07:11:59.714	2026-10-13 07:11:59.714
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
f1d41e1f-69e0-4d9e-8e75-bb036d8e96ea	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	2026-10-12 15:05:25.317
e9e81289-7301-4c5b-8143-44ded40518dc	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	2026-10-12 15:05:25.548
343c7ef9-8fbd-4b20-b206-5143555cbc1b	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	54832d93-ca2a-4d09-8ec4-39d6b00adb46	2026-10-12 15:05:25.563
9062bff1-6f48-49e4-8f92-25d1d852f447	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	cf562c3e-e18a-4d28-8ebe-2d2779a8e0fa	2026-10-12 15:05:25.726
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
2e597817-d0b4-4703-a3db-b3b9d7dbcf71	c41544a9-9932-4ddc-8e3d-170652b7ecb0	7864e1c1efcee1e2aa6da59ff633f91dd489561213d27975	2026-10-14 09:54:27.898	\N
406abe54-4fe6-4cd6-a718-12aa9244ddfb	51c2ad4e-b0d4-41aa-834c-83933510bb31	230e1fd677dd0d6909a9cd8978f7f1a97584efba410b9679	2026-10-16 08:42:47.761	\N
12edddeb-2638-4834-95d3-b3018fd140cb	2de6b8d2-37fa-488d-8842-9ddba186945b	6fa7603a4b77a05f653c26913f518fdb6504e16d439f67c2	2026-10-18 12:02:39.215	\N
\.


--
-- Data for Name: FeedbackResponse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeedbackResponse" (id, "requestId", "authorParticipantId", "authorName", answers, visibility, "createdAt") FROM stdin;
b53d4af5-0279-4c2c-9eb2-65f8d7f380c5	a7242696-e25e-4598-bf2f-6704d32060ee	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	محمدقلی	{"q1": "زود تند سریع خفن", "q2": "قوت", "q3": "انتخابی مطمئن", "q4": "عالی", "q5": "همه زمینه ها", "q6": "مهندس"}	PRIVATE	2026-10-09 17:26:04.725
9440ab65-e3a8-452c-a151-0fc7a99f6944	9f14a463-cbff-47ec-a596-708f52d65db9	d3fa51ef-b17a-49f0-8b6e-da5943681ced	Noor	{"q1": "Bjdjdj", "q2": "Fjjcjx", "q3": "Hdjhd", "q4": "Jhdhd", "q5": "Jhxhd", "q6": "Jjdjc"}	PRIVATE	2026-10-09 17:32:34.224
a7160141-b57e-41c5-be24-4ae588813ea9	9f14a463-cbff-47ec-a596-708f52d65db9	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	محمدقلی	{"q1": "زود تند سریع خفن", "q2": "قوت", "q3": "تمایز", "q4": "حرفه ای", "q5": "همه زمینه ها", "q6": "مهندس طراح مشاور"}	PRIVATE	2026-10-09 17:32:43.491
51f914b6-5880-4da3-a08a-5ad9c5b3a8a4	2e597817-d0b4-4703-a3db-b3b9d7dbcf71	51c2ad4e-b0d4-41aa-834c-83933510bb31	\N	{"q1": "خنده دار", "q2": "خنده", "q3": "خنده", "q4": "خنده", "q5": "خنده", "q6": "خنده"}	PRIVATE	2026-10-14 09:54:27.904
d3fd2613-e493-444f-ad4f-137f3f145e7c	a7242696-e25e-4598-bf2f-6704d32060ee	51c2ad4e-b0d4-41aa-834c-83933510bb31	نورالدین هویدا	{"q1": "منعطف- منطقی", "q2": "صداقت", "q3": "صداقت", "q4": "اکه روش جدیدی میخای توی کسب و کارت برو پیشش", "q5": "مدیریت", "q6": "پشتکار زیاد"}	PRIVATE	2026-10-16 08:28:47.211
f8c17f12-feaf-48f9-8479-e500f0b08ca9	9f14a463-cbff-47ec-a596-708f52d65db9	51c2ad4e-b0d4-41aa-834c-83933510bb31	نورالدین هویدا	{"q1": "فرایند محور - جزئی نگر", "q2": "دقت نظر", "q3": "داکیومنت قوی", "q4": "اگه میخای کار درست جمع بشه برو سراغ یاسر", "q5": "مدیریت", "q6": "مدیریت"}	PRIVATE	2026-10-16 08:31:56.038
1d8d1726-e68d-4061-9484-12c33a21ed9f	406abe54-4fe6-4cd6-a718-12aa9244ddfb	d3fa51ef-b17a-49f0-8b6e-da5943681ced	\N	{"q1": "سیستم‌ساز، عمل‌گرا، تاب‌آور، تحویل‌محور.", "q2": "«تبدیل بلوپرینت ذهنی به خروجی عملیاتی زنده، بدون توهم و با کمترین اتلاف منابع.»\\nبزرگ‌ترین دارایی نورالدین این است که هم ساختار و متدولوژی کلان را می‌فهمد (تحصیلات مدیریت پروژه) و هم ترسی از کثیف کردن دست‌هایش با خطوط کد و دیپلوی زنده سرور ندارد. او از آن دست آدم‌هایی نیست که کار را در مرحله «ایده عالی بود ولی نشد» رها کند؛ شروع می‌کند، زیر بار فشار خم نمی‌شود و کار را روی هوا تحویل نمی‌دهد، بلکه روی سرور بالا می‌آورد.\\n", "q3": "«پلی بدون لکنت میان زبان منطق بیزنس و زبان سنگین کد.»\\nدر اکوسیستم فناوری، همیشه دو دسته آدم به هم فحش می‌دهند: مدیرانی که حتی یک خط JSON نخوانده‌اند و زمان‌بندی‌های تخیلی می‌دهند، و برنامه‌نویسانی که هیچ بویی از ددلاین، مدیریت ریسک و بودجه نبرده‌اند.\\n\\nتمایز نورالدین دقیقاً نشستن در همین «نقطه کور بازار» است؛ او هرگز مهندسان فنی را با آرزوهای واهی دور نمی‌زند، و از طرف دیگر هیچ توسعه‌دهنده‌ای هم نمی‌تواند به او بگوید «این فیچر شش ماه زمان می‌برد» چون خودش زیر و بم استک مدرن را می‌شناسد.", "q4": "«اگر دنبال یک مشاور شیک‌پوشِ اسلایدساز هستید که فقط جملات الهام‌بخش بگوید، نورالدین گزینه شما نیست. اما اگر یک محصول ابری پیچیده یا یک پلتفرم وب دارید که ددلاین‌هایش در حال سوختن است و نیاز به یک معمار دست‌به‌کد دارید که هم کد تمیز بنویسد، هم سرور را سرپا نگه دارد و هم تحویل پروژه را مثل یک ساعت سوئیسی مدیریت کند، او همان مهره کلیدی است که نجات‌تان می‌دهد.»", "q5": "«معماری و رهبری فنی محصولات نرم‌افزاری و پلتفرم‌های ابری (SaaS Delivery & Tech Leadership).»\\nاو در نقش‌هایی که نیاز به ترکیب مهندسی زیرساخت/وب، مدیریت انتشار و ریسک و سرویس‌دهی خودکار (Automated Workflows) دارد، به اوج بهره‌وری می‌رسد؛ به‌ویژه در جایگاه‌هایی مثل Technical Lead، مدیر ارشد محصول فنی (TPM) یا هم‌بنیان‌گذار فنی (CTO) در استارتاپ‌هایی که محصول واقعی دارند، نه شوآف‌های کاغذی.\\n", "q6": "«مهندس ارشد محصول و معمار تحویل نرم‌افزار (Technical Delivery Architect & Full-Stack Builder)»"}	ANONYMOUS	2026-10-16 08:42:47.772
\.


--
-- Data for Name: Form; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Form" (id, title, slug, description, "isActive", status, "themeConfig", "startsAt", "endsAt", "createdAt", "updatedAt", "bootcampId", "bootcampStatusTrigger", type) FROM stdin;
cmvfgc7zc000013dqenvvwhew	فرم نظر سنجی آکادمی ۳ (۳۰ ثانیه برای به یاد ماندن)	فرم-نظر-سنجی-آکادمی-۳-۳۰-ثانیه-برای-به-یاد-ماندن	در این کارگاه تلاش کردیم ثابت کنیم که «۳۰ ثانیه کم نیست؛ به شرطی که دقیق بدانی چه بگویی». در این مدت، یاد گرفتیم که یک پیچ شخصی ماندگار چیزی فراتر از گفتن نام و عنوان است؛ فرمول PITCH را مرور کردیم تا هر عبارت پیچمان را به عمد بسازیم، نه به شانس.\nقالب، هویت، ارزش و تمایز، شاهد، قدم بعد — این پنج رکن، ستون‌های اصلی پیچ شما هستند که در این کارگاه میدان تمرین را برایشان آماده کردیم و سپس در اجراهای دونفره و نمونه‌های واقعی، به‌کارشان بستیم.\nهدف ما از این چند پرسش، قضاوت نیست؛ بلکه بازخورد شماست تا در نسخه‌های بعدی، این تجربه را هم برای شما و هم برای آینده‌گان، مؤثرتر کنیم. پس:\nلطفاً در پاسخ‌ها دقیق و صادق باشید؛ نه آن‌چه فکر می‌کنید «درست» است، بلکه آنچه واقعاً تجربه کردید و یاد گرفتید.\nسوالات در سه بخش طراحی شده‌اند: مفاهیم، کاربرد عملی و ارزیابی کیفیت اجرا.\nدر بخش تشریحی، خلاصه‌گویی بولد کنید؛ ما دنبال تیتر اصلی هستیم نه مقاله‌ی کامل.\nاز همراهی و صراحت شما سپاس‌گزاریم. بازخورد صادقانه‌ی شما، بهترین معیار برای اصلاح این مسیر است.	t	ACTIVE	\N	\N	\N	2026-10-19 16:11:39.239	2026-10-19 17:29:27.608	8043d09c-26e3-44a1-a1aa-74a995c6da83	\N	EVALUATION
cmuzf8rii0000oj1s4piouajz	فرم نظر سنجی بوت کمپ ۱ (پرونده من)	firstbootcamp	\N	t	ACTIVE	\N	\N	\N	2026-10-08 10:56:39.498	2026-10-08 11:27:21.543	0c753d22-b105-458e-b5eb-0e97105dad14	\N	EVALUATION
cmv5fv9sy00002qtyjnbhpfoy	فرم نظر سنجی آکادمی ۲ (از ادعا تا روایت)	secondacademy	هم‌مسیر گرامی، سلام؛\nدر جلسه اخیر (سرفصل دوم: از ادعا تا روایت)، دور هم جمع شدیم تا یک‌بار برای همیشه یاد بگیریم چطور مرز پررنگ میان «ادعاهای توخالی» و «شواهد ملموس (Evidence)» را پیدا کنیم؛ یاد گرفتیم که چگونه پورتفولیوی قابل‌اتکا بسازیم، ساختار روایتمان را بر پایه واقعیت بنا کنیم و تجربیات واقعی‌مان را به دارایی پایدار برند شخصی تبدیل کنیم.\n\nحالا دقیقاً نوبت خود ماست که پای حرف‌هایمان بایستیم!\n\nما در این مجموعه اهل کلیشه‌های رایج و فرم‌های نمایشی «همه چیز عالی بود» نیستیم؛ چرا که می‌دانیم بازخورد غیرشفاف صرفاً یک «ادعای بی‌فایده» است. فرم زیر برای این طراحی شده که شواهد واقعی شما را از کیفیت ارائه مدرس، کاربردی بودن پرونده‌ها و چالش‌های فنی پلتفرم جمع‌آوری کند.\n\nیک نکته مهم: پاسخ‌های بدون تعارف، منتقدانه و صادقانه شما دقیقاً همان دیتای نابی است که کمک می‌کند در گام‌های بعدی، آموزش‌ها دقیق‌تر، واقعی‌تر و بدون اتلاف وقت ارائه شوند. تکمیل این فرم حدود ۳ تا ۴ دقیقه از زمان شما را می‌گیرد.\nپیشاپیش از صراحت و همراهی‌تان سپاسگزاریم.	t	ACTIVE	\N	\N	\N	2026-10-12 16:00:46.651	2026-10-12 20:22:25.472	d317a886-786d-4077-b4dc-9243507c2275	\N	EVALUATION
\.


--
-- Data for Name: FormAnswer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FormAnswer" (id, "formId", "participantId", "guestEmail", "guestName", status, "totalScore", "submittedAt", "createdAt", "updatedAt") FROM stdin;
cmuzh2vzg0001zfrwdlvri4cl	cmuzf8rii0000oj1s4piouajz	d3fa51ef-b17a-49f0-8b6e-da5943681ced	nooreddin.hoveida@gmail.com	nooreddin.hoveida@gmail.com	SUBMITTED	\N	2026-10-08 11:48:04.586	2026-10-08 11:48:04.588	2026-10-08 11:48:04.588
cmuziq4fk0011zfrwmuncwuzw	cmuzf8rii0000oj1s4piouajz	\N	nilufar.ataeiyan@gmail.com	nilufar.ataeiyan@gmail.com	SUBMITTED	\N	2026-10-08 12:34:08.239	2026-10-08 12:34:08.241	2026-10-08 12:34:08.241
cmv5ghw73000o2qtyl33834sm	cmv5fv9sy00002qtyjnbhpfoy	d3fa51ef-b17a-49f0-8b6e-da5943681ced	nooreddin.hoveida@gmail.com	nooreddin.hoveida@gmail.com	SUBMITTED	\N	2026-10-12 16:18:22.142	2026-10-12 16:18:22.144	2026-10-12 16:18:22.144
cmuzh5qmz000izfrw4blr41xc	cmuzf8rii0000oj1s4piouajz	\N	nailofnilufarhoveida@gmail.com	nailofnilufarhoveida@gmail.com	SUBMITTED	\N	2026-10-08 11:50:17.626	2026-10-08 11:50:17.627	2026-10-08 11:50:17.627
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
cmvfgdfgr000213dq7oce33kl	cmvfgc7zc000013dqenvvwhew	\N	۱. کدام یک از اینها شاخص اصلیِ ماندگاری یک Personal Pitch است؟	\N	SINGLE_CHOICE	{"الف) وجود نام و عنوان شغلی رسمی","ب) ارائه‌ی داده‌ی عددی و شاهد ملموس","ج) استفاده از صفت‌های مثبت متعدد","د) بلند بودن مدت‌زمان بیان"}	t	\N	0	\N	2026-10-19 16:12:35.595
cmvfgf3qq000613dq86mkz3yg	cmvfgc7zc000013dqenvvwhew	\N	۲. حروف در فرمول PITCH چه معنایی دارند؟	\N	SINGLE_CHOICE	{"الف) جمع‌بندی، هویت، زمان، هزینه، هدایت","ب) قالب، هویت، ارزش و تمایز، شاهد، قدم بعد","ج) پیش‌زمینه، ایده، چالش، هدف، رویکرد","د) بررسی مخاطب، تجربه، نوع دیدگاه، نتیجه"}	t	\N	1	\N	2026-10-19 16:13:53.715
cmvfgg2q7000813dqky2sjqzx	cmvfgc7zc000013dqenvvwhew	\N	۳. مناسب‌ترین مدت‌زمان برای یک Elevator Pitch کلاسیک چقدر است؟	\N	SINGLE_CHOICE	{"الف) ۱۰ ثانیه","ب) حدود ۹۰ ثانیه","ج) تقریباً ۶۰ تا ۷۵ کلمه (حدود ۳۰ ثانیه)","د) بدون محدودیت زمانی"}	t	\N	2	\N	2026-10-19 16:14:39.055
cmvfggw49000a13dqmmtfebf4	cmvfgc7zc000013dqenvvwhew	\N	۴. According to the workshop, بهترین روش برای شروع یک پیچ ۳۰ثانیه‌ای چیست؟	\N	SINGLE_CHOICE	{"الف) «سلام، من… هستم»","ب) مقدمهٔ رسمی از سابقهٔ کاری","ج) اغاز با قلاب (Hook) که توجه مخاطب را جلب می‌کند","د) معرفی شرکت محل کار"}	t	\N	3	\N	2026-10-19 16:15:17.146
cmvfgmwl9000e13dqk1z984xc	cmvfgc7zc000013dqenvvwhew	\N	۵. کدام گزینه برای «شاهد» در فرمول PITCH، قابل قبول است؟	\N	SINGLE_CHOICE	{"الف) «خیلی دقیق و حرفه‌ای هستم»","ب) «تمام پروژه‌ها را با دقت انجام می‌دهم»","ج) «افزایش سود شرکت به میزان ۳۵ درصد از طریق بازطراحی سیستم فروش»","د) «تیمی عالی با ایده‌های نو هستیم»"}	t	\N	4	\N	2026-10-19 16:19:57.693
cmvfgnu92000g13dqeq758b8e	cmvfgc7zc000013dqenvvwhew	\N	۶. کدام گزینه اشتباه است؟ (در مورد نسخه‌ی ۹۰ثانیه‌ای)	\N	SINGLE_CHOICE	{"الف) داستانی کوتاه با ساختار موقعیت-اقدام-نتیجه اضافه می‌شود","ب) تکرار صفت‌های کلی و تبلیغاتی بیشتر می‌شود","ج) زمان بیشتری فراهم می‌کند تا شخص با جزئیات محکم‌تر شود","د) در برابر موقعیت‌های مختلف (مصاحبه، استیج، ویدئو) تنظیم می‌شود"}	t	\N	5	\N	2026-10-19 16:20:41.318
cmvfgorv7000i13dqytsm7k3i	cmvfgc7zc000013dqenvvwhew	\N	۷. با استفاده از فرمول کامل PITCH، پیچ شخصی خودتان را برای «مشارکت در یک استارتاپ» بنویسید و ضمناً مشخص کنید که هر عبارت با کدام جزء فرمول مطابقت دارد و چرا.	\N	TEXT	{}	t	\N	6	\N	2026-10-19 16:21:24.884
cmvfgp15c000k13dq8kjq368d	cmvfgc7zc000013dqenvvwhew	\N	۸. تفاوت برند شخصی و پیچ شخصی را توضیح دهید و نشان دهید چرا وقتی پیچ خوبی ندارید، برند شخصی شما در عمل «ناتمام» می‌ماند.	\N	TEXT	{}	t	\N	7	\N	2026-10-19 16:21:36.913
cmvfgp967000m13dq35kf22hd	cmvfgc7zc000013dqenvvwhew	\N	۹. دو معرفی نمونه‌ای را تحلیل کنید: یکی که «بی‌فایده» است (ادعای شعارگونه و بدون شاهد) و دیگری که «به‌یادماندنی» است. سپس با حداکثر ۲خط دلیل تفاوت را شرح دهید.	\N	TEXT	{}	t	\N	8	\N	2026-10-19 16:21:47.311
cmvfgpftr000o13dqlg1eghca	cmvfgc7zc000013dqenvvwhew	\N	۱۰. یک داستان‌کوتاه برای تبدیل پیچ ۳۰ثانیه‌ای به نسخه‌ی ۹۰ثانیه‌ای بنویسید. ساختار «موقعیت درگیری ← اقدامی که کردید ← نتیجه‌ی ملموس» را باید پوشش دهید و لحن اجرا را هم مشخص کنید.	\N	TEXT	{}	t	\N	9	\N	2026-10-19 16:21:55.935
cmvfhewn8000u13dqgfppxpds	cmvfgc7zc000013dqenvvwhew	\N	۱۱. (طیفی از دیدگاه‌تان) محتوای کارگاه چقدر ساختارمند، منسجم و دنبال‌کننده بود؟	\N	SINGLE_CHOICE	{" ۱ - پراکنده، گسسته و بدون نظم منطقی","۲ - تا حدی نامتوازن و نیازمند بهبود در چیدمان مباحث","۳ - متوسط؛ ساختار قابل قبول داشت اما جای بازنگری داشت","۴ - ساختاریافته، دقیق و منطقی","۵ - کاملاً ساختاریافته، منسجم و پیش‌رونده"}	t	\N	10	\N	2026-10-19 16:41:44.133
cmvfj14zl000w13dqtf32sg5w	cmvfgc7zc000013dqenvvwhew	\N	۱۲. نحوهٔ انتقال مفاهیم توسط مدرس، چه میزان برای مخاطب جذاب، غیرخسته‌کننده و قابل‌درک بود؟	\N	SINGLE_CHOICE	{"۱ - انتزاعی، خشک و سنگین","۲ - نیازمند تلاش بیشتر برای درگیر کردن مخاطب","۳ - خوب و روان، در حد استانداردهای رایج","۴ - ملموس، کاربردی و جذاب","۵ - کاملاً مسلط، پرانرژی، جذاب و کاملاً ملموس"}	t	\N	11	\N	2026-10-19 17:27:00.993
cmvfj2k2t001013dqo9od9q5i	cmvfgc7zc000013dqenvvwhew	\N	۱۳. کدام بخش از اجرای مدرس، بیشترین تأثیر را روی یادگیری و عمیق شدن مطالب گذاشت؟	(می‌توانید بیش از یک گزینه انتخاب کنید)	MULTI_CHOICE	{"تحلیل و بررسی مثال‌های واقعی و مقایسه‌ای (مثل نسخه‌های سارا، مریم و رضا)","مدیریت زمان و اجرای فعالیت‌های عملی و دونفره (تمرین‌های زنده)","سیستماتیک کردن مباحث با استفاده از فرمول ۵ بخشی PITCH","تسلط مدرس، پاسخ به چالش‌ها و مدیریت فضای کارگاه"}	t	\N	13	\N	2026-10-19 17:28:07.205
cmvfj2wul001213dq7j36g9ig	cmvfgc7zc000013dqenvvwhew	\N	۱۴. در یک پاراگراف کوتاه توضیح دهید که به عنوان یک شرکت‌کننده، دقیقاً چه جنبه‌ای از نحوه‌ی تدریس یا اجرای کارگاه به شما کمک کرد؛ و چه پیشنهاد مشخصی برای ارتقای کیفیت دوره‌های بعدی دارید؟	\N	TEXT	{}	t	\N	14	\N	2026-10-19 17:28:23.757
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
\.


--
-- Data for Name: LivePresence; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LivePresence" (id, "sessionId", "participantId", online, "joinedAt", "lastSeenAt", "groupId") FROM stdin;
213ec6a8-72b9-4c44-a206-1c6711ced224	b3c55a4a-950f-4521-9464-aebc9f6b346a	ee64d124-1c6f-4fdf-badc-e1d596010245	t	2026-10-09 17:58:29.21	2026-10-09 17:58:29.21	3cfd3c63-5f65-431a-869f-5049c8f3e1e1
ffaf8347-a9fa-4db5-a98d-dd4267870368	b3c55a4a-950f-4521-9464-aebc9f6b346a	ca485ac3-d106-4724-9e17-e5b2c7c35456	t	2026-10-16 11:09:39.944	2026-10-16 11:09:39.944	\N
\.


--
-- Data for Name: LiveSession; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LiveSession" (id, "bootcampId", status, "taskBrief", "createdAt", "groupedAt", "closedAt") FROM stdin;
b3c55a4a-950f-4521-9464-aebc9f6b346a	0c753d22-b105-458e-b5eb-0e97105dad14	GROUPED	\N	2026-10-09 17:55:15.433	2026-10-09 17:59:46.403	\N
acb1cb40-bc72-405d-b4a8-d58c85934a38	8043d09c-26e3-44a1-a1aa-74a995c6da83	OPEN	\N	2026-10-19 08:38:55.678	\N	\N
1ee9f8f2-a43d-43e0-984e-752f1c6b313b	d317a886-786d-4077-b4dc-9243507c2275	OPEN	\N	2026-10-23 07:33:02.778	\N	\N
\.


--
-- Data for Name: Media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Media" (id, "participantId", type, url, "mimeType", "sizeBytes", "order", "createdAt") FROM stdin;
002ceeb6-bbe8-4966-b12a-f451056295b3	d3fa51ef-b17a-49f0-8b6e-da5943681ced	PROFILE_PORTRAIT	https://pbfestival.ir/uploads/b22a1dba-79c1-4edd-92e7-a86bad32b973.jpg	image/jpeg	31761	0	2026-10-02 10:53:50.674
6b801367-84d4-48b9-b0f3-9d7781f46bee	54832d93-ca2a-4d09-8ec4-39d6b00adb46	PROFILE_PORTRAIT	https://pbfestival.ir/uploads/4dba372d-d3b4-455b-8c44-d08c3ae4ba57.png	image/png	1623927	0	2026-10-03 19:35:38.539
06d0977f-57cd-4e57-9292-a3e978bed2e0	d22d4504-da4a-43c6-83f1-7ea128731df0	PROFILE_PORTRAIT	https://pbfestival.ir/uploads/46baa9e6-f5a5-436e-aa04-306b9bf8c717.jpg	image/jpeg	60688	0	2026-10-26 02:56:36.301
80dddc02-0e57-4b34-a33b-417a4d4848f3	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	PROFILE_PORTRAIT	https://pbfestival.ir/uploads/b4d02958-fa30-4692-9064-136e21bd6222.jpg	image/jpeg	345688	0	2026-10-12 20:11:35.458
e7a0c2a2-c1b7-4b41-8a76-e30988baf76d	51c2ad4e-b0d4-41aa-834c-83933510bb31	PROFILE_PORTRAIT	https://pbfestival.ir/uploads/52bef680-12b2-4da7-ab2c-d0f77cc3c5c5.jpeg	image/jpeg	784862	0	2026-10-15 11:28:22.464
c464d6bb-f12b-4693-8d19-ba831539ce06	2de6b8d2-37fa-488d-8842-9ddba186945b	PROFILE_PORTRAIT	https://pbfestival.ir/uploads/ffe0a1bf-f7f4-4042-9848-6baf4d86c8bd.jpg	image/jpeg	63425	0	2026-10-17 19:23:02.391
74737dc7-9d30-491e-80ca-81b96e4af7de	c41544a9-9932-4ddc-8e3d-170652b7ecb0	PROFILE_PORTRAIT	https://pbfestival.ir/uploads/4ae1c50c-6d9a-4be2-98af-8a16f291afa4.jpg	image/jpeg	1041753	0	2026-10-18 17:15:02.106
2e64fdaa-8f1c-4934-8354-6ba07566670a	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	PROFILE_PORTRAIT	https://pbfestival.ir/uploads/2f558523-6ce8-4fbb-8be4-a65aa614a886.jpg	image/jpeg	234630	0	2026-10-19 16:04:00.755
b60e2b34-e295-464f-a568-b6247c051f99	21636d71-8dfa-470d-ae41-944a4336f225	PROFILE_PORTRAIT	https://pbfestival.ir/uploads/d3450800-3720-443f-baa1-79defe42bd94.jpg	image/jpeg	651550	0	2026-10-19 18:54:02.869
49244ee8-c907-449b-b036-e2137647c691	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/f1ea9c34-a38d-47b5-a1eb-d3a8eb36e427.png	image/png	1997812	0	2026-10-21 07:13:25.527
534ea583-c351-42c9-b3ca-a002d5ef1221	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/a2742130-5bfb-45e9-b440-976849e9ec0e.png	image/png	1997812	0	2026-10-21 07:13:42.274
68b01de9-a1e9-46dd-a129-9e15d7801725	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/1a3238a7-5975-43b0-b80b-063b5f68d30e.png	image/png	1997812	0	2026-10-21 07:14:20.853
eb3ea572-6e62-41f7-a752-aef8b79edd5e	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/23d22966-770e-4117-9dc6-1a776a7b04bc.png	image/png	1997812	0	2026-10-21 07:14:25.882
55ffb838-1780-4348-b5a4-15285375db7d	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/ed95e216-3961-4402-8af0-e700e6746e19.png	image/png	1997812	0	2026-10-21 07:14:59.144
285a7148-5949-4f17-8336-ff2f2e34ea8c	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/44a758ff-3f86-482e-ab75-b0b9edeb89e8.png	image/png	1997812	0	2026-10-21 07:19:29.623
e5912fda-0d82-455e-9d28-8681164fd828	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/92981f57-a727-4681-88f3-2d315b813e56.png	image/png	1997812	0	2026-10-21 07:19:53.676
ee308295-a532-4aa2-bec0-831a5eeb9489	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/6001cf1e-3b0d-496e-871e-b9c4216ae27a.png	image/png	1766687	0	2026-10-21 07:42:05.643
44d8b19c-2ac7-4c87-b603-4c497bf2d700	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/5f433c9a-b707-4558-b345-b6140ab25779.png	image/png	884507	0	2026-10-21 07:43:05.592
891f991f-955e-4195-96c9-8ade03d63e02	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/246b870e-02da-4047-ac8c-7d9f9716a94d.png	image/png	909236	0	2026-10-21 10:18:19.418
edf77170-0cd3-4941-a7f2-f17bd06913d5	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/110f9c00-3259-427c-a552-ef24e4dd953f.png	image/png	909236	0	2026-10-21 10:19:51.472
944062e4-6680-41c2-9ef8-d117bfd89660	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/72fd3df5-ac54-4ba4-aced-032a29341d98.png	image/png	923777	0	2026-10-21 10:24:47.121
2434dbca-81ed-4242-b135-0d4dbd81b6fa	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/2e976277-b1a8-40fc-82e5-51679bb7a84e.png	image/png	923777	0	2026-10-21 10:24:54.651
4e12a740-3411-4192-9224-829cef016162	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/ce2a0965-504e-41d6-9157-2a7482fe2ffc.png	image/png	1399047	0	2026-10-21 10:25:32.853
ea97b9dd-4a57-4e4f-8f38-7c45b124d595	d3fa51ef-b17a-49f0-8b6e-da5943681ced	GALLERY	https://pbfestival.ir/uploads/2c10418d-50f6-42b0-8c0a-09829a423372.png	image/png	1399047	0	2026-10-21 10:25:47.279
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
58c121d2-2359-4cf9-9a15-6c9ccf577af6	c66be053-b333-4f81-bb36-8692bcf45240	میلاد	فتوحی 	09902260642	تهران	تهران	دیپلم	مکانیک خودرو 				{}	3c9c98d3-164e-47c4-a166-b38dc648d950	user-15	PRIVATE	2026-10-18 11:25:25.35	2026-10-18 11:25:25.35
ca485ac3-d106-4724-9e17-e5b2c7c35456	b06f3ac5-8e14-4d0d-8a46-158d2a197b59	الهام	دارآفرین	09151085013	مشهد	مشهد						{}	831852b8-e625-485b-acf1-3bbc3013272e	user-9	PRIVATE	2026-10-13 09:33:30.857	2026-10-13 09:33:30.857
912f88b9-8df8-4784-8bf7-b922f2afe03a	888c5b03-edf2-484d-aeee-f256da1d4669	راضیه 	کاردان	09369609886	بیرجند	بیرجند 	لیسانس	علوم آزمایشگاهی 	هنر	کارشناس آزمایشگاه 	ساخت یک برند شخصی و معرفی مناسب ان به جامعه هدف	{پایروگرافی,"هنرهای دستی"}	db98ec12-343d-4b1d-9670-b8466d77c725	user-10	PRIVATE	2026-10-13 11:35:12.879	2026-10-13 11:35:12.879
54832d93-ca2a-4d09-8ec4-39d6b00adb46	a01ae82f-2df3-462d-9e3d-c4b07e781343	مبین	بهرام نژاد	09150912889	خراسان رضوی	مشهد	کارشناسی	مهندسی صنایع		مدیر تولید		{}	\N	member-telk2a	PRIVATE	2026-09-25 17:50:46.285	2026-10-03 19:35:51.856
cf562c3e-e18a-4d28-8ebe-2d2779a8e0fa	ee49f63f-9e8d-406d-a4ef-a0a471a51861	مبین	بهرام نژاد	09150912889	خراسان رضوی	مشهد	کارشناسی	مهندسی صنایع		مدیر تولید		{}	\N	user	PRIVATE	2026-10-09 16:57:01.703	2026-10-09 16:57:01.703
21636d71-8dfa-470d-ae41-944a4336f225	5ef7cef4-a0ea-4dc0-a7ac-2a025323baaf	محدثه	داودی	09020961640	مشهد	مشهد	کارشناس 	پرستاری		پرستار	هدف ارتقا شغلی درامد بیشتر	{مارکتینگ}	831852b8-e625-485b-acf1-3bbc3013272e	user-3	PRIVATE	2026-10-19 18:39:54.141	2026-10-19 18:39:54.141
ee64d124-1c6f-4fdf-badc-e1d596010245	369bfe81-8808-4dcc-b95a-3b3e853093bc	Nilufar	Ataeiyan	09360978100	khorasan	mashhad	master	xvc				{}	\N	nilufar-ataeiyan	PRIVATE	2026-10-09 17:57:57.422	2026-10-09 17:57:57.422
cec264cc-c421-4069-8154-331731108821	e4a74b08-de5b-47d0-90c3-d58f4bad33a0	آسیه	فروردین	09151077581	تهران	تهران	کارشناسی ارشد	زبانشناسی	تولید محتوا	تولید کننده محتوا		{}	\N	user-4	PRIVATE	2026-10-10 04:30:05.396	2026-10-10 04:30:05.396
d3fa51ef-b17a-49f0-8b6e-da5943681ced	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	نورالدین	هویدا	09150036518	مشهد	مشهد	فوق لیسانس	مدیریت پروژه	برنامه نویسی			{}	831852b8-e625-485b-acf1-3bbc3013272e	member-8iwgdv	PUBLIC	2026-09-25 12:41:21.31	2026-10-10 17:02:14.423
93e1e97d-2f8e-49c3-8eac-1a26547ec29a	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	یاسر	نوروززاده	09150036519	مشهد	مشهد	کارشناسی ارشد	مدیریت استراتژیک		مدیر ارتباطات سازمانی شرکت اکو	به قول جی.آر.آر مارتین؛ "باید بریم دنبال طلای فراموش شده‌مان پیش از آنکه روز به پایان برسد". 	{}	831852b8-e625-485b-acf1-3bbc3013272e	member-to6gds	PUBLIC	2026-09-30 16:40:50.33	2026-10-12 20:13:30.061
f5297151-99dc-43ee-80dc-29e1c687fe38	fd7ef889-bafb-4a6b-8bcf-e0527425a4b2	نجمه	معصومی نژاد	09374626077	مشهد	مشهد	لیسانس	مشاوره	مشاوره کودکان با نیاز های خاص	مشاور کودکان با نیاز های خاص		{}	831852b8-e625-485b-acf1-3bbc3013272e	user-7	PRIVATE	2026-10-12 20:36:57.629	2026-10-12 20:36:57.629
51c2ad4e-b0d4-41aa-834c-83933510bb31	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	نورالدین	هویدا	09307780976	مشهد	مشهد	فوق لیسانس	مدیریت پروژه				{}	831852b8-e625-485b-acf1-3bbc3013272e	user-6	PUBLIC	2026-10-12 15:07:58.781	2026-10-16 08:39:46.994
6e31c8ac-4f01-4672-92c2-78b32ac6fbdc	e7573aa6-efb7-4d09-8690-92ea0bd5786f	نورالدین	هویدا	09150036518	مشهد	مشهد	فوق لیسانس	مدیریت پروژه				{}	831852b8-e625-485b-acf1-3bbc3013272e	user-11	PRIVATE	2026-10-17 05:34:47.984	2026-10-17 05:34:47.984
2de6b8d2-37fa-488d-8842-9ddba186945b	74a58f55-f672-402f-accb-1fb932fbf2f7	مبین 	میرشاهی	09027308027	مشهد	شهر	لیسانس	بیولوژی 	زبان انگلیسی، تکنسین داروخانه			{مارکتینگ,نانوتک}	831852b8-e625-485b-acf1-3bbc3013272e	user-13	PRIVATE	2026-10-17 19:21:49.768	2026-10-17 19:32:54.996
c41544a9-9932-4ddc-8e3d-170652b7ecb0	320ef40a-48b5-4a51-badb-18f84eb0057f	احسان	علیزاده	09366197130	مشهد	رشت						{}	831852b8-e625-485b-acf1-3bbc3013272e	member-ixvvi5	PUBLIC	2026-09-25 15:17:47.478	2026-10-17 10:59:35.588
d816e125-d628-4dbf-b332-8dff32e9e457	d0d2e079-7ef8-4569-9dc8-22c16b8048ee	احسان 	اسماعیلی سارابی 	09016066267	سیرجان و شهربابک	شهربابک	لیسانس	مهندسی شیلات	صنعت 	نگهبان 	اسنوکر بازی میکنم در تلاشم به طور جدی و حرفه ای دنبال کنم ، در تلاشم که بتونم مدرک جدیدی بگیرم که هم به شخصیتم نزدیک تر باشه و هم باعث اعتبار بالا تر در سطح کارم بشه 	{}	eecb60c8-7896-4aa7-976b-461395b29994	user-12	PRIVATE	2026-10-17 18:10:23.47	2026-10-17 18:10:23.47
6c7e8c3a-f2a8-4d96-b693-70b50f0c8b13	6348c3b9-944e-42ed-8c51-9ccc0b864bc5	سحر 	محمودی 	09037024082	مشهد	گلبهار 	لیسانس روانشناسی 	انسانی 	روانشناسی 			{}	831852b8-e625-485b-acf1-3bbc3013272e	user-14	PRIVATE	2026-10-17 21:21:14.773	2026-10-17 21:21:14.773
d561fd2e-bce0-46ea-aa68-e3f3ef548c58	7c8e96ca-9eeb-442e-94f5-2679e226493c	رحیم	غلامی	09224898737	مشهد	مشهد	کارشناسی ارشد	مدیریت مالی	سرمایه گذاری	مدیر سرمایه گذاری	متخصص بازارهای مالی و مشاور سرمایه گذاری	{"سرمایه گذاری","مدیریت ریسک های متفاوت"}	831852b8-e625-485b-acf1-3bbc3013272e	member-l8tcaf	PUBLIC	2026-09-25 19:04:20.138	2026-10-19 16:11:01.27
5c006ee5-f03d-429f-8a14-c9ada572e221	97328cf8-3568-4495-a8c8-fb31d97ff017	فریدون	ناصری	09156944945	مشهد	مشهد	کارشناسی ارشد بازاریابی	مدیریت بازاریابی			سابقه 15 ساله در امور کالا و 4 ساله در بخش فروش اینترنتی پالایشگاه گاز خانگیران	{مارکتینگ}	831852b8-e625-485b-acf1-3bbc3013272e	user-2	PRIVATE	2026-10-19 17:41:05.918	2026-10-19 17:41:05.918
bca0c140-9365-4d18-b44a-8586ce23afc8	ae0abc8d-8a57-4c80-8fd8-967f4badce6d	امیرحسین 	حمزه	09015029107	بیرجند	بیرجند	سیکل	ریاضی فیزیک		محصل 	من یک محصل مصمم برای رسیدن به اهدافم هستم ، من یک فرد استراتژیست هستم و میتوانم با در نظر گرفتن ایده ها و بازخورد های خودم و دیگران ، اهدافم رو ارتقا بدم و این کلید اراده و سخت کوشی من میتونه باشه ، من اهل مشورت هستم و در مسیر اهدافم از خیلی از افراد ممکنه مشورت بگیرم . در عین حال فردی ساکت ‌ولی نکته بردار هستم .	{مارکتینگ,"مدیریت تکنولوژی و هوشمند سازی",فایننس}	db98ec12-343d-4b1d-9670-b8466d77c725	user-5	PRIVATE	2026-10-20 22:04:56.235	2026-10-20 22:04:56.235
6849b20b-2ebd-43ef-b435-a17ac02bdca0	f69430dc-a828-47f1-8eb6-d7a1c7a49624	فرهنگ	میرشاهی	09027308036	مشهد	مشهد						{}	831852b8-e625-485b-acf1-3bbc3013272e	user-16	PRIVATE	2026-10-21 10:56:02.181	2026-10-21 10:56:02.181
a351be0a-1556-4f12-a3f9-cb9bd7415b9d	62f57c70-9140-43d9-8cf4-52111f8fd3ef	Afsane	Zahmati 	09961976047	بیرجند	بیرجند	کارشناسی 	حسابداری 				{}	db98ec12-343d-4b1d-9670-b8466d77c725	afsane-zahmati	PRIVATE	2026-10-21 18:36:06.068	2026-10-21 18:36:06.068
d22d4504-da4a-43c6-83f1-7ea128731df0	7875013a-0534-4a50-89ec-06e29b8a5d18	مسعود 	یعقوبی 	09131937796	سیرجان و شهربابک	شهربابک 	فوق لیسانس 	روانشناسی 	درمان اعتیاد 	درمانگر 		{مارکتینگ}	eecb60c8-7896-4aa7-976b-461395b29994	user-17	PRIVATE	2026-10-26 02:54:12.725	2026-10-26 02:54:22.826
bee3e645-e768-4c21-b25a-c1b66210d8fc	2b429b56-84fb-4885-8769-7ab7b4d1987a	نور	هویدا	09150036518			\N	\N	\N	\N	\N	{}	\N	نور-هویدا	PRIVATE	2026-10-26 05:06:20.519	2026-10-26 05:06:20.519
ed291903-daa0-44d6-a131-dbb44051a2d6	03b5a7ff-a1e8-45b7-b569-0a56f301b283	امیرعلی	دادی	09153621806			\N	\N	\N	\N	\N	{}	\N	امیرعلی-دادی	PRIVATE	2026-10-26 09:25:42.226	2026-10-26 09:25:42.226
f16c2840-a2d1-4e16-8491-7fa3ac783942	e4cb6fba-7c40-46ae-b04c-766041ec41e0	علی	محمدپور	09197127968			\N	\N	\N	\N	\N	{}	\N	علی-محمدپور	PRIVATE	2026-10-26 12:20:53.624	2026-10-26 12:20:53.624
07276a24-ac98-4667-b758-31382b9b71a5	eb92d219-b3d2-4b16-b93e-b9cd5671991b	گلناز	میرشاهی	09025104695			\N	\N	\N	\N	\N	{}	\N	گلناز-میرشاهی	PRIVATE	2026-10-26 13:34:49.723	2026-10-26 13:34:49.723
\.


--
-- Data for Name: PersonalPage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PersonalPage" (id, "participantId", tagline, "identityWords", "strengthsJson", "valuesJson", "introText", "introMediaUrl", "roadmapText", featured, finalist, "winnerCategory", "publishedAt") FROM stdin;
5316b053-02b5-499b-aeaf-91e4f2952fa1	c41544a9-9932-4ddc-8e3d-170652b7ecb0	“Find ecstasy in life; the mere sense of living is joy enough.”	{}	\N	\N	معمار/طراح	\N	طراح واقعیت مجازی	f	f	\N	2026-09-25 15:50:51.94
0a472e2f-65d2-4e94-9b20-46b55c6ea9b3	d3fa51ef-b17a-49f0-8b6e-da5943681ced	چیزی که تو را نکشد تو را قوی تر می کند.	{خلاق,منعطف,"مسئولیت پذیر",مدیر}	\N	\N	 تا حالا چندتا موقعیت رو بخاطر اعداد و ارقام پیشبینی مالی از دست دادی؟ - حتما پیش اومده اصطلاحات مالی رو شنیده باشی که نتونی توی کسب و کار خودت پیاده کنی! من نورالدین هویدا هستم برنامه نویس با تمرکز بر تسهیل فرآیند ها و  کمک میکنم شما توی پروژه هاتون ارزش پیشنهادی تونو به بهترین شکل به مخاطب برسونین. من تونستم در حوزه استارتاپی فایل تحلیل مالی برای ارائه به سرمایه گذار طراحی کنم که حدود ۷-۸ سال هست که بواسطه اون فایل پروژه میگیرم و فایل های من حداقل به بیش از ۱۰۰ جلسه سرمایه گذاری رفته. مهارت من برنامه نویسی هستش با تخصص آکادمیک در حوزه ی مدیریت پروژه که میتونم توی کسب و کارتون باهاتون همکاری کنم.	\N	\N	f	f	\N	2026-09-25 12:44:12.573
ad175bd0-2141-4f42-ab72-ef5c6c7c1176	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	We must away, ere break of day, to find our long-forgotten gold	{"جزئی نگر",فرایندمحور}	\N	\N	بواسطه‌ی تجربیاتم میتونم به افرادی که میخوان تصمیمات شغلی یا تحصیلی بگیرن کمک کنم. همچنین یکی از مهارت‌هام بهبود دادن فرایندهای شرکت‌هایی هست که احساس می‌کنن کُند شدن و بروکراسی در اون‌ها داره زیاد میشه.	\N	\N	f	f	\N	2026-09-30 16:43:45.171
724aa113-15e3-4f73-bd45-bf6dfb41e533	51c2ad4e-b0d4-41aa-834c-83933510bb31	«تبدیل ایده‌های پیچیده به محصولات نرم‌افزاری مقیاس‌پذیر؛ تلاقی مهندسی کد و مدیریت استراتژیک تحویل پروژه.» Bridging Code & Project Delivery | Building Scalable SaaS Solutions	{"معمار (Architect)","سازنده (Builder)","تحویل‌گرا (Delivery-Oriented)","توسعه‌پذیر (Scalable)"}	\N	\N	«سلام، من نورالدین هویدا هستم. تخصص من اتصال دنیای کدنویسی نرم‌افزار به مدیریت چابک پروژه است. برخلاف اغلب مدیران پروژه که صرفاً گانت‌چارت می‌کشند و شناختی از لایه‌های فنی ندارند، من محصولات وب مدرن و پلتفرم‌های ابری (SaaS) را با استک Node.js و React از صفر کد می‌زنم و بالا می‌آورم. تمرکز اصلی من ساختن سامانه‌هایی است که هم از لحاظ فنی تمیز، بهینه و پایدار باشند و هم در موعد مقرر و متناسب با اهداف بیزنس به دست کاربر برسند.»	\N	[فاز ۱: تثبیت جایگاه - ۶ ماه آینده]\n├── متمرکز کردن برندینگ: حذف مهارت‌های پراکنده و قدیمی (آفیس، اتوکد سنتی)\n├── مستندسازی پروژه‌های SaaS واقعی (Case Studies: معماری، داکر، پرفورمنس)\n└── موقعیت هدف: Senior Full-Stack Engineer / Technical Lead\n\n[فاز ۲: ارتقا به نقطه تمایز - سال اول تا دوم]\n├── پیوند عمیق‌تر مهارت‌های تحلیلی مدیریت پروژه با مهندسی نرم‌افزار (Agile, CI/CD, DevOps)\n├── توسعه میکروسرویس‌ها و سرویس‌های مبتنی بر هوش مصنوعی (AI-Agent Integration)\n└── موقعیت هدف: Technical Product Manager (TPM) / Engineering Lead\n\n[فاز ۳: افق نهایی - سال سوم]\n├── هدایت تیم‌های چندمنظوره نرم‌افزاری و راه‌اندازی محصولات SaaS اختصاصی با مدل درآمد دلاری/پایدار\n└── موقعیت هدف: Head of Engineering یا هم‌بنیان‌گذار فنی (CTO / Co-Founder)	f	f	\N	2026-10-16 08:39:46.99
bcf3e3a4-91ac-4044-b069-d7f45ae85cd0	6e31c8ac-4f01-4672-92c2-78b32ac6fbdc	\N	{}	\N	\N	\N	\N	\N	f	f	\N	\N
2d760a95-0475-4508-a142-a09832de992a	cf562c3e-e18a-4d28-8ebe-2d2779a8e0fa	Making things happen, not just happen	{}	\N	\N	\N	\N	\N	f	f	\N	\N
2bb7ad66-8e5c-467f-ba13-431ba9b1be0b	2de6b8d2-37fa-488d-8842-9ddba186945b	گاز دار تر از پپسی	{Wild,"Optimistic ",Loyal,Free}	\N	\N	\N	\N	\N	f	f	\N	\N
e4de23c0-25f7-458d-8e8a-4d2a51aa1787	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	اثر مرکب، فرمول جادویی رشد شماست	{مدیریت,"مشاور مالی",توسعه,"بهینه سازی"}	\N	\N	با ترکیب مدلسازی و نگاه سیستماتیک مهندسی، به افراد و کسب و کارهایی که قصد تشکیل یک سبد سرمایه گذاری دارند، کمک میکنم که بتونن بهینه ترین تصمیم رو بگیرند و ریسک های مدیریت دارایی رو به حداقل برسونیم.	\N	\N	f	f	\N	2026-10-19 16:11:01.253
\.


--
-- Data for Name: PhoneVerificationCode; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PhoneVerificationCode" (id, "userId", code, "expiresAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: PreAssessment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PreAssessment" (id, "participantId", university, "linkedinUrl", "personalWebsiteUrl", "instagramHandle", "programGoal", "goalDescription", "selfAssessment", "qualitativeAnswers", "digitalPresence", "coordinatorNote", "submittedAt", "updatedAt") FROM stdin;
214a4d12-feb4-4765-8a5b-e69ef253e7bf	d3fa51ef-b17a-49f0-8b6e-da5943681ced	آزاد مشهد	\N	\N	\N	توسعه شبکه حرفه‌ای	\N	[{"axis": "تخصص و دانش فنی", "target": 10, "current": 4}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 10, "current": 6}, {"axis": "شبکه حرفه‌ای", "target": 10, "current": 4}, {"axis": "پورتفولیو / نمونه‌کار", "target": 9, "current": 1}, {"axis": "حضور آنلاین", "target": 8, "current": 1}, {"axis": "شهرت در حوزه", "target": 8, "current": 1}]	[{"answer": "علاقه مند به یادگیری و طراحی سیستم ", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "انعطاف در برخورد با دیگران", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "تمام کسانی که کسب و کار سنتی دارند و تمام کسانی که هدف برگزاری یک رویداد آموزی دارند", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "من پیش بینیم مهاجرت به آمریکا هستش و بعنوان یک برنامه نویس بازی های آموزشی", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "پرزنت کردن خودم", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "بله", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": true, "quality": 1, "platform": "لینکدین", "followers": 20, "lastUpdate": ""}, {"has": true, "quality": 1, "platform": "اینستاگرام", "followers": 500, "lastUpdate": ""}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-09-25 14:55:59.642	2026-09-25 14:55:59.642
4de566be-2e8f-4bb3-8391-8aaebc839fea	cf562c3e-e18a-4d28-8ebe-2d2779a8e0fa	اقبال لاهوری	-	-	-	توسعه شبکه حرفه‌ای	\N	[{"axis": "تخصص و دانش فنی", "target": 8, "current": 5}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 8, "current": 5}, {"axis": "شبکه حرفه‌ای", "target": 8, "current": 5}, {"axis": "پورتفولیو / نمونه‌کار", "target": 8, "current": 5}, {"axis": "حضور آنلاین", "target": 8, "current": 5}, {"axis": "شهرت در حوزه", "target": 8, "current": 5}]	[{"answer": "-", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "-", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "-", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "-", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "-", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "-", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": true, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": ""}, {"has": true, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": ""}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-09 17:02:26.258	2026-10-09 17:02:26.258
467766ca-30f4-4665-a38e-ab708dd7da6c	ee64d124-1c6f-4fdf-badc-e1d596010245	ازاد زاهدان	\N	\N	\N	آشنایی با مفاهیم برند شخصی	\N	[{"axis": "تخصص و دانش فنی", "target": 8, "current": 5}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 8, "current": 5}, {"axis": "شبکه حرفه‌ای", "target": 8, "current": 5}, {"axis": "پورتفولیو / نمونه‌کار", "target": 8, "current": 5}, {"axis": "حضور آنلاین", "target": 8, "current": 5}, {"axis": "شهرت در حوزه", "target": 8, "current": 5}]	[{"answer": "ت", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "ت", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "ت", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "ت", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "ت", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "ت", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": false, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-10 18:16:51.023	2026-10-10 18:16:51.023
ebd1e34b-83c2-47d7-b8a3-87c5b7322b54	912f88b9-8df8-4784-8bf7-b922f2afe03a	ییرجند	\N	\N	\N	پیدا کردن مسیر شغلی	\N	[{"axis": "تخصص و دانش فنی", "target": 8, "current": 4}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 8, "current": 2}, {"axis": "شبکه حرفه‌ای", "target": 7, "current": 2}, {"axis": "پورتفولیو / نمونه‌کار", "target": 10, "current": 5}, {"axis": "حضور آنلاین", "target": 8, "current": 2}, {"axis": "شهرت در حوزه", "target": 8, "current": 1}]	[{"answer": "من یک هنرمند کمالگرا هستم ", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "صبر من برای تولید یک اثر", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "علاقمندان حیطه صنایع دستی", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "در حال تاسیس موسسه هنری خودم", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "جذب مخاطب ", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "بله", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": false, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": null}, {"has": true, "quality": 1, "platform": "اینستاگرام", "followers": 300, "lastUpdate": "2021-10-13"}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-13 17:56:55.547	2026-10-13 17:56:55.547
3c9b93cf-d21a-4404-9add-9eb4e73e6065	ca485ac3-d106-4724-9e17-e5b2c7c35456	مشهد	\N	\N	\N	سایر	\N	[{"axis": "تخصص و دانش فنی", "target": 8, "current": 5}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 8, "current": 5}, {"axis": "شبکه حرفه‌ای", "target": 8, "current": 5}, {"axis": "پورتفولیو / نمونه‌کار", "target": 8, "current": 5}, {"axis": "حضور آنلاین", "target": 8, "current": 5}, {"axis": "شهرت در حوزه", "target": 8, "current": 5}]	[{"answer": "1", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "1", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "1", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "1", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "1", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "1", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": false, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-16 11:08:16.291	2026-10-16 11:08:16.291
7849c5d0-8411-417a-9cdb-557937bb9e5f	6e31c8ac-4f01-4672-92c2-78b32ac6fbdc	آزاد مشهد	\N	\N	\N	آشنایی با مفاهیم برند شخصی	\N	[{"axis": "تخصص و دانش فنی", "target": 9, "current": 2}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 5, "current": 3}, {"axis": "شبکه حرفه‌ای", "target": 5, "current": 4}, {"axis": "پورتفولیو / نمونه‌کار", "target": 8, "current": 5}, {"axis": "حضور آنلاین", "target": 8, "current": 5}, {"axis": "شهرت در حوزه", "target": 8, "current": 5}]	[{"answer": "ب", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "ب", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "ب", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "ب", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "ب", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "ب", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": false, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": null}, {"has": true, "quality": 1, "platform": "اینستاگرام", "followers": 1000, "lastUpdate": "2025-07-24"}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-17 05:37:54.663	2026-10-17 05:37:54.663
8ee34508-5924-4205-8754-5bba3ad18d33	2de6b8d2-37fa-488d-8842-9ddba186945b	علوم پزشکی شیراز	\N	\N	\N	سایر	\N	[{"axis": "تخصص و دانش فنی", "target": 9, "current": 5}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 8, "current": 8}, {"axis": "شبکه حرفه‌ای", "target": 8, "current": 4}, {"axis": "پورتفولیو / نمونه‌کار", "target": 8, "current": 4}, {"axis": "حضور آنلاین", "target": 8, "current": 1}, {"axis": "شهرت در حوزه", "target": 8, "current": 3}]	[{"answer": "Robot not Ai", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "Idk", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "همه افراد ", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "هرجا بجز اینجا ", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "جلب نظر مشتری، اطمینان از کیفیت کار", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "خیر", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": false, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-17 19:30:48.859	2026-10-17 19:30:48.859
bcdffd98-1404-4361-b6da-3ab41be2a949	6c7e8c3a-f2a8-4d96-b693-70b50f0c8b13	سناباد	\N	\N	\N	آشنایی با مفاهیم برند شخصی	\N	[{"axis": "تخصص و دانش فنی", "target": 5, "current": 2}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 8, "current": 4}, {"axis": "شبکه حرفه‌ای", "target": 8, "current": 2}, {"axis": "پورتفولیو / نمونه‌کار", "target": 5, "current": 1}, {"axis": "حضور آنلاین", "target": 5, "current": 2}, {"axis": "شهرت در حوزه", "target": 5, "current": 1}]	[{"answer": "روانشناسی که دغدغه‌مند حال خوب برای همه‌ی افرادی که دنبال تغییر و پیشرفت هستند ", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "مسؤلیت پذیری و شنونده فعال ", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "همه افرادی که به دنبال حال خوب تغییر وضعیت فعلی و پشرفت هستنند ", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "بصورت حرفه ای مشغول کارم باشم ", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "نمیدونم از کجا بايد شروع کنم چه کار هایی رو باید انجام بدم", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "خیر", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": false, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": null}, {"has": true, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": ""}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-18 10:37:57.144	2026-10-18 10:37:57.144
6f40c391-2214-4966-a98b-d44459ffea0f	58c121d2-2359-4cf9-9a15-6c9ccf577af6	تازه کنکور دادم	\N	\N	\N	آشنایی با مفاهیم برند شخصی	\N	[{"axis": "تخصص و دانش فنی", "target": 10, "current": 2}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 10, "current": 2}, {"axis": "شبکه حرفه‌ای", "target": 10, "current": 2}, {"axis": "پورتفولیو / نمونه‌کار", "target": 5, "current": 2}, {"axis": "حضور آنلاین", "target": 10, "current": 2}, {"axis": "شهرت در حوزه", "target": 8, "current": 2}]	[{"answer": "میلادم ارائه دهنده ی سرمایه گذاری های زیبا ", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "سخت کوش بودن و معتمد بودن", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "خریداران حوضه ی کارم", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "کسی اسمی در حوضه ب خود داشته باشه و یکم شناخته شده باشم ", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "نبودن آگاهی لازم و بودن بزند های خفن در حوضه کارم", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "بله برای کانال یوتیوب یا هوش مصنوعی درست میکردم", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": true, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": ""}, {"has": true, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": ""}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": true, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": ""}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-21 06:57:22.573	2026-10-21 06:57:22.573
4559c149-08f8-412a-b1ca-96dbb1a2e4fc	a351be0a-1556-4f12-a3f9-cb9bd7415b9d	بیرجند	\N	\N	\N	آماده‌سازی برای جشنواره	\N	[{"axis": "تخصص و دانش فنی", "target": 8, "current": 5}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 7, "current": 5}, {"axis": "شبکه حرفه‌ای", "target": 7, "current": 5}, {"axis": "پورتفولیو / نمونه‌کار", "target": 5, "current": 5}, {"axis": "حضور آنلاین", "target": 6, "current": 5}, {"axis": "شهرت در حوزه", "target": 5, "current": 5}]	[{"answer": "کسی که همیشه از هر راهی برای شدن استفاده میکنه.. ", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "تواناییهام", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "هنرمندان ", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "کسب و کار خودم رو داشته باشم ", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "شروع اون بزند میتونه سخت ترینش باشه بنظرم", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "بله در حوزه شرکت تولیدی قطعات خودرو", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": false, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": null}, {"has": true, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": ""}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-24 21:35:58.144	2026-10-24 21:35:58.144
2f28f465-2747-49ad-902e-a349fbbd968d	bca0c140-9365-4d18-b44a-8586ce23afc8	-	\N	\N	\N	پیدا کردن مسیر شغلی	\N	[{"axis": "تخصص و دانش فنی", "target": 10, "current": 1}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 10, "current": 6}, {"axis": "شبکه حرفه‌ای", "target": 10, "current": 4}, {"axis": "پورتفولیو / نمونه‌کار", "target": 10, "current": 1}, {"axis": "حضور آنلاین", "target": 10, "current": 4}, {"axis": "شهرت در حوزه", "target": 10, "current": 1}]	[{"answer": "یک دانش آموز با اهداف و افکار بزرگ که مصمم به دریافت نتیجه است ", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "فناوری نوین و کیفیت ", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "فردی که میخواهد کارش را به دست یک برند متفاوت بسپارد که میتواند عموم مردم و افراد خاص باشه", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "بدست آوردن کمی تجربه و ساختن شبکه بسیار بزرگ تر و ارتباطات قوی", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "اعتماد مخاطب هدف و مشهور شدن ", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "خیر اما علاقه به کار در یوتیوب دارم و بنظرم میتونه خیلی بهم کمک کنه بعد ها ", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": false, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-26 05:28:27.425	2026-10-26 05:28:27.425
943362c7-305d-40a8-a6e4-79ee876fd93c	bee3e645-e768-4c21-b25a-c1b66210d8fc	f	f	\N	\N	آماده‌سازی برای جشنواره	\N	[{"axis": "تخصص و دانش فنی", "target": 8, "current": 5}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 8, "current": 5}, {"axis": "شبکه حرفه‌ای", "target": 8, "current": 5}, {"axis": "پورتفولیو / نمونه‌کار", "target": 8, "current": 5}, {"axis": "حضور آنلاین", "target": 8, "current": 5}, {"axis": "شهرت در حوزه", "target": 8, "current": 5}]	[{"answer": "f", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "f", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "f", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "f", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "f", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "f", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": false, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-26 05:34:15.705	2026-10-26 05:34:15.705
3321ca07-8101-442c-9716-01a237b9d0e6	51c2ad4e-b0d4-41aa-834c-83933510bb31	b	b	b	\N	آماده‌سازی برای جشنواره	\N	[{"axis": "تخصص و دانش فنی", "target": 8, "current": 5}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 8, "current": 5}, {"axis": "شبکه حرفه‌ای", "target": 8, "current": 5}, {"axis": "پورتفولیو / نمونه‌کار", "target": 8, "current": 5}, {"axis": "حضور آنلاین", "target": 8, "current": 5}, {"axis": "شهرت در حوزه", "target": 8, "current": 5}]	[{"answer": "b", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "b", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "b", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "b", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "b", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "b", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": false, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": null}]	\N	2026-10-26 07:48:59.671	2026-10-26 07:48:59.671
a38474cd-698e-4b26-9203-434063f5f62e	07276a24-ac98-4667-b758-31382b9b71a5	دانشگاه صنعتی قوچان	\N	\N	\N	آشنایی با مفاهیم برند شخصی	\N	[{"axis": "تخصص و دانش فنی", "target": 10, "current": 5}, {"axis": "مهارت‌های نرم (ارتباطات، رهبری)", "target": 10, "current": 7}, {"axis": "شبکه حرفه‌ای", "target": 10, "current": 1}, {"axis": "پورتفولیو / نمونه‌کار", "target": 10, "current": 6}, {"axis": "حضور آنلاین", "target": 10, "current": 5}, {"axis": "شهرت در حوزه", "target": 10, "current": 1}]	[{"answer": "مهربون و صمیمی علاقمند به یادگیری و پیشرفت", "question": "خودت را در یک جمله توصیف کن."}, {"answer": "امیدوار بودن و تلاش برای هدف هام", "question": "چه چیزی تو را از بقیه متمایز می‌کند؟"}, {"answer": "شرکت های کلاس جهانی", "question": "مخاطب هدف برند شخصی‌ات کیست؟"}, {"answer": "کارشناس برنامه ریزی تولید یک شرکت بین المللی", "question": "در ۳ سال آینده کجا می‌خواهی باشی؟"}, {"answer": "عدم توانایی انتخاب بین راه های متعدد برای رسیدن به هدف ", "question": "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟"}, {"answer": "خیر", "question": "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)"}]	[{"has": true, "quality": null, "platform": "لینکدین", "followers": null, "lastUpdate": ""}, {"has": true, "quality": null, "platform": "اینستاگرام", "followers": null, "lastUpdate": ""}, {"has": false, "quality": null, "platform": "توییتر / ایکس", "followers": null, "lastUpdate": null}, {"has": true, "quality": null, "platform": "یوتیوب", "followers": null, "lastUpdate": ""}, {"has": false, "quality": null, "platform": "سایت شخصی", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "پادکست", "followers": null, "lastUpdate": null}, {"has": false, "quality": null, "platform": "ریسرچ‌گیت", "followers": null, "lastUpdate": null}, {"has": true, "quality": null, "platform": "گیت‌هاب", "followers": null, "lastUpdate": ""}]	\N	2026-10-26 13:54:56.948	2026-10-26 13:54:56.948
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
f1b8c725-0e22-4d2e-ac7b-d2f7d49e1453	ماموریت اول : رزومه بدون رزومه (غیرفعال)  یک رزومه برای خودت بنویس، اما هیچ‌کدام از اطلاعات معمول رزومه را استفاده نکن.  از مطالب زیر نباید استفاده کنی:  ❌ رشته ❌ دانشگاه ❌ معدل ❌ سابقه کار ، فقط از اینها استفاده کن:  ۳ چیزی که به آنها اهمیت می‌دهم  ۳ چیزی که در آن خوبم  ۲ چیزی که باید در خودم بهتر کنم  ۱ چیزی که به خاطرش ( یا دوست دارم به خاطرش شوم ) شناخته میشوم  سوال نهایی: «آیا این رزومه، بیشتر تو را نشان می‌دهد یا رزومه واقعی‌ات؟»	AFTER	TEXT	{}	\N	\N	\N	\N	\N	\N	0c753d22-b105-458e-b5eb-0e97105dad14	0
2f443403-7638-44d4-a43a-b5ac15a3d848	تمرین معرفی 30 ثانیه 	BEFORE	TEXT	{}	\N	\N	\N	\N	\N	\N	8043d09c-26e3-44a1-a1aa-74a995c6da83	0
5e01f66d-95a7-40ef-8535-78b537ae0dcd	آیا مهارتی هست که تا قبل از شروع آکادمی داشتی و باهاش آشنا نبودی؟ ویا اینکه آیا در این فرآیند آکادمی و محتوای دریافتی متوجه مهارتی در درون خودت شدی که بتونی روش کار کنی و در آینده ازش کسب درآمد کنی حتی اگر الان به هیچ عنوان در اون زمینه کاری نکرده باشی؟	AFTER	TEXT	{}	\N	\N	\N	\N	\N	f53db634-4ac8-4b32-971a-6528466cdb66	\N	0
\.


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RefreshToken" (id, "userId", "tokenHash", "expiresAt", revoked, "createdAt") FROM stdin;
adba2ba7-52ca-4c54-9cc3-c3fce801804a	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	7e190d8bbc5faf7154fd4a141ad28db8a7f188779607dd5792061f73f268ef5e	2026-11-23 12:37:04.144	f	2026-10-24 12:37:04.145
f68f165d-af49-4ea4-8c29-e300969b7fd8	369bfe81-8808-4dcc-b95a-3b3e853093bc	7d1e44d6c67c6d635bcd06a0b6cf89e297ba129c502d98e1ebe923abfc498866	2026-10-25 13:58:17.503	f	2026-09-25 13:58:17.504
083233f5-3c19-4e79-a2f3-86423e279760	369bfe81-8808-4dcc-b95a-3b3e853093bc	ca94a0e26fa8652fdb04b340a868f3f36c1b269b1923c0fae6d001b60bd30354	2026-10-25 14:50:04.82	f	2026-09-25 14:50:04.821
2dc8865d-42af-4e96-a2b4-082f9f86e01b	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	d589766d88c65061f460a520dc0550660741b67cdba144fc548cf924b706baf9	2026-11-12 18:59:55.807	f	2026-10-13 18:59:55.808
28ef41c3-f3cb-4820-9fc8-349cf4d91726	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	6547e283938434c2f0b1e06aeeb17a29ce9ad1a2871d3003b4d1a729ca95468d	2026-11-14 11:40:16.063	t	2026-10-15 11:40:16.065
81661104-ac8a-4ba8-8d71-76d5d0741a96	320ef40a-48b5-4a51-badb-18f84eb0057f	de053e6e86e9322e582cbe50c19058958700faf922242c81564376b102748081	2026-10-25 15:15:35.361	f	2026-09-25 15:15:35.362
09bdbb86-be96-4368-88d5-cf54bfba6435	320ef40a-48b5-4a51-badb-18f84eb0057f	e23a3c983e15aaedd7e82d02e7a75762376d29a847255ee32e1f5f5811f22499	2026-10-25 15:16:39.194	f	2026-09-25 15:16:39.195
596a37b2-b2d0-4f5c-9010-b791cadfcadc	320ef40a-48b5-4a51-badb-18f84eb0057f	a2b6b3c9711e570cfcb2543059fac359a4d44a09a795e9e7845ead4c56b344cc	2026-10-25 15:27:59.662	f	2026-09-25 15:27:59.663
6efd1a81-8fa8-4eae-bc20-9a9a7509933c	320ef40a-48b5-4a51-badb-18f84eb0057f	b59fbeb24bf10edba8b268bd924e58dc16ac12236cb9c0fb16c5122116f933d7	2026-10-25 15:48:48.238	f	2026-09-25 15:48:48.24
475f4aa1-2eb3-429e-9e70-1d91e60fb442	320ef40a-48b5-4a51-badb-18f84eb0057f	5d3c5d88d0e471c47f6736c71b303fd1bfe89af14275ded910959d9b3602c0d7	2026-10-25 15:51:33.856	f	2026-09-25 15:51:33.857
4a4cb89b-e389-4614-806f-59f011369b9b	320ef40a-48b5-4a51-badb-18f84eb0057f	d32d69ef1bbf0a1b20fd6e324457bdd2919b88f85c5ca5a9ec429c452059d507	2026-10-25 15:52:49.267	f	2026-09-25 15:52:49.268
fd3ad50f-0e7a-415e-a18d-bde3e1d8610a	085b6fc8-92c2-480b-b62f-d5b30db8b986	ffb553c8a586c5cb6f9612897404afcfe82ecdd0f3055a9b5fd4a30711302d39	2026-11-16 07:23:39.05	f	2026-10-17 07:23:39.051
d419ca79-0af6-46d6-9fe9-a61de21ecf70	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	dfc33d105bffbf53011f20c4d0e3d32d8e63abbbac4fa647fa8434518a8a0be9	2026-11-18 10:12:25.749	t	2026-10-19 10:12:25.75
4fe006f4-be91-43a8-8bba-5cb4388e7084	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	33df380e585703d31b11ad99f878006812ee9506c4af0541e4364b6f155cd860	2026-11-18 10:06:21.996	t	2026-10-19 10:06:21.997
23d0ddf7-ae2b-4aaf-a857-0807e36bff77	a01ae82f-2df3-462d-9e3d-c4b07e781343	a569bd27cb22319a61208d8622c65e0f4fd9a45f0a24271c5355727b91884f36	2026-10-25 17:49:12.447	f	2026-09-25 17:49:12.448
05a6e326-76f3-414f-a18a-3a592547906d	a01ae82f-2df3-462d-9e3d-c4b07e781343	bbd4c1331d15f9560d60a681b7ef531ba61c1f84aa551fc6344b45978541accd	2026-10-25 17:49:54.896	f	2026-09-25 17:49:54.897
aa052164-359d-4b67-8c57-f00eb5239ae0	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	0437d4b921d70b59c3534f47eba3d559f2bf829ff2273aba5805725ee4f9182f	2026-11-18 11:44:06.377	f	2026-10-19 11:44:06.389
3a0095b2-5911-4d5f-a617-32716231690c	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	b437012a36bfe862b00261cc9044ec08b5a6b270160cc364809a9175fcf16223	2026-11-18 12:36:52.164	f	2026-10-19 12:36:52.166
902cb34a-22b4-448a-99c3-a47f0361093c	97328cf8-3568-4495-a8c8-fb31d97ff017	6b98c15d2f7669c71f2dc43a35e852b9e10674696d67c9751cc4fc641c93e948	2026-11-18 17:38:43.344	f	2026-10-19 17:38:43.345
95ae6376-254c-4aa3-ba1a-50dae0eff3a8	7c8e96ca-9eeb-442e-94f5-2679e226493c	842ee3c6bf0657c8cf4f72937b4122a105cde21ce67a7608b5a581ac0a08c832	2026-10-25 19:03:26.228	f	2026-09-25 19:03:26.229
67ad4e34-5266-4c54-b2dd-1423cbe575f6	7c8e96ca-9eeb-442e-94f5-2679e226493c	bb1a21da1edc4d60f105fd8c12db51c51a7e519a1dc6a2e1515f16c50beb0344	2026-10-25 19:03:39.578	f	2026-09-25 19:03:39.579
57a10f81-aa37-4536-a5ea-15f3baae59c7	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	2e5dad33f7051b30559368d32360b4bd26610c2a413fe5e0cc6facbb9738dc90	2026-11-16 19:39:18.435	t	2026-10-17 19:39:18.438
ca6fc306-461a-4d5a-aa55-75d0c9fbf7dd	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	0f3c9d7c7837222bb87a2dd2cb869f432a52f6ba80d7f7ac4c8cfd85b9211781	2026-11-19 20:47:14.435	f	2026-10-20 20:47:14.436
0e5b6051-2878-4fb1-baf4-3e81dedb3c7e	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	7d4901e38e0089e2331c4333325b8f587add253202ce68ca1ce04461a60626c5	2026-11-11 18:11:28.334	t	2026-10-12 18:11:28.335
82f9f6f7-d9f0-4f01-9104-5fcad99aa20d	ee49f63f-9e8d-406d-a4ef-a0a471a51861	5e1c914572be53efc20a5814115170e67ba436241bca975cda19d46a020b7a01	2026-11-17 05:23:55.309	t	2026-10-18 05:23:55.311
800fdeec-854c-45ab-89b3-5246183da73c	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	47df9b39eceaa026ebb264647d780d23fdf9e54d7b28434c386a02a5a4db247a	2026-11-17 07:18:52.055	f	2026-10-18 07:18:52.073
a68ccda8-31c9-4f4e-93b0-a771167f0d4e	320ef40a-48b5-4a51-badb-18f84eb0057f	34e36e358be11fb489d2576dd3c78b782f837957ae989c534358585a5ae8de6e	2026-10-29 20:41:43.573	f	2026-09-29 20:41:43.576
5eca546a-d497-4513-9e63-f25d2eb11add	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	6f96ac438898a0046b8a445fdc5e2854b071cdb2a85be5aa4123caf05e274744	2026-10-30 07:27:07.635	f	2026-09-30 07:27:07.636
b5dfebfe-c92f-4280-8a75-a59fab5eb209	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	d37ac51d7e9f95c344cff60b7fdc7f7a493d6ade37f138a0d87b8d57f3525341	2026-10-30 16:37:49.631	f	2026-09-30 16:37:49.632
d67e2429-24b7-4dee-9059-07680aca6c41	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	4f21f56f314a9f9da7193941b42eec5773335e246bd7321c885db3533e5eb75b	2026-10-30 16:46:35.583	f	2026-09-30 16:46:35.584
e7605c46-d45b-4f02-a764-9c9583a2735e	7c8e96ca-9eeb-442e-94f5-2679e226493c	44e27b323ef9c36c7519f3d09480bf19cef19506f93e1f61e634f8d3477e3f2a	2026-11-20 16:35:12.351	f	2026-10-21 16:35:12.352
1ba85a4c-b396-4ae6-ad46-d301afa3e5c9	e7573aa6-efb7-4d09-8690-92ea0bd5786f	07d59ead9e46fea79ac92d83541fd194d6f09256ec2e74e2b8d6b3fc2b93cec7	2026-11-23 12:37:04.521	f	2026-10-24 12:37:04.522
93a43af9-47c8-4f3f-a5c4-4c5e676ff292	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	77d2f918f26fef63f554636b2041503f6ee8d3104e5e0c4304978df59fad6833	2026-11-23 08:44:23.624	f	2026-10-24 08:44:23.625
b3864a0b-fca4-43e3-8292-1746d59076c8	2b429b56-84fb-4885-8769-7ab7b4d1987a	6984acb78aefaa5dc962ab2100c53cab684d91ca320f620f5c8994c22af8b45a	2026-11-25 05:33:53.212	f	2026-10-26 05:33:53.213
e8ba3a27-8001-4d4c-bc45-04c7a580f280	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	ca963ad704d58dcc0e935690fe243d962e2cdc7b49b88e03bd1b8ea31c471f53	2026-11-25 07:48:35.205	f	2026-10-26 07:48:35.207
38cf06fd-2725-40ee-b8be-08e920d30bb1	eb92d219-b3d2-4b16-b93e-b9cd5671991b	06b6a00bc80d94225110331de4950ceb41ca5aa0de305ef85f674cc27d2ee940	2026-11-25 13:34:49.795	f	2026-10-26 13:34:49.796
ee94d8d1-cbc4-42ef-b8d8-e7fb06056739	eb92d219-b3d2-4b16-b93e-b9cd5671991b	69edcc4070282f82e65f67311815891a5cb5a0fde7039aa5880144f289070f70	2026-11-25 13:35:38.594	f	2026-10-26 13:35:38.595
bdd658f6-7cf7-42f2-bb39-9eaf1f159d2b	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	d4a65d297ad7a6946dd531dc859696dc02cd0eccb8f5e8552be2292ddb127a0a	2026-11-18 10:53:51.583	f	2026-10-19 10:53:51.584
07fb6e2b-1a2f-4c62-9a55-5e1cbc3a66b2	369bfe81-8808-4dcc-b95a-3b3e853093bc	72b9f0b9cf2da48e010e838c9d5f58a2954c691047f8b5956aba7d776406ba9b	2026-11-01 10:50:45.627	f	2026-10-02 10:50:45.629
852cd8eb-30b2-4c01-a133-4a9c038becbb	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	473dc221fc19efa08888873dc7ddab9045f6d6df7d357ebd76ef0e51b7234810	2026-11-18 13:44:03.574	f	2026-10-19 13:44:03.576
8cf7ca8a-1eca-4a1a-8721-6681c46a6f37	19be1b9e-7d5b-4482-8a06-f4776a34708f	b5d4e562372c956c588afff78cb891fd81719c8fd68866ca15bbf862b9e3350a	2026-11-12 06:14:38.631	f	2026-10-13 06:14:38.632
ab2ee087-865e-44e6-88f4-082f9811a92c	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	955b947498ecf967a68d215057dbabaeccfead1bfb6f6992c066e97a8cd4fc35	2026-11-13 08:26:25.05	f	2026-10-14 08:26:25.059
67469cfc-aa74-4b28-8815-8bf681c7aeff	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	527f276b728744e0f4192e25b96efad246df90145711d78273a4056fc80a753c	2026-11-15 10:00:22.155	f	2026-10-16 10:00:22.157
c66ea15a-05cf-4fd8-9536-abae224ec0cb	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	2a04bf55de8a1318afef991f670b3fce1926048a304c5b75c202c9f0bdbfa572	2026-11-18 18:16:13.736	f	2026-10-19 18:16:13.737
7729a3d7-df40-4f4d-a4b0-0d7e59cef791	ae0abc8d-8a57-4c80-8fd8-967f4badce6d	5d8b767bad0e480461054c4b9ab7d50247a4b57ca167197520d5e4582b09a684	2026-11-19 21:42:02.69	f	2026-10-20 21:42:02.691
a7574981-2430-470b-bd1a-3d454611f6bd	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	f19920a25050955852cf0f825bc03a55abcb941fd66444b391ee2d7d06b6b15b	2026-11-20 16:45:24.784	f	2026-10-21 16:45:24.785
729381d2-65f5-442a-b7ef-6c14d19b196e	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	a033312bda66b13204d2091c88ba4e932b6851683fb3a92782a7edd6c74368e3	2026-11-23 08:17:44.931	t	2026-10-24 08:17:44.935
b4f51ced-5a1f-4a0b-a48a-de689f3ff9e8	ee49f63f-9e8d-406d-a4ef-a0a471a51861	b1228ad4445d1b100233eba4204fe0c508c29f9eb70a4530e4f35c284f7e6ead	2026-11-17 05:34:28.323	t	2026-10-18 05:34:28.324
1d51b2a5-2827-4a83-91d9-0d5e3f227459	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	30878b40e1f442ee944d8fff4b4bcae4be1a67428585db95b404b60b4a8088e6	2026-11-17 09:36:23.36	f	2026-10-18 09:36:23.435
8fb92473-e319-49da-a694-c01e16c75e85	320ef40a-48b5-4a51-badb-18f84eb0057f	97e94c8d84fc18ed97aac166a0a4adb31ab498b05753b2f2034fcc0f358ccb75	2026-11-18 08:32:22.992	f	2026-10-19 08:32:22.995
13990e9e-b745-4141-8556-e336837c9966	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	a917940cf279f3aa5f7d7585c9dbca43f6c1c842a91959226302bdf61006373a	2026-11-16 20:19:40.477	t	2026-10-17 20:19:40.478
727e7138-fb06-4a7d-982d-61838200c73a	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	6174349a9cf50400cb9a21d978ca093577b93f0e91a3f9de98f9e7b751485caa	2026-11-17 05:31:12.824	t	2026-10-18 05:31:12.825
df619c65-f162-4739-ae0e-e69a1a6e8504	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	ae170fb1c78e1ae57d7670f1d0d995b68717216bac9b8d145c45290a2b2e43b7	2026-11-24 19:06:07.684	f	2026-10-25 19:06:07.685
edcbcb88-3efe-4294-926e-dc43a754dfcd	2b429b56-84fb-4885-8769-7ab7b4d1987a	3ee733540341580e6d66f86408d7c42272b3d068144b50e6640b5625401bbf1d	2026-11-25 09:21:30.335	t	2026-10-26 09:21:30.337
c85d3a60-4191-42eb-bf89-49e5d7391196	a01ae82f-2df3-462d-9e3d-c4b07e781343	ec4a1cd64133367e76ae10d47ca306ae43f433b0312f392b3159798750fcc5b3	2026-11-02 09:08:59.807	f	2026-10-03 09:08:59.808
a528450d-42cd-45aa-84f9-6228bc57458a	a01ae82f-2df3-462d-9e3d-c4b07e781343	821bedb7539bf522b4e3eb0c44e967a8fc7e66cc7793e63f8e7f24497ab67749	2026-11-02 09:10:04.835	f	2026-10-03 09:10:04.836
2b9d5101-bd32-4edf-a814-7700c27678d8	a01ae82f-2df3-462d-9e3d-c4b07e781343	57bb82b3f19c461b43a083fa7ca3240893ce1ae3b9400174c99c897390b12c86	2026-11-02 09:11:15.426	f	2026-10-03 09:11:15.428
e5fbcf4a-27f5-4e78-b647-d3155d97f340	7c8e96ca-9eeb-442e-94f5-2679e226493c	5053f45cfc972d01cf765a0d7c505eec489b6b4b35c7e7d8e4e3de2d6a517a6c	2026-11-02 14:17:52.718	f	2026-10-03 14:17:52.719
32722942-b9aa-429e-9e8e-8050d6f3662a	7c8e96ca-9eeb-442e-94f5-2679e226493c	e3c4f572b508315d6b06c22e1cc4385732d76ea5415e84195e0a30cd6840f7d5	2026-11-02 14:18:47.206	f	2026-10-03 14:18:47.207
b063bcbd-bd3d-419a-bfcd-38d2957cba4a	a01ae82f-2df3-462d-9e3d-c4b07e781343	6dc9a6cbbb63c1a6fcd748407982ef34b193b3b2f5e18cad130250724b2dd474	2026-11-02 14:46:32.543	f	2026-10-03 14:46:32.544
1d1da1ce-2e8e-47b5-b0c2-40d03fa154c4	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	cfd4bac590ce6b00c2e16ae12d9e5ff80a4867ac2f61b11d1543f2007be34aa0	2026-11-18 15:40:28.492	f	2026-10-19 15:40:28.509
6f68fe3c-bbd4-4baa-a157-b34bc1a43cc9	5ef7cef4-a0ea-4dc0-a7ac-2a025323baaf	51ee5cca5cc7d720ef6989b162043f6e9a0b225d1f430c557c65b304c7d69267	2026-11-18 18:37:16.623	f	2026-10-19 18:37:16.624
626034fb-9d5b-4521-a10a-c28feaccf485	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	3863d5d9f7728f66d64c96a8012b631dc539e577c0689c990018993eb7e91e27	2026-11-11 14:03:11.435	t	2026-10-12 14:03:11.436
4c3e058e-602d-4915-b0d0-24966c87a2ca	ee49f63f-9e8d-406d-a4ef-a0a471a51861	b7d96e2e54e63e7d3ef1dbfe585c44dc84eed5ecef9ccd0a4a454eccb95f1f69	2026-11-20 09:21:32.167	f	2026-10-21 09:21:32.182
1762b5b8-6c61-4084-9999-e0f0c017ce2e	62f57c70-9140-43d9-8cf4-52111f8fd3ef	f5c0e58d4637603c9bb2e78d15b4d0c26043ffebe17a84cc6d1745fee576b72a	2026-11-20 18:35:23.985	f	2026-10-21 18:35:23.988
4a934c98-ee65-4a18-9de3-8600e4b24164	b06f3ac5-8e14-4d0d-8a46-158d2a197b59	45f3aa00fd4052ddddc7802e5ccc2d99ed50ab25670dfd5b8ba7e44c60d26165	2026-11-15 11:06:27.284	f	2026-10-16 11:06:27.285
e88109eb-7022-4574-8142-7e71eeac5b2e	a01ae82f-2df3-462d-9e3d-c4b07e781343	d1350cd83210299a6ff43a758b5a66f601af62928d832ad254e59797273edc5e	2026-11-02 19:35:01.292	f	2026-10-03 19:35:01.293
98ac49bf-2c23-4199-b88b-6b9f8829d828	ee49f63f-9e8d-406d-a4ef-a0a471a51861	eddf7f5938510e2b68557f8822967b5fa6f0b74ece9cca9cf19b01674dc2bcfd	2026-11-16 14:10:07.646	t	2026-10-17 14:10:07.647
ea2c099a-e32a-4a33-8453-20ab62aeaa2f	369bfe81-8808-4dcc-b95a-3b3e853093bc	b389dd51dbc236ce651c7a3e8f1d73ad1ab0016178184b667a431ff2db651a6a	2026-11-16 18:00:42.953	f	2026-10-17 18:00:42.954
7b194863-ca68-44d5-b8ae-293a9d0e0dd2	6348c3b9-944e-42ed-8c51-9ccc0b864bc5	e22adda3722f85ef9229180f99ac4ac990222a914cc610d08ab99b7b7febf482	2026-11-16 21:14:27.645	f	2026-10-17 21:14:27.646
54792ecf-08d4-460e-9260-85b8838392c4	ee49f63f-9e8d-406d-a4ef-a0a471a51861	cbaa8e3bdaf7624048eb155ac43eae337750dc6d6685c244253562d912af02da	2026-11-17 05:37:59.125	f	2026-10-18 05:37:59.126
200e526f-e775-41c0-ba40-2da4dbe465a8	320ef40a-48b5-4a51-badb-18f84eb0057f	b8b2ce2e2d586395d1d69bddf8194195104a4a1e70a89d872a2aab742e99eb13	2026-11-17 09:39:24.852	t	2026-10-18 09:39:24.853
e6f2f398-8806-4b94-bb85-972936b21e91	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	3e8169757457a152d5468d97a6b85d1fccc19a656b2c878047a68e1248168fa9	2026-11-18 08:46:57.29	t	2026-10-19 08:46:57.295
803f4b4b-6493-4852-8cc8-2857eeca0629	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	14ba67d4b68d35582ead3db1de5075990121e62776d097b75c8d7b3235272097	2026-11-18 11:22:24.623	t	2026-10-19 11:22:24.624
94c20c94-f130-4ed5-a346-26bd4c95024e	7875013a-0534-4a50-89ec-06e29b8a5d18	3847fbfce0e2e815fecfeecf1ff04632458c942c12270acef945911e4b3071ea	2026-11-25 02:51:35.629	f	2026-10-26 02:51:35.63
f993920e-7bf9-4f0b-9f27-7b9ed3970b4c	03b5a7ff-a1e8-45b7-b569-0a56f301b283	b3a355b9e4f3efbbe22d745bb216a9682ec2051eb96c9b0731f260fcb0c6ba46	2026-11-25 09:25:42.243	f	2026-10-26 09:25:42.244
4ea91735-f26e-4e13-9063-dfde6b5a9305	ee49f63f-9e8d-406d-a4ef-a0a471a51861	e4d8e4c959b0a2335fd01d18d023dfd5711cbdf8944f69efd175ccc40f2500b6	2026-11-17 05:38:59.318	t	2026-10-18 05:38:59.319
0647934a-ebf8-43ff-a9ff-f8cb0db71e58	c66be053-b333-4f81-bb36-8692bcf45240	38255927b77395130ee69322b65d23eb336e397ec5b0ab82d374a3054bb6d510	2026-11-17 11:24:43.055	f	2026-10-18 11:24:43.056
3ef53bfd-9a13-431e-8a1f-8edce20c2c26	5ef7cef4-a0ea-4dc0-a7ac-2a025323baaf	07fc77d6fb8b1713921bfad62164f301e25b08dcdd0aa36bf55b98d7212a069d	2026-11-18 19:00:46.495	f	2026-10-19 19:00:46.496
1368afeb-f4e0-4059-836a-49dd084f92a9	f69430dc-a828-47f1-8eb6-d7a1c7a49624	63084a32b25c7fe11b8d7dc141495033e828040b32170f3a9de6dd5b743835a9	2026-11-20 10:54:52.577	f	2026-10-21 10:54:52.578
242d4b1f-3fdb-4f42-8759-4e8963d0a77b	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	2e12196cfe292f23e622ac3798e81646293db9a3405d7dcb7e85e3de58a9bda8	2026-11-20 10:56:56.546	f	2026-10-21 10:56:56.547
01068723-6e24-40bc-8f23-8f6def0a61fd	7c8e96ca-9eeb-442e-94f5-2679e226493c	bc69703a8cbfbb4c302a345c81631a51b092817364d6c50157f464d30005027e	2026-11-18 16:02:46.822	t	2026-10-19 16:02:46.823
aaf8db9c-79bf-4bf9-93bb-0e0abc6358c3	a01ae82f-2df3-462d-9e3d-c4b07e781343	c1e6071f0ebbebb2d4658ceb5d66e041c84a8010796381b73b307653ac49c4d3	2026-11-08 17:06:20.227	t	2026-10-09 17:06:20.23
8bca8460-99aa-4c36-8f8c-c0310a461dc7	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	58359cc2b3cd6bcebba3d1f21d5e74eae3c0d0fc8e908ae31617487ca152cf8c	2026-11-18 08:57:46.804	t	2026-10-19 08:57:46.805
c36f8d99-3d70-4979-b2ea-9d98fcddf567	369bfe81-8808-4dcc-b95a-3b3e853093bc	bcf957c3194d41721ca210e804d1f6725cc6859010e5e5ffc9de77c16f55a4ce	2026-11-08 17:57:12.524	t	2026-10-09 17:57:12.526
6b64562f-148e-43ee-89ab-14f3839dfb8b	369bfe81-8808-4dcc-b95a-3b3e853093bc	7ab1852578048fe50799a74ec0baf4a28a9abc7a49f90abc834deb3dc4d2c39e	2026-11-07 12:32:14.517	f	2026-10-08 12:32:14.52
2d73ae8d-5805-405e-9f97-56e6aa13c0e7	369bfe81-8808-4dcc-b95a-3b3e853093bc	3f5179ef66ec76d5e4c2bee02e521ff65e4c8999820497db11b017b72812fe0f	2026-11-07 12:35:02.774	f	2026-10-08 12:35:02.775
498ca7eb-1f2d-4f93-82eb-713d68862f3a	d0d2e079-7ef8-4569-9dc8-22c16b8048ee	5df1b02b1117cd76b484ccc613bf2812bb89c8755e02aa7d7a1da9bc5c2d9b0d	2026-11-16 18:06:07.431	f	2026-10-17 18:06:07.432
001dac64-df4f-4df0-bc50-de5fe1cfba33	ee49f63f-9e8d-406d-a4ef-a0a471a51861	08da6d8fe3cf6a4beffd0966ba1684b7b26105b46b211838c3e188e129515da6	2026-11-16 14:10:47.404	t	2026-10-17 14:10:47.405
39e31493-bac0-4f5d-8173-9d8a6cef1453	ee49f63f-9e8d-406d-a4ef-a0a471a51861	36041c23406a320fb17574dbf9c2d1aff913cd1f26ee051493e21136fffef684	2026-11-17 05:15:44.954	t	2026-10-18 05:15:44.955
5e600988-cbd8-480e-90d3-7126d67d450f	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	b036d75225216212dbea60530ee4d98c81828e3fc236ed86459b8502a2325554	2026-11-08 15:10:30.322	f	2026-10-09 15:10:30.324
7cb27310-ae02-47a0-b20a-bd8e7c36ba90	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	16f060653e2ca797d686833527d171cab33edaf661a9e96413726bfdf11d549d	2026-11-08 15:11:41.113	f	2026-10-09 15:11:41.115
c3471f11-b05e-438e-8414-8f4f50f06745	7c8e96ca-9eeb-442e-94f5-2679e226493c	b4530b52f8ae17de0767108e5b066487f6229011791b7870ab4eca8c1c59db94	2026-11-08 16:49:20.066	f	2026-10-09 16:49:20.067
c2bfb902-95bd-4914-b2f4-b53d3831c45c	7c8e96ca-9eeb-442e-94f5-2679e226493c	975840f4d3e59997e437a0c554da7b7b1662646ebe259edb1bfacf491421b21d	2026-11-08 16:49:31.774	f	2026-10-09 16:49:31.775
5bc4ba47-0b3d-4dc8-91a0-bfd4e1421a6b	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	3f1156712d27628846299252e3af40c841d1aa3485df1646c6e7bb13b4141c0d	2026-11-08 16:49:57.7	f	2026-10-09 16:49:57.701
b921d493-142d-4ad5-9d4e-236ebc19352b	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	e81d91ae6d844b1476cb47c8036c522906deda28cf0b07400c1882e7384c8279	2026-11-21 16:44:45.288	t	2026-10-22 16:44:45.289
8318c6d6-c121-4fc0-b32b-f309f412152d	7c8e96ca-9eeb-442e-94f5-2679e226493c	d23c3368f332b7a8ab6c406d0d1a76ab252063298cf81d2595e31107e26023a7	2026-11-08 17:00:07.139	f	2026-10-09 17:00:07.14
1a09d3ea-ab79-4aaf-9097-c9a6abb92424	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	7fce7814e683ee476b841e6ffa8837ee122cb09c0cd6ea3ed461ebc9610803d8	2026-11-23 08:38:53.009	t	2026-10-24 08:38:53.013
7916675d-e6cc-4cc8-8abf-51c2729bfd08	7c8e96ca-9eeb-442e-94f5-2679e226493c	ac805bdc817dda3787d83e3875dcfbd6de96b352c9c69062f8bdff908d971386	2026-11-08 17:42:39.048	f	2026-10-09 17:42:39.049
1d47073a-2ef0-49e9-b655-73bf9c0eae2c	7c8e96ca-9eeb-442e-94f5-2679e226493c	0534e961fa9dc152bc1e4e2bdc62527dea14cc53cfd1d4ac5aef088bdf80de38	2026-11-08 17:47:10.144	f	2026-10-09 17:47:10.145
609f9114-28fb-495e-a991-4b6209c4ba51	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	44f857491c10eef0a2dfd36605feac22876e906372f0a47b9b0de91e254e9358	2026-11-25 10:35:58.56	f	2026-10-26 10:35:58.572
efcaf939-e312-4191-bcc4-67181b680ade	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	be125262ada5f3b1927510ab150db3433aaa627ea405d75af639b6397cd0e026	2026-11-18 16:09:45.588	f	2026-10-19 16:09:45.589
c0dd4e71-00fd-4db2-8ced-c47783f92e32	e4a74b08-de5b-47d0-90c3-d58f4bad33a0	43725f8f7b6f0be4fdcd2ebfa4d9de1ad11d8fb86c71a3fa0017fdb68faf732c	2026-11-09 04:27:26.345	f	2026-10-10 04:27:26.347
8fc13e95-27ee-4c5e-aed1-1d28a14c35b3	e4a74b08-de5b-47d0-90c3-d58f4bad33a0	633b7286f4cc9de514787ef89404b4c0aea50e78d849470c8a53a4f9b350ed21	2026-11-09 04:29:00.882	f	2026-10-10 04:29:00.883
aac45207-0c3b-419d-b4b1-1368b64b22ee	369bfe81-8808-4dcc-b95a-3b3e853093bc	9c65aa729fa0bbd08765b72b4829f9ac8723e57b8e5f235d53536c590246e603	2026-11-09 18:15:55.582	f	2026-10-10 18:15:55.583
e0972659-f59e-4784-bdbb-9e067e4416d5	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	eef481dcb6b4eb2bf6ec845ff35e218a2a1d997b6ff0aa6408c373814ac7f293	2026-11-19 20:44:58.602	f	2026-10-20 20:44:58.603
0765e486-398e-49d2-877b-058798ba71d2	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	f0bfbfa6c5215c9681ebb30280753e43f1948738601355f8f432d17131b17cef	2026-11-20 16:35:09.283	f	2026-10-21 16:35:09.284
dcea7e72-4b7c-4340-95db-edc35a162a49	888c5b03-edf2-484d-aeee-f256da1d4669	4ea675836feb7e5fc0dd46f1bab6bd018ffaadf8e0d433fc15c9aa7619d79d7a	2026-11-12 17:53:46.52	f	2026-10-13 17:53:46.521
706181d0-7b65-47bc-a281-fccad3f25148	fd7ef889-bafb-4a6b-8bcf-e0527425a4b2	d9bbd9942a3d33062437b5def65eaa4847c23988292ed0c18556b59d1f78ce4d	2026-11-10 10:26:48.931	f	2026-10-11 10:26:48.932
5b9217aa-2bd4-47f8-a07a-d0a809ea784e	320ef40a-48b5-4a51-badb-18f84eb0057f	2ce83c35e3c4ccbd84802e7900b0c2b59b9aa6bed7c6329acf10adb2b2bbe832	2026-11-10 10:48:06.658	f	2026-10-11 10:48:06.659
166b9241-d90c-41a5-bd12-73fda473e999	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	a59834defeb799cc00082e0df14fed836ad758b177804511a95d848e5ee20f8a	2026-11-23 10:34:54.08	t	2026-10-24 10:34:54.081
ec744509-69b1-43e4-b71f-f779530ad6d1	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	e78aa7d47dd6e57ce22759c24a18f30cc619a7e7abeff364b545fe2a97db11f3	2026-11-14 11:29:26.401	t	2026-10-15 11:29:26.402
0cb0db7d-8c6b-47bb-9307-0c82886baca7	085b6fc8-92c2-480b-b62f-d5b30db8b986	e5de6134898338d71e2c536bd0137c877551226c3e67c2b0a29bb65ec1da7f01	2026-11-16 07:19:16.563	f	2026-10-17 07:19:16.564
ed4e0034-4a41-4e3a-99f4-e723de3e49df	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	dbeac066d21657b9de5e5eed5d3baccbe3872d10d4496e9d8add8de198e42d7c	2026-11-16 14:17:42.33	t	2026-10-17 14:17:42.332
54b762cd-113b-408b-a610-ade952b5279f	74a58f55-f672-402f-accb-1fb932fbf2f7	933e3853aea1e171967ff41c53470e6a98d7b3c7058233372ccf7ae4e9d02ebf	2026-11-16 19:20:45.182	f	2026-10-17 19:20:45.183
45c06422-7ec9-4b18-9132-b605e6dbf245	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	0a96962a8f5c6464e17c054a45cf646d3a03141acc9d277be2a00e1abf95860c	2026-11-11 17:48:31.902	t	2026-10-12 17:48:31.905
12dfdd5d-d63b-40b3-8441-a328af5a03b4	ee49f63f-9e8d-406d-a4ef-a0a471a51861	29d6030942d7406413385dcb49bc42f7588c05376243f46f0f98f2bd64cee8c9	2026-11-17 05:16:09.124	t	2026-10-18 05:16:09.125
6bba78f5-9c85-4f9c-9a60-db68bfd64616	ee49f63f-9e8d-406d-a4ef-a0a471a51861	e5017c0f606284f5cecc10e672d295ad9e1b89477efba566facc83ff6d3c5f12	2026-11-17 05:41:08.409	f	2026-10-18 05:41:08.411
282d8415-b654-438c-8b24-5bc46c1be0b2	320ef40a-48b5-4a51-badb-18f84eb0057f	5bcdf451d9a4b6b93a3c430dcbe5bdd160a67482a9abaa3b1c951e0c1bbf1258	2026-11-09 23:21:38.789	t	2026-10-10 23:21:38.79
aa0c746f-4861-49fa-ae15-2060ac4c34f8	085b6fc8-92c2-480b-b62f-d5b30db8b986	ea89a715620eb7b2394f9f53a0f048b150a6668ffd925e1f6494841754309c53	2026-11-17 13:38:26.197	f	2026-10-18 13:38:26.198
6062855d-2665-4740-9b49-f1fedebe4b82	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	84412f7c2f184725dca99f4a49f802af64778064e1209317c77e9241c9bac37b	2026-11-18 09:05:41.263	t	2026-10-19 09:05:41.264
c997234f-5b1b-46bc-88af-f5ec3a6d3447	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	3f35de7e0c886d1f7bed2ca89ebc2e5b46c9d88bbae6c74f8dc9a96fcbf90981	2026-11-24 14:40:46.014	f	2026-10-25 14:40:46.016
e897990b-2a72-4fee-9a22-a21f4c696461	2b429b56-84fb-4885-8769-7ab7b4d1987a	7ac3cf90f486a537514a6311698bf9a9cb507c9f3843502f2e2c3e33fc0732d8	2026-11-25 05:06:20.53	t	2026-10-26 05:06:20.531
567a11f9-ff36-42b6-8ba5-d9f0a9b68af8	e4cb6fba-7c40-46ae-b04c-766041ec41e0	a84fdc54d9d922f7fede9ae5dfb986bb7a3395181b321e872763d479ad02992f	2026-11-25 12:20:53.964	f	2026-10-26 12:20:53.967
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

COPY public."Response" (id, "participantId", "questionId", visibility, "createdAt") FROM stdin;
9d4434bf-e71b-4d8d-a770-4c2b8e33eec4	d3fa51ef-b17a-49f0-8b6e-da5943681ced	8dca074d-6d4f-4f51-b476-226a7adaba5e	PRIVATE	2026-10-11 17:03:09.912
355c5b85-690a-4a5c-9042-6c573120841f	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	5f5af80c-1cf0-49bd-b6b2-d99cb42a055a	PRIVATE	2026-10-12 20:19:58.337
1367649b-c987-4f88-9ab8-2f5bdfcbe0f9	d3fa51ef-b17a-49f0-8b6e-da5943681ced	43ce0a86-fa9c-4f09-a401-3c25dd43a55c	PRIVATE	2026-10-13 07:14:54.242
166286b5-2617-4da7-b6c7-902002fee60b	d3fa51ef-b17a-49f0-8b6e-da5943681ced	5e01f66d-95a7-40ef-8535-78b537ae0dcd	PRIVATE	2026-10-13 19:31:34.637
24e4fe21-dad3-4dec-8fe3-c21e2b0a3b6d	93e1e97d-2f8e-49c3-8eac-1a26547ec29a	93960152-dc80-43d6-a793-a1f9acccd47e	PRIVATE	2026-10-21 07:25:13.523
\.


--
-- Data for Name: ResponseVersion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ResponseVersion" (id, "responseId", "versionNumber", content, stage, "bootcampId", "createdBy", "createdAt", "autoScore", "approvalStatus", "approvedBy", "approvedAt") FROM stdin;
77c6826c-6824-4d6d-93c0-61368058d147	1367649b-c987-4f88-9ab8-2f5bdfcbe0f9	1	طراحی سایت	BEFORE	\N	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	2026-10-13 07:14:54.242	\N	APPROVED	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	2026-10-16 08:48:09.765
abeb98a8-8588-421d-87da-6231c2749a56	1367649b-c987-4f88-9ab8-2f5bdfcbe0f9	2	<p style="text-align: right;">تحلیل فایل مالی برای کسب و کار های نو پا -</p><p style="text-align: right;">طراحی پلن های جذب سرمایه برای صندوق های مالی</p>	BEFORE	\N	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	2026-10-13 19:31:07.61	\N	APPROVED	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	2026-10-16 08:48:11.281
bb99826e-a128-4da3-ab71-3c2aa830c3d1	166286b5-2617-4da7-b6c7-902002fee60b	1	<p style="text-align: right;">تحلیل فایل مالی برای کسب و کار های نو پا -</p><p style="text-align: right;">طراحی پلن های جذب سرمایه برای صندوق های مالی</p>	AFTER	\N	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	2026-10-13 19:31:34.637	\N	APPROVED	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	2026-10-16 08:48:12.415
7cd2058a-0da9-4d1e-9cb0-659475bf6523	24e4fe21-dad3-4dec-8fe3-c21e2b0a3b6d	1	<p style="text-align: right;">در نهامین پردازان آسیا، فرایند تحویل نرم‌افزار به مشتری 10 روز کاری زمان می‌برد، این زمان رو به 10 دقیقه تقلیل دادم. فقط با آموزش دیدنِ یکی از نیروهای شرکت توسط فرد صادر کننده‌ی نرم‌افزار. بهبود دادن فرایندهای بروکراتیک و گاها غیرارادی در سازمان ها یکی از مهمترین کارهایی هست که انجام میدم. شما چه فرایندهای زمانگیری تو سازمانتون دارین!؟</p>	BEFORE	\N	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	2026-10-21 07:25:13.523	\N	PENDING	\N	\N
61a6073e-83e6-415d-a4a5-1a075f559fbe	9d4434bf-e71b-4d8d-a770-4c2b8e33eec4	1	["کدنویسی و فنی","تحلیل و مدیریت"]	BEFORE	\N	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	2026-10-11 17:03:09.912	\N	APPROVED	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	2026-10-12 15:18:32.257
1c5a0d97-1db6-4338-8f41-922761d4d106	355c5b85-690a-4a5c-9042-6c573120841f	1	تحلیل داده	BEFORE	\N	2cd4df68-138c-4d6d-9f52-3eda8f3eca49	2026-10-12 20:19:58.337	\N	APPROVED	d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	2026-10-13 19:20:22.8
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
608218bd-a431-47ab-abdd-56323ac25c44	c41544a9-9932-4ddc-8e3d-170652b7ecb0	کنوا	2026-10-14 09:50:33.827
74293f83-f62b-4b57-a279-9f2a7a3e39df	c41544a9-9932-4ddc-8e3d-170652b7ecb0	پایتون	2026-10-14 09:50:33.847
00a66fe7-2bf7-4b6d-940f-9016e5b11d2d	c41544a9-9932-4ddc-8e3d-170652b7ecb0	پاورپوینت	2026-10-14 09:50:33.857
157a54c6-fb9c-4543-9755-1dafb760953d	c41544a9-9932-4ddc-8e3d-170652b7ecb0	ورد	2026-10-14 09:50:33.871
8147dba2-2aec-4405-850f-cc3d6ed5279f	c41544a9-9932-4ddc-8e3d-170652b7ecb0	زبان انگلیسی	2026-10-14 09:50:33.885
d8997465-0635-45f6-9f45-b66877e4cf4a	51c2ad4e-b0d4-41aa-834c-83933510bb31	AutoCad	2026-10-16 08:42:47.892
4373a550-27ae-4919-a284-f8cd5aae0ad7	51c2ad4e-b0d4-41aa-834c-83933510bb31	MSProject	2026-10-16 08:42:47.938
59f08bfc-eaba-425f-a5fc-54da9c146705	51c2ad4e-b0d4-41aa-834c-83933510bb31	excel	2026-10-16 08:42:47.945
477da9e3-c557-4560-b5a5-73a969c55b18	51c2ad4e-b0d4-41aa-834c-83933510bb31	nodeJs	2026-10-16 08:42:47.952
2e89b8fe-0f4c-43c7-8272-472de47bb944	51c2ad4e-b0d4-41aa-834c-83933510bb31	python	2026-10-16 08:42:47.96
84a13fda-006d-4bd9-95c2-9c0d1446c487	51c2ad4e-b0d4-41aa-834c-83933510bb31	react	2026-10-16 08:42:47.968
a9e4e0fa-6232-4392-b088-6356e48410bd	51c2ad4e-b0d4-41aa-834c-83933510bb31	saas	2026-10-16 08:42:47.971
b9ac4b2b-82a9-48cb-b5e7-3a460517ac64	51c2ad4e-b0d4-41aa-834c-83933510bb31	vite	2026-10-16 08:42:47.981
61257aad-4cee-47d6-b2e1-2b85f85759b5	2de6b8d2-37fa-488d-8842-9ddba186945b	ICDL, زبان انگلیسی	2026-10-17 19:23:46.871
9414255c-cc7b-4297-b068-84a557b92e5e	c41544a9-9932-4ddc-8e3d-170652b7ecb0	اتوکد	2026-10-18 17:15:12.016
0939245a-f458-44ba-a9f6-e89c90682a86	c41544a9-9932-4ddc-8e3d-170652b7ecb0	تری دی مکس	2026-10-18 17:15:17.685
6384b523-9b1c-4330-83bd-e2b0d7ddecbb	c41544a9-9932-4ddc-8e3d-170652b7ecb0	کامفی یوآِی	2026-10-18 17:15:27.968
63901222-8d99-4c7c-b0a7-0ccf1d22bfd1	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	مدیریت ریسک	2026-10-19 16:04:22.348
c3057203-885c-48ef-bd87-75769742a09b	d561fd2e-bce0-46ea-aa68-e3f3ef548c58	تحلیل صورت های مالی	2026-10-19 16:04:43.313
edc228a4-5f37-4de6-b97c-8dd2f0eeaf42	d22d4504-da4a-43c6-83f1-7ea128731df0	درمان اعتیاد	2026-10-26 02:56:56.897
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
52406f7b-ffdc-46ce-ba99-60c593a9e4a6	d244d6b2-2a4b-4608-ac72-b4ed6756ce41	\N	ENDORSE	2026-10-13 11:37:23.097
17aeda3c-051c-4ba9-9b13-a262178db0de	7d4558da-ddf0-4788-ad73-37e204b3fdfd	\N	ENDORSE	2026-10-14 09:50:13.236
8c424e90-3b73-4956-a36c-6ca5a3eb2397	608218bd-a431-47ab-abdd-56323ac25c44	\N	ENDORSE	2026-10-14 09:50:33.845
71e40551-360e-450b-a938-343905166861	74293f83-f62b-4b57-a279-9f2a7a3e39df	\N	ENDORSE	2026-10-14 09:50:33.85
050519b4-9d02-4a36-a900-8f0f78d970e6	00a66fe7-2bf7-4b6d-940f-9016e5b11d2d	\N	ENDORSE	2026-10-14 09:50:33.862
b6471eaa-937c-4e89-8cf6-4700f9b7f6f2	157a54c6-fb9c-4543-9755-1dafb760953d	\N	ENDORSE	2026-10-14 09:50:33.874
0052b06a-5642-49e8-abb5-56e2285b0791	8147dba2-2aec-4405-850f-cc3d6ed5279f	\N	ENDORSE	2026-10-14 09:50:33.889
936a1aaa-dcde-400b-b663-cb7221594955	7d4558da-ddf0-4788-ad73-37e204b3fdfd	\N	ENDORSE	2026-10-14 09:50:33.894
6460713f-347b-4293-8422-8dcbf848fb5d	e42ecf80-5cd3-4b44-8b06-422c79aff28c	\N	ENDORSE	2026-10-14 10:22:55.014
d6dba306-203d-42bb-8ecf-043d62ee991f	38ff2676-8532-4f4b-aff2-d7f72088cb7a	\N	ENDORSE	2026-10-14 10:22:55.441
ae7c0634-26b5-4e5e-856e-1ad5a63211df	b4b69f1d-183e-4c07-b79f-30c4ae62233c	\N	ENDORSE	2026-10-14 10:22:56.414
ee1e1c1c-f025-436d-ac6b-3efd70856883	f4f89261-aa48-4920-8d58-343459da68f0	\N	ENDORSE	2026-10-14 10:22:56.443
d6576a6f-1e12-49df-948a-2a32537d0448	a8909e59-0ca2-43a9-816b-9cd709281d9a	\N	ENDORSE	2026-10-14 10:22:56.61
5d25b05e-43ee-4fdf-9794-6ebbde7568dc	f72e6f8a-31b9-41ef-a207-c585c05e0754	\N	ENDORSE	2026-10-14 10:22:57.061
81921e82-01a4-4bd2-a00f-b772bb0a75ca	5d4f1d2b-98a4-457d-a775-2c53574aaa1f	\N	ENDORSE	2026-10-14 10:22:58.977
edfaaced-2d57-4bf2-b06e-2a74ce2c0281	512c208f-b699-409e-88b4-6509919b5e57	\N	ENDORSE	2026-10-14 10:22:59.328
f502ceb9-78b1-42bb-b73b-61cda9e3406b	29f2b5af-491a-4612-89cd-bfbe27b0523e	\N	ENDORSE	2026-10-14 10:23:00.386
3ff49e49-80ce-45f6-aa57-06bf5d9d5069	b3aca0ae-a6d1-4a8e-a95c-754f0a8f4420	\N	ENDORSE	2026-10-14 10:23:00.807
2c3a4e9a-f484-4152-b4ed-2516d7aa35e3	3369d43c-1837-49c4-9bbb-3eaf8c9e1381	\N	ENDORSE	2026-10-14 10:23:01.226
a7701ce6-f86f-4588-85d5-5e938db56540	bf0107af-f743-4311-b5ef-f36df47ad841	\N	ENDORSE	2026-10-14 10:23:02.722
cadc5e4c-c828-4b0d-9b3d-47cc7f2d0bd3	e788dd15-4735-4561-825c-4474127b0d70	\N	ENDORSE	2026-10-14 17:29:10.499
4521adb2-2146-42dd-80ef-23ce8ad7d3ef	c32269c6-c94c-4717-9ea7-eb596d2e428c	\N	ENDORSE	2026-10-14 17:29:12.739
5f407e4a-4963-45d9-911f-3889204f618e	d244d6b2-2a4b-4608-ac72-b4ed6756ce41	\N	ENDORSE	2026-10-14 17:29:13.615
edd075cd-dadf-4c2b-9f4d-e72c7ce5d6b9	bf6dad9a-d4d2-4a3e-936a-0dbb0e7eb466	\N	ENDORSE	2026-10-14 17:29:14.459
cc058737-6403-40ca-a3e1-27bf9b09ebe2	e42ecf80-5cd3-4b44-8b06-422c79aff28c	\N	ENDORSE	2026-10-16 08:26:58.15
93646679-ac44-4f76-8d81-347dc51ba60f	b4b69f1d-183e-4c07-b79f-30c4ae62233c	\N	ENDORSE	2026-10-16 08:26:58.586
aa466d07-19a7-46c1-8f83-66dc95a1af9e	38ff2676-8532-4f4b-aff2-d7f72088cb7a	\N	ENDORSE	2026-10-16 08:26:59.706
7a92c23a-813d-43f0-8cf0-555db996870c	a8909e59-0ca2-43a9-816b-9cd709281d9a	\N	ENDORSE	2026-10-16 08:27:00.569
b14ac2f4-0651-40aa-9ab3-2581761e2bdc	f4f89261-aa48-4920-8d58-343459da68f0	\N	ENDORSE	2026-10-16 08:27:01.672
113e8ee9-9a15-4db6-8cbf-12224abf7c09	f72e6f8a-31b9-41ef-a207-c585c05e0754	\N	ENDORSE	2026-10-16 08:27:03.145
5c6af920-c6e2-479b-839a-f940bb919abf	5d4f1d2b-98a4-457d-a775-2c53574aaa1f	\N	ENDORSE	2026-10-16 08:27:05.007
9acc67d6-000a-4b2c-b6ef-b0e066b5daf0	29f2b5af-491a-4612-89cd-bfbe27b0523e	\N	ENDORSE	2026-10-16 08:27:08.28
72bcdaf2-1362-4e71-b727-4cbcc76dcb75	c32269c6-c94c-4717-9ea7-eb596d2e428c	\N	ENDORSE	2026-10-16 08:29:34.154
162ec5e5-16ae-4bff-b728-61e8d250f003	d244d6b2-2a4b-4608-ac72-b4ed6756ce41	\N	ENDORSE	2026-10-16 08:29:34.866
e8183149-0103-40c2-ac00-cb69e3d6790a	bf6dad9a-d4d2-4a3e-936a-0dbb0e7eb466	\N	ENDORSE	2026-10-16 08:29:35.643
ba3b27e3-eb6d-43de-a47b-136944d7110d	e788dd15-4735-4561-825c-4474127b0d70	\N	ENDORSE	2026-10-16 08:29:33.386
f9f185ba-034b-4769-b71a-cc8e4c048868	d8997465-0635-45f6-9f45-b66877e4cf4a	\N	ENDORSE	2026-10-16 08:42:47.899
3430e344-833e-41e2-900c-0d3f5451eb7d	4373a550-27ae-4919-a284-f8cd5aae0ad7	\N	ENDORSE	2026-10-16 08:42:47.943
0ba9cc72-32fc-4a0b-81ce-91c8e9cf2120	59f08bfc-eaba-425f-a5fc-54da9c146705	\N	ENDORSE	2026-10-16 08:42:47.95
35852f92-82fa-4a8f-9818-99c4b1be3eaa	477da9e3-c557-4560-b5a5-73a969c55b18	\N	ENDORSE	2026-10-16 08:42:47.954
897fa816-6748-4460-8eb7-91d945796f09	2e89b8fe-0f4c-43c7-8272-472de47bb944	\N	ENDORSE	2026-10-16 08:42:47.966
eba67fa2-08c1-4f04-9e93-73190d3522de	84a13fda-006d-4bd9-95c2-9c0d1446c487	\N	ENDORSE	2026-10-16 08:42:47.97
a7605de9-0f86-40c0-bf66-956640d91643	a9e4e0fa-6232-4392-b088-6356e48410bd	\N	ENDORSE	2026-10-16 08:42:47.974
ef9f0e57-8567-4073-8809-5472735bdca2	b9ac4b2b-82a9-48cb-b5e7-3a460517ac64	\N	ENDORSE	2026-10-16 08:42:47.984
96015c28-3ad4-4420-85c2-9041a4706570	92ae8a4e-f6ad-4644-b086-b236d7fe6421	\N	ENDORSE	2026-10-19 18:15:39.391
e0a21305-46b4-4d46-ae50-d8830c97badc	1600b9dd-ff41-4a1d-9b5f-dac35bccc2f8	\N	ENDORSE	2026-10-19 18:15:39.431
0b9e48a1-5ccb-4b3b-844b-241f4e1829c4	63901222-8d99-4c7c-b0a7-0ccf1d22bfd1	\N	ENDORSE	2026-10-19 18:15:41.614
26ec6f6a-7630-48a7-9726-c14dd9efd748	c3057203-885c-48ef-bd87-75769742a09b	\N	ENDORSE	2026-10-19 18:15:44.929
09fe3813-3685-4b4a-9522-284ed58870b8	e788dd15-4735-4561-825c-4474127b0d70	\N	ENDORSE	2026-10-19 18:28:36.51
7aa37493-1024-4cbd-96fb-c973d842e3ce	c32269c6-c94c-4717-9ea7-eb596d2e428c	\N	REJECT	2026-10-19 18:28:43.458
09f2a8d2-cdb9-47dc-a311-b144cd217e35	d244d6b2-2a4b-4608-ac72-b4ed6756ce41	\N	ENDORSE	2026-10-19 18:28:45.019
70f378c5-288f-4c0b-af5a-18b491529761	bf6dad9a-d4d2-4a3e-936a-0dbb0e7eb466	\N	REJECT	2026-10-19 18:28:46.162
\.


--
-- Data for Name: Sponsor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Sponsor" (id, slug, name, tagline, "slideType", "slideMediaUrl", placement, "order", "isActive", "externalLinkLabel", "externalLinkUrl", "coverImageUrl", "fullDescription", "websiteUrl", "instagramUrl", "linkedinUrl", "telegramUrl", "createdAt", "updatedAt", "clickCount", "viewCount") FROM stdin;
cmvht0tz80002ho46gyhjucdu	sponsors-1	فرصتی برای دیده‌شدن برند شما	\N	IMAGE	https://pbfestival.ir/uploads/246b870e-02da-4047-ac8c-7d9f9716a94d.png	DASHBOARD	1	t	\N	\N	https://pbfestival.ir/uploads/110f9c00-3259-427c-a552-ef24e4dd953f.png	فرصتی برای دیده‌شدن برند شما\nبا حمایت از جشنواره برند شخصی، نام و پیام برندتان را در کنار جمعی از علاقه‌مندان و فعالان این حوزه مطرح کنید. با حضور به‌عنوان حامی یا اسپانسر، از فرصتی ارزشمند برای معرفی کسب‌وکار خود و همراهی با رویدادی الهام‌بخش بهره‌مند شوید.\n\nبرای دریافت اطلاعات بیشتر درباره شرایط همکاری و اسپانسری، لطفاً به پشتیبانی پیام دهید.	\N	\N	\N	\N	2026-10-21 07:42:15.236	2026-10-21 10:24:19.498	0	0
cmvhs84uw0000ho46qn1m4ywp	sponsors-2	فرصتی برای دیده‌شدن برند شما	\N	IMAGE	https://pbfestival.ir/uploads/72fd3df5-ac54-4ba4-aced-032a29341d98.png	LANDING_HERO	0	t	\N	\N	https://pbfestival.ir/uploads/2e976277-b1a8-40fc-82e5-51679bb7a84e.png	فرصتی برای دیده‌شدن برند شما\nبا حمایت از جشنواره برند شخصی، نام و پیام برندتان را در کنار جمعی از علاقه‌مندان و فعالان این حوزه مطرح کنید. با حضور به‌عنوان حامی یا اسپانسر، از فرصتی ارزشمند برای معرفی کسب‌وکار خود و همراهی با رویدادی الهام‌بخش بهره‌مند شوید.\n\nبرای دریافت اطلاعات بیشتر درباره شرایط همکاری و اسپانسری، لطفاً به پشتیبانی پیام دهید.	\N	\N	\N	\N	2026-10-21 07:19:56.311	2026-10-21 10:25:20.308	0	0
cmvht28130003ho46yqefhqrb	sponsors-3	فرصتی برای دیده‌شدن برند شما	\N	IMAGE	https://pbfestival.ir/uploads/ce2a0965-504e-41d6-9157-2a7482fe2ffc.png	LANDING_VERTICAL	2	t	\N	\N	https://pbfestival.ir/uploads/2c10418d-50f6-42b0-8c0a-09829a423372.png	فرصتی برای دیده‌شدن برند شما\nبا حمایت از جشنواره برند شخصی، نام و پیام برندتان را در کنار جمعی از علاقه‌مندان و فعالان این حوزه مطرح کنید. با حضور به‌عنوان حامی یا اسپانسر، از فرصتی ارزشمند برای معرفی کسب‌وکار خود و همراهی با رویدادی الهام‌بخش بهره‌مند شوید.\n\nبرای دریافت اطلاعات بیشتر درباره شرایط همکاری و اسپانسری، لطفاً به پشتیبانی پیام دهید.	\N	\N	\N	\N	2026-10-21 07:43:20.083	2026-10-26 11:29:45.723	1	0
\.


--
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Task" (id, "bootcampId", title, description) FROM stdin;
6f829fe2-da0f-4117-aeb8-4c94e1e4ac73	0c753d22-b105-458e-b5eb-0e97105dad14	test	\N
7bc446a6-2472-4c14-8b03-aa6f5017c336	8043d09c-26e3-44a1-a1aa-74a995c6da83	تمرین معرفی 30 ثانیه 	سلام و وقت بخیر به همگی دوستان عزیز تبریک می‌گویم! تا اینجای با مفاهیم اولیه پرسونال برندینگ آشنا شدیم و به تفاوت‌های ادعا و شواهد پی بردیم حالا وقت آن رسیده که آموخته‌هایتان را در عمل پیاده کنیم و یاد بگیریم خودمون رو معرفی کنیم به همین خاطر قبل از وبینار سوم تمرین معرفی ۳۰ ثانیه ای داریم به صورت تصویری یا صوتی خودتون رو در ۳۰ ثانیه معرفی کنید و در سایت قرار بدید
\.


--
-- Data for Name: TaskSubmission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TaskSubmission" (id, "taskId", "participantId", content, "createdAt", "approvalStatus", "approvedBy", "approvedAt", score) FROM stdin;
\.


--
-- Data for Name: Ticket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ticket" (id, "userId", subject, status, "createdAt", "updatedAt") FROM stdin;
39607bba-cc81-41b1-9b06-47a29ae9636a	e7573aa6-efb7-4d09-8690-92ea0bd5786f	تست تیکت	OPEN	2026-10-20 11:34:00.253	2026-10-20 11:34:29.227
\.


--
-- Data for Name: TicketMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TicketMessage" (id, "ticketId", "senderId", "senderRole", message, "createdAt") FROM stdin;
c570ecc8-4fc4-46b9-90ff-c6ba4e877e92	39607bba-cc81-41b1-9b06-47a29ae9636a	e7573aa6-efb7-4d09-8690-92ea0bd5786f	USER	تست	2026-10-20 11:34:00.253
e5d1e0e9-a041-4b04-b81c-14f0d1cd73ee	39607bba-cc81-41b1-9b06-47a29ae9636a	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	ADMIN	باشه تست	2026-10-20 11:34:26.268
e047a0d8-ade3-4242-8cf5-bc45bb436b6a	39607bba-cc81-41b1-9b06-47a29ae9636a	b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	ADMIN	باشه تست	2026-10-20 11:34:29.224
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

COPY public."User" (id, email, "passwordHash", role, "createdAt", "updatedAt", "emailVerified", phone, "phoneVerified", "passwordResetCodeHash", "passwordResetExpiresAt", "isBlocked") FROM stdin;
369bfe81-8808-4dcc-b95a-3b3e853093bc	nilufar.ataeiyan@gmail.com	$2b$12$0pLjL5P7qlhycY3qx.bkYefvwPUYTPI0gB705QbMmkBhBZAlNMTvy	PARTICIPANT	2026-09-25 12:50:27.362	2026-09-25 13:58:17.498	t	\N	f	\N	\N	f
320ef40a-48b5-4a51-badb-18f84eb0057f	defantuv2@gmail.com	$2b$12$MSk1eJ5JiD6SLhFjm5hate.coX2WbgdKCHwQUElEmvGcvVTGAN8AG	ADMIN	2026-09-25 15:14:56.038	2026-09-25 15:23:44.235	t	\N	f	\N	\N	f
fd7ef889-bafb-4a6b-8bcf-e0527425a4b2	najme2185@gmail.com	$2b$12$rwXS/JUFfUvmpmELm0ZzleBW19eFKhqLkPyARhz1gp7zkaaA/uNDi	PARTICIPANT	2026-10-11 10:25:56.158	2026-10-11 10:26:48.891	t	\N	f	\N	\N	f
2cd4df68-138c-4d6d-9f52-3eda8f3eca49	yasern.business@gmail.com	$2b$12$vQQhtaY/ThSzLV1NnLDgWuXNzsoCRmphXdjvoNttwXLfHJRbj2T5W	ADMIN	2026-09-30 07:26:27.723	2026-09-30 10:07:11.922	t	\N	f	\N	\N	f
7c8e96ca-9eeb-442e-94f5-2679e226493c	rahimgholami1998@gmail.com	$2b$12$EbP8QcB1Dbd2mtaenq4DGOtOxI8RH.nzkFWtiBAbUEHpDOryQQXAK	ADMIN	2026-09-25 19:02:30.04	2026-10-09 16:59:26.464	t	\N	f	\N	\N	f
61deccf7-d89b-48c9-bef7-1c164bf76a5b	Asiyehfarvardin@gmail.com	$2b$12$D59oC/ez/gpzGF8VtmdqSuNnNIzv3Z0IW0ZA7uMSxE7M/d7PsEewW	PARTICIPANT	2026-10-10 04:17:57.956	2026-10-10 04:17:57.956	f	\N	f	\N	\N	f
e4a74b08-de5b-47d0-90c3-d58f4bad33a0	Akeb.tertiary.iran@gmail.com	$2b$12$5ApFj0ZtK1zfo/c1EYi8fuJvTy0Yt/4ox6cBLCZDVZSRqFu5EMRPy	PARTICIPANT	2026-10-10 04:26:56.679	2026-10-10 04:27:26.302	t	\N	f	\N	\N	f
19be1b9e-7d5b-4482-8a06-f4776a34708f	atefeh1995atefeh@gmail.com	$2b$12$agQPm0A/LcP6mt1ScfNvo.PeODmerEBNzZNvnVTlSVWtdlheqZXwK	PARTICIPANT	2026-10-13 06:14:17.184	2026-10-13 06:14:38.621	t	\N	f	\N	\N	f
888c5b03-edf2-484d-aeee-f256da1d4669	kardan.raziehrk@gmail.com	$2b$12$C4sqCTRxDnuiU4yKVJDile6w9UaJAZC3OuHKEGWvqHN7IAJyk7G5i	PARTICIPANT	2026-10-13 11:32:24.521	2026-10-13 17:53:19.817	t	\N	f	\N	\N	f
c66be053-b333-4f81-bb36-8692bcf45240	miladfotouhi2007@gmail.com	$2b$12$PLIKdPA85WVvr7OEfy1nTeL0BkQHTPJKCbk5RkjzQqRHhBUNIdVnu	PARTICIPANT	2026-10-18 11:24:12.349	2026-10-18 11:24:43.046	t	\N	f	\N	\N	f
b5ebe5c2-35ac-4943-81dd-f4253d3d56c7	nooreddin.hoveida@gmail.com	$2b$12$PIh.WpI/bRew89CM7MR3Ueds6JN1vj6rw79wGYjAUxIdgZBxzLxLa	ADMIN	2026-09-25 12:39:25.78	2026-10-12 14:01:53.767	t	\N	f	\N	\N	f
d03c10f2-ebf1-4cd1-a82f-1f391b4e5a2d	nooroddin.hoveida@gmail.com	$2b$12$O8IMU7K4x9Z69sKlOtqZ5uP0XE2r04NlcZ2FUX5neFDhGm1XoaFyi	PARTICIPANT	2026-10-11 10:20:59.683	2026-10-19 05:33:49.332	t	\N	f	\N	\N	t
e7573aa6-efb7-4d09-8690-92ea0bd5786f	nouroddin.hoveida@gmail.com	$2b$12$9yaqK30q600xlQdN9ZKWi.0xz2rQVgCWf49PzQiI0TQI2XIZxJJlS	PARTICIPANT	2026-10-17 05:33:39.064	2026-10-19 05:33:54.351	t	\N	f	\N	\N	t
b06f3ac5-8e14-4d0d-8a46-158d2a197b59	akeb.secondary.iran@gmail.com	$2b$12$ZpPWDPjFVAf7dNbyxlHilO2fcPN6Szu1QJvn2oGiHiRsPjrp5oIVy	PARTICIPANT	2026-10-13 09:32:16.907	2026-10-16 11:06:08.732	t	\N	f	\N	\N	f
085b6fc8-92c2-480b-b62f-d5b30db8b986	rojanmahmoudi2477@gmail.com	$2b$12$D2glsrg0JH9aI4BZ4LA1Auei2l44ddFl9sJNIkvst1ha79WS6buUW	PARTICIPANT	2026-10-17 07:18:13.335	2026-10-17 07:19:16.553	t	\N	f	\N	\N	f
74a58f55-f672-402f-accb-1fb932fbf2f7	mobinmirshahi@gmail.com	$2b$12$BIg3ckx0H9cT8fpwYaLPjOr.3F5qsvEManyvTV.m8clUuePS4Pf.y	ADMIN	2026-10-17 19:19:43.639	2026-10-19 08:29:29.456	t	\N	f	\N	\N	f
97328cf8-3568-4495-a8c8-fb31d97ff017	nasery2000@gmail.com	$2b$12$ioItcbwk/GuyL97nqCcsl.t9umgkwahk.6OauqLAzh140nYwL.VH.	PARTICIPANT	2026-10-19 17:37:56.896	2026-10-19 17:38:43.332	t	\N	f	\N	\N	f
ac37c689-62d4-48c2-9414-db44ab5c575e	davoudim9y@gmail.com	$2b$12$kv9VaYIpE/inrdNB2wOep.eVnjq66084Va9CzbqruujC.yQcGAwcu	PARTICIPANT	2026-10-19 18:34:21.155	2026-10-19 18:34:21.155	f	\N	f	\N	\N	f
d0d2e079-7ef8-4569-9dc8-22c16b8048ee	ehsanismaily1377@gmail.com	$2b$12$y7gmuiUYMrVgaJpueJKlAeqF/EkSlanLuoXqQqHQ.aEUwdLiWhbG.	PARTICIPANT	2026-10-17 18:05:21.05	2026-10-17 18:06:07.426	t	\N	f	\N	\N	f
5ef7cef4-a0ea-4dc0-a7ac-2a025323baaf	davoudim96@gmail.com	$2b$12$QHrMaRypxFVfB65gGxefhOzr.vMy5TMlFP2/uNjp1gZsl5MTSdvNm	PARTICIPANT	2026-10-19 18:35:02.563	2026-10-19 18:37:16.613	t	\N	f	\N	\N	f
6348c3b9-944e-42ed-8c51-9ccc0b864bc5	shrmhm1382@gmail.com	$2b$12$kpybYVoqm7wPGDW/job78e.g786J3o3AcEQwTZjCdw1weZD6bBx8K	PARTICIPANT	2026-10-17 21:13:50.178	2026-10-17 21:14:27.635	t	\N	f	\N	\N	f
a01ae82f-2df3-462d-9e3d-c4b07e781343	Mobinmb13771994@gmail.com	$2b$12$UuzLT9ij0RXDjVpa/PMIxO6Nf80ixHiMhEzFvIjtU.OP7i.2uiU12	ADMIN	2026-09-25 17:48:40.959	2026-10-18 05:36:00.911	t	\N	f	\N	\N	f
ee49f63f-9e8d-406d-a4ef-a0a471a51861	mobinmb13771994@gmail.com	$2b$12$PXfh7TAcf/.DWLDk9dAudeNEt1CMlxi5.2JR40ehUTDtjLWYmUwSy	ADMIN	2026-10-09 16:50:10.234	2026-10-18 05:36:10.035	t	\N	f	\N	\N	f
ae0abc8d-8a57-4c80-8fd8-967f4badce6d	hmamirhossein34@gmail.com	$2b$12$kauuPe3k6R6CN2paOf6R0uuAlNEmwjfzLtWqC3xSeE/bxedNDhrCq	PARTICIPANT	2026-10-20 21:39:55.01	2026-10-20 21:42:02.681	t	\N	f	\N	\N	f
f69430dc-a828-47f1-8eb6-d7a1c7a49624	ebnkhaldoon732@gmail.com	$2b$12$sjkY/posxBJ5li1B9Vvw0eXl2u1Wf/V85nf1ru7T5OmVUaERJTIai	PARTICIPANT	2026-10-21 10:51:50.286	2026-10-21 10:54:52.545	t	\N	f	\N	\N	f
62f57c70-9140-43d9-8cf4-52111f8fd3ef	afsanezhmati815@gmail.com	$2b$12$2c5b2gTiuGG2RhwiIOHJwuHwKUtV.8E09.LygRICX9YoEZ.RoDwDq	PARTICIPANT	2026-10-21 18:34:59.57	2026-10-21 18:35:23.939	t	\N	f	\N	\N	f
ce58c88e-f936-4852-9989-b0d0616d6dbe	alimohammadpour1996@yahoo.com	$2b$12$kUk/FHr3aqyuSKHmNBTDyub/Gp7b27tDjBOcYSrBYwEfj8QmsMJ0y	PARTICIPANT	2026-10-26 12:05:22.358	2026-10-26 12:05:22.358	f	\N	f	\N	\N	f
7875013a-0534-4a50-89ec-06e29b8a5d18	masoudtv77@gmail.com	$2b$12$KqFWgazgxW0q5NO3j17I7ukVINXb3grIbJeqdtxAehOpWTMxbk.aO	PARTICIPANT	2026-10-25 18:52:39.629	2026-10-26 02:51:35.612	t	\N	f	\N	\N	f
2b429b56-84fb-4885-8769-7ab7b4d1987a	nuoroddin.hoveida@gmail.com	$2b$10$MnK23H2ZbiCGcg30lOfc1.Ifri9D4glJ58GAGqE6pX1FpiA7QCH72	PARTICIPANT	2026-10-26 05:05:55.859	2026-10-26 05:06:20.507	t	\N	f	\N	\N	f
03b5a7ff-a1e8-45b7-b569-0a56f301b283	e_negari@yahoo.com	$2b$10$UfE/UjaQwbF3O8fvJiWCuuP1dttlJ6LR6IIwAXgyW2UvFRNrcHg.G	PARTICIPANT	2026-10-26 09:23:33.015	2026-10-26 09:25:42.209	t	\N	f	\N	\N	f
e4cb6fba-7c40-46ae-b04c-766041ec41e0	alimohammadpour.iut.1996@gmail.com	$2b$10$LSMDYaxHr2gqHusS/LCnreYbgoiWg496TQA4xU.1YzqmIG/adDmjy	PARTICIPANT	2026-10-26 12:20:04.967	2026-10-26 12:23:11.938	t	\N	f	c3079e08bcdf8f674ff18cddd45042f13dc9e44565486298ec59b1cb3c769c8d	2026-10-26 12:38:11.935	f
eb92d219-b3d2-4b16-b93e-b9cd5671991b	golnazmirshahi8277@gmail.com	$2b$10$VO2OObCCS/9/KDdXKYh.b.UmyX3WEARcUJDdQsguB9T8JuXKta4Zy	PARTICIPANT	2026-10-26 13:33:33.096	2026-10-26 13:34:49.685	t	\N	f	\N	\N	f
\.


--
-- Data for Name: WeeklyChallenge; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WeeklyChallenge" (id, title, description, "instructorName", "instructorEmail", "opensAt", deadline, "isActive", "createdByUserId", "createdAt") FROM stdin;
6fd47bba-afbf-427d-bba5-2ced9c7895b4	ماموریت اول : رزومه بدون رزومه	یک رزومه برای خودت بنویس،\nاما هیچ‌کدام از اطلاعات معمول رزومه را استفاده نکن.\n\nاز مطالب زیر نباید استفاده کنی:\n\n❌ رشته\n❌ دانشگاه\n❌ معدل\n❌ سابقه کار\n،\nفقط از اینها استفاده کن:\n\n۳ چیزی که به آنها اهمیت می‌دهم\n\n۳ چیزی که در آن خوبم\n\n۲ چیزی که باید در خودم بهتر کنم\n\n۱ چیزی که به خاطرش ( یا دوست دارم به خاطرش شوم ) شناخته میشوم\n\nسوال نهایی:\n«آیا این رزومه، بیشتر تو را نشان می‌دهد یا رزومه واقعی‌ات؟»			\N	\N	t	a01ae82f-2df3-462d-9e3d-c4b07e781343	2026-10-10 14:21:08.258
ec82a9d3-4b57-4e52-99b8-e13fe45ea171	مأموریت ۱: کشف دارایی متمایزکننده	«من که هستم و چه کاری را بهتر از همه انجام می‌دهم؟»\n\n«در چه کاری دیگران همیشه سراغ تو میان یا ازت کمک می‌خوان؟» (مثلاً عیب‌یابی ماشین، آرام‌کردن جمع، طراحی، کار با اکسل).«یک نمونه واقعی از کاری که انجام دادی و به خودت افتخار کردی چی بود؟» (حتی پروژه‌های دانشگاهی، کارهای داوطلبانه جماعتی یا یک حل اختلاف ساده).   «چه ارزشی در کار یا زندگیت خط قرمز توئه؟» (مثل خوش‌قولی، دقت وسواسی، شفافیت مالی، صداقت).			\N	1405-07-15 00:00:00	f	320ef40a-48b5-4a51-badb-18f84eb0057f	2026-09-25 15:49:44.703
c2c3fbfa-a16d-4716-8d78-1203f26abe03	ماموریت دوم	<p style="text-align: right;">در وبینار دیدیم که ادعا هزینه‌ای ندارد، اما شاهد دارد. در این تمرین سه ادعا دربارهٔ خودتان را کنار قوی‌ترین شاهدی که همین حالا دارید قرار می‌دهید و می‌بینید هر ادعا روی کدام پله ایستاده است. هدف تمرین قضاوت دربارهٔ شما نیست. هدف این است که ببینید چه چیزی ثبت شده و چه چیزی هنوز ثبت نشده.</p><p style="text-align: right;"><br></p><p style="text-align: right;">راهنمای تکمیل</p><p style="text-align: right;">برای هر کدام از سه ادعا، فرم زیر را پر کنید:</p><p style="text-align: right;"><br></p><p style="text-align: right;">۱. ادعا: چه می‌گویم؟</p><p style="text-align: right;">یک جملهٔ کوتاه دربارهٔ توانایی یا ویژگی خودتان بنویسید که واقعاً به آن باور دارید.</p><p style="text-align: right;">مثال: «دقت تحلیلی دارم.»</p><p style="text-align: right;"><br></p><p style="text-align: right;">۲. شاهد اصلی</p><p style="text-align: right;">قوی‌ترین چیزی را بنویسید که اگر فردا شما نباشید هنوز وجود دارد و دیگری می‌تواند آن را ببیند: گزارش، فایل، عدد مستند، توصیه‌نامه، پروژه.</p><p style="text-align: right;">مثال: «گزارش کامل پروژهٔ بهینه‌سازی خط تولید و عدد مستند ۱۲٪ کاهش ضایعات.»</p><p style="text-align: right;"><br></p><p style="text-align: right;">۳. پلهٔ شاهد (یک گزینه را انتخاب کنید)</p><p style="text-align: right;">۱ — حرف خودم</p><p style="text-align: right;">۲ — مدرک و گواهی</p><p style="text-align: right;">۳ — مصنوع قابل دیدن (گزارش، کد، طرح، فایل خام)</p><p style="text-align: right;">۴ — شهادت شخص ثالث معتبر</p><p style="text-align: right;">۵ — عدد قابل راستی‌آزمایی با تأیید</p><p style="text-align: right;"><br></p><p style="text-align: right;">۴. سه فیلتر</p><p style="text-align: right;">شاهدتان را با این سه پرسش بسنجید و هر کدام را که رد نشد علامت بزنید:</p><p style="text-align: right;">☐ مشاهده‌پذیر است؛ بیرون از ذهن من وجود دارد و می‌شود بازش کرد و دیدش.</p><p style="text-align: right;">☐ راستی‌آزماشدنی است؛ اگر کسی بخواهد چک کند، مسیر و تأییدکننده‌اش مشخص است.</p><p style="text-align: right;">☐ مرتبط است؛ دقیقاً همین ادعا را ثابت می‌کند، نه ادعای دیگری را.</p><p style="text-align: right;"><br></p><p style="text-align: right;">۵. محل نگهداری</p><p style="text-align: right;">اگر کسی شاهد را بخواهد، از کجا برایش می‌فرستید؟ (مثلاً: پوشهٔ ابری، ایمیل، لینک)</p><p style="text-align: right;">۶. شکاف و اقدام بعدی</p><p style="text-align: right;">چه چیزی هنوز ندارید و چه زمانی آن را تکمیل می‌کنید؟ این مهم‌ترین بخش فرم است، پس لطفاً خالی نگذارید. حتی یک جملهٔ کوتاه کافی است.</p><p style="text-align: right;">مثال: «تأیید کتبی کوتاه از سرپرست پروژه می‌خواهم تا شاهدم از پلهٔ ۳ به ۴ برود. تا ۱۴ روز آینده درخواستش را می‌فرستم.»</p><p style="text-align: right;"><br>نکتهٔ مهم</p><p style="text-align: right;">حداقل یکی از سه ردیف باید شکاف صریح داشته باشد. پرتفویی که هیچ خانهٔ خالی ندارد، معمولاً پرتفوی دقیقی نیست.</p><p style="text-align: right;">قرار نیست همه به پلهٔ ۵ برسند. فقط بدانید هر ادعایتان روی کدام پله است و برنامه بریزید که آن را یک پله بالاتر ببرید.</p><p style="text-align: right;"><br></p><p style="text-align: right;">سؤال پایانی</p><p style="text-align: right;">اگر همین حالا کسی بخواهد حرف شما را راستی‌آزمایی کند، چقدر مدرک آمادهٔ ارائه دارید؟</p><p style="text-align: right;">○ هیچ ○ پراکنده ○ بخشی‌اش منظم است ○ آمادهٔ ارسال</p><p style="text-align: right;">(این پرسش همان نظرسنجی ابتدای جلسه است. جوابتان را با پاسخ آن روز مقایسه می‌کنیم.)</p>			\N	\N	t	ee49f63f-9e8d-406d-a4ef-a0a471a51861	2026-10-18 07:46:38.428
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
bd5ad1c5-0bf9-46ab-a5a9-02efbd083195	9ff2e9d16bf2b6cb755ac6e3172ee89d9cf507cb09213a44fe70624148afd3a1	2026-09-25 12:39:07.751026+00	20260916082840_add_email_verification	\N	\N	2026-09-25 12:39:07.041386+00	1
d2d2a747-c35d-4425-acd6-76517b836e9b	6b1e8ef8e21a10b0f8e5111918dd4c8e3dad178ecbccede8c0562dda73b25807	\N	20261008000000_add_form_bootcamp_link	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20261008000000_add_form_bootcamp_link\n\nDatabase error code: 42701\n\nDatabase error:\nERROR: column "bootcampId" of relation "Form" already exists\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42701), message: "column \\"bootcampId\\" of relation \\"Form\\" already exists", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(7356), routine: Some("check_for_column_name_collision") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20261008000000_add_form_bootcamp_link"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name="20261008000000_add_form_bootcamp_link"\n             at schema-engine/core/src/commands/apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:226	2026-10-15 12:33:59.640345+00	2026-10-15 12:33:21.0569+00	0
088179aa-b5e5-4d2f-8850-301e1b1ea1a5	6b1e8ef8e21a10b0f8e5111918dd4c8e3dad178ecbccede8c0562dda73b25807	2026-10-15 12:33:59.646643+00	20261008000000_add_form_bootcamp_link		\N	2026-10-15 12:33:59.646643+00	0
55d93008-a52f-41b5-8074-90d2bedfc456	fe9d882fd7f2f13bc05824f743d67bc9958ecb516929d70047d848d5a3eaa7e0	2026-10-19 06:05:42.773238+00	20261020000000_bind_bootcamp_access_to_user	\N	\N	2026-10-19 06:05:41.344762+00	1
\.


--
-- Name: ActivityLog ActivityLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_pkey" PRIMARY KEY (id);


--
-- Name: Announcement Announcement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_pkey" PRIMARY KEY (id);


--
-- Name: ArtifactComment ArtifactComment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ArtifactComment"
    ADD CONSTRAINT "ArtifactComment_pkey" PRIMARY KEY (id);


--
-- Name: ArtifactRating ArtifactRating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ArtifactRating"
    ADD CONSTRAINT "ArtifactRating_pkey" PRIMARY KEY (id);


--
-- Name: Artifact Artifact_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Artifact"
    ADD CONSTRAINT "Artifact_pkey" PRIMARY KEY (id);


--
-- Name: BootcampAccess BootcampAccess_bootcampId_userId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BootcampAccess"
    ADD CONSTRAINT "BootcampAccess_bootcampId_userId_key" UNIQUE ("bootcampId", "userId");


--
-- Name: BootcampAccess BootcampAccess_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BootcampAccess"
    ADD CONSTRAINT "BootcampAccess_pkey" PRIMARY KEY (id);


--
-- Name: BootcampRegistration BootcampRegistration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BootcampRegistration"
    ADD CONSTRAINT "BootcampRegistration_pkey" PRIMARY KEY (id);


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
-- Name: Sponsor Sponsor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sponsor"
    ADD CONSTRAINT "Sponsor_pkey" PRIMARY KEY (id);


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
-- Name: TicketMessage TicketMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TicketMessage"
    ADD CONSTRAINT "TicketMessage_pkey" PRIMARY KEY (id);


--
-- Name: Ticket Ticket_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY (id);


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
-- Name: Announcement_targetUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Announcement_targetUserId_idx" ON public."Announcement" USING btree ("targetUserId");


--
-- Name: ArtifactComment_artifactId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ArtifactComment_artifactId_idx" ON public."ArtifactComment" USING btree ("artifactId");


--
-- Name: ArtifactComment_parentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ArtifactComment_parentId_idx" ON public."ArtifactComment" USING btree ("parentId");


--
-- Name: ArtifactRating_artifactId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ArtifactRating_artifactId_idx" ON public."ArtifactRating" USING btree ("artifactId");


--
-- Name: ArtifactRating_artifactId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ArtifactRating_artifactId_userId_key" ON public."ArtifactRating" USING btree ("artifactId", "userId");


--
-- Name: Artifact_axis_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Artifact_axis_status_idx" ON public."Artifact" USING btree (axis, status);


--
-- Name: Artifact_participantId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Artifact_participantId_status_idx" ON public."Artifact" USING btree ("participantId", status);


--
-- Name: BootcampRegistration_bootcampId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BootcampRegistration_bootcampId_idx" ON public."BootcampRegistration" USING btree ("bootcampId");


--
-- Name: BootcampRegistration_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BootcampRegistration_status_idx" ON public."BootcampRegistration" USING btree (status);


--
-- Name: BootcampRegistration_trackingCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BootcampRegistration_trackingCode_key" ON public."BootcampRegistration" USING btree ("trackingCode");


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
-- Name: Sponsor_placement_isActive_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Sponsor_placement_isActive_order_idx" ON public."Sponsor" USING btree (placement, "isActive", "order");


--
-- Name: Sponsor_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Sponsor_slug_key" ON public."Sponsor" USING btree (slug);


--
-- Name: TicketMessage_ticketId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TicketMessage_ticketId_idx" ON public."TicketMessage" USING btree ("ticketId");


--
-- Name: Ticket_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ticket_userId_idx" ON public."Ticket" USING btree ("userId");


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
-- Name: ArtifactComment ArtifactComment_artifactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ArtifactComment"
    ADD CONSTRAINT "ArtifactComment_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES public."Artifact"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArtifactComment ArtifactComment_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ArtifactComment"
    ADD CONSTRAINT "ArtifactComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."ArtifactComment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArtifactComment ArtifactComment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ArtifactComment"
    ADD CONSTRAINT "ArtifactComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArtifactRating ArtifactRating_artifactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ArtifactRating"
    ADD CONSTRAINT "ArtifactRating_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES public."Artifact"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArtifactRating ArtifactRating_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ArtifactRating"
    ADD CONSTRAINT "ArtifactRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Artifact Artifact_participantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Artifact"
    ADD CONSTRAINT "Artifact_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES public."ParticipantProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BootcampAccess BootcampAccess_bootcampId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BootcampAccess"
    ADD CONSTRAINT "BootcampAccess_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES public."Bootcamp"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BootcampAccess BootcampAccess_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BootcampAccess"
    ADD CONSTRAINT "BootcampAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BootcampRegistration BootcampRegistration_bootcampId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BootcampRegistration"
    ADD CONSTRAINT "BootcampRegistration_bootcampId_fkey" FOREIGN KEY ("bootcampId") REFERENCES public."Bootcamp"(id) ON UPDATE CASCADE ON DELETE CASCADE;


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
-- Name: TicketMessage TicketMessage_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TicketMessage"
    ADD CONSTRAINT "TicketMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ticket Ticket_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


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

\unrestrict Cq1APL12IStFBZPBIWnA59knHQlAEtvMvfav2h0xiP8Z7nWkKAQSFgygxtxak1f

