'use client';
import { useState, useEffect } from 'react';

export default function EduPlatform() {
  const [darkMode, setDarkMode] = useState(false);
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
    { name: 'مدير المنصة', email: '250iie3@gmail.com', password: 'Mohamad$35', phone: '01000000000', parentPhone: 'N/A', role: 'admin', status: 'active', stage: 'secondary', grade: 'sec-3' },
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
  
  const [videoAddMethod, setVideoAddMethod] = useState<'file' | 'url'>('file');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('10 دقائق');
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [newVideoUrlInput, setNewVideoUrlInput] = useState('');

  const [pdfAddMethod, setPdfAddMethod] = useState<'file' | 'url'>('file');
  const [newPdfTitle, setNewPdfTitle] = useState('');
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
  const [newPdfUrlInput, setNewPdfUrlInput] = useState('');

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
      id: Date.now(),
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

  const handleDeleteSingleExamResult = (recordId: number) => {
    setExamResultsLog(examResultsLog.filter(r => r.id !== recordId));
    showToast('تم حذف السجل بنجاح');
  };

  const handleClearAllExamResults = () => {
    if (confirm('هل أنت متأكد من مسح كافة سجلات درجات الطلاب نهائياً؟')) {
      setExamResultsLog([]);
      showToast('تم تفريغ سجل درجات الطلاب بالكامل');
    }
  };

  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('bedaya_edu_users_db');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        const adminExists = parsedUsers.some((u: any) => u.email === '250iie3@gmail.com');
        if (!adminExists) {
          parsedUsers.push({ name: 'مدير المنصة', email: '250iie3@gmail.com', password: 'Mohamad$35', phone: '01000000000', parentPhone: 'N/A', role: 'admin', status: 'active', stage: 'secondary', grade: 'sec-3' });
        }
        setUsersList(parsedUsers);
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
      showToast('هذا الحساب معطل من قبل الإدارة، يرجى مراجعة الدعم');
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

  const handleToggleUserStatus = (email: string) => {
    if (email === '250iie3@gmail.com') {
      showToast('لا يمكن تعطيل حساب الأدمن الرئيسي');
      return;
    }
    setUsersList(usersList.map(u => {
      if (u.email === email) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        showToast(`تم تغيير حالة حساب ${u.name} إلى: ${newStatus === 'active' ? 'مفعل' : 'معطل'}`);
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
    if (confirm('هل أنت متأكد من حذف هذا المستخدم نهائياً من المنصة؟')) {
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
    showToast('تم إنشاء الكورس وإضافته بنجاح لصفه المحدد');
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
    if (!selectedCourseForContent || !newVideoTitle) {
      showToast('يرجى اختيار الكورس وكتابة عنوان الدرس');
      return;
    }

    let finalVideoUrl = '';
    if (videoAddMethod === 'file') {
      if (!newVideoFile) {
        showToast('يرجى اختيار ملف فيديو من الجهاز');
        return;
      }
      finalVideoUrl = URL.createObjectURL(newVideoFile);
    } else {
      if (!newVideoUrlInput) {
        showToast('يرجى إدخال رابط الفيديو الصحيح');
        return;
      }
      finalVideoUrl = newVideoUrlInput;
    }

    setCourses(courses.map(c => {
      if (String(c.id) === String(selectedCourseForContent)) {
        const newLesson = { id: Date.now(), title: newVideoTitle, duration: newVideoDuration, videoUrl: finalVideoUrl };
        return { ...c, lessons: [...c.lessons, newLesson] };
      }
      return c;
    }));
    showToast('تمت إضافة الفيديو بنجاح');
    setNewVideoTitle('');
    setNewVideoFile(null);
    setNewVideoUrlInput('');
  };

  const handleAddPdfToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForContent || !newPdfTitle) {
      showToast('يرجى اختيار الكورس وكتابة عنوان ملف الـ PDF');
      return;
    }

    let finalPdfUrl = '';
    if (pdfAddMethod === 'file') {
      if (!newPdfFile) {
        showToast('يرجى اختيار ملف PDF من الجهاز');
        return;
      }
      finalPdfUrl = URL.createObjectURL(newPdfFile);
    } else {
      if (!newPdfUrlInput) {
        showToast('يرجى إدخال رابط ملف الـ PDF الصحيح');
        return;
      }
      finalPdfUrl = newPdfUrlInput;
    }

    setCourses(courses.map(c => {
      if (String(c.id) === String(selectedCourseForContent)) {
        const newPdf = { id: Date.now(), title: newPdfTitle, url: finalPdfUrl };
        return { ...c, pdfs: [...c.pdfs, newPdf] };
      }
      return c;
    }));
    showToast('تمت إضافة ملف الـ PDF بنجاح');
    setNewPdfTitle('');
    setNewPdfFile(null);
    setNewPdfUrlInput('');
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
    <div className={`min-h-screen font-sans relative transition-colors duration-300 ${darkMode ? 'bg-[#0b0f19] text-slate-100' : 'bg-[#f4f7fb] text-slate-800'}`} dir="rtl">
      
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-teal-600 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm border border-teal-500">
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <header className={`border-b sticky top-0 z-45 shadow-sm transition-colors duration-300 ${darkMode ? 'bg-[#131c2e] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-black tracking-wide cursor-pointer flex items-center gap-2" onClick={() => setActiveTab('home')}>
            <span className="bg-teal-600 text-white px-2.5 py-1 rounded-xl text-sm sm:text-base shadow-sm">EDU</span>
            <span className={darkMode ? 'text-white' : 'text-slate-900'}>BEDAYA</span>
          </div>

          <nav className="hidden md:flex gap-6 font-semibold text-xs sm:text-sm items-center">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'hover:text-teal-500 transition'}>الرئيسية</button>
            <button onClick={() => setActiveTab('stages')} className={activeTab === 'stages' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'hover:text-teal-500 transition'}>المراحل والصفوف</button>
            <button onClick={() => setActiveTab('courses')} className={activeTab === 'courses' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'hover:text-teal-500 transition'}>الكورسات والملفات والامتحانات</button>
            {isLoggedIn && (userRole === 'instructor' || userRole === 'admin') && (
              <button onClick={() => setActiveTab('instructor-dashboard')} className={activeTab === 'instructor-dashboard' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'hover:text-amber-500 transition'}>لوحة المحتوى وسجل الدرجات</button>
            )}
            {isLoggedIn && userRole === 'admin' && (
              <button onClick={() => setActiveTab('admin-dashboard')} className={activeTab === 'admin-dashboard' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-emerald-500 transition'}>لوحة إدارة الأدمن والمستخدمين</button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 transition">
              {darkMode ? '☀️ وضع نهار' : '🌙 وضع ليل'}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-teal-50 text-teal-700 dark:bg-teal-500/25 dark:text-teal-300 px-3 py-1.5 rounded-full font-bold border border-teal-200 dark:border-teal-500/30">
                  {userName} ({userRole === 'admin' ? 'مدير' : userRole === 'instructor' ? 'معلم' : 'طالب'})
                </span>
                <button onClick={handleLogout} className="bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 text-xs px-3 py-1.5 rounded-xl font-bold border border-rose-200 dark:border-rose-500/30 transition hover:bg-rose-100">خروج</button>
              </div>
            ) : (
              <button onClick={() => setActiveTab('auth')} className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-sm transition">
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
            <div className={`rounded-3xl p-10 sm:p-14 border shadow-sm transition-colors ${darkMode ? 'bg-gradient-to-r from-slate-900 to-[#131c2e] border-slate-800 text-slate-100' : 'bg-gradient-to-br from-teal-700 to-teal-900 text-white border-teal-600'}`}>
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight">منصة BEDAYA EDU التعليمية الذكية</h1>
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">اختر مرحلتك وصّفك الدراسي لتظهر لك حصرياً المواد، الكورسات، الفيديوهات، ملفات الـ PDF، والامتحانات الذكية الخاصة بك فقط.</p>
              
              <div className="flex justify-center gap-4 flex-wrap">
                <button onClick={() => setActiveTab('stages')} className="bg-white text-teal-800 hover:bg-slate-100 px-6 py-3 rounded-xl font-bold shadow-sm transition">
                  تصفح المراحل والصفوف التعليمية
                </button>
                <button onClick={() => setActiveTab('courses')} className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 rounded-xl font-bold shadow-sm transition">
                  تصفح كافة الكورسات والملفات
                </button>
                {isLoggedIn && (userRole === 'instructor' || userRole === 'admin') && (
                  <button onClick={() => setActiveTab('instructor-dashboard')} className="bg-teal-900 hover:bg-teal-950 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition border border-teal-700">
                    لوحة التحكم (إضافة كورسات وامتحانات)
                  </button>
                )}
                {isLoggedIn && userRole === 'admin' && (
                  <button onClick={() => setActiveTab('admin-dashboard')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition">
                    إدارة المستخدمين وسجل الدرجات
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
                <div key={stage.id} className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-teal-600 dark:text-teal-400">{stage.name}</h3>
                    <ul className="space-y-2.5 mb-6">
                      {stage.grades.map(grade => (
                        <li key={grade.id} className="text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
                          <span className="font-medium">{grade.name}</span>
                          <button 
                            onClick={() => { setSelectedGradeForCourses(grade.id); setActiveTab('courses'); }}
                            className="bg-teal-600 hover:bg-teal-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition"
                          >
                            عرض كورسات الصف
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
                {userRole === 'student' && isLoggedIn ? `كورسات صفك الدراسي المخصص (${userGrade})` : 'الكورسات، الفيديوهات والامتحانات المتاحة'}
              </h2>
              {selectedGradeForCourses && (
                <button onClick={() => setSelectedGradeForCourses(null)} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white text-xs px-3 py-1.5 rounded-xl font-bold transition">
                  إلغاء فلترة الصف وعرض الكل
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter(c => {
                  if (selectedGradeForCourses) {
                    return c.grade === selectedGradeForCourses;
                  }
                  if (isLoggedIn && userRole === 'student') {
                    return c.grade === userGrade;
                  }
                  return true;
                })
                .map(course => (
                  <div key={course.id} className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-teal-50 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-500/30">
                          {course.category}
                        </span>
                        <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-500/20">
                          {course.price}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">المعلم: {course.instructor}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">{course.description}</p>
                      
                      {/* عرض الدروس والفيديوهات */}
                      <div className="space-y-2 mb-4">
                        <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">الفيديوهات والدروس المشروحة:</h4>
                        {course.lessons && course.lessons.length > 0 ? (
                          course.lessons.map((lesson: any) => (
                            <div key={lesson.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-bold">{lesson.title}</span>
                                <span className="text-[10px] text-slate-400">{lesson.duration}</span>
                              </div>
                              {lesson.videoUrl && (
                                <video controls className="w-full rounded-lg max-h-40 bg-black">
                                  <source src={lesson.videoUrl} type="video/mp4" />
                                  متصفحك لا يدعم عرض الفيديو
                                </video>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">لا توجد فيديوهات مضافة لهذا الكورس بعد.</p>
                        )}
                      </div>

                      {/* عرض ملفات PDF */}
                      <div className="space-y-2 mb-4">
                        <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">ملفات المذكرات والـ PDF:</h4>
                        {course.pdfs && course.pdfs.length > 0 ? (
                          course.pdfs.map((pdf: any) => (
                            <div key={pdf.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs flex justify-between items-center">
                              <span className="font-bold truncate max-w-[180px]">{pdf.title}</span>
                              <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold transition">
                                تحميل / فتح
                              </a>
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">لا توجد ملفات PDF مضافة.</p>
                        )}
                      </div>

                      {/* زر دخول الامتحان الذكي */}
                      {course.exam && (
                        <div className="mt-4 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex justify-between items-center">
                          <div>
                            <span className="block text-[10px] font-bold text-indigo-500">امتحان ذكي متاح</span>
                            <span className="text-xs font-extrabold">{course.exam.title}</span>
                          </div>
                          <button onClick={() => startExam(course.exam)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm">
                            بدء الامتحان
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* AUTH TAB */}
        {activeTab === 'auth' && (
          <div className="max-w-md mx-auto p-8 rounded-3xl border shadow-sm transition-colors bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button 
                onClick={() => setAuthMode('login')} 
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'login' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
              >
                تسجيل الدخول
              </button>
              <button 
                onClick={() => setAuthMode('signup')} 
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'signup' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
              >
                إنشاء حساب طالب جديد
              </button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <h3 className="text-lg font-bold mb-4">تسجيل الدخول لمنصة BEDAYA EDU</h3>
                <div>
                  <label className="block text-xs font-bold mb-1">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={inputEmail} 
                    onChange={e => setInputEmail(e.target.value)} 
                    placeholder="example@edu.com"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-teal-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">كلمة المرور</label>
                  <input 
                    type="password" 
                    value={inputPassword} 
                    onChange={e => setInputPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-teal-500" 
                  />
                </div>
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-xl font-bold text-xs shadow-sm transition">
                  دخول
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <h3 className="text-lg font-bold mb-2">إنشاء حساب طالب جديد</h3>
                <p className="text-[11px] text-slate-500 mb-4">يُرجى إدخال البيانات بدقة واختيار صفك الدراسي لكي تظهر لك كورساتك وحصصك مباشرة.</p>
                <div>
                  <label className="block text-xs font-bold mb-1">اسم الطالب الكامل</label>
                  <input 
                    type="text" 
                    value={inputName} 
                    onChange={e => setInputName(e.target.value)} 
                    placeholder="محمد أحمد"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-teal-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={inputEmail} 
                    onChange={e => setInputEmail(e.target.value)} 
                    placeholder="student@edu.com"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-teal-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">كلمة المرور</label>
                  <input 
                    type="password" 
                    value={inputPassword} 
                    onChange={e => setInputPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-teal-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">رقم هاتف الطالب</label>
                  <input 
                    type="text" 
                    value={inputPhone} 
                    onChange={e => setInputPhone(e.target.value)} 
                    placeholder="01111111111"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-teal-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">رقم هاتف ولي الأمر (مهم لمتابعة الدرجات)</label>
                  <input 
                    type="text" 
                    value={inputParentPhone} 
                    onChange={e => setInputParentPhone(e.target.value)} 
                    placeholder="01222222222"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-teal-500" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">المرحلة الدراسية</label>
                    <select 
                      value={inputStage} 
                      onChange={e => {
                        const newSt = e.target.value;
                        setInputStage(newSt);
                        const availableGrades = educationalStages.find(s => s.id === newSt)?.grades || [];
                        if (availableGrades.length > 0) setInputGrade(availableGrades[0].id);
                      }}
                      className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-teal-500"
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
                      className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-teal-500"
                    >
                      {currentAvailableGrades.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-xl font-bold text-xs shadow-sm transition">
                  إتمام التسجيل والدخول
                </button>
              </form>
            )}
          </div>
        )}

        {/* INSTRUCTOR / ADMIN CONTENT MANAGEMENT DASHBOARD */}
        {activeTab === 'instructor-dashboard' && isLoggedIn && (userRole === 'instructor' || userRole === 'admin') && (
          <div className="space-y-10">
            <div className={`p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-amber-950/20 border-amber-800/40 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
              <h2 className="text-xl font-black mb-2">لوحة تحكم المحتوى، الفيديوهات والامتحانات الذكية</h2>
              <p className="text-xs opacity-90">من هنا يمكنك إضافة كورسات جديدة، رفع أو ربط الفيديوهات والملفات، وإنشاء الامتحانات وحذف أو مراجعة سجلات درجات الطلاب.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* إضافة كورس جديد */}
              <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
                <h3 className="text-base font-bold text-teal-600 dark:text-teal-400">1. إنشاء كورس دراسي جديد</h3>
                <form onSubmit={handleCreateCourse} className="space-y-3">
                  <input 
                    type="text" 
                    value={newCourseTitle} 
                    onChange={e => setNewCourseTitle(e.target.value)} 
                    placeholder="عنوان الكورس (مثلاً: منهج الفيزياء الشامل)"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" 
                  />
                  <input 
                    type="text" 
                    value={newCourseInstructor} 
                    onChange={e => setNewCourseInstructor(e.target.value)} 
                    placeholder="اسم المعلم"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" 
                  />
                  <input 
                    type="text" 
                    value={newCourseCategory} 
                    onChange={e => setNewCourseCategory(e.target.value)} 
                    placeholder="التصنيف أو المادة (فيزياء، رياضيات...)"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" 
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={newCourseStage} 
                      onChange={e => {
                        const st = e.target.value;
                        setNewCourseStage(st);
                        const grades = educationalStages.find(s => s.id === st)?.grades || [];
                        if (grades.length > 0) setNewCourseGrade(grades[0].id);
                      }}
                      className="p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    >
                      {educationalStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <select 
                      value={newCourseGrade} 
                      onChange={e => setNewCourseGrade(e.target.value)}
                      className="p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    >
                      {targetGradesForNewCourse.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <input 
                    type="text" 
                    value={newCoursePrice} 
                    onChange={e => setNewCoursePrice(e.target.value)} 
                    placeholder="السعر (مجاناً أو قيمة معينة)"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" 
                  />
                  <textarea 
                    value={newCourseDesc} 
                    onChange={e => setNewCourseDesc(e.target.value)} 
                    placeholder="وصف مبسط لمحتوى الكورس"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  />
                  <button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-xl font-bold text-xs transition">
                    حفظ ونشر الكورس
                  </button>
                </form>
              </div>

              {/* إضافة فيديوهات أو ملفات PDF للكورس */}
              <div className={`p-6 rounded-3xl border shadow-sm space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
                <h3 className="text-base font-bold text-teal-600 dark:text-teal-400">2. إضافة محتوى (فيديوهات / مذكرات PDF)</h3>
                
                <div className="space-y-3">
                  <label className="block text-xs font-bold">اختر الكورس المستهدف</label>
                  <select 
                    value={selectedCourseForContent} 
                    onChange={e => setSelectedCourseForContent(e.target.value)}
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  >
                    <option value="">-- اختر كورس من القائمة --</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.grade})</option>)}
                  </select>
                </div>

                {/* نموذج إضافة فيديو */}
                <form onSubmit={handleAddVideoToCourse} className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">إضافة درس فيديو</h4>
                  <input 
                    type="text" 
                    value={newVideoTitle} 
                    onChange={e => setNewVideoTitle(e.target.value)} 
                    placeholder="عنوان الدرس (مثلاً: الدرس الثاني: قوانين نيوتن)"
                    className="w-full p-2.5 rounded-xl border text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700" 
                  />
                  <div className="flex gap-2 text-xs">
                    <label className="flex items-center gap-1 font-bold">
                      <input type="radio" name="vMethod" checked={videoAddMethod === 'file'} onChange={() => setVideoAddMethod('file')} /> رفع ملف من الجهاز
                    </label>
                    <label className="flex items-center gap-1 font-bold">
                      <input type="radio" name="vMethod" checked={videoAddMethod === 'url'} onChange={() => setVideoAddMethod('url')} /> رابط مباشر (YouTube/MP4)
                    </label>
                  </div>
                  {videoAddMethod === 'file' ? (
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={e => e.target.files && setNewVideoFile(e.target.files[0])}
                      className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700" 
                    />
                  ) : (
                    <input 
                      type="text" 
                      value={newVideoUrlInput} 
                      onChange={e => setNewVideoUrlInput(e.target.value)} 
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl border text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700" 
                    />
                  )}
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2 rounded-xl font-bold text-xs transition">
                    إضافة الفيديو للكورس
                  </button>
                </form>

                {/* نموذج إضافة PDF */}
                <form onSubmit={handleAddPdfToCourse} className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">إضافة مذكرة أو ملف PDF</h4>
                  <input 
                    type="text" 
                    value={newPdfTitle} 
                    onChange={e => setNewPdfTitle(e.target.value)} 
                    placeholder="عنوان الملف (مثلاً: ملخص الباب الأول PDF)"
                    className="w-full p-2.5 rounded-xl border text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700" 
                  />
                  <div className="flex gap-2 text-xs">
                    <label className="flex items-center gap-1 font-bold">
                      <input type="radio" name="pMethod" checked={pdfAddMethod === 'file'} onChange={() => setPdfAddMethod('file')} /> رفع ملف PDF
                    </label>
                    <label className="flex items-center gap-1 font-bold">
                      <input type="radio" name="pMethod" checked={pdfAddMethod === 'url'} onChange={() => setPdfAddMethod('url')} /> رابط مباشر
                    </label>
                  </div>
                  {pdfAddMethod === 'file' ? (
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      onChange={e => e.target.files && setNewPdfFile(e.target.files[0])}
                      className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700" 
                    />
                  ) : (
                    <input 
                      type="text" 
                      value={newPdfUrlInput} 
                      onChange={e => setNewPdfUrlInput(e.target.value)} 
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl border text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700" 
                    />
                  )}
                  <button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-xl font-bold text-xs transition">
                    إضافة ملف الـ PDF للكورس
                  </button>
                </form>
              </div>
            </div>

            {/* إنشاء امتحان ذكي ونظام منع الغش */}
            <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
              <h3 className="text-base font-bold text-indigo-600 dark:text-indigo-400">3. إنشاء امتحان ذكي مزود بنظام مراقبة ومنع الغش</h3>
              <form onSubmit={handleCreateExam} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select 
                    value={examCourseTarget} 
                    onChange={e => setExamCourseTarget(e.target.value)}
                    className="p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  >
                    <option value="">-- اختر الكورس لإضافة الامتحان إليه --</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.grade})</option>)}
                  </select>
                  <input 
                    type="text" 
                    value={examTitle} 
                    onChange={e => setExamTitle(e.target.value)} 
                    placeholder="عنوان الامتحان (مثلاً: امتحان تقييم الباب الأول)"
                    className="p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" 
                  />
                </div>

                <div className="space-y-4">
                  {examQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                      <input 
                        type="text" 
                        value={q.question} 
                        onChange={e => {
                          const updated = [...examQuestions];
                          updated[qIdx].question = e.target.value;
                          setExamQuestions(updated);
                        }}
                        placeholder={`السؤال رقم ${qIdx + 1}`}
                        className="w-full p-2.5 rounded-xl border text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700" 
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt: string, optIdx: number) => (
                          <input 
                            key={optIdx}
                            type="text"
                            value={opt}
                            onChange={e => {
                              const updated = [...examQuestions];
                              updated[qIdx].options[optIdx] = e.target.value;
                              setExamQuestions(updated);
                            }}
                            placeholder={`الاختيار ${optIdx + 1}`}
                            className="p-2 rounded-xl border text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span>رقم الإجابة الصحيحة (من 1 إلى 4):</span>
                        <select 
                          value={q.correctAnswer}
                          onChange={e => {
                            const updated = [...examQuestions];
                            updated[qIdx].correctAnswer = Number(e.target.value);
                            setExamQuestions(updated);
                          }}
                          className="p-1.5 rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                        >
                          <option value={0}>الاختيار الأول (1)</option>
                          <option value={1}>الاختيار الثاني (2)</option>
                          <option value={2}>الاختيار الثالث (3)</option>
                          <option value={3}>الاختيار الرابع (4)</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddExamQuestion} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white px-4 py-2 rounded-xl text-xs font-bold transition">
                    + إضافة سؤال جديد
                  </button>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow-sm transition">
                  نشر الامتحان الذكي
                </button>
              </form>
            </div>

            {/* سجل درجات الطلاب */}
            <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400">سجل درجات ومتابعة الطلاب</h3>
                {examResultsLog.length > 0 && (
                  <button onClick={handleClearAllExamResults} className="bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 text-xs px-3 py-1.5 rounded-xl font-bold border border-rose-200 transition">
                    مسح السجل بالكامل
                  </button>
                )}
              </div>
              
              {examResultsLog.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <th className="p-3">اسم الطالب</th>
                        <th className="p-3">هاتف الطالب / ولي الأمر</th>
                        <th className="p-3">اسم الامتحان</th>
                        <th className="p-3">الدرجة</th>
                        <th className="p-3">إنذارات الغش</th>
                        <th className="p-3">وقت الحل</th>
                        <th className="p-3">التاريخ</th>
                        <th className="p-3">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800">
                      {examResultsLog.map(record => (
                        <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-3 font-bold">{record.studentName}</td>
                          <td className="p-3">{record.studentPhone} / {record.parentPhone}</td>
                          <td className="p-3">{record.examTitle}</td>
                          <td className="p-3 font-extrabold text-teal-600">{record.score} / {record.total}</td>
                          <td className="p-3 font-bold text-rose-500">{record.warnings} إنذارات</td>
                          <td className="p-3">{record.duration}</td>
                          <td className="p-3 text-slate-400">{record.date}</td>
                          <td className="p-3">
                            <button onClick={() => handleDeleteSingleExamResult(record.id)} className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-6">لا توجد سجلات درجات لامتحانات الطلاب حتى الآن.</p>
              )}
            </div>
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {activeTab === 'admin-dashboard' && isLoggedIn && userRole === 'admin' && (
          <div className="space-y-10">
            <div className={`p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
              <h2 className="text-xl font-black mb-2">لوحة تحكم الأدمن والتحكم بالمستخدمين</h2>
              <p className="text-xs opacity-90">إدارة حسابات المعلمين والطلاب، تفعيل أو تعطيل الحسابات، وإنشاء حسابات جديدة.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* إنشاء حساب معلم جديد */}
              <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
                <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400">إنشاء حساب معلم جديد</h3>
                <form onSubmit={handleAdminCreateTeacher} className="space-y-3">
                  <input 
                    type="text" 
                    value={newTeacherName} 
                    onChange={e => setNewTeacherName(e.target.value)} 
                    placeholder="اسم المعلم الكامل"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" 
                  />
                  <input 
                    type="email" 
                    value={newTeacherEmail} 
                    onChange={e => setNewTeacherEmail(e.target.value)} 
                    placeholder="البريد الإلكتروني للمعلم"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" 
                  />
                  <input 
                    type="password" 
                    value={newTeacherPassword} 
                    onChange={e => setNewTeacherPassword(e.target.value)} 
                    placeholder="كلمة المرور المؤقتة"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" 
                  />
                  <input 
                    type="text" 
                    value={newTeacherPhone} 
                    onChange={e => setNewTeacherPhone(e.target.value)} 
                    placeholder="رقم الهاتف"
                    className="w-full p-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" 
                  />
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-bold text-xs transition">
                    إنشاء حساب المعلم وتفعيله
                  </button>
                </form>
              </div>

              {/* جدول إدارة المستخدمين */}
              <div className={`lg:col-span-2 p-6 rounded-3xl border shadow-sm space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
                <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400">قائمة مستخدمي المنصة (أدمن، معلمين، طلاب)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <th className="p-3">الاسم</th>
                        <th className="p-3">البريد</th>
                        <th className="p-3">الدور</th>
                        <th className="p-3">الحالة</th>
                        <th className="p-3">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800">
                      {usersList.map(u => (
                        <tr key={u.email} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-3 font-bold">{u.name}</td>
                          <td className="p-3 text-slate-500 dark:text-slate-400">{u.email}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 dark:bg-slate-800">
                              {u.role === 'admin' ? 'مدير' : u.role === 'instructor' ? 'معلم' : 'طالب'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${u.status === 'suspended' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300'}`}>
                              {u.status === 'suspended' ? 'معطل' : 'مفعل'}
                            </span>
                          </td>
                          <td className="p-3 flex gap-2">
                            {u.email !== '250iie3@gmail.com' && (
                              <>
                                <button onClick={() => handleToggleUserStatus(u.email)} className="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                                  {u.status === 'active' ? 'تعطيل' : 'تفعيل'}
                                </button>
                                <button onClick={() => handleDeleteUser(u.email)} className="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 px-2.5 py-1 rounded-lg text-[10px] font-bold">
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
          </div>
        )}

      </main>

      {/* نافذة الامتحان الذكي ونظام المراقبة */}
      {activeExam && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{activeExam.title}</h3>
                <p className="text-xs text-rose-500 font-bold mt-1">⚠️ تحذير: مغادرة النافذة أو فتح تبويب خارجي يعرضك للإنذار (3 إنذارات وتتم الإلغاء تلقائياً)</p>
              </div>
              <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-xl text-xs font-bold border border-rose-200">
                الإنذارات: {cheatingWarnings} / 3
              </span>
            </div>

            {!examSubmitted ? (
              <div className="space-y-6">
                {activeExam.questions.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold sm:text-sm">السؤال {qIdx + 1}: {q.question}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt: string, optIdx: number) => (
                        <label 
                          key={optIdx} 
                          className={`p-3 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition ${examAnswers[qIdx] === optIdx ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                          <input 
                            type="radio" 
                            name={`q-${qIdx}`} 
                            checked={examAnswers[qIdx] === optIdx}
                            onChange={() => setExamAnswers({ ...examAnswers, [qIdx]: optIdx })}
                            className="accent-indigo-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={submitExam} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow-sm transition">
                  تسليم الامتحان ورصد الدرجة
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 py-8">
                <h4 className="text-2xl font-black text-teal-600">تم تسليم الامتحان بنجاح!</h4>
                <p className="text-lg font-bold">درجتك النهائية: {examScore} / {activeExam.questions.length}</p>
                <button onClick={() => setActiveExam(null)} className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-6 py-2.5 rounded-xl font-bold text-xs">
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