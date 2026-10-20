import { normalizeDigits } from "../src/utils/digits";

describe("normalizeDigits", () => {
  it("converts Persian digits to ASCII", () => {
    expect(normalizeDigits("۰۹۱۲۳۴۵۶۷۸۹")).toBe("09123456789");
  });

  it("converts Arabic-Indic digits to ASCII", () => {
    expect(normalizeDigits("٠٩١٢٣٤٥٦٧٨٩")).toBe("09123456789");
  });

  it("leaves ASCII digits unchanged", () => {
    expect(normalizeDigits("09123456789")).toBe("09123456789");
  });

  it("leaves non-digit characters unchanged", () => {
    expect(normalizeDigits("علی ۰۹۱۲۳۴۵۶۷۸۹")).toBe("علی 09123456789");
  });

  it("handles mixed Persian and ASCII digits", () => {
    expect(normalizeDigits("09۱۲3456789")).toBe("09123456789");
  });
});
