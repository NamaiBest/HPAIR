import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { FIELD_VI, GOAL_VI, LANGUAGE_VI } from "@/data/profile";

export type Lang = "en" | "vi";

/**
 * Every user-facing string in the app. English is the source of truth;
 * Vietnamese is a real translation, not a placeholder — this is the primary
 * language for most of the learners READY Hub serves.
 */
const DICT = {
  // ── Shared ────────────────────────────────────────────────
  "app.name": ["READY Hub", "READY Hub"],
  "nav.home": ["Home", "Trang chủ"],
  "nav.browse": ["Browse courses", "Duyệt khoá học"],
  "nav.dashboard": ["My dashboard", "Bảng của tôi"],
  "action.continue": ["Continue", "Tiếp tục"],
  "action.back": ["Back", "Quay lại"],
  "action.getStarted": ["Get started", "Bắt đầu"],
  "action.goToCourses": ["Go to my courses", "Đến khoá học của tôi"],
  "action.updateProfile": ["Update my profile", "Cập nhật hồ sơ"],
  "action.search": ["Search", "Tìm kiếm"],
  "action.clear": ["Clear", "Xoá bộ lọc"],
  "action.done": ["Done", "Xong"],
  "action.seeAll": ["See all courses", "Xem tất cả khoá học"],

  // ── Landing ───────────────────────────────────────────────
  "home.eyebrow": ["A VietHope programme", "Một chương trình của VietHope"],
  "home.title": [
    "Thousands of courses exist. One score tells you which are worth your time.",
    "Có hàng nghìn khoá học. Một điểm số cho bạn biết khoá nào đáng thời gian của bạn.",
  ],
  "home.sub": [
    "READY Hub reads the courses already out there, scores them honestly, and routes you to the few that fit where you are and where you are going.",
    "READY Hub đọc các khoá học đã có sẵn, chấm điểm một cách trung thực, và dẫn bạn đến số ít khoá phù hợp với vị trí hiện tại và mục tiêu của bạn.",
  ],
  "home.platformsTitle": ["Courses from the platforms you already know", "Khoá học từ những nền tảng bạn đã biết"],
  "home.platformsSub": [
    "We do not make courses. We index what already exists, score it, and point you to the right one.",
    "Chúng tôi không tạo khoá học. Chúng tôi lập chỉ mục những gì đã có, chấm điểm, và chỉ cho bạn khoá phù hợp.",
  ],
  "home.statsTitle": ["The gap we are built to close", "Khoảng cách chúng tôi muốn thu hẹp"],
  "home.indexedTitle": ["What's indexed right now", "Hiện đang có trong hệ thống"],
  "home.stat.courses": ["courses indexed", "khoá học được lập chỉ mục"],
  "home.stat.platforms": ["platforms represented", "nền tảng"],
  "home.stat.lectures": ["lectures, real and playable", "bài giảng, thật và xem được"],
  "home.stat.hours": ["of material, catalogue-wide", "tài liệu, toàn bộ danh mục"],
  "home.courseCount": ["courses", "khoá học"],
  "home.courseCountOne": ["course", "khoá học"],

  // ── Onboarding ────────────────────────────────────────────
  "ob.step1": ["Where you study", "Nơi bạn học"],
  "ob.step2": ["What you study", "Bạn học gì"],
  "ob.q1.title": ["Where are you studying?", "Bạn đang học ở đâu?"],
  "ob.q1.sub": [
    "This decides which partners and placements you can reach.",
    "Điều này quyết định những đối tác và cơ hội thực tập bạn có thể tiếp cận.",
  ],
  "ob.q2.title": ["Tell us about your studies", "Cho chúng tôi biết về việc học của bạn"],
  "ob.q2.sub": [
    "We use this to bridge from what you already know into what you want next.",
    "Chúng tôi dùng thông tin này để nối từ những gì bạn đã biết đến điều bạn muốn tiếp theo.",
  ],
  "ob.country": ["Country", "Quốc gia"],
  "ob.university": ["University", "Trường đại học"],
  "ob.universityHint": ["Search or type your own", "Tìm kiếm hoặc tự nhập"],
  "ob.universityPlaceholder": ["Start typing…", "Bắt đầu nhập…"],
  "ob.language": ["Preferred language", "Ngôn ngữ ưu tiên"],
  "ob.languageHint": ["Used to filter the catalogue", "Dùng để lọc danh mục"],
  "ob.level": ["Current studies", "Bậc học hiện tại"],
  "ob.year": ["Year of study", "Năm học"],
  "ob.yearHint": ["Undergraduate, master's or doctoral", "Đại học, thạc sĩ hoặc tiến sĩ"],
  "ob.major": ["Major", "Chuyên ngành"],
  "ob.goal": ["What are you hoping this leads to?", "Bạn mong điều này dẫn đến đâu?"],
  "ob.goalHint": ["This changes how courses are ranked for you", "Điều này thay đổi cách xếp hạng khoá học cho bạn"],
  "ob.finish": ["See my courses", "Xem khoá học của tôi"],
  "ob.privacy": [
    "That is everything we ask. READY Hub does not collect your date of birth, your ethnicity, or anything else it does not use to rank a course.",
    "Đó là tất cả những gì chúng tôi hỏi. READY Hub không thu thập ngày sinh, dân tộc, hay bất cứ thông tin nào không dùng để xếp hạng khoá học.",
  ],
  "ob.expanding": ["expanding", "sắp mở"],
  "ob.orgNote": [
    "READY is run by VietHope, which has awarded 6,625 scholarships and disbursed over $1.2M since 2002.",
    "READY do VietHope điều hành, đã trao 6.625 suất học bổng và giải ngân hơn 1,2 triệu USD từ năm 2002.",
  ],

  // ── Dashboard ─────────────────────────────────────────────
  "dash.greeting": ["Your courses", "Khoá học của bạn"],
  "dash.subtitle": [
    "Ranked for a {major} student in year {year}.",
    "Được xếp hạng cho sinh viên {major}, năm {year}.",
  ],
  "dash.topMatches": ["Your strongest matches", "Phù hợp nhất với bạn"],
  "dash.continueLearning": ["Continue where you left off", "Tiếp tục từ chỗ bạn dừng lại"],
  "dash.browseBy": ["Browse by platform", "Duyệt theo nền tảng"],
  "dash.completed": ["Completed", "Đã hoàn thành"],
  "dash.inProgress": ["In progress", "Đang học"],
  "dash.searchPlaceholder": ["Search every platform…", "Tìm trên mọi nền tảng…"],

  // ── Catalogue ─────────────────────────────────────────────
  "cat.title": ["All courses", "Tất cả khoá học"],
  "cat.allPlatforms": ["All platforms", "Tất cả nền tảng"],
  "cat.anyLanguage": ["Any language", "Mọi ngôn ngữ"],
  "cat.anyLength": ["Any length", "Mọi độ dài"],
  "cat.under1": ["Under 1 hour", "Dưới 1 giờ"],
  "cat.under3": ["Under 3 hours", "Dưới 3 giờ"],
  "cat.under6": ["Under 6 hours", "Dưới 6 giờ"],
  "cat.scoring": ["Scoring", "Chấm điểm"],
  "cat.of": ["of", "trên"],
  "cat.emptyTitle": ["Nothing matches those filters yet.", "Chưa có khoá học nào khớp bộ lọc."],
  "cat.emptySub": [
    "Widen the language or the length, or lower the minimum score, and the catalogue will fill back up.",
    "Hãy mở rộng ngôn ngữ hoặc độ dài, hoặc hạ điểm tối thiểu, danh mục sẽ đầy trở lại.",
  ],
  "cat.minScore": ["Min score", "Điểm tối thiểu"],
  "cat.whyScore": ["Why this score?", "Vì sao có điểm này?"],
  "cat.editingAs": ["Editing as", "Đang xem với hồ sơ"],

  // ── Scoring ───────────────────────────────────────────────
  "score.title": ["Scoring weights", "Trọng số chấm điểm"],
  "score.sub": [
    "Decide what a good course means to you. The catalogue re-ranks as you move these.",
    "Quyết định thế nào là một khoá học tốt với bạn. Danh mục sẽ xếp lại khi bạn điều chỉnh.",
  ],
  "score.reset": ["Reset weights", "Đặt lại trọng số"],
  "score.relevance": ["Relevance", "Mức liên quan"],
  "score.engagement": ["Engagement", "Mức cuốn hút"],
  "score.density": ["Density", "Mật độ kiến thức"],
  "score.currency": ["Currency", "Tính cập nhật"],
  "score.relevanceBlurb": [
    "How closely the course matches what employers in the region are hiring for.",
    "Mức độ khoá học khớp với nhu cầu tuyển dụng trong khu vực.",
  ],
  "score.engagementBlurb": [
    "Whether the delivery is something you can realistically sit through to the end.",
    "Liệu cách trình bày có đủ hấp dẫn để bạn học đến hết hay không.",
  ],
  "score.densityBlurb": [
    "How much you actually learn per minute, once filler is stripped out.",
    "Bạn thực sự học được bao nhiêu mỗi phút, sau khi bỏ phần thừa.",
  ],
  "score.currencyBlurb": [
    "How recently it was updated, weighed against how fast this topic goes stale.",
    "Mức độ cập nhật gần đây, so với tốc độ lỗi thời của chủ đề.",
  ],
  "preset.employability": ["Employability", "Khả năng có việc"],
  "preset.deep": ["Deep learning", "Học sâu"],
  "preset.fast": ["Fast upskilling", "Nâng cấp nhanh"],
  "preset.balanced": ["Balanced", "Cân bằng"],

  // ── Match reasons ─────────────────────────────────────────
  "reason.fieldAndGoal": [
    "Sits inside {field} and points straight at your goal.",
    "Thuộc ngành {field} và hướng thẳng đến mục tiêu của bạn.",
  ],
  "reason.goalAndLanguage": [
    "Serves your goal and is available in {language}.",
    "Phục vụ mục tiêu của bạn và có sẵn bằng {language}.",
  ],
  "reason.field": [
    "Core {field} material at {level} level.",
    "Tài liệu {field} cốt lõi ở trình độ {level}.",
  ],
  "reason.goal": [
    "Bridges from {field} toward your goal without assuming a technical background.",
    "Nối từ {field} đến mục tiêu của bạn mà không cần nền tảng kỹ thuật.",
  ],
  "reason.language": [
    "Widely useful outside {field}, and available in {language}.",
    "Hữu ích rộng rãi ngoài {field}, và có sẵn bằng {language}.",
  ],
  "reason.beginner": [
    "A starting point outside {field} that assumes nothing.",
    "Điểm khởi đầu ngoài {field}, không yêu cầu kiến thức trước.",
  ],
  "reason.merit": [
    "Strong on its own merits, though outside {field}.",
    "Xuất sắc về chất lượng, dù nằm ngoài {field}.",
  ],
  "level.Beginner": ["Beginner", "Cơ bản"],
  "level.Intermediate": ["Intermediate", "Trung cấp"],
  "level.Advanced": ["Advanced", "Nâng cao"],

  // ── Footer ────────────────────────────────────────────────
  "footer.credit": [
    "READY Hub — built for the VietHope Impact Challenge by Namai Chandra · Team V13",
    "READY Hub — xây dựng cho VietHope Impact Challenge bởi Namai Chandra · Nhóm V13",
  ],
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
      if (saved === "en" || saved === "vi") return saved;
      return navigator.language?.toLowerCase().startsWith("vi") ? "vi" : "en";
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
      let out: string = entry ? entry[lang === "vi" ? 1 : 0] : key;
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
