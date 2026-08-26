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

  // حقول شاشة الدخول / إنشاء الحساب
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputRole, setInputRole] = useState<'student' | 'instructor'>('student');

  // قاعدة بيانات المستخدمين المسجلين
  const [usersList, setUsersList] = useState<any[]>([
    { name: 'أحمد المعلم', email: 'teacher@edu.com', password: '123', role: 'instructor' },
    { name: 'محمد الطالب', email: 'student@edu.com', password: '123', role: 'student' }
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

  // نظام الامتحانات الجديد
  const [exams, setExams] = useState<any[]>([
    {
      id: 1,
      title: "امتحان الأحياء التجريبي - الفصل الأول",
      instructor: "مروان الجندي",
      questions: [
        {
          id: 101,
          questionText: "ما هي وحدة بناء الكائن الحي؟",
          options: ["النسيج", "الخلية", "العضو", "الجهاز"],
          correctAnswer: 1
        },
        {
          id: 102,
          questionText: "أي مما يلي يوجد داخل نواة الخلية؟",
          options: ["البلاستيدات", "الميتوكوندريا", "المادة الوراثية DNA", "السيتوبلازم"],
          correctAnswer: 2
        }
      ]
    }
  ]);

  // حالات إنشاء امتحان جديد بواسطة المعلم
  const [newExamTitle, setNewExamTitle] = useState('');
  const [examQuestions, setExamQuestions] = useState<any[]>([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  // حالات أداء الامتحان من قبل الطالب ونظام منع الغش
  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<{ [key: number]: number }>({});
  const [cheatingWarnings, setCheatingWarnings] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);

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

  // تحميل البيانات عند فتح الصفحة
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('edu_users_db_v10');
      if (savedUsers) setUsersList(JSON.parse(savedUsers));

      const savedCourses = localStorage.getItem('edu_courses_v10');
      if (savedCourses) setCourses(JSON.parse(savedCourses));

      const savedExams = localStorage.getItem('edu_exams_v10');
      if (savedExams) setExams(JSON.parse(savedExams));

      const logged = localStorage.getItem('edu_logged_v10');
      if (logged === 'true') {
        setIsLoggedIn(true);
        setUserName(localStorage.getItem('edu_uname_v10') || '');
        setUserEmail(localStorage.getItem('edu_uemail_v10') || '');
        setUserRole((localStorage.getItem('edu_urole_v10') as any) || 'student');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // حفظ البيانات في localStorage
  useEffect(() => {
    try {
      localStorage.setItem('edu_courses_v10', JSON.stringify(courses));
      localStorage.setItem('edu_users_db_v10', JSON.stringify(usersList));
      localStorage.setItem('edu_exams_v10', JSON.stringify(exams));
    } catch (e) {
      console.error(e);
    }
  }, [courses, usersList, exams]);

  // 🛡️ نظام منع الغش (Anti-Cheat System) أثناء الامتحانات
  useEffect(() => {
    if (!activeExam || examSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerCheatingWarning("⚠️ تحذير: تم رصد مغادرة صفحة الامتحان! ممنوع فتح تبويبات أخرى.");
      }
    };

    const handleBlur = () => {
      triggerCheatingWarning("⚠️ تحذير: خرج مؤشر الموسم أو النافذة عن نطاق الامتحان!");
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      showToast("❌ ممنوع نسخ محتوى الأسئلة!");
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', handleCopy);
    };
  }, [activeExam, cheatingWarnings, examSubmitted]);

  const triggerCheatingWarning = (msg: string) => {
    const newWarnings = cheatingWarnings + 1;
    setCheatingWarnings(newWarnings);
    showToast(`${msg} (تحذير ${newWarnings}/3)`);

    if (newWarnings >= 3) {
      showToast("🚨 تم إنهاء الامتحان تلقائياً بسبب تكرار محاولات الغش!");
      handleSubmitExamDueToCheat();
    }
  };

  const handleSubmitExamDueToCheat = () => {
    setExamSubmitted(true);
    setExamScore(0);
    setActiveExam(null);
  };

  // دالة تسجيل حساب جديد
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName || !inputEmail || !inputPassword) {
      showToast('⚠️ يرجى إكمال جميع الحقول المطلوبة!');
      return;
    }

    const userExists = usersList.find(u => u.email.toLowerCase() === inputEmail.toLowerCase());
    if (userExists) {
      showToast('❌ البريد الإلكتروني مستخدم من قبل!');
      return;
    }

    const newUser = { name: inputName, email: inputEmail, password: inputPassword, role: inputRole };
    const updatedUsers = [...usersList, newUser];
    setUsersList(updatedUsers);

    setIsLoggedIn(true);
    setUserName(newUser.name);
    setUserEmail(newUser.email);
    setUserRole(newUser.role);

    localStorage.setItem('edu_logged_v10', 'true');
    localStorage.setItem('edu_uname_v10', newUser.name);
    localStorage.setItem('edu_uemail_v10', newUser.email);
    localStorage.setItem('edu_urole_v10', newUser.role);

    showToast(`🎉 أهلاً بك ${newUser.name}, تم إنشاء الحساب بنجاح!`);
    setInputName('');
    setInputEmail('');
    setInputPassword('');
    setActiveTab('home');
  };

  // دالة تسجيل الدخول
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
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

    localStorage.setItem('edu_logged_v10', 'true');
    localStorage.setItem('edu_uname_v10', foundUser.name);
    localStorage.setItem('edu_uemail_v10', foundUser.email);
    localStorage.setItem('edu_urole_v10', foundUser.role);

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
    localStorage.removeItem('edu_logged_v10');
    localStorage.removeItem('edu_uname_v10');
    localStorage.removeItem('edu_uemail_v10');
    localStorage.removeItem('edu_urole_v10');
    showToast('🔒 تم تسجيل الخروج بنجاح');
    setActiveTab('home');
  };

  // إضافة سؤال جديد في نموذج المعلم
  const handleAddQuestionField = () => {
    setExamQuestions([...examQuestions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  // حفظ الامتحان الجديد بواسطة المعلم
  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle || examQuestions.length === 0) {
      showToast('⚠️ يرجى كتابة عنوان الامتحان وإضافة سؤال واحد على الأقل!');
      return;
    }

    const newExamObj = {
      id: Date.now(),
      title: newExamTitle,
      instructor: userName,
      questions: examQuestions
    };

    setExams([newExamObj, ...exams]);
    showToast('✨ تم إنشاء ونشر الامتحان بنجاح!');
    setNewExamTitle('');
    setExamQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  // تصحيح الامتحان للطالب
  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    activeExam.questions.forEach((q: any, index: number) => {
      if (studentAnswers[index] === q.correctAnswer) {
        score += 1;
      }
    });

    setExamScore(score);
    setExamSubmitted(true);
    showToast(`🎯 انتهى الامتحان! حصيلتك: ${score} من ${activeExam.questions.length}`);
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

          <nav className="hidden md:flex gap-6 font-medium text-sm items-center">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-indigo-500 font-bold' : ''}>الرئيسية</button>
            <button onClick={() => setActiveTab('courses')} className={activeTab === 'courses' ? 'text-indigo-500 font-bold' : ''}>الكورسات 🎥</button>
            <button onClick={() => setActiveTab('exams')} className={activeTab === 'exams' ? 'text-indigo-500 font-bold' : ''}>الامتحانات 📝</button>
            {isLoggedIn && userRole === 'instructor' && (
              <button onClick={() => setActiveTab('instructor-dashboard')} className={activeTab === 'instructor-dashboard' ? 'text-amber-500 font-bold' : ''}>لوحة التحكم والمعلم 👨‍🏫</button>
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
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-90">منصة متكاملة للكورسات مع نظام امتحانات آمن مزود بنظام حماية ضد الغش.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setActiveTab('courses')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold shadow-lg transition">
                  تصفح الكورسات 🎥
                </button>
                <button onClick={() => setActiveTab('exams')} className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition">
                  الامتحانات المتاحة 📝
                </button>
              </div>
            </div>
          </div>
        )}

        {/* شاشة المصادقة */}
        {activeTab === 'auth' && !isLoggedIn && (
          <div className="max-w-md mx-auto space-y-6">
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-700">
                <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>تسجيل الدخول</button>
                <button onClick={() => setAuthMode('signup')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'signup' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>حساب جديد</button>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <h2 className="text-xl font-bold text-center mb-2">تسجيل الدخول</h2>
                  <div>
                    <label className="block text-xs font-medium mb-1">البريد الإلكتروني</label>
                    <input type="email" required value={inputEmail} onChange={e => setInputEmail(e.target.value)} placeholder="name@example.com" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">كلمة المرور</label>
                    <input type="password" required value={inputPassword} onChange={e => setInputPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow transition">دخول 🚀</button>
                  <p className="text-[11px] text-center text-slate-400 mt-2">حساب معلم للتجربة: teacher@edu.com | كلمة المرور: 123</p>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <h2 className="text-xl font-bold text-center mb-2">إنشاء حساب جديد</h2>
                  <div>
                    <label className="block text-xs font-medium mb-1">الاسم الكامل</label>
                    <input type="text" required value={inputName} onChange={e => setInputName(e.target.value)} placeholder="محمد أحمد..." className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">البريد الإلكتروني</label>
                    <input type="email" required value={inputEmail} onChange={e => setInputEmail(e.target.value)} placeholder="name@example.com" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">كلمة المرور</label>
                    <input type="password" required value={inputPassword} onChange={e => setInputPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">نوع الحساب</label>
                    <select value={inputRole} onChange={e => setInputRole(e.target.value as any)} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white">
                      <option value="student">طالب</option>
                      <option value="instructor">معلم</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow transition">تسجيل حساب جديد ✨</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* قسم الامتحانات ونظام منع الغش */}
        {activeTab === 'exams' && (
          <div className="space-y-8 max-w-3xl mx-auto">
            {!activeExam ? (
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold">الامتحانات المتاحة 📝</h2>
                <div className="grid grid-cols-1 gap-4">
                  {exams.map(exam => (
                    <div key={exam.id} className={`p-6 rounded-3xl border shadow-lg flex justify-between items-center ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                      <div>
                        <h3 className="text-xl font-bold">{exam.title}</h3>
                        <p className="text-xs text-amber-400 mt-1">👨‍🏫 المعلم: {exam.instructor} | عدد الأسئلة: {exam.questions.length}</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (!isLoggedIn) {
                            showToast('⚠️ يرجى تسجيل الدخول أولاً لأداء الامتحان!');
                            setActiveTab('auth');
                            return;
                          }
                          setActiveExam(exam);
                          setStudentAnswers({});
                          setCheatingWarnings(0);
                          setExamSubmitted(false);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow">
                        بدء الامتحان 🚀
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 select-none ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center border-b pb-4 border-slate-700">
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-400">{activeExam.title}</h2>
                    <p className="text-xs text-rose-400 mt-1">🛡️ نظام حماية منع الغش مفعل (ممنوع مغادرة الصفحة أو نسخ الأسئلة)</p>
                  </div>
                  <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 px-3 py-1 rounded-xl text-xs font-bold">
                    التحذيرات: {cheatingWarnings} / 3 ⚠️
                  </div>
                </div>

                {!examSubmitted ? (
                  <form onSubmit={handleSubmitExam} className="space-y-6">
                    {activeExam.questions.map((q: any, qIndex: number) => (
                      <div key={qIndex} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
                        <p className="font-bold text-sm">س {qIndex + 1}: {q.questionText}</p>
                        <div className="space-y-2">
                          {q.options.map((opt: string, optIndex: number) => (
                            <label key={optIndex} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${studentAnswers[qIndex] === optIndex ? 'bg-indigo-600/30 border-indigo-500' : 'bg-slate-800/40 border-slate-700'}`}>
                              <input 
                                type="radio" 
                                name={`question_${qIndex}`} 
                                checked={studentAnswers[qIndex] === optIndex}
                                onChange={() => setStudentAnswers({ ...studentAnswers, [qIndex]: optIndex })}
                                className="text-indigo-600"
                              />
                              <span className="text-xs">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm transition shadow">
                      تسليم الإجابات وإنهاء الامتحان ✅
                    </button>
                  </form>
                ) : (
                  <div className="text-center space-y-4 py-8">
                    <h3 className="text-2xl font-bold">🎉 انتهى الامتحان</h3>
                    <p className="text-lg">درجتك النهائية هي: <span className="text-emerald-400 font-extrabold">{examScore}</span> من <span className="font-extrabold">{activeExam.questions.length}</span></p>
                    <button onClick={() => setActiveExam(null)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold">العودة لقائمة الامتحانات</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* لوحة تحكم المعلم (إنشاء امتحانات وكورسات) */}
        {activeTab === 'instructor-dashboard' && isLoggedIn && userRole === 'instructor' && (
          <div className="space-y-12 max-w-4xl mx-auto">
            
            {/* نموذج إنشاء امتحان جديد */}
            <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-bold text-indigo-400">📝 إنشاء امتحان جديد للطلاب</h2>
              <form onSubmit={handleSaveExam} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">عنوان الامتحان</label>
                  <input type="text" required value={newExamTitle} onChange={e => setNewExamTitle(e.target.value)} placeholder="مثال: امتحان الفيزياء الشهرى" className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" />
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-700">
                  <h3 className="text-sm font-bold text-amber-400">أسئلة الامتحان (اختيار من متعدد):</h3>
                  {examQuestions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">نص السؤال {qIndex + 1}</label>
                        <input type="text" required value={q.questionText} onChange={e => {
                          const updated = [...examQuestions];
                          updated[qIndex].questionText = e.target.value;
                          setExamQuestions(updated);
                        }} placeholder="اكتب السؤال هنا..." className="w-full px-4 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt: string, optIndex: number) => (
                          <div key={optIndex}>
                            <label className="block text-[10px] text-slate-400 mb-0.5">الخيار {optIndex + 1}</label>
                            <input type="text" required value={opt} onChange={e => {
                              const updated = [...examQuestions];
                              updated[qIndex].options[optIndex] = e.target.value;
                              setExamQuestions(updated);
                            }} placeholder={`خيار ${optIndex + 1}`} className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1 text-emerald-400">رقم الخيار الصحيح (من 1 إلى 4)</label>
                        <select value={q.correctAnswer} onChange={e => {
                          const updated = [...examQuestions];
                          updated[qIndex].correctAnswer = parseInt(e.target.value);
                          setExamQuestions(updated);
                        }} className="w-full px-4 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white">
                          <option value={0}>الخيار الأول</option>
                          <option value={1}>الخيار الثاني</option>
                          <option value={2}>الخيار الثالث</option>
                          <option value={3}>الخيار الرابع</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={handleAddQuestionField} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-xs font-bold">+ إضافة سؤال آخر</button>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow transition mt-4">نشر الامتحان للطلاب 🚀</button>
              </form>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}