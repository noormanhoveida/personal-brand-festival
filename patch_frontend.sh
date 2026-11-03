# ایمپورت توابع جدید بررسی و پرداخت در api
API_FILE="frontend/src/api/bootcampRegistrations.ts"
if ! grep -q "findBootcampRegistration" "$API_FILE"; then
  echo "Adding find/complete helper functions to api..."
  cat >> "$API_FILE" << 'APIEXT'

export async function findBootcampRegistration(filter: { bootcampId: string; email?: string; mobile?: string }) {
  const params = new URLSearchParams();
  params.append("bootcampId", filter.bootcampId);
  if (filter.email) params.append("email", filter.email);
  if (filter.mobile) params.append("mobile", filter.mobile);
  
  const res = await fetch(`/api/bootcamp-registrations/public/find?${params.toString()}`);
  if (!res.ok) return null;
  return res.json();
}

export async function completeBootcampRegistrationPayment(data: { trackingCode: string; receiptUrl?: string; cardLastDigits?: string; notes?: string }) {
  const res = await fetch(`/api/bootcamp-registrations/public/${data.trackingCode}/payment`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "خطا در تکمیل پرداخت ثبت‌نام");
  }
  return res.json();
}
APIEXT
fi
