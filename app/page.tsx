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

  // ميزة تغيير الاسم براحتك
  const [isEditingName, setIsEditingName] = useState(false);
  const [newNameInput, setNewNameInput] = useState('');

  // قاعدة بيانات المستخدمين
  const [usersList, setUsersList] = useState<any[]>([
    { 
      name: 'معلم المنصة', 
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
      instructor: "معلم المنصة",
      category: "العلوم والأحياء",
      price: "مجاناً 🎁",
      description: "شرح مبسط وممتع لمنهج الأحياء والعلوم بطريقة احترافية.",
      lessons: [
        { id: 201, title: "الدرس الأول: مدخل إلى علم الأحياء والخلية", duration: "10 دقائق", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ]
    }
  ]);

  // حالات تعديل الكورس (Instructor Editing States)
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // الامتحانات والنتائج
  const [exams, setExams] = useState<any[]>([
    {
      id: 1,
      title: "اختبار مادة العلوم والأحياء",
      instructor: "معلم المنصة",
      durationMinutes: 5,
      questions: [
        { id: 1, text: "ما هي وحدة بناء الكائن الحي؟", options: ["الخلية", "الذرة", "العضو", "النسيج"], correctOption: 0 },
        { id: 2, text: "أي الأجزاء التالية يوجد في الخلية النباتية ولا يوجد في الحيوانية؟", options: ["الجدار الخلوي", "النواة", "الميتوكوندريا", "الغشاء البلازمي"], correctOption: 0 }
      ]
    }
  ]);

  const [examResults, setExamResults] = useState<any[]>([]);

  // حقول إنشاء كورس جديد بواسطة المعلم
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('مجاناً 🎁');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // حقول إضافة فيديو للكورس
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
      const savedUsers = localStorage.getItem('edu_users_db_v8');
      if (savedUsers) setUsersList(JSON.parse(savedUsers));

      const savedCourses = localStorage.getItem('edu_courses_v8');
      if (savedCourses) setCourses(JSON.parse(savedCourses));

      const savedExams = localStorage.getItem('edu_exams_v8');
      if (savedExams) setExams(JSON.parse(savedExams));

      const savedResults = localStorage.getItem('edu_results_v8');
      if (savedResults) setExamResults(JSON.parse(savedResults));

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

  // حفظ البيانات
  useEffect(() => {
    try {
      localStorage.setItem('edu_users_db_v8', JSON.stringify(usersList));
      localStorage.setItem('edu_courses_v8', JSON.stringify(courses));
      localStorage.setItem('edu_exams_v8', JSON.stringify(exams));
      localStorage.setItem('edu_results_v8', JSON.stringify(examResults));
      localStorage.setItem('edu_logged_v8', isLoggedIn ? 'true' : 'false');
      localStorage.setItem('edu_uname_v8', userName);
      localStorage.setItem('edu_urole_v8', userRole);
      localStorage.setItem('edu_ucdata_v8', JSON.stringify(currentUserData));
    } catch (e) {
      console.error(e);
    }
  }, [usersList, courses, exams, examResults, isLoggedIn, userName, userRole, currentUserData]);

  // دالة تغيير الاسم في أي وقت
  const handleUpdateMyName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameInput.trim()) {
      showToast('الرجاء كتابة اسم صحيح!');
      return;
    }

    setUserName(newNameInput);
    if (currentUserData) {
      const updatedUser = { ...currentUserData, name: newNameInput };
      setCurrentUserData(updatedUser);
    }

    // تحديثه في قائمة المستخدمين
    setUsersList(prev => prev.map(u => u.email === currentUserData?.email ? { ...u, name: newNameInput } : u));
    
    setIsEditingName(false);
    showToast('✨ تم تغيير اسمك بنجاح!');
  };

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
    showToast('✨ تم إنشاء الكورس بنجاح باسمك!');
    setNewCourseTitle('');
    setNewCourseDesc('');
    setNewCourseCategory('');
  };

  // حذف كورس
  const handleDeleteCourse = (courseId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الكورس نهائياً؟')) {
      setCourses(courses.filter(c => c.id !== courseId));
      showToast('🗑️ تم حذف الكورس بنجاح');
    }
  };

  // بدء تعديل كورس
  const startEditingCourse = (course: any) => {
    setEditingCourseId(course.id);
    setEditTitle(course.title);
    setEditCategory(course.category);
    setEditPrice(course.price);
    setEditDesc(course.description);
  };

  // حفظ تعديل الكورس
  const handleSaveCourseEdit = (courseId: number) => {
    setCourses(courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          title: editTitle,
          category: editCategory,
          price: editPrice,
          description: editDesc
        };
      }
      return c;
    }));
    setEditingCourseId(null);
    showToast('✏️ تم تعديل محتوى الكورس بنجاح!');
  };

  // إضافة فيديو للكورس
  const handleAddVideoToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForVideo || !newVideoTitle) {
      showToast('يرجى كتابة اسم الكورس المستهدف وعنوان الدرس!');
      return;
    }

    const courseIndex = courses.findIndex(c => c.title.trim().toLowerCase() === selectedCourseForVideo.trim().toLowerCase());

    if (courseIndex !== -1) {
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
      const newCourseObj = {
        id: Date.now(),
        title: selectedCourseForVideo,
        instructor: userName || 'المعلم',
        category: 'العلوم والأحياء',
        price: 'مجاناً 🎁',
        description: 'قسم تعليمي جديد.',
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
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-90">متابعة شاملة لبيانات الطلاب، منع الغش المتقدم، وتعديل وحذف الكورسات بكل سهولة.</p>
              
              {/* زر تغيير الاسم السريع في الواجهة الرئيسية لو مسجل دخول */}
              {isLoggedIn && (
                <div className="my-6 max-w-sm mx-auto bg-slate-900/60 p-4 rounded-2xl border border-indigo-500">
                  {!isEditingName ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs">اسمك الحالي: <strong className="text-indigo-400">{userName}</strong></span>
                      <button onClick={() => { setNewNameInput(userName); setIsEditingName(true); }} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold">
                        تغيير الاسم ✏️
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateMyName} className="space-y-2">
                      <input type="text" value={newNameInput} onChange={e => setNewNameInput(e.target.value)} placeholder="اكتب اسمك الجديد..." className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white" />
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-1.5 rounded-lg font-bold">حفظ</button>
                        <button type="button" onClick={() => setIsEditingName(false)} className="flex-1 bg-slate-700 text-white text-xs py-1.5 rounded-lg">إلغاء</button>
                      </div>
                    </form>
                  )}
                </div>
              )}

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

        {/* نموذج تسجيل الدخول / التسجيل */}
        {activeTab === 'auth' && (
          <div className={`max-w-md mx-auto p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-center gap-4 border-b pb-4 border-slate-700">
              <button onClick={() => setAuthMode('register')} className={`font-bold text-sm pb-1 ${authMode === 'register' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-400'}`}>حساب جديد</button>
              <button onClick={() => setAuthMode('login')} className={`font-bold text-sm pb-1 ${authMode === 'login' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-400'}`}>تسجيل الدخول</button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-medium mb-1">اسم المستخدم الكامل</label>
                    <input type="text" required value={inputRegName} onChange={e => setInputRegName(e.target.value)} placeholder="اسمك..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">البريد الإلكتروني</label>
                    <input type="email" required value={inputRegEmail} onChange={e => setInputRegEmail(e.target.value)} placeholder="name@example.com" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">رقم الهاتف</label>
                    <input type="text" required value={inputRegPhone} onChange={e => setInputRegPhone(e.target.value)} placeholder="01xxxxxxxxx" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">رقم ولي الأمر</label>
                    <input type="text" value={inputRegParentPhone} onChange={e => setInputRegParentPhone(e.target.value)} placeholder="01xxxxxxxxx" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
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

              {authMode === 'login' && (
                <div>
                  <label className="block text-xs font-medium mb-1">البريد الإلكتروني أو رقم الهاتف</label>
                  <input type="text" required value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} placeholder="أدخل البريد أو الهاتف..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium mb-1">كلمة المرور</label>
                <input type="password" required value={authMode === 'register' ? inputRegPassword : loginPassword} onChange={e => authMode === 'register' ? setInputRegPassword(e.target.value) : setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg transition">
                {authMode === 'register' ? 'إنشاء الحساب الان 🚀' : 'تسجيل الدخول ✅'}
              </button>
            </form>
          </div>
        )}

        {/* عرض الكورسات */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold">الكورسات ودروس الفيديو 📚</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(course => (
                <div key={course.id} className={`p-6 rounded-3xl border shadow-lg space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                  
                  {editingCourseId === course.id ? (
                    <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-indigo-500">
                      <h4 className="text-sm font-bold text-indigo-400">✏️ تعديل تفاصيل الكورس</h4>
                      <div>
                        <label className="text-[11px] text-slate-400">عنوان الكورس</label>
                        <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border text-xs bg-slate-900 border-slate-700 text-white" />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">التصنيف</label>
                        <input type="text" value={editCategory} onChange={e => setEditCategory(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border text-xs bg-slate-900 border-slate-700 text-white" />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">السعر</label>
                        <input type="text" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border text-xs bg-slate-900 border-slate-700 text-white" />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">الوصف</label>
                        <input type="text" value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border text-xs bg-slate-900 border-slate-700 text-white" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => handleSaveCourseEdit(course.id)} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold">حفظ</button>
                        <button onClick={() => setEditingCourseId(null)} className="bg-slate-700 text-white px-4 py-1.5 rounded-lg text-xs">إلغاء</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">{course.category}</span>
                        <span className="text-xs font-bold text-emerald-400">{course.price}</span>
                      </div>
                      <h3 className="text-xl font-bold mt-3">{course.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">المعلم: {course.instructor}</p>
                      <p className="text-sm mt-2 opacity-80">{course.description}</p>
                    </div>
                  )}

                  {isLoggedIn && userRole === 'instructor' && editingCourseId !== course.id && (
                    <div className="flex gap-2 pt-2 border-t border-slate-700/50">
                      <button onClick={() => startEditingCourse(course)} className="bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-500/30 transition">
                        ✏️ تعديل محتوى الكورس
                      </button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="bg-rose-500/20 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-rose-500/30 transition">
                        🗑️ حذف الكورس
                      </button>
                    </div>
                  )}

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

        {/* لوحة تحكم المعلم (إنشاء كورسات وامتحانات وإضافة فيديوهات) */}
        {activeTab === 'instructor-dashboard' && isLoggedIn && userRole === 'instructor' && (
          <div className="space-y-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-400">لوحة تحكم المعلم وإدارة المنصة 👨‍🏫</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* إنشاء كورس جديد */}
              <form onSubmit={handleCreateNewCourse} className={`p-6 rounded-3xl border shadow-xl space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-lg font-bold text-indigo-400">✨ إضافة كورس تعليمي جديد</h3>
                <div>
                  <label className="text-xs font-medium">اسم أو عنوان الكورس</label>
                  <input type="text" required value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="مثال: كورس الفيزياء المتقدمة..." className="w-full px-4 py-2 mt-1 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-xs font-medium">التصنيف</label>
                  <input type="text" value={newCourseCategory} onChange={e => setNewCourseCategory(e.target.value)} placeholder="مثال: الفيزياء والكيمياء" className="w-full px-4 py-2 mt-1 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-xs font-medium">السعر</label>
                  <input type="text" value={newCoursePrice} onChange={e => setNewCoursePrice(e.target.value)} placeholder="مثال: 150 جنيه أو مجاناً" className="w-full px-4 py-2 mt-1 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-xs font-medium">الوصف المختصر</label>
                  <textarea value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} placeholder="تفاصيل الكورس..." className="w-full px-4 py-2 mt-1 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white h-20" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs">نشر الكورس باسمك 🚀</button>
              </form>

              {/* إضافة فيديو لكورس */}
              <form onSubmit={handleAddVideoToCourse} className={`p-6 rounded-3xl border shadow-xl space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-lg font-bold text-amber-400">🎥 إضافة فيديو / درس جديد لكورس</h3>
                <div>
                  <label className="text-xs font-medium">اسم الكورس المستهدف (أو اكتب اسماً جديداً)</label>
                  <input type="text" required value={selectedCourseForVideo} onChange={e => setSelectedCourseForVideo(e.target.value)} placeholder="اسم الكورس بالضبط..." className="w-full px-4 py-2 mt-1 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-xs font-medium">عنوان الدرس</label>
                  <input type="text" required value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="مثال: الدرس الأول: مقدمة..." className="w-full px-4 py-2 mt-1 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-xs font-medium">المدة</label>
                  <input type="text" value={newVideoDuration} onChange={e => setNewVideoDuration(e.target.value)} placeholder="مثال: 15 دقيقة" className="w-full px-4 py-2 mt-1 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-xs font-medium">رابط الفيديو (MP4)</label>
                  <input type="text" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 mt-1 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-bold text-xs">إضافة الفيديو للكورس 🎬</button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}