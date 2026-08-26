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

  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  
  // حقول التسجيل الإجبارية
  const [inputRegName, setInputRegName] = useState('');
  const [inputRegEmail, setInputRegEmail] = useState('');
  const [inputRegPhone, setInputRegPhone] = useState('');
  const [inputRegParentPhone, setInputRegParentPhone] = useState('');
  const [inputRegPassword, setInputRegPassword] = useState('');
  const [inputRegRole, setInputRegRole] = useState<'student' | 'instructor'>('student');

  // حقول تسجيل الدخول
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // قاعدة بيانات المستخدمين
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

  // الكورسات (مُحدثة لتشمل قسم أ/ مروان الجندي للعلوم والأحياء وخالية من الكورس القديم)
  const [courses, setCourses] = useState<any[]>([
    {
      id: 2,
      title: "أ/ مروان الجندي للعلوم والأحياء",
      instructor: "مروان الجندي",
      category: "العلوم والأحياء",
      price: "مجاناً 🎁",
      description: "شرح مبسط وممتع لمنهج الأحياء والعلوم للترمين بطريقة احترافية.",
      lessons: [
        { id: 201, title: "الدرس الأول: مدخل إلى علم الأحياء", duration: "15 دقيقة", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ]
    }
  ]);

  // الامتحانات والنتائج
  const [exams, setExams] = useState<any[]>([
    {
      id: 1,
      title: "اختبار مادة الأحياء والعلوم",
      instructor: "مروان الجندي",
      durationMinutes: 5,
      questions: [
        { id: 1, text: "ما هي الوحدة الأساسية بناءً لجسم الكائن الحي؟", options: ["الخلية", "العضو", "النسيج", "الجهاز"], correctOption: 0 },
        { id: 2, text: "أي الأجزاء التالية مسؤول عن التكاثر في الخلية؟", options: ["النواة", "الغشاء البلازمي", "السيتوبلازم", "الميتوكوندريا"], correctOption: 0 }
      ]
    }
  ]);

  const [examResults, setExamResults] = useState<any[]>([]);

  // حقول إنشاء كورس جديد بواسطة المعلم
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('مجاناً 🎁');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // حقول إضافة فيديو للكورس (تم جعل الكورس المستهدف كتابةً حرة)
  const [selectedCourseForVideo, setSelectedCourseForVideo] = useState('');
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

  // تحميل البيانات
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('edu_users_db_v6');
      if (savedUsers) setUsersList(JSON.parse(savedUsers));

      const savedCourses = localStorage.getItem('edu_courses_v6');
      if (savedCourses) setCourses(JSON.parse(savedCourses));

      const savedExams = localStorage.getItem('edu_exams_v6');
      if (savedExams) setExams(JSON.parse(savedExams));

      const savedResults = localStorage.getItem('edu_results_v6');
      if (savedResults) setExamResults(JSON.parse(savedResults));

      const logged = localStorage.getItem('edu_logged_v6');
      if (logged === 'true') {
        setIsLoggedIn(true);
        setUserName(localStorage.getItem('edu_uname_v6') || '');
        setUserRole((localStorage.getItem('edu_urole_v6') as any) || 'student');
        const uData = localStorage.getItem('edu_ucdata_v6');
        if (uData) setCurrentUserData(JSON.parse(uData));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // حفظ البيانات
  useEffect(() => {
    try {
      localStorage.setItem('edu_users_db_v6', JSON.stringify(usersList));
      localStorage.setItem('edu_courses_v6', JSON.stringify(courses));
      localStorage.setItem('edu_exams_v6', JSON.stringify(exams));
      localStorage.setItem('edu_results_v6', JSON.stringify(examResults));
      localStorage.setItem('edu_logged_v6', isLoggedIn ? 'true' : 'false');
      localStorage.setItem('edu_uname_v6', userName);
      localStorage.setItem('edu_urole_v6', userRole);
      localStorage.setItem('edu_ucdata_v6', JSON.stringify(currentUserData));
    } catch (e) {
      console.error(e);
    }
  }, [usersList, courses, exams, examResults, isLoggedIn, userName, userRole, currentUserData]);

  // رصد الغش المتقدم (Visibility Change + Window Blur)
  useEffect(() => {
    if (!activeExam) return;

    const handleCheatEvent = (reason: string) => {
      setAntiCheatWarnings(prev => {
        const nextVal = prev + 1;
        if (nextVal >= 3) {
          showToast(`⚠️ تم إنهاء الامتحان تلقائياً بسبب: ${reason} (تجاوز 3 إنذارات)!`);
          submitExam(true, reason);
        } else {
          showToast(`⚠️ إنذار غش (${nextVal}/3) [${reason}]: ممنوع مغادرة نافذة الامتحان أو فتح شاشة جانبية!`);
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
      handleCheatEvent('فقدان التركيز على النافذة (احتمال تقسيم الشاشة أو فتح تطبيق خارجي)');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [activeExam, studentAnswers]);

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

  // تسجيل الدخول
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      const userExists = usersList.some(u => u.email === inputRegEmail || u.phone === inputRegPhone);
      if (userExists) {
        showToast('هذا البريد أو رقم الهاتف مسجل مسبقاً ⚠️');
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
      setUsersList(prev => [...prev, newUser]);
      setUserName(inputRegName);
      setUserRole(inputRegRole);
      setCurrentUserData(newUser);
      setIsLoggedIn(true);
      showToast(`أهلاً بك يا ${inputRegName}! 🎉 تم تسجيل حسابك بنجاح`);
      setActiveTab('home');
    } else {
      const foundUser = usersList.find(u => (u.email === loginIdentifier || u.phone === loginIdentifier) && u.password === loginPassword);
      if (foundUser) {
        setIsLoggedIn(true);
        setUserName(foundUser.name);
        setUserRole(foundUser.role);
        setCurrentUserData(foundUser);
        showToast(`مرحباً بعودتك يا ${foundUser.name}! ✅`);
        setActiveTab('home');
      } else {
        showToast('خطأ في البيانات (تأكد من البريد/الهاتف وكلمة المرور) ❌');
      }
    }
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
      category: newCourseCategory || 'عام',
      price: newCoursePrice,
      description: newCourseDesc || 'كورس تعليمي جديد',
      lessons: []
    };
    setCourses([newCourseObj, ...courses]);
    showToast('✨ تم إنشاء الكورس بنجاح!');
    setNewCourseTitle('');
    setNewCourseDesc('');
    setNewCourseCategory('');
  };

  // إضافة فيديو للكورس (باستخدام كتابة اسم الكورس المستهدف)
  const handleAddVideoToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForVideo || !newVideoTitle) {
      showToast('يرجى كتابة اسم الكورس المستهدف وعنوان الدرس!');
      return;
    }

    const courseIndex = courses.findIndex(c => c.title.trim().toLowerCase() === selectedCourseForVideo.trim().toLowerCase());

    if (courseIndex !== -1) {
      // إذا وُجد الكورس، أضف الفيديو إليه
      const updated = [...courses];
      updated[courseIndex].lessons.push({
        id: Date.now(),
        title: newVideoTitle,
        duration: newVideoDuration,
        videoUrl: newVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"
      });
      setCourses(updated);
      showToast('🎥 تمت إضافة الفيديو بنجاح للكورس الموجود!');
    } else {
      // إذا لم يكن موجوداً، قم بإنشاء كورس جديد بهذا الاسم وإضافة الفيديو له تلقائياً
      const newCourseObj = {
        id: Date.now(),
        title: selectedCourseForVideo,
        instructor: userName || 'المعلم',
        category: 'قسم عام',
        price: 'مجاناً 🎁',
        description: 'كورس تم إنشاؤه عبر إضافة درس جديد.',
        lessons: [
          { id: Date.now() + 1, title: newVideoTitle, duration: newVideoDuration, videoUrl: newVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4" }
        ]
      };
      setCourses([newCourseObj, ...courses]);
      showToast('✨ تم إنشاء الكورس المستهدف وإضافة الفيديو إليه بنجاح!');
    }

    setNewVideoTitle('');
    setNewVideoUrl('');
    setSelectedCourseForVideo('');
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
    setActiveTab('exam-room');
    showToast('🚀 بدأ الامتحان. ممنوع مغادرة الشاشة أو تصغير النافذة!');
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
                <button onClick={() => { setIsLoggedIn(false); setCurrentUserData(null); showToast('تم تسجيل الخروج'); setActiveTab('home'); }} className="bg-rose-500/20 text-rose-400 text-xs px-3 py-1 rounded-lg">خروج</button>
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
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-90">متابعة شاملة لبيانات الطلاب، منع الغش المتقدم (تتبع النوافذ والشاشات المزدوجة)، والوقت المستغرق بدقة.</p>
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

        {/* عرض الكورسات (يحتوي على قسم أ/ مروان الجندي للعلوم والأحياء) */}
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

        {/* غرفة الامتحان مع منع النسخ ورصد فقدان التركيز والشاشات المزدوجة */}
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
                <p className="text-xs text-rose-400 mt-1">⚠️ إنذارات الغش (مغادرة النافذة / تقسيم الشاشة): {antiCheatWarnings} / 3</p>
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

        {/* لوحة المعلم الكاملة وميزات إنشاء الكورسات (لا تظهر إلا للمعلم المسجل دخوله) */}
        {activeTab === 'instructor-dashboard' && isLoggedIn && userRole === 'instructor' && (
          <div className="space-y-12 max-w-6xl mx-auto">
            
            {/* 1. إنشاء كورس جديد وتسميته */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-amber-400">📚 إنشاء كورس جديد وتسميته</h2>
              <form onSubmit={handleCreateNewCourse} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">اسم الكورس</label>
                    <input type="text" required value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="مثال: أ/ مروان الجندي للعلوم والأحياء" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">التصنيف</label>
                    <input type="text" value={newCourseCategory} onChange={e => setNewCourseCategory(e.target.value)} placeholder="مثال: العلوم والأحياء، برمجة، لغات..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
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

            {/* 2. إضافة فيديو للكورس (اختر الكورس المستهدف كتابةً) */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-indigo-400">🎥 إضافة فيديو / درس لأي كورس (كتابة اسم الكورس)</h2>
              <form onSubmit={handleAddVideoToCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">اختر الكورس المستهدف (اكتب اسم الكورس)</label>
                  <input 
                    type="text" 
                    required 
                    value={selectedCourseForVideo} 
                    onChange={e => setSelectedCourseForVideo(e.target.value)} 
                    placeholder="اكتب اسم الكورس تماماً (مثال: أ/ مروان الجندي للعلوم والأحياء)" 
                    className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                  />
                  <p className="text-[11px] text-slate-400 mt-1">💡 إذا كان الكورس موجوداً سيتم إضافة الدرس إليه، وإذا لم يكن موجوداً سيتم إنشاؤه تلقائياً باسمه!</p>
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
                            <input type="text" required value={opt} onChange={e => {
                              const updated = [...builderQuestions];
                              updated[qIndex].options[optIndex] = e.target.value;
                              setBuilderQuestions(updated);
                            }} placeholder={`الخيار ${optIndex + 1}`} className="w-full px-3 py-1.5 rounded-lg border text-xs bg-slate-900 border-slate-700 text-white" />
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        صيغة الإجابة الصحيحة (رقم الخيار 1 إلى 4):
                        <select value={q.correctOption} onChange={e => {
                          const updated = [...builderQuestions];
                          updated[qIndex].correctOption = Number(e.target.value);
                          setBuilderQuestions(updated);
                        }} className="mr-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white">
                          <option value={0}>الخيار الأول</option>
                          <option value={1}>الخيار الثاني</option>
                          <option value={2}>الخيار الثالث</option>
                          <option value={3}>الخيار الرابع</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-bold text-sm transition shadow-lg">
                  نشر الامتحان وإتاحته للطلاب 🚀
                </button>
              </form>
            </div>

          </div>
        )}

        {/* شاشة الدخول والتسجيل */}
        {activeTab === 'auth' && (
          <div className="max-w-md mx-auto p-8 rounded-3xl border shadow-2xl space-y-6 bg-[#1e293b] border-slate-800">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{authMode === 'register' ? 'إنشاء حساب جديد 🎓' : 'تسجيل الدخول 🔑'}</h2>
              <p className="text-xs text-slate-400">سجل بياناتك للمتابعة والدخول للاختبارات والكورسات</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-medium mb-1">الاسم الكامل</label>
                    <input type="text" required value={inputRegName} onChange={e => setInputRegName(e.target.value)} placeholder="اسمك..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">رقم الهاتف (للتواصل)</label>
                    <input type="text" required value={inputRegPhone} onChange={e => setInputRegPhone(e.target.value)} placeholder="010XXXXXXXX" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">رقم ولي الأمر (اختياري)</label>
                    <input type="text" value={inputRegParentPhone} onChange={e => setInputRegParentPhone(e.target.value)} placeholder="010XXXXXXXX" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">نوع الحساب</label>
                    <select value={inputRegRole} onChange={e => setInputRegRole(e.target.value as any)} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white">
                      <option value="student">طالب 🎓</option>
                      <option value="instructor">معلم 👨‍🏫</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium mb-1">{authMode === 'register' ? 'البريد الإلكتروني' : 'البريد أو رقم الهاتف'}</label>
                <input type="text" required value={authMode === 'register' ? inputRegEmail : loginIdentifier} onChange={e => authMode === 'register' ? setInputRegEmail(e.target.value) : setLoginIdentifier(e.target.value)} placeholder="example@mail.com" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">كلمة المرور</label>
                <input type="password" required value={authMode === 'register' ? inputRegPassword : loginPassword} onChange={e => authMode === 'register' ? setInputRegPassword(e.target.value) : setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
              </div>

              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg">
                {authMode === 'register' ? 'إتمام التسجيل 🎉' : 'دخول المنصة 🚀'}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-700">
              <button onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')} className="text-xs text-indigo-400 hover:underline">
                {authMode === 'register' ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ سجل الآن مجاناً'}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}