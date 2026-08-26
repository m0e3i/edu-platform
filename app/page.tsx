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

  // حالة تسجيل الدخول والمستخدم الحالي
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<'student' | 'instructor'>('student');
  const [userPhone, setUserPhone] = useState('');
  const [userParentPhone, setUserParentPhone] = useState('');

  // حقول شاشة الدخول / إنشاء الحساب
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputParentPhone, setInputParentPhone] = useState('');
  const [inputRole, setInputRole] = useState<'student' | 'instructor'>('student');

  // قاعدة بيانات المستخدمين المسجلين
  const [usersList, setUsersList] = useState<any[]>([
    { name: 'أحمد المعلم', email: 'teacher@edu.com', password: '123', phone: '01000000000', parentPhone: 'N/A', role: 'instructor' },
    { name: 'محمد الطالب', email: 'student@edu.com', password: '123', phone: '01111111111', parentPhone: '01222222222', role: 'student' }
  ]);

  // سجل درجات الامتحانات للطلاب (للمعلم)
  const [examResultsLog, setExamResultsLog] = useState<any[]>([]);

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
      ],
      exam: null 
    }
  ]);

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

  // حقول إنشاء امتحان للمعلم
  const [examCourseTarget, setExamCourseTarget] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [examQuestions, setExamQuestions] = useState<any[]>([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  // حالة الامتحان الجاري للطالب (نظام منع الغش وحساب الوقت)
  const [activeExam, setActiveExam] = useState<any>(null);
  const [examAnswers, setExamAnswers] = useState<{ [key: number]: number }>({});
  const [cheatingWarnings, setCheatingWarnings] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [examStartTime, setExamStartTime] = useState<number>(0);

  // تحميل البيانات عند فتح الصفحة
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('edu_users_db_v11');
      if (savedUsers) setUsersList(JSON.parse(savedUsers));

      const savedCourses = localStorage.getItem('edu_courses_v11');
      if (savedCourses) setCourses(JSON.parse(savedCourses));

      const savedResults = localStorage.getItem('edu_exam_results_v11');
      if (savedResults) setExamResultsLog(JSON.parse(savedResults));

      const logged = localStorage.getItem('edu_logged_v11');
      if (logged === 'true') {
        setIsLoggedIn(true);
        setUserName(localStorage.getItem('edu_uname_v11') || '');
        setUserEmail(localStorage.getItem('edu_uemail_v11') || '');
        setUserRole((localStorage.getItem('edu_urole_v11') as any) || 'student');
        setUserPhone(localStorage.getItem('edu_uphone_v11') || '');
        setUserParentPhone(localStorage.getItem('edu_uparent_v11') || '');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // حفظ البيانات في localStorage
  useEffect(() => {
    try {
      localStorage.setItem('edu_courses_v11', JSON.stringify(courses));
      localStorage.setItem('edu_users_db_v11', JSON.stringify(usersList));
      localStorage.setItem('edu_exam_results_v11', JSON.stringify(examResultsLog));
    } catch (e) {
      console.error(e);
    }
  }, [courses, usersList, examResultsLog]);

  // مراقبة الغش أثناء الامتحان (تبديل التبويبات أو مغادرة النافذة)
  useEffect(() => {
    if (!activeExam || examSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerCheatingWarning("⚠️ تحذير: قمت بمغادرة نافذة الامتحان! محاولات الغش مرصودة.");
      }
    };

    const handleBlur = () => {
      triggerCheatingWarning("⚠️ تحذير: محاولة فتح نافذة خارجية أو خروج مؤشر الماوس عن الإطار!");
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [activeExam, cheatingWarnings, examSubmitted]);

  const triggerCheatingWarning = (msg: string) => {
    const newWarnings = cheatingWarnings + 1;
    setCheatingWarnings(newWarnings);
    if (newWarnings >= 3) {
      showToast("❌ تم إنهاء الامتحان تلقائياً بسبب تكرار محاولات الغش!");
      finishExamDueToCheating();
    } else {
      showToast(`${msg} (الإنذار ${newWarnings}/3)`);
    }
  };

  const finishExamDueToCheating = () => {
    setExamSubmitted(true);
    setExamScore(0);
    saveExamResultToLog(0, 3);
    setActiveExam(null);
  };

  // دالة إنشاء حساب جديد (Sign Up)
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName || !inputEmail || !inputPassword || !inputPhone) {
      showToast('⚠️ يرجى إكمال الحقول الأساسية ورقم الهاتف!');
      return;
    }

    if (inputRole === 'student' && !inputParentPhone) {
      showToast('⚠️ يرجى إدخال رقم ولي الأمر للطالب!');
      return;
    }

    const userExists = usersList.find(u => u.email.toLowerCase() === inputEmail.toLowerCase());
    if (userExists) {
      showToast('❌ البريد الإلكتروني مستخدم من قبل، حاول تسجيل الدخول!');
      return;
    }

    const newUser = { 
      name: inputName, 
      email: inputEmail, 
      password: inputPassword, 
      phone: inputPhone, 
      parentPhone: inputRole === 'student' ? inputParentPhone : 'N/A', 
      role: inputRole 
    };

    const updatedUsers = [...usersList, newUser];
    setUsersList(updatedUsers);

    setIsLoggedIn(true);
    setUserName(newUser.name);
    setUserEmail(newUser.email);
    setUserRole(newUser.role);
    setUserPhone(newUser.phone);
    setUserParentPhone(newUser.parentPhone);

    localStorage.setItem('edu_logged_v11', 'true');
    localStorage.setItem('edu_uname_v11', newUser.name);
    localStorage.setItem('edu_uemail_v11', newUser.email);
    localStorage.setItem('edu_urole_v11', newUser.role);
    localStorage.setItem('edu_uphone_v11', newUser.phone);
    localStorage.setItem('edu_uparent_v11', newUser.parentPhone);

    showToast(`🎉 أهلاً بك ${newUser.name}, تم إنشاء الحساب وتسجيل الدخول بنجاح!`);
    setInputName('');
    setInputEmail('');
    setInputPassword('');
    setInputPhone('');
    setInputParentPhone('');
    setActiveTab('home');
  };

  // دالة تسجيل الدخول (Login)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail || !inputPassword) {
      showToast('⚠️ يرجى إدخال البريد الإلكتروني وكلمة المرور!');
      return;
    }

    const foundUser = usersList.find(
      u => u.email.toLowerCase() === inputEmail.toLowerCase() && u.password === inputPassword
    );

    if (!foundUser) {
      showToast('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة!');
      return;
    }

    setIsLoggedIn(true);
    setUserName(foundUser.name);
    setUserEmail(foundUser.email);
    setUserRole(foundUser.role);
    setUserPhone(foundUser.phone || 'غير محدد');
    setUserParentPhone(foundUser.parentPhone || 'غير محدد');

    localStorage.setItem('edu_logged_v11', 'true');
    localStorage.setItem('edu_uname_v11', foundUser.name);
    localStorage.setItem('edu_uemail_v11', foundUser.email);
    localStorage.setItem('edu_urole_v11', foundUser.role);
    localStorage.setItem('edu_uphone_v11', foundUser.phone || 'غير محدد');
    localStorage.setItem('edu_uparent_v11', foundUser.parentPhone || 'غير محدد');

    showToast(`👋 مرحباً بك من جديد يا ${foundUser.name}!`);
    setInputEmail('');
    setInputPassword('');
    setActiveTab('home');
  };

  // تسجيل الخروج
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setUserRole('student');
    setUserPhone('');
    setUserParentPhone('');
    localStorage.removeItem('edu_logged_v11');
    localStorage.removeItem('edu_uname_v11');
    localStorage.removeItem('edu_uemail_v11');
    localStorage.removeItem('edu_urole_v11');
    localStorage.removeItem('edu_uphone_v11');
    localStorage.removeItem('edu_uparent_v11');
    showToast('🔒 تم تسجيل الخروج بنجاح');
    setActiveTab('home');
  };

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
    setActiveTab('instructor-dashboard');
    showToast('✏️ قم بتعديل بيانات الكورس في لوحة التحكم');
  };

  // حفظ الكورس (إنشاء أو تعديل)
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle) {
      showToast('يرجى كتابة اسم الكورس!');
      return;
    }

    if (editingCourseId) {
      setCourses(courses.map(c => c.id === editingCourseId ? {
        ...c,
        title: newCourseTitle,
        instructor: newCourseInstructor || userName,
        category: newCourseCategory || 'عام',
        price: newCoursePrice,
        description: newCourseDesc
      } : c));
      showToast('✨ تم تحديث الكورس بنجاح!');
      setEditingCourseId(null);
    } else {
      const newCourseObj = {
        id: Date.now(),
        title: newCourseTitle,
        instructor: newCourseInstructor || userName,
        category: newCourseCategory || 'عام',
        price: newCoursePrice,
        description: newCourseDesc || 'كورس تعليمي جديد',
        lessons: [],
        exam: null
      };
      setCourses([newCourseObj, ...courses]);
      showToast('✨ تم إنشاء الكورس بنجاح!');
    }

    setNewCourseTitle('');
    setNewCourseInstructor('');
    setNewCourseDesc('');
    setNewCourseCategory('');
  };

  // حذف درس من الكورس
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

  // إضافة فيديو للكورس
  const handleAddVideoToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForVideo || !newVideoTitle) {
      showToast('يرجى اختيار الكورس وعنوان الدرس!');
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
      showToast('🎥 تمت إضافة الفيديو بنجاح للكورس!');
    } else {
      const newCourseObj = {
        id: Date.now(),
        title: selectedCourseForVideo,
        instructor: userName,
        category: 'العلوم والأحياء',
        price: 'مجاناً 🎁',
        description: 'قسم تعليمي جديد.',
        lessons: [newLessonObj],
        exam: null
      };
      setCourses([newCourseObj, ...courses]);
      showToast('✨ تم إنشاء الكورس وإضافة الفيديو إليه!');
    }

    setNewVideoTitle('');
    setNewVideoUrl('');
    setSelectedCourseForVideo('');
  };

  // إضافة امتحان بواسطة المعلم
  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examCourseTarget || !examTitle) {
      showToast('يرجى تحديد الكورس وعنوان الامتحان!');
      return;
    }

    const courseIndex = courses.findIndex(c => c.title.trim().toLowerCase() === examCourseTarget.trim().toLowerCase());
    if (courseIndex === -1) {
      showToast('❌ اسم الكورس المستهدف غير موجود! تأكد من كتابته بدقة.');
      return;
    }

    const examObj = {
      title: examTitle,
      questions: examQuestions
    };

    const updated = [...courses];
    updated[courseIndex].exam = examObj;
    setCourses(updated);
    showToast('📝 تم نشر الامتحان بنجاح للكورس!');
    setExamTitle('');
    setExamCourseTarget('');
    setExamQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  // بدء الامتحان للطالب
  const handleStartExam = (exam: any) => {
    setActiveExam(exam);
    setExamAnswers({});
    setCheatingWarnings(0);
    setExamSubmitted(false);
    setExamScore(0);
    setExamStartTime(Date.now());
  };

  // تسليم الامتحان وحساب النتيجة وتسجيلها للمعلم
  const handleSubmitExam = () => {
    if (!activeExam) return;
    let score = 0;
    activeExam.questions.forEach((q: any, index: number) => {
      if (examAnswers[index] === q.correctAnswer) {
        score += 1;
      }
    });
    setExamScore(score);
    setExamSubmitted(true);
    saveExamResultToLog(score, cheatingWarnings);
    showToast(`🎯 انتهى الامتحان! نتيجتك: ${score} / ${activeExam.questions.length}`);
  };

  // حفظ سجل الامتحان في قاعدة البيانات ليراه المعلم
  const saveExamResultToLog = (score: number, warningsCount: number) => {
    const durationMs = Date.now() - examStartTime;
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const durationFormatted = `${minutes} دقيقة و ${seconds} ثانية`;

    const resultRecord = {
      id: Date.now(),
      studentName: userName || 'طالب',
      studentPhone: userPhone || 'غير محدد',
      parentPhone: userParentPhone || 'غير محدد',
      examTitle: activeExam?.title || 'امتحان المنصة',
      score: `${score} / ${activeExam?.questions?.length || 0}`,
      duration: durationFormatted,
      cheatingAttempts: warningsCount,
      date: new Date().toLocaleString('ar-EG')
    };

    setExamResultsLog(prev => [resultRecord, ...prev]);
  };

  // إمكانية حذف سجل درجات للطالب بواسطة المعلم
  const handleDeleteExamResult = (resultId: number) => {
    if (confirm('هل أنت متأكد من حذف سجل هذه النتيجة؟')) {
      setExamResultsLog(examResultsLog.filter(r => r.id !== resultId));
      showToast('🗑️ تم حذف السجل بنجاح');
    }
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
          {/* تعديل ظهور اسم المنصة بطريقة مرتبة وصحيحة */}
          <div className="text-xl sm:text-2xl font-black tracking-wide cursor-pointer flex items-center gap-1.5" onClick={() => setActiveTab('home')}>
            <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-lg text-sm sm:text-base">EDU</span>
            <span className={darkMode ? 'text-white' : 'text-slate-900'}>BEDAYA</span>
          </div>

          <nav className="hidden md:flex gap-6 font-medium text-sm items-center">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-indigo-500 font-bold' : ''}>الرئيسية</button>
            <button onClick={() => setActiveTab('courses')} className={activeTab === 'courses' ? 'text-indigo-500 font-bold' : ''}>الكورسات والامتحانات 🎥</button>
            {isLoggedIn && userRole === 'instructor' && (
              <button onClick={() => setActiveTab('instructor-dashboard')} className={activeTab === 'instructor-dashboard' ? 'text-amber-500 font-bold' : ''}>لوحة التحكم وسجل الدرجات 👨‍🏫</button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800 text-amber-400">
              {darkMode ? '☀️ نهار' : '🌙 ليل'}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full font-bold border border-indigo-500/30">
                  {userName} ({userRole === 'instructor' ? 'معلم 👨‍🏫' : 'طالب 👨‍🎓'})
                </span>
                <button onClick={handleLogout} className="bg-rose-500/20 text-rose-400 text-xs px-3 py-1.5 rounded-xl font-bold">خروج</button>
              </div>
            ) : (
              <button onClick={() => setActiveTab('auth')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow transition">
                تسجيل الدخول / إنشاء حساب 🔑
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
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">منصة بداية التعليمية الذكية</h1>
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-90">منصة تعليمية متكاملة لإنشاء الكورسات، متابعة الدروس، وإجراء الامتحانات مع تسجيل درجات وأرقام أولياء الأمور بنظام منع الغش.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setActiveTab('courses')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold shadow-lg transition">
                  تصفح الكورسات والامتحانات 🎥
                </button>
                {!isLoggedIn && (
                  <button onClick={() => setActiveTab('auth')} className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-xl font-bold transition">
                    انضم إلينا الآن 🚀
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'auth' && !isLoggedIn && (
          <div className="max-w-md mx-auto space-y-6">
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              
              <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-700">
                <button 
                  onClick={() => setAuthMode('login')} 
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
                >
                  تسجيل الدخول
                </button>
                <button 
                  onClick={() => setAuthMode('signup')} 
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'signup' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
                >
                  إنشاء حساب جديد
                </button>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <h2 className="text-xl font-bold text-center mb-2">تسجيل الدخول إلى حسابك</h2>
                  <div>
                    <label className="block text-xs font-medium mb-1">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      required 
                      value={inputEmail} 
                      onChange={e => setInputEmail(e.target.value)} 
                      placeholder="name@example.com" 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">كلمة المرور</label>
                    <input 
                      type="password" 
                      required 
                      value={inputPassword} 
                      onChange={e => setInputPassword(e.target.value)} 
                      placeholder="••••••••" 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow transition">
                    دخول 🚀
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    حساب معلم للتجربة: teacher@edu.com | كلمة المرور: 123
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <h2 className="text-xl font-bold text-center mb-2">إنشاء حساب جديد</h2>
                  <div>
                    <label className="block text-xs font-medium mb-1">الاسم الكامل</label>
                    <input 
                      type="text" 
                      required 
                      value={inputName} 
                      onChange={e => setInputName(e.target.value)} 
                      placeholder="محمد أحمد..." 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      required 
                      value={inputEmail} 
                      onChange={e => setInputEmail(e.target.value)} 
                      placeholder="name@example.com" 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">كلمة المرور</label>
                    <input 
                      type="password" 
                      required 
                      value={inputPassword} 
                      onChange={e => setInputPassword(e.target.value)} 
                      placeholder="••••••••" 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">رقم الهاتف (الطالب)</label>
                    <input 
                      type="text" 
                      required 
                      value={inputPhone} 
                      onChange={e => setInputPhone(e.target.value)} 
                      placeholder="010xxxxxxxx" 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>

                  {inputRole === 'student' && (
                    <div>
                      <label className="block text-xs font-medium mb-1 text-amber-400 font-bold">رقم تليفون ولي الأمر 📱</label>
                      <input 
                        type="text" 
                        required 
                        value={inputParentPhone} 
                        onChange={e => setInputParentPhone(e.target.value)} 
                        placeholder="011xxxxxxxx" 
                        className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-amber-500/50 text-white" 
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium mb-1">نوع الحساب</label>
                    <select 
                      value={inputRole} 
                      onChange={e => setInputRole(e.target.value as any)} 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white"
                    >
                      <option value="student">طالب (استعراض الكورسات والامتحانات)</option>
                      <option value="instructor">معلم (إنشاء وإدارة الكورسات والامتحانات)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow transition">
                    تسجيل حساب جديد ✨
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

        {/* واجهة عرض الكورسات والامتحانات */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl sm:text-3xl font-bold">الكورسات والدروس والامتحانات 📚</h2>
              {isLoggedIn && userRole === 'instructor' && (
                <button 
                  onClick={() => { setActiveTab('instructor-dashboard'); setEditingCourseId(null); }} 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
                >
                  ➕ إضافة كورس جديد
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(course => (
                <div key={course.id} className={`p-6 rounded-3xl border shadow-lg space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">{course.category}</span>
                      
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

                  {/* الدروس */}
                  <div className="space-y-3 pt-3 border-t border-slate-700">
                    <h4 className="text-xs font-bold text-amber-400">الفيديوهات والدروس ({course.lessons.length}):</h4>
                    {course.lessons.length === 0 ? (
                      <p className="text-xs text-slate-400">لا توجد دروس مضافة في هذا الكورس بعد.</p>
                    ) : (
                      course.lessons.map((lesson: any) => (
                        <div key={lesson.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span>📺 {lesson.title} ({lesson.duration})</span>
                            
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

                  {/* قسم الامتحان المتاح للكورس */}
                  <div className="pt-3 border-t border-slate-700">
                    <h4 className="text-xs font-bold text-indigo-400 mb-2">امتحان الكورس:</h4>
                    {course.exam ? (
                      <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold">📝 {course.exam.title}</p>
                          <p className="text-[11px] text-slate-400">عدد الأسئلة: {course.exam.questions.length}</p>
                        </div>
                        {isLoggedIn && userRole === 'student' && (
                          <button onClick={() => handleStartExam(course.exam)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow">
                            بدء الامتحان 🚀
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">لا يوجد امتحان مضاف لهذا الكورس حالياً.</p>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* نافذة الامتحان التفاعلية مع منع الغش وتتبع الوقت */}
        {activeExam && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex justify-center items-center p-4 overflow-y-auto" onCopy={e => e.preventDefault()} onPaste={e => e.preventDefault()}>
            <div className={`max-w-2xl w-full p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200'}`}>
              
              <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-indigo-400">{activeExam.title}</h2>
                  <p className="text-xs text-rose-400 mt-1 font-bold">⚠️ نظام منع الغش مفعل: مغادرة الصفحة تزيد عداد الخروج (عدد المحاولات: {cheatingWarnings}/3)</p>
                </div>
                <button onClick={() => setActiveExam(null)} className="text-slate-400 hover:text-white font-bold text-sm">✕ إغلاق</button>
              </div>

              {!examSubmitted ? (
                <div className="space-y-6 max-h-[60vh] overflow-y-auto px-2">
                  {activeExam.questions.map((q: any, qIndex: number) => (
                    <div key={qIndex} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
                      <p className="text-sm font-bold">س {qIndex + 1}: {q.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt: string, optIndex: number) => (
                          <label key={optIndex} className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition ${examAnswers[qIndex] === optIndex ? 'bg-indigo-600/30 border-indigo-500 font-bold' : 'border-slate-700 bg-slate-800/40'}`}>
                            <input 
                              type="radio" 
                              name={`question-${qIndex}`} 
                              checked={examAnswers[qIndex] === optIndex}
                              onChange={() => setExamAnswers({...examAnswers, [qIndex]: optIndex})}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={handleSubmitExam} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow transition">
                    تسليم الامتحان ✅
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4 py-8">
                  <h3 className="text-2xl font-extrabold text-emerald-400">🎉 انتهى الامتحان بنجاح!</h3>
                  <p className="text-lg font-bold">نتيجتك النهائية: {examScore} من {activeExam.questions.length}</p>
                  <button onClick={() => setActiveExam(null)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs">
                    العودة للكورسات
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* لوحة تحكم المعلم */}
        {activeTab === 'instructor-dashboard' && isLoggedIn && userRole === 'instructor' && (
          <div className="space-y-12 max-w-4xl mx-auto">
            
            {/* قسم سجل درجات ومتابعة الطلاب */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-indigo-400">📊 سجل درجات الطلاب ومتابعة الامتحانات</h2>
              <p className="text-xs text-slate-400">تظهر هنا تفاصيل كل طالب امتحن، درجته، أرقام التواصل، مدة الحل، ومحاولات الخروج من الامتحان، مع إمكانية حذف السجل.</p>
              
              {examResultsLog.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">لا توجد نتائج مسجلة حتى الآن.</p>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {examResultsLog.map(record => (
                    <div key={record.id} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-sm text-amber-400">👨‍🎓 الطالب: {record.studentName}</p>
                        <p>📝 الامتحان: {record.examTitle}</p>
                        <p>🎯 الدرجة: <span className="font-bold text-emerald-400">{record.score}</span></p>
                        <p>📞 هاتف الطالب: {record.studentPhone} | 📱 ولي الأمر: <span className="text-indigo-300 font-bold">{record.parentPhone}</span></p>
                        <p>⏱️ مدة الحل: {record.duration} | ⚠️ محاولات الخروج (الغش): {record.cheatingAttempts}</p>
                        <p className="text-[10px] text-slate-500">{record.date}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteExamResult(record.id)} 
                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 px-3 py-2 rounded-xl text-xs font-bold transition self-end sm:self-center"
                      >
                        🗑️ حذف السجل
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* إنشاء أو تعديل كورس */}
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
                    <input 
                      type="text" 
                      required 
                      value={newCourseTitle} 
                      onChange={e => setNewCourseTitle(e.target.value)} 
                      placeholder="مثال: كورس الفيزياء للصف الثالث الثانوي" 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">اسم المعلم</label>
                    <input 
                      type="text" 
                      value={newCourseInstructor} 
                      onChange={e => setNewCourseInstructor(e.target.value)} 
                      placeholder={userName} 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">التصنيف</label>
                    <input 
                      type="text" 
                      value={newCourseCategory} 
                      onChange={e => setNewCourseCategory(e.target.value)} 
                      placeholder="العلوم والأحياء" 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">السعر</label>
                    <input 
                      type="text" 
                      value={newCoursePrice} 
                      onChange={e => setNewCoursePrice(e.target.value)} 
                      placeholder="مجاناً 🎁" 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">وصف الكورس</label>
                  <textarea 
                    value={newCourseDesc} 
                    onChange={e => setNewCourseDesc(e.target.value)} 
                    placeholder="نبذة مختصرة عن محتوى الكورس..." 
                    className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white"
                    rows={2}
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 rounded-xl font-bold text-sm shadow transition">
                  {editingCourseId ? 'حفظ التعديلات ✨' : 'نشر الكورس الجديد 🚀'}
                </button>
              </form>
            </div>

            {/* إضافة فيديو للكورس */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-indigo-400">🎥 إضافة فيديو / درس لشرح الكورس</h2>
              <form onSubmit={handleAddVideoToCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">اختر الكورس المستهدف</label>
                  <select 
                    value={selectedCourseForVideo} 
                    onChange={e => setSelectedCourseForVideo(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white"
                  >
                    <option value="">اختر الكورس...</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.title}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">عنوان الدرس</label>
                    <input 
                      type="text" 
                      required 
                      value={newVideoTitle} 
                      onChange={e => setNewVideoTitle(e.target.value)} 
                      placeholder="الدرس الأول: الانقسام الخلوي" 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">مدة الفيديو</label>
                    <input 
                      type="text" 
                      value={newVideoDuration} 
                      onChange={e => setNewVideoDuration(e.target.value)} 
                      placeholder="15 دقيقة" 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">رابط الفيديو (MP4 / رابط مباشر)</label>
                  <input 
                    type="url" 
                    value={newVideoUrl} 
                    onChange={e => setNewVideoUrl(e.target.value)} 
                    placeholder="https://example.com/video.mp4" 
                    className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow transition">
                  رفع وإضافة الفيديو للكورس 📺
                </button>
              </form>
            </div>

            {/* إنشاء امتحان للمعلم */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-indigo-400">📝 إنشاء ونشر امتحان للكورس</h2>
              <form onSubmit={handleSaveExam} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">اختر الكورس لإضافة الامتحان إليه</label>
                  <select 
                    value={examCourseTarget} 
                    onChange={e => setExamCourseTarget(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white"
                    required
                  >
                    <option value="">اختر الكورس...</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.title}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">عنوان الامتحان</label>
                  <input 
                    type="text" 
                    required 
                    value={examTitle} 
                    onChange={e => setExamTitle(e.target.value)} 
                    placeholder="امتحان الشهر الأول في الأحياء" 
                    className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-700">
                  <h3 className="text-sm font-bold text-amber-400">أسئلة الامتحان (اختر من متعدد):</h3>
                  {examQuestions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">السؤال {qIndex + 1}</label>
                        <input 
                          type="text" 
                          required 
                          value={q.question} 
                          onChange={e => {
                            const updated = [...examQuestions];
                            updated[qIndex].question = e.target.value;
                            setExamQuestions(updated);
                          }} 
                          placeholder="اكتب نص السؤال هنا..." 
                          className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt: string, optIdx: number) => (
                          <div key={optIdx}>
                            <label className="block text-[10px] text-slate-400 mb-1">الخيار {optIdx + 1}</label>
                            <input 
                              type="text" 
                              required 
                              value={opt} 
                              onChange={e => {
                                const updated = [...examQuestions];
                                updated[qIndex].options[optIdx] = e.target.value;
                                setExamQuestions(updated);
                              }} 
                              placeholder={`الخيار ${optIdx + 1}`} 
                              className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1 text-emerald-400">الخيار الصحيح (رقم الخيار من 1 إلى 4)</label>
                        <select 
                          value={q.correctAnswer} 
                          onChange={e => {
                            const updated = [...examQuestions];
                            updated[qIndex].correctAnswer = Number(e.target.value);
                            setExamQuestions(updated);
                          }} 
                          className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white"
                        >
                          <option value={0}>الخيار الأول</option>
                          <option value={1}>الخيار الثاني</option>
                          <option value={2}>الخيار الثالث</option>
                          <option value={3}>الخيار الرابع</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    onClick={() => setExamQuestions([...examQuestions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }])}
                    className="bg-slate-800 hover:bg-slate-700 text-indigo-400 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700"
                  >
                    ➕ إضافة سؤال جديد
                  </button>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow transition">
                  نشر الامتحان للكورس 📝
                </button>
              </form>
            </div>

          </div>
        )}

      </main>

      {/* الفوتر */}
      <footer className={`border-t py-8 text-center text-xs opacity-70 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
        <p>جميع الحقوق محفوظة © 2026 - منصة بداية التعليمية الذكية 🎓</p>
      </footer>
    </div>
  );
}