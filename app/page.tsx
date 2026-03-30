// app/page.tsx
// Trang chủ giới thiệu dugate

import Link from 'next/link';
import { FileText, GitCompareArrows, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    title: "Bóc tách & Chuyển đổi (Parser)",
    description: "Chỉ với một cú kéo thả, chuyển tệp cấu trúc phức tạp (DOCX, PDF) thành Markdown chuẩn xác, xử lý triệt để bảng biểu và biểu đồ theo yêu cầu AI.",
    icon: FileText,
    color: "from-[#00B74F] to-[#008f40]",
    href: "/transform"
  },
  {
    title: "So sánh & Tìm điểm khác (Compare)",
    description: "Kiểm duyệt tự động đa biến với các văn bản pháp lý, quy định. Tức thời phát hiện các điều khoản được thêm mới, sửa đổi hoặc xóa bỏ so với bản gốc.",
    icon: GitCompareArrows,
    color: "from-[#E00500] to-[#b30400]",
    href: "/compare"
  },
  {
    title: "Phát sinh Văn bản AI (Generate)",
    description: "Chỉ cần upload tài liệu gốc và nạp prompt mô tả yêu cầu — Hệ thống sẽ tự động tổng hợp toàn bộ tri thức để sinh ra báo cáo, phụ lục chuyên nghiệp.",
    icon: Sparkles,
    color: "from-indigo-600 to-indigo-800",
    href: "/generate"
  },
  {
    title: "Fact-check & Xác minh (Verify)",
    description: "Đối chiếu tài liệu với bất kỳ bộ quy tắc nội bộ (Business Rule) hay dữ liệu tham chiếu (Reference Data) để tự động phát hiện mọi bất thường và cảnh báo rủi ro.",
    icon: ShieldCheck,
    color: "from-emerald-500 to-emerald-700",
    href: "/fact-check"
  }
];

export default function Home() {
  return (
    <main className="flex-1 relative overflow-hidden bg-background transition-colors duration-300">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 dark:bg-primary/10 blur-[100px] opacity-70 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-destructive/10 dark:bg-destructive/5 blur-[100px] opacity-70 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-cyan-200/20 dark:bg-primary/10 blur-[120px] opacity-50 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto px-6 py-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm mb-8 text-sm font-medium text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>🚀 AI-Powered Document Intelligence</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
          Xử lý mọi văn bản với<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-500">Document Understanding</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Kỷ nguyên mới của tự động hoá xử lý văn bản. Document Understanding tận dụng sức mạnh AI vượt trội để bóc tách các văn bản (PDF, DOCX), đối chiếu hợp đồng tự động và kiểm chứng dữ liệu với độ chính xác tuyệt đối. Mọi tác vụ thủ công phức tạp giờ chỉ diễn ra trong vài giây (hoặc lâu hơn một chút).
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#features" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 modern-button flex items-center justify-center font-bold px-8">
            Khám phá Hệ thống
          </a>
          <Link href="/generate" className="modern-button btn-outline w-full sm:w-auto flex items-center justify-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" /> Trải nghiệm AI Ngay
          </Link>
        </div>
      </div>

      {/* Action Cards */}
      <div id="features" className="max-w-7xl mx-auto px-6 pb-24 scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => (
            <Link
              key={idx}
              href={feature.href}
              className="modern-card group relative overflow-hidden flex flex-col items-center p-8 sm:p-10 text-center cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/50 dark:to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative mb-6">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${feature.color} dark:bg-muted shadow-inner flex items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-300 ease-out`}>
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-primary blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">{feature.description}</p>
              <div className="flex items-center text-primary font-semibold mt-auto pt-6">
                Khám phá
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
