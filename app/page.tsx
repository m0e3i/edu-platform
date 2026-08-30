'use client';
import { useState, useEffect } from 'react';

export default function EduPlatform() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const educationalStages = [
    { 
      id: 'primary', 
      name: 'المرحلة الابتدائية 🎒',
      grades: [
        { id: 'pri-1', name: 'الصف الأول الابتدائي' },
        { id: 'pri-2', name: 'الصف الثاني الابتدائي' },
        { id: 'pri-3', name: 'الصف الثالث الابتدائي' },
        { id: 'pri-4', name: 'الصف الرابع الابتدائي' },
        { id: 'pri-5', name: 'الصف الخامس الابتدائي' },
        { id: 'pri-6', name: 'الصف السادس الابتدائي' }
      ]
    },
    { 
      id: 'preparatory', 
      name: 'المرحلة الإعدادية 📘',
      grades: [
        { id: 'prep-1', name: 'الصف الأول الإعدادي' },
        { id: 'prep-2', name: 'الصف الثاني الإعدادي' },
        { id: 'prep-3', name: 'الصف الثالث الإعدادي' }
      ]
    },
    { 
      id: 'secondary', 
      name: 'المرحلة الثانوية العامة 🎓',
      grades: [
        { id: 'sec-1', name: 'الصف الأول الثانوي' },
        { id: 'sec-2', name: 'الصف الثاني الثانوي' },
        { id: 'sec-3', name: 'الصف الثالث الثانوي' }
      ]
    },
    { 
      id: 'baccalaureate', 
      name: 'نظام البكالوريا 🌐',
      grades: [
        { id: 'bac-1', name: 'السنة الأولى البكالوريا' },
        { id: 'bac-2', name: 'السنة الثانية البكالوريا' }
      ]
    }
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<'student' | 'instructor' | 'admin'>('student');
  const [userPhone, setUserPhone] = useState('');
  const [userParentPhone, setUserParentPhone] = useState('');
  const [userStage, setUserStage] = useState('secondary'); 
  const [userGrade, setUserGrade] = useState('sec-3');     

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputParentPhone, setInputParentPhone] = useState('');
  const [inputStage, setInputStage] = useState('secondary');
  const [inputGrade, setInputGrade] = useState('sec-3');

  const currentAvailableGrades = educationalStages.find(s => s.id === inputStage)?.grades || [];

  const [usersList, setUsersList] = useState<any[]>([
    { name: 'مدير المنصة', email: '250iie3@gmail.com', password: 'Mohamad$35', phone: '01000000000', parentPhone: 'N/A', role: 'admin', status: 'active' },
    { name: 'أحمد المعلم', email: 'teacher@edu.com', password: '123', phone: '01000000000', parentPhone: 'N/A', role: 'instructor', status: 'active', stage: 'secondary', grade: 'sec-3' },
    { name: 'محمد الطالب', email: 'student@edu.com', password: '123', phone: '01111111111', parentPhone: '01222222222', role: 'student', status: 'active', stage: 'secondary', grade: 'sec-3' }
  ]);

  const [examResultsLog, setExamResultsLog] = useState<any[]>([]);
  
  const [selectedStageModal, setSelectedStageModal] = useState<any | null>(null);
  const [selectedGradeForCourses, setSelectedGradeForCourses] = useState<any | null>(null);

  const [courses, setCourses] = useState<any[]>([
    {
      id: 2,
      title: "أ/ مروان الجندي للعلوم والأحياء",
      instructor: "مروان الجندي",
      category: "العلوم والأحياء",
      stage: "secondary", 
      grade: "sec-3",
      price: "مجاناً 🎁",
      description: "شرح مبسط وممتع لمنهج الأحياء والعلوم بطريقة احترافية.",
      lessons: [
        { id: 201, title: "الدرس الأول: مدخل إلى علم الأحياء والخلية", duration: "10 دقائق", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ],
      pdfs: [],
      exam: null 
    }
  ]);

  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('');
  const [newCourseStage, setNewCourseStage] = useState('secondary');
  const [newCourseGrade, setNewCourseGrade] = useState('sec-3');
  const [newCoursePrice, setNewCoursePrice] = useState('مجاناً 🎁');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  const targetGradesForNewCourse = educationalStages.find(s => s.id === newCourseStage)?.grades || [];

  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');

  const [selectedCourseForContent, setSelectedCourseForContent] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('10 دقائق');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const [newPdfTitle, setNewPdfTitle] = useState('');
  const [newPdfUrl, setNewPdfUrl] = useState('');

  const [examCourseTarget, setExamCourseTarget] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [examQuestions, setExamQuestions] = useState<any[]>([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  const [activeExam, setActiveExam] = useState<any>(null);
  const [examAnswers, setExamAnswers] = useState<{ [key: number]: number }>({});
  const [cheatingWarnings, setCheatingWarnings] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [examStartTime, setExamStartTime] = useState<number>(0);

  // دالة حفظ نتيجة الامتحان المضافة لحل المشكلة
  const saveExamResultToLog = (score: number, warningsCount: number) => {
    if (!activeExam) return;
    const newRecord = {
      studentName: userName || 'طالب',
      studentEmail: userEmail || 'unknown@edu.com',
      examTitle: activeExam.title || 'امتحان',
      score: score,
      total: activeExam.questions.length,
      warnings: warningsCount,
      date: new Date().toLocaleString()
    };
    setExamResultsLog(prev => [newRecord, ...prev]);
  };

  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('bedaya_edu_users_db');
      if (savedUsers) setUsersList(JSON.parse(savedUsers));

      const savedCourses = localStorage.getItem('bedaya_edu_courses');
      if (savedCourses) setCourses(JSON.parse(savedCourses));

      const savedResults = localStorage.getItem('bedaya_edu_exam_results');
      if (savedResults) setExamResultsLog(JSON.parse(savedResults));

      const logged = localStorage.getItem('bedaya_edu_logged');
      if (logged === 'true') {
        setIsLoggedIn(true);
        setUserName(localStorage.getItem('bedaya_edu_uname') || '');
        setUserEmail(localStorage.getItem('bedaya_edu_uemail') || '');
        setUserRole((localStorage.getItem('bedaya_edu_urole') as any) || 'student');
        setUserPhone(localStorage.getItem('bedaya_edu_uphone') || '');
        setUserParentPhone(localStorage.getItem('bedaya_edu_uparent') || '');
        setUserStage(localStorage.getItem('bedaya_edu_ustage') || 'secondary');
        setUserGrade(localStorage.getItem('bedaya_edu_ugrade') || 'sec-3');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('bedaya_edu_courses', JSON.stringify(courses));
      localStorage.setItem('bedaya_edu_users_db', JSON.stringify(usersList));
      localStorage.setItem('bedaya_edu_exam_results', JSON.stringify(examResultsLog));
    } catch (e) {
      console.error(e);
    }
  }, [courses, usersList, examResultsLog]);

  useEffect(() => {
    if (userRole === 'student' && (activeTab === 'instructor-dashboard' || activeTab === 'admin-dashboard')) {
      setActiveTab('home');
      showToast('❌ غير مسموح للطالب بالوصول لهذه الصفحة!');
    }
  }, [activeTab, userRole]);

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

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName || !inputEmail || !inputPassword || !inputPhone || !inputParentPhone) {
      showToast('⚠️ يرجى إكمال الحقول الأساسية ورقم هاتف ولي الأمر للطالب!');
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
      parentPhone: inputParentPhone, 
      role: 'student',
      status: 'active',
      stage: inputStage,
      grade: inputGrade
    };

    const updatedUsers = [...usersList, newUser];
    setUsersList(updatedUsers);

    setIsLoggedIn(true);
    setUserName(newUser.name);
    setUserEmail(newUser.email);
    setUserRole('student');
    setUserPhone(newUser.phone);
    setUserParentPhone(newUser.parentPhone);
    setUserStage(newUser.stage);
    setUserGrade(newUser.grade);

    localStorage.setItem('bedaya_edu_logged', 'true');
    localStorage.setItem('bedaya_edu_uname', newUser.name);
    localStorage.setItem('bedaya_edu_uemail', newUser.email);
    localStorage.setItem('bedaya_edu_urole', 'student');
    localStorage.setItem('bedaya_edu_uphone', newUser.phone);
    localStorage.setItem('bedaya_edu_uparent', newUser.parentPhone);
    localStorage.setItem('bedaya_edu_ustage', newUser.stage);
    localStorage.setItem('bedaya_edu_ugrade', newUser.grade);

    showToast(`🎉 أهلاً بك ${newUser.name}, تم إنشاء حساب الطالب بنجاح!`);
    setInputName('');
    setInputEmail('');
    setInputPassword('');
    setInputPhone('');
    setInputParentPhone('');
    setActiveTab('home');
  };

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

    if (foundUser.status === 'suspended') {
      showToast('❌ هذا الحساب معطل، يرجى مراجعة إدارة المنصة.');
      return;
    }

    setIsLoggedIn(true);
    setUserName(foundUser.name);
    setUserEmail(foundUser.email);
    setUserRole(foundUser.role);
    setUserPhone(foundUser.phone || 'غير محدد');
    setUserParentPhone(foundUser.parentPhone || 'غير محدد');
    setUserStage(foundUser.stage || 'secondary');
    setUserGrade(foundUser.grade || 'sec-3');

    localStorage.setItem('bedaya_edu_logged', 'true');
    localStorage.setItem('bedaya_edu_uname', foundUser.name);
    localStorage.setItem('bedaya_edu_uemail', foundUser.email);
    localStorage.setItem('bedaya_edu_urole', foundUser.role);
    localStorage.setItem('bedaya_edu_uphone', foundUser.phone || 'غير محدد');
    localStorage.setItem('bedaya_edu_uparent', foundUser.parentPhone || 'غير محدد');
    localStorage.setItem('bedaya_edu_ustage', foundUser.stage || 'secondary');
    localStorage.setItem('bedaya_edu_ugrade', foundUser.grade || 'sec-3');

    showToast(`👋 مرحباً بك من جديد يا ${foundUser.name}!`);
    setInputEmail('');
    setInputPassword('');
    setActiveTab('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setUserRole('student');
    setUserPhone('');
    setUserParentPhone('');
    setUserStage('secondary');
    setUserGrade('sec-3');
    localStorage.clear();
    showToast('🔒 تم تسجيل الخروج بنجاح');
    setActiveTab('home');
  };

  const handleAdminCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName || !newTeacherEmail || !newTeacherPassword) {
      showToast('⚠️ يرجى إدخال اسم المدرس والبريد وكلمة المرور!');
      return;
    }
    const exists = usersList.find(u => u.email.toLowerCase() === newTeacherEmail.toLowerCase());
    if (exists) {
      showToast('❌ البريد الإلكتروني مسجل مسبقاً!');
      return;
    }

    const newTeacher = {
      name: newTeacherName,
      email: newTeacherEmail,
      password: newTeacherPassword,
      phone: newTeacherPhone || '01000000000',
      parentPhone: 'N/A',
      role: 'instructor',
      status: 'active',
      stage: 'all',
      grade: 'all'
    };

    setUsersList([...usersList, newTeacher]);
    showToast('👨‍🏫 تم إنشاء وتفعيل حساب المدرس بنجاح من خلال لوحة الأدمن!');
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewTeacherPassword('');
    setNewTeacherPhone('');
  };

  const handleToggleTeacherStatus = (email: string) => {
    setUsersList(usersList.map(u => {
      if (u.email === email) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        showToast(`🔄 تم تغيير حالة الحساب إلى: ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (email: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم نهائياً؟')) {
      setUsersList(usersList.filter(u => u.email !== email));
      showToast('🗑️ تم حذف المستخدم بنجاح');
    }
  };

  return (
    <div className={`min-h-screen font-sans relative transition-colors duration-300 ${darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-900'}`} dir="rtl">
      
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm animate-bounce border border-indigo-400">
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <header className={`border-b sticky top-0 z-45 shadow-md ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-black tracking-wide cursor-pointer flex items-center gap-1.5" onClick={() => setActiveTab('home')}>
            <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-lg text-sm sm:text-base">EDU</span>
            <span className={darkMode ? 'text-white' : 'text-slate-900'}>BEDAYA</span>
          </div>

          <nav className="hidden md:flex gap-6 font-medium text-sm items-center">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-indigo-500 font-bold' : ''}>الرئيسية</button>
            <button onClick={() => setActiveTab('courses')} className={activeTab === 'courses' ? 'text-indigo-500 font-bold' : ''}>الكورسات والملفات والامتحانات 🎥</button>
            {isLoggedIn && userRole === 'instructor' && (
              <button onClick={() => setActiveTab('instructor-dashboard')} className={activeTab === 'instructor-dashboard' ? 'text-amber-500 font-bold' : ''}>لوحة التحكم وسجل الدرجات 👨‍🏫</button>
            )}
            {isLoggedIn && userRole === 'admin' && (
              <button onClick={() => setActiveTab('admin-dashboard')} className={activeTab === 'admin-dashboard' ? 'text-emerald-500 font-bold' : ''}>لوحة إدارة الأدمن 🛠️</button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800 text-amber-400">
              {darkMode ? '☀️ نهار' : '🌙 ليل'}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full font-bold border border-indigo-500/30">
                  {userName} ({userRole === 'admin' ? 'مدير 🛠️' : userRole === 'instructor' ? 'معلم 👨‍🏫' : 'طالب 👨‍🎓'})
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 min-h-[600px]">

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-12 text-center">
            <div className={`rounded-3xl p-10 sm:p-14 border shadow-2xl ${darkMode ? 'bg-gradient-to-r from-indigo-950 to-slate-900 border-indigo-800' : 'bg-indigo-600 text-white'}`}>
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">منصة BEDAYA EDU التعليمية الذكية</h1>
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-90">اختر المرحلة الدراسية لتفتح لك الصفوف، ومنها تستطيع تصفح أو إضافة الكورسات، الفيديوهات (MP4)، ملفات الـ PDF، والامتحانات الذكية.</p>
              
              <div className="flex justify-center gap-4 flex-wrap">
                <button onClick={() => setActiveTab('courses')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold shadow-lg transition">
                  تصفح كافة الكورسات والملفات 🎥
                </button>
                {isLoggedIn && userRole === 'instructor' && (
                  <button onClick={() => setActiveTab('instructor-dashboard')} className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition">
                    لوحة تحكم المعلم (إضافة كورسات وامتحانات) ⚙️
                  </button>
                )}
                {isLoggedIn && userRole === 'admin' && (
                  <button onClick={() => setActiveTab('admin-dashboard')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition">
                    لوحة إدارة الأدمن 🛠️
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AUTH TAB */}
        {activeTab === 'auth' && (
          <div className="max-w-md mx-auto p-8 rounded-3xl border shadow-2xl bg-slate-900/40 backdrop-blur-md">
            <div className="flex justify-center mb-6 gap-2">
              <button 
                onClick={() => setAuthMode('login')} 
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${authMode === 'login' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                تسجيل الدخول
              </button>
              <button 
                onClick={() => setAuthMode('signup')} 
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${authMode === 'signup' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                حساب طالب جديد
              </button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={inputEmail} 
                    onChange={e => setInputEmail(e.target.value)} 
                    placeholder="name@edu.com"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">كلمة المرور</label>
                  <input 
                    type="password" 
                    value={inputPassword} 
                    onChange={e => setInputPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow transition">
                  دخول للمنصة 🚀
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-3">
                <p className="text-xs text-indigo-400 mb-2 font-bold text-center">إنشاء حساب جديد مخصص للطلاب فقط 👨‍🎓</p>
                <div>
                  <label className="block text-xs font-bold mb-1">الاسم الكامل</label>
                  <input 
                    type="text" 
                    value={inputName} 
                    onChange={e => setInputName(e.target.value)} 
                    placeholder="اسمك الكريم"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={inputEmail} 
                    onChange={e => setInputEmail(e.target.value)} 
                    placeholder="student@edu.com"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">كلمة المرور</label>
                  <input 
                    type="password" 
                    value={inputPassword} 
                    onChange={e => setInputPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">رقم الهاتف</label>
                  <input 
                    type="text" 
                    value={inputPhone} 
                    onChange={e => setInputPhone(e.target.value)} 
                    placeholder="011xxxxxxxx"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">رقم هاتف ولي الأمر (إلزامي)</label>
                  <input 
                    type="text" 
                    value={inputParentPhone} 
                    onChange={e => setInputParentPhone(e.target.value)} 
                    placeholder="012xxxxxxxx"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow transition mt-2">
                  تسجيل حساب طالب 🚀
                </button>
              </form>
            )}
          </div>
        )}

        {/* ADMIN DASHBOARD TAB */}
        {activeTab === 'admin-dashboard' && userRole === 'admin' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-emerald-400 flex items-center gap-2">
                <span>🛠️</span> لوحة تحكم إدارة النظام (Admin Dashboard)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-sm font-bold mb-4 text-amber-400">إنشاء / تفعيل حساب مدرس جديد</h3>
                  <form onSubmit={handleAdminCreateTeacher} className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="اسم المدرس" 
                      value={newTeacherName} 
                      onChange={e => setNewTeacherName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs" 
                    />
                    <input 
                      type="email" 
                      placeholder="البريد الإلكتروني للمدرس" 
                      value={newTeacherEmail} 
                      onChange={e => setNewTeacherEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs" 
                    />
                    <input 
                      type="password" 
                      placeholder="كلمة المرور المؤقتة" 
                      value={newTeacherPassword} 
                      onChange={e => setNewTeacherPassword(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs" 
                    />
                    <input 
                      type="text" 
                      placeholder="رقم الهاتف" 
                      value={newTeacherPhone} 
                      onChange={e => setNewTeacherPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs" 
                    />
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-xl font-bold text-xs transition">
                      إضافة وتفعيل المدرس 👨‍🏫
                    </button>
                  </form>
                </div>

                <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold mb-4 text-indigo-400">إحصائيات النظام</h3>
                    <ul className="space-y-3 text-xs">
                      <li className="flex justify-between bg-slate-900 p-3 rounded-xl">
                        <span>إجمالي المستخدمين المسجلين:</span>
                        <span className="font-bold text-indigo-400">{usersList.length}</span>
                      </li>
                      <li className="flex justify-between bg-slate-900 p-3 rounded-xl">
                        <span>إجمالي الكورسات المتاحة:</span>
                        <span className="font-bold text-amber-400">{courses.length}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-bold mb-4 text-slate-200">إدارة المستخدمين (طلاب ومعلمين)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-800 text-slate-300">
                        <th className="p-3">الاسم</th>
                        <th className="p-3">البريد</th>
                        <th className="p-3">الدور</th>
                        <th className="p-3">الحالة</th>
                        <th className="p-3">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u, idx) => (
                        <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/40">
                          <td className="p-3 font-bold">{u.name}</td>
                          <td className="p-3 opacity-80">{u.email}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${u.role === 'admin' ? 'bg-emerald-500/20 text-emerald-400' : u.role === 'instructor' ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${u.status === 'suspended' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                              {u.status || 'active'}
                            </span>
                          </td>
                          <td className="p-3 flex gap-2">
                            {u.role === 'instructor' && (
                              <button 
                                onClick={() => handleToggleTeacherStatus(u.email)} 
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${u.status === 'suspended' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}
                              >
                                {u.status === 'suspended' ? 'تفعيل' : 'تعطيل'}
                              </button>
                            )}
                            {u.role !== 'admin' && (
                              <button 
                                onClick={() => handleDeleteUser(u.email)} 
                                className="bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold"
                              >
                                حذف
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}