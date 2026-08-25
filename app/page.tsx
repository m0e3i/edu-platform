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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('edu_logged_in') === 'true';
    }
    return false;
  });

  const [userName, setUserName] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('edu_user_name') || '';
    return '';
  });

  const [userRole, setUserRole] = useState<'student' | 'instructor'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('edu_user_role') as 'student' | 'instructor') || 'student';
    }
    return 'student';
  });

  const [currentUserData, setCurrentUserData] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edu_current_user_data');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  
  // حقول التسجيل الجديدة (الإيميل، رقم التلفون، رقم ولي الأمر)
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
  const [usersList, setUsersList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edu_users_database');
      if (saved) return JSON.parse(saved);
    }
    return [
      { 
        name: 'أحمد المعلم', 
        email: 'teacher@edu.com', 
        phone: '01000000000', 
        parentPhone: '-', 
        password: '123', 
        role: 'instructor' 
      }
    ];
  });

  // الكورسات وفيديوهاتها
  const [courses, setCourses] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edu_courses_list');
      if (saved) return JSON.parse(saved);
    }
    return [
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
    ];
  });

  // نظام الامتحانات والأسئلة والنتائج
  const [exams, setExams] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edu_exams_list');
      if (saved) return JSON.parse(saved);
    }
    return [
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
    ];
  });

  const [examResults, setExamResults] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edu_exam_results');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // حقول إضافة فيديو جديد بواسطة المعلم
  const [selectedCourseForVideo, setSelectedCourseForVideo] = useState<number>(1);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('10 دقائق');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // حقول لوحة المعلم لإنشاء امتحان جديد بالأسئلة والخيارات
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamDuration, setNewExamDuration] = useState(10);
  const [builderQuestions, setBuilderQuestions] = useState<any[]>([
    { text: '', options: ['', '', '', ''], correctOption: 0 }
  ]);

  // حالة الامتحان الحالي للطالب وحساب الوقت المنقضي بدقة
  const [activeExam, setActiveExam] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<{ [qId: number]: number }>({});
  const [examTimeLeft, setExamTimeLeft] = useState(0);
  const [examStartTime, setExamStartTime] = useState<number>(0);
  const [antiCheatWarnings, setAntiCheatWarnings] = useState(0);

  // مزامنة التخزين المحلي
  useEffect(() => {
    localStorage.setItem('edu_users_database', JSON.stringify(usersList));
    localStorage.setItem('edu_logged_in', isLoggedIn ? 'true' : 'false');
    localStorage.setItem('edu_user_name', userName);
    localStorage.setItem('edu_user_role', userRole);
    localStorage.setItem('edu_current_user_data', JSON.stringify(currentUserData));
    localStorage.setItem('edu_courses_list', JSON.stringify(courses));
    localStorage.setItem('edu_exams_list', JSON.stringify(exams));
    localStorage.setItem('edu_exam_results', JSON.stringify(examResults));
  }, [usersList, isLoggedIn, userName, userRole, currentUserData, courses, exams, examResults]);

  // مراقبة مغادرة الشاشة (الغش)
  useEffect(() => {
    if (!activeExam) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAntiCheatWarnings(prev => {
          const nextVal = prev + 1;
          if (nextVal >= 3) {
            showToast('⚠️ تم إنهاء الامتحان تلقائياً بسبب مغادرة الشاشة المتكررة!');
            submitExam(true);
          } else {
            showToast(`⚠️ تنبيه غش (${nextVal}/3): ممنوع مغادرة نافذة الامتحان!`);
          }
          return nextVal;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeExam, studentAnswers]);

  // عداد الوقت التنازلي للاختبار
  useEffect(() => {
    if (!activeExam || examTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setExamTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          showToast('⏰ انتهى وقت الامتحان!');
          submitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeExam, examTimeLeft]);

  // معالجة التسجيل والدخول
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
      showToast(`أهلاً بك يا ${inputRegName}! 🎉`);
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
        showToast('خطأ في البيانات المُدخلة (تأكد من البريد/الهاتف وكلمة المرور) ❌');
      }
    }
  };

  // دوال المعلم للإدارة
  const handleAddVideoToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle) {
      showToast('يرجى كتابة عنوان الفيديو!');
      return;
    }

    const updatedCourses = courses.map(c => {
      if (c.id === Number(selectedCourseForVideo)) {
        const newLesson = {
          id: Date.now(),
          title: newVideoTitle,
          duration: newVideoDuration,
          videoUrl: newVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"
        };
        return { ...c, lessons: [...c.lessons, newLesson] };
      }
      return c;
    });

    setCourses(updatedCourses);
    showToast('🎥 تمت إضافة الفيديو بنجاح للكورس!');
    setNewVideoTitle('');
    setNewVideoUrl('');
  };

  const handleDeleteExam = (examId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الامتحان نهائياً؟')) {
      setExams(exams.filter(ex => ex.id !== examId));
      showToast('🗑️ تم حذف الامتحان بنجاح');
    }
  };

  const handleDeleteAllResults = () => {
    if (confirm('هل أنت متأكد من مسح جميع نتائج الطلاب؟')) {
      setExamResults([]);
      showToast('🧹 تم مسح سجل النتائج بنجاح');
    }
  };

  // دوال بناء الأسئلة
  const handleAddQuestionToBuilder = () => {
    setBuilderQuestions([...builderQuestions, { text: '', options: ['', '', '', ''], correctOption: 0 }]);
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    const updated = [...builderQuestions];
    updated[index].text = text;
    setBuilderQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...builderQuestions];
    updated[qIndex].options[optIndex] = text;
    setBuilderQuestions(updated);
  };

  const handleCorrectOptionChange = (qIndex: number, optIndex: number) => {
    const updated = [...builderQuestions];
    updated[qIndex].correctOption = optIndex;
    setBuilderQuestions(updated);
  };

  const handleSaveFullExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (builderQuestions.some(q => !q.text || q.options.some((o: string) => !o))) {
      showToast('يرجى التأكد من ملء جميع الأسئلة وخياراتها!');
      return;
    }

    const newExamObj = {
      id: Date.now(),
      title: newExamTitle,
      instructor: userName,
      durationMinutes: Number(newExamDuration),
      questions: builderQuestions
    };

    setExams([newExamObj, ...exams]);
    showToast('✨ تم نشر الامتحان والأسئلة بنجاح للطلاب!');
    setNewExamTitle('');
    setNewExamDuration(10);
    setBuilderQuestions([{ text: '', options: ['', '', '', ''], correctOption: 0 }]);
    setActiveTab('exams');
  };

  // بدء وتسليم الامتحان للطالب وحساب الوقت المستغرق
  const startExam = (exam: any) => {
    if (!isLoggedIn) {
      showToast('يجب تسجيل الدخول أولاً 🔒');
      setActiveTab('auth');
      return;
    }
    if (userRole === 'instructor') {
      showToast('حسابات المعلمين مخصصة للإدارة ولا تدخل كطالب للامتحان 👨‍🏫');
      return;
    }
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setStudentAnswers({});
    setExamTimeLeft(exam.durationMinutes * 60);
    setExamStartTime(Date.now());
    setAntiCheatWarnings(0);
    setActiveTab('exam-room');
    showToast('🚀 بدء الامتحان. حافظ على تركيزك!');
  };

  const submitExam = (isForced = false) => {
    if (!activeExam) return;
    let score = 0;
    activeExam.questions.forEach((q: any, idx: number) => {
      if (studentAnswers[idx] === q.correctOption) score += 1;
    });

    // حساب الوقت المستغرق بالدقائق والثواني
    const elapsedTimeSeconds = Math.floor((Date.now() - examStartTime) / 1000);
    const mins = Math.floor(elapsedTimeSeconds / 60);
    const secs = elapsedTimeSeconds % 60;
    const timeSpentStr = `${mins} دقيقة و ${secs} ثانية`;

    const total = activeExam.questions.length;
    const resultEntry = {
      id: Date.now(),
      examTitle: activeExam.title,
      studentName: currentUserData?.name || userName,
      studentEmail: currentUserData?.email || 'غير متوفر',
      studentPhone: currentUserData?.phone || 'غير متوفر',
      parentPhone: currentUserData?.parentPhone || 'غير متوفر',
      score: score,
      total: total,
      timeSpent: timeSpentStr,
      warningsCount: antiCheatWarnings,
      status: isForced ? 'موقوف بسبب الغش ⚠️' : 'تسليم طبيعي ✅',
      date: new Date().toLocaleDateString('ar-EG')
    };

    setExamResults(prev => [resultEntry, ...prev]);
    showToast(`🏁 انتهى الامتحان! درجتك: ${score} من ${total}`);
    setActiveExam(null);
    setActiveTab('exams');
  };

  return (
    <div className={`min-h-screen font-sans relative transition-colors duration-300 ${darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-900'}`} dir="rtl">
      
      {/* إشعارات الـ Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm animate-bounce border border-indigo-400">
          {toastMessage}
        </div>
      )}

      {/* الشريط العلوي */}
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
              <button onClick={() => setActiveTab('instructor-dashboard')} className={activeTab === 'instructor-dashboard' ? 'text-amber-500 font-bold' : ''}>لوحة المعلم والتحكم 👨‍🏫</button>
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

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 min-h-[600px]">

        {activeTab === 'home' && (
          <div className="space-y-12 text-center">
            <div className={`rounded-3xl p-12 border shadow-2xl ${darkMode ? 'bg-gradient-to-r from-indigo-900 to-slate-900 border-indigo-800' : 'bg-indigo-600 text-white'}`}>
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">منصة بداية التعليمية وإدارة الامتحانات</h1>
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-90">متابعة شاملة لبيانات الطلاب، أرقام أولياء الأمور، رصد الغش، والوقت المستغرق بالدقة.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setActiveTab('exams')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold shadow-lg transition">
                  استعرض الامتحانات 📝
                </button>
                <button onClick={() => setActiveTab('courses')} className="bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition">
                  استعرض الكورسات والفيديوهات 🎥
                </button>
              </div>
            </div>
          </div>
        )}

        {/* الكورسات وفيديوهاتها */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold">الكورسات ودروس الفيديو 📚</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(course => (
                <div key={course.id} className={`p-6 rounded-3xl border shadow-lg space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">{course.category}</span>
                    <h3 className="text-xl font-bold mt-3">{course.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">المدرب: {course.instructor}</p>
                    <p className="text-sm mt-2 opacity-80">{course.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-700">
                    <h4 className="text-xs font-bold text-amber-400">الفيديوهات والدروس ({course.lessons.length}):</h4>
                    {course.lessons.map((lesson: any) => (
                      <div key={lesson.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span>📺 {lesson.title}</span>
                          <span className="text-slate-400">{lesson.duration}</span>
                        </div>
                        {lesson.videoUrl && (
                          <video controls className="w-full h-40 rounded-lg bg-black object-cover mt-1">
                            <source src={lesson.videoUrl} type="video/mp4" />
                            متصفحك لا يدعم عرض الفيديو.
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* قائمة الامتحانات */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">الامتحانات المتاحة للطلاب 📝</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {exams.map(exam => (
                <div key={exam.id} className={`p-6 rounded-2xl border flex flex-col justify-between ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">امتحان معتمد</span>
                    <h3 className="text-xl font-bold mt-3 mb-2">{exam.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">المعلم: {exam.instructor} • المدة: {exam.durationMinutes} دقائق • الأسئلة: {exam.questions.length}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startExam(exam)} className="bg-indigo-600 hover:bg-indigo-500 text-white flex-1 py-2.5 rounded-xl text-xs font-bold transition">
                      دخول الامتحان الآن 🚀
                    </button>
                    {isLoggedIn && userRole === 'instructor' && (
                      <button onClick={() => handleDeleteExam(exam.id)} className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition" title="حذف الامتحان">
                        🗑️ حذف
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* غرفة الامتحان */}
        {activeTab === 'exam-room' && activeExam && (
          <div className={`max-w-3xl mx-auto p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center border-b pb-4 border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-indigo-400">{activeExam.title}</h2>
                <p className="text-xs text-rose-400 mt-1">⚠️ تنبيهات مغادرة الشاشة (الغش): {antiCheatWarnings} / 3</p>
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
                <button onClick={() => submitExam(false)} className="px-6 py-2 bg-emerald-600 text-xs font-bold rounded-xl shadow-lg">تسليم نهائي ✅</button>
              )}
            </div>
          </div>
        )}

        {/* لوحة التحكم والتحكم الشامل للمعلم */}
        {activeTab === 'instructor-dashboard' && isLoggedIn && userRole === 'instructor' && (
          <div className="space-y-12 max-w-5xl mx-auto">
            
            {/* 1. قسم إضافة الفيديوهات للكورسات */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-indigo-400">🎥 لوحة المعلم: إضافة فيديوهات للدروس</h2>
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
                    <label className="block text-xs font-medium mb-1">عنوان الدرس / الفيديو</label>
                    <input type="text" required value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="مثال: الدرس الثاني: التنسيقات CSS" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">مدة الفيديو</label>
                    <input type="text" value={newVideoDuration} onChange={e => setNewVideoDuration(e.target.value)} placeholder="مثال: 15 دقيقة" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">رابط الفيديو (اختياري)</label>
                  <input type="text" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} placeholder="https://... أو اتركه فارغاً" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                </div>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition">
                  + إرسال ونشر الفيديو في الكورس
                </button>
              </form>
            </div>

            {/* 2. تصميم الامتحانات وإضافة الأسئلة */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-amber-500">📝 تصميم امتحان جديد وإضافة الأسئلة</h2>
              <form onSubmit={handleSaveFullExam} className="space-y-6">
                <div className="space-y-4 border-b pb-6 border-slate-700">
                  <div>
                    <label className="block text-xs font-medium mb-1">عنوان الامتحان</label>
                    <input type="text" required value={newExamTitle} onChange={e => setNewExamTitle(e.target.value)} placeholder="مثال: امتحان قواعد البيانات المتقدمة" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">مدة الامتحان بالدقائق</label>
                    <input type="number" required value={newExamDuration} onChange={e => setNewExamDuration(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-indigo-400 text-sm">أسئلة الامتحان والتصحيح الآلي ({builderQuestions.length})</h3>
                    <button type="button" onClick={handleAddQuestionToBuilder} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold">
                      + إضافة سؤال جديد
                    </button>
                  </div>

                  {builderQuestions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 rounded-2xl border border-slate-700 bg-slate-900/40 space-y-3">
                      <span className="text-xs font-bold text-amber-400">السؤال رقم {qIndex + 1}</span>
                      <input 
                        type="text" 
                        required 
                        value={q.text} 
                        onChange={e => handleQuestionTextChange(qIndex, e.target.value)} 
                        placeholder="اكتب نص السؤال هنا..." 
                        className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {q.options.map((opt: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name={`correct-opt-${qIndex}`} 
                              checked={q.correctOption === optIndex}
                              onChange={() => handleCorrectOptionChange(qIndex, optIndex)}
                              title="حدد كإجابة صحيحة للتصحيح الآلي"
                              className="accent-emerald-500"
                            />
                            <input 
                              type="text" 
                              required 
                              value={opt} 
                              onChange={e => handleOptionChange(qIndex, optIndex, e.target.value)} 
                              placeholder={`الخيار ${optIndex + 1}`} 
                              className="w-full px-3 py-1.5 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-emerald-400">* اضغط على الدائرة الخضراء بجانب الخيار الصحيح لاعتماده في حساب درجات الطلاب.</p>
                    </div>
                  ))}
                </div>

                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg transition">
                  نشر الامتحان بالأسئلة وإتاحتها للطلاب 🚀
                </button>
              </form>
            </div>

            {/* 3. سجل نتائج الطلاب الشامل (الإيميل، التلفون، ولي الأمر، الوقت، الغش) */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-indigo-400">📊 سجل تفاصيل الطلاب والنتائج والوقت وحالات الغش</h3>
                {examResults.length > 0 && (
                  <button onClick={handleDeleteAllResults} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition">
                    🗑️ مسح وحذف كل النتائج
                  </button>
                )}
              </div>

              {examResults.length === 0 ? (
                <p className="text-xs text-slate-400">لا توجد نتائج مسجلة حتى الآن.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className={`border-b ${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                      <tr>
                        <th className="p-3">اسم الطالب</th>
                        <th className="p-3">البريد الإلكتروني</th>
                        <th className="p-3">رقم التلفون</th>
                        <th className="p-3">تلفون ولي الأمر</th>
                        <th className="p-3">الامتحان</th>
                        <th className="p-3">الدرجة</th>
                        <th className="p-3">الوقت المستغرق</th>
                        <th className="p-3">حالة الغش / الإنذارات</th>
                        <th className="p-3">الحالة والتاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {examResults.map((res: any) => (
                        <tr key={res.id}>
                          <td className="p-3 font-bold">{res.studentName}</td>
                          <td className="p-3 text-slate-400">{res.studentEmail}</td>
                          <td className="p-3 text-slate-300">{res.studentPhone}</td>
                          <td className="p-3 text-amber-400 font-bold">{res.parentPhone}</td>
                          <td className="p-3">{res.examTitle}</td>
                          <td className="p-3 font-bold text-emerald-400">{res.score} / {res.total}</td>
                          <td className="p-3 font-semibold text-indigo-300">{res.timeSpent}</td>
                          <td className="p-3 text-rose-400">⚠️ {res.warningsCount} إنذارات</td>
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

        {/* نافذة تسجيل الدخول والتسجيل بالشروط الجديدة */}
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
                    <input type="text" required value={inputRegName} onChange={e => setInputRegName(e.target.value)} placeholder="اسم الطالب..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">البريد الإلكتروني</label>
                    <input type="email" required value={inputRegEmail} onChange={e => setInputRegEmail(e.target.value)} placeholder="student@mail.com" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">رقم التلفون الشخصي</label>
                    <input type="text" required value={inputRegPhone} onChange={e => setInputRegPhone(e.target.value)} placeholder="010xxxxxxxx" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">رقم تلفون ولي الأمر</label>
                    <input type="text" required value={inputRegParentPhone} onChange={e => setInputRegParentPhone(e.target.value)} placeholder="011xxxxxxxx" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
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
                    <input type="text" required value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} placeholder="أدخل إيميلك أو تلفونك..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">كلمة المرور</label>
                    <input type="password" required value={loginPassword} onChange5={(e: any) => setLoginPassword(e.target.value)} value-password={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                </>
              )}
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm">
                {authMode === 'register' ? 'حفظ وتفعيل الحساب' : 'تسجيل الدخول'}
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