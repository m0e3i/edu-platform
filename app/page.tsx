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

  // المراحل الدراسية المتاحة
  const educationalStages = [
    { id: 'primary', name: 'المرحلة الابتدائية 🎒' },
    { id: 'preparatory', name: 'المرحلة الإعدادية 📘' },
    { id: 'secondary', name: 'المرحلة الثانوية العامة 🎓' },
    { id: 'baccalaureate', name: 'نظام البكالوريا 🌐' }
  ];

  // حالة تسجيل الدخول والمستخدم الحالي
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<'student' | 'instructor'>('student');
  const [userPhone, setUserPhone] = useState('');
  const [userParentPhone, setUserParentPhone] = useState('');
  const [userStage, setUserStage] = useState('secondary'); // المرحلة الدراسية للمستخدم

  // حقول شاشة الدخول / إنشاء الحساب
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputParentPhone, setInputParentPhone] = useState('');
  const [inputRole, setInputRole] = useState<'student' | 'instructor'>('student');
  const [inputStage, setInputStage] = useState('secondary');

  // قاعدة بيانات المستخدمين المسجلين
  const [usersList, setUsersList] = useState<any[]>([
    { name: 'أحمد المعلم', email: 'teacher@edu.com', password: '123', phone: '01000000000', parentPhone: 'N/A', role: 'instructor', stage: 'secondary' },
    { name: 'محمد الطالب', email: 'student@edu.com', password: '123', phone: '01111111111', parentPhone: '01222222222', role: 'student', stage: 'secondary' }
  ]);

  // سجل درجات الامتحانات للطلاب (للمعلم)
  const [examResultsLog, setExamResultsLog] = useState<any[]>([]);

  const [courses, setCourses] = useState<any[]>([
    {
      id: 2,
      title: "أ/ مروان الجندي للعلوم والأحياء",
      instructor: "مروان الجندي",
      category: "العلوم والأحياء",
      stage: "secondary", // تتبع المرحلة الثانوية العامة
      price: "مجاناً 🎁",
      description: "شرح مبسط وممتع لمنهج الأحياء والعلوم بطريقة احترافية.",
      lessons: [
        { id: 201, title: "الدرس الأول: مدخل إلى علم الأحياء والخلية", duration: "10 دقائق", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ],
      pdfs: [],
      exam: null 
    }
  ]);

  // حقول إنشاء/تعديل كورس
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('');
  const [newCourseStage, setNewCourseStage] = useState('secondary');
  const [newCoursePrice, setNewCoursePrice] = useState('مجاناً 🎁');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // حقول إضافة فيديو أو ملف PDF للكورس
  const [selectedCourseForContent, setSelectedCourseForContent] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('10 دقائق');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // حقول رفع ملف PDF
  const [newPdfTitle, setNewPdfTitle] = useState('');
  const [newPdfUrl, setNewPdfUrl] = useState(''); // رابط مباشر أو Base64 للـ PDF

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
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // حفظ البيانات في localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bedaya_edu_courses', JSON.stringify(courses));
      localStorage.setItem('bedaya_edu_users_db', JSON.stringify(usersList));
      localStorage.setItem('bedaya_edu_exam_results', JSON.stringify(examResultsLog));
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
      role: inputRole,
      stage: inputStage
    };

    const updatedUsers = [...usersList, newUser];
    setUsersList(updatedUsers);

    setIsLoggedIn(true);
    setUserName(newUser.name);
    setUserEmail(newUser.email);
    setUserRole(newUser.role);
    setUserPhone(newUser.phone);
    setUserParentPhone(newUser.parentPhone);
    setUserStage(newUser.stage);

    localStorage.setItem('bedaya_edu_logged', 'true');
    localStorage.setItem('bedaya_edu_uname', newUser.name);
    localStorage.setItem('bedaya_edu_uemail', newUser.email);
    localStorage.setItem('bedaya_edu_urole', newUser.role);
    localStorage.setItem('bedaya_edu_uphone', newUser.phone);
    localStorage.setItem('bedaya_edu_uparent', newUser.parentPhone);
    localStorage.setItem('bedaya_edu_ustage', newUser.stage);

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
    setUserStage(foundUser.stage || 'secondary');

    localStorage.setItem('bedaya_edu_logged', 'true');
    localStorage.setItem('bedaya_edu_uname', foundUser.name);
    localStorage.setItem('bedaya_edu_uemail', foundUser.email);
    localStorage.setItem('bedaya_edu_urole', foundUser.role);
    localStorage.setItem('bedaya_edu_uphone', foundUser.phone || 'غير محدد');
    localStorage.setItem('bedaya_edu_uparent', foundUser.parentPhone || 'غير محدد');
    localStorage.setItem('bedaya_edu_ustage', foundUser.stage || 'secondary');

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
    setUserStage('secondary');
    localStorage.removeItem('bedaya_edu_logged');
    localStorage.removeItem('bedaya_edu_uname');
    localStorage.removeItem('bedaya_edu_uemail');
    localStorage.removeItem('bedaya_edu_urole');
    localStorage.removeItem('bedaya_edu_uphone');
    localStorage.removeItem('bedaya_edu_uparent');
    localStorage.removeItem('bedaya_edu_ustage');
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
    setNewCourseStage(course.stage || 'secondary');
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
        stage: newCourseStage,
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
        stage: newCourseStage,
        price: newCoursePrice,
        description: newCourseDesc || 'كورس تعليمي جديد',
        lessons: [],
        pdfs: [],
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

  // حذف ملف PDF من الكورس
  const handleDeletePdf = (courseId: number, pdfId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      setCourses(courses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            pdfs: (course.pdfs || []).filter((p: any) => p.id !== pdfId)
          };
        }
        return course;
      }));
      showToast('🗑️ تم حذف ملف الـ PDF بنجاح');
    }
  };

  // إضافة فيديو أو ملف PDF للكورس
  const handleAddVideoToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForContent || !newVideoTitle) {
      showToast('يرجى اختيار الكورس وعنوان الدرس!');
      return;
    }

    const courseIndex = courses.findIndex(c => c.title.trim().toLowerCase() === selectedCourseForContent.trim().toLowerCase());
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
        title: selectedCourseForContent,
        instructor: userName,
        category: 'عام',
        stage: 'secondary',
        price: 'مجاناً 🎁',
        description: 'قسم تعليمي جديد.',
        lessons: [newLessonObj],
        pdfs: [],
        exam: null
      };
      setCourses([newCourseObj, ...courses]);
      showToast('✨ تم إنشاء الكورس وإضافة الفيديو إليه!');
    }

    setNewVideoTitle('');
    setNewVideoUrl('');
    setSelectedCourseForContent('');
  };

  // إضافة ملف PDF للكورس
  const handleAddPdfToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForContent || !newPdfTitle || !newPdfUrl) {
      showToast('يرجى اختيار الكورس وعنوان الملف ورابط الـ PDF!');
      return;
    }

    const courseIndex = courses.findIndex(c => c.title.trim().toLowerCase() === selectedCourseForContent.trim().toLowerCase());
    const newPdfObj = {
      id: Date.now(),
      title: newPdfTitle,
      pdfUrl: newPdfUrl
    };

    if (courseIndex !== -1) {
      const updated = [...courses];
      if (!updated[courseIndex].pdfs) updated[courseIndex].pdfs = [];
      updated[courseIndex].pdfs.push(newPdfObj);
      setCourses(updated);
      showToast('📄 تمت إضافة ملف الـ PDF بنجاح للكورس!');
    } else {
      showToast('❌ الكورس المستهدف غير موجود! أنشئ الكورس أولاً.');
      return;
    }

    setNewPdfTitle('');
    setNewPdfUrl('');
    setSelectedCourseForContent('');
  };

  // رفع ملف محلي وتحويله لـ Base64 لسهولة العرض الفوري
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showToast('⚠️ يرجى اختيار ملف بصيغة PDF فقط!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPdfUrl(reader.result as string);
        showToast('✅ تم تحميل الملف بنجاح، اضغط إضافة PDF الآن');
      };
      reader.readAsDataURL(file);
    }
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

  // فلترة الكورسات بناءً على مرحلة الطالب (إذا كان طالباً مسجلاً، تظهر له مرحلته فقط، والمعلم يرى الكل)
  const filteredCourses = (isLoggedIn && userRole === 'student') 
    ? courses.filter(c => !c.stage || c.stage === userStage)
    : courses;

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
          {/* تعديل اسم المنصة ليكون BEDAYA EDU */}
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
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800 text-amber-400">
              {darkMode ? '☀️ نهار' : '🌙 ليل'}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full font-bold border border-indigo-500/30">
                  {userName} ({userRole === 'instructor' ? 'معلم 👨‍🏫' : `طالب 👨‍🎓 - ${educationalStages.find(s => s.id === userStage)?.name || ''}`})
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
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">منصة BEDAYA EDU التعليمية الذكية</h1>
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-90">منصة تعليمية متكاملة لجميع المراحل التعليمية (الابتدائية، الإعدادية، الثانوية العامة، ونظام البكالوريا)، تدعم الكورسات، ملفات الـ PDF، والامتحانات الذكية.</p>
              
              {/* عرض الأقسام والمراحل في الرئيسية */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                {educationalStages.map((stage) => (
                  <div key={stage.id} className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold">{stage.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <button onClick={() => setActiveTab('courses')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold shadow-lg transition">
                  تصفح الكورسات والملفات 🎥
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
                  <h2 className="text-xl font-bold text-center mb-2">إنشاء حساب جديد في BEDAYA EDU</h2>
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
                    <label className="block text-xs font-medium mb-1">رقم الهاتف</label>
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
                    <label className="block text-xs font-medium mb-1">اختر المرحلة الدراسية 📚</label>
                    <select 
                      value={inputStage} 
                      onChange={e => setInputStage(e.target.value)} 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-indigo-500/50 text-white font-bold"
                    >
                      {educationalStages.map(stage => (
                        <option key={stage.id} value={stage.id}>{stage.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">نوع الحساب</label>
                    <select 
                      value={inputRole} 
                      onChange={e => setInputRole(e.target.value as any)} 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white"
                    >
                      <option value="student">طالب (استعراض مرحلتك الدراسية فقط)</option>
                      <option value="instructor">معلم (إنشاء وإدارة الكورسات لجميع المراحل)</option>
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

        {/* واجهة عرض الكورسات والملفات والامتحانات */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">الكورسات والملفات والامتحانات 📚</h2>
                {isLoggedIn && userRole === 'student' && (
                  <p className="text-xs text-indigo-400 mt-1 font-semibold">تستعرض الآن محتوى مرحلتك: {educationalStages.find(s => s.id === userStage)?.name}</p>
                )}
              </div>
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
              {filteredCourses.length === 0 ? (
                <div className="col-span-2 text-center py-12 bg-slate-800/30 rounded-3xl border border-slate-800">
                  <p className="text-sm text-slate-400">لا توجد كورسات مضافة مخصصة لمرحلتك الدراسية حالياً.</p>
                </div>
              ) : (
                filteredCourses.map(course => (
                  <div key={course.id} className={`p-6 rounded-3xl border shadow-lg space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div>
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div className="flex gap-2">
                          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">{course.category}</span>
                          <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-bold">
                            {educationalStages.find(s => s.id === course.stage)?.name || 'عام'}
                          </span>
                        </div>
                        
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

                    {/* الفيديوهات والدروس */}
                    <div className="space-y-3 pt-3 border-t border-slate-700">
                      <h4 className="text-xs font-bold text-amber-400">الفيديوهات والدروس ({course.lessons?.length || 0}):</h4>
                      {(!course.lessons || course.lessons.length === 0) ? (
                        <p className="text-xs text-slate-400">لا توجد فيديوهات مضافة في هذا الكورس بعد.</p>
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

                    {/* ملفات الـ PDF */}
                    <div className="space-y-3 pt-3 border-t border-slate-700">
                      <h4 className="text-xs font-bold text-emerald-400">الملفات والمذكرات PDF ({course.pdfs?.length || 0}):</h4>
                      {(!course.pdfs || course.pdfs.length === 0) ? (
                        <p className="text-xs text-slate-400">لا توجد ملفات PDF مضافة لهذا الكورس.</p>
                      ) : (
                        course.pdfs.map((pdf: any) => (
                          <div key={pdf.id} className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-800/40 flex justify-between items-center">
                            <span className="text-xs font-bold text-emerald-300">📄 {pdf.title}</span>
                            <div className="flex gap-2">
                              <a href={pdf.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] px-3 py-1.5 rounded-lg font-bold">
                                عرض / تحميل PDF 📥
                              </a>
                              {isLoggedIn && userRole === 'instructor' && (
                                <button onClick={() => handleDeletePdf(course.id, pdf.id)} className="text-rose-400 text-[11px] font-bold px-2">
                                  ❌ حذف
                                </button>
                              )}
                            </div>
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
                            <p className="text-xs font-bold text-indigo-200">📝 {course.exam.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">عدد الأسئلة: {course.exam.questions.length}</p>
                          </div>
                          {isLoggedIn && userRole === 'student' && (
                            <button onClick={() => handleStartExam(course.exam)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-xl font-bold shadow">
                              ابدأ الامتحان الآن 🚀
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">لا يوجد امتحان منشور لهذا الكورس حالياً.</p>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* لوحة تحكم المعلم (إضافة كورسات، فيديوهات، ملفات PDF، وامتحانات وسجل الدرجات) */}
        {activeTab === 'instructor-dashboard' && isLoggedIn && userRole === 'instructor' && (
          <div className="space-y-12">
            <h2 className="text-2xl sm:text-3xl font-bold">لوحة تحكم المعلم وإدارة المنصة 👨‍🏫</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* نموذج إنشاء أو تعديل كورس */}
              <div className={`p-6 rounded-3xl border shadow-lg space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-lg font-bold text-indigo-400">{editingCourseId ? '✏️ تعديل بيانات الكورس' : '➕ إنشاء كورس أو قسم جديد'}</h3>
                <form onSubmit={handleSaveCourse} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">اسم الكورس / المادة</label>
                    <input 
                      type="text" 
                      required 
                      value={newCourseTitle} 
                      onChange={e => setNewCourseTitle(e.target.value)} 
                      placeholder="مثال: الفيزيائى للثانوية العامة" 
                      className="w-full px-4 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">اسم المعلم</label>
                    <input 
                      type="text" 
                      value={newCourseInstructor} 
                      onChange={e => setNewCourseInstructor(e.target.value)} 
                      placeholder={userName} 
                      className="w-full px-4 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">التصنيف</label>
                      <input 
                        type="text" 
                        value={newCourseCategory} 
                        onChange={e => setNewCourseCategory(e.target.value)} 
                        placeholder="فيزياء، أحياء..." 
                        className="w-full px-4 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">المرحلة الدراسية 🎓</label>
                      <select 
                        value={newCourseStage} 
                        onChange={e => setNewCourseStage(e.target.value)} 
                        className="w-full px-4 py-2 rounded-xl border text-xs bg-slate-900 border-indigo-500 text-white font-bold"
                      >
                        {educationalStages.map(stage => (
                          <option key={stage.id} value={stage.id}>{stage.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">وصف الكورس</label>
                    <textarea 
                      value={newCourseDesc} 
                      onChange={e => setNewCourseDesc(e.target.value)} 
                      placeholder="تفاصيل المحتوى..." 
                      className="w-full px-4 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs shadow transition">
                    {editingCourseId ? 'حفظ التعديلات ✨' : 'إنشاء الكورس 🚀'}
                  </button>
                </form>
              </div>

              {/* إضافة فيديو أو ملف PDF للكورس */}
              <div className={`p-6 rounded-3xl border shadow-lg space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-lg font-bold text-amber-400">🎥 إضافة محتوى (فيديو أو ملف PDF)</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">اختر الكورس المستهدف</label>
                    <select 
                      value={selectedCourseForContent} 
                      onChange={e => setSelectedCourseForContent(e.target.value)} 
                      className="w-full px-4 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white"
                    >
                      <option value="">-- اختر الكورس --</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.title}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* نموذج إضافة فيديو */}
                  <form onSubmit={handleAddVideoToCourse} className="space-y-2 pt-2 border-t border-slate-700">
                    <p className="text-xs font-bold text-amber-300">أضف درس فيديو:</p>
                    <input 
                      type="text" 
                      required 
                      value={newVideoTitle} 
                      onChange={e => setNewVideoTitle(e.target.value)} 
                      placeholder="عنوان الدرس (مثال: الدرس الثاني)" 
                      className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                    />
                    <input 
                      type="text" 
                      value={newVideoUrl} 
                      onChange={e => setNewVideoUrl(e.target.value)} 
                      placeholder="رابط فيديو MP4 مباشر" 
                      className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                    />
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs">
                      إضافة الفيديو للكورس 📺
                    </button>
                  </form>

                  {/* نموذج إضافة ملف PDF */}
                  <form onSubmit={handleAddPdfToCourse} className="space-y-2 pt-2 border-t border-slate-700">
                    <p className="text-xs font-bold text-emerald-300">أضف ملف أو مذكرة PDF 📄:</p>
                    <input 
                      type="text" 
                      required 
                      value={newPdfTitle} 
                      onChange={e => setNewPdfTitle(e.target.value)} 
                      placeholder="اسم المذكرة أو الملخص (مثال: ملخص باب الميكانيكا)" 
                      className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                    />
                    <div className="flex gap-2 items-center">
                      <input 
                        type="file" 
                        accept="application/pdf"
                        onChange={handleFileUpload} 
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/20 file:text-emerald-400 hover:file:bg-emerald-500/30" 
                      />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs">
                      رفع وإضافة ملف الـ PDF 📥
                    </button>
                  </form>

                </div>
              </div>

            </div>

            {/* نشر امتحان جديد */}
            <div className={`p-6 rounded-3xl border shadow-lg space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-lg font-bold text-indigo-400">📝 نشر امتحان ذكي للكورس</h3>
              <form onSubmit={handleSaveExam} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">اسم الكورس المستهدف</label>
                    <input 
                      type="text" 
                      required 
                      value={examCourseTarget} 
                      onChange={e => setExamCourseTarget(e.target.value)} 
                      placeholder="اكتب اسم الكورس تماماً..." 
                      className="w-full px-4 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">عنوان الامتحان</label>
                    <input 
                      type="text" 
                      required 
                      value={examTitle} 
                      onChange={e => setExamTitle(e.target.value)} 
                      placeholder="اختبار الشامل على الفصل الأول" 
                      className="w-full px-4 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                </div>

                {/* حقول الأسئلة */}
                <div className="space-y-4 pt-2">
                  {examQuestions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-indigo-300 mb-1">السؤال {qIndex + 1}</label>
                        <input 
                          type="text" 
                          required 
                          value={q.question} 
                          onChange={e => {
                            const updated = [...examQuestions];
                            updated[qIndex].question = e.target.value;
                            setExamQuestions(updated);
                          }} 
                          placeholder="نص السؤال هنا..." 
                          className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt: string, optIndex: number) => (
                          <input 
                            key={optIndex}
                            type="text"
                            required
                            value={opt}
                            onChange={e => {
                              const updated = [...examQuestions];
                              updated[qIndex].options[optIndex] = e.target.value;
                              setExamQuestions(updated);
                            }}
                            placeholder={`الاختيار ${optIndex + 1}`}
                            className="px-3 py-1.5 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white"
                          />
                        ))}
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium mb-1 text-emerald-400">رقم الإجابة الصحيحة (0 للاول، 1 للثاني، إلخ):</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="3" 
                          value={q.correctAnswer} 
                          onChange={e => {
                            const updated = [...examQuestions];
                            updated[qIndex].correctAnswer = parseInt(e.target.value) || 0;
                            setExamQuestions(updated);
                          }} 
                          className="w-24 px-3 py-1 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                        />
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    onClick={() => setExamQuestions([...examQuestions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }])} 
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    ➕ إضافة سؤال آخر
                  </button>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow">
                  نشر الامتحان للطلاب 📝
                </button>
              </form>
            </div>

            {/* سجل درجات الطلاب وأرقام أولياء الأمور */}
            <div className={`p-6 rounded-3xl border shadow-lg space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-lg font-bold text-amber-400">📊 سجل درجات الطلاب وأرقام أولياء الأمور</h3>
              {examResultsLog.length === 0 ? (
                <p className="text-xs text-slate-400">لا توجد نتائج مسجلة حتى الآن.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="py-3 px-2">اسم الطالب</th>
                        <th className="py-3 px-2">رقم الطالب</th>
                        <th className="py-3 px-2">رقم ولي الأمر 📱</th>
                        <th className="py-3 px-2">الامتحان</th>
                        <th className="py-3 px-2">النتيجة</th>
                        <th className="py-3 px-2">الوقت المستغرق</th>
                        <th className="py-3 px-2">إنذارات الغش</th>
                        <th className="py-3 px-2">التاريخ</th>
                        <th className="py-3 px-2">إجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {examResultsLog.map((res: any) => (
                        <tr key={res.id} className="hover:bg-slate-900/30">
                          <td className="py-3 px-2 font-bold">{res.studentName}</td>
                          <td className="py-3 px-2">{res.studentPhone}</td>
                          <td className="py-3 px-2 font-bold text-amber-400">{res.parentPhone}</td>
                          <td className="py-3 px-2">{res.examTitle}</td>
                          <td className="py-3 px-2 font-bold text-emerald-400">{res.score}</td>
                          <td className="py-3 px-2">{res.duration}</td>
                          <td className="py-3 px-2 font-bold text-rose-400">{res.cheatingAttempts} محاولات</td>
                          <td className="py-3 px-2 text-slate-400 text-[11px]">{res.date}</td>
                          <td className="py-3 px-2">
                            <button onClick={() => handleDeleteExamResult(res.id)} className="text-rose-400 hover:text-rose-300">
                              🗑️ حذف
                            </button>
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

        {/* نافذة الامتحان التفاعلي للطالب */}
        {activeExam && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`max-w-2xl w-full p-8 rounded-3xl border shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-[#1e293b] border-slate-700 text-white' : 'bg-white text-slate-900'}`}>
              <div className="flex justify-between items-center border-b pb-4 border-slate-700">
                <h3 className="text-xl font-bold">📝 {activeExam.title}</h3>
                <span className="text-xs bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full font-bold">
                  ⚠️ إنذارات الغش: {cheatingWarnings}/3
                </span>
              </div>

              {!examSubmitted ? (
                <div className="space-y-6">
                  {activeExam.questions.map((q: any, qIndex: number) => (
                    <div key={qIndex} className="space-y-3 p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                      <p className="text-sm font-bold">س {qIndex + 1}: {q.question}</p>
                      <div className="grid grid-cols-1 gap-2">
                        {q.options.map((opt: string, optIndex: number) => (
                          <label key={optIndex} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${examAnswers[qIndex] === optIndex ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold' : 'border-slate-800 hover:bg-slate-800/50'}`}>
                            <input 
                              type="radio" 
                              name={`question-${qIndex}`} 
                              checked={examAnswers[qIndex] === optIndex} 
                              onChange={() => setExamAnswers({...examAnswers, [qIndex]: optIndex})} 
                              className="text-indigo-600"
                            />
                            <span className="text-xs">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button onClick={handleSubmitExam} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow">
                    تسليم الامتحان الان 🎯
                  </button>
                </div>
              ) : (
                <div className="space-y-6 text-center py-8">
                  <h4 className="text-2xl font-black text-emerald-400">🎉 انتهى الامتحان بنجاح!</h4>
                  <p className="text-lg font-bold">نتيحتك النهائية: {examScore} / {activeExam.questions.length}</p>
                  <p className="text-xs text-slate-400">تم تسجيل النتيجة ورقم ولي الأمر في سجل المعلم تلقائياً.</p>
                  <button onClick={() => setActiveExam(null)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow">
                    إغلاق النافذة ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* الفوتر */}
      <footer className={`border-t mt-20 py-6 text-center text-xs opacity-75 ${darkMode ? 'bg-[#1e293b] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
        <p>جميع الحقوق محفوظة © 2026 - منصة <span className="font-bold text-indigo-500">BEDAYA EDU</span> التعليمية الذكية</p>
      </footer>

    </div>
  );
}