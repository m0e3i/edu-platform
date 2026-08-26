"use client";
import { useState } from 'react';
import { SignInButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const whatsappNumber = "201222370381"; // رقم الواتساب الخاص بك
  const { isSignedIn, user } = useUser();
  
  // القسم الافتراضي الذي يظهر فور فتح الموقع هو الكورسات
  const [activeTab, setActiveTab] = useState('courses');
  
  // حالات تخزين بيانات نموذج التسجيل أو الحجز في الكورس
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('كورس الأحياء العامة - الثانوية العامة (الفصل الأول)');

  // 1. قائمة الكورسات المسجلة للطالب
  const [myEnrolledCourses, setMyEnrolledCourses] = useState<any[]>([]);

  // 2. قائمة المدفوعات والفواتير الخاصة بالاشتراكات
  const [paymentsList, setPaymentsList] = useState<any[]>([]);

  // محاكاة الاشتراك في كورس جديد وإضافته لـ "كورساتي" و "المدفوعات"
  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourseId = Date.now();
    
    const newEnrollment = {
      id: newCourseId,
      title: selectedCourse,
      date: "متاح فوري أونلاين",
      status: "بانتظار الدفع",
      price: selectedCourse.includes("المراجعة النهائية") ? "250 ج.م" : selectedCourse.includes("الوراثة") ? "350 ج.م" : "450 ج.م",
    };

    // إضافة الكورس لقائمة كورسات الطالب المسجلة
    setMyEnrolledCourses(prev => [...prev, newEnrollment]);

    // إضافة فاتورة جديدة لقسم المدفوعات
    setPaymentsList(prev => [...prev, {
      id: newCourseId,
      courseTitle: selectedCourse,
      amount: newEnrollment.price,
      status: "غير مدفوعة (تتطلب تفعيل الاشتراك)"
    }]);

    // فتح واتساب للتواصل السريع وتأكيد الاشتراك
    const message = `مرحباً، أريد تأكيد الاشتراك في الكورس: ${selectedCourse}.\nالاسم: ${clientName}\nرقم الهاتف: ${clientPhone}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    // تحويل المستخدم تلقائياً لقسم "كورساتي المسجلة"
    setActiveTab('my-courses');
  };

  // محاكاة سداد رسوم الكورس عبر بوابة الدفع الإلكتروني
  const handleOnlinePayment = (paymentId: number, courseTitle: string) => {
    alert(`جاري توجيهك إلى بوابة الدفع الآمنة لسداد رسوم كورس: ${courseTitle}...`);
    
    setPaymentsList(prev => prev.map(p => p.id === paymentId ? { ...p, status: "تم الدفع وتفعيل الكورس بنجاح ✅" } : p));
    setMyEnrolledCourses(prev => prev.map(c => c.id === paymentId ? { ...c, status: "مفعل وجاهز للمشاهدة 🌟" } : c));
    
    setActiveTab('my-courses');
  };

  // قائمة الكورسات المتاحة على المنصة
  const availableCourses = [
    {
      title: "كورس الأحياء العامة - الثانوية العامة (الفصل الأول)",
      price: "450 ج.م",
      duration: "12 فيديو شرح تفصيلي + مذكرة PDF",
      description: "شرح مبسط ومفصل لمنهج الأحياء مع حل أسئلة النظام الحديث ورسومات توضيحية.",
      category: "الصف الثالث الثانوي"
    },
    {
      title: "مراجعة ليلة الامتحان في الأحياء والعلوم",
      price: "250 ج.م",
      duration: "5 فيديوهات مكثفة + ملخصات",
      description: "تجميع أهم التكات والأسئلة المتوقعة في امتحانات الأحياء بطريقة احترافية.",
      category: "مراجعات نهائية"
    },
    {
      title: "كورس أساسيات علم الأحياء والوراثة بالتفصيل",
      price: "350 ج.م",
      duration: "8 فيديوهات تعليمية",
      description: "كورس تأسيسي قوي يفهمك كل أسرار الوراثة والمسائل بطريقة سهلة ومبسطة.",
      category: "تأسيس علمي"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#172126] font-sans relative" dir="rtl">
      {/* Navbar */}
      <header className="bg-[#073B4C] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold tracking-wider flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('courses')} dir="ltr">
            <span className="text-[#19B5A5]">MARWAN</span>
            <span className="text-white">BIOLOGY</span>
          </div>
          
          <nav className="hidden lg:flex gap-4 font-medium text-sm">
            <button onClick={() => setActiveTab('courses')} className={`transition pb-1 ${activeTab === 'courses' ? 'text-[#19B5A5] border-b-2 border-[#19B5A5] font-bold' : 'hover:text-[#19B5A5]'}`}>
              الكورسات التعليمية 🎥
            </button>
            <button onClick={() => setActiveTab('my-courses')} className={`transition pb-1 ${activeTab === 'my-courses' ? 'text-[#19B5A5] border-b-2 border-[#19B5A5] font-bold' : 'hover:text-[#19B5A5]'}`}>
              كورساتي المسجلة 📚
            </button>
            <button onClick={() => setActiveTab('payments')} className={`transition pb-1 ${activeTab === 'payments' ? 'text-[#19B5A5] border-b-2 border-[#19B5A5] font-bold' : 'hover:text-[#19B5A5]'}`}>
              المدفوعات والفواتير 💳
            </button>
            <button onClick={() => setActiveTab('enroll')} className={`transition pb-1 ${activeTab === 'enroll' ? 'text-[#19B5A5] border-b-2 border-[#19B5A5] font-bold' : 'hover:text-[#19B5A5]'}`}>
              التسجيل في كورس
            </button>
            <button onClick={() => setActiveTab('about')} className={`transition pb-1 ${activeTab === 'about' ? 'text-[#19B5A5] border-b-2 border-[#19B5A5] font-bold' : 'hover:text-[#19B5A5]'}`}>
              عن المنصة والمعلم
            </button>
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
                أهلاً، {user?.firstName || 'طالبنا العزيز'}
              </span>
            )}

            <a 
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("مرحباً أستاذ مروان، أريد الاستفسار عن كورسات الأحياء والعلوم.")}`} 
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
          <span className="bg-[#FF7A59] text-white px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm inline-block mb-4 shadow">
            منصة أ/ مروان الجندي للعلوم والأحياء 🧬
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            تفوق في مادة الأحياء والعلوم بأبسط وأسهل الطرق
          </h1>
          <p className="text-sm sm:text-lg text-gray-200 mb-6 leading-relaxed max-w-2xl mx-auto">
            محتوى تعليمي تفاعلي، شرح مبسط، متابعة مستمرة، وحل أحدث أسئلة النظام الحديث لضمان الدرجة النهائية.
          </p>
          
          <div className="flex justify-center gap-3 flex-wrap">
            <button onClick={() => setActiveTab('courses')} className={`px-6 py-3 rounded-full font-bold text-sm transition shadow ${activeTab === 'courses' ? 'bg-[#FF7A59] text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}>
              🎥 تصفح الكورسات المتاحة
            </button>
            <button onClick={() => setActiveTab('my-courses')} className={`px-6 py-3 rounded-full font-bold text-sm transition shadow ${activeTab === 'my-courses' ? 'bg-[#FF7A59] text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}>
              📚 كورساتي المسجلة
            </button>
          </div>
        </div>
      </section>

      {/* Main Dynamic Content Area */}
      <main className="py-12 px-4 sm:px-6 max-w-7xl mx-auto min-h-[500px]">
        
        {/* 1. قسم الكورسات (الافتراضي) */}
        {activeTab === 'courses' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#073B4C] mb-3">
                الكورسات والفيديوهات التعليمية 🎥
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">اختر الكورس المناسب لك وابدأ رحلة التفوق الدراسي فوراً.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableCourses.map((course, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition border border-gray-100 flex flex-col justify-between text-right">
                  <div>
                    <div className="h-48 bg-[#073B4C] relative flex items-center justify-center text-white p-4 text-center">
                      <div className="absolute inset-0 bg-black/40 z-10"></div>
                      <span className="absolute top-4 right-4 bg-[#FF7A59] text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow">
                        {course.category}
                      </span>
                      <div className="z-20">
                        <span className="text-4xl block mb-2">🧬</span>
                        <h4 className="font-bold text-sm sm:text-base">{course.title}</h4>
                        <span className="text-xs text-[#19B5A5] font-semibold mt-1 block">▶ معاينة فيديو الشرح</span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <span className="text-xs font-bold text-[#19B5A5] bg-[#19B5A5]/10 px-3 py-1 rounded-full mb-3 inline-block">
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
                        setSelectedCourse(course.title);
                        setActiveTab('enroll');
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

        {/* 2. قسم كورساتي المسجلة */}
        {activeTab === 'my-courses' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-gray-200 animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#073B4C] mb-2">كورساتي المسجلة 📚</h2>
              <p className="text-gray-600 text-sm sm:text-base">هنا تجد كافة الفيديوهات والكورسات التي قمت بالاشتراك فيها.</p>
            </div>

            {myEnrolledCourses.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="text-5xl mb-4">📖</div>
                <p className="text-lg font-bold text-[#073B4C] mb-2">ليس لديك أي كورسات مسجلة حتى الآن.</p>
                <p className="text-sm text-gray-500 mb-6">عند اختيار أي كورس والاشتراك فيه، سيظهر هنا فوراً!</p>
                <button onClick={() => setActiveTab('courses')} className="bg-[#19B5A5] hover:bg-[#148f83] text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow">
                  تصفح الكورسات المتاحة 🎥
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myEnrolledCourses.map((myCourse) => (
                  <div key={myCourse.id} className="bg-[#F7F3EA] rounded-2xl p-5 border border-gray-200 shadow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-[#073B4C] mb-2">{myCourse.title}</h3>
                      <p className="text-xs text-gray-600 mb-1">📅 إتاحة المحتوى: {myCourse.date}</p>
                      <p className="text-xs font-bold text-[#19B5A5] mb-2">💰 الرسوم: {myCourse.price}</p>
                      <p className="text-xs font-semibold text-[#FF7A59] mb-4">📌 الحالة: {myCourse.status}</p>
                    </div>
                    <div className="space-y-2">
                      <button 
                        onClick={() => setActiveTab('payments')}
                        className="w-full bg-[#19B5A5] text-white text-center py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#148f83] transition"
                      >
                        الذهاب للمدفوعات وسداد الرسوم 💳
                      </button>
                      <a 
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`مرحباً أستاذ مروان، أود متابعة تفاصيل وتفعيل كورس: ${myCourse.title}`)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full bg-[#073B4C] text-white text-center py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#006B7A] transition"
                      >
                        متابعة الدعم عبر واتساب 💬
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. قسم المدفوعات والفواتير */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-gray-200 animate-fadeIn max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#073B4C] mb-2">قسم المدفوعات والفواتير 💳</h2>
              <p className="text-gray-600 text-sm sm:text-base">سدد رسوم كورساتك بأمان تام عبر وسائل الدفع المعتوحة.</p>
            </div>

            {paymentsList.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium mb-4">لا توجد فواتير أو رسوم معلقة حالياً.</p>
                <button onClick={() => setActiveTab('courses')} className="bg-[#073B4C] text-white px-6 py-3 rounded-xl font-bold text-sm">
                  اختر كورسك المفضل لإنشاء فاتورة اشتراك
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentsList.map((payment) => (
                  <div key={payment.id} className="bg-[#F7F3EA] p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-[#073B4C]">{payment.courseTitle}</h3>
                      <p className="text-sm text-gray-600 mt-1">المبلغ المطلوب: <span className="font-extrabold text-[#006B7A]">{payment.amount}</span></p>
                      <p className="text-xs font-bold text-amber-600 mt-1">الحالة: {payment.status}</p>
                    </div>
                    
                    <div>
                      {payment.status.includes("تم الدفع") ? (
                        <span className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm inline-block shadow">
                          مفعل ومدفوع ✔️
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleOnlinePayment(payment.id, payment.courseTitle)}
                          className="bg-[#FF7A59] hover:bg-[#e06545] text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow-lg flex items-center gap-2"
                        >
                          <span>دفع رسوم الكورس إلكترونياً</span>
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

        {/* 4. قسم التسجيل في الكورس */}
        {activeTab === 'enroll' && (
          <div className="max-w-3xl mx-auto animate-fadeIn">
            <div className="bg-[#073B4C] text-white p-6 sm:p-10 rounded-3xl shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">التسجيل والاشتراك في الكورس 📚</h2>
                <p className="text-gray-200 text-sm sm:text-base">سجل بياناتك للانضمام إلى الكورس وإضافة الفواتير في حسابك فوراً.</p>
              </div>

              <form onSubmit={handleEnrollSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم الطالب الثلاثي</label>
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
                  <label className="block text-sm font-medium mb-2">رقم الهاتف (واتساب لمتابعة الدروس والتفعيل)</label>
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
                  <label className="block text-sm font-medium mb-2">اختر الكورس المطلوب</label>
                  <select 
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#19B5A5] text-sm sm:text-base"
                  >
                    {availableCourses.map((c, i) => (
                      <option key={i} value={c.title}>{c.title} - {c.price}</option>
                    ))}
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#19B5A5] hover:bg-[#148f83] text-white py-4 rounded-xl font-bold text-base sm:text-lg transition shadow-lg"
                >
                  إتمام التسجيل والتوجه لكورساتي 🚀
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 5. قسم عن المنصة */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto text-center bg-white p-6 sm:p-10 rounded-3xl shadow-md border border-gray-100 animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#073B4C] mb-4">عن منصة أ/ مروان الجندي للأحياء 🧬</h2>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-8 max-w-3xl mx-auto">
              منصة تعليمية متخصصة تهدف إلى تبسيط علم الأحياء والعلوم للطلاب بأسلوب مبتكر وشيق، مع متابعة دورية واختبارات قياسية لتحقيق أعلى الدرجات.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-right">
              <div className="bg-[#F7F3EA] p-5 sm:p-6 rounded-2xl">
                <h3 className="font-bold text-base sm:text-lg text-[#073B4C] mb-2">🎥 شرح تفصيلي مبسط</h3>
                <p className="text-gray-600 text-xs sm:text-sm">فيديوهات بجودة عالية ورسومات توضيحية لكل أجزاء المنهج.</p>
              </div>
              <div className="bg-[#F7F3EA] p-5 sm:p-6 rounded-2xl">
                <h3 className="font-bold text-base sm:text-lg text-[#073B4C] mb-2">📝 تدريبات ونظام حديث</h3>
                <p className="text-gray-600 text-xs sm:text-sm">حل آلاف الأسئلة والتدريبات المتبعة في نظام امتحانات الثانوية.</p>
              </div>
              <div className="bg-[#F7F3EA] p-5 sm:p-6 rounded-2xl">
                <h3 className="font-bold text-base sm:text-lg text-[#073B4C] mb-2">🛡️ متابعة ودعم مستمر</h3>
                <p className="text-gray-600 text-xs sm:text-sm">تواصل مباشر وإجابة على كافة أسئلة الطلاب أولاً بأول.</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("مرحباً أستاذ مروان، أود الاستفسار عن كورسات الأحياء والعلوم.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-[#25D366] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-[#20ba5a] transition duration-300 z-50 flex items-center justify-center text-2xl sm:text-3xl animate-bounce"
        title="تواصل معنا عبر واتساب"
      >
        💬
      </a>

      {/* Footer */}
      <footer className="bg-[#073B4C] text-white py-8 text-center text-sm mt-12">
        <p>© 2026 Marwan Biology Academy. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}