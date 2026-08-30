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

  const handleAddVideoToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForContent || !newVideoTitle || !newVideoFile) {
      showToast('يرجى اختيار الكورس، عنوان الدرس، واختيار ملف الفيديو من الجهاز');
      return;
    }
    
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

  const handleAddPdfToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForContent || !newPdfTitle || !newPdfFile) {
      showToast('يرجى اختيار الكورس، عنوان الملف، واختيار ملف الـ PDF من الجهاز');
      return;
    }

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
                                  متصفحك لا يدعم عرض الفيديو.
                                </video>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] opacity-60">لا توجد فيديوهات مضافة بعد.</p>
                          )}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-emerald-400 mb-2">ملفات الشرح (PDF):</h4>
                          {course.pdfs && course.pdfs.length > 0 ? (
                            course.pdfs.map((pdf: any) => (
                              <div key={pdf.id} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-800/40 border border-slate-700 mb-2">
                                <span className="text-xs font-bold truncate max-w-[150px]">{pdf.title}</span>
                                <a href={pdf.url} target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-[11px] font-bold">
                                  تحميل / فتح
                                </a>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] opacity-60">لا توجد ملفات PDF مضافة بعد.</p>
                          )}
                        </div>

                        {course.exam && (
                          <div className="pt-2">
                            <button 
                              onClick={() => startExam(course.exam)}
                              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-bold shadow transition"
                            >
                              ابدأ الامتحان: {course.exam.title}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* AUTH TAB */}
        {activeTab === 'auth' && (
          <div className="max-w-md mx-auto p-8 rounded-3xl border shadow-2xl bg-slate-900 border-slate-800">
            <div className="flex gap-4 mb-6">
              <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 text-xs font-bold rounded-xl border ${authMode === 'login' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>تسجيل الدخول</button>
              <button onClick={() => setAuthMode('signup')} className={`flex-1 py-2 text-xs font-bold rounded-xl border ${authMode === 'signup' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>حساب جديد (طالب)</button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <h2 className="text-xl font-bold mb-4 text-center">تسجيل الدخول للمنصة</h2>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">البريد الإلكتروني</label>
                  <input type="email" value={inputEmail} onChange={e => setInputEmail(e.target.value)} placeholder="name@edu.com" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">كلمة المرور</label>
                  <input type="password" value={inputPassword} onChange={e => setInputPassword(e.target.value)} placeholder="••••••••" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg">دخول</button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <h2 className="text-xl font-bold mb-4 text-center">إنشاء حساب طالب جديد</h2>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">الاسم الكامل</label>
                  <input type="text" value={inputName} onChange={e => setInputName(e.target.value)} placeholder="محمد أحمد" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">البريد الإلكتروني</label>
                  <input type="email" value={inputEmail} onChange={e => setInputEmail(e.target.value)} placeholder="student@edu.com" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">كلمة المرور</label>
                  <input type="password" value={inputPassword} onChange={e => setInputPassword(e.target.value)} placeholder="••••••••" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">رقم هاتف الطالب</label>
                  <input type="text" value={inputPhone} onChange={e => setInputPhone(e.target.value)} placeholder="01111111111" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">رقم هاتف ولي الأمر (لإرسال النتائج والتقارير)</label>
                  <input type="text" value={inputParentPhone} onChange={e => setInputParentPhone(e.target.value)} placeholder="01222222222" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">المرحلة الدراسية</label>
                  <select value={inputStage} onChange={e => { setInputStage(e.target.value); const firstG = educationalStages.find(s => s.id === e.target.value)?.grades[0]?.id || ''; setInputGrade(firstG); }} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
                    {educationalStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">الصف الدراسي</label>
                  <select value={inputGrade} onChange={e => setInputGrade(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
                    {currentAvailableGrades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg">تسجيل وحفظ البيانات</button>
              </form>
            )}
          </div>
        )}

        {/* INSTRUCTOR / CONTENT DASHBOARD */}
        {activeTab === 'instructor-dashboard' && (isLoggedIn && (userRole === 'instructor' || userRole === 'admin')) && (
          <div className="space-y-10">
            <h2 className="text-2xl font-black">لوحة التحكم وإدارة المحتوى وسجل الدرجات</h2>

            {/* قسم إنشاء كورس جديد */}
            <div className="p-8 rounded-3xl border bg-slate-900 border-slate-800">
              <h3 className="text-lg font-bold mb-4 text-indigo-400">إضافة كورس جديد للمنصة فوراً</h3>
              <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">عنوان الكورس</label>
                  <input type="text" value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="مثال: كورس الفيزياء المتقدم" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">اسم المعلم</label>
                  <input type="text" value={newCourseInstructor} onChange={e => setNewCourseInstructor(e.target.value)} placeholder="مثال: د. أحمد" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">المادة / التخصص</label>
                  <input type="text" value={newCourseCategory} onChange={e => setNewCourseCategory(e.target.value)} placeholder="مثال: فيزياء" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">السعر</label>
                  <input type="text" value={newCoursePrice} onChange={e => setNewCoursePrice(e.target.value)} placeholder="مجاناً أو السعر" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">المرحلة الدراسية</label>
                  <select value={newCourseStage} onChange={e => { setNewCourseStage(e.target.value); const fg = educationalStages.find(s => s.id === e.target.value)?.grades[0]?.id || ''; setNewCourseGrade(fg); }} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
                    {educationalStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">الصف الدراسي المستهدف</label>
                  <select value={newCourseGrade} onChange={e => setNewCourseGrade(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
                    {targetGradesForNewCourse.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold mb-1 opacity-80">وصف الكورس</label>
                  <textarea value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} placeholder="تفاصيل المحتوى..." className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white h-20" />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow">نشر الكورس فوراً</button>
                </div>
              </form>
            </div>

            {/* قسم إدارة وتعديل الكورسات الحالية */}
            <div className="p-8 rounded-3xl border bg-slate-900 border-slate-800">
              <h3 className="text-lg font-bold mb-4 text-amber-400">تعديل أو حذف الكورسات الحالية</h3>
              <div className="space-y-4">
                {courses.map(c => (
                  <div key={c.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">{c.title}</h4>
                      <p className="text-xs opacity-70">المعلم: {c.instructor} | الصف: {c.grade}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditingCourse(c)} className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold">تعديل</button>
                      <button onClick={() => handleDeleteCourse(c.id)} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold">حذف</button>
                    </div>
                  </div>
                ))}
              </div>

              {editingCourseId && (
                <form onSubmit={handleUpdateCourse} className="mt-6 p-6 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4">
                  <h4 className="text-sm font-bold text-amber-400">تعديل بيانات الكورس المحدد</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">عنوان الكورس</label>
                      <input type="text" value={editCourseTitle} onChange={e => setEditCourseTitle(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">اسم المعلم</label>
                      <input type="text" value={editCourseInstructor} onChange={e => setEditCourseInstructor(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">المرحلة الدراسية</label>
                      <select value={editCourseStage} onChange={e => { setEditCourseStage(e.target.value); const fg = educationalStages.find(s => s.id === e.target.value)?.grades[0]?.id || ''; setEditCourseGrade(fg); }} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white">
                        {educationalStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">الصف الدراسي</label>
                      <select value={editCourseGrade} onChange={e => setEditCourseGrade(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white">
                        {targetGradesForEditCourse.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold">حفظ التعديلات</button>
                    <button type="button" onClick={() => setEditingCourseId(null)} className="bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold">إلغاء</button>
                  </div>
                </form>
              )}
            </div>

            {/* قسم رفع فيديوهات وملفات PDF من الجهاز */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl border bg-slate-900 border-slate-800">
                <h3 className="text-lg font-bold mb-4 text-indigo-400">إضافة فيديو (من جهازك) لأي كورس</h3>
                <form onSubmit={handleAddVideoToCourse} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">اختر الكورس المستهدف</label>
                    <select value={selectedCourseForContent} onChange={e => setSelectedCourseForContent(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
                      <option value="">-- اختر كورس --</option>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.grade})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">عنوان الدرس</label>
                    <input type="text" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="مثال: المحاضرة الأولى" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">اختر ملف الفيديو (MP4)</label>
                    <input type="file" accept="video/mp4,video/*" onChange={e => e.target.files && setNewVideoFile(e.target.files[0])} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white file:bg-indigo-600 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1" />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow">رفع الفيديو للكورس فوراً</button>
                </form>
              </div>

              <div className="p-8 rounded-3xl border bg-slate-900 border-slate-800">
                <h3 className="text-lg font-bold mb-4 text-emerald-400">إضافة ملف PDF (من جهازك) لأي كورس</h3>
                <form onSubmit={handleAddPdfToCourse} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">اختر الكورس المستهدف</label>
                    <select value={selectedCourseForContent} onChange={e => setSelectedCourseForContent(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
                      <option value="">-- اختر كورس --</option>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.grade})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">عنوان ملف الـ PDF</label>
                    <input type="text" value={newPdfTitle} onChange={e => setNewPdfTitle(e.target.value)} placeholder="مثال: ملزمة المراجعة النهائية" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">اختر ملف الـ PDF</label>
                    <input type="file" accept="application/pdf" onChange={e => e.target.files && setNewPdfFile(e.target.files[0])} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white file:bg-emerald-600 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1" />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs shadow">رفع ملف PDF للكورس فوراً</button>
                </form>
              </div>
            </div>

            {/* قسم إنشاء الامتحان الذكي مع النقطة بجانب الإجابة الصحيحة */}
            <div className="p-8 rounded-3xl border bg-slate-900 border-slate-800">
              <h3 className="text-lg font-bold mb-4 text-amber-400">إنشاء امتحان ذكي مع تحديد الإجابة الصحيحة</h3>
              <form onSubmit={handleCreateExam} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">اختر الكورس التابع له الامتحان</label>
                    <select value={examCourseTarget} onChange={e => setExamCourseTarget(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white">
                      <option value="">-- اختر كورس --</option>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.grade})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">عنوان الامتحان</label>
                    <input type="text" value={examTitle} onChange={e => setExamTitle(e.target.value)} placeholder="مثال: امتحان شامل على الفصل الأول" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                  </div>
                </div>

                <div className="space-y-6 border-t border-slate-800 pt-6">
                  {examQuestions.map((q, qIndex) => (
                    <div key={qIndex} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <div>
                        <label className="block text-xs font-bold mb-1 text-indigo-400">السؤال رقم {qIndex + 1}</label>
                        <input type="text" value={q.question} onChange={e => { const updated = [...examQuestions]; updated[qIndex].question = e.target.value; setExamQuestions(updated); }} placeholder="اكتب نص السؤال هنا..." className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white" />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold opacity-80">خيارات الإجابة (اضغط على النقطة بجانب الإجابة الصحيحة لتحديدها):</label>
                        {q.options.map((opt: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-center gap-3">
                            {/* النقطة بجانب الإجابة الصح */}
                            <input 
                              type="radio" 
                              name={`correct-ans-${qIndex}`} 
                              checked={q.correctAnswer === optIndex}
                              onChange={() => {
                                const updated = [...examQuestions];
                                updated[qIndex].correctAnswer = optIndex;
                                setExamQuestions(updated);
                              }}
                              className="w-4 h-4 accent-emerald-500 cursor-pointer"
                              title="اختر هذه النقطة لتحديد أن هذا الخيار هو الإجابة الصحيحة"
                            />
                            <span className="text-xs text-emerald-400 font-bold">صحيح</span>
                            <input 
                              type="text" 
                              value={opt} 
                              onChange={e => {
                                const updated = [...examQuestions];
                                updated[qIndex].options[optIndex] = e.target.value;
                                setExamQuestions(updated);
                              }} 
                              placeholder={`الخيار ${optIndex + 1}`} 
                              className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={handleAddExamQuestion} className="bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-indigo-500/30 px-4 py-2.5 rounded-xl text-xs font-bold">
                    + إضافة سؤال جديد
                  </button>
                </div>

                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 rounded-xl font-bold text-xs shadow-lg">حفظ ونشر الامتحان على المنصة</button>
              </form>
            </div>

            {/* سجل نتائج الطلاب */}
            <div className="p-8 rounded-3xl border bg-slate-900 border-slate-800">
              <h3 className="text-lg font-bold mb-4 text-emerald-400">سجل درجات الطلاب وأرقام أولياء الأمور</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-indigo-400">
                      <th className="p-3">اسم الطالب</th>
                      <th className="p-3">هاتف الطالب</th>
                      <th className="p-3">هاتف ولي الأمر</th>
                      <th className="p-3">اسم الامتحان</th>
                      <th className="p-3">الدرجة</th>
                      <th className="p-3">محاولات الغش</th>
                      <th className="p-3">التاريخ والوقت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examResultsLog.length > 0 ? (
                      examResultsLog.map((res, idx) => (
                        <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                          <td className="p-3 font-bold">{res.studentName}</td>
                          <td className="p-3">{res.studentPhone}</td>
                          <td className="p-3 font-bold text-amber-400">{res.parentPhone}</td>
                          <td className="p-3">{res.examTitle}</td>
                          <td className="p-3 font-bold text-emerald-400">{res.score} / {res.total}</td>
                          <td className="p-3 font-bold text-rose-400">{res.warnings} إنذارات</td>
                          <td className="p-3 opacity-70">{res.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center opacity-60">لا توجد نتائج مسجلة حتى الآن.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {activeTab === 'admin-dashboard' && (isLoggedIn && userRole === 'admin') && (
          <div className="space-y-10">
            <h2 className="text-2xl font-black text-emerald-400">لوحة تحكم مدير المنصة (الأدمن العام)</h2>

            {/* إنشاء حساب مدرس جديد */}
            <div className="p-8 rounded-3xl border bg-slate-900 border-slate-800">
              <h3 className="text-lg font-bold mb-4 text-indigo-400">إنشاء وتفعيل حساب معلم جديد على المنصة</h3>
              <form onSubmit={handleAdminCreateTeacher} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">اسم المعلم</label>
                  <input type="text" value={newTeacherName} onChange={e => setNewTeacherName(e.target.value)} placeholder="مثال: أ/ محمد" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">البريد الإلكتروني للمعلم</label>
                  <input type="email" value={newTeacherEmail} onChange={e => setNewTeacherEmail(e.target.value)} placeholder="teacher@edu.com" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">كلمة المرور</label>
                  <input type="password" value={newTeacherPassword} onChange={e => setNewTeacherPassword(e.target.value)} placeholder="••••••••" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">رقم الهاتف</label>
                  <input type="text" value={newTeacherPhone} onChange={e => setNewTeacherPhone(e.target.value)} placeholder="01000000000" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow">إنشاء وتفعيل حساب المعلم فوراً</button>
                </div>
              </form>
            </div>

            {/* إدارة كافة المستخدمين (حظر / حذف / ترقية) */}
            <div className="p-8 rounded-3xl border bg-slate-900 border-slate-800">
              <h3 className="text-lg font-bold mb-4 text-amber-400">إدارة مستخدمي المنصة (طلاب ومعلمين)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-emerald-400">
                      <th className="p-3">الاسم</th>
                      <th className="p-3">البريد الإلكتروني</th>
                      <th className="p-3">الدور</th>
                      <th className="p-3">رقم هاتف الطالب</th>
                      <th className="p-3">رقم هاتف ولي الأمر</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u, idx) => (
                      <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                        <td className="p-3 font-bold">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3 font-bold text-indigo-400">{u.role === 'admin' ? 'مدير' : u.role === 'instructor' ? 'معلم' : 'طالب'}</td>
                        <td className="p-3">{u.phone || 'N/A'}</td>
                        <td className="p-3 font-bold text-amber-400">{u.parentPhone || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${u.status === 'suspended' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {u.status === 'suspended' ? 'معطل' : 'نشط'}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          {u.email !== '250iie3@gmail.com' && (
                            <>
                              <button onClick={() => handleToggleTeacherStatus(u.email)} className="bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                                {u.status === 'suspended' ? 'تنشيط' : 'تعطيل'}
                              </button>
                              <button onClick={() => handleDeleteUser(u.email)} className="bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                                حذف
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ACTIVE EXAM MODAL WITH ANTI-CHEAT */}
      {activeExam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 text-right">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h2 className="text-lg sm:text-xl font-black text-indigo-400">{activeExam.title}</h2>
              <span className="text-xs bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-full font-bold border border-rose-500/30">
                إنذارات الغش: {cheatingWarnings} / 3
              </span>
            </div>

            {!examSubmitted ? (
              <div className="space-y-6">
                {activeExam.questions.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h3 className="text-xs sm:text-sm font-bold text-white">{qIdx + 1}. {q.question}</h3>
                    <div className="space-y-2">
                      {q.options.map((opt: string, optIdx: number) => (
                        <label key={optIdx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 cursor-pointer hover:bg-slate-800/50">
                          <input 
                            type="radio" 
                            name={`exam-q-${qIdx}`} 
                            checked={examAnswers[qIdx] === optIdx}
                            onChange={() => setExamAnswers({ ...examAnswers, [qIdx]: optIdx })}
                            className="w-4 h-4 accent-indigo-500"
                          />
                          <span className="text-xs text-slate-200">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button onClick={submitExam} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg">
                  تسليم الامتحان وعرض النتيجة
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6 py-6">
                <h3 className="text-2xl font-extrabold text-emerald-400">تم تسليم الامتحان بنجاح</h3>
                <p className="text-lg font-bold">درجتك النهائية: {examScore} / {activeExam.questions.length}</p>
                <button onClick={() => setActiveExam(null)} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-xs font-bold">
                  إغلاق نافذة الامتحان
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className={`border-t py-6 mt-16 text-center text-xs opacity-70 ${darkMode ? 'bg-[#1e293b] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
        <p>جميع الحقوق محفوظة © 2026 منصة BEDAYA EDU التعليمية الذكية</p>
      </footer>

    </div>
  );
}