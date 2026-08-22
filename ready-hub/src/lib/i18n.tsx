import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { FIELD_VI, GOAL_VI, LANGUAGE_VI } from "@/data/profile";

export type Lang = "en" | "vi" | "lo" | "km" | "th" | "my";

export const LANGS: { id: Lang; short: string; name: string }[] = [
  { id: "en", short: "EN", name: "English" },
  { id: "vi", short: "VI", name: "Tiếng Việt" },
  { id: "lo", short: "LO", name: "ລາວ" },
  { id: "km", short: "KM", name: "ខ្មែរ" },
  { id: "th", short: "TH", name: "ไทย" },
  { id: "my", short: "MY", name: "မြန်မာ" },
];

/**
 * Every user-facing string in the app. English is the source of truth;
 * Vietnamese is a real translation, not a placeholder — this is the primary
 * language for most of the learners READY Hub serves.
 */
const DICT = {
  // ── Shared ────────────────────────────────────────────────
  "app.name": { en: "READY Hub", vi: "READY Hub" },
  "nav.home": { en: "Home", vi: "Trang chủ" },
  "nav.browse": { en: "Browse courses", vi: "Duyệt khoá học" },
  "nav.dashboard": { en: "My dashboard", vi: "Bảng của tôi" },
  "action.continue": { en: "Continue", vi: "Tiếp tục" },
  "action.back": { en: "Back", vi: "Quay lại" },
  "action.getStarted": { en: "Get started", vi: "Bắt đầu", lo: "ເລີ່ມຕົ້ນ", km: "ចាប់ផ្តើម", th: "เริ่มต้น", my: "စတင်ရန်" },
  "action.goToCourses": { en: "Go to my courses", vi: "Đến khoá học của tôi", lo: "ໄປທີ່ຫຼັກສູດຂອງຂ້ອຍ", km: "ទៅកាន់វគ្គសិក្សារបស់ខ្ញុំ", th: "ไปที่คอร์สของฉัน", my: "ကျွန်ုပ်၏သင်တန်းများသို့" },
  "action.updateProfile": { en: "Update my profile", vi: "Cập nhật hồ sơ", lo: "ອັບເດດໂປຣໄຟລ໌", km: "ធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូប", th: "อัปเดตโปรไฟล์", my: "ကိုယ်ရေးအချက်အလက် မွမ်းမံရန်" },
  "action.search": { en: "Search", vi: "Tìm kiếm" },
  "action.clear": { en: "Clear", vi: "Xoá bộ lọc" },
  "action.done": { en: "Done", vi: "Xong" },
  "action.seeAll": { en: "See all courses", vi: "Xem tất cả khoá học" },

  // ── Landing ───────────────────────────────────────────────
  "home.eyebrow": { en: "A VietHope programme", vi: "Một chương trình của VietHope", lo: "ໂຄງການຂອງ VietHope", km: "កម្មវិធីរបស់ VietHope", th: "โครงการของ VietHope", my: "VietHope ၏ အစီအစဉ်" },
  "home.title": { en: "1,000+ courses, one standard. Not just a course — a step into a career.",
    vi: "Hơn 1.000 khoá học, một chuẩn mực. Không chỉ là khoá học — mà là một bước vào sự nghiệp.",
    lo: "ຫຼັກສູດຫຼາຍກວ່າ 1,000, ມາດຕະຖານດຽວ. ບໍ່ພຽງແຕ່ຫຼັກສູດ — ແຕ່ເປັນບາດກ້າວສູ່ອາຊີບ.",
    km: "វគ្គសិក្សាជាង 1,000 ស្តង់ដារតែមួយ។ មិនត្រឹមតែជាវគ្គសិក្សា — តែជាជំហានឆ្ពោះទៅរកអាជីព។",
    th: "คอร์สกว่า 1,000 มาตรฐานเดียว ไม่ใช่แค่คอร์ส — แต่คือก้าวสู่อาชีพ",
    my: "သင်တန်း ၁,၀၀၀ ကျော်၊ စံနှုန်းတစ်ခု။ သင်တန်းသက်သက်မဟုတ်ဘဲ — အသက်မွေးဝမ်းကြောင်းဆီသို့ ခြေလှမ်းတစ်ခု။" },
  "home.sub": { en: "Every course is scored on one standard, carries a verified certificate, and ends in an assessment that opens real placements and contributor roles.",
    vi: "Mỗi khoá học được chấm theo một chuẩn, kèm chứng chỉ xác thực, và kết thúc bằng bài đánh giá mở ra cơ hội thực tập và vai trò đóng góp thực sự.",
    lo: "ທຸກຫຼັກສູດຖືກໃຫ້ຄະແນນຕາມມາດຕະຖານດຽວ, ມີໃບຢັ້ງຢືນ, ແລະ ຈົບດ້ວຍການປະເມີນທີ່ເປີດໂອກາດການເຮັດວຽກຈິງ.",
    km: "វគ្គសិក្សានីមួយៗត្រូវបានវាយតម្លៃតាមស្តង់ដារតែមួយ មានវិញ្ញាបនបត្រ ហើយបញ្ចប់ដោយការវាយតម្លៃដែលបើកឱកាសការងារពិតប្រាកដ។",
    th: "ทุกคอร์สให้คะแนนด้วยมาตรฐานเดียว มีใบรับรอง และจบด้วยการประเมินที่เปิดโอกาสฝึกงานจริง",
    my: "သင်တန်းတိုင်းကို စံနှုန်းတစ်ခုဖြင့် အမှတ်ပေးပြီး အသိအမှတ်ပြုလက်မှတ်ပါဝင်ကာ အလုပ်အကိုင်အခွင့်အလမ်းများ ဖွင့်ပေးသည့် စစ်ဆေးမှုဖြင့် အဆုံးသတ်သည်။" },
  "home.platformsTitle": { en: "Courses from the platforms you already know", vi: "Khoá học từ những nền tảng bạn đã biết" },
  "home.platformsSub": { en: "We do not make courses. We index what already exists, score it, and point you to the right one.", vi: "Chúng tôi không tạo khoá học. Chúng tôi lập chỉ mục những gì đã có, chấm điểm, và chỉ cho bạn khoá phù hợp." },
  "home.statsTitle": { en: "The gap we are built to close", vi: "Khoảng cách chúng tôi muốn thu hẹp" },
  "home.indexedTitle": { en: "What's indexed right now", vi: "Hiện đang có trong hệ thống" },
  "home.stat.courses": { en: "courses indexed and scored", vi: "khoá học đã lập chỉ mục và chấm điểm", lo: "ຫຼັກສູດທີ່ຈັດອັນດັບແລ້ວ", km: "វគ្គសិក្សាដែលបានវាយតម្លៃ", th: "คอร์สที่จัดอันดับแล้ว", my: "အဆင့်သတ်မှတ်ပြီး သင်တန်းများ" },
  "home.stat.platforms": { en: "platforms indexed", vi: "nền tảng", lo: "ແພລດຟອມ", km: "វេទិកា", th: "แพลตฟอร์ม", my: "ပလက်ဖောင်းများ" },
  "home.stat.lectures": { en: "lectures, all certificate-backed", vi: "bài giảng, đều có chứng chỉ", lo: "ບົດຮຽນ, ມີໃບຢັ້ງຢືນ", km: "មេរៀន ទាំងអស់មានវិញ្ញាបនបត្រ", th: "บทเรียน มีใบรับรองทั้งหมด", my: "သင်ခန်းစာများ၊ လက်မှတ်ပါဝင်" },
  "home.stat.hours": { en: "hours of assessed material", vi: "giờ tài liệu có đánh giá", lo: "ຊົ່ວໂມງເນື້ອຫາ", km: "ម៉ោងនៃមេរៀន", th: "ชั่วโมงเนื้อหา", my: "နာရီ သင်ကြားမှု" },
  "home.courseCount": { en: "courses", vi: "khoá học" },
  "home.courseCountOne": { en: "course", vi: "khoá học" },

  // ── Onboarding ────────────────────────────────────────────
  "ob.step1": { en: "Where you study", vi: "Nơi bạn học" },
  "ob.step2": { en: "What you study", vi: "Bạn học gì" },
  "ob.q1.title": { en: "Where are you studying?", vi: "Bạn đang học ở đâu?" },
  "ob.q1.sub": { en: "This decides which partners and placements you can reach.", vi: "Điều này quyết định những đối tác và cơ hội thực tập bạn có thể tiếp cận." },
  "ob.q2.title": { en: "Tell us about your studies", vi: "Cho chúng tôi biết về việc học của bạn" },
  "ob.q2.sub": { en: "We use this to bridge from what you already know into what you want next.", vi: "Chúng tôi dùng thông tin này để nối từ những gì bạn đã biết đến điều bạn muốn tiếp theo." },
  "ob.country": { en: "Country", vi: "Quốc gia" },
  "ob.university": { en: "University", vi: "Trường đại học" },
  "ob.universityHint": { en: "Search or type your own", vi: "Tìm kiếm hoặc tự nhập" },
  "ob.universityPlaceholder": { en: "Start typing…", vi: "Bắt đầu nhập…" },
  "ob.language": { en: "Preferred language", vi: "Ngôn ngữ ưu tiên" },
  "ob.languageHint": { en: "Used to filter the catalogue", vi: "Dùng để lọc danh mục" },
  "ob.level": { en: "Current studies", vi: "Bậc học hiện tại" },
  "ob.year": { en: "Year of study", vi: "Năm học" },
  "ob.yearHint": { en: "Undergraduate, master's or doctoral", vi: "Đại học, thạc sĩ hoặc tiến sĩ" },
  "ob.major": { en: "Major", vi: "Chuyên ngành" },
  "ob.goal": { en: "What are you hoping this leads to?", vi: "Bạn mong điều này dẫn đến đâu?" },
  "ob.goalHint": { en: "This changes how courses are ranked for you", vi: "Điều này thay đổi cách xếp hạng khoá học cho bạn" },
  "ob.finish": { en: "See my courses", vi: "Xem khoá học của tôi" },
  "ob.privacy": { en: "That is everything we ask. READY Hub does not collect your date of birth, your ethnicity, or anything else it does not use to rank a course.", vi: "Đó là tất cả những gì chúng tôi hỏi. READY Hub không thu thập ngày sinh, dân tộc, hay bất cứ thông tin nào không dùng để xếp hạng khoá học." },
  "ob.expanding": { en: "expanding", vi: "sắp mở" },
  "ob.orgNote": { en: "READY is run by VietHope, which has awarded 6,625 scholarships and disbursed over $1.2M since 2002.", vi: "READY do VietHope điều hành, đã trao 6.625 suất học bổng và giải ngân hơn 1,2 triệu USD từ năm 2002." },

  // ── Dashboard ─────────────────────────────────────────────
  "dash.greeting": { en: "Your courses", vi: "Khoá học của bạn" },
  "dash.subtitle": { en: "Ranked for a {major} student in year {year}.", vi: "Được xếp hạng cho sinh viên {major}, năm {year}." },
  "dash.topMatches": { en: "Your strongest matches", vi: "Phù hợp nhất với bạn" },
  "dash.continueLearning": { en: "Continue where you left off", vi: "Tiếp tục từ chỗ bạn dừng lại" },
  "dash.browseBy": { en: "Browse by platform", vi: "Duyệt theo nền tảng" },
  "dash.completed": { en: "Completed", vi: "Đã hoàn thành" },
  "dash.inProgress": { en: "In progress", vi: "Đang học" },
  "dash.searchPlaceholder": { en: "Search every platform…", vi: "Tìm trên mọi nền tảng…" },

  // ── Catalogue ─────────────────────────────────────────────
  "cat.title": { en: "All courses", vi: "Tất cả khoá học" },
  "cat.allPlatforms": { en: "All platforms", vi: "Tất cả nền tảng" },
  "cat.anyLanguage": { en: "Any language", vi: "Mọi ngôn ngữ" },
  "cat.anyLength": { en: "Any length", vi: "Mọi độ dài" },
  "cat.under1": { en: "Under 1 hour", vi: "Dưới 1 giờ" },
  "cat.under3": { en: "Under 3 hours", vi: "Dưới 3 giờ" },
  "cat.under6": { en: "Under 6 hours", vi: "Dưới 6 giờ" },
  "cat.scoring": { en: "Scoring", vi: "Chấm điểm" },
  "cat.of": { en: "of", vi: "trên" },
  "cat.emptyTitle": { en: "Nothing matches those filters yet.", vi: "Chưa có khoá học nào khớp bộ lọc." },
  "cat.emptySub": { en: "Widen the language or the length, or lower the minimum score, and the catalogue will fill back up.", vi: "Hãy mở rộng ngôn ngữ hoặc độ dài, hoặc hạ điểm tối thiểu, danh mục sẽ đầy trở lại." },
  "cat.minScore": { en: "Min score", vi: "Điểm tối thiểu" },
  "cat.whyScore": { en: "Why this score?", vi: "Vì sao có điểm này?" },
  "cat.editingAs": { en: "Editing as", vi: "Đang xem với hồ sơ" },

  // ── Scoring ───────────────────────────────────────────────
  "score.title": { en: "Scoring weights", vi: "Trọng số chấm điểm" },
  "score.sub": { en: "Decide what a good course means to you. The catalogue re-ranks as you move these.", vi: "Quyết định thế nào là một khoá học tốt với bạn. Danh mục sẽ xếp lại khi bạn điều chỉnh." },
  "score.reset": { en: "Reset weights", vi: "Đặt lại trọng số" },
  "score.relevance": { en: "Relevance", vi: "Mức liên quan" },
  "score.engagement": { en: "Engagement", vi: "Mức cuốn hút" },
  "score.density": { en: "Density", vi: "Mật độ kiến thức" },
  "score.currency": { en: "Currency", vi: "Tính cập nhật" },
  "score.relevanceBlurb": { en: "How closely the course matches what employers in the region are hiring for.", vi: "Mức độ khoá học khớp với nhu cầu tuyển dụng trong khu vực." },
  "score.engagementBlurb": { en: "Whether the delivery is something you can realistically sit through to the end.", vi: "Liệu cách trình bày có đủ hấp dẫn để bạn học đến hết hay không." },
  "score.densityBlurb": { en: "How much you actually learn per minute, once filler is stripped out.", vi: "Bạn thực sự học được bao nhiêu mỗi phút, sau khi bỏ phần thừa." },
  "score.currencyBlurb": { en: "How recently it was updated, weighed against how fast this topic goes stale.", vi: "Mức độ cập nhật gần đây, so với tốc độ lỗi thời của chủ đề." },
  "preset.employability": { en: "Employability", vi: "Khả năng có việc" },
  "preset.deep": { en: "Deep learning", vi: "Học sâu" },
  "preset.fast": { en: "Fast upskilling", vi: "Nâng cấp nhanh" },
  "preset.balanced": { en: "Balanced", vi: "Cân bằng" },

  // ── Match reasons ─────────────────────────────────────────
  "reason.fieldAndGoal": { en: "Sits inside {field} and points straight at your goal.", vi: "Thuộc ngành {field} và hướng thẳng đến mục tiêu của bạn." },
  "reason.goalAndLanguage": { en: "Serves your goal and is available in {language}.", vi: "Phục vụ mục tiêu của bạn và có sẵn bằng {language}." },
  "reason.field": { en: "Core {field} material at {level} level.", vi: "Tài liệu {field} cốt lõi ở trình độ {level}." },
  "reason.goal": { en: "Bridges from {field} toward your goal without assuming a technical background.", vi: "Nối từ {field} đến mục tiêu của bạn mà không cần nền tảng kỹ thuật." },
  "reason.language": { en: "Widely useful outside {field}, and available in {language}.", vi: "Hữu ích rộng rãi ngoài {field}, và có sẵn bằng {language}." },
  "reason.beginner": { en: "A starting point outside {field} that assumes nothing.", vi: "Điểm khởi đầu ngoài {field}, không yêu cầu kiến thức trước." },
  "reason.merit": { en: "Strong on its own merits, though outside {field}.", vi: "Xuất sắc về chất lượng, dù nằm ngoài {field}." },
  "level.Beginner": { en: "Beginner", vi: "Cơ bản" },
  "level.Intermediate": { en: "Intermediate", vi: "Trung cấp" },
  "level.Advanced": { en: "Advanced", vi: "Nâng cao" },

  // ── Footer ────────────────────────────────────────────────
  "footer.credit": { en: "READY Hub — built for the VietHope Impact Challenge by Namai Chandra · Team V13", vi: "READY Hub — xây dựng cho VietHope Impact Challenge bởi Namai Chandra · Nhóm V13" },
} as const;

export type TKey = keyof typeof DICT;

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
}>({ lang: "en", setLang: () => {}, t: (k) => k });

const STORE_KEY = "ready-hub.lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved && LANGS.some((l) => l.id === saved)) return saved as Lang;
      const nav = navigator.language?.toLowerCase() ?? "";
      const hit = LANGS.find((l) => l.id !== "en" && nav.startsWith(l.id));
      return hit ? hit.id : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, lang);
    } catch {
      /* private browsing — the toggle still works for this session */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback(
    (key: TKey, vars?: Record<string, string | number>) => {
      const entry = DICT[key];
      const row = entry as Record<string, string> | undefined;
      let out: string = row ? (row[lang] ?? row.en) : key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          out = out.replace(`{${k}}`, String(v));
        }
      }
      return out;
    },
    [lang],
  );

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useT() {
  return useContext(LangContext);
}

/**
 * Renders a match Reason with its interpolated values localised too — a
 * Vietnamese sentence should not have "Finance" and "Beginner" embedded in it.
 */
export function useReason() {
  const { t, lang } = useT();
  return (reason: { key: string; vars: Record<string, string> }) => {
    if (lang === "en") return t(reason.key as TKey, reason.vars);
    const vars: Record<string, string> = { ...reason.vars };
    if (vars.field) vars.field = FIELD_VI[vars.field as keyof typeof FIELD_VI] ?? vars.field;
    if (vars.language) vars.language = LANGUAGE_VI[vars.language as keyof typeof LANGUAGE_VI] ?? vars.language;
    if (vars.goal) vars.goal = GOAL_VI[vars.goal as keyof typeof GOAL_VI] ?? vars.goal;
    if (vars.level) vars.level = t(`level.${vars.level}` as TKey);
    return t(reason.key as TKey, vars);
  };
}
