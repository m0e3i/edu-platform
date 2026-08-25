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

  // حالة تسجيل الدخول (مع الاسترجاع التلقائي الدائم من التخزين المحلي)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'student' | 'instructor'>('student');
  const [currentUserData, setCurrentUserData] = useState<any>(null);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  
  // حقول التسجيل الإجبارية
  const [inputRegName, setInputRegName] = useState('');
  const [inputRegEmail, setInputRegEmail] = useState('');
  const [inputRegPhone, setInputRegPhone] = useState('');
  const [inputRegParentPhone, setInputRegParentPhone] = useState('');
  const [inputRegPassword, setInputRegPassword] = useState('');
  const [inputRegRole, setInputRegRole] = useState<'student' | 'instructor'>('student');

  // حقول تسجيل الدخول (البريد أو الهاتف + كلمة المرور)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // قاعدة بيانات المستخدمين (تشمل المعلم الافتراضي وأي طالب/معلم يسجل جديد ويتم حفظهم نهائياً)
  const [usersList, setUsersList] = useState<any[]>([
    { 
      name: 'أحمد المعلم', 
      email: 'teacher@edu.com', 
      phone: '01000000000', 
      parentPhone: 'غير متاح', 
      password: '123', 
      role: 'instructor' 
    }
  ]);

  // الكورسات
  const [courses, setCourses] = useState<any[]>([
    {
      id: 1,
      title: "أساسيات برمجة الويب (HTML & CSS)",
      instructor: "أحمد المعلم",
      category: "برمجة وتطوير",
      price: "مجاناً 🎁",
      description: "تعلم من الصفر كيفية بناء وتصميم صفحات الإنترنت الاحترافية.",
      lessons: [
        { id: 101, title: "الدرس الأول: مقدمة عن عالم الويب", duration: "10 دقائق", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ]
    }
  ]);

  // الامتحانات والنتائج
  const [exams, setExams] = useState<any[]>([
    {
      id: 1,
      title: "اختبار أساسيات HTML و CSS",
      instructor: "أحمد المعلم",
      durationMinutes: 5,
      questions: [
        { id: 1, text: "ما هي لغة استخدام تصميم صفحات الويب؟", options: ["HTML", "Python", "Java", "C++"], correctOption: 0 },
        { id: 2, text: "أي وسم يُستخدم لعمل رابط (Link)؟", options: ["<p>", "<a>", "<img>", "<div>"], correctOption: 1 }
      ]
    }
  ]);

  const [examResults, setExamResults] = useState<any[]>([]);

  // حقول إنشاء كورس جديد بواسطة المعلم
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('برمجة وتطوير');
  const [newCoursePrice, setNewCoursePrice] = useState('مجاناً 🎁');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // حقول إضافة فيديو للكورس
  const [selectedCourseForVideo, setSelectedCourseForVideo] = useState<number>(1);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('10 دقائق');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // حقول تصميم امتحان جديد
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamDuration, setNewExamDuration] = useState(10);
  const [builderQuestions, setBuilderQuestions] = useState<any[]>([
    { text: '', options: ['', '', '', ''], correctOption: 0 }
  ]);

  // حالات الامتحان الفعلي والوقت والغش المتقدم
  const [activeExam, setActiveExam] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<{ [qId: number]: number }>({});
  const [examTimeLeft, setExamTimeLeft] = useState(0);
  const [examStartTime, setExamStartTime] = useState<number>(0);
  const [antiCheatWarnings, setAntiCheatWarnings] = useState(0);
  const [cheatLogDetails, setCheatLogDetails] = useState<string[]>([]);

  // تحميل البيانات وحالة تسجيل الدخول عند فتح المتصفح أو عمل Refresh
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('edu_users_db_v8');
      if (savedUsers) setUsersList(JSON.parse(savedUsers));

      const savedCourses = localStorage.getItem('edu_courses_v8');
      if (savedCourses) setCourses(JSON.parse(savedCourses));

      const savedExams = localStorage.getItem('edu_exams_v8');
      if (savedExams) setExams(JSON.parse(savedExams));

      const savedResults = localStorage.getItem('edu_results_v8');
      if (savedResults) setExamResults(JSON.parse(savedResults));

      // استرجاع حالة تسجيل الدخول بشكل دائم
      const logged = localStorage.getItem('edu_logged_v8');
      if (logged === 'true') {
        setIsLoggedIn(true);
        setUserName(localStorage.getItem('edu_uname_v8') || '');
        setUserRole((localStorage.getItem('edu_urole_v8') as any) || 'student');
        const uData = localStorage.getItem('edu_ucdata_v8');
        if (uData) setCurrentUserData(JSON.parse(uData));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // حفظ البيانات وقاعدة بيانات المستخدمين وحالة تسجيل الدخول تلقائياً في التخزين المحلي
  useEffect(() => {
    try {
      localStorage.setItem('edu_users_db_v8', JSON.stringify(usersList));
      localStorage.setItem('edu_courses_v8', JSON.stringify(courses));
      localStorage.setItem('edu_exams_v8', JSON.stringify(exams));
      localStorage.setItem('edu_results_v8', JSON.stringify(examResults));
      
      // حفظ بيانات الجلسة الدائمة
      localStorage.setItem('edu_logged_v8', isLoggedIn ? 'true' : 'false');
      localStorage.setItem('edu_uname_v8', userName);
      localStorage.setItem('edu_urole_v8', userRole);
      localStorage.setItem('edu_ucdata_v8', JSON.stringify(currentUserData));
    } catch (e) {
      console.error(e);
    }
  }, [usersList, courses, exams, examResults, isLoggedIn, userName, userRole, currentUserData]);

  // رصد الغش المتقدم (Visibility Change + Window Blur)
  useEffect(() => {
    if (!activeExam) return;

    const handleCheatEvent = (reason: string) => {
      const timeNow = new Date().toLocaleTimeString('ar-EG');
      const logMsg = `[${timeNow}] ${reason}`;
      
      setCheatLogDetails(prev => [...prev, logMsg]);
      setAntiCheatWarnings(prev => {
        const nextVal = prev + 1;
        if (nextVal >= 3) {
          showToast(`⚠️ تم إنهاء الامتحان تلقائياً بسبب: ${reason} (تجاوز 3 محاولات خروج)!`);
          submitExam(true, reason);
        } else {
          showToast(`⚠️ محاولة خروج (${nextVal}/3): ${reason}! ممنوع مغادرة نافذة الامتحان.`);
        }
        return nextVal;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleCheatEvent('مغادرة نافذة المتصفح أو تصغيرها');
      }
    };

    const handleWindowBlur = () => {
      handleCheatEvent('فقدان التركيز على الشاشة (احتمال شاشة مزدوجة أو تطبيق خارجي)');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [activeExam]);

  // عداد الوقت للاختبار
  useEffect(() => {
    if (!activeExam || examTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setExamTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          showToast('⏰ انتهى وقت الامتحان!');
          submitExam(true, 'انتهاء الوقت المحدد');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeExam, examTimeLeft]);

  // إدارة تسجيل الحساب الجديد أو تسجيل الدخول بناءً على بيانات المستخدمين المحفوظة
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      const userExists = usersList.some(u => u.email === inputRegEmail || u.phone === inputRegPhone);
      if (userExists) {
        showToast('هذا البريد أو رقم الهاتف مسجل مسبقاً ⚠️ يرجى تسجيل الدخول مباشرة');
        setAuthMode('login');
        return;
      }
      const newUser = { 
        name: inputRegName, 
        email: inputRegEmail, 
        phone: inputRegPhone, 
        parentPhone: inputRegParentPhone, 
        password: inputRegPassword, 
        role: inputRegRole 
      };
      
      // إضافة المستخدم الجديد لقاعدة البيانات وحفظه نهائياً
      const updatedList = [...usersList, newUser];
      setUsersList(updatedList);
      
      setUserName(inputRegName);
      setUserRole(inputRegRole);
      setCurrentUserData(newUser);
      setIsLoggedIn(true);
      showToast(`أهلاً بك يا ${inputRegName}! 🎉 تم تسجيل حسابك وحفظ بيانات الدخول بنجاح`);
      setActiveTab('home');
    } else {
      // التحقق من المطابقة في قاعدة البيانات المسجلة مسبقاً
      const foundUser = usersList.find(u => 
        (u.email === loginIdentifier || u.phone === loginIdentifier) && u.password === loginPassword
      );

      if (foundUser) {
        setIsLoggedIn(true);
        setUserName(foundUser.name);
        setUserRole(foundUser.role);
        setCurrentUserData(foundUser);
        showToast(`مرحباً بعودتك يا ${foundUser.name}! ✅ تم تسجيل الدخول واستعادة بياناتك بنجاح`);
        setActiveTab('home');
      } else {
        showToast('خطأ في البيانات (تأكد من البريد أو رقم الهاتف وكلمة المرور الصحيحة) ❌');
      }
    }
  };

  // تسجيل الخروج اليدوي (مسح الجلسة فقط عند رغبة المستخدم في الخروج)
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setCurrentUserData(null);
    localStorage.removeItem('edu_logged_v8');
    localStorage.removeItem('edu_uname_v8');
    localStorage.removeItem('edu_urole_v8');
    localStorage.removeItem('edu_ucdata_v8');
    showToast('تم تسجيل الخروج بنجاح');
    setActiveTab('home');
  };

  // إنشاء كورس جديد
  const handleCreateNewCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle) {
      showToast('يرجى كتابة اسم الكورس!');
      return;
    }
    const newCourseObj = {
      id: Date.now(),
      title: newCourseTitle,
      instructor: userName || 'المعلم',
      category: newCourseCategory,
      price: newCoursePrice,
      description: newCourseDesc || 'كورس تعليمي جديد',
      lessons: []
    };
    setCourses([newCourseObj, ...courses]);
    showToast('✨ تم إنشاء الكورس بنجاح!');
    setNewCourseTitle('');
    setNewCourseDesc('');
  };

  // إضافة فيديو للكورس
  const handleAddVideoToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle) return;
    const updated = courses.map(c => {
      if (c.id === Number(selectedCourseForVideo)) {
        return {
          ...c,
          lessons: [...c.lessons, { id: Date.now(), title: newVideoTitle, duration: newVideoDuration, videoUrl: newVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4" }]
        };
      }
      return c;
    });
    setCourses(updated);
    showToast('🎥 تمت إضافة الفيديو بنجاح للكورس!');
    setNewVideoTitle('');
    setNewVideoUrl('');
  };

  // حفظ الامتحان
  const handleSaveFullExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (builderQuestions.some(q => !q.text || q.options.some((o: string) => !o))) {
      showToast('يرجى ملء كافة الأسئلة والخيارات!');
      return;
    }
    const newExamObj = {
      id: Date.now(),
      title: newExamTitle,
      instructor: userName || 'المعلم',
      durationMinutes: Number(newExamDuration),
      questions: builderQuestions
    };
    setExams([newExamObj, ...exams]);
    showToast('✨ تم نشر الامتحان بنجاح!');
    setNewExamTitle('');
    setBuilderQuestions([{ text: '', options: ['', '', '', ''], correctOption: 0 }]);
    setActiveTab('exams');
  };

  // بدء الامتحان
  const startExam = (exam: any) => {
    if (!isLoggedIn) {
      showToast('يجب تسجيل الدخول أولاً 🔒');
      setActiveTab('auth');
      return;
    }
    if (userRole === 'instructor') {
      showToast('حسابات المعلمين للإدارة فقط ولا تدخل كطالب 👨‍🏫');
      return;
    }
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setStudentAnswers({});
    setExamTimeLeft(exam.durationMinutes * 60);
    setExamStartTime(Date.now());
    setAntiCheatWarnings(0);
    setCheatLogDetails([]);
    setActiveTab('exam-room');
    showToast('🚀 بدأ الامتحان بنظام الحماية الفائق (ممنوع مغادرة الشاشة)!');
  };

  const submitExam = (isForced = false, reason = 'تسليم طبيعي ✅') => {
    if (!activeExam) return;
    let score = 0;
    activeExam.questions.forEach((q: any, idx: number) => {
      if (studentAnswers[idx] === q.correctOption) score += 1;
    });

    const elapsedSec = Math.floor((Date.now() - examStartTime) / 1000);
    const mins = Math.floor(elapsedSec / 60);
    const secs = elapsedSec % 60;
    const timeSpentStr = `${mins} دقيقة و ${secs} ثانية`;

    const activeStudent = currentUserData || {
      name: userName || 'طالب',
      email: 'غير متوفر',
      phone: 'غير متوفر',
      parentPhone: 'غير متوفر'
    };

    const resultEntry = {
      id: Date.now(),
      examTitle: activeExam.title,
      studentName: activeStudent.name,
      studentEmail: activeStudent.email || 'غير متوفر',
      studentPhone: activeStudent.phone || 'غير متوفر',
      parentPhone: activeStudent.parentPhone || 'غير متوفر',
      score: score,
      total: activeExam.questions.length,
      timeSpent: timeSpentStr,
      warningsCount: antiCheatWarnings,
      cheatLogs: [...cheatLogDetails],
      status: isForced ? `موقوف (${reason}) ⚠️` : 'تسليم طبيعي ✅',
      date: new Date().toLocaleDateString('ar-EG')
    };

    setExamResults(prev => [resultEntry, ...prev]);
    showToast(`🏁 انتهى الامتحان! درجتك: ${score} من ${activeExam.questions.length}`);
    setActiveExam(null);
    setActiveTab('exams');
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
            <button onClick={() => setActiveTab('exams')} className={activeTab === 'exams' ? 'text-indigo-500 font-bold' : ''}>الامتحانات 📝</button>
            {isLoggedIn && userRole === 'instructor' && (
              <button onClick={() => setActiveTab('instructor-dashboard')} className={activeTab === 'instructor-dashboard' ? 'text-amber-500 font-bold' : ''}>لوحة المعلم وإدارة المنصة 👨‍🏫</button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800 text-amber-400">
              {darkMode ? '☀️ نهار' : '🌙 ليل'}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-bold border border-indigo-500/30">
                  {userRole === 'instructor' ? '👨‍🏫 ' : '🎓 '} {userName}
                </span>
                <button onClick={handleLogout} className="bg-rose-500/20 text-rose-400 text-xs px-3 py-1 rounded-lg">خروج</button>
              </div>
            ) : (
              <button onClick={() => { setAuthMode('login'); setActiveTab('auth'); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow">
                دخول / تسجيل
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
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-90">نظام متكامل يتيح متابعة دقيقة وشاملة لبيانات الطلاب وأداءهم، مع حفظ دائم لبيانات الدخول لكل مستخدم ومعلم.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setActiveTab('exams')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold shadow-lg transition">
                  الامتحانات الحالية 📝
                </button>
                <button onClick={() => setActiveTab('courses')} className="bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition">
                  الكورسات التعليمية 🎥
                </button>
              </div>
            </div>
          </div>
        )}

        {/* عرض الكورسات */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold">الكورسات ودروس الفيديو 📚</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(course => (
                <div key={course.id} className={`p-6 rounded-3xl border shadow-lg space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">{course.category}</span>
                      <span className="text-xs font-bold text-emerald-400">{course.price}</span>
                    </div>
                    <h3 className="text-xl font-bold mt-3">{course.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">المعلم: {course.instructor}</p>
                    <p className="text-sm mt-2 opacity-80">{course.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-700">
                    <h4 className="text-xs font-bold text-amber-400">الفيديوهات والدروس ({course.lessons.length}):</h4>
                    {course.lessons.length === 0 ? (
                      <p className="text-xs text-slate-400">لا توجد دروس مضافة في هذا الكورس بعد.</p>
                    ) : (
                      course.lessons.map((lesson: any) => (
                        <div key={lesson.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span>📺 {lesson.title}</span>
                            <span className="text-slate-400">{lesson.duration}</span>
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

        {/* الامتحانات */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">الامتحانات المتاحة 📝</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {exams.map(exam => (
                <div key={exam.id} className={`p-6 rounded-2xl border flex flex-col justify-between ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">امتحان مؤمن ذكي</span>
                    <h3 className="text-xl font-bold mt-3 mb-2">{exam.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">المعلم: {exam.instructor} • المدة: {exam.durationMinutes} دقائق • الأسئلة: {exam.questions.length}</p>
                  </div>
                  <button onClick={() => startExam(exam)} className="bg-indigo-600 hover:bg-indigo-500 text-white w-full py-2.5 rounded-xl text-xs font-bold transition">
                    دخول الامتحان الآن 🚀
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* غرفة الامتحان */}
        {activeTab === 'exam-room' && activeExam && (
          <div 
            onCopy={(e) => e.preventDefault()} 
            onPaste={(e) => e.preventDefault()} 
            onContextMenu={(e) => e.preventDefault()}
            className={`max-w-3xl mx-auto p-8 rounded-3xl border shadow-2xl space-y-6 select-none ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}
          >
            <div className="flex justify-between items-center border-b pb-4 border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-indigo-400">{activeExam.title}</h2>
                <p className="text-xs text-rose-400 mt-1">⚠️ محاولات مغادرة الشاشة / الشاشات المزدوجة: {antiCheatWarnings} / 3</p>
              </div>
              <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 px-4 py-2 rounded-xl text-sm font-bold">
                ⏳ الوقت المتبقي: {Math.floor(examTimeLeft / 60)}:{(examTimeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-base">السؤال {currentQuestionIndex + 1} من {activeExam.questions.length}:</h3>
              <p className="text-lg bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                {activeExam.questions[currentQuestionIndex].text}
              </p>

              <div className="space-y-2 pt-2">
                {activeExam.questions[currentQuestionIndex].options.map((opt: string, optIdx: number) => (
                  <label key={optIdx} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${studentAnswers[currentQuestionIndex] === optIdx ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold' : 'bg-slate-900/20 border-slate-800 hover:bg-slate-800'}`}>
                    <input 
                      type="radio" 
                      name={`question-${currentQuestionIndex}`} 
                      checked={studentAnswers[currentQuestionIndex] === optIdx}
                      onChange={() => setStudentAnswers({...studentAnswers, [currentQuestionIndex]: optIdx})}
                      className="accent-indigo-500"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-700">
              <button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(prev => prev - 1)} className="px-4 py-2 bg-slate-800 text-xs rounded-xl disabled:opacity-50">السابق</button>
              {currentQuestionIndex < activeExam.questions.length - 1 ? (
                <button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="px-6 py-2 bg-indigo-600 text-xs font-bold rounded-xl">التالي</button>
              ) : (
                <button onClick={() => submitExam(false, 'تسليم طبيعي ✅')} className="px-6 py-2 bg-emerald-600 text-xs font-bold rounded-xl shadow-lg">تسليم نهائي ✅</button>
              )}
            </div>
          </div>
        )}

        {/* لوحة المعلم الكاملة */}
        {activeTab === 'instructor-dashboard' && isLoggedIn && userRole === 'instructor' && (
          <div className="space-y-12 max-w-6xl mx-auto">
            
            {/* 1. إنشاء كورس جديد */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-amber-400">📚 إنشاء كورس جديد وتسميته</h2>
              <form onSubmit={handleCreateNewCourse} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">اسم الكورس</label>
                    <input type="text" required value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="مثال: كورس الفيزياء المتقدمة" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">التصنيف</label>
                    <input type="text" value={newCourseCategory} onChange={e => setNewCourseCategory(e.target.value)} placeholder="مثال: برمجة، لغات، رياضيات..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">السعر</label>
                    <input type="text" value={newCoursePrice} onChange={e => setNewCoursePrice(e.target.value)} placeholder="مثال: مجاناً أو 200 ج.م" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">وصف مختصر للكورس</label>
                    <input type="text" value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} placeholder="ماذا سيتعلم الطالب في هذا الكورس؟" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>
                <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition">
                  + إنشاء وإضافة الكورس للمنصة
                </button>
              </form>
            </div>

            {/* 2. إضافة فيديو للكورس */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-indigo-400">🎥 إضافة فيديو / درس لأي كورس</h2>
              <form onSubmit={handleAddVideoToCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">اختر الكورس المستهدف</label>
                  <select value={selectedCourseForVideo} onChange={e => setSelectedCourseForVideo(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white">
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">عنوان الدرس</label>
                    <input type="text" required value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="عنوان الدرس..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">المدة</label>
                    <input type="text" value={newVideoDuration} onChange={e => setNewVideoDuration(e.target.value)} placeholder="15 دقيقة" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">رابط الفيديو (اختياري)</label>
                  <input type="text" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold">نشر الفيديو في الكورس</button>
              </form>
            </div>

            {/* 3. تصميم امتحان */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-amber-500">📝 تصميم امتحان جديد</h2>
              <form onSubmit={handleSaveFullExam} className="space-y-6">
                <div className="space-y-4 border-b pb-6 border-slate-700">
                  <div>
                    <label className="block text-xs font-medium mb-1">عنوان الامتحان</label>
                    <input type="text" required value={newExamTitle} onChange={e => setNewExamTitle(e.target.value)} placeholder="اسم الامتحان..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">المدة (بالدقائق)</label>
                    <input type="number" required value={newExamDuration} onChange={e => setNewExamDuration(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-indigo-400 text-sm">الأسئلة والخيارات والتصحيح الآلي</h3>
                    <button type="button" onClick={() => setBuilderQuestions([...builderQuestions, { text: '', options: ['', '', '', ''], correctOption: 0 }])} className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold">
                      + إضافة سؤال
                    </button>
                  </div>

                  {builderQuestions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 rounded-2xl border border-slate-700 bg-slate-900/40 space-y-3">
                      <span className="text-xs font-bold text-amber-400">سؤال {qIndex + 1}</span>
                      <input type="text" required value={q.text} onChange={e => {
                        const updated = [...builderQuestions];
                        updated[qIndex].text = e.target.value;
                        setBuilderQuestions(updated);
                      }} placeholder="نص السؤال..." className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {q.options.map((opt: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input type="radio" name={`correct-${qIndex}`} checked={q.correctOption === optIndex} onChange={() => {
                              const updated = [...builderQuestions];
                              updated[qIndex].correctOption = optIndex;
                              setBuilderQuestions(updated);
                            }} className="accent-emerald-500" title="اختر الإجابة الصحيحة" />
                            <input type="text" required value={opt} onChange={e => {
                              const updated = [...builderQuestions];
                              updated[qIndex].options[optIndex] = e.target.value;
                              setBuilderQuestions(updated);
                            }} placeholder={`الخيار ${optIndex + 1}`} className="w-full px-3 py-1.5 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button type="submit" className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg">نشر الامتحان للطلاب 🚀</button>
              </form>
            </div>

            {/* 4. تقارير الأداء التفصيلية */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-indigo-400">📊 تقارير الأداء التفصيلية، محاولات الخروج، وأرقام أولياء الأمور</h3>
                {examResults.length > 0 && (
                  <button onClick={() => setExamResults([])} className="bg-rose-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold">مسح السجل</button>
                )}
              </div>

              {examResults.length === 0 ? (
                <p className="text-xs text-slate-400">لا توجد نتائج اختبارات أو تقارير مسجلة حتى الآن.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className={`border-b ${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                      <tr>
                        <th className="p-3">الطالب</th>
                        <th className="p-3">البريد</th>
                        <th className="p-3">تلفون الطالب</th>
                        <th className="p-3">تلفون ولي الأمر 📞</th>
                        <th className="p-3">الامتحان</th>
                        <th className="p-3">الدرجة</th>
                        <th className="p-3">الوقت المستغرق ⏱️</th>
                        <th className="p-3">عدد محاولات الخروج ⚠️</th>
                        <th className="p-3">سجل أحداث الخروج الشاشي</th>
                        <th className="p-3">الحالة والتاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {examResults.map((res: any) => (
                        <tr key={res.id}>
                          <td className="p-3 font-bold">{res.studentName}</td>
                          <td className="p-3 text-slate-400">{res.studentEmail}</td>
                          <td className="p-3 text-slate-300">{res.studentPhone}</td>
                          <td className="p-3 text-amber-400 font-extrabold">{res.parentPhone}</td>
                          <td className="p-3">{res.examTitle}</td>
                          <td className="p-3 font-bold text-emerald-400">{res.score} / {res.total}</td>
                          <td className="p-3 font-semibold text-indigo-300">{res.timeSpent}</td>
                          <td className="p-3 text-rose-400 font-bold">🚨 {res.warningsCount} محاولات</td>
                          <td className="p-3 max-w-xs">
                            {res.cheatLogs && res.cheatLogs.length > 0 ? (
                              <div className="space-y-1 text-[10px] text-rose-300 bg-rose-950/30 p-2 rounded-lg border border-rose-900/50">
                                {res.cheatLogs.map((log: string, lIdx: number) => (
                                  <div key={lIdx}>• {log}</div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-emerald-400 font-medium">سليم (لا محاولات خروج)</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="block font-bold">{res.status}</span>
                            <span className="text-[10px] text-slate-400">{res.date}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* شاشة التسجيل والدخول */}
        {activeTab === 'auth' && (
          <div className={`max-w-md mx-auto p-8 rounded-3xl border shadow-2xl ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-center gap-4 mb-6 border-b pb-4 border-slate-700">
              <button onClick={() => setAuthMode('register')} className={`font-bold text-sm ${authMode === 'register' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-400'}`}>حساب جديد</button>
              <button onClick={() => setAuthMode('login')} className={`font-bold text-sm ${authMode === 'login' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-400'}`}>دخول</button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' ? (
                <>
                  <div>
                    <label className="block text-xs font-medium mb-1">الاسم الكامل</label>
                    <input type="text" required value={inputRegName} onChange={e => setInputRegName(e.target.value)} placeholder="اسم الطالب أو المعلم..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">البريد الإلكتروني (إجباري)</label>
                    <input type="email" required value={inputRegEmail} onChange={e => setInputRegEmail(e.target.value)} placeholder="user@mail.com" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">رقم التلفون الشخصي (إجباري)</label>
                    <input type="text" required value={inputRegPhone} onChange={e => setInputRegPhone(e.target.value)} placeholder="010xxxxxxxx" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">رقم تلفون ولي الأمر (للطلاب فقط 📞)</label>
                    <input type="text" value={inputRegParentPhone} onChange={e => setInputRegParentPhone(e.target.value)} placeholder="011xxxxxxxx" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">نوع الحساب</label>
                    <select value={inputRegRole} onChange={e => setInputRegRole(e.target.value as any)} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white">
                      <option value="student">طالب</option>
                      <option value="instructor">معلم</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">كلمة المرور</label>
                    <input type="password" required value={inputRegPassword} onChange={e => setInputRegPassword(e.target.value)} placeholder="••••" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium mb-1">البريد الإلكتروني أو رقم التلفون</label>
                    <input type="text" required value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} placeholder="أدخل إيميلك أو تلفونك المسجل..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">كلمة المرور</label>
                    <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </>
              )}
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm">
                {authMode === 'register' ? 'تسجيل وحفظ البيانات في المنصة' : 'تسجيل الدخول بالبيانات المحفوظة'}
              </button>
            </form>
          </div>
        )}

      </main>

      <footer className={`border-t py-6 text-center text-xs ${darkMode ? 'bg-[#1e293b] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
        <p>© 2026 EduBedaya. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}