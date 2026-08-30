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
      name: 'المرحلة الابتدائية',
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
      name: 'المرحلة الإعدادية',
      grades: [
        { id: 'prep-1', name: 'الصف الأول الإعدادي' },
        { id: 'prep-2', name: 'الصف الثاني الإعدادي' },
        { id: 'prep-3', name: 'الصف الثالث الإعدادي' }
      ]
    },
    { 
      id: 'secondary', 
      name: 'المرحلة الثانوية العامة',
      grades: [
        { id: 'sec-1', name: 'الصف الأول الثانوي' },
        { id: 'sec-2', name: 'الصف الثاني الثانوي' },
        { id: 'sec-3', name: 'الصف الثالث الثانوي' }
      ]
    },
    { 
      id: 'baccalaureate', 
      name: 'نظام البكالوريا',
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
  const [selectedGradeForCourses, setSelectedGradeForCourses] = useState<any | null>(null);

  const [courses, setCourses] = useState<any[]>([
    {
      id: 2,
      title: "أ/ مروان الجندي للعلوم والأحياء",
      instructor: "مروان الجندي",
      category: "العلوم والأحياء",
      stage: "secondary", 
      grade: "sec-3",
      price: "مجاناً",
      description: "شرح مبسط وممتع لمنهج الأحياء والعلوم بطريقة احترافية.",
      lessons: [
        { id: 201, title: "الدرس الأول: مدخل إلى علم الأحياء والخلية", duration: "10 دقائق", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ],
      pdfs: [],
      exam: null 
    }
  ]);

  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('');
  const [newCourseStage, setNewCourseStage] = useState('secondary');
  const [newCourseGrade, setNewCourseGrade] = useState('sec-3');
  const [newCoursePrice, setNewCoursePrice] = useState('مجاناً');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // حالات تعديل الكورس
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseInstructor, setEditCourseInstructor] = useState('');
  const [editCourseCategory, setEditCourseCategory] = useState('');
  const [editCourseStage, setEditCourseStage] = useState('secondary');
  const [editCourseGrade, setEditCourseGrade] = useState('sec-3');
  const [editCoursePrice, setEditCoursePrice] = useState('مجاناً');
  const [editCourseDesc, setEditCourseDesc] = useState('');

  const targetGradesForNewCourse = educationalStages.find(s => s.id === newCourseStage)?.grades || [];
  const targetGradesForEditCourse = educationalStages.find(s => s.id === editCourseStage)?.grades || [];

  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');

  const [selectedCourseForContent, setSelectedCourseForContent] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('10 دقائق');
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);

  const [newPdfTitle, setNewPdfTitle] = useState('');
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null);

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

  const saveExamResultToLog = (score: number, warningsCount: number, durationStr: string) => {
    if (!activeExam) return;
    const newRecord = {
      studentName: userName || 'طالب',
      studentEmail: userEmail || 'unknown@edu.com',
      studentPhone: userPhone || 'غير محدد',
      parentPhone: userParentPhone || 'غير محدد',
      examTitle: activeExam.title || 'امتحان',
      score: score,
      total: activeExam.questions.length,
      warnings: warningsCount,
      duration: durationStr,
      date: new Date().toLocaleString()
    };
    setExamResultsLog(prev => [newRecord, ...prev]);
  };

  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('bedaya_edu_users_db');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        const filteredUsers = parsedUsers.filter((u: any) => u.email !== 'admin@edu.com');
        const adminExists = filteredUsers.some((u: any) => u.email === '250iie3@gmail.com');
        if (!adminExists) {
          filteredUsers.push({ name: 'مدير المنصة', email: '250iie3@gmail.com', password: 'Mohamad$35', phone: '01000000000', parentPhone: 'N/A', role: 'admin', status: 'active' });
        }
        setUsersList(filteredUsers);
      }

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
      showToast('غير مسموح للطالب بالوصول لهذه الصفحة');
    }
  }, [activeTab, userRole]);

  useEffect(() => {
    if (!activeExam || examSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerCheatingWarning("تحذير: قمت بمغادرة نافذة الامتحان! محاولات الغش مرصودة.");
      }
    };

    const handleBlur = () => {
      triggerCheatingWarning("تحذير: محاولة فتح نافذة خارجية أو خروج مؤشر الماوس عن الإطار");
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
      showToast("تم إنهاء الامتحان تلقائياً بسبب تكرار محاولات الغش");
      finishExamDueToCheating();
    } else {
      showToast(`${msg} (الإنذار ${newWarnings}/3)`);
    }
  };

  const finishExamDueToCheating = () => {
    setExamSubmitted(true);
    setExamScore(0);
    const durationSec = Math.floor((Date.now() - examStartTime) / 1000);
    const durationStr = `${Math.floor(durationSec / 60)} دقيقة و ${durationSec % 60} ثانية`;
    saveExamResultToLog(0, 3, durationStr);
    setActiveExam(null);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName || !inputEmail || !inputPassword || !inputPhone || !inputParentPhone) {
      showToast('يرجى إكمال الحقول الأساسية ورقم هاتف ولي الأمر للطالب');
      return;
    }

    const userExists = usersList.find(u => u.email.toLowerCase() === inputEmail.toLowerCase());
    if (userExists) {
      showToast('البريد الإلكتروني مستخدم من قبل، حاول تسجيل الدخول');
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

    showToast(`أهلاً بك ${newUser.name}, تم إنشاء حساب الطالب بنجاح`);
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
      showToast('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    const cleanEmail = inputEmail.trim().toLowerCase();
    let foundUser = usersList.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === inputPassword
    );

    if (!foundUser && cleanEmail === '250iie3@gmail.com' && inputPassword === 'Mohamad$35') {
      foundUser = {
        name: 'مدير المنصة',
        email: '250iie3@gmail.com',
        password: 'Mohamad$35',
        role: 'admin',
        status: 'active',
        phone: '01000000000',
        parentPhone: 'N/A',
        stage: 'secondary',
        grade: 'sec-3'
      };
    }

    if (!foundUser) {
      showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      return;
    }

    if (foundUser.status === 'suspended') {
      showToast('هذا الحساب معطل، يرجى مراجعة إدارة المنصة');
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

    showToast(`مرحباً بك من جديد يا ${foundUser.name}`);
    setInputEmail('');
    setInputPassword('');
    setActiveTab(foundUser.role === 'admin' ? 'admin-dashboard' : 'home');
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
    showToast('تم تسجيل الخروج بنجاح');
    setActiveTab('home');
  };

  const handleAdminCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName || !newTeacherEmail || !newTeacherPassword) {
      showToast('يرجى إدخال اسم المدرس والبريد وكلمة المرور');
      return;
    }
    const exists = usersList.find(u => u.email.toLowerCase() === newTeacherEmail.toLowerCase());
    if (exists) {
      showToast('البريد الإلكتروني مسجل مسبقاً');
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
    showToast('تم إنشاء وتفعيل حساب المدرس بنجاح من خلال لوحة الأدمن');
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewTeacherPassword('');
    setNewTeacherPhone('');
  };

  const handleToggleTeacherStatus = (email: string) => {
    setUsersList(usersList.map(u => {
      if (u.email === email) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        showToast(`تم تغيير حالة الحساب إلى: ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (email: string) => {
    if (email === '250iie3@gmail.com') {
      showToast('لا يمكن حذف حساب الأدمن الرئيسي');
      return;
    }
    if (confirm('هل أنت متأكد من حذف هذا المستخدم نهائياً؟')) {
      setUsersList(usersList.filter(u => u.email !== email));
      showToast('تم حذف المستخدم بنجاح');
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseInstructor) {
      showToast('يرجى إدخال عنوان الكورس واسم المعلم');
      return;
    }
    const newCourse = {
      id: Date.now(),
      title: newCourseTitle,
      instructor: newCourseInstructor,
      category: newCourseCategory || 'عام',
      stage: newCourseStage,
      grade: newCourseGrade,
      price: newCoursePrice,
      description: newCourseDesc,
      lessons: [],
      pdfs: [],
      exam: null
    };
    setCourses([newCourse, ...courses]);
    showToast('تم إنشاء الكورس بنجاح');
    setNewCourseTitle('');
    setNewCourseInstructor('');
    setNewCourseDesc('');
  };

  // دوال تعديل الكورس
  const startEditingCourse = (course: any) => {
    setEditingCourseId(course.id);
    setEditCourseTitle(course.title);
    setEditCourseInstructor(course.instructor);
    setEditCourseCategory(course.category);
    setEditCourseStage(course.stage || 'secondary');
    setEditCourseGrade(course.grade || 'sec-3');
    setEditCoursePrice(course.price || 'مجاناً');
    setEditCourseDesc(course.description || '');
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourseId) return;

    setCourses(courses.map(c => {
      if (c.id === editingCourseId) {
        return {
          ...c,
          title: editCourseTitle,
          instructor: editCourseInstructor,
          category: editCourseCategory,
          stage: editCourseStage,
          grade: editCourseGrade,
          price: editCoursePrice,
          description: editCourseDesc
        };
      }
      return c;
    }));

    showToast('تم تعديل الكورس بنجاح');
    setEditingCourseId(null);
  };

  const handleDeleteCourse = (courseId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الكورس نهائياً؟')) {
      setCourses(courses.filter(c => c.id !== courseId));
      showToast('تم حذف الكورس بنجاح');
    }
  };

  // 1- إضافة فيديو من الجهاز للمنصة
  const handleAddVideoToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForContent || !newVideoTitle || !newVideoFile) {
      showToast('يرجى اختيار الكورس، عنوان الدرس، واختيار ملف الفيديو من الجهاز');
      return;
    }
    
    // إنشاء رابط محلي لعرض الفيديو المرفوع من الجهاز
    const localVideoUrl = URL.createObjectURL(newVideoFile);

    setCourses(courses.map(c => {
      if (String(c.id) === String(selectedCourseForContent)) {
        const newLesson = { id: Date.now(), title: newVideoTitle, duration: newVideoDuration, videoUrl: localVideoUrl };
        return { ...c, lessons: [...c.lessons, newLesson] };
      }
      return c;
    }));
    showToast('تمت إضافة فيديو الجهاز بنجاح');
    setNewVideoTitle('');
    setNewVideoFile(null);
  };

  // 2- إضافة PDF من الجهاز للمنصة
  const handleAddPdfToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForContent || !newPdfTitle || !newPdfFile) {
      showToast('يرجى اختيار الكورس، عنوان الملف، واختيار ملف الـ PDF من الجهاز');
      return;
    }

    // إنشاء رابط محلي لعرض وتنزيل ملف الـ PDF المرفوع من الجهاز
    const localPdfUrl = URL.createObjectURL(newPdfFile);

    setCourses(courses.map(c => {
      if (String(c.id) === String(selectedCourseForContent)) {
        const newPdf = { id: Date.now(), title: newPdfTitle, url: localPdfUrl };
        return { ...c, pdfs: [...c.pdfs, newPdf] };
      }
      return c;
    }));
    showToast('تمت إضافة ملف الـ PDF بنجاح');
    setNewPdfTitle('');
    setNewPdfFile(null);
  };

  const handleAddExamQuestion = () => {
    setExamQuestions([...examQuestions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examCourseTarget || !examTitle || examQuestions.length === 0) {
      showToast('يرجى اختيار الكورس، كتابة عنوان الامتحان، وإضافة سؤال واحد على الأقل');
      return;
    }
    setCourses(courses.map(c => {
      if (String(c.id) === String(examCourseTarget)) {
        return { ...c, exam: { title: examTitle, questions: examQuestions } };
      }
      return c;
    }));
    showToast('تم إنشاء ونشر الامتحان الذكي بنجاح');
    setExamTitle('');
    setExamQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const startExam = (examObj: any) => {
    setActiveExam(examObj);
    setExamAnswers({});
    setCheatingWarnings(0);
    setExamSubmitted(false);
    setExamScore(0);
    setExamStartTime(Date.now());
  };

  const submitExam = () => {
    if (!activeExam) return;
    let score = 0;
    activeExam.questions.forEach((q: any, idx: number) => {
      if (examAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });
    setExamScore(score);
    setExamSubmitted(true);
    const durationSec = Math.floor((Date.now() - examStartTime) / 1000);
    const durationStr = `${Math.floor(durationSec / 60)} دقيقة و ${durationSec % 60} ثانية`;
    saveExamResultToLog(score, cheatingWarnings, durationStr);
    showToast(`تم تسليم الامتحان بنجاح. درجتك: ${score} / ${activeExam.questions.length}`);
  };

  return (
    <div className={`min-h-screen font-sans relative transition-colors duration-300 ${darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-900'}`} dir="rtl">
      
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm border border-indigo-400">
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
            <button onClick={() => setActiveTab('stages')} className={activeTab === 'stages' ? 'text-indigo-500 font-bold' : ''}>المراحل والصفوف</button>
            <button onClick={() => setActiveTab('courses')} className={activeTab === 'courses' ? 'text-indigo-500 font-bold' : ''}>الكورسات والملفات والامتحانات</button>
            {isLoggedIn && (userRole === 'instructor' || userRole === 'admin') && (
              <button onClick={() => setActiveTab('instructor-dashboard')} className={activeTab === 'instructor-dashboard' ? 'text-amber-500 font-bold' : ''}>لوحة المحتوى وسجل الدرجات</button>
            )}
            {isLoggedIn && userRole === 'admin' && (
              <button onClick={() => setActiveTab('admin-dashboard')} className={activeTab === 'admin-dashboard' ? 'text-emerald-500 font-bold' : ''}>لوحة إدارة الأدمن</button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800 text-amber-400">
              {darkMode ? 'نهار' : 'ليل'}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full font-bold border border-indigo-500/30">
                  {userName} ({userRole === 'admin' ? 'مدير' : userRole === 'instructor' ? 'معلم' : 'طالب'})
                </span>
                <button onClick={handleLogout} className="bg-rose-500/20 text-rose-400 text-xs px-3 py-1.5 rounded-xl font-bold">خروج</button>
              </div>
            ) : (
              <button onClick={() => setActiveTab('auth')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow transition">
                تسجيل الدخول / إنشاء حساب
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
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-90">اختر المرحلة الدراسية لتفتح لك الصفوف، ومنها تستطيع تصفح أو إضافة الكورسات، الفيديوهات، ملفات الـ PDF، والامتحانات الذكية.</p>
              
              <div className="flex justify-center gap-4 flex-wrap">
                <button onClick={() => setActiveTab('stages')} className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition">
                  تصفح المراحل والصفوف التعليمية
                </button>
                <button onClick={() => setActiveTab('courses')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold shadow-lg transition">
                  تصفح كافة الكورسات والملفات
                </button>
                {isLoggedIn && (userRole === 'instructor' || userRole === 'admin') && (
                  <button onClick={() => setActiveTab('instructor-dashboard')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition">
                    لوحة التحكم (إضافة كورسات وامتحانات)
                  </button>
                )}
                {isLoggedIn && userRole === 'admin' && (
                  <button onClick={() => setActiveTab('admin-dashboard')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition">
                    لوحة إدارة الأدمن
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STAGES TAB */}
        {activeTab === 'stages' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-center mb-6">المراحل والصفوف التعليمية المعتمدة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {educationalStages.map(stage => (
                <div key={stage.id} className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-indigo-400">{stage.name}</h3>
                    <ul className="space-y-2 mb-6">
                      {stage.grades.map(grade => (
                        <li key={grade.id} className="text-xs p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex justify-between items-center">
                          <span>{grade.name}</span>
                          <button 
                            onClick={() => { setSelectedGradeForCourses(grade.id); setActiveTab('courses'); }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold"
                          >
                            عرض الكورسات
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-2xl font-black">
                {userRole === 'student' && isLoggedIn ? `كورسات صفك الدراسي (${userGrade})` : 'الكورسات، الفيديوهات والامتحانات المتاحة'}
              </h2>
              {selectedGradeForCourses && (
                <button onClick={() => setSelectedGradeForCourses(null)} className="bg-slate-700 text-white text-xs px-3 py-1.5 rounded-xl font-bold">
                  إلغاء فلترة الصف وعرض الكل
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter(c => {
                  // 3- الطالب وهو بيعمل حساب علي المنصة يختار المرحلة والصف وميظهرلوش غير كورسات المرحلة والصف إلي إختارها
                  if (isLoggedIn && userRole === 'student') {
                    return c.grade === userGrade;
                  }
                  if (selectedGradeForCourses) {
                    return c.grade === selectedGradeForCourses;
                  }
                  return true;
                })
                .map(course => (
                  <div key={course.id} className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg font-bold">{course.category}</span>
                        <span className="text-xs font-bold text-emerald-400">{course.price}</span>
                      </div>
                      <h3 className="text-base font-extrabold mb-2">{course.title}</h3>
                      <p className="text-xs opacity-80 mb-4">المعلم: {course.instructor}</p>
                      <p className="text-xs mb-6 opacity-90 line-clamp-2">{course.description}</p>

                      <div className="space-y-4 border-t border-slate-800 pt-4">
                        <div>
                          <h4 className="text-xs font-bold text-indigo-400 mb-2">الفيديوهات التعليمية:</h4>
                          {course.lessons && course.lessons.length > 0 ? (
                            course.lessons.map((lesson: any) => (
                              <div key={lesson.id} className="mb-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700">
                                <div className="flex justify-between text-xs font-bold mb-2">
                                  <span>{lesson.title}</span>
                                  <span className="opacity-70 text-[10px]">{lesson.duration}</span>
                                </div>
                                <video controls className="w-full rounded-xl max-h-40 bg-black">
                                  <source src={lesson.videoUrl} type="video/mp4" />
                                  متصفحك لا يدعم عرض الفيديو
                                </video>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] opacity-60">لا توجد فيديوهات مضافة لهذا الكورس بعد.</p>
                          )}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-amber-400 mb-2">ملفات الـ PDF:</h4>
                          {course.pdfs && course.pdfs.length > 0 ? (
                            course.pdfs.map((pdf: any) => (
                              <div key={pdf.id} className="flex justify-between items-center p-2.5 mb-2 rounded-xl bg-slate-800/40 text-xs">
                                <span>{pdf.title}</span>
                                <a href={pdf.url} target="_blank" rel="noreferrer" className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold">تحميل / عرض</a>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] opacity-60">لا توجد ملفات PDF مرفقة.</p>
                          )}
                        </div>

                        {course.exam && (
                          <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-800">
                            <h4 className="text-xs font-bold text-indigo-300 mb-2">امتحان الكورس الذكي:</h4>
                            <p className="text-xs mb-3">{course.exam.title} ({course.exam.questions.length} أسئلة)</p>
                            <button 
                              onClick={() => startExam(course.exam)} 
                              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-bold transition shadow"
                            >
                              بدء الامتحان الآن (مع نظام مراقبة الغش)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {(userRole === 'admin' || (userRole === 'instructor' && course.instructor === userName)) && (
                      <div className="mt-6 pt-4 border-t border-slate-800 flex gap-2">
                        <button 
                          onClick={() => startEditingCourse(course)}
                          className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-2 rounded-xl text-xs font-bold"
                        >
                          تعديل الكورس
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition"
                        >
                          حذف
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* AUTH TAB */}
        {activeTab === 'auth' && (
          <div className="max-w-md mx-auto p-8 rounded-3xl border shadow-2xl bg-slate-900 border-slate-800">
            <div className="flex mb-6 border-b border-slate-800">
              <button 
                onClick={() => setAuthMode('login')} 
                className={`flex-1 pb-3 text-sm font-bold ${authMode === 'login' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'opacity-60'}`}
              >
                تسجيل الدخول
              </button>
              <button 
                onClick={() => setAuthMode('signup')} 
                className={`flex-1 pb-3 text-sm font-bold ${authMode === 'signup' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'opacity-60'}`}
              >
                إنشاء حساب طالب
              </button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={inputEmail} 
                    onChange={e => setInputEmail(e.target.value)} 
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                    placeholder="example@edu.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">كلمة المرور</label>
                  <input 
                    type="password" 
                    value={inputPassword} 
                    onChange={e => setInputPassword(e.target.value)} 
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                    placeholder="********"
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl font-bold text-xs shadow-lg transition">
                  دخول المنصة
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">اسم الطالب الكامل</label>
                  <input 
                    type="text" 
                    value={inputName} 
                    onChange={e => setInputName(e.target.value)} 
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                    placeholder="محمد أحمد"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={inputEmail} 
                    onChange={e => setInputEmail(e.target.value)} 
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                    placeholder="student@edu.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">كلمة المرور</label>
                  <input 
                    type="password" 
                    value={inputPassword} 
                    onChange={e => setInputPassword(e.target.value)} 
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                    placeholder="********"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">رقم هاتفك</label>
                    <input 
                      type="text" 
                      value={inputPhone} 
                      onChange={e => setInputPhone(e.target.value)} 
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                      placeholder="011xxxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">رقم ولي الأمر</label>
                    <input 
                      type="text" 
                      value={inputParentPhone} 
                      onChange={e => setInputParentPhone(e.target.value)} 
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                      placeholder="012xxxxxxxx"
                    />
                  </div>
                </div>

                {/* اختيار المرحلة والصف عند إنشاء الحساب للطالب */}
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">المرحلة الدراسية</label>
                  <select 
                    value={inputStage} 
                    onChange={e => {
                      setInputStage(e.target.value);
                      const firstGradeOfNewStage = educationalStages.find(s => s.id === e.target.value)?.grades[0]?.id || '';
                      setInputGrade(firstGradeOfNewStage);
                    }} 
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    {educationalStages.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">الصف الدراسي</label>
                  <select 
                    value={inputGrade} 
                    onChange={e => setInputGrade(e.target.value)} 
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    {currentAvailableGrades.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl font-bold text-xs shadow-lg transition">
                  إنشاء الحساب وبدء التعلم
                </button>
              </form>
            )}
          </div>
        )}

        {/* INSTRUCTOR / ADMIN CONTENT DASHBOARD */}
        {activeTab === 'instructor-dashboard' && (isLoggedIn && (userRole === 'instructor' || userRole === 'admin')) && (
          <div className="space-y-10">
            <h2 className="text-2xl font-black">لوحة التحكم وإدارة المحتوى والامتحانات</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* إنشاء كورس جديد */}
              <div className="p-6 rounded-3xl border shadow-xl bg-slate-900 border-slate-800">
                <h3 className="text-base font-bold text-indigo-400 mb-4">إنشاء كورس تعليمي جديد</h3>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">عنوان الكورس</label>
                    <input 
                      type="text" 
                      value={newCourseTitle} 
                      onChange={e => setNewCourseTitle(e.target.value)} 
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                      placeholder="مثال: كورس الفيزياء المتكامل للثانوية"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold mb-1">اسم المعلم</label>
                      <input 
                        type="text" 
                        value={newCourseInstructor} 
                        onChange={e => setNewCourseInstructor(e.target.value)} 
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                        placeholder="أ/ أحمد"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">التصنيف / المادة</label>
                      <input 
                        type="text" 
                        value={newCourseCategory} 
                        onChange={e => setNewCourseCategory(e.target.value)} 
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                        placeholder="فيزياء"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold mb-1">المرحلة الدراسية</label>
                      <select 
                        value={newCourseStage} 
                        onChange={e => {
                          setNewCourseStage(e.target.value);
                          const firstGr = educationalStages.find(s => s.id === e.target.value)?.grades[0]?.id || '';
                          setNewCourseGrade(firstGr);
                        }} 
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
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
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                      >
                        {targetGradesForNewCourse.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">السعر</label>
                    <input 
                      type="text" 
                      value={newCoursePrice} 
                      onChange={e => setNewCoursePrice(e.target.value)} 
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                      placeholder="مجاناً أو 200 جنيه"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">وصف الكورس</label>
                    <textarea 
                      value={newCourseDesc} 
                      onChange={e => setNewCourseDesc(e.target.value)} 
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                      rows={2}
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl font-bold text-xs shadow">
                    حفظ ونشر الكورس
                  </button>
                </form>
              </div>

              {/* إضافة محتوى (فيديو أو PDF من الجهاز) */}
              <div className="space-y-6">
                <div className="p-6 rounded-3xl border shadow-xl bg-slate-900 border-slate-800">
                  <h3 className="text-base font-bold text-amber-400 mb-4">1 & 2 - إضافة فيديو أو PDF من الجهاز للكورس</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">اختر الكورس المستهدف</label>
                      <select 
                        value={selectedCourseForContent} 
                        onChange={e => setSelectedCourseForContent(e.target.value)} 
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                      >
                        <option value="">-- اختر كورس --</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title} ({c.instructor})</option>
                        ))}
                      </select>
                    </div>

                    {/* رفع فيديو من الجهاز */}
                    <form onSubmit={handleAddVideoToCourse} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-3">
                      <h4 className="text-xs font-bold text-indigo-300">إضافة فيديو (MP4) من الجهاز:</h4>
                      <input 
                        type="text" 
                        value={newVideoTitle} 
                        onChange={e => setNewVideoTitle(e.target.value)} 
                        placeholder="عنوان الدرس (مثال: الدرس الثاني)" 
                        className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                      />
                      <input 
                        type="file" 
                        accept="video/mp4,video/*" 
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setNewVideoFile(e.target.files[0]);
                          }
                        }}
                        className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                      />
                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-bold">
                        رفع وإضافة الفيديو للكورس
                      </button>
                    </form>

                    {/* رفع PDF من الجهاز */}
                    <form onSubmit={handleAddPdfToCourse} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-3">
                      <h4 className="text-xs font-bold text-amber-300">إضافة ملف (PDF) من الجهاز:</h4>
                      <input 
                        type="text" 
                        value={newPdfTitle} 
                        onChange={e => setNewPdfTitle(e.target.value)} 
                        placeholder="عنوان ملف الـ PDF (مثال: الملخص الشامل)" 
                        className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                      />
                      <input 
                        type="file" 
                        accept="application/pdf" 
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setNewPdfFile(e.target.files[0]);
                          }
                        }}
                        className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-slate-950 hover:file:bg-amber-500"
                      />
                      <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 py-2 rounded-xl text-xs font-bold">
                        رفع وإضافة ملف الـ PDF للكورس
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* إنشاء امتحان ذكي */}
            <div className="p-6 rounded-3xl border shadow-xl bg-slate-900 border-slate-800">
              <h3 className="text-base font-bold text-emerald-400 mb-4">إنشاء امتحان ذكي مع نظام كشف الغش</h3>
              <form onSubmit={handleCreateExam} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">اختر الكورس</label>
                    <select 
                      value={examCourseTarget} 
                      onChange={e => setExamCourseTarget(e.target.value)} 
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    >
                      <option value="">-- اختر الكورس --</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">عنوان الامتحان</label>
                    <input 
                      type="text" 
                      value={examTitle} 
                      onChange={e => setExamTitle(e.target.value)} 
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                      placeholder="امتحان الفصل الأول"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-800 pt-4">
                  {examQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-indigo-400">السؤال رقم {qIdx + 1}</span>
                      </div>
                      <input 
                        type="text" 
                        value={q.question} 
                        onChange={e => {
                          const updated = [...examQuestions];
                          updated[qIdx].question = e.target.value;
                          setExamQuestions(updated);
                        }} 
                        placeholder="نص السؤال..." 
                        className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt: string, oIdx: number) => (
                          <input 
                            key={oIdx} 
                            type="text" 
                            value={opt} 
                            onChange={e => {
                              const updated = [...examQuestions];
                              updated[qIdx].options[oIdx] = e.target.value;
                              setExamQuestions(updated);
                            }} 
                            placeholder={`الخيار ${oIdx + 1}`} 
                            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                          />
                        ))}
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1">رقم الإجابة الصحيحة (0 للخيار الأول، 1 للثاني، إلخ):</label>
                        <input 
                          type="number" 
                          min={0} 
                          max={3} 
                          value={q.correctAnswer} 
                          onChange={e => {
                            const updated = [...examQuestions];
                            updated[qIdx].correctAnswer = Number(e.target.value);
                            setExamQuestions(updated);
                          }} 
                          className="w-24 p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddExamQuestion} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-xs font-bold">
                    إضافة سؤال جديد
                  </button>
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl font-bold text-xs shadow">
                  نشر الامتحان للطلاب
                </button>
              </form>
            </div>

            {/* سجل درجات الامتحانات للطلاب */}
            <div className="p-6 rounded-3xl border shadow-xl bg-slate-900 border-slate-800">
              <h3 className="text-base font-bold text-amber-400 mb-4">سجل درجات الطلاب في الامتحانات</h3>
              {examResultsLog.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 opacity-70">
                        <th className="pb-3">اسم الطالب</th>
                        <th className="pb-3">هاتف الطالب</th>
                        <th className="pb-3">هاتف ولي الأمر</th>
                        <th className="pb-3">الامتحان</th>
                        <th className="pb-3">الدرجة</th>
                        <th className="pb-3">إنذارات الغش</th>
                        <th className="pb-3">الوقت المستغرق</th>
                        <th className="pb-3">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {examResultsLog.map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-3 font-bold">{log.studentName}</td>
                          <td className="py-3">{log.studentPhone}</td>
                          <td className="py-3 text-amber-400 font-bold">{log.parentPhone}</td>
                          <td className="py-3">{log.examTitle}</td>
                          <td className="py-3 font-bold text-emerald-400">{log.score} / {log.total}</td>
                          <td className="py-3 font-bold text-rose-400">{log.warnings}</td>
                          <td className="py-3">{log.duration}</td>
                          <td className="py-3 opacity-70">{log.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs opacity-60">لا توجد سجلات امتحانات حتى الآن.</p>
              )}
            </div>
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {activeTab === 'admin-dashboard' && (isLoggedIn && userRole === 'admin') && (
          <div className="space-y-10">
            <h2 className="text-2xl font-black">لوحة إدارة الأدمن الشاملة</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* إنشاء حساب معلم */}
              <div className="p-6 rounded-3xl border shadow-xl bg-slate-900 border-slate-800">
                <h3 className="text-base font-bold text-indigo-400 mb-4">إنشاء حساب معلم جديد وتفعيله مباشرة</h3>
                <form onSubmit={handleAdminCreateTeacher} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">اسم المعلم</label>
                    <input 
                      type="text" 
                      value={newTeacherName} 
                      onChange={e => setNewTeacherName(e.target.value)} 
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                      placeholder="أ/ محمد"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      value={newTeacherEmail} 
                      onChange={e => setNewTeacherEmail(e.target.value)} 
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                      placeholder="teacher@edu.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">كلمة المرور</label>
                    <input 
                      type="password" 
                      value={newTeacherPassword} 
                      onChange={e => setNewTeacherPassword(e.target.value)} 
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                      placeholder="123456"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">رقم الهاتف</label>
                    <input 
                      type="text" 
                      value={newTeacherPhone} 
                      onChange={e => setNewTeacherPhone(e.target.value)} 
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                      placeholder="010xxxxxxxx"
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl font-bold text-xs shadow">
                    إنشاء وتفعيل حساب المعلم
                  </button>
                </form>
              </div>

              {/* إدارة المستخدمين */}
              <div className="p-6 rounded-3xl border shadow-xl bg-slate-900 border-slate-800">
                <h3 className="text-base font-bold text-emerald-400 mb-4">إدارة مستخدمي المنصة (معلمين وطلاب)</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {usersList.map((u, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold">{u.name} ({u.role === 'admin' ? 'مدير' : u.role === 'instructor' ? 'معلم' : 'طالب'})</p>
                        <p className="opacity-70 text-[11px]">{u.email} | الهاتف: {u.phone || 'غير محدد'}</p>
                        <p className="text-[10px] text-indigo-400">حالة الحساب: {u.status === 'active' ? 'نشط' : 'معطل'}</p>
                      </div>
                      <div className="flex gap-2">
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => handleToggleTeacherStatus(u.email)} 
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] ${u.status === 'active' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'}`}
                          >
                            {u.status === 'active' ? 'تعطيل' : 'تفعيل'}
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteUser(u.email)} 
                          className="bg-rose-600/20 text-rose-400 px-2.5 py-1.5 rounded-lg font-bold text-[10px]"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* نافذة تعديل الكورس المنبثقة */}
      {editingCourseId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 rounded-3xl border shadow-2xl bg-slate-900 border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-amber-400">تعديل بيانات الكورس</h3>
            <form onSubmit={handleUpdateCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">عنوان الكورس</label>
                <input 
                  type="text" 
                  value={editCourseTitle} 
                  onChange={e => setEditCourseTitle(e.target.value)} 
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold mb-1">اسم المعلم</label>
                  <input 
                    type="text" 
                    value={editCourseInstructor} 
                    onChange={e => setEditCourseInstructor(e.target.value)} 
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">التصنيف</label>
                  <input 
                    type="text" 
                    value={editCourseCategory} 
                    onChange={e => setEditCourseCategory(e.target.value)} 
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold mb-1">المرحلة الدراسية</label>
                  <select 
                    value={editCourseStage} 
                    onChange={e => {
                      setEditCourseStage(e.target.value);
                      const firstGr = educationalStages.find(s => s.id === e.target.value)?.grades[0]?.id || '';
                      setEditCourseGrade(firstGr);
                    }} 
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    {educationalStages.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">الصف الدراسي</label>
                  <select 
                    value={editCourseGrade} 
                    onChange={e => setEditCourseGrade(e.target.value)} 
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    {targetGradesForEditCourse.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">السعر</label>
                <input 
                  type="text" 
                  value={editCoursePrice} 
                  onChange={e => setEditCoursePrice(e.target.value)} 
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">وصف الكورس</label>
                <textarea 
                  value={editCourseDesc} 
                  onChange={e => setEditCourseDesc(e.target.value)} 
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" 
                  rows={2}
                ></textarea>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl font-bold text-xs">
                  حفظ التعديلات
                </button>
                <button type="button" onClick={() => setEditingCourseId(null)} className="bg-slate-700 text-white px-4 py-3 rounded-xl font-bold text-xs">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة الامتحان الذكي */}
      {activeExam && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`max-w-2xl w-full p-8 rounded-3xl border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-6 max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-lg font-black">{activeExam.title}</h3>
              <span className="text-xs bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full font-bold">
                تحذيرات الغش: {cheatingWarnings} / 3
              </span>
            </div>

            {!examSubmitted ? (
              <div className="space-y-6">
                {activeExam.questions.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="space-y-3 p-4 rounded-2xl bg-slate-800/40 border border-slate-700">
                    <p className="text-sm font-bold">{qIdx + 1}. {q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt: string, oIdx: number) => (
                        <label key={oIdx} className={`p-3 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition ${examAnswers[qIdx] === oIdx ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-slate-700'}`}>
                          <input 
                            type="radio" 
                            name={`question-${qIdx}`} 
                            checked={examAnswers[qIdx] === oIdx} 
                            onChange={() => setExamAnswers({ ...examAnswers, [qIdx]: oIdx })}
                            className="accent-indigo-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={submitExam} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl font-bold text-xs shadow-lg transition">
                  تسليم الامتحان وإظهار النتيجة
                </button>
              </div>
            ) : (
              <div className="space-y-6 text-center py-6">
                <h4 className="text-2xl font-black text-emerald-400">تم الانتهاء من الامتحان بنجاح</h4>
                <p className="text-lg font-bold">درجتك النهائية: {examScore} من {activeExam.questions.length}</p>
                <button onClick={() => setActiveExam(null)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-xs">
                  إغلاق نافذة الامتحان
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}