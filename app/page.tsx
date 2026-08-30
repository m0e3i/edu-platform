'use client';
import { useState, useEffect } from 'react';

export default function EduPlatform() {
  // 6- تم جعل الوضع الافتراضي للوضع الفاتح الأنيق (Light Mode)
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

  // 2- تحديث الصفوف بناءً على المرحلة المختارة في التسجيل
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
  
  // 4- دعم إضافة الفيديوهات والملفات (من الجهاز أو عبر الروابط)
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

  // 3- ميزة حذف سجل درجات الطلاب (حذف سجل بالكامل أو عنصر واحد)
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

  // 2- تسجيل حساب طالب جديد وتخزين مرحلته وصفه الدراسي بدقة
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

  // 5- ميزة تعطيل وتفعيل الحسابات وحذفها نهائياً من لوحة الأدمن
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

  // 1- التأكد من إسناد الصف الدراسي بدقة للكورس ليظهر فوراً للطالب
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

  // 4- ميزة إضافة الفيديوهات (من الجهاز أو عبر الروابط المباشرة)
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

  // 4- ميزة إضافة ملفات الـ PDF (من الجهاز أو عبر الروابط المباشرة)
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
    <div className={`min-h-screen font-sans relative transition-colors duration-300 ${darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f8fafc] text-slate-800'}`} dir="rtl">
      
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm border border-indigo-400">
          {toastMessage}
        </div>
      )}

      {/* HEADER - 6: ألوان فاتحة ومريحة وهادئة */}
      <header className={`border-b sticky top-0 z-45 shadow-sm ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-black tracking-wide cursor-pointer flex items-center gap-1.5" onClick={() => setActiveTab('home')}>
            <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-lg text-sm sm:text-base">EDU</span>
            <span className={darkMode ? 'text-white' : 'text-slate-800'}>BEDAYA</span>
          </div>

          <nav className="hidden md:flex gap-6 font-semibold text-xs sm:text-sm items-center">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-indigo-600 font-bold' : 'hover:text-indigo-500'}>الرئيسية</button>
            <button onClick={() => setActiveTab('stages')} className={activeTab === 'stages' ? 'text-indigo-600 font-bold' : 'hover:text-indigo-500'}>المراحل والصفوف</button>
            <button onClick={() => setActiveTab('courses')} className={activeTab === 'courses' ? 'text-indigo-600 font-bold' : 'hover:text-indigo-500'}>الكورسات والملفات والامتحانات</button>
            {isLoggedIn && (userRole === 'instructor' || userRole === 'admin') && (
              <button onClick={() => setActiveTab('instructor-dashboard')} className={activeTab === 'instructor-dashboard' ? 'text-amber-600 font-bold' : 'hover:text-amber-500'}>لوحة المحتوى وسجل الدرجات</button>
            )}
            {isLoggedIn && userRole === 'admin' && (
              <button onClick={() => setActiveTab('admin-dashboard')} className={activeTab === 'admin-dashboard' ? 'text-emerald-600 font-bold' : 'hover:text-emerald-500'}>لوحة إدارة الأدمن والمستخدمين</button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400">
              {darkMode ? '☀️ نهار' : '🌙 ليل'}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 px-3 py-1.5 rounded-full font-bold border border-indigo-200 dark:border-indigo-500/30">
                  {userName} ({userRole === 'admin' ? 'مدير' : userRole === 'instructor' ? 'معلم' : 'طالب'})
                </span>
                <button onClick={handleLogout} className="bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 text-xs px-3 py-1.5 rounded-xl font-bold border border-rose-200 dark:border-rose-500/30">خروج</button>
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
            <div className={`rounded-3xl p-10 sm:p-14 border shadow-sm ${darkMode ? 'bg-gradient-to-r from-indigo-950 to-slate-900 border-indigo-800' : 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-indigo-500'}`}>
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">منصة BEDAYA EDU التعليمية الذكية</h1>
              <p className="text-sm sm:text-lg mb-8 max-w-2xl mx-auto opacity-95">اختر مرحلتك وصّفك الدراسي لتظهر لك حصرياً المواد، الكورسات، الفيديوهات، ملفات الـ PDF، والامتحانات الذكية الخاصة بك فقط.</p>
              
              <div className="flex justify-center gap-4 flex-wrap">
                <button onClick={() => setActiveTab('stages')} className="bg-white text-indigo-700 hover:bg-slate-100 px-6 py-3 rounded-xl font-bold shadow transition">
                  تصفح المراحل والصفوف التعليمية
                </button>
                <button onClick={() => setActiveTab('courses')} className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 rounded-xl font-bold shadow transition">
                  تصفح كافة الكورسات والملفات
                </button>
                {isLoggedIn && (userRole === 'instructor' || userRole === 'admin') && (
                  <button onClick={() => setActiveTab('instructor-dashboard')} className="bg-indigo-800 hover:bg-indigo-900 text-white px-6 py-3 rounded-xl font-bold shadow transition">
                    لوحة التحكم (إضافة كورسات وامتحانات)
                  </button>
                )}
                {isLoggedIn && userRole === 'admin' && (
                  <button onClick={() => setActiveTab('admin-dashboard')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow transition">
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
                <div key={stage.id} className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">{stage.name}</h3>
                    <ul className="space-y-2 mb-6">
                      {stage.grades.map(grade => (
                        <li key={grade.id} className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
                          <span className="font-medium">{grade.name}</span>
                          <button 
                            onClick={() => { setSelectedGradeForCourses(grade.id); setActiveTab('courses'); }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold"
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
                <button onClick={() => setSelectedGradeForCourses(null)} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white text-xs px-3 py-1.5 rounded-xl font-bold">
                  إلغاء فلترة الصف وعرض الكل
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter(c => {
                  // 2- إذا كان الطالب مسجل دخول، تظهر له فقط الكورسات الخاصة بصفه الذي اختاره عند التسجيل
                  if (isLoggedIn && userRole === 'student') {
                    return c.grade === userGrade;
                  }
                  if (selectedGradeForCourses) {
                    return c.grade === selectedGradeForCourses;
                  }
                  return true;
                })
                .map(course => (
                  <div key={course.id} className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 px-2.5 py-1 rounded-lg font-bold">{course.category}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{course.price}</span>
                      </div>
                      <h3 className="text-base font-extrabold mb-2">{course.title}</h3>
                      <p className="text-xs opacity-75 mb-2">المعلم: {course.instructor}</p>
                      <p className="text-xs mb-6 opacity-90 line-clamp-2">{course.description}</p>

                      <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                        {/* الفيديوهات */}
                        <div>
                          <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">الفيديوهات التعليمية:</h4>
                          {course.lessons && course.lessons.length > 0 ? (
                            course.lessons.map((lesson: any) => (
                              <div key={lesson.id} className="mb-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between text-xs font-bold mb-2">
                                  <span>{lesson.title}</span>
                                  <span className="opacity-70 text-[10px]">{lesson.duration}</span>
                                </div>
                                {lesson.videoUrl.startsWith('http') && !lesson.videoUrl.includes('blob') ? (
                                  <div className="mb-2">
                                    <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-xl font-bold inline-block">
                                      مشاهدة فيديو الرابط الخارجي ↗
                                    </a>
                                  </div>
                                ) : (
                                  <video controls className="w-full rounded-xl max-h-40 bg-black">
                                    <source src={lesson.videoUrl} type="video/mp4" />
                                    متصفحك لا يدعم عرض الفيديو
                                  </video>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] opacity-60">لا توجد فيديوهات مضافة بعد.</p>
                          )}
                        </div>

                        {/* ملفات الـ PDF */}
                        <div>
                          <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">ملفات الـ PDF والملخصات:</h4>
                          {course.pdfs && course.pdfs.length > 0 ? (
                            course.pdfs.map((pdf: any) => (
                              <div key={pdf.id} className="mb-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <span className="text-xs font-bold">{pdf.title}</span>
                                <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] px-3 py-1 rounded-lg font-bold">
                                  تحميل / فتح PDF
                                </a>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] opacity-60">لا توجد ملفات PDF مضافة بعد.</p>
                          )}
                        </div>

                        {/* الامتحان التفاعلي */}
                        {course.exam && (
                          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 mt-4">
                            <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1">امتحان ذكي متاح: {course.exam.title}</h4>
                            <p className="text-[10px] opacity-80 mb-3">يتضمن نظام مراقبة الغش الذكي (يحذر عند مغادرة النافذة)</p>
                            {isLoggedIn ? (
                              <button onClick={() => startExam(course.exam)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-bold shadow">
                                بدء الامتحان الآن
                              </button>
                            ) : (
                              <p className="text-[11px] text-rose-500 font-bold">يرجى تسجيل الدخول لبدء الامتحان</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* INSTRUCTOR / ADMIN CONTENT DASHBOARD & EXAM LOGS */}
        {activeTab === 'instructor-dashboard' && (
          <div className="space-y-10">
            <h2 className="text-2xl font-black">لوحة تحكم المعلم (إضافة المحتوى، الفيديوهات، الـ PDF، والامتحانات وسجل الدرجات)</h2>
            
            {/* نموذج إضافة كورس جديد */}
            <div className={`p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">إضافة كورس تعليمي جديد وتخصيصه لمرحلة وصف معين</h3>
              <form onSubmit={handleCreateCourse} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="عنوان الكورس (مثال: أحياء ثالث ثانوي)" value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs" required />
                <input type="text" placeholder="اسم المعلم" value={newCourseInstructor} onChange={e => setNewCourseInstructor(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs" required />
                <input type="text" placeholder="التصنيف (مثال: علوم)" value={newCourseCategory} onChange={e => setNewCourseCategory(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs" />
                <select value={newCoursePrice} onChange={e => setNewCoursePrice(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs">
                  <option value="مجاناً">مجاناً</option>
                  <option value="مدفوع">مدفوع</option>
                </select>

                <select value={newCourseStage} onChange={e => { setNewCourseStage(e.target.value); const grades = educationalStages.find(s => s.id === e.target.value)?.grades; if(grades) setNewCourseGrade(grades[0].id); }} className="p-3 rounded-xl border bg-transparent text-xs">
                  {educationalStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                <select value={newCourseGrade} onChange={e => setNewCourseGrade(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs">
                  {targetGradesForNewCourse.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>

                <textarea placeholder="وصف موجز عن الكورس..." value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs sm:col-span-2" rows={2} />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl text-xs font-bold sm:col-span-2">حفظ ونشر الكورس للمرحلة والصف المختار</button>
              </form>
            </div>

            {/* 4- إضافة الفيديوهات (من الجهاز أو عبر الروابط) */}
            <div className={`p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">إضافة فيديو للكورس (من الجهاز أو عبر رابط مباشر)</h3>
              <form onSubmit={handleAddVideoToCourse} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select value={selectedCourseForContent} onChange={e => setSelectedCourseForContent(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs sm:col-span-2" required>
                  <option value="">اختر الكورس المستهدف...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.grade})</option>)}
                </select>
                <input type="text" placeholder="عنوان الدرس (مثال: الدرس الأول: الخلية)" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs" required />
                <input type="text" placeholder="مدة الفيديو (مثال: 15 دقيقة)" value={newVideoDuration} onChange={e => setNewVideoDuration(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs" />

                <div className="sm:col-span-2 flex gap-4 items-center">
                  <label className="text-xs font-bold">طريقة الإضافة:</label>
                  <label className="text-xs flex items-center gap-1 cursor-pointer"><input type="radio" name="vidMethod" checked={videoAddMethod === 'file'} onChange={() => setVideoAddMethod('file')} /> من الجهاز</label>
                  <label className="text-xs flex items-center gap-1 cursor-pointer"><input type="radio" name="vidMethod" checked={videoAddMethod === 'url'} onChange={() => setVideoAddMethod('url')} /> عبر رابط (URL)</label>
                </div>

                {videoAddMethod === 'file' ? (
                  <div className="sm:col-span-2">
                    <label className="text-xs block mb-1 opacity-80">اختر ملف الفيديو من جهازك:</label>
                    <input type="file" accept="video/*" onChange={e => e.target.files && setNewVideoFile(e.target.files[0])} className="p-2 border rounded-xl w-full text-xs" />
                  </div>
                ) : (
                  <input type="url" placeholder="ضع رابط الفيديو هنا (مثل رابط يوتيوب أو سيرفر خارجي)" value={newVideoUrlInput} onChange={e => setNewVideoUrlInput(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs sm:col-span-2" />
                )}

                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl text-xs font-bold sm:col-span-2">إضافة الفيديو للكورس</button>
              </form>
            </div>

            {/* 4- إضافة ملفات الـ PDF (من الجهاز أو عبر الروابط) */}
            <div className={`p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">إضافة ملف PDF / ملخص للكورس (من الجهاز أو عبر رابط مباشر)</h3>
              <form onSubmit={handleAddPdfToCourse} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select value={selectedCourseForContent} onChange={e => setSelectedCourseForContent(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs sm:col-span-2" required>
                  <option value="">اختر الكورس المستهدف...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.grade})</option>)}
                </select>
                <input type="text" placeholder="عنوان الملف (مثال: ملخص الباب الأول PDF)" value={newPdfTitle} onChange={e => setNewPdfTitle(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs sm:col-span-2" required />

                <div className="sm:col-span-2 flex gap-4 items-center">
                  <label className="text-xs font-bold">طريقة الإضافة:</label>
                  <label className="text-xs flex items-center gap-1 cursor-pointer"><input type="radio" name="pdfMethod" checked={pdfAddMethod === 'file'} onChange={() => setPdfAddMethod('file')} /> من الجهاز</label>
                  <label className="text-xs flex items-center gap-1 cursor-pointer"><input type="radio" name="pdfMethod" checked={pdfAddMethod === 'url'} onChange={() => setPdfAddMethod('url')} /> عبر رابط (URL)</label>
                </div>

                {pdfAddMethod === 'file' ? (
                  <div className="sm:col-span-2">
                    <label className="text-xs block mb-1 opacity-80">اختر ملف الـ PDF من جهازك:</label>
                    <input type="file" accept="application/pdf" onChange={e => e.target.files && setNewPdfFile(e.target.files[0])} className="p-2 border rounded-xl w-full text-xs" />
                  </div>
                ) : (
                  <input type="url" placeholder="ضع رابط ملف الـ PDF هنا" value={newPdfUrlInput} onChange={e => setNewPdfUrlInput(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs sm:col-span-2" />
                )}

                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl text-xs font-bold sm:col-span-2">إضافة ملف الـ PDF للكورس</button>
              </form>
            </div>

            {/* إنشاء امتحان ذكي */}
            <div className={`p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">إنشاء ونشر امتحان ذكي لكورس</h3>
              <form onSubmit={handleCreateExam} className="space-y-4">
                <select value={examCourseTarget} onChange={e => setExamCourseTarget(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs w-full" required>
                  <option value="">اختر الكورس لإلحاق الامتحان به...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.grade})</option>)}
                </select>
                <input type="text" placeholder="عنوان الامتحان (مثال: امتحان شامل على الفصل الأول)" value={examTitle} onChange={e => setExamTitle(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs w-full" required />

                <div className="space-y-4 border-t pt-4">
                  {examQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border space-y-3">
                      <input type="text" placeholder={`نص السؤال رقم ${qIdx + 1}`} value={q.question} onChange={e => {
                        const updated = [...examQuestions];
                        updated[qIdx].question = e.target.value;
                        setExamQuestions(updated);
                      }} className="p-2.5 rounded-xl border bg-transparent text-xs w-full" required />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt: string, oIdx: number) => (
                          <input key={oIdx} type="text" placeholder={`الخيار ${oIdx + 1}`} value={opt} onChange={e => {
                            const updated = [...examQuestions];
                            updated[qIdx].options[oIdx] = e.target.value;
                            setExamQuestions(updated);
                          }} className="p-2 rounded-xl border bg-transparent text-xs" required />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold">الإجابة الصحيحة:</label>
                        <select value={q.correctAnswer} onChange={e => {
                          const updated = [...examQuestions];
                          updated[qIdx].correctAnswer = Number(e.target.value);
                          setExamQuestions(updated);
                        }} className="p-2 rounded-xl border bg-transparent text-xs">
                          <option value={0}>الخيار 1</option>
                          <option value={1}>الخيار 2</option>
                          <option value={2}>الخيار 3</option>
                          <option value={3}>الخيار 4</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddExamQuestion} className="bg-slate-200 dark:bg-slate-700 text-xs px-4 py-2 rounded-xl font-bold">+ إضافة سؤال جديد</button>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl text-xs font-bold">نشر الامتحان للطلاب</button>
              </form>
            </div>

            {/* 3- سجل درجات الطلاب مع ميزة الحذف */}
            <div className={`p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">سجل درجات وحل الامتحانات للطلاب</h3>
                {examResultsLog.length > 0 && (
                  <button onClick={handleClearAllExamResults} className="bg-rose-600 text-white text-xs px-3 py-1.5 rounded-xl font-bold hover:bg-rose-500">
                    حذف سجل الدرجات بالكامل
                  </button>
                )}
              </div>

              {examResultsLog.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b dark:border-slate-800 opacity-80">
                        <th className="p-3">اسم الطالب</th>
                        <th className="p-3">الهاتف / ولي الأمر</th>
                        <th className="p-3">اسم الامتحان</th>
                        <th className="p-3">الدرجة</th>
                        <th className="p-3">إنذارات الغش</th>
                        <th className="p-3">الوقت المستغرق</th>
                        <th className="p-3">التاريخ</th>
                        <th className="p-3">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examResultsLog.map((res: any) => (
                        <tr key={res.id} className="border-b dark:border-slate-800/60">
                          <td className="p-3 font-bold">{res.studentName}</td>
                          <td className="p-3">{res.studentPhone} / {res.parentPhone}</td>
                          <td className="p-3">{res.examTitle}</td>
                          <td className="p-3 font-bold text-emerald-600">{res.score} / {res.total}</td>
                          <td className="p-3 text-rose-500">{res.warnings} إنذارات</td>
                          <td className="p-3">{res.duration}</td>
                          <td className="p-3 opacity-70">{res.date}</td>
                          <td className="p-3">
                            <button onClick={() => handleDeleteSingleExamResult(res.id)} className="bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition">
                              حذف السجل
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs opacity-60">لا توجد سجلات لدرجات الطلاب حتى الآن.</p>
              )}
            </div>

          </div>
        )}

        {/* 5- ADMIN DASHBOARD: إدارة المستخدمين (معرفة من عمل حساب، تعطيله، أو حذفه) */}
        {activeTab === 'admin-dashboard' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-black">لوحة تحكم الأدمن (إدارة كافة مستخدمي المنصة)</h2>
            
            <div className={`p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-lg font-bold mb-4 text-emerald-600 dark:text-emerald-400">إضافة حساب معلم جديد مباشرة من الأدمن</h3>
              <form onSubmit={handleAdminCreateTeacher} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="اسم المعلم" value={newTeacherName} onChange={e => setNewTeacherName(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs" required />
                <input type="email" placeholder="البريد الإلكتروني للمعلم" value={newTeacherEmail} onChange={e => setNewTeacherEmail(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs" required />
                <input type="password" placeholder="كلمة المرور" value={newTeacherPassword} onChange={e => setNewTeacherPassword(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs" required />
                <input type="text" placeholder="رقم الهاتف" value={newTeacherPhone} onChange={e => setNewTeacherPhone(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs" />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl text-xs font-bold sm:col-span-2">إنشاء وتفعيل حساب المعلم</button>
              </form>
            </div>

            <div className={`p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">قائمة كافة المستخدمين المسجلين على المنصة (الطلاب والمعلمين والأدمن)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b dark:border-slate-800 opacity-80">
                      <th className="p-3">الاسم</th>
                      <th className="p-3">البريد الإلكتروني</th>
                      <th className="p-3">نوع الحساب</th>
                      <th className="p-3">الهاتف</th>
                      <th className="p-3">هاتف ولي الأمر</th>
                      <th className="p-3">حالة الحساب</th>
                      <th className="p-3">الإجراءات (تعطيل / حذف)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u: any, idx: number) => (
                      <tr key={idx} className="border-b dark:border-slate-800/60">
                        <td className="p-3 font-bold">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'instructor' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {u.role === 'admin' ? 'مدير' : u.role === 'instructor' ? 'معلم' : 'طالب'}
                          </span>
                        </td>
                        <td className="p-3">{u.phone || 'N/A'}</td>
                        <td className="p-3">{u.parentPhone || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'suspended' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {u.status === 'suspended' ? 'معطل' : 'نشط'}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          <button onClick={() => handleToggleUserStatus(u.email)} className="bg-amber-500/20 text-amber-600 hover:bg-amber-500 hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition">
                            {u.status === 'suspended' ? 'تفعيل' : 'تعطيل'}
                          </button>
                          <button onClick={() => handleDeleteUser(u.email)} className="bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition">
                            حذف نهائي
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* AUTH TAB: 2- تسجيل دخول أو إنشاء حساب مع تحديد المرحلة والصف */}
        {activeTab === 'auth' && (
          <div className="max-w-md mx-auto p-8 rounded-3xl border shadow-sm bg-white dark:bg-slate-900">
            <div className="flex justify-center mb-6 gap-4">
              <button onClick={() => setAuthMode('login')} className={`pb-2 font-bold text-sm border-b-2 ${authMode === 'login' ? 'border-indigo-600 text-indigo-600' : 'border-transparent opacity-60'}`}>تسجيل الدخول</button>
              <button onClick={() => setAuthMode('signup')} className={`pb-2 font-bold text-sm border-b-2 ${authMode === 'signup' ? 'border-indigo-600 text-indigo-600' : 'border-transparent opacity-60'}`}>إنشاء حساب طالب جديد</button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <input type="email" placeholder="البريد الإلكتروني" value={inputEmail} onChange={e => setInputEmail(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs w-full" required />
                <input type="password" placeholder="كلمة المرور" value={inputPassword} onChange={e => setInputPassword(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs w-full" required />
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl text-xs font-bold shadow">دخول للمنصة</button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <input type="text" placeholder="الاسم الكامل" value={inputName} onChange={e => setInputName(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs w-full" required />
                <input type="email" placeholder="البريد الإلكتروني" value={inputEmail} onChange={e => setInputEmail(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs w-full" required />
                <input type="password" placeholder="كلمة المرور" value={inputPassword} onChange={e => setInputPassword(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs w-full" required />
                <input type="text" placeholder="رقم هاتفك الشخصي" value={inputPhone} onChange={e => setInputPhone(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs w-full" required />
                <input type="text" placeholder="رقم هاتف ولي الأمر (إلزامي)" value={inputParentPhone} onChange={e => setInputParentPhone(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs w-full" required />

                <div>
                  <label className="text-xs font-bold block mb-1">المرحلة الدراسية:</label>
                  <select value={inputStage} onChange={e => { setInputStage(e.target.value); const grades = educationalStages.find(s => s.id === e.target.value)?.grades; if(grades) setInputGrade(grades[0].id); }} className="p-3 rounded-xl border bg-transparent text-xs w-full">
                    {educationalStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">الصف الدراسي (ستظهر لك محتوياته فقط):</label>
                  <select value={inputGrade} onChange={e => setInputGrade(e.target.value)} className="p-3 rounded-xl border bg-transparent text-xs w-full">
                    {currentAvailableGrades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl text-xs font-bold shadow">إنشاء الحساب وبدء الدراسة</button>
              </form>
            )}
          </div>
        )}

      </main>

      {/* نافذة الامتحان التفاعلي مع منع الغش */}
      {activeExam && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{activeExam.title}</h3>
              <span className="text-xs bg-rose-100 text-rose-600 px-3 py-1 rounded-full font-bold">⚠️ نظام مراقبة الغش نشط</span>
            </div>

            {!examSubmitted ? (
              <div className="space-y-6">
                {activeExam.questions.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-3">
                    <p className="text-xs sm:text-sm font-bold">{qIdx + 1}. {q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt: string, oIdx: number) => (
                        <label key={oIdx} className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition ${examAnswers[qIdx] === oIdx ? 'bg-indigo-600 text-white border-indigo-600 font-bold' : 'bg-white dark:bg-slate-800'}`}>
                          <input type="radio" name={`question-${qIdx}`} checked={examAnswers[qIdx] === oIdx} onChange={() => setExamAnswers({ ...examAnswers, [qIdx]: oIdx })} className="hidden" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={submitExam} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs shadow">
                  تسليم الامتحان وعرض النتيجة
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 py-8">
                <h4 className="text-2xl font-black">نتيجة الامتحان</h4>
                <p className="text-xl font-bold text-indigo-600">درجتك: {examScore} / {activeExam.questions.length}</p>
                <button onClick={() => setActiveExam(null)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold">إغلاق نافذة الامتحان</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}