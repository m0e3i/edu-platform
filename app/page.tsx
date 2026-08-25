'use client';
import { useCallback, useMemo, useState } from 'react';
import Image from "next/image";
import { SignInButton, useUser } from "@clerk/nextjs";

// ============================================================================
// Static data & types — moved OUTSIDE the component so they are created ONCE
// instead of being re-allocated on every single render.
// ============================================================================

const WHATSAPP_NUMBER = "201222370381"; // رقم الواتساب المحدث الخاص بك

interface Destination {
  name: string;
  image: string;
  desc: string;
}

interface FeaturedTrip {
  title: string;
  image: string;
  price: string;
  duration: string;
  features: string[];
}

interface BiologyCourse {
  title: string;
  price: string;
  duration: string;
  description: string;
}

interface BookedTrip {
  id: number;
  title: string;
  date: string;
  status: string;
  price: string;
  image: string;
}

interface Payment {
  id: number;
  tripTitle: string;
  amount: string;
  status: string;
}

interface OptionDetails {
  price: string;
  image: string;
  date: string;
}

type TabKey =
  | 'destinations'
  | 'trips'
  | 'biology'
  | 'my-trips'
  | 'payments'
  | 'booking'
  | 'about';

const NAV_ITEMS: { key: TabKey; label: string }[] = [
  { key: 'destinations', label: 'الوجهات السياحية' },
  { key: 'trips', label: 'عروض الرحلات' },
  { key: 'biology', label: 'كورسات أ/ مروان الجندي 🎥' },
  { key: 'my-trips', label: 'حجوزاتي ✈️' },
  { key: 'payments', label: 'المدفوعات 💳' },
  { key: 'booking', label: 'حجز سريع' },
  { key: 'about', label: 'من نحن' },
];

const DESTINATIONS: Destination[] = [
  { name: "شرم الشيخ", image: "/images/destinations/sharm-night.jpg", desc: "استمتع بأروع العطلات والرحلات البحرية والترفيهية." },
  { name: "الغردقة", image: "/images/destinations/hurghada-beach.jpg", desc: "استمتع بأروع العطلات والرحلات البحرية والترفيهية." },
  { name: "مرسى علم", image: "/images/destinations/marsa-alam.jpg", desc: "استمتع بأروع العطلات والرحلات البحرية والترفيهية." },
  { name: "العين السخنة", image: "/images/destinations/sokhna-resort.jpg", desc: "استمتع بأروع العطلات والرحلات البحرية والترفيهية." },
  { name: "الأقصر وأسوان", image: "/images/destinations/luxor-aswan-nile.jpg", desc: "استمتع بأروع العطلات والرحلات البحرية والترفيهية." },
  { name: "مرسى مطروح", image: "/images/destinations/matrouh-ageeba.jpg", desc: "استمتع بأروع العطلات والرحلات البحرية والترفيهية." },
];

const FEATURED_TRIPS: FeaturedTrip[] = [
  {
    title: "رحلة شرم الشيخ - 4 أيام / 3 ليالي",
    image: "/images/destinations/sharm-night.jpg",
    price: "3,500 ج.م",
    duration: "4 أيام / 3 ليالي",
    features: ["شامل الإفطار والعشاء", "الانتقالات حديثة", "رحلة بحرية مجانية"],
  },
  {
    title: "عطلة الغردقة الفاخرة - 5 أيام / 4 ليالي",
    image: "/images/destinations/hurghada-beach.jpg",
    price: "14,000 ج.م",
    duration: "5 أيام / 4 ليالي",
    features: ["إقامة شاملة All Inclusive", "فندق 4 نجوم على البحر", "دخول الغواصة المائية"],
  },
  {
    title: "سحر الأقصر وأسوان - 4 أيام",
    image: "/images/destinations/luxor-aswan-nile.jpg",
    price: "15,500 ج.م",
    duration: "4 أيام / 3 ليالي",
    features: ["مرشد سياحي مرافق", "جميع تذاكر المزارات", "الإقامة بفندق نيلي"],
  },
];

const BIOLOGY_COURSES: BiologyCourse[] = [
  {
    title: "كورس الأحياء العامة - الثانوية العامة (الفصل الأول)",
    price: "450 ج.م",
    duration: "12 فيديو شرح تفصيلي + مذكرة",
    description: "شرح مبسط ومفصل لمنهج الأحياء مع حل أسئلة النظام الحديث ورسومات توضيحية.",
  },
  {
    title: "مراجعة ليلة الامتحان في الأحياء والعلوم",
    price: "250 ج.م",
    duration: "5 فيديوهات مكثفة",
    description: "تجميع أهم التكات والأسئلة المتوقعة في امتحانات الأحياء للأساتذة والطلاب.",
  },
  {
    title: "كورس أساسيات علم الأحياء والوراثة بالتفصيل",
    price: "350 ج.م",
    duration: "8 فيديوهات تعليمية",
    description: "كورس تأسيسي قوي يفهمك كل أسرار الوراثة والمسائل بطريقة سهلة ومبسطة.",
  },
];

const OPTION_DETAILS: Record<string, OptionDetails> = (() => {
  const map: Record<string, OptionDetails> = {};

  DESTINATIONS.forEach((dest) => {
    map[`${dest.name} (وجهة سياحية)`] = {
      price: dest.name.includes("الأقصر") ? "15,500 ج.م" : dest.name.includes("الغردقة") ? "14,000 ج.م" : "3,500 ج.م",
      image: dest.image,
      date: "قريباً (سبتمبر 2026)",
    };
  });

  FEATURED_TRIPS.forEach((trip) => {
    map[trip.title] = {
      price: trip.price,
      image: trip.image,
      date: "قريباً (سبتمبر 2026)",
    };
  });

  BIOLOGY_COURSES.forEach((course) => {
    map[`كورس: ${course.title}`] = {
      price: course.price,
      image: "/images/destinations/sharm-night.jpg",
      date: "متاح فوري أونلاين",
    };
  });

  return map;
})();

const DEFAULT_OPTION_DETAILS: OptionDetails = {
  price: "3,500 ج.م",
  date: "قريباً (سبتمبر 2026)",
  image: "/images/destinations/sharm-night.jpg",
};

function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function Home() {
  const { isSignedIn, user } = useUser();

  const [activeTab, setActiveTab] = useState<TabKey>('destinations');

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('شرم الشيخ (وجهة سياحية)');

  const [myBookedTrips, setMyBookedTrips] = useState<BookedTrip[]>([]);
  const [paymentsList, setPaymentsList] = useState<Payment[]>([]);

  const handleBookingSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const newTripId = Date.now();
      const details = OPTION_DETAILS[selectedDestination] ?? DEFAULT_OPTION_DETAILS;

      const newTrip: BookedTrip = {
        id: newTripId,
        title: selectedDestination,
        date: details.date,
        status: "بانتظار الدفع",
        price: details.price,
        image: details.image,
      };

      setMyBookedTrips((prev) => [...prev, newTrip]);
      setPaymentsList((prev) => [
        ...prev,
        {
          id: newTripId,
          tripTitle: selectedDestination,
          amount: newTrip.price,
          status: "غير مدفوعة (تتطلب الدفع الإلكتروني)",
        },
      ]);

      const message = `مرحباً، أريد تأكيد الحجز/الاشتراك في: ${selectedDestination}.\nالاسم: ${clientName}\nرقم الهاتف: ${clientPhone}`;
      window.open(buildWhatsAppUrl(message), '_blank');

      setActiveTab('my-trips');
    },
    [selectedDestination, clientName, clientPhone]
  );

  const handleOnlinePayment = useCallback((paymentId: number, tripTitle: string) => {
    alert(`جاري توجيهك إلى بوابة الدفع الآمنة لسداد قيمة: ${tripTitle}...`);

    setPaymentsList((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: "تم الدفع بنجاح ✅" } : p))
    );
    setMyBookedTrips((prev) =>
      prev.map((t) => (t.id === paymentId ? { ...t, status: "مؤكدة ومدفوعة 🌟" } : t))
    );

    setActiveTab('my-trips');
  }, []);

  const navLinkClass = useCallback(
    (tab: TabKey) =>
      `transition pb-1 ${activeTab === tab ? 'text-[#19B5A5] border-b-2 border-[#19B5A5] font-bold' : 'hover:text-[#19B5A5]'}`,
    [activeTab]
  );

  const heroButtonClass = useCallback(
    (tab: TabKey) =>
      `px-5 py-2.5 rounded-full font-bold text-sm transition shadow ${activeTab === tab ? 'bg-[#FF7A59] text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`,
    [activeTab]
  );

  const genericWhatsAppUrl = useMemo(
    () => buildWhatsAppUrl("مرحباً، أريد الاستفسار عن تفاصيل الرحلات أو كورسات أ/ مروان الجندي للأحياء."),
    []
  );
  const headerWhatsAppUrl = useMemo(
    () => buildWhatsAppUrl("مرحباً، أريد الاستفسار عن خدمات بداية ترافيل أو كورسات أ/ مروان الجندي للأحياء."),
    []
  );

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#172126] font-sans relative" dir="rtl">
      {/* Navbar */}
      <header className="bg-[#073B4C] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div
            className="text-xl sm:text-2xl font-bold tracking-wider flex items-center gap-2 cursor-pointer"
            onClick={() => setActiveTab('destinations')}
            dir="ltr"
          >
            <span className="text-[#19B5A5]">BEDAYA</span>
            <span className="text-white">TRAVEL</span>
          </div>

          <nav className="hidden lg:flex gap-4 font-medium text-sm">
            {NAV_ITEMS.map((item) => (
              <button key={item.key} onClick={() => setActiveTab(item.key)} className={navLinkClass(item.key)}>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button className="bg-slate-800 hover:bg-slate-700 text-white border border-[#19B5A5] px-3 sm:px-4 py-2 rounded-full font-semibold transition text-xs sm:text-sm">
                  تسجيل الدخول
                </button>
              </SignInButton>
            ) : (
              <span className="text-xs sm:text-sm bg-[#19B5A5]/20 text-[#19B5A5] px-3 py-1 rounded-full font-bold">
                أهلاً، {user?.firstName || 'مسافر/طالب'}
              </span>
            )}

            <a
              href={headerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#19B5A5] text-white px-3 sm:px-5 py-2 rounded-full font-semibold hover:bg-[#148f83] transition shadow text-center text-xs sm:text-sm"
            >
              تواصل معنا
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#006B7A] text-white py-12 sm:py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto z-10 relative">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            رحلتك السياحية والتعليمية تبدأ هنا مع <span className="text-[#FF7A59]">بداية ترافيل</span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-200 mb-6 leading-relaxed">
            استكشف أجمل الوجهات السياحية في مصر، وتابع أقوى كورسات وفيديوهات العلوم والأحياء مع{' '}
            <span className="text-amber-300 font-bold">أ/ مروان الجندي</span>.
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <button onClick={() => setActiveTab('destinations')} className={heroButtonClass('destinations')}>
              🏝️ أشهر الوجهات السياحية
            </button>
            <button onClick={() => setActiveTab('biology')} className={heroButtonClass('biology')}>
              🎥 كورسات أ/ مروان الجندي
            </button>
            <button onClick={() => setActiveTab('my-trips')} className={heroButtonClass('my-trips')}>
              ✈️ حجوزاتي المسجلة
            </button>
          </div>
        </div>
      </section>

      {/* Main Dynamic Content Area */}
      <main className="py-12 px-4 sm:px-6 max-w-7xl mx-auto min-h-[500px]">
        {activeTab === 'destinations' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#073B4C] mb-3">
                أشهر الوجهات السياحية 🏝️
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">استكشف أجمل المدن والمعالم السياحية في مصر واختر وجهتك المفضلة.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {DESTINATIONS.map((dest) => (
                <div key={dest.name} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition border border-gray-100 text-right flex flex-col justify-between">
                  <div className="h-44 sm:h-48 relative w-full overflow-hidden">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#073B4C]">{dest.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">{dest.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDestination(`${dest.name} (وجهة سياحية)`);
                        setActiveTab('booking');
                      }}
                      className="bg-[#073B4C] hover:bg-[#006B7A] text-white w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow text-center"
                    >
                      احجز رحلة إلى {dest.name} ←
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trips' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#073B4C] mb-3">عروض الرحلات المميزة 🌟</h2>
              <p className="text-gray-600 text-sm sm:text-base">اختر رحلتك القادمة من أفضل العروض المصممة خصيصاً لراحتك وميزانيتك.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURED_TRIPS.map((trip) => (
                <div key={trip.title} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="h-48 sm:h-52 relative w-full overflow-hidden">
                      <Image
                        src={trip.image}
                        alt={trip.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-4 right-4 bg-[#FF7A59] text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow z-10">
                        {trip.duration}
                      </span>
                    </div>
                    <div className="p-5 sm:p-6 text-right">
                      <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#073B4C]">{trip.title}</h3>
                      <ul className="text-gray-600 text-xs sm:text-sm mb-6 space-y-2">
                        {trip.features.map((feat) => (
                          <li key={feat} className="flex items-center gap-2">
                            <span className="text-[#19B5A5]">✓</span> {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="px-5 sm:px-6 pb-6 pt-0 flex items-center justify-between border-t border-gray-100 mt-4 pt-4">
                    <div>
                      <span className="text-xs text-gray-500 block">يبدأ من</span>
                      <span className="text-lg sm:text-xl font-extrabold text-[#006B7A]">{trip.price}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDestination(trip.title);
                        setActiveTab('booking');
                      }}
                      className="bg-[#073B4C] hover:bg-[#006B7A] text-white px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition shadow"
                    >
                      احجز العرض الآن
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'biology' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
              <span className="bg-[#19B5A5]/20 text-[#19B5A5] px-4 py-1.5 rounded-full font-bold text-sm inline-block mb-3">
                منصة العلوم والأحياء المعتمدة
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#073B4C] mb-3">
                كورسات وفيديوهات 🎥 أ/ مروان الجندي
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                استمتع بشرح مبسط وعميق لمناهج الأحياء والعلوم مع الأستاذ مروان الجندي، واشترك في الكورسات التفاعلية أونلاين.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {BIOLOGY_COURSES.map((course) => (
                <div key={course.title} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition border border-gray-100 flex flex-col justify-between text-right">
                  <div>
                    <div className="h-48 bg-[#073B4C] relative flex items-center justify-center text-white p-4 text-center">
                      <div className="absolute inset-0 bg-black/40 z-10"></div>
                      <div className="z-20">
                        <span className="text-4xl block mb-2">🧬</span>
                        <h4 className="font-bold text-sm sm:text-base">{course.title}</h4>
                        <span className="text-xs text-[#19B5A5] font-semibold mt-1 block">▶ معاينة فيديو الشرح</span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <span className="text-xs font-bold text-[#FF7A59] bg-[#FF7A59]/10 px-3 py-1 rounded-full mb-3 inline-block">
                        {course.duration}
                      </span>
                      <h3 className="text-lg font-bold text-[#073B4C] mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">{course.description}</p>
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 pb-6 pt-0 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-xs text-gray-500 block">رسوم الاشتراك</span>
                      <span className="text-lg font-extrabold text-[#006B7A]">{course.price}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDestination(`كورس: ${course.title}`);
                        setActiveTab('booking');
                      }}
                      className="bg-[#19B5A5] hover:bg-[#148f83] text-white px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition shadow"
                    >
                      اشترك في الكورس 🚀
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-trips' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-gray-200 animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#073B4C] mb-2">حجوزاتي وكورساتي المسجلة ✈️🎥</h2>
              <p className="text-gray-600 text-sm sm:text-base">هنا تجد كافة الرحلات والكورسات التعليمية التي قمت بالاشتراك فيها.</p>
            </div>

            {myBookedTrips.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="text-5xl mb-4">🧳</div>
                <p className="text-lg font-bold text-[#073B4C] mb-2">ليس لديك أي حجوزات أو كورسات مسجلة حتى الآن.</p>
                <p className="text-sm text-gray-500 mb-6">عند حجز رحلة أو الاشتراك في كورس للأحياء معنا، ستظهر هنا مباشرة!</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <button onClick={() => setActiveTab('destinations')} className="bg-[#19B5A5] hover:bg-[#148f83] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition">
                    تصفح الوجهات السياحية 🏝️
                  </button>
                  <button onClick={() => setActiveTab('biology')} className="bg-[#073B4C] hover:bg-[#006B7A] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition">
                    تصفح كورسات أ/ مروان الجندي 🎥
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBookedTrips.map((myTrip) => (
                  <div key={myTrip.id} className="bg-[#F7F3EA] rounded-2xl p-5 border border-gray-200 shadow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-[#073B4C] mb-2">{myTrip.title}</h3>
                      <p className="text-xs text-gray-600 mb-1">📅 الموعد: {myTrip.date}</p>
                      <p className="text-xs font-bold text-[#19B5A5] mb-2">💰 التكلفة: {myTrip.price}</p>
                      <p className="text-xs font-semibold text-[#FF7A59] mb-4">📌 الحالة: {myTrip.status}</p>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab('payments')}
                        className="w-full bg-[#19B5A5] text-white text-center py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#148f83] transition"
                      >
                        الذهاب لقسم المدفوعات وسداد القيمة 💳
                      </button>
                      <a
                        href={buildWhatsAppUrl(`مرحباً، أود الاستفسار وتأكيد تفاصيل اشتراكي/حجزي: ${myTrip.title}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-[#073B4C] text-white text-center py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#006B7A] transition"
                      >
                        المتابعة عبر واتساب 💬
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-gray-200 animate-fadeIn max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#073B4C] mb-2">قسم المدفوعات والفواتير 💳</h2>
              <p className="text-gray-600 text-sm sm:text-base">سدد قيمة رحلاتك أو كورساتك التعليمية بأمان تام عبر بوابة الدفع الإلكتروني.</p>
            </div>

            {paymentsList.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium mb-4">لا توجد فواتير أو مدفوعات معلقة حالياً.</p>
                <button onClick={() => setActiveTab('destinations')} className="bg-[#073B4C] text-white px-6 py-3 rounded-xl font-bold text-sm">
                  اختر وجهتك أو كورسّك المفضل لإنشاء فاتورة ودفعها
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentsList.map((payment) => (
                  <div key={payment.id} className="bg-[#F7F3EA] p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-[#073B4C]">{payment.tripTitle}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        المبلغ المطلوب: <span className="font-extrabold text-[#006B7A]">{payment.amount}</span>
                      </p>
                      <p className="text-xs font-bold text-amber-600 mt-1">الحالة: {payment.status}</p>
                    </div>

                    <div>
                      {payment.status.includes("تم الدفع") ? (
                        <span className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm inline-block shadow">
                          مدفوعة بنجاح ✔️
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOnlinePayment(payment.id, payment.tripTitle)}
                          className="bg-[#FF7A59] hover:bg-[#e06545] text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow-lg flex items-center gap-2"
                        >
                          <span>الدفع عبر بوابة الدفع الإلكتروني</span>
                          <span>🔒</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="max-w-3xl mx-auto animate-fadeIn">
            <div className="bg-[#073B4C] text-white p-6 sm:p-10 rounded-3xl shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">حجز رحلة أو اشتراك في كورس 💳</h2>
                <p className="text-gray-200 text-sm sm:text-base">سجل بياناتك لإضافة الطلب لقسم "حجوزاتي" وقسم "المدفوعات" فوراً.</p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="اكتب اسمك هنا..."
                    className="w-full px-4 py-3 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#19B5A5] text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">رقم الهاتف (واتساب للتواصل وتأكيد الحجز/الكورس)</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="اكتب رقم هاتفك..."
                    className="w-full px-4 py-3 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#19B5A5] text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اختر الرحلة السياحية أو الكورس التعليمي</label>
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#19B5A5] text-sm sm:text-base"
                  >
                    <optgroup label="الوجهات السياحية">
                      <option value="شرم الشيخ (وجهة سياحية)">شرم الشيخ (وجهة سياحية)</option>
                      <option value="الغردقة (وجهة سياحية)">الغردقة (وجهة سياحية)</option>
                      <option value="مرسى علم (وجهة سياحية)">مرسى علم (وجهة سياحية)</option>
                      <option value="الأقصر وأسوان (وجهة سياحية)">الأقصر وأسوان (وجهة سياحية)</option>
                    </optgroup>
                    <optgroup label="كورسات أ/ مروان الجندي للأحياء والعلوم">
                      {BIOLOGY_COURSES.map((course) => (
                        <option key={course.title} value={`كورس: ${course.title}`}>
                          كورس: {course.title}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#19B5A5] hover:bg-[#148f83] text-white py-4 rounded-xl font-bold text-base sm:text-lg transition shadow-lg"
                >
                  تأكيد الحجز والإضافة لقسم الحجوزات 🚀
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto text-center bg-white p-6 sm:p-10 rounded-3xl shadow-md border border-gray-100 animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#073B4C] mb-4">من نحن؟ ✈️🎥</h2>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-8 max-w-3xl mx-auto">
              نحن نجمع بين متعة السفر والسياحة في أروع الأماكن بمصر، وبين التفوق العلمي والتعليمي من خلال كورسات أ/ مروان الجندي المتميزة للعلوم والأحياء.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-right">
              <div className="bg-[#F7F3EA] p-5 sm:p-6 rounded-2xl">
                <h3 className="font-bold text-base sm:text-lg text-[#073B4C] mb-2">⭐ رحلات سياحية متميزة</h3>
                <p className="text-gray-600 text-xs sm:text-sm">أفضل العروض والأسعار لمختلف المدن السياحية بمصر.</p>
              </div>
              <div className="bg-[#F7F3EA] p-5 sm:p-6 rounded-2xl">
                <h3 className="font-bold text-base sm:text-lg text-[#073B4C] mb-2">🧬 شرح مبسط للأحياء</h3>
                <p className="text-gray-600 text-xs sm:text-sm">أقوى الكورسات والفيديوهات التعليمية مع الأستاذ مروان الجندي.</p>
              </div>
              <div className="bg-[#F7F3EA] p-5 sm:p-6 rounded-2xl">
                <h3 className="font-bold text-base sm:text-lg text-[#073B4C] mb-2">🛡️ دفع إلكتروني آمن</h3>
                <p className="text-gray-600 text-xs sm:text-sm">إدارة حجوزاتك وفواتيرك بكل سهولة ويسر وبدون تعقيد.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating WhatsApp Button */}
      <a
        href={genericWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-[#25D366] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-[#20ba5a] transition duration-300 z-50 flex items-center justify-center text-2xl sm:text-3xl animate-bounce"
        title="تواصل معنا عبر واتساب"
      >
        💬
      </a>

      {/* Footer */}
      <footer className="bg-[#073B4C] text-white py-8 text-center text-sm mt-12">
        <p>© 2026 Bedaya Travel & Biology Academy. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}