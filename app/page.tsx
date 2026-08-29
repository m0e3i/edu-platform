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
  const [userRole, setUserRole] = useState<'student' | 'instructor'>('student');
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
  const [inputRole, setInputRole] = useState<'student' | 'instructor'>('student');
  const [inputStage, setInputStage] = useState('secondary');
  const [inputGrade, setInputGrade] = useState('sec-3');

  // تعريف الصفوف المتاحة بناءً على المرحلة المختارة في التسجيل لتجنب الخطأ
  const currentAvailableGrades = educationalStages.find(s => s.id === inputStage)?.grades || [];
setUserRole((localStorage.getItem('edu_urole_v9') as any) || 'student');
  const [usersList, setUsersList] = useState<any[]>([
    { name: 'أحمد المعلم', email: 'teacher@edu.com', password: '123', phone: '01000000000', parentPhone: 'N/A', role: 'instructor', stage: 'secondary', grade: 'sec-3' },
    { name: 'محمد الطالب', email: 'student@edu.com', password: '123', phone: '01111111111', parentPhone: '01222222222', role: 'student', stage: 'secondary', grade: 'sec-3' }
  ]);

  const [examResultsLog, setExamResultsLog] = useState<any[]>([]);
  const [selectedStageModal, setSelectedStageModal] = useState<any | null>(null);
  const [selectedGradeModal, setSelectedGradeModal] = useState<any | null>(null);

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
      stage: inputRole === 'student' ? inputStage : 'all',
      grade: inputRole === 'student' ? inputGrade : 'all'
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
    setUserGrade(newUser.grade);

    localStorage.setItem('bedaya_edu_logged', 'true');
    localStorage.setItem('bedaya_edu_uname', newUser.name);
    localStorage.setItem('bedaya_edu_uemail', newUser.email);
    localStorage.setItem('bedaya_edu_urole', newUser.role);
    localStorage.setItem('bedaya_edu_uphone', newUser.phone);
    localStorage.setItem('bedaya_edu_uparent', newUser.parentPhone);
    localStorage.setItem('bedaya_edu_ustage', newUser.stage);
    localStorage.setItem('bedaya_edu_ugrade', newUser.grade);

    showToast(`🎉 أهلاً بك ${newUser.name}, تم إنشاء الحساب وتسجيل الدخول بنجاح!`);
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
    localStorage.removeItem('bedaya_edu_logged');
    localStorage.removeItem('bedaya_edu_uname');
    localStorage.removeItem('bedaya_edu_uemail');
    localStorage.removeItem('bedaya_edu_urole');
    localStorage.removeItem('bedaya_edu_uphone');
    localStorage.removeItem('bedaya_edu_uparent');
    localStorage.removeItem('bedaya_edu_ustage');
    localStorage.removeItem('bedaya_edu_ugrade');
    showToast('🔒 تم تسجيل الخروج بنجاح');
    setActiveTab('home');
  };

  const handleDeleteCourse = (courseId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الكورس نهائياً؟')) {
      setCourses(courses.filter(c => c.id !== courseId));
      showToast('🗑️ تم حذف الكورس بنجاح');
    }
  };

  const handleStartEditCourse = (course: any) => {
    setEditingCourseId(course.id);
    setNewCourseTitle(course.title);
    setNewCourseInstructor(course.instructor);
    setNewCourseCategory(course.category);
    setNewCourseStage(course.stage || 'secondary');
    setNewCourseGrade(course.grade || 'sec-3');
    setNewCoursePrice(course.price);
    setNewCourseDesc(course.description);
    setActiveTab('instructor-dashboard');
    showToast('✏️ قم بتعديل بيانات الكورس في لوحة التحكم');
  };

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
        grade: newCourseGrade,
        price: newCoursePrice,
        description: newCourseDesc
      } : c));
      showToast('✨ تم تحديث الكورس بنجاح!');
      setEditingCourseId(null);
    } else {
      const newCourseObj = {
        id: Date.now(),
        title: newCourseTitle,
        instructor: newCourseInstructor || userName || 'المعلم',
        category: newCourseCategory || 'عام',
        stage: newCourseStage,
        grade: newCourseGrade,
        price: newCoursePrice,
        description: newCourseDesc || 'كورس تعليمي جديد',
        lessons: [],
        pdfs: [],
        exam: null
      };
      setCourses([newCourseObj, ...courses]);
      showToast('✨ تم إنشاء الكورس وإضافته للصف بنجاح!');
    }

    setNewCourseTitle('');
    setNewCourseInstructor('');
    setNewCourseDesc('');
    setNewCourseCategory('');
  };

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

  const handleAddVideoToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForContent || !newVideoTitle || !newVideoUrl) {
      showToast('يرجى اختيار الكورس، عنوان الدرس، وتوفير رابط أو رفع فيديو (MP4)!');
      return;
    }

    const courseIndex = courses.findIndex(c => c.title.trim().toLowerCase() === selectedCourseForContent.trim().toLowerCase());
    const newLessonObj = {
      id: Date.now(),
      title: newVideoTitle,
      duration: newVideoDuration,
      videoUrl: newVideoUrl
    };

    if (courseIndex !== -1) {
      const updated = [...courses];
      updated[courseIndex].lessons.push(newLessonObj);
      setCourses(updated);
      showToast('🎥 تمت إضافة الفيديو بنجاح للكورس!');
    } else {
      showToast('❌ الكورس المستهدف غير موجود! أنشئ الكورس أولاً.');
      return;
    }

    setNewVideoTitle('');
    setNewVideoUrl('');
    setSelectedCourseForContent('');
  };

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

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes('mp4') && !file.type.includes('video/')) {
        showToast('⚠️ يرجى اختيار ملف فيديو صالح بصيغة MP4!');
        return;
      }
      
      showToast('⏳ جاري رفع ومعالجة الفيديو، قد يستغرق ذلك لحظات...');
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewVideoUrl(reader.result as string);
        showToast('✅ تم رفع الفيديو بنجاح من الجهاز، اضغط إضافة فيديو الآن!');
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleStartExam = (exam: any) => {
    setActiveExam(exam);
    setExamAnswers({});
    setCheatingWarnings(0);
    setExamSubmitted(false);
    setExamScore(0);
    setExamStartTime(Date.now());
  };

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 min-h-[600px]">

        {activeTab === 'home' && (
          <div className="space-y-12 text-center">
            <div className={`rounded-3xl p-10 sm:p-14 border shadow-2xl ${darkMode ? 'bg-gradient-to-r from-indigo-950 to-slate-900 border-indigo-800' : 'bg-indigo-600 text-white'}`}>
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">منصة BEDAYA EDU التعليمية الذكية</h1>
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-90">اختر المرحلة الدراسية لتفتح لك الصفوف، ومنها تستطيع تصفح أو إضافة الكورسات، الفيديوهات (MP4)، ملفات الـ PDF، والامتحانات الذكية.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto mb-10 text-right">
                {educationalStages.map((stage) => (
                  <div 
                    key={stage.id} 
                    onClick={() => setSelectedStageModal(stage)}
                    className="p-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md cursor-pointer transition transform hover:-translate-y-1 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-base font-black block mb-2">{stage.name}</span>
                      <p className="text-xs opacity-75">اضغط لاختيار الصفوف الدراسية التابعة للمرحلة 📂</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-amber-300 flex items-center justify-between">
                      <span>عرض الصفوف</span>
                      <span>⬅</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 flex-wrap">
                <button onClick={() => setActiveTab('courses')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold shadow-lg transition">
                  تصفح كافة الكورسات والملفات 🎥
                </button>
                {isLoggedIn && userRole === 'instructor' && (
                  <button onClick={() => setActiveTab('instructor-dashboard')} className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition">
                    لوحة تحكم المعلم (إضافة كورسات وامتحانات) ⚙️
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedStageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl relative ${darkMode ? 'bg-[#1e293b] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
              <button 
                onClick={() => setSelectedStageModal(null)}
                className="absolute top-4 left-4 text-slate-400 hover:text-white text-lg font-bold bg-slate-800/50 w-9 h-9 rounded-full flex items-center justify-center"
              >
                ✕
              </button>

              <h3 className="text-xl font-black mb-2 text-indigo-400">{selectedStageModal.name}</h3>
              <p className="text-xs text-slate-400 mb-6">اختر الصف الدراسي المطلوب لعرض الكورسات الخاصة به أو لإضافة كورس جديد:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {selectedStageModal.grades.map((grade: any) => (
                  <div 
                    key={grade.id}
                    onClick={() => {
                      setSelectedGradeModal(grade);
                      setSelectedStageModal(null);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${darkMode ? 'bg-slate-900/60 border-slate-700 hover:border-indigo-500' : 'bg-slate-100 border-slate-200 hover:border-indigo-500'}`}
                  >
                    <span className="font-bold text-sm">{grade.name}</span>
                    <span className="text-xs bg-indigo-600 text-white px-2.5 py-1 rounded-lg">فتح الصف 🪟</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setSelectedStageModal(null)}
                className="w-full bg-slate-800 text-slate-300 py-3 rounded-xl font-bold text-xs"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        )}

        {selectedGradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className={`w-full max-w-3xl rounded-3xl p-6 sm:p-8 border shadow-2xl relative my-8 ${darkMode ? 'bg-[#1e293b] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
              <button 
                onClick={() => setSelectedGradeModal(null)}
                className="absolute top-4 left-4 text-slate-400 hover:text-white text-lg font-bold bg-slate-800/50 w-9 h-9 rounded-full flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-indigo-400">{selectedGradeModal.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">نافذة إدارة وعرض كورسات هذا الصف الدراسي ومحتوياته</p>
                </div>
                {isLoggedIn && userRole === 'instructor' && (
                  <button 
                    onClick={() => {
                      setNewCourseStage(selectedStageModal?.id || 'secondary');
                      setNewCourseGrade(selectedGradeModal.id);
                      setSelectedGradeModal(null);
                      setActiveTab('instructor-dashboard');
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow"
                  >
                    + إضافة كورس جديد لهذا الصف ➕
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {courses.filter(c => c.grade === selectedGradeModal.id).length === 0 ? (
                  <div className="text-center py-10 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700">
                    <p className="text-sm text-slate-400 mb-2">لا توجد كورسات مضافة لهذا الصف حتى الآن.</p>
                    {isLoggedIn && userRole === 'instructor' && (
                      <p className="text-xs text-amber-400 font-bold">يمكنك الانتقال للوحة التحكم وإضافة كورس فوراً!</p>
                    )}
                  </div>
                ) : (
                  courses.filter(c => c.grade === selectedGradeModal.id).map(course => (
                    <div key={course.id} className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'} space-y-3`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-lg font-bold">{course.category}</span>
                          <h4 className="text-lg font-bold mt-1.5">{course.title}</h4>
                          <p className="text-xs text-slate-400">المعلم: {course.instructor}</p>
                        </div>
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-xl font-bold">{course.price}</span>
                      </div>
                      <p className="text-xs text-slate-300">{course.description}</p>

                      <div className="space-y-2 pt-2 border-t border-slate-700/50">
                        <span className="text-xs font-bold text-amber-400 block">🎥 فيديوهات الشرح ({course.lessons?.length || 0}):</span>
                        {course.lessons?.map((lesson: any) => (
                          <div key={lesson.id} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold">{lesson.title}</span>
                              <span className="text-slate-400">{lesson.duration}</span>
                            </div>
                            <video controls className="w-full h-48 rounded-lg bg-black">
                              <source src={lesson.videoUrl} type="video/mp4" />
                              متصفحك لا يدعم عرض الفيديو.
                            </video>
                          </div>
                        ))}
                      </div>

                      {course.pdfs && course.pdfs.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-700/50">
                          <span className="text-xs font-bold text-indigo-400 block">📄 ملفات الـ PDF المرفقة:</span>
                          <div className="flex flex-wrap gap-2">
                            {course.pdfs.map((pdf: any) => (
                              <a 
                                key={pdf.id} 
                                href={pdf.pdfUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-600/30"
                              >
                                <span>📥</span> {pdf.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {course.exam && (
                        <div className="pt-3 border-t border-slate-700/50">
                          <button 
                            onClick={() => handleStartExam(course.exam)}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-2"
                          >
                            <span>📝</span> بدء امتحان الكورس: {course.exam.title}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end">
                <button 
                  onClick={() => setSelectedGradeModal(null)}
                  className="bg-slate-800 text-slate-300 px-6 py-2.5 rounded-xl font-bold text-xs"
                >
                  إغلاق النافذة
                </button>
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
                    <label className="block text-xs font-medium mb-1">رقم الهاتف الشخصي</label>
                    <input 
                      type="text" 
                      required 
                      value={inputPhone} 
                      onChange={e => setInputPhone(e.target.value)} 
                      placeholder="010XXXXXXXX" 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">نوع الحساب</label>
                    <select 
                      value={inputRole} 
                      onChange={e => setInputRole(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white"
                    >
                      <option value="student">طالب 👨‍🎓</option>
                      <option value="instructor">معلم 👨‍🏫 (يمتلك صلاحيات كاملة)</option>
                    </select>
                  </div>

                  {inputRole === 'student' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium mb-1">رقم ولي الأمر (لإرسال درجات الامتحانات)</label>
                        <input 
                          type="text" 
                          required 
                          value={inputParentPhone} 
                          onChange={e => setUserParentPhone(e.target.value) || setInputParentPhone(e.target.value)} 
                          placeholder="012XXXXXXXX" 
                          className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">المرحلة الدراسية</label>
                        <select 
                          value={inputStage} 
                          onChange={e => {
                            setInputStage(e.target.value);
                            const st = educationalStages.find(s => s.id === e.target.value);
                            if (st && st.grades.length > 0) setInputGrade(st.grades[0].id);
                          }}
                          className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white"
                        >
                          {educationalStages.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">الصف الدراسي</label>
                        <select 
                          value={inputGrade} 
                          onChange={e => setInputGrade(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white"
                        >
                          {currentAvailableGrades.map((g: any) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow transition">
                    تسجيل الحساب 🚀
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-black">الكورسات والملفات والامتحانات المتاحة 📚</h2>
                <p className="text-xs text-slate-400 mt-1">تصفح الفيديوهات التعليمية، حمل ملفات الـ PDF، وابدأ الامتحانات الذكية.</p>
              </div>
              {isLoggedIn && userRole === 'instructor' && (
                <button onClick={() => setActiveTab('instructor-dashboard')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow">
                  إدارة الكورسات والمحتوى والامتحانات ⚙️
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(course => (
                <div key={course.id} className={`p-6 rounded-3xl border shadow-lg ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-lg font-bold">{course.category}</span>
                      <h3 className="text-xl font-bold mt-2">{course.title}</h3>
                      <p className="text-xs text-slate-400">المعلم: {course.instructor}</p>
                    </div>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl font-bold">{course.price}</span>
                  </div>
                  <p className="text-xs text-slate-300">{course.description}</p>

                  <div className="space-y-3 pt-3 border-t border-slate-700/50">
                    <span className="text-xs font-bold text-amber-400 block">🎥 الفيديوهات والشروحات التعليمية ({course.lessons?.length || 0}):</span>
                    {course.lessons && course.lessons.length > 0 ? (
                      course.lessons.map((lesson: any) => (
                        <div key={lesson.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-700 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold">{lesson.title}</span>
                            <span className="text-slate-400">{lesson.duration}</span>
                          </div>
                          <video controls className="w-full h-52 rounded-xl bg-black">
                            <source src={lesson.videoUrl} type="video/mp4" />
                            متصفحك لا يدعم عرض الفيديو.
                          </video>
                          {isLoggedIn && userRole === 'instructor' && (
                            <button onClick={() => handleDeleteLesson(course.id, lesson.id)} className="text-rose-400 text-[11px] font-bold">
                              🗑️ حذف هذا الفيديو
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">لا توجد فيديوهات مضافة لهذا الكورس بعد.</p>
                    )}
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-700/50">
                    <span className="text-xs font-bold text-indigo-400 block">📄 ملفات الـ PDF المرفقة ({course.pdfs?.length || 0}):</span>
                    {course.pdfs && course.pdfs.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {course.pdfs.map((pdf: any) => (
                          <div key={pdf.id} className="flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl">
                            <a href={pdf.pdfUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-300 hover:underline flex items-center gap-1">
                              <span>📥</span> {pdf.title}
                            </a>
                            {isLoggedIn && userRole === 'instructor' && (
                              <button onClick={() => handleDeletePdf(course.id, pdf.id)} className="text-rose-400 text-xs">✕</button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">لا توجد ملفات PDF مضافة.</p>
                    )}
                  </div>

                  {course.exam && (
                    <div className="pt-3 border-t border-slate-700/50">
                      <button 
                        onClick={() => handleStartExam(course.exam)}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-2"
                      >
                        <span>📝</span> بدء امتحان الكورس: {course.exam.title}
                      </button>
                    </div>
                  )}

                  {isLoggedIn && userRole === 'instructor' && (
                    <div className="flex gap-2 pt-3 border-t border-slate-700">
                      <button onClick={() => handleStartEditCourse(course)} className="flex-1 bg-indigo-600/20 text-indigo-400 py-2 rounded-xl text-xs font-bold">تعديل الكورس ✏️</button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="flex-1 bg-rose-500/20 text-rose-400 py-2 rounded-xl text-xs font-bold">حذف الكورس 🗑️</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoggedIn && userRole === 'instructor' && activeTab === 'instructor-dashboard' && (
          <div className="space-y-10">
            <div className="bg-gradient-to-r from-amber-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-black mb-2">لوحة تحكم المعلم 👨‍🏫 (صلاحيات كاملة)</h2>
              <p className="text-xs sm:text-sm opacity-90">قم بإضافة الكورسات وتوزيعها على المراحل والصفوف، ارفع الفيديوهات وملفات الـ PDF، أنشئ الامتحانات، وتابع سجل درجات الطلاب.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className={`p-6 rounded-3xl border shadow-xl ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'} space-y-6`}>
                <h3 className="text-lg font-bold text-amber-400">{editingCourseId ? '✏️ تعديل كورس' : '✨ إنشاء كورس جديد وربطه بالصف الدراسي'}</h3>
                
                <form onSubmit={handleSaveCourse} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">اسم الكورس</label>
                    <input 
                      type="text" 
                      required 
                      value={newCourseTitle} 
                      onChange={e => setNewCourseTitle(e.target.value)} 
                      placeholder="مثال: كورس الفيزياء المتكامل..." 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">المرحلة الدراسية</label>
                      <select 
                        value={newCourseStage} 
                        onChange={e => {
                          setNewCourseStage(e.target.value);
                          const st = educationalStages.find(s => s.id === e.target.value);
                          if (st && st.grades.length > 0) setNewCourseGrade(st.grades[0].id);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white"
                      >
                        {educationalStages.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">الصف الدراسي المستهدف</label>
                      <select 
                        value={newCourseGrade} 
                        onChange={e => setNewCourseGrade(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white"
                      >
                        {educationalStages.find(s => s.id === newCourseStage)?.grades.map((g: any) => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div>
                      <label className="block text-xs font-medium mb-1">التصنيف أو المادة</label>
                      <input 
                        type="text" 
                        value={newCourseCategory} 
                        onChange={e => setNewCourseCategory(e.target.value)} 
                        placeholder="فيزياء، أحياء، رياضيات..." 
                        className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">سعر الكورس</label>
                    <input 
                      type="text" 
                      value={newCoursePrice} 
                      onChange={e => setNewCoursePrice(e.target.value)} 
                      placeholder="مجاناً 🎁 أو 200 ج.م" 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">وصف الكورس</label>
                    <textarea 
                      value={newCourseDesc} 
                      onChange={e => setNewCourseDesc(e.target.value)} 
                      placeholder="تفاصيل محتوى الكورس..." 
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>

                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 rounded-xl font-bold text-sm shadow transition">
                    {editingCourseId ? 'حفظ تعديلات الكورس 💾' : 'إنشاء ونشر الكورس في الصف 🚀'}
                  </button>
                  {editingCourseId && (
                    <button type="button" onClick={() => setEditingCourseId(null)} className="w-full bg-slate-800 text-slate-300 py-2 rounded-xl text-xs font-bold mt-2">
                      إلغاء التعديل
                    </button>
                  )}
                </form>
              </div>

              <div className={`p-6 rounded-3xl border shadow-xl ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'} space-y-6`}>
                <h3 className="text-lg font-bold text-indigo-400">🎥 📄 إضافة فيديو أو ملف PDF لأي كورس</h3>
                
                <div>
                  <label className="block text-xs font-medium mb-1">اختر الكورس المستهدف</label>
                  <select 
                    value={selectedCourseForContent} 
                    onChange={e => setSelectedCourseForContent(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white"
                  >
                    <option value="">-- اختر كورس --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.title}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleAddVideoToCourse} className="space-y-3 pt-3 border-t border-slate-700">
                  <span className="text-xs font-bold text-amber-400 block">إضافة فيديو شرح (MP4 أو رابط):</span>
                  <input 
                    type="text" 
                    placeholder="عنوان الدرس أو الحصة..." 
                    value={newVideoTitle} 
                    onChange={e => setNewVideoTitle(e.target.value)} 
                    className="w-full px-4 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                  />
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="رابط فيديو مباشر (MP4)..." 
                      value={newVideoUrl} 
                      onChange={e => setNewVideoUrl(e.target.value)} 
                      className="flex-1 px-4 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                    />
                    <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border border-slate-700 flex items-center">
                      <span>📁 رفع فيديو</span>
                      <input type="file" accept="video/mp4" onChange={handleVideoUpload} className="hidden" />
                    </label>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs shadow">
                    إضافة الفيديو للكورس ➕
                  </button>
                </form>

                <form onSubmit={handleAddPdfToCourse} className="space-y-3 pt-3 border-t border-slate-700">
                  <span className="text-xs font-bold text-indigo-400 block">إضافة ملف PDF (مذكرة / كتاب):</span>
                  <input 
                    type="text" 
                    placeholder="عنوان ملف الـ PDF..." 
                    value={newPdfTitle} 
                    onChange={e => setNewPdfTitle(e.target.value)} 
                    className="w-full px-4 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                  />
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="رابط ملف PDF مباشر..." 
                      value={newPdfUrl} 
                      onChange={e => setNewPdfUrl(e.target.value)} 
                      className="flex-1 px-4 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white" 
                    />
                    <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border border-slate-700 flex items-center">
                      <span>📁 رفع ملف PDF</span>
                      <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs shadow">
                    إضافة ملف الـ PDF للكورس 📄
                  </button>
                </form>

              </div>
            </div>

            <div className={`p-6 rounded-3xl border shadow-xl ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'} space-y-6`}>
              <h3 className="text-lg font-bold text-amber-400">📝 إنشاء امتحان ذكي لأي كورس مع نظام منع الغش</h3>
              
              <form onSubmit={handleSaveExam} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">اختر الكورس المستهدف للامتحان</label>
                    <select 
                      value={examCourseTarget} 
                      onChange={e => setExamCourseTarget(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white"
                    >
                      <option value="">-- اختر الكورس --</option>
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
                      placeholder="اختبار الشهر الأول في الأحياء..." 
                      className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white" 
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <span className="text-xs font-bold text-indigo-400 block">أسئلة الاختيار من متعدد:</span>
                  {examQuestions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-amber-300">السؤال #{qIndex + 1}</span>
                        {examQuestions.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => setExamQuestions(examQuestions.filter((_, i) => i !== qIndex))}
                            className="text-rose-400 text-xs font-bold"
                          >
                            حذف السؤال ✕
                          </button>
                        )}
                      </div>
                      <input 
                        type="text" 
                        required 
                        placeholder="نص السؤال..." 
                        value={q.question} 
                        onChange={e => {
                          const updated = [...examQuestions];
                          updated[qIndex].question = e.target.value;
                          setExamQuestions(updated);
                        }} 
                        className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-800 border-slate-700 text-white" 
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt: string, optIndex: number) => (
                          <input 
                            key={optIndex} 
                            type="text" 
                            required 
                            placeholder={`الخيار ${optIndex + 1}`} 
                            value={opt} 
                            onChange={e => {
                              const updated = [...examQuestions];
                              updated[qIndex].options[optIndex] = e.target.value;
                              setExamQuestions(updated);
                            }} 
                            className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-800 border-slate-700 text-white" 
                          />
                        ))}
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium mb-1 text-slate-400">الإجابة الصحيحة:</label>
                        <select 
                          value={q.correctAnswer} 
                          onChange={e => {
                            const updated = [...examQuestions];
                            updated[qIndex].correctAnswer = Number(e.target.value);
                            setExamQuestions(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-800 border-slate-700 text-white"
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
                    + إضافة سؤال جديد ➕
                  </button>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow transition">
                  نشر الامتحان للكورس 🚀
                </button>
              </form>
            </div>

            <div className={`p-6 rounded-3xl border shadow-xl ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
              <h3 className="text-lg font-bold text-indigo-400">📊 سجل درجات الامتحانات والتقارير المرسلة لولي الأمر</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="pb-3">اسم الطالب</th>
                      <th className="pb-3">هاتف الطالب</th>
                      <th className="pb-3">هاتف ولي الأمر</th>
                      <th className="pb-3">اسم الامتحان</th>
                      <th className="pb-3">النتيجة</th>
                      <th className="pb-3">مدة الإجابة</th>
                      <th className="pb-3">محاولات الغش</th>
                      <th className="pb-3">التاريخ</th>
                      <th className="pb-3">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {examResultsLog.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-6 text-slate-500">لا توجد نتائج مسجلة حتى الآن.</td>
                      </tr>
                    ) : (
                      examResultsLog.map(res => (
                        <tr key={res.id} className="hover:bg-slate-900/50">
                          <td className="py-3 font-bold">{res.studentName}</td>
                          <td className="py-3">{res.studentPhone}</td>
                          <td className="py-3 text-amber-400">{res.parentPhone}</td>
                          <td className="py-3">{res.examTitle}</td>
                          <td className="py-3 font-bold text-emerald-400">{res.score}</td>
                          <td className="py-3">{res.duration}</td>
                          <td className="py-3 text-rose-400 font-bold">{res.cheatingAttempts} إنذارات</td>
                          <td className="py-3 text-slate-400">{res.date}</td>
                          <td className="py-3">
                            <button onClick={() => handleDeleteExamResult(res.id)} className="text-rose-400 font-bold hover:underline">حذف</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {activeExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 border shadow-2xl relative my-8 ${darkMode ? 'bg-[#1e293b] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
              <div>
                <h3 className="text-xl font-black text-amber-400">{activeExam.title}</h3>
                <p className="text-xs text-rose-400 font-bold mt-1">⚠️ تحذير صارم: مغادرة نافذة الامتحان أو الخروج بمؤشر الماوس يعرضك للرسوب الفوري (الإنذار {cheatingWarnings}/3)</p>
              </div>
              <button onClick={() => setActiveExam(null)} className="text-slate-400 hover:text-white text-lg font-bold bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
            </div>

            {!examSubmitted ? (
              <div className="space-y-6">
                {activeExam.questions.map((q: any, qIndex: number) => (
                  <div key={qIndex} className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
                    <span className="text-xs font-bold text-indigo-400 block">السؤال {qIndex + 1}: {q.question}</span>
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((opt: string, optIndex: number) => (
                        <label key={optIndex} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs transition ${examAnswers[qIndex] === optIndex ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold' : 'bg-slate-800 border-slate-700 hover:bg-slate-750'}`}>
                          <input 
                            type="radio" 
                            name={`question-${qIndex}`} 
                            checked={examAnswers[qIndex] === optIndex} 
                            onChange={() => setExamAnswers({...examAnswers, [qIndex]: optIndex})}
                            className="text-indigo-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button 
                  onClick={handleSubmitExam}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow transition"
                >
                  تسليم الامتحان وإرسال النتيجة 🎯
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
                  🎯
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2">تم تسليم الامتحان بنجاح!</h3>
                  <p className="text-lg font-bold text-indigo-400">درجتك: {examScore} / {activeExam.questions.length}</p>
                  <p className="text-xs text-slate-400 mt-2">تم تسجيل النتيجة بنجاح في سجل المعلم وإرسال التقرير لرقم ولي الأمر المسجل.</p>
                </div>
                <button 
                  onClick={() => setActiveExam(null)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-xs shadow transition"
                >
                  إغلاق نافذة الامتحان
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      <footer className={`border-t py-6 text-center text-xs text-slate-500 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
        <p>جميع الحقوق محفوظة © 2026 منصة BEDAYA EDU التعليمية الذكية 🎓</p>
      </footer>
    </div>
  );
}