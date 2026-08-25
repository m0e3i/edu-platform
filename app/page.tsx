use client';

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { SignInButton, useUser } from "@clerk/nextjs";

type Tab =
  | "destinations"
  | "trips"
  | "biology"
  | "my-trips"
  | "payments"
  | "booking"
  | "about";

type Destination = {
  name: string;
  image: string;
  desc: string;
};

type FeaturedTrip = {
  title: string;
  image: string;
  price: string;
  duration: string;
  features: string[];
};

type BiologyCourse = {
  title: string;
  price: string;
  duration: string;
  description: string;
};

type Booking = {
  id: string;
  title: string;
  date: string;
  status: string;
  price: string;
  image: string;
};

type Payment = {
  id: string;
  tripTitle: string;
  amount: string;
  status: string;
};

const WHATSAPP_NUMBER = "201222370381";

const NAV_ITEMS: { id: Tab; label: string }[] = [
  { id: "destinations", label: "الوجهات السياحية" },
  { id: "trips", label: "عروض الرحلات" },
  { id: "biology", label: "كورسات أ/ مروان الجندي 🎥" },
  { id: "my-trips", label: "حجوزاتي ✈️" },
  { id: "payments", label: "المدفوعات 💳" },
  { id: "booking", label: "حجز سريع" },
  { id: "about", label: "من نحن" },
];

const DESTINATIONS: Destination[] = [
  {
    name: "شرم الشيخ",
    image: "/images/destinations/sharm-night.jpg",
    desc: "استمتع بأروع العطلات والرحلات البحرية والترفيهية.",
  },
  {
    name: "الغردقة",
    image: "/images/destinations/hurghada-beach.jpg",
    desc: "استمتع بأروع العطلات والرحلات البحرية والترفيهية.",
  },
  {
    name: "مرسى علم",
    image: "/images/destinations/marsa-alam.jpg",
    desc: "استمتع بأروع العطلات والرحلات البحرية والترفيهية.",
  },
  {
    name: "العين السخنة",
    image: "/images/destinations/sokhna-resort.jpg",
    desc: "استمتع بأروع العطلات والرحلات البحرية والترفيهية.",
  },
  {
    name: "الأقصر وأسوان",
    image: "/images/destinations/luxor-aswan-nile.jpg",
    desc: "استمتع بأروع العطلات والرحلات البحرية والترفيهية.",
  },
  {
    name: "مرسى مطروح",
    image: "/images/destinations/matrouh-ageeba.jpg",
    desc: "استمتع بأروع العطلات والرحلات البحرية والترفيهية.",
  },
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
    description:
      "شرح مبسط ومفصل لمنهج الأحياء مع حل أسئلة النظام الحديث ورسومات توضيحية.",
  },
  {
    title: "مراجعة ليلة الامتحان في الأحياء والعلوم",
    price: "250 ج.م",
    duration: "5 فيديوهات مكثفة",
    description:
      "تجميع أهم التكات والأسئلة المتوقعة في امتحانات الأحياء للأساتذة والطلاب.",
  },
  {
    title: "كورس أساسيات علم الأحياء والوراثة بالتفصيل",
    price: "350 ج.م",
    duration: "8 فيديوهات تعليمية",
    description:
      "كورس تأسيسي قوي يفهمك كل أسرار الوراثة والمسائل بطريقة سهلة ومبسطة.",
  },
];

const WHATSAPP_MESSAGE =
  "مرحباً، أريد الاستفسار عن خدمات بداية ترافيل أو كورسات أ/ مروان الجندي للأحياء.";

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function getPrice(title: string) {
  if (title.includes("الأقصر")) return "15,500 ج.م";
  if (title.includes("الغردقة")) return "14,000 ج.م";
  if (title.includes("كورس")) return "450 ج.م";
  return "3,500 ج.م";
}

function getImage(title: string) {
  if (title.includes("الأقصر")) return "/images/destinations/luxor-aswan-nile.jpg";
  if (title.includes("الغردقة")) return "/images/destinations/hurghada-beach.jpg";
  return "/images/destinations/sharm-night.jpg";
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#073B4C] mb-3">
        {title}
      </h2>
      <p className="text-gray-600 text-sm sm:text-base">{description}</p>
    </div>
  );
}

function DestinationCard({
  destination,
  onBook,
}: {
  destination: Destination;
  onBook: (name: string) => void;
}) {
  return (
    <article className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition border border-gray-100 flex flex-col">
      <div className="h-44 sm:h-48 relative w-full overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition duration-500"
        />
      </div>
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#073B4C]">
          {destination.name}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed flex-1">
          {destination.desc}
        </p>
        <button
          onClick={() => onBook(destination.name)}
          className="bg-[#073B4C] hover:bg-[#006B7A] text-white w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm transition"
        >
          احجز رحلة إلى {destination.name} ←
        </button>
      </div>
    </article>
  );
}

function TripCard({
  trip,
  onBook,
}: {
  trip: FeaturedTrip;
  onBook: (title: string) => void;
}) {
  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition border border-gray-100 flex flex-col">
      <div className="h-48 sm:h-52 relative w-full overflow-hidden">
        <Image
          src={trip.image}
          alt={trip.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition duration-500"
        />
        <span className="absolute top-4 right-4 bg-[#FF7A59] text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
          {trip.duration}
        </span>
      </div>

      <div className="p-5 sm:p-6 text-right flex-1">
        <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#073B4C]">
          {trip.title}
        </h3>
        <ul className="text-gray-600 text-xs sm:text-sm space-y-2">
          {trip.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="text-[#19B5A5]">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-gray-500 block">يبدأ من</span>
          <span className="text-lg sm:text-xl font-extrabold text-[#006B7A]">
            {trip.price}
          </span>
        </div>
        <button
          onClick={() => onBook(trip.title)}
          className="bg-[#073B4C] hover:bg-[#006B7A] text-white px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition"
        >
          احجز العرض الآن
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const { isSignedIn, user } = useUser();

  const [activeTab, setActiveTab] = useState<Tab>("destinations");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(
    "شرم الشيخ (وجهة سياحية)"
  );

  const [myBookedTrips, setMyBookedTrips] = useState<Booking[]>([]);
  const [paymentsList, setPaymentsList] = useState<Payment[]>([]);

  const bookingOptions = useMemo(
    () => [
      ...DESTINATIONS.map((destination) => ({
        value: `${destination.name} (وجهة سياحية)`,
        label: `${destination.name} (وجهة سياحية)`,
      })),
      ...BIOLOGY_COURSES.map((course) => ({
        value: `كورس: ${course.title}`,
        label: `كورس: ${course.title}`,
      })),
    ],
    []
  );

  const goToBooking = (title: string) => {
    setSelectedDestination(
      title.startsWith("كورس:") || title.includes("(وجهة سياحية)")
        ? title
        : `${title} (وجهة سياحية)`
    );
    setActiveTab("booking");
  };

  const handleBookingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = crypto.randomUUID();
    const isCourse = selectedDestination.startsWith("كورس:");

    const newBooking: Booking = {
      id,
      title: selectedDestination,
      date: isCourse ? "متاح فوري أونلاين" : "قريباً (سبتمبر 2026)",
      status: "بانتظار الدفع",
      price: getPrice(selectedDestination),
      image: getImage(selectedDestination),
    };

    const newPayment: Payment = {
      id,
      tripTitle: selectedDestination,
      amount: newBooking.price,
      status: "غير مدفوعة (تتطلب الدفع الإلكتروني)",
    };

    setMyBookedTrips((prev) => [...prev, newBooking]);
    setPaymentsList((prev) => [...prev, newPayment]);

    window.open(
      whatsappUrl(
        `مرحباً، أريد تأكيد الحجز/الاشتراك في: ${selectedDestination}.\nالاسم: ${clientName}\nرقم الهاتف: ${clientPhone}`
      ),
      "_blank",
      "noopener,noreferrer"
    );

    setActiveTab("my-trips");
  };

  const handleOnlinePayment = (paymentId: string, tripTitle: string) => {
    alert(
      `جاري توجيهك إلى بوابة الدفع الآمنة لسداد قيمة: ${tripTitle}...`
    );

    setPaymentsList((prev) =>
      prev.map((payment) =>
        payment.id === paymentId
          ? { ...payment, status: "تم الدفع بنجاح ✅" }
          : payment
      )
    );

    setMyBookedTrips((prev) =>
      prev.map((booking) =>
        booking.id === paymentId
          ? { ...booking, status: "مؤكدة ومدفوعة 🌟" }
          : booking
      )
    );

    setActiveTab("my-trips");
  };

  return (
    <div
      className="min-h-screen bg-[#F7F3EA] text-[#172126] font-sans relative"
      dir="rtl"
    >
      {/* Navbar */}
      <header className="bg-[#073B4C] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-4">
          <button
            onClick={() => setActiveTab("destinations")}
            className="text-xl sm:text-2xl font-bold tracking-wider flex items-center gap-2 shrink-0"
            dir="ltr"
            aria-label="Bedaya Travel"
          >
            <span className="text-[#19B5A5]">BEDAYA</span>
            <span>TRAVEL</span>
          </button>

          <nav className="hidden lg:flex gap-4 font-medium text-sm">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`transition pb-1 ${
                  activeTab === item.id
                    ? "text-[#19B5A5] border-b-2 border-[#19B5A5] font-bold"
                    : "hover:text-[#19B5A5]"
                }`}
              >
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
                أهلاً، {user?.firstName || "مسافر/طالب"}
              </span>
            )}

            <a
              href={whatsappUrl(WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#19B5A5] text-white px-3 sm:px-5 py-2 rounded-full font-semibold hover:bg-[#148f83] transition text-center text-xs sm:text-sm"
            >
              تواصل معنا
            </a>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="lg:hidden overflow-x-auto border-t border-white/10">
          <nav className="flex gap-2 px-4 py-3 min-w-max">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                  activeTab === item.id
                    ? "bg-[#19B5A5] text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-[#006B7A] text-white py-12 sm:py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            رحلتك السياحية والتعليمية تبدأ هنا مع{" "}
            <span className="text-[#FF7A59]">بداية ترافيل</span>
          </h1>

          <p className="text-sm sm:text-lg text-gray-200 mb-6 leading-relaxed">
            استكشف أجمل الوجهات السياحية في مصر، وتابع أقوى كورسات وفيديوهات
            العلوم والأحياء مع{" "}
            <span className="text-amber-300 font-bold">أ/ مروان الجندي</span>.
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab("destinations")}
              className="px-5 py-2.5 rounded-full font-bold text-sm bg-white/20 hover:bg-white/30 transition"
            >
              🏝️ أشهر الوجهات السياحية
            </button>
            <button
              onClick={() => setActiveTab("biology")}
              className="px-5 py-2.5 rounded-full font-bold text-sm bg-white/20 hover:bg-white/30 transition"
            >
              🎥 كورسات أ/ مروان الجندي
            </button>
            <button
              onClick={() => setActiveTab("my-trips")}
              className="px-5 py-2.5 rounded-full font-bold text-sm bg-white/20 hover:bg-white/30 transition"
            >
              ✈️ حجوزاتي المسجلة
            </button>
          </div>
        </div>
      </section>

      <main className="py-12 px-4 sm:px-6 max-w-7xl mx-auto min-h-[500px]">
        {/* Destinations */}
        {activeTab === "destinations" && (
          <section>
            <SectionTitle
              title="أشهر الوجهات السياحية 🏝️"
              description="استكشف أجمل المدن والمعالم السياحية في مصر واختر وجهتك المفضلة."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {DESTINATIONS.map((destination) => (
                <DestinationCard
                  key={destination.name}
                  destination={destination}
                  onBook={goToBooking}
                />
              ))}
            </div>
          </section>
        )}

        {/* Featured trips */}
        {activeTab === "trips" && (
          <section>
            <SectionTitle
              title="عروض الرحلات المميزة 🌟"
              description="اختر رحلتك القادمة من أفضل العروض المصممة خصيصاً لراحتك وميزانيتك."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURED_TRIPS.map((trip) => (
                <TripCard key={trip.title} trip={trip} onBook={goToBooking} />
              ))}
            </div>
          </section>
        )}

        {/* Biology */}
        {activeTab === "biology" && (
          <section>
            <div className="text-center mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
              <span className="bg-[#19B5A5]/20 text-[#19B5A5] px-4 py-1.5 rounded-full font-bold text-sm inline-block mb-3">
                منصة العلوم والأحياء المعتمدة
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#073B4C] mb-3">
                كورسات وفيديوهات 🎥 أ/ مروان الجندي
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                استمتع بشرح مبسط وعميق لمناهج الأحياء والعلوم مع الأستاذ مروان
                الجندي، واشترك في الكورسات التفاعلية أونلاين.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {BIOLOGY_COURSES.map((course) => (
                <article
                  key={course.title}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition border border-gray-100 flex flex-col"
                >
                  <div className="h-48 bg-[#073B4C] flex items-center justify-center text-white p-4 text-center">
                    <div>
                      <span className="text-4xl block mb-2">🧬</span>
                      <h3 className="font-bold text-sm sm:text-base">
                        {course.title}
                      </h3>
                      <span className="text-xs text-[#19B5A5] font-semibold mt-1 block">
                        ▶ معاينة فيديو الشرح
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex-1">
                    <span className="text-xs font-bold text-[#FF7A59] bg-[#FF7A59]/10 px-3 py-1 rounded-full mb-3 inline-block">
                      {course.duration}
                    </span>
                    <h3 className="text-lg font-bold text-[#073B4C] mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-gray-500 block">
                        رسوم الاشتراك
                      </span>
                      <span className="text-lg font-extrabold text-[#006B7A]">
                        {course.price}
                      </span>
                    </div>
                    <button
                      onClick={() => goToBooking(`كورس: ${course.title}`)}
                      className="bg-[#19B5A5] hover:bg-[#148f83] text-white px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition"
                    >
                      اشترك في الكورس 🚀
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* My trips */}
        {activeTab === "my-trips" && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-gray-200">
            <SectionTitle
              title="حجوزاتي وكورساتي المسجلة ✈️🎥"
              description="هنا تجد كافة الرحلات والكورسات التعليمية التي قمت بالاشتراك فيها."
            />

            {myBookedTrips.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="text-5xl mb-4">🧳</div>
                <p className="text-lg font-bold text-[#073B4C] mb-2">
                  ليس لديك أي حجوزات أو كورسات مسجلة حتى الآن.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  عند حجز رحلة أو الاشتراك في كورس للأحياء معنا، ستظهر هنا
                  مباشرة!
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <button
                    onClick={() => setActiveTab("destinations")}
                    className="bg-[#19B5A5] hover:bg-[#148f83] text-white px-5 py-2.5 rounded-xl font-bold text-sm"
                  >
                    تصفح الوجهات السياحية 🏝️
                  </button>
                  <button
                    onClick={() => setActiveTab("biology")}
                    className="bg-[#073B4C] hover:bg-[#006B7A] text-white px-5 py-2.5 rounded-xl font-bold text-sm"
                  >
                    تصفح كورسات أ/ مروان الجندي 🎥
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBookedTrips.map((booking) => (
                  <article
                    key={booking.id}
                    className="bg-[#F7F3EA] rounded-2xl p-5 border border-gray-200 shadow flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-lg text-[#073B4C] mb-2">
                        {booking.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        📅 الموعد: {booking.date}
                      </p>
                      <p className="text-xs font-bold text-[#19B5A5] mb-2">
                        💰 التكلفة: {booking.price}
                      </p>
                      <p className="text-xs font-semibold text-[#FF7A59] mb-4">
                        📌 الحالة: {booking.status}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab("payments")}
                        className="w-full bg-[#19B5A5] text-white py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#148f83] transition"
                      >
                        الذهاب لقسم المدفوعات 💳
                      </button>
                      <a
                        href={whatsappUrl(
                          `مرحباً، أود الاستفسار وتأكيد تفاصيل اشتراكي/حجزي: ${booking.title}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-[#073B4C] text-white text-center py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#006B7A] transition"
                      >
                        المتابعة عبر واتساب 💬
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Payments */}
        {activeTab === "payments" && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-gray-200 max-w-4xl mx-auto">
            <SectionTitle
              title="قسم المدفوعات والفواتير 💳"
              description="سدد قيمة رحلاتك أو كورساتك التعليمية بأمان تام عبر بوابة الدفع الإلكتروني."
            />

            {paymentsList.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium mb-4">
                  لا توجد فواتير أو مدفوعات معلقة حالياً.
                </p>
                <button
                  onClick={() => setActiveTab("destinations")}
                  className="bg-[#073B4C] text-white px-6 py-3 rounded-xl font-bold text-sm"
                >
                  اختر وجهتك أو كورسّك المفضل لإنشاء فاتورة ودفعها
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentsList.map((payment) => (
                  <article
                    key={payment.id}
                    className="bg-[#F7F3EA] p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200"
                  >
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-[#073B4C]">
                        {payment.tripTitle}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        المبلغ المطلوب:{" "}
                        <span className="font-extrabold text-[#006B7A]">
                          {payment.amount}
                        </span>
                      </p>
                      <p className="text-xs font-bold text-amber-600 mt-1">
                        الحالة: {payment.status}
                      </p>
                    </div>

                    {payment.status.includes("تم الدفع") ? (
                      <span className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm">
                        مدفوعة بنجاح ✔️
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          handleOnlinePayment(payment.id, payment.tripTitle)
                        }
                        className="bg-[#FF7A59] hover:bg-[#e06545] text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow-lg"
                      >
                        الدفع عبر بوابة الدفع الإلكتروني 🔒
                      </button>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Booking */}
        {activeTab === "booking" && (
          <section className="max-w-3xl mx-auto">
            <div className="bg-[#073B4C] text-white p-6 sm:p-10 rounded-3xl shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  حجز رحلة أو اشتراك في كورس 💳
                </h2>
                <p className="text-gray-200 text-sm sm:text-base">
                  سجل بياناتك لإضافة الطلب لقسم "حجوزاتي" وقسم "المدفوعات"
                  فوراً.
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label htmlFor="client-name" className="block text-sm font-medium mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    required
                    value={clientName}
                    onChange={(event) => setClientName(event.target.value)}
                    placeholder="اكتب اسمك هنا..."
                    className="w-full px-4 py-3 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#19B5A5] text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label htmlFor="client-phone" className="block text-sm font-medium mb-2">
                    رقم الهاتف (واتساب للتواصل وتأكيد الحجز/الكورس)
                  </label>
                  <input
                    id="client-phone"
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(event) => setClientPhone(event.target.value)}
                    placeholder="اكتب رقم هاتفك..."
                    className="w-full px-4 py-3 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#19B5A5] text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label htmlFor="destination" className="block text-sm font-medium mb-2">
                    اختر الرحلة السياحية أو الكورس التعليمي
                  </label>
                  <select
                    id="destination"
                    value={selectedDestination}
                    onChange={(event) => setSelectedDestination(event.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#19B5A5] text-sm sm:text-base"
                  >
                    <optgroup label="الوجهات السياحية">
                      {bookingOptions
                        .filter((option) =>
                          option.value.includes("(وجهة سياحية)")
                        )
                        .map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </optgroup>

                    <optgroup label="كورسات أ/ مروان الجندي للأحياء والعلوم">
                      {bookingOptions
                        .filter((option) => option.value.startsWith("كورس:"))
                        .map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
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
          </section>
        )}

        {/* About */}
        {activeTab === "about" && (
          <section className="max-w-4xl mx-auto text-center bg-white p-6 sm:p-10 rounded-3xl shadow-md border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#073B4C] mb-4">
              من نحن؟ ✈️🎥
            </h2>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-8 max-w-3xl mx-auto">
              نحن نجمع بين متعة السفر والسياحة في أروع الأماكن بمصر، وبين
              التفوق العلمي والتعليمي من خلال كورسات أ/ مروان الجندي المتميزة
              للعلوم والأحياء.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-right">
              {[
                ["⭐ رحلات سياحية متميزة", "أفضل العروض والأسعار لمختلف المدن السياحية بمصر."],
                ["🧬 شرح مبسط للأحياء", "أقوى الكورسات والفيديوهات التعليمية مع الأستاذ مروان الجندي."],
                ["🛡️ دفع إلكتروني آمن", "إدارة حجوزاتك وفواتيرك بكل سهولة ويسر وبدون تعقيد."],
              ].map(([title, description]) => (
                <div key={title} className="bg-[#F7F3EA] p-5 sm:p-6 rounded-2xl">
                  <h3 className="font-bold text-base sm:text-lg text-[#073B4C] mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* WhatsApp */}
      <a
        href={whatsappUrl(
          "مرحباً، أريد الاستفسار عن تفاصيل الرحلات أو كورسات أ/ مروان الجندي للأحياء."
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-[#25D366] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-[#20ba5a] transition z-50 flex items-center justify-center text-2xl sm:text-3xl"
        title="تواصل معنا عبر واتساب"
        aria-label="تواصل معنا عبر واتساب"
      >
        💬
      </a>

      <footer className="bg-[#073B4C] text-white py-8 text-center text-sm mt-12">
        <p>© 2026 Bedaya Travel & Biology Academy. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
