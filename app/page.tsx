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

  // الكورسات
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

  // الامتحانات والنتائج
  const [exams, setExams] = useState<any[]>([
    {
      id: 1,
      title: "اختبار مادة العلوم والأحياء",
      instructor: "مروان الجندي",
      durationMinutes: 5,
      questions: [
        { id: 1, text: "ما هي وحدة بناء الكائن الحي؟", options: ["الخلية", "الذرة", "العضو", "النسيج"], correctOption: 0 },
        { id: 2, text: "أي الأجزاء التالية يوجد في الخلية النباتية ولا يوجد في الحيوانية؟", options: ["الجدار الخلوي", "النواة", "الميتوكوندريا", "الغشاء البلازمي"], correctOption: 0 }
      ]
    }
  ]);

  const [examResults, setExamResults] = useState<any[]>([]);

  // حقول إنشاء كورس جديد بواسطة المعلم (مع حقل اسم المعلم)
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('مجاناً 🎁');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // حقول إضافة فيديو للكورس (اختيار الكورس من القائمة أو كتابته)
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
      const savedUsers = localStorage.getItem('edu_users_db_v7');
      if (savedUsers) setUsersList(JSON.parse(savedUsers));

      const savedCourses = localStorage.getItem('edu_courses_v7');
      if (savedCourses) setCourses(JSON.parse(savedCourses));

      const savedExams = localStorage.getItem('edu_exams_v7');
      if (savedExams) setExams(JSON.parse(savedExams));

      const savedResults = localStorage.getItem('edu_results_v7');
      if (savedResults) setExamResults(JSON.parse(savedResults));

      const logged = localStorage.getItem('edu_logged_v7');
      if (logged === 'true') {
        setIsLoggedIn(true);
        setUserName(localStorage.getItem('edu_uname_v7') || '');
        setUserRole((localStorage.getItem('edu_urole_v7') as any) || 'student');
        const uData = localStorage.getItem('edu_ucdata_v7');
        if (uData) setCurrentUserData(JSON.parse(uData));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // حفظ البيانات
  useEffect(() => {
    try {
      localStorage.setItem('edu_users_db_v7', JSON.stringify(usersList));
      localStorage.setItem('edu_courses_v7', JSON.stringify(courses));
      localStorage.setItem('edu_exams_v7', JSON.stringify(exams));
      localStorage.setItem('edu_results_v7', JSON.stringify(examResults));
      localStorage.setItem('edu_logged_v7', isLoggedIn ? 'true' : 'false');
      localStorage.setItem('edu_uname_v7', userName);
      localStorage.setItem('edu_urole_v7', userRole);
      localStorage.setItem('edu_ucdata_v7', JSON.stringify(currentUserData));
    } catch (e) {
      console.error(e);
    }
  }, [usersList, courses, exams, examResults, isLoggedIn, userName, userRole, currentUserData]);

  // رصد الغش المتقدم
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
      handleCheatEvent('فقدان التركيز على النافذة');
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

  // إنشاء كورس جديد مع اسم المعلم
  const handleCreateNewCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle) {
      showToast('يرجى كتابة اسم الكورس!');
      return;
    }
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
    setNewCourseTitle('');
    setNewCourseInstructor('');
    setNewCourseDesc('');
    setNewCourseCategory('');
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

        {/* عرض الكورسات والفيديوهات */}
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
                    <p className="text-xs text-amber-400 mt-1 font-semibold">👨‍🏫 المعلم: {course.instructor}</p>
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
                <p className="text-xs text-rose-400 mt-1">⚠️ إنذارات الغش: {antiCheatWarnings} / 3</p>
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
            
            {/* 1. إنشاء كورس جديد وتحديد اسم المعلم */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-amber-400">📚 إنشاء كورس جديد وتحديد اسم المعلم</h2>
              <form onSubmit={handleCreateNewCourse} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">اسم الكورس</label>
                    <input type="text" required value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="مثال: أ/ مروان الجندي للعلوم والأحياء" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">اسم المعلم المسؤول</label>
                    <input type="text" value={newCourseInstructor} onChange={e => setNewCourseInstructor(e.target.value)} placeholder="مثال: مروان الجندي (اتركه فارغاً لاسمك)" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">التصنيف</label>
                    <input type="text" value={newCourseCategory} onChange={e => setNewCourseCategory(e.target.value)} placeholder="مثال: العلوم والأحياء" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">السعر</label>
                    <input type="text" value={newCoursePrice} onChange={e => setNewCoursePrice(e.target.value)} placeholder="مجاناً أو 200 ج.م" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">وصف مختصر</label>
                    <input type="text" value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} placeholder="وصف الكورس..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>
                <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition">
                  + إنشاء وإضافة الكورس للمنصة
                </button>
              </form>
            </div>

            {/* 2. إضافة فيديوهات للكورس */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-indigo-400">🎥 إضافة فيديوهات ودروس لأي كورس</h2>
              <form onSubmit={handleAddVideoToCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">اختر أو اكتب اسم الكورس المستهدف</label>
                  <input 
                    type="text" 
                    required 
                    value={selectedCourseForVideo} 
                    onChange={e => setSelectedCourseForVideo(e.target.value)} 
                    placeholder="اكتب اسم الكورس تماماً (مثال: أ/ مروان الجندي للعلوم والأحياء)" 
                    className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                  />
                  <p className="text-[11px] text-slate-400 mt-1">💡 إذا كان الكورس موجوداً سيتم إضافة الفيديو إليه، وإذا لم يكن موجوداً سيتم إنشاؤه تلقائياً!</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">عنوان الدرس / الفيديو</label>
                    <input type="text" required value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="مثال: الدرس الثاني: الانقسام الخلوي" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">مدة الفيديو</label>
                    <input type="text" value={newVideoDuration} onChange={e => setNewVideoDuration(e.target.value)} placeholder="15 دقيقة" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">رابط الفيديو (رابط MP4 أو رابط مباشر)</label>
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
                    <div key={qIndex} className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">نص السؤال {qIndex + 1}</label>
                        <input type="text" required value={q.text} onChange={e => {
                          const updated = [...builderQuestions];
                          updated[qIndex].text = e.target.value;
                          setBuilderQuestions(updated);
                        }} placeholder="اكتب السؤال هنا..." className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input type="radio" name={`correct-${qIndex}`} checked={q.correctOption === optIndex} onChange={() => {
                              const updated = [...builderQuestions];
                              updated[qIndex].correctOption = optIndex;
                              setBuilderQuestions(updated);
                            }} className="accent-emerald-500" />
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

                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-xs font-bold transition shadow-lg">
                  ✅ حفظ ونشر الامتحان للطلاب
                </button>
              </form>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}