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

  const currentAvailableGrades = educationalStages.find(s => s.id === inputStage)?.grades || [];

  const [usersList, setUsersList] = useState<any[]>([
    { name: 'أحمد المعلم', email: 'teacher@edu.com', password: '123', phone: '01000000000', parentPhone: 'N/A', role: 'instructor', stage: 'secondary', grade: 'sec-3' },
    { name: 'محمد الطالب', email: 'student@edu.com', password: '123', phone: '01111111111', parentPhone: '01222222222', role: 'student', stage: 'secondary', grade: 'sec-3' }
  ]);

  const [examResultsLog, setExamResultsLog] = useState<any[]>([]);
  
  // Navigation Modals for Stages & Grades
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

      {/* STAGE MODAL (Show Grades) */}
      {selectedStageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex justify-between items-center mb-6 border-b pb-3 border-slate-700">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span>📂</span> {selectedStageModal.name}
              </h3>
              <button 
                onClick={() => setSelectedStageModal(null)} 
                className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white px-3 py-1 rounded-xl text-xs font-bold transition"
              >
                ✕ إغلاق
              </button>
            </div>
            <p className="text-xs opacity-80 mb-4">اختر الصف الدراسي لعرض الكورسات الخاصة به:</p>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedStageModal.grades.map((grade: any) => (
                <div 
                  key={grade.id}
                  onClick={() => {
                    setSelectedGradeForCourses(grade);
                    setSelectedStageModal(null);
                    setActiveTab('courses');
                  }}
                  className="p-4 rounded-2xl bg-indigo-600/10 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 cursor-pointer transition flex items-center justify-between font-bold text-sm"
                >
                  <span>{grade.name}</span>
                  <span className="text-xs opacity-80">عرض الكورسات ⬅</span>
                </div>
              ))}
            </div>
          </div>
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

        {/* HOME TAB */}
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
                حساب جديد
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
                <div>
                  <label className="block text-xs font-bold mb-1">رقم الهاتف الشخصي</label>
                  <input 
                    type="text" 
                    value={inputPhone} 
                    onChange={e => setInputPhone(e.target.value)} 
                    placeholder="010xxxxxxxx"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">صفة الحساب</label>
                  <select 
                    value={inputRole} 
                    onChange={e => setInputRole(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="student">طالب 👨‍🎓</option>
                    <option value="instructor">معلم 👨‍🏫</option>
                  </select>
                </div>

                {inputRole === 'student' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold mb-1">رقم ولي الأمر (إلزامي لمتابعة الدرجات)</label>
                      <input 
                        type="text" 
                        value={inputParentPhone} 
                        onChange={e => setInputParentPhone(e.target.value)} 
                        placeholder="012xxxxxxxx"
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-indigo-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">المرحلة الدراسية</label>
                      <select 
                        value={inputStage} 
                        onChange={e => {
                          setInputStage(e.target.value);
                          const firstGrade = educationalStages.find(s => s.id === e.target.value)?.grades[0]?.id || '';
                          setInputGrade(firstGrade);
                        }}
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-indigo-500"
                      >
                        {educationalStages.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">الصف الدراسي</label>
                      <select 
                        value={inputGrade} 
                        onChange={e => setInputGrade(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-indigo-500"
                      >
                        {currentAvailableGrades.map((g: any) => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow transition">
                  إنشاء الحساب الان 🚀
                </button>
              </form>
            )}
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/30 p-6 rounded-3xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold">📚 كورسات المنصة التعليمية</h2>
                <p className="text-xs opacity-75 mt-1">
                  {selectedGradeForCourses ? `عرض كورسات: ${selectedGradeForCourses.name}` : 'استعرض كافة الكورسات ومحتواها من فيديوهات وملفات PDF وامتحانات'}
                </p>
              </div>
              {selectedGradeForCourses && (
                <button 
                  onClick={() => setSelectedGradeForCourses(null)} 
                  className="bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  عرض كافة الصفوف والكورسات 🔄
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter(c => !selectedGradeForCourses || c.grade === selectedGradeForCourses.id)
                .map((course) => (
                  <div key={course.id} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-bold">{course.category}</span>
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-bold">{course.price}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                      <p className="text-xs text-indigo-300 mb-3">المعلم: {course.instructor}</p>
                      <p className="text-xs opacity-80 mb-6 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <div>
                        <h4 className="text-xs font-bold mb-2 text-slate-400">🎥 الفيديوهات والشروحات ({course.lessons.length})</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {course.lessons.map((lesson: any) => (
                            <div key={lesson.id} className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs space-y-2">
                              <div className="flex justify-between items-center font-bold">
                                <span>{lesson.title}</span>
                                <span className="opacity-75">{lesson.duration}</span>
                              </div>
                              {lesson.videoUrl && (
                                <video controls className="w-full rounded-xl mt-1 max-h-48 bg-black">
                                  <source src={lesson.videoUrl} type="video/mp4" />
                                  متصفحك لا يدعم عرض الفيديو
                                </video>
                              )}
                              {isLoggedIn && userRole === 'instructor' && (
                                <button onClick={() => handleDeleteLesson(course.id, lesson.id)} className="text-rose-400 font-bold hover:underline text-[10px]">
                                  حذف الفيديو 🗑️
                                </button>
                              )}
                            </div>
                          ))}
                          {course.lessons.length === 0 && <p className="text-[11px] opacity-60">لا توجد فيديوهات مرفوعة حتى الآن.</p>}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold mb-2 text-slate-400">📄 ملفات المذكرة و الـ PDF ({course.pdfs?.length || 0})</h4>
                        <div className="space-y-2">
                          {(course.pdfs || []).map((pdf: any) => (
                            <div key={pdf.id} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                              <span className="font-bold truncate max-w-[180px]">{pdf.title}</span>
                              <div className="flex items-center gap-2">
                                <a href={pdf.pdfUrl} download="document.pdf" className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">تحميل ⬇</a>
                                {isLoggedIn && userRole === 'instructor' && (
                                  <button onClick={() => handleDeletePdf(course.id, pdf.id)} className="text-rose-400 text-[10px] font-bold">حذف</button>
                                )}
                              </div>
                            </div>
                          ))}
                          {(!course.pdfs || course.pdfs.length === 0) && <p className="text-[11px] opacity-60">لا توجد ملفات PDF مرفوعة.</p>}
                        </div>
                      </div>

                      {course.exam && (
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                          <h4 className="text-xs font-bold text-amber-400 mb-1">📝 امتحان الكورس: {course.exam.title}</h4>
                          <p className="text-[11px] opacity-75 mb-3">عدد الأسئلة: {course.exam.questions.length} أسئلة (محمي ضد الغش)</p>
                          <button 
                            onClick={() => handleStartExam(course.exam)} 
                            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2 rounded-xl text-xs font-bold transition"
                          >
                            بدء الامتحان الآن 🚀
                          </button>
                        </div>
                      )}

                      {isLoggedIn && userRole === 'instructor' && (
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => handleStartEditCourse(course)} className="flex-1 bg-indigo-600/20 text-indigo-400 py-2 rounded-xl text-xs font-bold">تعديل ✏️</button>
                          <button onClick={() => handleDeleteCourse(course.id)} className="flex-1 bg-rose-600/20 text-rose-400 py-2 rounded-xl text-xs font-bold">حذف 🗑️</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ACTIVE EXAM INTERACTIVE VIEW */}
        {activeExam && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 rounded-3xl border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-700">
                <div>
                  <h3 className="text-xl font-extrabold text-amber-400">{activeExam.title}</h3>
                  <p className="text-xs opacity-75 mt-1">⚠️ تحذير: مغادرة النافذة أو فتح تبويب آخر يعرضك لإنذارات الغش (الحد الأقصى 3 إنذارات).</p>
                </div>
                <div className="bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-rose-500/30">
                  إنذارات الغش: {cheatingWarnings} / 3
                </div>
              </div>

              {!examSubmitted ? (
                <div className="space-y-6">
                  {activeExam.questions.map((q: any, qIdx: number) => (
                    <div key={qIdx} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                      <h4 className="text-sm font-bold">س {qIdx + 1}: {q.question}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt: string, optIdx: number) => (
                          <label 
                            key={optIdx} 
                            className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center gap-3 transition ${examAnswers[qIdx] === optIdx ? 'bg-indigo-600 border-indigo-400 text-white font-bold' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
                          >
                            <input 
                              type="radio" 
                              name={`question-${qIdx}`} 
                              checked={examAnswers[qIdx] === optIdx} 
                              onChange={() => setExamAnswers({ ...examAnswers, [qIdx]: optIdx })}
                              className="accent-indigo-400" 
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={handleSubmitExam}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-extrabold text-sm shadow-xl transition"
                  >
                    تسجيل وإرسال الإجابات النهائية 🎯
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-6 py-8">
                  <div className="text-5xl font-black text-amber-400">نتيجة الامتحان: {examScore} / {activeExam.questions.length}</div>
                  <p className="text-sm opacity-90">تم حفظ درجتك وسجل أداءك في سجلات المنصة بنجاح وإرسالها لمتابعة ولي الأمر.</p>
                  <button 
                    onClick={() => setActiveExam(null)} 
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-xs"
                  >
                    إغلاق ورقة الامتحان ✖
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* INSTRUCTOR DASHBOARD TAB */}
        {isLoggedIn && userRole === 'instructor' && activeTab === 'instructor-dashboard' && (
          <div className="space-y-12">
            <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              <h2 className="text-xl font-black text-amber-400">👨‍🏫 لوحة تحكم المعلم (إنشاء وإدارة الكورسات، الفيديوهات، والامتحانات)</h2>

              {/* Course Create / Edit Form */}
              <form onSubmit={handleSaveCourse} className="space-y-4 p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                <h3 className="text-sm font-bold text-indigo-400">{editingCourseId ? '✏️ تعديل كورس موجود' : '➕ إنشاء كورس جديد وربطه بالصف الدراسي'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">اسم الكورس</label>
                    <input 
                      type="text" 
                      value={newCourseTitle} 
                      onChange={e => setNewCourseTitle(e.target.value)} 
                      placeholder="مثال: كورس الفيزياء المتقدم"
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">المعلم المحاضر</label>
                    <input 
                      type="text" 
                      value={newCourseInstructor} 
                      onChange={e => setNewCourseInstructor(e.target.value)} 
                      placeholder={userName}
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">المادة والتصنيف</label>
                    <input 
                      type="text" 
                      value={newCourseCategory} 
                      onChange={e => setNewCourseCategory(e.target.value)} 
                      placeholder="الفيزياء والرياضيات"
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">السعر</label>
                    <input 
                      type="text" 
                      value={newCoursePrice} 
                      onChange={e => setNewCoursePrice(e.target.value)} 
                      placeholder="مجاناً 🎁 أو 150 جنيه"
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">المرحلة الدراسية</label>
                    <select 
                      value={newCourseStage} 
                      onChange={e => {
                        setNewCourseStage(e.target.value);
                        const firstG = educationalStages.find(s => s.id === e.target.value)?.grades[0]?.id || '';
                        setNewCourseGrade(firstG);
                      }}
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs"
                    >
                      {educationalStages.map(st => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">الصف الدراسي المستهدف</label>
                    <select 
                      value={newCourseGrade} 
                      onChange={e => setNewCourseGrade(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs"
                    >
                      {targetGradesForNewCourse.map((gr: any) => (
                        <option key={gr.id} value={gr.id}>{gr.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">وصف الكورس</label>
                  <textarea 
                    value={newCourseDesc} 
                    onChange={e => setNewCourseDesc(e.target.value)} 
                    placeholder="اكتب نبذة مختصرة عن محتوى الكورس..."
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs h-20" 
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow">
                    {editingCourseId ? 'حفظ تعديلات الكورس ✨' : 'إنشاء ونشر الكورس بالصف الدراسي 🚀'}
                  </button>
                  {editingCourseId && (
                    <button type="button" onClick={() => { setEditingCourseId(null); setNewCourseTitle(''); }} className="bg-slate-700 text-white px-4 py-3 rounded-xl text-xs font-bold">إلغاء</button>
                  )}
                </div>
              </form>

              {/* Add Video & PDF to Course */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <form onSubmit={handleAddVideoToCourse} className="space-y-4 p-6 rounded-2xl bg-slate-800/40 border border-slate-700">
                  <h3 className="text-sm font-bold text-amber-400">🎥 إضافة فيديو (MP4) لشرح درس</h3>
                  <div>
                    <label className="block text-xs font-bold mb-1">اختر الكورس المستهدف</label>
                    <select 
                      value={selectedCourseForContent} 
                      onChange={e => setSelectedCourseForContent(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs"
                    >
                      <option value="">-- اختر الكورس --</option>
                      {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">عنوان الدرس</label>
                    <input 
                      type="text" 
                      value={newVideoTitle} 
                      onChange={e => setNewVideoTitle(e.target.value)} 
                      placeholder="الدرس الأول: مقدمة المنهج"
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">رفع فيديو من الجهاز (MP4)</label>
                    <input type="file" accept="video/mp4,video/*" onChange={handleVideoUpload} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white" />
                  </div>
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 rounded-xl font-bold text-xs">إضافة الفيديو للكورس 🎥</button>
                </form>

                <form onSubmit={handleAddPdfToCourse} className="space-y-4 p-6 rounded-2xl bg-slate-800/40 border border-slate-700">
                  <h3 className="text-sm font-bold text-amber-400">📄 إضافة ملف PDF وملخصات</h3>
                  <div>
                    <label className="block text-xs font-bold mb-1">اختر الكورس المستهدف</label>
                    <select 
                      value={selectedCourseForContent} 
                      onChange={e => setSelectedCourseForContent(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs"
                    >
                      <option value="">-- اختر الكورس --</option>
                      {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">عنوان ملف الـ PDF</label>
                    <input 
                      type="text" 
                      value={newPdfTitle} 
                      onChange={e => setNewPdfTitle(e.target.value)} 
                      placeholder="ملخص الشرح وبنك الأسئلة PDF"
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">رفع ملف PDF من جهازك</label>
                    <input type="file" accept="application/pdf" onChange={handleFileUpload} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white" />
                  </div>
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 rounded-xl font-bold text-xs">إضافة ملف الـ PDF للكورس 📄</button>
                </form>
              </div>

              {/* Instructor Exam Builder Section */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-indigo-400">📝 نظام المعلم لإنشاء ونشر الامتحانات على الكورسات</h3>
                <form onSubmit={handleSaveExam} className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">اختر الكورس المستهدف للامتحان</label>
                      <select 
                        value={examCourseTarget} 
                        onChange={e => setExamCourseTarget(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs"
                      >
                        <option value="">-- اختر الكورس --</option>
                        {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">عنوان الامتحان</label>
                      <input 
                        type="text" 
                        value={examTitle} 
                        onChange={e => setExamTitle(e.target.value)} 
                        placeholder="اختبار الشهر الأول الشامل"
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs" 
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold text-slate-300">أسئلة الامتحان والاختيارات الإجبارية:</h4>
                    {examQuestions.map((eq: any, qIndex: number) => (
                      <div key={qIndex} className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-amber-400">السؤال رقم {qIndex + 1}</span>
                          {examQuestions.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => setExamQuestions(examQuestions.filter((_, idx) => idx !== qIndex))}
                              className="text-rose-400 text-xs font-bold"
                            >
                              حذف السؤال 🗑️
                            </button>
                          )}
                        </div>
                        <input 
                          type="text" 
                          value={eq.question} 
                          onChange={e => {
                            const updated = [...examQuestions];
                            updated[qIndex].question = e.target.value;
                            setExamQuestions(updated);
                          }}
                          placeholder="اكتب نص السؤال هنا..."
                          className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs" 
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {eq.options.map((opt: string, optIdx: number) => (
                            <input 
                              key={optIdx}
                              type="text"
                              value={opt}
                              onChange={e => {
                                const updated = [...examQuestions];
                                updated[qIndex].options[optIdx] = e.target.value;
                                setExamQuestions(updated);
                              }}
                              placeholder={`الاختيار رقم ${optIdx + 1}`}
                              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs"
                            />
                          ))}
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold mb-1 text-indigo-300">حدد رقم الإجابة الصحيحة:</label>
                          <select 
                            value={eq.correctAnswer}
                            onChange={e => {
                              const updated = [...examQuestions];
                              updated[qIndex].correctAnswer = Number(e.target.value);
                              setExamQuestions(updated);
                            }}
                            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs"
                          >
                            <option value={0}>الاختيار الأول</option>
                            <option value={1}>الاختيار الثاني</option>
                            <option value={2}>الاختيار الثالث</option>
                            <option value={3}>الاختيار الرابع</option>
                          </select>
                        </div>
                      </div>
                    ))}

                    <button 
                      type="button"
                      onClick={() => setExamQuestions([...examQuestions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }])}
                      className="bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                    >
                      + إضافة سؤال جديد للامتحان
                    </button>
                  </div>

                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow mt-4">
                    نشر الامتحان وتفعيل الرصد الذكي للكورس 📝🚀
                  </button>
                </form>
              </div>

              {/* Exam Results Log Table */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-amber-400">📊 سجل درجات الطلاب ونتائج الامتحانات مرصد ولي الأمر</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-800 text-slate-300 border-b border-slate-700">
                        <th className="p-3">اسم الطالب</th>
                        <th className="p-3">الهاتف الشخصي</th>
                        <th className="p-3">رقم ولي الأمر</th>
                        <th className="p-3">اسم الامتحان</th>
                        <th className="p-3">النتيجة</th>
                        <th className="p-3">مدة الحل</th>
                        <th className="p-3">محاولات الغش</th>
                        <th className="p-3">التاريخ</th>
                        <th className="p-3">إجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examResultsLog.map((res: any) => (
                        <tr key={res.id} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                          <td className="p-3 font-bold">{res.studentName}</td>
                          <td className="p-3">{res.studentPhone}</td>
                          <td className="p-3 text-indigo-400 font-bold">{res.parentPhone}</td>
                          <td className="p-3">{res.examTitle}</td>
                          <td className="p-3 font-extrabold text-amber-400">{res.score}</td>
                          <td className="p-3">{res.duration}</td>
                          <td className="p-3 text-rose-400 font-bold">{res.cheatingAttempts} إنذار</td>
                          <td className="p-3 opacity-75">{res.date}</td>
                          <td className="p-3">
                            <button onClick={() => handleDeleteExamResult(res.id)} className="text-rose-400 hover:underline">حذف</button>
                          </td>
                        </tr>
                      ))}
                      {examResultsLog.length === 0 && (
                        <tr>
                          <td colSpan={9} className="p-6 text-center opacity-60">لا توجد نتائج امتحانات مسجلة حتى الآن.</td>
                        </tr>
                      )}
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