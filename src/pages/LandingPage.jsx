import React, {useState} from "react";
import {Link} from "react-router-dom";
import {
  Calendar,
  Activity,
  TrendingUp,
  Users,
  Printer,
  WifiOff,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useAppTranslation} from "@/i18n/use-app-translation";

const copy = {
  ar: {
    hero: {
      badge: "نظام عيان لإدارة العيادات الذكية ✨",
      title: "أدر عيادتك الطبية بذكاء، أينما كنت وبلا انقطاع",
      subtitle: "نظام متكامل صُمم خصيصاً لمساعدة الأطباء في إدارة حجوزات المرضى، السجلات الطبية الرقمية، بوابة السكرتارية المنفصلة، والحسابات المالية بدقة متناهية.. والعمل بالكامل دون الحاجة لاتصال مستمر بالإنترنت!",
      ctaPrimary: "ابدأ عيادتك مجاناً",
      ctaSecondary: "استكشف ميزات النظام",
    },
    stats: [
      {value: "+10,000", label: "مريض مسجل"},
      {value: "+500", label: "طبيب عيادة مفعل"},
      {value: "99.9%", label: "معدل استقرار الخدمة"},
      {value: "100%", label: "دعم العمل بدون إنترنت"},
    ],
    features: {
      title: "ميزات متطورة مصممة لراحتك",
      subtitle: "توقف عن الهدر الورقي، واجمع كل عمليات عيادتك في شاشة واحدة منظمة وآمنة.",
      items: [
        {
          icon: Calendar,
          title: "جدولة مواعيد ذكية",
          description: "حجز مواعيد متطور مع تتبع فوري للحضور، الانتظار، والاستشارات المعلقة بنقرة واحدة."
        },
        {
          icon: Activity,
          title: "سجلات مرضى رقمية",
          description: "ملف طبي شامل لكل مريض يضم سجل الزيارات، التشخيص، الروشتات، والتقارير الطبية السابقة."
        },
        {
          icon: TrendingUp,
          title: "تحليلات مالية دقيقة",
          description: "تقارير مالية تفصيلية لحجم الإيرادات، وتتبع الإحصائيات مع إمكانية طباعة تقارير مالية احترافية."
        },
        {
          icon: Users,
          title: "حساب سكرتارية مستقل",
          description: "بوابة منفصلة تماماً لمساعد العيادة أو السكرتير لتنظيم الحجوزات والمرضى دون التدخل في التقارير السرية."
        },
        {
          icon: Printer,
          title: "طباعة روشتات سريعة",
          description: "توليد وطباعة الروشتات الطبية للمرضى بتنسيق رائع وبشعار واسم عيادتك مباشرة."
        },
        {
          icon: WifiOff,
          title: "نظام أوفلاين أولاً (Offline-First)",
          description: "يعمل بالكامل حتى لو انقطع الإنترنت، ويقوم بالمزامنة التلقائية فور عودة الاتصال بفضل تقنياتنا المتقدمة."
        }
      ]
    },
    offline: {
      badge: "تكنولوجيا أوفلاين متقدمة 🔌",
      title: "انقطع الإنترنت؟ لا قلق بعد الآن!",
      description: "نحن نعلم مدى أهمية تدفق العمل في عيادتك. مع نظام عيان (Eyan)، تم تصميم بنية البرمجية لتعمل بالكامل في المتصفح أوفلاين. يتم حفظ المرضى والحجوزات والتعديلات محلياً في ذاكرة التخزين المؤمنة (IndexedDB). فور عودة الشبكة، يقوم مدير المزامنة التلقائي بإرسال كل التحديثات لقاعدة البيانات السحابية في الخلفية دون أي تدخل منك.",
      points: [
        "إضافة وتعديل وحذف المرضى والزيارات وأنت غير متصل بالإنترنت.",
        "تحديث واجهة المستخدم بشكل فوري تفاؤلي (Optimistic Updates) بدون انتظار السيرفر.",
        "طابور عمليات مؤمن يمنع تداخل البيانات أو فقدانها أثناء المزامنة.",
        "مزامنة ذكية بالتسلسل لحماية العلاقات وترابط السجلات الطبية."
      ],
      cta: "ابدأ العمل مجاناً"
    },
    testimonials: {
      title: "ماذا يقول شركاء النجاح؟",
      subtitle: "أطباء يعتمدون على عيان يومياً لتسهيل رعاية المرضى وإدارة عياداتهم بنجاح.",
      items: [
        {
          quote: "كنت أعاني دائماً من ضياع ملفات المرضى وتداخل المواعيد، نظام عيان حل هذه المشاكل تماماً ووفر بوابة سكرتارية مذهلة ريحتني جداً.",
          author: "د. أحمد الشرقاوي",
          role: "استشاري طب الأطفال",
          image: "/doctor-avatar-1.jpg"
        },
        {
          quote: "ميزة العمل بدون إنترنت (Offline-First) كانت بمثابة إنقاذ للعيادة. حتى لو انقطع الاتصال في أوقات الذروة، نستمر في العمل والطباعة دون قلق.",
          author: "د. منى عبد الرحمن",
          role: "أخصائية الأمراض الجلدية",
          image: "/doctor-avatar-2.jpg"
        },
        {
          quote: "التقارير المالية والتحليلات الأسبوعية ساعدتني على فهم الدخل وحجم الحالات المكتملة وتوزيعها بدقة وسهلت الإدارة المالية للعيادة بشكل غير مسبوق.",
          author: "د. خالد منصور",
          role: "جراح القلب والأوعية الدموية",
          image: "/doctor-avatar-3.jpg"
        }
      ]
    },
    ctaBottom: {
      title: "هل أنت مستعد لنقل عيادتك للمستقبل؟",
      subtitle: "سجل حسابك الآن في غضون دقيقتين وابدأ العمل مجاناً. لا نطلب بيانات بطاقة ائتمانية للتجربة.",
      btn: "سجل عيادتك مجاناً"
    },
    footer: {
      desc: "نظام عيان (Eyan) هو منصة برمجية ذكية وآمنة مصممة لمساعدة الأطباء في تنظيم عياداتهم ورعاية مرضاهم بأحدث تقنيات الويب والأوفلاين.",
      product: "المنتج",
      about: "الشركة",
      legal: "قانوني",
      rights: "جميع الحقوق محفوظة. نظام عيان لإدارة العيادات الذكية © 2026."
    }
  },
  en: {
    hero: {
      badge: "Eyan Smart Clinic System ✨",
      title: "Manage your clinic smartly, anywhere and without interruption",
      subtitle: "An integrated cloud system designed for doctors to manage patient bookings, digital medical records, separate assistant portals, and financial accounts with absolute precision.. and working 100% offline without needing a continuous internet connection!",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Explore Features",
    },
    stats: [
      {value: "+10,000", label: "Registered Patients"},
      {value: "+500", label: "Active Doctors"},
      {value: "99.9%", label: "Uptime Rate"},
      {value: "100%", label: "Offline Support"},
    ],
    features: {
      title: "Advanced features designed for you",
      subtitle: "Stop using paper files, and gather all your clinic operations in one neat and secure dashboard.",
      items: [
        {
          icon: Calendar,
          title: "Smart Scheduler",
          description: "Advanced booking with real-time status tracking for attendance, waitlists, and consultations in one click."
        },
        {
          icon: Activity,
          title: "Digital Health Records",
          description: "A comprehensive medical profile for each patient with visits history, diagnoses, prescriptions, and reports."
        },
        {
          icon: TrendingUp,
          title: "Financial Analytics",
          description: "Detailed financial reports on revenue volume, metrics tracking, and professional financial report printing."
        },
        {
          icon: Users,
          title: "Independent Secretary Portal",
          description: "A completely separate interface for clinic assistants to organize bookings and patients without accessing sensitive financials."
        },
        {
          icon: Printer,
          title: "Quick Prescription Printing",
          description: "Generate and print professional digital prescriptions with your custom clinic layout and logo instantly."
        },
        {
          icon: WifiOff,
          title: "Offline-First Support",
          description: "Works 100% offline, automatically syncing all edits to the cloud when internet returns using our queue manager."
        }
      ]
    },
    offline: {
      badge: "Advanced Offline Technology 🔌",
      title: "Internet dropped? No need to worry!",
      description: "We know how critical clinic operations are. With Eyan, the architecture is built to run fully in the browser offline. Patients, appointments, and logs are saved in secure IndexedDB. The moment connection returns, our sync worker pushes all updates to the database in the background without any manual work.",
      points: [
        "Create, update, and delete patients and visits while completely offline.",
        "Immediate optimistic UI updates in the interface without waiting for the server.",
        "Secure IndexedDB operation queue prevents data loss and conflict during syncing.",
        "Sequential background synchronization to preserve medical record relational integrity."
      ],
      cta: "Get Started Free"
    },
    testimonials: {
      title: "Trusted by successful clinics",
      subtitle: "Doctors who rely on Eyan every day to manage clinic workflow and care for patients.",
      items: [
        {
          quote: "I used to suffer from lost folders and booking overlaps. Eyan completely solved these issues and provided an incredible portal for my secretary.",
          author: "Dr. Ahmed El-Sharkawy",
          role: "Consultant Pediatrician",
          image: "/doctor-avatar-1.jpg"
        },
        {
          quote: "The offline capability is a lifesaver. Even when the internet cuts during peak hours, we keep working and printing prescriptions without missing a beat.",
          author: "Dr. Mona Abdel-Rahman",
          role: "Dermatologist",
          image: "/doctor-avatar-2.jpg"
        },
        {
          quote: "The financial analytics and weekly breakdown helped me understand my clinic's revenue, visit stats, and performance with absolute clarity.",
          author: "Dr. Khaled Mansour",
          role: "Cardiovascular Surgeon",
          image: "/doctor-avatar-3.jpg"
        }
      ]
    },
    ctaBottom: {
      title: "Ready to step into the future of clinic management?",
      subtitle: "Register your account in 2 minutes and start for free. No credit card required.",
      btn: "Start Free Trial"
    },
    footer: {
      desc: "Eyan is a smart, secure clinic management platform designed to help doctors digitize records and care for patients using modern web and offline-first technology.",
      product: "Product",
      about: "Company",
      legal: "Legal",
      rights: "All rights reserved. Eyan Smart Clinic System © 2026."
    }
  }
};

function LandingPage() {
  const {i18n} = useAppTranslation();
  const isAr = i18n.language === "ar";
  const activeCopy = isAr ? copy.ar : copy.en;

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isAr ? "rtl" : "ltr"}>
      {/* 1. Hero Section */}
      <section id="hero" className="relative pt-16 pb-24 overflow-hidden border-b border-border/40 bg-radial-[at_top_right] from-primary/5 via-background to-background">
        {/* Glow Effects */}
        <div className="absolute top-20 right-1/4 size-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 size-80 bg-primary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-start">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold rounded-full border border-primary/20 bg-primary/5 text-primary animate-pulse">
              <Sparkles className="size-3.5" />
              <span>{activeCopy.hero.badge}</span>
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.15] tracking-tight">
              {isAr ? (
                <>
                  أدر عيادتك الطبية <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-500">بذكاء وبلا انقطاع</span>
                </>
              ) : (
                <>
                  Manage your clinic <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-500">smartly & offline</span>
                </>
              )}
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {activeCopy.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 pt-3">
              <Link to="/register">
                <Button className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-sm shadow-md transition-transform hover:-translate-y-0.5">
                  {activeCopy.hero.ctaPrimary}
                  <ArrowRight className={`size-4 ${isAr ? "rotate-180 mr-2" : "ml-2"}`} />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" className="h-12 px-6 rounded-2xl font-semibold text-sm transition-all hover:bg-muted/10">
                  {activeCopy.hero.ctaSecondary}
                </Button>
              </a>
            </div>
          </div>

          {/* Interactive Laptop Mockup Visual */}
          <div className="lg:col-span-5 relative w-full max-w-xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-sky-500/10 rounded-3xl blur-2xl transform rotate-3" />
            
            <div className="relative border border-border/80 bg-card/90 shadow-2xl rounded-3xl overflow-hidden p-2.5 transform transition-all duration-500 hover:scale-[1.02]">
              <img
                src="/eyan-hero-dashboard.jpg"
                alt="Eyan Dashboard Mockup"
                className="w-full h-auto rounded-2xl object-cover border border-border/40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Grid Section */}
      <section className="py-12 border-b border-border/40 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {activeCopy.stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-1">
                <h3 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Features Section */}
      <section id="features" className="py-24 border-b border-border/40 bg-background relative">
        <div className="absolute top-1/2 left-0 size-80 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          {/* Header */}
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {activeCopy.features.title}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {activeCopy.features.subtitle}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCopy.features.items.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-border/55 bg-card shadow-xs hover:shadow-md hover:border-primary/30 group transition-all duration-300 hover:-translate-y-1 space-y-4 text-start">
                  <div className="p-3 w-fit rounded-xl bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Offline First Advantage Section */}
      <section id="about" className="py-24 border-b border-border/40 bg-muted/10 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 size-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Visual Illustration */}
          <div className="lg:col-span-5 order-last lg:order-first relative">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="relative border border-border/80 bg-card rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                  <WifiOff className="size-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    {isAr ? "مستوى حماية اتصال العيادة" : "Clinic Connection Resilience"}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {isAr ? "قيد التشغيل أوفلاين بالكامل" : "Fully running offline"}
                  </p>
                </div>
              </div>

              {/* Simulated Queue item */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                  <span>{isAr ? "طابور المزامنة المعلق" : "Pending Sync Queue"}</span>
                  <span className="text-amber-500 font-mono font-black">4 {isAr ? "عمليات معلقة" : "actions"}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-muted/30 text-[10px] font-semibold">
                    <span className="text-foreground">{isAr ? "إضافة مريض جديد: هاني علي" : "Add Patient: Hany Aly"}</span>
                    <span className="text-amber-500 font-bold">{isAr ? "بانتظار الإنترنت" : "Queued"}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-muted/30 text-[10px] font-semibold">
                    <span className="text-foreground">{isAr ? "تعديل حجز: 14 أغسطس" : "Update Visit: Aug 14"}</span>
                    <span className="text-amber-500 font-bold">{isAr ? "بانتظار الإنترنت" : "Queued"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center p-3.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-4 animate-pulse" />
                <span>{isAr ? "كل العمليات محفوظة محلياً بأمان" : "All operations safely stored locally"}</span>
              </div>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="lg:col-span-7 space-y-6 text-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400">
              <Clock className="size-3.5" />
              <span>{activeCopy.offline.badge}</span>
            </span>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {activeCopy.offline.title}
            </h2>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {activeCopy.offline.description}
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {activeCopy.offline.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs md:text-sm font-medium text-foreground/80">
                  <div className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-600 mt-0.5">
                    <Check className="size-3.5" />
                  </div>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3">
              <Link to="/register">
                <Button className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs md:text-sm shadow-md">
                  {activeCopy.offline.cta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section id="testimonials" className="py-24 border-b border-border/40 bg-muted/10 relative">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          {/* Header */}
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {activeCopy.testimonials.title}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {activeCopy.testimonials.subtitle}
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {activeCopy.testimonials.items.map((test, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-border/55 bg-card space-y-5 shadow-xs text-start flex flex-col justify-between hover:border-primary/20 hover:shadow-md transition-all duration-300">
                <p className="text-xs md:text-sm text-foreground/90 font-medium leading-relaxed italic">
                  “{test.quote}”
                </p>
                <div className="flex items-center gap-3.5 pt-3 border-t border-border/30">
                  <img
                    src={test.image}
                    alt={test.author}
                    className="size-11 rounded-full object-cover border border-border/50 shadow-xs"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{test.author}</h4>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final Call to Action Section */}
      <section className="py-24 bg-gradient-to-tr from-primary to-sky-600 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:20px_20px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-white/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            {activeCopy.ctaBottom.title}
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 max-w-xl mx-auto leading-relaxed">
            {activeCopy.ctaBottom.subtitle}
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button className="h-12 px-8 rounded-2xl bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold text-sm shadow-xl transition-transform hover:-translate-y-0.5">
                {activeCopy.ctaBottom.btn}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Detailed Footer */}
      <footer className="py-16 border-t border-border/40 bg-card">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 text-start">
          {/* Company Brief */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <p className="text-2xl font-black tracking-tight text-foreground">
                {isAr ? "عيان" : "Eyan"}
                <span className="text-primary">.</span>
              </p>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              {activeCopy.footer.desc}
            </p>
          </div>

          {/* Links 1 */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">{activeCopy.footer.product}</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors">{isAr ? "الميزات" : "Features"}</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">{isAr ? "أوفلاين" : "Offline support"}</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">{activeCopy.footer.about}</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-muted-foreground">
              <li><a href="#testimonials" className="hover:text-primary transition-colors">{isAr ? "الأطباء" : "Success stories"}</a></li>
              <li><a href="/login" className="hover:text-primary transition-colors">{isAr ? "تسجيل الدخول" : "Sign In"}</a></li>
              <li><a href="/register" className="hover:text-primary transition-colors">{isAr ? "انضم إلينا" : "Register"}</a></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">{activeCopy.footer.legal}</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">{isAr ? "الشروط والأحكام" : "Terms & Conditions"}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{isAr ? "ملفات التعريف" : "Cookies Settings"}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-muted-foreground">
          <p>{activeCopy.footer.rights}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">Facebook</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
