import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import {
  ParticipantProfile,
  RegionItem,
  completeOnboarding,
  getProfile,
  getRegions,
  updateProfile,
} from "../api/profile";
import { normalizeDigits } from "../utils/digits";
import { PhotoUploader } from "../components/PhotoUploader";
import { SkillsManager } from "../components/SkillsManager";
import { LiveMessagesArchive } from "../components/LiveMessagesArchive";
import { MyLeaderboards } from "../components/MyLeaderboards";
import { Button, Card, ErrorText, Input, Label, Spinner, Textarea } from "../components/ui";
import MyNetworkGraph from "../components/network/MyNetworkGraph";

const schema = z.object({
  firstName: z.string().min(1, "نام الزامی است."),
  lastName: z.string().min(1, "نام خانوادگی الزامی است."),
  regionId: z.string().min(1, "انتخاب منطقه الزامی است."),
  city: z.string().min(1, "شهر الزامی است."),
  educationLevel: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  professionalField: z.string().optional(),
  occupation: z.string().optional(),
  bio: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProfilePage() {
  const [profile, setProfile] = useState<ParticipantProfile | null>(null);
  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [regionsLoading, setRegionsLoading] = useState<boolean>(true);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [mobileText, setMobileText] = useState("");
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [interestsText, setInterestsText] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    let isMounted = true;
    setRegionsLoading(true);

    Promise.all([getProfile(), getRegions()])
      .then(([profileRes, regionsRes]) => {
        if (!isMounted) return;
        setRegions(regionsRes ?? []);
        setProfile(profileRes.profile);
        setOnboardingComplete(profileRes.onboardingComplete);

        if (profileRes.profile) {
          reset({
            firstName: profileRes.profile.firstName,
            lastName: profileRes.profile.lastName,
            regionId: profileRes.profile.regionId ?? "",
            city: profileRes.profile.city,
            educationLevel: profileRes.profile.educationLevel ?? "",
            fieldOfStudy: profileRes.profile.fieldOfStudy ?? "",
            professionalField: profileRes.profile.professionalField ?? "",
            occupation: profileRes.profile.occupation ?? "",
            bio: profileRes.profile.bio ?? "",
          });
          setMobileText(profileRes.profile.mobile);
          setInterestsText((profileRes.profile.interests ?? []).join("، "));
        }
      })
      .catch((err) => {
        console.error("خطا در بارگذاری اطلاعات پروفایل یا مناطق:", err);
        setOnboardingComplete(false);
      })
      .finally(() => {
        if (isMounted) setRegionsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setMobileError(null);
    setSaved(false);

    const normalizedMobile = normalizeDigits(mobileText.trim());
    if (!/^09\d{9}$/.test(normalizedMobile)) {
      setMobileError("فرمت شماره موبایل باید ۰۹xxxxxxxxx باشد.");
      return;
    }

    try {
      const interests = interestsText
        .split(/[،,]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const input = {
        ...values,
        mobile: normalizedMobile,
        interests,
      };

      const result = onboardingComplete
        ? await updateProfile(input)
        : await completeOnboarding(input);

      setProfile(result);
      setOnboardingComplete(true);
      setSaved(true);
    } catch (err) {
      const message =
        (err as AxiosError<{ message?: string }>).response?.data?.message ??
        "ثبت اطلاعات با خطا مواجه شد.";
      setServerError(message);
    }
  };

  if (regionsLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">{onboardingComplete ? "پروفایل من" : "تکمیل پروفایل"}</h1>
      <p className="mt-1 text-sm opacity-70">
        {onboardingComplete
          ? "اطلاعات پروفایل خود را ویرایش کنید."
          : "قبل از شروع مسیر برند شخصی، لطفاً این فرم را تکمیل کنید."}
      </p>

      <Card className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>نام</Label>
            <Input {...register("firstName")} />
            <ErrorText>{errors.firstName?.message}</ErrorText>
          </div>
          <div>
            <Label>نام خانوادگی</Label>
            <Input {...register("lastName")} />
            <ErrorText>{errors.lastName?.message}</ErrorText>
          </div>
          <div>
            <Label>شماره موبایل</Label>
            <Input
              value={mobileText}
              onChange={(e) => setMobileText(normalizeDigits(e.target.value))}
              placeholder="09xxxxxxxxx"
              inputMode="numeric"
            />
            <ErrorText>{mobileError}</ErrorText>
          </div>
          <div>
            <Label>منطقه</Label>
            <select
              {...register("regionId")}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:opacity-100 disabled:opacity-70"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--surface)", color: "var(--text)" }}
              disabled={regionsLoading}
            >
              <option value="">
                {regionsLoading ? "در حال دریافت مناطق..." : "انتخاب منطقه..."}
              </option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <ErrorText>{errors.regionId?.message}</ErrorText>
          </div>
          <div>
            <Label>شهر</Label>
            <Input {...register("city")} />
            <ErrorText>{errors.city?.message}</ErrorText>
          </div>
          <div>
            <Label>سطح تحصیلات</Label>
            <Input {...register("educationLevel")} />
          </div>
          <div>
            <Label>رشته تحصیلی</Label>
            <Input {...register("fieldOfStudy")} />
          </div>
          <div>
            <Label>حوزه حرفه‌ای</Label>
            <Input {...register("professionalField")} />
          </div>
          <div>
            <Label>شغل / سمت</Label>
            <Input {...register("occupation")} />
          </div>
          <div className="sm:col-span-2">
            <Label>علاقه‌مندی‌ها (با کاما یا ویرگول جدا کنید)</Label>
            <Input
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              placeholder="طراحی، برنامه‌نویسی، مارکتینگ"
            />
          </div>
          <div className="sm:col-span-2">
            <Label>درباره من</Label>
            <Textarea
              {...register("bio")}
              rows={4}
              placeholder="توضیح مختصری درباره خود، تجربیات و اهدافتان بنویسید..."
            />
            <ErrorText>{errors.bio?.message}</ErrorText>
          </div>

          {serverError && (
            <div className="sm:col-span-2">
              <ErrorText>{serverError}</ErrorText>
            </div>
          )}

          {saved && (
            <div className="sm:col-span-2 rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
              اطلاعات پروفایل با موفقیت ذخیره شد.
            </div>
          )}

          <div className="flex justify-end sm:col-span-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "در حال ذخیره..." : onboardingComplete ? "ذخیره تغییرات" : "تکمیل و ادامه"}
            </Button>
          </div>
        </form>
      </Card>

      {onboardingComplete && profile && (
        <>
          <Card className="mt-6">
            <h2 className="text-lg font-semibold">تصویر پروفایل</h2>
            <div className="mt-4">
              <PhotoUploader />
            </div>
          </Card>

          <Card className="mt-6">
            <h2 className="text-lg font-semibold">مهارت‌ها</h2>
            <div className="mt-4">
              <SkillsManager />
            </div>
          </Card>

          <Card className="mt-6">
            <h2 className="text-lg font-semibold">پیام‌های زنده</h2>
            <div className="mt-4">
              <LiveMessagesArchive />
            </div>
          </Card>

          <Card className="mt-6">
            <h2 className="text-lg font-semibold">لیدربوردها</h2>
            <div className="mt-4">
              <MyLeaderboards />
            </div>
          </Card>
        </>
      )}
    
      <section className="mt-8 rounded-2xl border p-6">
        <h2 className="text-lg font-bold mb-1">شبکه ارتباطی من</h2>
        <p className="text-sm text-gray-500 mb-4">اتصالات دو سطحی بر اساس بازخوردهای داده‌شده و دریافتی</p>
        <MyNetworkGraph />
      </section>
</div>
  );
}
