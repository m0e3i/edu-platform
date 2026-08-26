'use client';
import { useState, useEffect } from 'react';

export default function EduPlatform() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  
  // نظام الإشعارات
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // حالة تسجيل الدخول
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'student' | 'instructor'>('student');
  const [currentUserData, setCurrentUserData] = useState<any>(null);

  // قاعدة بيانات المستخدمين والكورسات والامتحانات
  const [usersList, setUsersList] = useState<any[]>([
    { name: 'أحمد المعلم', email: 'teacher@edu.com', phone: '01000000000', parentPhone: 'غير متاح', password: '123', role: 'instructor' }
  ]);

  const [courses, setCourses] = useState<any[]>([
    {
      id: 2,
      title: "أ/ مروان الجندي للعلوم والأحياء",
      instructor: "مروان الجندي",
      category: "العلوم والأحياء",
      price: "مجاناً 🎁",
      description: "شرح مبسط وممتع لمنهج الأحياء والعلوم بطريقة احترافية.",
      lessons: [
        { id: 201, title: "الدرس الأول: مدخل إلى علم الأحياء والخلية", duration: "10 دقائق", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ]
    }
  ]);

  const [exams, setExams] = useState<any[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);

  // حقول إنشاء/تعديل كورس
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('مجاناً 🎁');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // حقول إضافة فيديو للكورس
  const [selectedCourseForVideo, setSelectedCourseForVideo] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('10 دقائق');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // تحميل البيانات
  useEffect(() => {
    try {
      const savedCourses = localStorage.getItem('edu_courses_v8');
      if (savedCourses) setCourses(JSON.parse(savedCourses));

      const logged = localStorage.getItem('edu_logged_v7');
      if (logged === 'true') {
        setIsLoggedIn(true);
        setUserName(localStorage.getItem('edu_uname_v7') || '');
        setUserRole((localStorage.getItem('edu_urole_v7'] as any) || 'student');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // حفظ البيانات
  useEffect(() => {
    try {
      localStorage.setItem('edu_courses_v8', JSON.stringify(courses));
    } catch (e) {
      console.error(e);
    }
  }, [courses]);

  // حذف كورس
  const handleDeleteCourse = (courseId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الكورس نهائياً؟')) {
      setCourses(courses.filter(c => c.id !== courseId));
      showToast('🗑️ تم حذف الكورس بنجاح');
    }
  };

  // بدء تعديل كورس
  const handleStartEditCourse = (course: any) => {
    setEditingCourseId(course.id);
    setNewCourseTitle(course.title);
    setNewCourseInstructor(course.instructor);
    setNewCourseCategory(course.category);
    setNewCoursePrice(course.price);
    setNewCourseDesc(course.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('✏️ قم بتعديل البيانات في لوحة التحكم بالأعلى');
  };

  // حفظ التعديل أو إنشاء كورس جديد
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle) {
      showToast('يرجى كتابة اسم الكورس!');
      return;
    }

    if (editingCourseId) {
      // تحديث كورس موجود
      setCourses(courses.map(c => c.id === editingCourseId ? {
        ...c,
        title: newCourseTitle,
        instructor: newCourseInstructor || userName || 'المعلم',
        category: newCourseCategory || 'عام',
        price: newCoursePrice,
        description: newCourseDesc
      } : c));
      showToast('✨ تم تحديث الكورس بنجاح!');
      setEditingCourseId(null);
    } else {
      // إنشاء كورس جديد
      const newCourseObj = {
        id: Date.now(),
        title: newCourseTitle,
        instructor: newCourseInstructor || userName || 'المعلم',
        category: newCourseCategory || 'عام',
        price: newCoursePrice,
        description: newCourseDesc || 'كورس تعليمي جديد',
        lessons: []
      };
      setCourses([newCourseObj, ...courses]);
      showToast('✨ تم إنشاء الكورس بنجاح!');
    }

    setNewCourseTitle('');
    setNewCourseInstructor('');
    setNewCourseDesc('');
    setNewCourseCategory('');
  };

  // حذف درس/فيديو من الكورس
  const handleDeleteLesson = (courseId: number, lessonId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
      setCourses(courses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            lessons: course.lessons.filter((l: any) => l.id !== lessonId)
          };
        }
        return course;
      }));
      showToast('🗑️ تم حذف الفيديو بنجاح');
    }
  };

  // إضافة فيديو للكورس المختار
  const handleAddVideoToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForVideo || !newVideoTitle) {
      showToast('يرجى اختيار أو كتابة اسم الكورس وعنوان الدرس!');
      return;
    }

    const courseIndex = courses.findIndex(c => c.title.trim().toLowerCase() === selectedCourseForVideo.trim().toLowerCase());
    const newLessonObj = {
      id: Date.now(),
      title: newVideoTitle,
      duration: newVideoDuration,
      videoUrl: newVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"
    };

    if (courseIndex !== -1) {
      const updated = [...courses];
      updated[courseIndex].lessons.push(newLessonObj);
      setCourses(updated);
      showToast('🎥 تمت إضافة الفيديو بنجاح للكورس الموجود!');
    } else {
      const newCourseObj = {
        id: Date.now(),
        title: selectedCourseForVideo,
        instructor: userName || 'المعلم',
        category: 'العلوم والأحياء',
        price: 'مجاناً 🎁',
        description: 'قسم تعليمي جديد.',
        lessons: [newLessonObj]
      };
      setCourses([newCourseObj, ...courses]);
      showToast('✨ تم إنشاء الكورس وإضافة الفيديو إليه!');
    }

    setNewVideoTitle('');
    setNewVideoUrl('');
    setSelectedCourseForVideo('');
  };

  return (
    <div className={`min-h-screen font-sans relative transition-colors duration-300 ${darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-900'}`} dir="rtl">
      
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm animate-bounce border border-indigo-400">
          {toastMessage}
        </div>
      )}

      {/* الهيدر */}
      <header className={`border-b sticky top-0 z-40 shadow-md ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold tracking-wider cursor-pointer" onClick={() => setActiveTab('home')}>
            <span className="text-indigo-500">EDU</span>
            <span className={darkMode ? 'text-white' : 'text-slate-800'}>BEDAYA</span>
          </div>

          <nav className="hidden md:flex gap-6 font-medium text-sm">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-indigo-500 font-bold' : ''}>الرئيسية</button>
            <button onClick={() => setActiveTab('courses')} className={activeTab === 'courses' ? 'text-indigo-500 font-bold' : ''}>الكورسات والفيديوهات 🎥</button>
            {isLoggedIn && userRole === 'instructor' && (
              <button onClick={() => setActiveTab('instructor-dashboard')} className={activeTab === 'instructor-dashboard' ? 'text-amber-500 font-bold' : ''}>لوحة التحكم وإدارة الكورسات 👨‍🏫</button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800 text-amber-400">
              {darkMode ? '☀️ نهار' : '🌙 ليل'}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-bold border border-indigo-500/30">
                  {userName}
                </span>
                <button onClick={() => { setIsLoggedIn(false); showToast('تم تسجيل الخروج'); setActiveTab('home'); }} className="bg-rose-500/20 text-rose-400 text-xs px-3 py-1 rounded-lg">خروج</button>
              </div>
            ) : (
              <button onClick={() => { setIsLoggedIn(true); setUserName('أحمد المعلم'); setUserRole('instructor'); showToast('تم الدخول كمعلم بنجاح!'); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow">
                دخول المعلم السريع 👨‍🏫
              </button>
            )}
          </div>
        </div>
      </header>

      {/* المحتوى */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 min-h-[600px]">

        {activeTab === 'home' && (
          <div className="space-y-12 text-center">
            <div className={`rounded-3xl p-12 border shadow-2xl ${darkMode ? 'bg-gradient-to-r from-indigo-900 to-slate-900 border-indigo-800' : 'bg-indigo-600 text-white'}`}>
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">منصة بداية التعليمية الذكية</h1>
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-90">إدارة الكورسات، وتعديلها، وحذف الفيديوهات والدروس بكل سهولة.</p>
              <button onClick={() => setActiveTab('courses')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold shadow-lg transition">
                تصفح الكورسات 🎥
              </button>
            </div>
          </div>
        )}

        {/* عرض الكورسات والفيديوهات (مع أرازر التعديل والحذف للمعلم) */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold">الكورسات ودروس الفيديو 📚</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(course => (
                <div key={course.id} className={`p-6 rounded-3xl border shadow-lg space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">{course.category}</span>
                      
                      {/* أزرار التعديل والحذف للكورس */}
                      {isLoggedIn && userRole === 'instructor' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleStartEditCourse(course)} className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg text-xs font-bold hover:bg-amber-500/30">
                            ✏️ تعديل
                          </button>
                          <button onClick={() => handleDeleteCourse(course.id)} className="bg-rose-500/20 text-rose-400 px-3 py-1 rounded-lg text-xs font-bold hover:bg-rose-500/30">
                            🗑️ حذف
                          </button>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mt-3">{course.title}</h3>
                    <p className="text-xs text-amber-400 mt-1 font-semibold">👨‍🏫 المعلم: {course.instructor}</p>
                    <p className="text-sm mt-2 opacity-80">{course.description}</p>
                  </div>

                  {/* قائمة الدروس والفيديوهات */}
                  <div className="space-y-3 pt-3 border-t border-slate-700">
                    <h4 className="text-xs font-bold text-amber-400">الفيديوهات والدروس ({course.lessons.length}):</h4>
                    {course.lessons.length === 0 ? (
                      <p className="text-xs text-slate-400">لا توجد دروس مضافة في هذا الكورس بعد.</p>
                    ) : (
                      course.lessons.map((lesson: any) => (
                        <div key={lesson.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span>📺 {lesson.title} ({lesson.duration})</span>
                            
                            {/* زر حذف الفيديو */}
                            {isLoggedIn && userRole === 'instructor' && (
                              <button onClick={() => handleDeleteLesson(course.id, lesson.id)} className="text-rose-400 hover:text-rose-300 text-[11px]">
                                ❌ حذف الدرس
                              </button>
                            )}
                          </div>
                          {lesson.videoUrl && (
                            <video controls className="w-full h-40 rounded-lg bg-black object-cover mt-1">
                              <source src={lesson.videoUrl} type="video/mp4" />
                            </video>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* لوحة التحكم (إضافة أو تعديل كورس) */}
        {activeTab === 'instructor-dashboard' && isLoggedIn && userRole === 'instructor' && (
          <div className="space-y-12 max-w-4xl mx-auto">
            
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-amber-400">
                  {editingCourseId ? '✏️ تعديل بيانات الكورس' : '📚 إنشاء كورس جديد'}
                </h2>
                {editingCourseId && (
                  <button onClick={() => { setEditingCourseId(null); setNewCourseTitle(''); setNewCourseInstructor(''); setNewCourseDesc(''); }} className="text-xs bg-slate-700 px-3 py-1.5 rounded-lg">إلغاء التعديل</button>
                )}
              </div>

              <form onSubmit={handleSaveCourse} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">اسم الكورس</label>
                    <input type="text" required value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="مثال: كورس الأحياء المتقدم" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">اسم المعلم المسؤول</label>
                    <input type="text" value={newCourseInstructor} onChange={e => setNewCourseInstructor(e.target.value)} placeholder="اسم المعلم..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">التصنيف</label>
                    <input type="text" value={newCourseCategory} onChange={e => setNewCourseCategory(e.target.value)} placeholder="التصنيف..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">السعر</label>
                    <input type="text" value={newCoursePrice} onChange={e => setNewCoursePrice(e.target.value)} placeholder="مجاناً أو 200 ج.م" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">وصف مختصر</label>
                    <input type="text" value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} placeholder="وصف..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>
                <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition">
                  {editingCourseId ? '💾 حفظ التعديلات' : '+ إنشاء الكورس'}
                </button>
              </form>
            </div>

            {/* إضافة فيديو لأي كورس */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-indigo-400">🎥 إضافة فيديو أو درس جديد لكورس</h2>
              <form onSubmit={handleAddVideoToCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">اسم الكورس المستهدف</label>
                  <input type="text" required value={selectedCourseForVideo} onChange={e => setSelectedCourseForVideo(e.target.value)} placeholder="اكتب اسم الكورس بالضبط..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">عنوان الدرس</label>
                    <input type="text" required value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="مثال: الدرس الأول" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">مدة الفيديو</label>
                    <input type="text" value={newVideoDuration} onChange={e => setNewVideoDuration(e.target.value)} placeholder="10 دقائق" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">رابط الفيديو (MP4)</label>
                  <input type="text" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold">نشر الفيديو</button>
              </form>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}