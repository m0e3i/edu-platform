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
    <div className={`min-h-screen font-sans relative transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`} dir="rtl">
      
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm border border-indigo-500">
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <header className={`border-b sticky top-0 z-45 shadow-sm transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-black tracking-wide cursor-pointer flex items-center gap-2" onClick={() => setActiveTab('home')}>
            <span className="bg-indigo-600 text-white px-2.5 py-1 rounded-xl text-sm sm:text-base shadow-sm">EDU</span>
            <span className={darkMode ? 'text-white' : 'text-slate-900'}>BEDAYA</span>
          </div>

          <nav className="hidden md:flex gap-6 font-semibold text-xs sm:text-sm items-center">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:text-indigo-500 transition'}>الرئيسية</button>
            <button onClick={() => setActiveTab('stages')} className={activeTab === 'stages' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:text-indigo-500 transition'}>المراحل والصفوف</button>
            <button onClick={() => setActiveTab('courses')} className={activeTab === 'courses' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:text-indigo-500 transition'}>الكورسات والملفات والامتحانات</button>
            {isLoggedIn && (userRole === 'instructor' || userRole === 'admin') && (
              <button onClick={() => setActiveTab('instructor-dashboard')} className={activeTab === 'instructor-dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:text-indigo-500 transition'}>لوحة المحتوى وسجل الدرجات</button>
            )}
            {isLoggedIn && userRole === 'admin' && (
              <button onClick={() => setActiveTab('admin-dashboard')} className={activeTab === 'admin-dashboard' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-500 transition'}>لوحة إدارة الأدمن والمستخدمين</button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-400 transition shadow-sm">
              {darkMode ? '☀️ وضع نهار' : '🌙 وضع ليل'}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 px-3 py-1.5 rounded-full font-bold border border-indigo-200 dark:border-indigo-500/30">
                  {userName} ({userRole === 'admin' ? 'مدير' : userRole === 'instructor' ? 'معلم' : 'طالب'})
                </span>
                <button onClick={handleLogout} className="bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 text-xs px-3 py-1.5 rounded-xl font-bold border border-rose-200 dark:border-rose-500/30 transition hover:bg-rose-100">خروج</button>
              </div>
            ) : (
              <button onClick={() => setActiveTab('auth')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-sm transition">
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
            <div className={`rounded-3xl p-10 sm:p-14 border shadow-sm transition-colors ${darkMode ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700 text-slate-100' : 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-indigo-800'}`}>
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight">منصة BEDAYA EDU التعليمية الذكية</h1>
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">اختر مرحلتك وصّفك الدراسي لتظهر لك حصرياً المواد، الكورسات، الفيديوهات، ملفات الـ PDF، والامتحانات الذكية الخاصة بك فقط.</p>
              
              <div className="flex justify-center gap-4 flex-wrap">
                <button onClick={() => setActiveTab('stages')} className="bg-white text-indigo-950 hover:bg-slate-100 px-6 py-3 rounded-xl font-bold shadow-sm transition">
                  تصفح المراحل والصفوف التعليمية
                </button>
                <button onClick={() => setActiveTab('courses')} className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 rounded-xl font-bold shadow-sm transition">
                  تصفح كافة الكورسات والملفات
                </button>
                {isLoggedIn && (userRole === 'instructor' || userRole === 'admin') && (
                  <button onClick={() => setActiveTab('instructor-dashboard')} className="bg-indigo-800 hover:bg-indigo-900 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition border border-indigo-600">
                    لوحة التحكم (إضافة كورسات وامتحانات)
                  </button>
                )}
                {isLoggedIn && userRole === 'admin' && (
                  <button onClick={() => setActiveTab('admin-dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition">
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
                    <h3 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">{stage.name}</h3>
                    <ul className="space-y-2.5 mb-6">
                      {stage.grades.map(grade => (
                        <li key={grade.id} className="text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
                          <span className="font-medium">{grade.name}</span>
                          <button 
                            onClick={() => { setSelectedGradeForCourses(grade.id); setActiveTab('courses'); }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition"
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
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/30">
                          {course.category}
                        </span>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{course.price}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">المعلم: {course.instructor}</p>
                      <p className="text-xs mb-6 opacity-80 leading-relaxed">{course.description}</p>

                      {/* LESSONS LIST */}
                      <div className="space-y-2 mb-4">
                        <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">الدروس المرئية:</h4>
                        {course.lessons && course.lessons.length > 0 ? (
                          course.lessons.map((lesson: any) => (
                            <div key={lesson.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold">{lesson.title}</span>
                                <span className="text-[10px] opacity-70">{lesson.duration}</span>
                              </div>
                              <video controls className="w-full rounded-xl max-h-48 bg-black">
                                <source src={lesson.videoUrl} type="video/mp4" />
                                متصفحك لا يدعم عرض الفيديو
                              </video>
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] opacity-60">لا توجد دروس مرئية مضافة بعد.</p>
                        )}
                      </div>

                      {/* PDF FILES */}
                      <div className="space-y-2 mb-4">
                        <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">ملفات الـ PDF والملخصات:</h4>
                        {course.pdfs && course.pdfs.length > 0 ? (
                          course.pdfs.map((pdf: any) => (
                            <a key={pdf.id} href={pdf.url} target="_blank" rel="noreferrer" className="block p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs font-bold text-blue-700 dark:text-blue-300 hover:underline">
                              📄 {pdf.title} (فتح الملف)
                            </a>
                          ))
                        ) : (
                          <p className="text-[11px] opacity-60">لا توجد ملفات PDF مرفقة.</p>
                        )}
                      </div>

                      {/* EXAM BUTTON */}
                      {course.exam && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                          <button onClick={() => startExam(course.exam)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition">
                            📝 دخول امتحان الذكاء المرتبط بالكورس: {course.exam.title}
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
          <div className="max-w-md mx-auto space-y-6">
            <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${authMode === 'login' ? 'bg-indigo-600 text-white shadow-sm' : 'opacity-70'}`}>تسجيل الدخول</button>
                <button onClick={() => setAuthMode('signup')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${authMode === 'signup' ? 'bg-indigo-600 text-white shadow-sm' : 'opacity-70'}`}>حساب جديد (طالب)</button>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">البريد الإلكتروني</label>
                    <input type="email" value={inputEmail} onChange={e => setInputEmail(e.target.value)} placeholder="example@edu.com" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">كلمة المرور</label>
                    <input type="password" value={inputPassword} onChange={e => setInputPassword(e.target.value)} placeholder="••••••••" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow-sm transition">دخول المنصة</button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">اسم الطالب الكامل</label>
                    <input type="text" value={inputName} onChange={e => setInputName(e.target.value)} placeholder="محمد أحمد" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">البريد الإلكتروني</label>
                    <input type="email" value={inputEmail} onChange={e => setInputEmail(e.target.value)} placeholder="student@edu.com" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">كلمة المرور</label>
                    <input type="password" value={inputPassword} onChange={e => setInputPassword(e.target.value)} placeholder="••••••••" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">رقم هاتفك الشخصي</label>
                    <input type="text" value={inputPhone} onChange={e => setInputPhone(e.target.value)} placeholder="01111111111" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">رقم هاتف ولي الأمر (إلزامي لمتابعة الدرجات)</label>
                    <input type="text" value={inputParentPhone} onChange={e => setUserParentPhone(e.target.value)} placeholder="01222222222" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">المرحلة الدراسية</label>
                    <select value={inputStage} onChange={e => { setInputStage(e.target.value); const firstG = educationalStages.find(s => s.id === e.target.value)?.grades[0]?.id || ''; setInputGrade(firstG); }} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs">
                      {educationalStages.map(s => <option key={s.id} value={s.id} className="dark:bg-slate-900">{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">الصف الدراسي</label>
                    <select value={inputGrade} onChange={e => setInputGrade(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs">
                      {currentAvailableGrades.map(g => <option key={g.id} value={g.id} className="dark:bg-slate-900">{g.name}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow-sm transition">إنشاء حساب وتسجيل الدخول</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* INSTRUCTOR DASHBOARD */}
        {activeTab === 'instructor-dashboard' && (isLoggedIn && (userRole === 'instructor' || userRole === 'admin')) && (
          <div className="space-y-10">
            <h2 className="text-2xl font-black">لوحة التحكم وإضافة المحتوى التعليمي والامتحانات</h2>

            {/* CREATE COURSE FORM */}
            <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-lg font-bold mb-6 text-indigo-600 dark:text-indigo-400">إنشاء كورس جديد وتخصيصه لصف معين</h3>
              <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">عنوان الكورس</label>
                  <input type="text" value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="مثال: كورس الفيزياء المتقدم" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">اسم المعلم</label>
                  <input type="text" value={newCourseInstructor} onChange={e => setNewCourseInstructor(e.target.value)} placeholder="أ/ أحمد محمد" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">المادة / التصنيف</label>
                  <input type="text" value={newCourseCategory} onChange={e => setNewCourseCategory(e.target.value)} placeholder="فيزياء" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">السعر</label>
                  <input type="text" value={newCoursePrice} onChange={e => setNewCoursePrice(e.target.value)} placeholder="مجاناً أو 150 ج.م" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">المرحلة الدراسية المستهدفة</label>
                  <select value={newCourseStage} onChange={e => { setNewCourseStage(e.target.value); const fg = educationalStages.find(s => s.id === e.target.value)?.grades[0]?.id || ''; setNewCourseGrade(fg); }} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs">
                    {educationalStages.map(s => <option key={s.id} value={s.id} className="dark:bg-slate-900">{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">الصف الدراسي المستهدف (يظهر لطلاب هذا الصف فقط)</label>
                  <select value={newCourseGrade} onChange={e => setNewCourseGrade(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs">
                    {targetGradesForNewCourse.map(g => <option key={g.id} value={g.id} className="dark:bg-slate-900">{g.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold mb-1">وصف الكورس</label>
                  <textarea value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} placeholder="تفاصيل المحتوى..." className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs h-24" />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-sm transition">نشر الكورس الجديد</button>
                </div>
              </form>
            </div>

            {/* ADD VIDEOS & PDFS */}
            <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-lg font-bold mb-6 text-indigo-600 dark:text-indigo-400">إضافة فيديوهات أو ملفات PDF لكورس قائم</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold mb-1">اختر الكورس المستهدف</label>
                  <select value={selectedCourseForContent} onChange={e => setSelectedCourseForContent(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs">
                    <option value="" className="dark:bg-slate-900">-- اختر الكورس --</option>
                    {courses.map(c => <option key={c.id} value={c.id} className="dark:bg-slate-900">{c.title} ({c.instructor})</option>)}
                  </select>
                </div>

                {/* VIDEO FORM */}
                <form onSubmit={handleAddVideoToCourse} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">إضافة درس فيديو</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">عنوان الدرس</label>
                      <input type="text" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="مثال: الدرس الثاني: قوانين النيوتن" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">مدة الفيديو</label>
                      <input type="text" value={newVideoDuration} onChange={e => setNewVideoDuration(e.target.value)} placeholder="20 دقيقة" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-4 mb-2 text-xs font-bold">
                      <label><input type="radio" name="vMethod" checked={videoAddMethod === 'file'} onChange={() => setVideoAddMethod('file')} /> رفع ملف فيديو من الجهاز</label>
                      <label><input type="radio" name="vMethod" checked={videoAddMethod === 'url'} onChange={() => setVideoAddMethod('url')} /> وضع رابط فيديو خارجي</label>
                    </div>
                    {videoAddMethod === 'file' ? (
                      <input type="file" accept="video/*" onChange={e => setNewVideoFile(e.target.files?.[0] || null)} className="text-xs" />
                    ) : (
                      <input type="text" value={newVideoUrlInput} onChange={e => setNewVideoUrlInput(e.target.value)} placeholder="https://..." className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                    )}
                  </div>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold text-xs transition">إضافة الفيديو للكورس</button>
                </form>

                {/* PDF FORM */}
                <form onSubmit={handleAddPdfToCourse} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">إضافة ملف PDF / مذكرة</h4>
                  <div>
                    <label className="block text-xs font-bold mb-1">عنوان الملف</label>
                    <input type="text" value={newPdfTitle} onChange={e => setNewPdfTitle(e.target.value)} placeholder="مذكرة الشرح والتدريبات" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                  </div>
                  <div>
                    <div className="flex gap-4 mb-2 text-xs font-bold">
                      <label><input type="radio" name="pMethod" checked={pdfAddMethod === 'file'} onChange={() => setPdfAddMethod('file')} /> رفع ملف PDF من الجهاز</label>
                      <label><input type="radio" name="pMethod" checked={pdfAddMethod === 'url'} onChange={() => setPdfAddMethod('url')} /> وضع رابط ملف خارجي</label>
                    </div>
                    {pdfAddMethod === 'file' ? (
                      <input type="file" accept="application/pdf" onChange={e => setNewPdfFile(e.target.files?.[0] || null)} className="text-xs" />
                    ) : (
                      <input type="text" value={newPdfUrlInput} onChange={e => setNewPdfUrlInput(e.target.value)} placeholder="https://..." className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                    )}
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold text-xs transition">إضافة ملف الـ PDF للكورس</button>
                </form>
              </div>
            </div>

            {/* CREATE SMART EXAM FORM */}
            <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-lg font-bold mb-6 text-indigo-600 dark:text-indigo-400">إنشاء ونشر امتحان ذكي مع منع الغش التلقائي</h3>
              <form onSubmit={handleCreateExam} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold mb-1">اختر الكورس لإرباط الامتحان به</label>
                  <select value={examCourseTarget} onChange={e => setExamCourseTarget(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs">
                    <option value="" className="dark:bg-slate-900">-- اختر الكورس --</option>
                    {courses.map(c => <option key={c.id} value={c.id} className="dark:bg-slate-900">{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">عنوان الامتحان</label>
                  <input type="text" value={examTitle} onChange={e => setExamTitle(e.target.value)} placeholder="امتحان الفصل الأول التجريبي" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">أسئلة الاختيار من متعدد:</h4>
                  {examQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div>
                        <label className="block text-xs font-bold mb-1">السؤال {qIdx + 1}</label>
                        <input type="text" value={q.question} onChange={e => {
                          const updated = [...examQuestions];
                          updated[qIdx].question = e.target.value;
                          setExamQuestions(updated);
                        }} placeholder="نص السؤال..." className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt: string, optIdx: number) => (
                          <input key={optIdx} type="text" value={opt} onChange={e => {
                            const updated = [...examQuestions];
                            updated[qIdx].options[optIdx] = e.target.value;
                            setExamQuestions(updated);
                          }} placeholder={`الاختيار ${optIdx + 1}`} className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                        ))}
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">رقم الإجابة الصحيحة (0 للاول، 1 للثاني، إلخ)</label>
                        <input type="number" min="0" max="3" value={q.correctAnswer} onChange={e => {
                          const updated = [...examQuestions];
                          updated[qIdx].correctAnswer = Number(e.target.value);
                          setExamQuestions(updated);
                        }} className="w-24 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddExamQuestion} className="bg-slate-200 dark:bg-slate-800 text-xs px-4 py-2 rounded-xl font-bold transition">➕ إضافة سؤال آخر</button>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow-sm transition">نشر الامتحان الذكي فوراً</button>
              </form>
            </div>

            {/* EXAM RESULTS LOG */}
            <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">سجل درجات الطلاب والإنذارات (متابع لولي الأمر)</h3>
                {examResultsLog.length > 0 && (
                  <button onClick={handleClearAllExamResults} className="bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 text-xs px-3 py-1.5 rounded-xl font-bold border border-rose-200 dark:border-rose-900 transition">مسح كافة السجلات</button>
                )}
              </div>

              {examResultsLog.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 opacity-70">
                        <th className="p-3">اسم الطالب</th>
                        <th className="p-3">هاتف الطالب</th>
                        <th className="p-3">هاتف ولي الأمر</th>
                        <th className="p-3">امتحان</th>
                        <th className="p-3">الدرجة</th>
                        <th className="p-3">إنذارات الغش</th>
                        <th className="p-3">الوقت المستغرق</th>
                        <th className="p-3">التاريخ</th>
                        <th className="p-3">إجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {examResultsLog.map(rec => (
                        <tr key={rec.id}>
                          <td className="p-3 font-bold">{rec.studentName}</td>
                          <td className="p-3">{rec.studentPhone}</td>
                          <td className="p-3 text-indigo-600 dark:text-indigo-400 font-bold">{rec.parentPhone}</td>
                          <td className="p-3">{rec.examTitle}</td>
                          <td className="p-3 font-bold text-emerald-600">{rec.score} / {rec.total}</td>
                          <td className="p-3 font-bold text-rose-600">{rec.warnings}</td>
                          <td className="p-3">{rec.duration}</td>
                          <td className="p-3 opacity-70">{rec.date}</td>
                          <td className="p-3">
                            <button onClick={() => handleDeleteSingleExamResult(rec.id)} className="text-rose-500 hover:underline font-bold">حذف</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs opacity-60">لا توجد سجلات درجات حتى الآن.</p>
              )}
            </div>
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {activeTab === 'admin-dashboard' && (isLoggedIn && userRole === 'admin') && (
          <div className="space-y-10">
            <h2 className="text-2xl font-black">لوحة تحكم الأدمن الرئيسي وإدارة المستخدمين</h2>

            {/* CREATE TEACHER */}
            <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-lg font-bold mb-6 text-blue-600 dark:text-blue-400">إنشاء حساب معلم جديد وتفعيله</h3>
              <form onSubmit={handleAdminCreateTeacher} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">اسم المعلم</label>
                  <input type="text" value={newTeacherName} onChange={e => setNewTeacherName(e.target.value)} placeholder="أ/ محمود سعيد" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">البريد الإلكتروني</label>
                  <input type="email" value={newTeacherEmail} onChange={e => setNewTeacherEmail(e.target.value)} placeholder="teacher@edu.com" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">كلمة المرور</label>
                  <input type="password" value={newTeacherPassword} onChange={e => setNewTeacherPassword(e.target.value)} placeholder="••••••••" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">رقم الهاتف</label>
                  <input type="text" value={newTeacherPhone} onChange={e => setNewTeacherPhone(e.target.value)} placeholder="01000000000" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs" />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-sm transition">إنشاء وتفعيل حساب المعلم</button>
                </div>
              </form>
            </div>

            {/* USERS MANAGEMENT */}
            <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-lg font-bold mb-6 text-blue-600 dark:text-blue-400">إدارة مستخدمي المنصة (تفعيل / تعطيل / حذف)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 opacity-70">
                      <th className="p-3">الاسم</th>
                      <th className="p-3">البريد</th>
                      <th className="p-3">الدور</th>
                      <th className="p-3">الهاتف</th>
                      <th className="p-3">ولي الأمر</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {usersList.map((u, i) => (
                      <tr key={i}>
                        <td className="p-3 font-bold">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${u.role === 'admin' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : u.role === 'instructor' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                            {u.role === 'admin' ? 'مدير' : u.role === 'instructor' ? 'معلم' : 'طالب'}
                          </span>
                        </td>
                        <td className="p-3">{u.phone || 'N/A'}</td>
                        <td className="p-3">{u.parentPhone || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`font-bold ${u.status === 'suspended' ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {u.status === 'suspended' ? 'معطل' : 'مفعل'}
                          </span>
                        </td>
                        <td className="p-3 flex gap-3">
                          {u.email !== '250iie3@gmail.com' && (
                            <>
                              <button onClick={() => handleToggleUserStatus(u.email)} className="font-bold text-amber-500 hover:underline">
                                {u.status === 'suspended' ? 'تفعيل' : 'تعطيل'}
                              </button>
                              <button onClick={() => handleDeleteUser(u.email)} className="font-bold text-rose-500 hover:underline">حذف</button>
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

        {/* ACTIVE EXAM MODAL */}
        {activeExam && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`max-w-2xl w-full p-8 rounded-3xl border shadow-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400">📝 {activeExam.title}</h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                  ⚠️ إنذارات الغش: {cheatingWarnings} / 3
                </span>
              </div>

              {!examSubmitted ? (
                <div className="space-y-6">
                  {activeExam.questions.map((q: any, qIdx: number) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                      <p className="text-sm font-bold">{qIdx + 1}. {q.question}</p>
                      <div className="grid grid-cols-1 gap-2">
                        {q.options.map((opt: string, optIdx: number) => (
                          <label key={optIdx} className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition flex items-center gap-3 ${examAnswers[qIdx] === optIdx ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            <input type="radio" name={`question-${qIdx}`} checked={examAnswers[qIdx] === optIdx} onChange={() => setExamAnswers({ ...examAnswers, [qIdx]: optIdx })} className="hidden" />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={submitExam} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow-sm transition">تسليم الامتحان وإنهاء المحاولة</button>
                </div>
              ) : (
                <div className="space-y-6 text-center py-8">
                  <h4 className="text-3xl font-black">نتيجة الامتحان</h4>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">لقد حصلت على: {examScore} من {activeExam.questions.length}</p>
                  <button onClick={() => setActiveExam(null)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-xs transition">إغلاق النافذة والعودة</button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}