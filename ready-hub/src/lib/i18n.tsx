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
 * Vietnamese is a real translation, not a placeholder. This is the primary
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
  "home.title": { en: "1,000+ courses. One standard. Not just a course, but a step into a career.",
    vi: "Hơn 1.000 khoá học. Một chuẩn mực. Không chỉ là khoá học, mà là một bước vào sự nghiệp.",
    lo: "ຫຼັກສູດຫຼາຍກວ່າ 1,000. ມາດຕະຖານດຽວ. ບໍ່ພຽງແຕ່ຫຼັກສູດ, ແຕ່ເປັນບາດກ້າວສູ່ອາຊີບ.",
    km: "វគ្គសិក្សាជាង 1,000។ ស្តង់ដារតែមួយ។ មិនត្រឹមតែជាវគ្គសិក្សា តែជាជំហានឆ្ពោះទៅរកអាជីព។",
    th: "คอร์สกว่า 1,000 มาตรฐานเดียว ไม่ใช่แค่คอร์ส แต่คือก้าวสู่อาชีพ",
    my: "သင်တန်း ၁,၀၀၀ ကျော်။ စံနှုန်းတစ်ခု။ သင်တန်းသက်သက်မဟုတ်ဘဲ အသက်မွေးဝမ်းကြောင်းဆီသို့ ခြေလှမ်းတစ်ခု။" },
  "home.sub": { en: "Every course is scored on one standard, carries a verified certificate, and ends in an assessment that opens real placements and contributor roles.",
    vi: "Mỗi khoá học được chấm theo một chuẩn, kèm chứng chỉ xác thực, và kết thúc bằng bài đánh giá mở ra cơ hội thực tập và vai trò đóng góp thực sự.",
    lo: "ທຸກຫຼັກສູດຖືກໃຫ້ຄະແນນຕາມມາດຕະຖານດຽວ, ມີໃບຢັ້ງຢືນ, ແລະ ຈົບດ້ວຍການປະເມີນທີ່ເປີດໂອກາດການເຮັດວຽກຈິງ.",
    km: "វគ្គសិក្សានីមួយៗត្រូវបានវាយតម្លៃតាមស្តង់ដារតែមួយ មានវិញ្ញាបនបត្រ ហើយបញ្ចប់ដោយការវាយតម្លៃដែលបើកឱកាសការងារពិតប្រាកដ។",
    th: "ทุกคอร์สให้คะแนนด้วยมาตรฐานเดียว มีใบรับรอง และจบด้วยการประเมินที่เปิดโอกาสฝึกงานจริง",
    my: "သင်တန်းတိုင်းကို စံနှုန်းတစ်ခုဖြင့် အမှတ်ပေးပြီး အသိအမှတ်ပြုလက်မှတ်ပါဝင်ကာ အလုပ်အကိုင်အခွင့်အလမ်းများ ဖွင့်ပေးသည့် စစ်ဆေးမှုဖြင့် အဆုံးသတ်သည်။" },
  "home.platformsTitle": { en: "Courses from the platforms you already know", vi: "Khoá học từ những nền tảng bạn đã biết" },
  "home.platformsSub": { en: "We do not make courses. We index what already exists, score it, and point you to the right one.", vi: "Chúng tôi không tạo khoá học. Chúng tôi lập chỉ mục những gì đã có, chấm điểm, và chỉ cho bạn khoá phù hợp." },
  "home.statsSub": { en: "READY Hub exists because the courses are already out there and most students never find the right one. These are the numbers behind that.", vi: "READY Hub tồn tại vì các khoá học đã có sẵn nhưng phần lớn sinh viên không tìm được khoá phù hợp. Đây là những con số đằng sau điều đó." },
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
  "ob.language": { en: "Languages you read comfortably", vi: "Ngôn ngữ bạn đọc tốt" },
  "ob.languageHint": { en: "Choose as many as apply", vi: "Chọn tất cả những gì phù hợp" },
  "ob.level": { en: "Current studies", vi: "Bậc học hiện tại" },
  "ob.year": { en: "Year of study", vi: "Năm học" },
  "ob.yearHint": { en: "Undergraduate, master's or doctoral", vi: "Đại học, thạc sĩ hoặc tiến sĩ" },
  "ob.field": { en: "Field of study", vi: "Lĩnh vực học tập" },
  "ob.major": { en: "Your major", vi: "Chuyên ngành của bạn" },
  "ob.majorHint": { en: "Optional, in your own words", vi: "Không bắt buộc, theo cách bạn gọi" },
  "ob.majorPlaceholder": { en: "For example, Applied Linguistics", vi: "Ví dụ: Ngôn ngữ học ứng dụng" },
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

  // ── Ecosystem Pill Bar ──────────────────────────────────────
  "eco.learn": { en: "Learn", vi: "Học" },
  "eco.community": { en: "Community", vi: "Cộng đồng" },
  "eco.collaborate": { en: "Collaborate", vi: "Hợp tác" },
  "eco.upskill": { en: "Self-Upskill", vi: "Tự nâng cấp" },
  "eco.resume": { en: "Digital Resume", vi: "Hồ sơ số" },

  // ── Coming Back for More ──────────────────────────────────
  "loop.title": { en: "Coming Back for More", vi: "Quay Lại Để Nhận Thêm" },
  "loop.sub": { en: "The loop that never stops. Learn, build, get noticed, repeat.", vi: "Vòng lặp không bao giờ dừng. Học, xây dựng, được chú ý, lặp lại." },

  "loop.fame.tag": { en: "If your project is crazy good, it makes the wall.", vi: "Nếu dự án bạn đủ xuất sắc, nó sẽ lên bảng vàng." },
  "loop.fame.title": { en: "Hall of Fame", vi: "Bảng Vinh Danh" },
  "loop.fame.desc": { en: "Your best work gets featured on the READY Hub Hall of Fame. Employers see it. The world sees it. No more screaming into the void.", vi: "Tác phẩm tốt nhất của bạn được trưng bày trên Bảng Vinh Danh READY Hub. Nhà tuyển dụng thấy. Thế giới thấy. Không còn hét vào khoảng trống." },

  "loop.forum.tag": { en: "Ask the people who've been there.", vi: "Hỏi những người đã từng trải." },
  "loop.forum.title": { en: "Community Forum", vi: "Diễn đàn Cộng đồng" },
  "loop.forum.desc": { en: "A Reddit-style forum where learners ask questions, employers answer, and the conversation itself recommends the right course to take next.", vi: "Diễn đàn kiểu Reddit nơi người học đặt câu hỏi, nhà tuyển dụng trả lời, và cuộc trò chuyện tự gợi ý khoá học phù hợp tiếp theo." },

  "loop.collab.tag": { en: "You bring the idea. We bring the team.", vi: "Bạn mang ý tưởng. Chúng tôi mang đội ngũ." },
  "loop.collab.title": { en: "Cross-Discipline Collab Hub", vi: "Trung tâm Hợp tác Liên ngành" },
  "loop.collab.desc": { en: "Need an ML engineer for your commerce startup? Someone needs a designer for their hardware project? Match across disciplines, build together.", vi: "Cần kỹ sư ML cho startup thương mại? Ai đó cần designer cho dự án phần cứng? Kết nối liên ngành, cùng xây dựng." },

  "loop.projects.tag": { en: "Build something real. Then build the next thing.", vi: "Xây thứ gì đó thật. Rồi xây tiếp." },
  "loop.projects.title": { en: "Project Portal: Work & Learn", vi: "Cổng Dự án: Làm & Học" },
  "loop.projects.desc": { en: "A guided project portal that helps you find a real project, work on it, and once you're done, suggests the next one. A perpetual upskill machine.", vi: "Cổng dự án có hướng dẫn giúp bạn tìm dự án thật, thực hiện, và khi xong, gợi ý dự án tiếp. Cỗ máy nâng cấp không ngừng." },

  "loop.resume.tag": { en: "Everything you've done. One link.", vi: "Mọi thứ bạn đã làm. Một liên kết." },
  "loop.resume.title": { en: "Digital Resume for All", vi: "Hồ sơ Số cho Tất cả" },
  "loop.resume.desc": { en: "Every course, every project, every assessment, compiled into a living digital resume you can share with anyone, anywhere.", vi: "Mỗi khoá học, mỗi dự án, mỗi bài đánh giá, tổng hợp thành hồ sơ số sống động để chia sẻ với bất kỳ ai, bất kỳ đâu." },

  "loop.explore": { en: "Explore", vi: "Khám phá" },
  "loop.comingSoon": { en: "Coming soon", vi: "Sắp ra mắt" },

  // ── Coming Soon Pages ─────────────────────────────────────
  "soon.back": { en: "Back to home", vi: "Về trang chủ" },
  "soon.notify": { en: "Notify me when it's live", vi: "Thông báo khi ra mắt" },
  "soon.building": { en: "We're building this right now.", vi: "Chúng tôi đang xây dựng." },

  "soon.fame.hero": { en: "Your work deserves a spotlight.", vi: "Tác phẩm của bạn xứng đáng được chú ý." },
  "soon.fame.p1": { en: "Complete a course assessment with distinction and your project could be featured on the READY Hub Hall of Fame, visible to employers, mentors, and every other learner on the platform.", vi: "Hoàn thành bài đánh giá xuất sắc và dự án của bạn có thể lên Bảng Vinh Danh READY Hub, hiển thị cho nhà tuyển dụng, cố vấn, và mọi người học." },
  "soon.fame.b1": { en: "Curated showcase of top student projects", vi: "Trưng bày các dự án sinh viên hàng đầu" },
  "soon.fame.b2": { en: "Employer-visible with direct contact option", vi: "Nhà tuyển dụng xem được, liên hệ trực tiếp" },
  "soon.fame.b3": { en: "Updated every assessment cycle", vi: "Cập nhật mỗi kỳ đánh giá" },

  "soon.forum.hero": { en: "The conversation that teaches you what courses can't.", vi: "Cuộc trò chuyện dạy bạn điều mà khoá học không thể." },
  "soon.forum.p1": { en: "A Reddit-style community where learners post questions, employers share real industry insights, and READY Hub's engine recommends courses based on the threads you engage with.", vi: "Cộng đồng kiểu Reddit nơi người học đặt câu hỏi, nhà tuyển dụng chia sẻ kiến thức thực tế, và hệ thống READY Hub gợi ý khoá học dựa trên các chủ đề bạn tham gia." },
  "soon.forum.b1": { en: "Ask employers real questions, get real answers", vi: "Hỏi nhà tuyển dụng, nhận câu trả lời thực" },
  "soon.forum.b2": { en: "AI-powered course recommendations from discussions", vi: "Gợi ý khoá học bằng AI từ cuộc thảo luận" },
  "soon.forum.b3": { en: "Build reputation through helpful contributions", vi: "Xây dựng uy tín qua đóng góp hữu ích" },

  "soon.collab.hero": { en: "Great ideas need great teams.", vi: "Ý tưởng lớn cần đội ngũ lớn." },
  "soon.collab.p1": { en: "Post your startup idea or side project and find collaborators from different backgrounds. Commerce students pair with ML engineers, designers team up with hardware hackers. Real cross-discipline teamwork.", vi: "Đăng ý tưởng startup hoặc dự án phụ và tìm cộng tác viên từ nhiều lĩnh vực. Sinh viên thương mại ghép với kỹ sư ML, designer hợp tác với hardware hacker. Hợp tác liên ngành thực thụ." },
  "soon.collab.b1": { en: "Post a project brief, get matched with the right people", vi: "Đăng mô tả dự án, được ghép với người phù hợp" },
  "soon.collab.b2": { en: "Cross-discipline: ML + Commerce + Design + Hardware", vi: "Liên ngành: ML + Thương mại + Thiết kế + Phần cứng" },
  "soon.collab.b3": { en: "Built-in project management tools", vi: "Công cụ quản lý dự án tích hợp" },

  "soon.projects.hero": { en: "Work on something real. Learn by doing.", vi: "Làm điều thật. Học qua thực hành." },
  "soon.projects.p1": { en: "The Project Portal gives you a real project to work on, not a toy exercise. Finish one and the system suggests the next, creating a continuous cycle of building, learning, and levelling up.", vi: "Cổng Dự án cho bạn dự án thật, không phải bài tập đồ chơi. Hoàn thành một dự án, hệ thống gợi ý dự án tiếp, tạo chu kỳ liên tục xây dựng, học hỏi, và nâng cấp." },
  "soon.projects.b1": { en: "Real projects, not toy exercises", vi: "Dự án thật, không phải bài tập đồ chơi" },
  "soon.projects.b2": { en: "AI-suggested next projects based on your progress", vi: "AI gợi ý dự án tiếp theo dựa trên tiến độ" },
  "soon.projects.b3": { en: "Portfolio-ready output from day one", vi: "Sản phẩm sẵn sàng cho portfolio từ ngày đầu" },

  "soon.resume.hero": { en: "One link. Your entire story.", vi: "Một liên kết. Toàn bộ câu chuyện của bạn." },
  "soon.resume.p1": { en: "Every course you complete, every project you build, every assessment you pass, automatically compiled into a living digital resume. Share it with employers, attach it to applications, or just flex on LinkedIn.", vi: "Mỗi khoá học hoàn thành, mỗi dự án xây dựng, mỗi bài đánh giá vượt qua, tự động tổng hợp thành hồ sơ số sống động. Chia sẻ với nhà tuyển dụng, đính kèm đơn xin việc, hoặc khoe trên LinkedIn." },
  "soon.resume.b1": { en: "Auto-generated from your READY Hub activity", vi: "Tự động tạo từ hoạt động READY Hub" },
  "soon.resume.b2": { en: "Verified certificates and assessment scores included", vi: "Bao gồm chứng chỉ và điểm đánh giá xác thực" },
  "soon.resume.b3": { en: "Shareable link, embeddable widget", vi: "Liên kết chia sẻ, widget nhúng được" },


  // ── Community ────────────────────────────────────────────
  "co.newQuestion": { en: "Ask a question", vi: "Đặt câu hỏi" },
  "co.all": { en: "All", vi: "Tất cả" },
  "co.employerAnswers": { en: "Employer answers", vi: "Nhà tuyển dụng trả lời" },
  "co.myField": { en: "My field", vi: "Ngành của tôi" },
  "co.upvote": { en: "Upvote", vi: "Ủng hộ" },
  "co.replies": { en: "replies", vi: "phản hồi" },
  "co.reply": { en: "reply", vi: "phản hồi" },
  "co.recommended": { en: "Recommended", vi: "Được đề xuất" },
  "co.exploreCourse": { en: "Explore this course", vi: "Khám phá khoá học này" },
  "co.backToThreads": { en: "Back to all threads", vi: "Về danh sách chủ đề" },
  "co.composerPlaceholder": { en: "What do you want to ask?", vi: "Bạn muốn hỏi gì?" },
  "co.post": { en: "Post", vi: "Đăng" },
  "co.dummyNote": { en: "Dummy content for this preview. Nothing here is a real employer.", vi: "Nội dung minh hoạ cho bản xem trước. Đây không phải nhà tuyển dụng thật." },
  "co.posted": { en: "Posted. In the full version this reaches real employers.", vi: "Đã đăng. Ở bản đầy đủ, câu hỏi này sẽ đến với nhà tuyển dụng thật." },

  // ── Collaborate ──────────────────────────────────────────
  "cl.title": { en: "Cross-Discipline Collab Hub", vi: "Trung tâm Hợp tác Liên ngành" },
  "cl.sub": { en: "You bring the idea. Someone here brings the skill you don't have.", vi: "Bạn mang ý tưởng. Ai đó ở đây mang kỹ năng bạn còn thiếu." },
  "cl.openRoles": { en: "open roles", vi: "vai trò đang mở" },
  "cl.filled": { en: "Filled", vi: "Đã có người" },
  "cl.request": { en: "Request to join", vi: "Xin tham gia" },
  "cl.requested": { en: "Requested", vi: "Đã gửi yêu cầu" },
  "cl.pitchYours": { en: "Pitch your own project", vi: "Đăng dự án của bạn" },
  "cl.dummyNote": { en: "Dummy content for this preview. No real teams behind these pitches yet.", vi: "Nội dung minh hoạ cho bản xem trước. Chưa có đội thật đứng sau các dự án này." },

  // ── Self-Upskill projects ────────────────────────────────
  "up.title": { en: "Project Portal: Work and Learn", vi: "Cổng Dự án: Làm và Học" },
  "up.sub": { en: "One real brief at a time. Finish it, and the next one is already waiting.", vi: "Mỗi lần một đề bài thật. Xong việc, đề bài tiếp theo đã sẵn sàng." },
  "up.deliverables": { en: "What to deliver", vi: "Cần nộp gì" },
  "up.estimated": { en: "About", vi: "Khoảng" },
  "up.markDone": { en: "Mark complete, get next project", vi: "Hoàn thành, nhận dự án tiếp theo" },
  "up.completed": { en: "practice projects completed", vi: "dự án thực hành đã hoàn thành" },
  "up.completedOne": { en: "practice project completed", vi: "dự án thực hành đã hoàn thành" },
  "up.streak": { en: "You're on a roll.", vi: "Bạn đang có phong độ tốt." },

  // ── Digital resume ───────────────────────────────────────
  "rs.title": { en: "Digital Resume", vi: "Hồ sơ Số" },
  "rs.sub": { en: "Built automatically from what you've actually done here.", vi: "Tự động tạo từ những gì bạn đã thực sự làm ở đây." },
  "rs.learner": { en: "READY Hub learner", vi: "Học viên READY Hub" },
  "rs.verifiedLearning": { en: "Verified learning", vi: "Học tập đã xác thực" },
  "rs.noCourses": { en: "No courses completed yet. Finish one and it appears here automatically.", vi: "Chưa hoàn thành khoá học nào. Hoàn thành một khoá và nó sẽ tự động xuất hiện ở đây." },
  "rs.examTaken": { en: "Exam taken", vi: "Đã thi" },
  "rs.skills": { en: "Skills demonstrated", vi: "Kỹ năng đã thể hiện" },
  "rs.download": { en: "Download as PDF", vi: "Tải về dạng PDF" },
  "rs.copyLink": { en: "Copy shareable link", vi: "Sao chép liên kết chia sẻ" },
  "rs.copied": { en: "Link copied", vi: "Đã sao chép liên kết" },
  "rs.dummyNote": { en: "Preview link, not a real one. In the full version this points to a live shareable page.", vi: "Liên kết minh hoạ, chưa phải liên kết thật. Ở bản đầy đủ, đây sẽ là một trang chia sẻ trực tiếp." },

  // ── Footer ────────────────────────────────────────────────
  "footer.credit": { en: "READY Hub · built for the VietHope Impact Challenge by Namai Chandra · Team V13", vi: "READY Hub · xây dựng cho VietHope Impact Challenge bởi Namai Chandra · Nhóm V13" },
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
      /* private browsing. The toggle still works for this session */
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
 * Renders a match Reason with its interpolated values localised too, because a
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
