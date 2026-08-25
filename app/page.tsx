'use client';
import { useState } from 'react';

export default function EduPlatform() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  
  const [userName, setUserName] = useState('');
  const [userEmailOrPhone, setUserEmailOrPhone] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState<'student' | 'instructor'>('student');
  
  const [registeredUser, setRegisteredUser] = useState({ 
    name: 'أحمد المعلم', 
    identifier: '01000000000', 
    password: '123', 
    role: 'instructor' as 'student' | 'instructor' 
  });

  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('برمجة وتطوير');
  const [newCoursePrice, setNewCoursePrice] = useState('مجاناً 🎁');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseImage, setNewCourseImage] = useState('');
  const [newCourseVideo, setNewCourseVideo] = useState('');

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "أساسيات برمجة الويب (HTML & CSS)",
      instructor: "أحمد العبد",
      category: "برمجة وتطوير",
      price: "مجاناً 🎁",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&auto=format&fit=crop&q=80",
      description: "تعلم من الصفر كيفية بناء وتصميم صفحات الإنترنت الاحترافية باستخدام أحدث تقنيات HTML5 و CSS3.",
      duration: "6 ساعات",
      lessons: [
        { id: 101, title: "الدرس الأول: مقدمة عن عالم الويب وكيف يعمل", duration: "10 دقائق", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
        { id: 102, title: "الدرس الثاني: الهيكل الأساسي لصفحة HTML", duration: "25 دقيقة", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
        { id: 103, title: "الدرس الثالث: تنسيق العناصر وتلوينها بـ CSS", duration: "30 دقيقة", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ]
    },
    {
      id: 2,
      title: "تطوير تطبيقات الجوال بـ React Native",
      instructor: "محمود حسن",
      category: "تطوير التطبيقات",
      price: "250 ج.م",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
      description: "ابنِ تطبيقات أندرويد و iOS حقيقية باستخدام لغة JavaScript ومكتبة React Native بكفاءة عالية.",
      duration: "10 ساعات",
      lessons: [
        { id: 201, title: "الدرس الأول: تهيئة بيئة العمل ومقدمة React Native", duration: "20 دقيقة", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ]
    }
  ]);

  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<{ [courseId: number]: number[] }>({});

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      setRegisteredUser({ name: userName, identifier: userEmailOrPhone, password: userPassword, role: userRole });
      setIsLoggedIn(true);
      alert(`تم إنشاء حساب (${userRole === 'instructor' ? 'معلم' : 'طالب'}) وتسجيل الدخول بنجاح!`);
      setActiveTab('home');
    } else {
      if (userEmailOrPhone === registeredUser.identifier && userPassword === registeredUser.password) {
        setIsLoggedIn(true);
        setUserName(registeredUser.name);
        setUserRole(registeredUser.role);
        alert('تم تسجيل الدخول بنجاح!');
        setActiveTab('home');
      } else {
        alert('بيانات الدخول غير صحيحة.');
      }
    }
  };

  const handleEnrollCourse = (course: any) => {
    if (!isLoggedIn) {
      alert('يجب تسجيل الدخول أولاً للانضمام للكورس.');
      setActiveTab('auth');
      return;
    }
    if (!myCourses.some(c => c.id === course.id)) {
      setMyCourses(prev => [...prev, course]);
    }
    setSelectedCourse(course);
    setActiveLesson(course.lessons[0]);
    setActiveTab('course-player');
  };

  const handleSaveCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || userRole !== 'instructor') {
      alert('عذراً، هذه الصلاحية خاصة بالمعلمين فقط.');
      return;
    }

    if (editingCourseId !== null) {
      setCourses(courses.map(c => c.id === editingCourseId ? {
        ...c,
        title: newCourseTitle,
        category: newCourseCategory,
        price: newCoursePrice,
        description: newCourseDesc,
        image: newCourseImage || c.image
      } : c));
      alert('تم تعديل الكورس بنجاح! ✏️');
      setEditingCourseId(null);
    } else {
      const newCourseObj = {
        id: Date.now(),
        title: newCourseTitle,
        instructor: userName,
        category: newCourseCategory,
        price: newCoursePrice,
        image: newCourseImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
        description: newCourseDesc,
        duration: "3 ساعات",
        lessons: [
          { id: Date.now() + 1, title: "الدرس التمهيدي: نظرة عامة على الكورس", duration: "15 دقيقة", videoUrl: newCourseVideo || "https://www.w3schools.com/html/mov_bbb.mp4" }
        ]
      };
      setCourses([newCourseObj, ...courses]);
      alert('تم إضافة الكورس الجديد بنجاح وأصبح متاحاً للطلاب! 🎉');
    }

    setNewCourseTitle('');
    setNewCourseDesc('');
    setNewCourseImage('');
    setNewCourseVideo('');
    setNewCourseCategory('برمجة وتطوير');
    setNewCoursePrice('مجاناً 🎁');
  };

  const handleEditClick = (course: any) => {
    if (userRole !== 'instructor') return;
    setEditingCourseId(course.id);
    setNewCourseTitle(course.title);
    setNewCourseCategory(course.category);
    setNewCoursePrice(course.price);
    setNewCourseDesc(course.description);
    setNewCourseImage(course.image);
    setActiveTab('instructor-dashboard');
  };

  const handleDeleteCourse = (courseId: number) => {
    if (userRole !== 'instructor') return;
    if (confirm('هل أنت متأكد من حذف هذا الكورس نهائياً؟')) {
      setCourses(courses.filter(c => c.id !== courseId));
      alert('تم حذف الكورس بنجاح.');
    }
  };

  const toggleLessonComplete = (lessonId: number) => {
    const courseId = selectedCourse.id;
    const currentList = completedLessons[courseId] || [];
    let updatedList;
    if (currentList.includes(lessonId)) {
      updatedList = currentList.filter(id => id !== lessonId);
    } else {
      updatedList = [...currentList, lessonId];
    }
    setCompletedLessons({
      ...completedLessons,
      [courseId]: updatedList
    });
  };

  const calculateProgress = (courseId: number, totalLessons: number) => {
    const completed = (completedLessons[courseId] || []).length;
    if (totalLessons === 0) return 0;
    return Math.round((completed / totalLessons) * 100);
  };

  return (
    <div className={`min-h-screen font-sans relative transition-colors duration-300 ${darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-900'}`} dir="rtl">
      
      {/* شريط التنقل العلوي */}
      <header className={`border-b sticky top-0 z-50 shadow-md transition-colors duration-300 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold tracking-wider flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <span className="text-indigo-500">EDU</span>
            <span className={darkMode ? 'text-white' : 'text-slate-800'}>BEDAYA</span>
          </div>

          <nav className="hidden md:flex gap-6 font-medium text-sm">
            <button onClick={() => setActiveTab('home')} className={`transition ${activeTab === 'home' ? 'text-indigo-500 font-bold' : 'hover:text-indigo-500'}`}>الرئيسية</button>
            <button onClick={() => setActiveTab('courses')} className={`transition ${activeTab === 'courses' ? 'text-indigo-500 font-bold' : 'hover:text-indigo-500'}`}>الكورسات</button>
            <button onClick={() => setActiveTab('my-courses')} className={`transition ${activeTab === 'my-courses' ? 'text-indigo-500 font-bold' : 'hover:text-indigo-500'}`}>كورساتي 📚</button>
            {isLoggedIn && userRole === 'instructor' && (
              <button onClick={() => setActiveTab('instructor-dashboard')} className={`transition ${activeTab === 'instructor-dashboard' ? 'text-amber-500 font-bold' : 'hover:text-amber-500'}`}>لوحة المعلم 👨‍🏫</button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-2 rounded-xl text-xs font-bold border transition ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-200 border-slate-300 text-slate-700'}`}
              title="تغيير المظهر"
            >
              {darkMode ? '☀️ نهار' : '🌙 ليل'}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-bold border border-indigo-500/30">
                  {userRole === 'instructor' ? '👨‍🏫 معلم: ' : '🎓 طالب: '} {userName}
                </span>
                <button onClick={() => { setIsLoggedIn(false); setActiveTab('home'); }} className="bg-rose-500/20 text-rose-400 text-xs px-3 py-1.5 rounded-lg">خروج</button>
              </div>
            ) : (
              <button onClick={() => { setAuthMode('login'); setActiveTab('auth'); }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm shadow">
                تسجيل الدخول / إنشاء حساب
              </button>
            )}
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 min-h-[600px]">

        {/* 1. الرئيسية */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            <div className={`rounded-3xl p-8 sm:p-12 border text-center shadow-2xl transition-colors duration-300 ${darkMode ? 'bg-gradient-to-r from-indigo-900 to-slate-900 border-indigo-800/50' : 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-white border-indigo-500'}`}>
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
                طور مهاراتك وانطلق في مستقبلك مع <span className="text-amber-400">بداية التعليمية</span>
              </h1>
              <p className={`text-sm sm:text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-slate-300' : 'text-indigo-100'}`}>
                منصة تعليمية متكاملة تتيح تتبع نسبة إنجازك للكورسات وتتيح للمعلمين إدارة كورساتهم بالكامل.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <button onClick={() => setActiveTab('courses')} className="bg-white text-indigo-900 hover:bg-indigo-50 px-6 py-3 rounded-xl font-bold shadow-lg transition">
                  استعرض الكورسات المتاحة 🚀
                </button>
                {(!isLoggedIn || userRole === 'instructor') && (
                  <button onClick={() => { if(!isLoggedIn) { setAuthMode('register'); setActiveTab('auth'); } else { setActiveTab('instructor-dashboard'); }}} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold shadow-lg transition">
                    أضف كورسك الخاص كمعلم 👨‍🏫
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. استعراض الكورسات */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">جميع الكورسات والدروس 📚</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {courses.map(course => (
                <div key={course.id} className={`rounded-2xl overflow-hidden border flex flex-col justify-between transition-colors duration-300 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
                  <div>
                    <img src={course.image} alt={course.title} className="w-full h-44 object-cover" />
                    <div className="p-5">
                      <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-md">{course.category}</span>
                      <h3 className={`font-bold text-lg mt-3 mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{course.title}</h3>
                      <p className="text-xs text-slate-400 mb-4">المدرب: {course.instructor} • {course.lessons.length} دروس</p>
                    </div>
                  </div>
                  <div className={`p-5 pt-0 flex items-center justify-between border-t mt-2 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className="font-bold text-indigo-500 text-sm">{course.price}</span>
                    <button onClick={() => handleEnrollCourse(course)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition">
                      ابدأ التعلم الآن
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. التسجيل */}
        {activeTab === 'auth' && (
          <div className={`max-w-md mx-auto p-8 rounded-3xl border shadow-2xl transition-colors duration-300 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`flex justify-center gap-4 mb-6 border-b pb-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <button onClick={() => setAuthMode('register')} className={`font-bold text-sm pb-1 ${authMode === 'register' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-400'}`}>إنشاء حساب جديد</button>
              <button onClick={() => setAuthMode('login')} className={`font-bold text-sm pb-1 ${authMode === 'login' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-400'}`}>تسجيل الدخول</button>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>الاسم الكامل</label>
                    <input type="text" required value={userName} onChange={e => setUserName(e.target.value)} placeholder="اكتب اسمك..." className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>نوع الحساب</label>
                    <select value={userRole} onChange={e => setUserRole(e.target.value as 'student' | 'instructor')} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
                      <option value="student">طالب (للدراسة ومتابعة الكورسات)</option>
                      <option value="instructor">معلم (لإنشاء وإدارة الكورسات)</option>
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>رقم الهاتف أو البريد الإلكتروني</label>
                <input type="text" required value={userEmailOrPhone} onChange={e => setUserEmailOrPhone(e.target.value)} placeholder="01012345678" className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>كلمة المرور</label>
                <input type="password" required value={userPassword} onChange={e => setUserPassword(e.target.value)} placeholder="••••••••" className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg transition">{authMode === 'register' ? 'إتمام التسجيل وانطلاق' : 'تسجيل الدخول'}</button>
            </form>
          </div>
        )}

        {/* 4. مشغل الدروس */}
        {activeTab === 'course-player' && selectedCourse && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-300 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div>
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">{selectedCourse.category}</span>
                <h1 className={`text-2xl sm:text-3xl font-extrabold mt-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{selectedCourse.title}</h1>
                <p className="text-slate-400 text-xs mt-1">المدرب: {selectedCourse.instructor}</p>
              </div>

              <div className="w-full sm:w-64 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="flex justify-between text-xs mb-1 font-bold">
                  <span className="text-indigo-400">نسبة إنجاز الكورس</span>
                  <span className="text-emerald-400">{calculateProgress(selectedCourse.id, selectedCourse.lessons.length)}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500" 
                    style={{ width: `${calculateProgress(selectedCourse.id, selectedCourse.lessons.length)}%` }}
                  ></div>
                </div>
              </div>

              <button onClick={() => setActiveTab('my-courses')} className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'}`}>
                العودة لكورساتي ↩
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className={`p-4 rounded-2xl border space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="aspect-video bg-black rounded-xl overflow-hidden relative border border-slate-800 shadow-inner">
                    {activeLesson ? (
                      <video key={activeLesson.videoUrl} controls className="w-full h-full object-cover" poster={selectedCourse.image}>
                        <source src={activeLesson.videoUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500">اختر درساً للبدء</div>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <h3 className={`font-bold text-base ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{activeLesson?.title}</h3>
                    {activeLesson && (
                      <button 
                        onClick={() => toggleLessonComplete(activeLesson.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition ${(completedLessons[selectedCourse.id] || []).includes(activeLesson.id) ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                      >
                        {(completedLessons[selectedCourse.id] || []).includes(activeLesson.id) ? 'تم إكمال الدرس ✔' : 'تحديد كمكتمل ⭕'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border flex flex-col ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className={`font-bold text-base mb-4 border-b pb-3 flex justify-between items-center ${darkMode ? 'border-slate-800 text-white' : 'border-slate-100 text-slate-800'}`}>
                  <span>محتوى الكورس</span>
                  <span className="text-xs text-indigo-400">{selectedCourse.lessons.length} دروس</span>
                </h3>
                <div className="space-y-2.5">
                  {selectedCourse.lessons.map((lesson: any, index: number) => {
                    const isDone = (completedLessons[selectedCourse.id] || []).includes(lesson.id);
                    return (
                      <div 
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between border ${activeLesson?.id === lesson.id ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400 font-bold' : darkMode ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${darkMode ? 'bg-slate-800 text-indigo-400' : 'bg-slate-200 text-indigo-600'}`}>{index + 1}</span>
                          <span className="text-xs">{lesson.title}</span>
                        </div>
                        <span className={`text-xs ${isDone ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>{isDone ? '✔' : '○'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. لوحة تحكم المعلم */}
        {activeTab === 'instructor-dashboard' && isLoggedIn && userRole === 'instructor' && (
          <div className={`max-w-2xl mx-auto p-8 rounded-3xl border shadow-2xl space-y-8 transition-colors duration-300 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div>
              <h2 className="text-2xl font-bold text-amber-500 mb-2">👨‍🏫 لوحة تحكم المعلم الشاملة</h2>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>أنشئ كورساً جديداً، أو قم بتعديل وحذف كورساتك الحالية بضغطة زر.</p>
            </div>

            <form onSubmit={handleSaveCourseSubmit} className={`space-y-4 border-b pb-8 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className="font-bold text-sm text-indigo-400">
                {editingCourseId !== null ? '✏️ تعديل بيانات الكورس الحالي:' : '➕ إضافة كورس جديد بالكامل:'}
              </h3>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>عنوان الكورس</label>
                <input type="text" required value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="مثال: احتراف قواعد البيانات" className={`w-full px-4 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>التصنيف</label>
                  <select value={newCourseCategory} onChange={e => setNewCourseCategory(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
                    <option value="برمجة وتطوير">برمجة وتطوير</option>
                    <option value="تطوير التطبيقات">تطوير التطبيقات</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>السعر</label>
                  <input type="text" required value={newCoursePrice} onChange={e => setNewCoursePrice(e.target.value)} placeholder="مجاناً 🎁" className={`w-full px-4 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>وصف الكورس</label>
                <textarea required rows={3} value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} placeholder="نبذة عن الكورس..." className={`w-full px-4 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>رابط صورة الغلاف</label>
                <input type="url" value={newCourseImage} onChange={e => setNewCourseImage(e.target.value)} placeholder="https://..." className={`w-full px-4 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg transition">
                  {editingCourseId !== null ? 'حفظ التعديلات 💾' : 'نشر الكورس الجديد 🚀'}
                </button>
                {editingCourseId !== null && (
                  <button type="button" onClick={() => { setEditingCourseId(null); setNewCourseTitle(''); setNewCourseDesc(''); }} className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-3 rounded-xl font-bold text-xs">
                    إلغاء
                  </button>
                )}
              </div>
            </form>

            <div className="space-y-4">
              <h3 className={`font-bold text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>إدارة الكورسات الحالية (تعديل / حذف):</h3>
              {courses.map(c => (
                <div key={c.id} className={`flex justify-between items-center p-3 rounded-xl border ${darkMode ? 'bg-slate-900/60 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                  <span className="text-xs font-medium">{c.title}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick(c)} className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                      تعديل ✏️
                    </button>
                    <button onClick={() => handleDeleteCourse(c.id)} className="bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                      حذف 🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. كورساتي */}
        {activeTab === 'my-courses' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">كورساتي المسجلة 🎓</h2>
            {myCourses.length === 0 ? (
              <div className={`text-center py-16 rounded-3xl border ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <p className="text-slate-400 text-sm mb-4">ليس لديك أي كورسات مسجلة حتى الآن.</p>
                <button onClick={() => setActiveTab('courses')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition">تصفح الكورسات</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myCourses.map(course => (
                  <div key={course.id} className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors duration-300 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div>
                      <h3 className="font-bold text-lg text-indigo-400 mb-2">{course.title}</h3>
                      <p className="text-xs text-slate-400 mb-4">المدرب: {course.instructor}</p>
                      
                      <div className="w-full bg-slate-900/50 p-2 rounded-xl border border-slate-700/50 mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">الإنجاز:</span>
                          <span className="text-emerald-400 font-bold">{calculateProgress(course.id, course.lessons.length)}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${calculateProgress(course.id, course.lessons.length)}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedCourse(course); setActiveLesson(course.lessons[0]); setActiveTab('course-player'); }} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white w-full py-2.5 rounded-xl text-xs font-bold transition">
                      متابعة الدروس والمشاهدة ▶️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      <footer className={`border-t py-6 text-center text-xs transition-colors duration-300 ${darkMode ? 'bg-[#1e293b] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
        <p>© 2026 EduBedaya. جميع الحقوق محفوظة للمنصة التعليمية.</p>
      </footer>
    </div>
  );
}