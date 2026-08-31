'use client';

import { useEffect, useMemo, useState } from 'react';

type Role = 'student' | 'instructor' | 'admin';

type User = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  parentPhone?: string;
  role: Role;
  status: 'active' | 'suspended';
  stage: string;
  grade: string;
};

type Lesson = {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
  completedBy?: string[];
};

type PdfFile = {
  id: number;
  title: string;
  url: string;
};

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
};

type Exam = {
  title: string;
  questions: Question[];
};

type Course = {
  id: number;
  title: string;
  instructor: string;
  category: string;
  stage: string;
  grade: string;
  price: string;
  description: string;
  lessons: Lesson[];
  pdfs: PdfFile[];
  exam: Exam | null;
};

type ExamResult = {
  id: number;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  parentPhone: string;
  examTitle: string;
  score: number;
  total: number;
  warnings: number;
  duration: string;
  date: string;
};

const STORAGE = {
  users: 'bedaya_edu_users_db',
  courses: 'bedaya_edu_courses',
  results: 'bedaya_edu_exam_results',
  logged: 'bedaya_edu_logged',
  profile: 'bedaya_edu_profile',
  theme: 'bedaya_edu_theme',
  progress: 'bedaya_edu_progress',
};

const ADMIN_EMAIL = '250iie3@gmail.com';

const educationalStages = [
  {
    id: 'primary',
    name: 'المرحلة الابتدائية',
    icon: '🎒',
    grades: [
      { id: 'pri-1', name: 'الصف الأول الابتدائي' },
      { id: 'pri-2', name: 'الصف الثاني الابتدائي' },
      { id: 'pri-3', name: 'الصف الثالث الابتدائي' },
      { id: 'pri-4', name: 'الصف الرابع الابتدائي' },
      { id: 'pri-5', name: 'الصف الخامس الابتدائي' },
      { id: 'pri-6', name: 'الصف السادس الابتدائي' },
    ],
  },
  {
    id: 'preparatory',
    name: 'المرحلة الإعدادية',
    icon: '📚',
    grades: [
      { id: 'prep-1', name: 'الصف الأول الإعدادي' },
      { id: 'prep-2', name: 'الصف الثاني الإعدادي' },
      { id: 'prep-3', name: 'الصف الثالث الإعدادي' },
    ],
  },
  {
    id: 'secondary',
    name: 'المرحلة الثانوية العامة',
    icon: '🎓',
    grades: [
      { id: 'sec-1', name: 'الصف الأول الثانوي' },
      { id: 'sec-2', name: 'الصف الثاني الثانوي' },
      { id: 'sec-3', name: 'الصف الثالث الثانوي' },
    ],
  },
  {
    id: 'baccalaureate',
    name: 'نظام البكالوريا',
    icon: '🏆',
    grades: [
      { id: 'bac-1', name: 'السنة الأولى البكالوريا' },
      { id: 'bac-2', name: 'السنة الثانية البكالوريا' },
    ],
  },
];

const defaultUsers: User[] = [
  {
    name: 'مدير المنصة',
    email: ADMIN_EMAIL,
    password: 'Mohamad$35',
    phone: '01000000000',
    parentPhone: 'N/A',
    role: 'admin',
    status: 'active',
    stage: 'secondary',
    grade: 'sec-3',
  },
  {
    name: 'أحمد المعلم',
    email: 'teacher@edu.com',
    password: '123',
    phone: '01000000000',
    parentPhone: 'N/A',
    role: 'instructor',
    status: 'active',
    stage: 'all',
    grade: 'all',
  },
  {
    name: 'محمد الطالب',
    email: 'student@edu.com',
    password: '123',
    phone: '01111111111',
    parentPhone: '01222222222',
    role: 'student',
    status: 'active',
    stage: 'secondary',
    grade: 'sec-3',
  },
];

const defaultCourses: Course[] = [
  {
    id: 2,
    title: 'أ/ مروان الجندي للعلوم والأحياء',
    instructor: 'مروان الجندي',
    category: 'العلوم والأحياء',
    stage: 'secondary',
    grade: 'sec-3',
    price: 'مجاناً',
    description: 'شرح مبسط وممتع لمنهج الأحياء والعلوم بطريقة احترافية.',
    lessons: [
      {
        id: 201,
        title: 'الدرس الأول: مدخل إلى علم الأحياء والخلية',
        duration: '10 دقائق',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      },
    ],
    pdfs: [],
    exam: null,
  },
];

const emptyQuestion = (): Question => ({
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
});

export default function EduPlatform() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<Role>('student');
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

  const [usersList, setUsersList] = useState<User[]>(defaultUsers);
  const [courses, setCourses] = useState<Course[]>(defaultCourses);
  const [examResultsLog, setExamResultsLog] = useState<ExamResult[]>([]);
  const [progress, setProgress] = useState<Record<string, string[]>>({});

  const [selectedGradeForCourses, setSelectedGradeForCourses] = useState<string | null>(null);
  const [courseSearch, setCourseSearch] = useState('');
  const [courseCategory, setCourseCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Course form
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

  // Content
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

  // Exams
  const [examCourseTarget, setExamCourseTarget] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [examQuestions, setExamQuestions] = useState<Question[]>([emptyQuestion()]);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [cheatingWarnings, setCheatingWarnings] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [examStartTime, setExamStartTime] = useState(0);
  const [examSecondsLeft, setExamSecondsLeft] = useState(30 * 60);

  // Teacher
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE.users);
      const savedCourses = localStorage.getItem(STORAGE.courses);
      const savedResults = localStorage.getItem(STORAGE.results);
      const savedProgress = localStorage.getItem(STORAGE.progress);
      const savedTheme = localStorage.getItem(STORAGE.theme);
      const savedProfile = localStorage.getItem(STORAGE.profile);

      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        // التأكد من دمج الافتراضيين مع المخزن لضمان وجود حساب الأدمن والمعلم دائماً
        const mergedUsers = [...defaultUsers];
        parsedUsers.forEach((u: User) => {
          if (!mergedUsers.some((existing) => existing.email.toLowerCase() === u.email.toLowerCase())) {
            mergedUsers.push(u);
          }
        });
        setUsersList(mergedUsers);
      } else {
        setUsersList(defaultUsers);
      }

      if (savedCourses) setCourses(JSON.parse(savedCourses));
      if (savedResults) setExamResultsLog(JSON.parse(savedResults));
      if (savedProgress) setProgress(JSON.parse(savedProgress));
      if (savedTheme) setDarkMode(savedTheme === 'dark');

      if (savedProfile && localStorage.getItem(STORAGE.logged) === 'true') {
        const p = JSON.parse(savedProfile);
        setIsLoggedIn(true);
        setUserName(p.name || '');
        setUserEmail(p.email || '');
        setUserRole(p.role || 'student');
        setUserPhone(p.phone || '');
        setUserParentPhone(p.parentPhone || '');
        setUserStage(p.stage || 'secondary');
        setUserGrade(p.grade || 'sec-3');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE.users, JSON.stringify(usersList));
      localStorage.setItem(STORAGE.courses, JSON.stringify(courses));
      localStorage.setItem(STORAGE.results, JSON.stringify(examResultsLog));
      localStorage.setItem(STORAGE.progress, JSON.stringify(progress));
      localStorage.setItem(STORAGE.theme, darkMode ? 'dark' : 'light');
    } catch (e) {
      console.error(e);
    }
  }, [usersList, courses, examResultsLog, progress, darkMode]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(
        STORAGE.profile,
        JSON.stringify({
          name: userName,
          email: userEmail,
          role: userRole,
          phone: userPhone,
          parentPhone: userParentPhone,
          stage: userStage,
          grade: userGrade,
        })
      );
      localStorage.setItem(STORAGE.logged, 'true');
    }
  }, [isLoggedIn, userName, userEmail, userRole, userPhone, userParentPhone, userStage, userGrade]);

  // السماح للأدمن والمعلم بالوصول للوحة التحكم الخاصة بالمعلم وإدارة المحتوى
  useEffect(() => {
    if (isLoggedIn && userRole === 'student' && (activeTab === 'instructor-dashboard' || activeTab === 'admin-dashboard')) {
      setActiveTab('home');
      showToast('غير مسموح للطالب بالوصول لهذه الصفحة');
    }
  }, [activeTab, isLoggedIn, userRole]);

  useEffect(() => {
    if (!activeExam || examSubmitted) return;

    const warn = (message: string) => {
      setCheatingWarnings((current) => {
        const next = current + 1;
        if (next >= 3) {
          showToast('تم إنهاء الامتحان تلقائياً بسبب تكرار مغادرة نافذة الامتحان');
          finishExamDueToCheating(next);
        } else {
          showToast(`${message} (الإنذار ${next}/3)`);
        }
        return next;
      });
    };

    const onVisibility = () => {
      if (document.hidden) warn('تحذير: تمت مغادرة نافذة الامتحان');
    };
    const onBlur = () => warn('تحذير: خرجت من نافذة الامتحان');

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
    };
  }, [activeExam, examSubmitted]);

  useEffect(() => {
    if (!activeExam || examSubmitted) return;
    const id = window.setInterval(() => {
      setExamSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          submitExam(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeExam, examSubmitted]);

  const currentAvailableGrades = educationalStages.find((s) => s.id === inputStage)?.grades || [];
  const targetGradesForNewCourse = educationalStages.find((s) => s.id === newCourseStage)?.grades || [];
  const targetGradesForEditCourse = educationalStages.find((s) => s.id === editCourseStage)?.grades || [];

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean)))],
    [courses]
  );

  const visibleCourses = useMemo(() => {
    const q = courseSearch.trim().toLowerCase();
    return courses.filter((course) => {
      if (selectedGradeForCourses && course.grade !== selectedGradeForCourses) return false;
      if (isLoggedIn && userRole === 'student' && !selectedGradeForCourses && course.grade !== userGrade) return false;
      if (courseCategory !== 'all' && course.category !== courseCategory) return false;
      if (q && !`${course.title} ${course.instructor} ${course.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [courses, selectedGradeForCourses, isLoggedIn, userRole, userGrade, courseCategory, courseSearch]);

  const totalLessons = courses.reduce((n, c) => n + c.lessons.length, 0);
  const totalStudents = usersList.filter((u) => u.role === 'student').length;
  const totalTeachers = usersList.filter((u) => u.role === 'instructor').length;

  const getCourseProgress = (course: Course) => {
    if (!course.lessons.length || !userEmail) return 0;
    const done = progress[userEmail]?.filter((id) => course.lessons.some((l) => String(l.id) === id)).length || 0;
    return Math.round((done / course.lessons.length) * 100);
  };

  const toggleLessonComplete = (courseId: number, lessonId: number) => {
    if (!isLoggedIn || userRole !== 'student') {
      showToast('سجل دخولك كطالب لتسجيل تقدمك');
      return;
    }
    setProgress((old) => {
      const key = userEmail;
      const current = old[key] || [];
      const id = String(lessonId);
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      return { ...old, [key]: next };
    });
  };

  const openTab = (tab: string) => {
    setActiveTab(tab);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAs = (u: User) => {
    setIsLoggedIn(true);
    setUserName(u.name);
    setUserEmail(u.email);
    setUserRole(u.role);
    setUserPhone(u.phone || 'غير محدد');
    setUserParentPhone(u.parentPhone || 'غير محدد');
    setUserStage(u.stage || 'secondary');
    setUserGrade(u.grade || 'sec-3');
    // الأدمن يمكنه الذهاب للوحة الإدارة أو لوحة المعلم
    setActiveTab(u.role === 'admin' ? 'admin-dashboard' : u.role === 'instructor' ? 'instructor-dashboard' : 'home');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName || !inputEmail || !inputPassword || !inputPhone || !inputParentPhone) {
      showToast('يرجى إكمال البيانات الأساسية ورقم هاتف ولي الأمر');
      return;
    }
    const email = inputEmail.trim().toLowerCase();
    if (usersList.some((u) => u.email.toLowerCase() === email)) {
      showToast('البريد الإلكتروني مستخدم من قبل');
      return;
    }

    const newUser: User = {
      name: inputName.trim(),
      email,
      password: inputPassword,
      phone: inputPhone,
      parentPhone: inputParentPhone,
      role: 'student',
      status: 'active',
      stage: inputStage,
      grade: inputGrade,
    };

    setUsersList((old) => [...old, newUser]);
    loginAs(newUser);
    showToast(`أهلاً بك ${newUser.name}، تم إنشاء حساب الطالب`);
    setInputName('');
    setInputEmail('');
    setInputPassword('');
    setInputPhone('');
    setInputParentPhone('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = inputEmail.trim().toLowerCase();

    if (!email || !inputPassword) {
      showToast('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    const found = usersList.find((u) => u.email.toLowerCase() === email && u.password === inputPassword);

    if (!found) {
      showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      return;
    }
    if (found.status === 'suspended') {
      showToast('هذا الحساب معطل من الإدارة');
      return;
    }

    loginAs(found);
    showToast(`مرحباً بك من جديد يا ${found.name}`);
    setInputEmail('');
    setInputPassword('');
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
    localStorage.removeItem(STORAGE.logged);
    localStorage.removeItem(STORAGE.profile);
    setActiveTab('home');
    showToast('تم تسجيل الخروج بنجاح');
  };

  const handleAdminCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName || !newTeacherEmail || !newTeacherPassword) {
      showToast('يرجى إدخال اسم المدرس والبريد وكلمة المرور');
      return;
    }

    const email = newTeacherEmail.trim().toLowerCase();
    if (usersList.some((u) => u.email.toLowerCase() === email)) {
      showToast('البريد الإلكتروني مسجل مسبقاً');
      return;
    }

    const teacher: User = {
      name: newTeacherName.trim(),
      email,
      password: newTeacherPassword,
      phone: newTeacherPhone || 'غير محدد',
      parentPhone: 'N/A',
      role: 'instructor',
      status: 'active',
      stage: 'all',
      grade: 'all',
    };

    setUsersList((old) => [...old, teacher]);
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewTeacherPassword('');
    setNewTeacherPhone('');
    showToast('تم إنشاء وتفعيل حساب المعلم بنجاح');
  };

  const handleToggleUserStatus = (email: string) => {
    if (email === ADMIN_EMAIL) {
      showToast('لا يمكن تعطيل الأدمن الرئيسي');
      return;
    }
    setUsersList((old) =>
      old.map((u) => u.email === email ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u)
    );
    showToast('تم تحديث حالة الحساب');
  };

  const handleDeleteUser = (email: string) => {
    if (email === ADMIN_EMAIL) {
      showToast('لا يمكن حذف الأدمن الرئيسي');
      return;
    }
    if (window.confirm('هل أنت متأكد من حذف المستخدم نهائياً؟')) {
      setUsersList((old) => old.filter((u) => u.email !== email));
      showToast('تم حذف المستخدم');
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseInstructor) {
      showToast('يرجى إدخال عنوان الكورس واسم المعلم');
      return;
    }

    const newCourse: Course = {
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
      exam: null,
    };

    setCourses((old) => [newCourse, ...old]);
    setNewCourseTitle('');
    setNewCourseInstructor('');
    setNewCourseCategory('');
    setNewCourseDesc('');
    showToast('تم نشر الكورس بنجاح');
  };

  const startEditingCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setEditCourseTitle(course.title);
    setEditCourseInstructor(course.instructor);
    setEditCourseCategory(course.category);
    setEditCourseStage(course.stage);
    setEditCourseGrade(course.grade);
    setEditCoursePrice(course.price);
    setEditCourseDesc(course.description);
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourseId) return;
    setCourses((old) => old.map((c) => c.id === editingCourseId ? {
      ...c,
      title: editCourseTitle,
      instructor: editCourseInstructor,
      category: editCourseCategory,
      stage: editCourseStage,
      grade: editCourseGrade,
      price: editCoursePrice,
      description: editCourseDesc,
    } : c));
    setEditingCourseId(null);
    showToast('تم تعديل الكورس بنجاح');
  };

  const handleDeleteCourse = (courseId: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الكورس نهائياً؟')) return;
    setCourses((old) => old.filter((c) => c.id !== courseId));
    setSelectedCourse(null);
    showToast('تم حذف الكورس');
  };

  const handleAddVideoToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForContent || !newVideoTitle) {
      showToast('اختر الكورس واكتب عنوان الدرس');
      return;
    }

    let finalVideoUrl = '';
    if (videoAddMethod === 'file') {
      if (!newVideoFile) {
        showToast('اختر ملف فيديو');
        return;
      }
      finalVideoUrl = URL.createObjectURL(newVideoFile);
    } else {
      if (!newVideoUrlInput) {
        showToast('أدخل رابط الفيديو');
        return;
      }
      finalVideoUrl = newVideoUrlInput;
    }

    const lesson: Lesson = {
      id: Date.now(),
      title: newVideoTitle,
      duration: newVideoDuration,
      videoUrl: finalVideoUrl,
    };

    setCourses((old) => old.map((c) => String(c.id) === String(selectedCourseForContent) ? {
      ...c,
      lessons: [...c.lessons, lesson],
    } : c));

    setNewVideoTitle('');
    setNewVideoFile(null);
    setNewVideoUrlInput('');
    showToast('تمت إضافة الفيديو');
  };

  const handleAddPdfToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForContent || !newPdfTitle) {
      showToast('اختر الكورس واكتب عنوان ملف PDF');
      return;
    }

    let finalPdfUrl = '';
    if (pdfAddMethod === 'file') {
      if (!newPdfFile) {
        showToast('اختر ملف PDF');
        return;
      }
      finalPdfUrl = URL.createObjectURL(newPdfFile);
    } else {
      if (!newPdfUrlInput) {
        showToast('أدخل رابط PDF');
        return;
      }
      finalPdfUrl = newPdfUrlInput;
    }

    setCourses((old) => old.map((c) => String(c.id) === String(selectedCourseForContent) ? {
      ...c,
      pdfs: [...c.pdfs, { id: Date.now(), title: newPdfTitle, url: finalPdfUrl }],
    } : c));

    setNewPdfTitle('');
    setNewPdfFile(null);
    setNewPdfUrlInput('');
    showToast('تمت إضافة ملف PDF');
  };

  const handleAddExamQuestion = () => {
    setExamQuestions((old) => [...old, emptyQuestion()]);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examCourseTarget || !examTitle || examQuestions.length === 0) {
      showToast('اختر الكورس واكتب عنوان الامتحان وأضف سؤالاً');
      return;
    }
    const valid = examQuestions.every((q) => q.question.trim() && q.options.every(Boolean));
    if (!valid) {
      showToast('أكمل نص السؤال والاختيارات قبل النشر');
      return;
    }

    setCourses((old) => old.map((c) => String(c.id) === String(examCourseTarget) ? {
      ...c,
      exam: { title: examTitle, questions: examQuestions },
    } : c));

    setExamTitle('');
    setExamQuestions([emptyQuestion()]);
    showToast('تم إنشاء ونشر الامتحان الذكي');
  };

  const startExam = (exam: Exam) => {
    setActiveExam(exam);
    setExamAnswers({});
    setCheatingWarnings(0);
    setExamSubmitted(false);
    setExamScore(0);
    setExamStartTime(Date.now());
    setExamSecondsLeft(Math.max(5 * 60, exam.questions.length * 2 * 60));
  };

  const saveExamResultToLog = (score: number, warnings: number, duration: string, exam: Exam) => {
    const record: ExamResult = {
      id: Date.now(),
      studentName: userName || 'طالب',
      studentEmail: userEmail || 'unknown@edu.com',
      studentPhone: userPhone || 'غير محدد',
      parentPhone: userParentPhone || 'غير محدد',
      examTitle: exam.title,
      score,
      total: exam.questions.length,
      warnings,
      duration,
      date: new Date().toLocaleString('ar-EG'),
    };
    setExamResultsLog((old) => [record, ...old]);
  };

  const finishExamDueToCheating = (warningsCount = 3) => {
    if (!activeExam) return;
    const durationSec = Math.floor((Date.now() - examStartTime) / 1000);
    const duration = `${Math.floor(durationSec / 60)} دقيقة و ${durationSec % 60} ثانية`;
    saveExamResultToLog(0, warningsCount, duration, activeExam);
    setExamSubmitted(true);
    setExamScore(0);
    setActiveExam(null);
  };

  const submitExam = (auto = false) => {
    if (!activeExam) return;
    let score = 0;
    activeExam.questions.forEach((q, idx) => {
      if (examAnswers[idx] === q.correctAnswer) score++;
    });

    const durationSec = Math.floor((Date.now() - examStartTime) / 1000);
    const duration = `${Math.floor(durationSec / 60)} دقيقة و ${durationSec % 60} ثانية`;
    setExamScore(score);
    setExamSubmitted(true);
    saveExamResultToLog(score, cheatingWarnings, duration, activeExam);

    if (auto) showToast(`انتهى الوقت. تم تسليم الامتحان تلقائياً: ${score}/${activeExam.questions.length}`);
    else showToast(`تم تسليم الامتحان بنجاح: ${score}/${activeExam.questions.length}`);
  };

  const deleteResult = (id: number) => {
    setExamResultsLog((old) => old.filter((r) => r.id !== id));
    showToast('تم حذف السجل');
  };

  const clearResults = () => {
    if (!window.confirm('مسح جميع سجلات الدرجات؟')) return;
    setExamResultsLog([]);
    showToast('تم تفريغ سجل الدرجات');
  };

  const inputClass = 'w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10';
  const cardClass = `rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`;
  const buttonPrimary = 'rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-500 active:translate-y-0';
  const buttonSoft = `rounded-2xl px-4 py-2.5 text-sm font-bold transition ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`;

  return (
    <div dir="rtl" className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-[#070b16] text-slate-100' : 'bg-[#f6f8fc] text-slate-900'}`}>
      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::selection { background: rgba(99,102,241,.25); }
      `}</style>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100] max-w-sm rounded-2xl border border-indigo-400/20 bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl animate-[slideIn_.25s_ease-out]">
          ✓ {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${darkMode ? 'border-slate-800/80 bg-slate-950/85' : 'border-slate-200/80 bg-white/85'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button onClick={() => openTab('home')} className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-black text-white shadow-lg shadow-indigo-600/25">BE</span>
            <span className="text-right">
              <span className="block text-lg font-black tracking-tight">BEDAYA <span className="text-indigo-500">EDU</span></span>
              <span className="hidden text-[10px] font-bold opacity-50 sm:block">منصة تعليمية ذكية</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {[
              ['home', 'الرئيسية'],
              ['stages', 'المراحل والصفوف'],
              ['courses', 'الكورسات'],
            ].map(([tab, label]) => (
              <button key={tab} onClick={() => openTab(tab)} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${activeTab === tab ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' : 'opacity-70 hover:bg-slate-100 hover:opacity-100 dark:hover:bg-slate-800'}`}>
                {label}
              </button>
            ))}
            {isLoggedIn && (userRole === 'instructor' || userRole === 'admin') && (
              <button onClick={() => openTab('instructor-dashboard')} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${activeTab === 'instructor-dashboard' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' : 'opacity-70 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                لوحة المعلم
              </button>
            )}
            {isLoggedIn && userRole === 'admin' && (
              <button onClick={() => openTab('admin-dashboard')} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${activeTab === 'admin-dashboard' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'opacity-70 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                الإدارة
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode((v) => !v)} className={buttonSoft} title="تغيير المظهر">
              {darkMode ? '☀️' : '🌙'}
              <span className="hidden sm:inline">{darkMode ? 'نهاري' : 'ليلي'}</span>
            </button>

            {isLoggedIn ? (
              <>
                <button onClick={() => openTab(userRole === 'admin' ? 'admin-dashboard' : userRole === 'instructor' ? 'instructor-dashboard' : 'home')} className="hidden max-w-44 truncate rounded-2xl bg-indigo-50 px-4 py-2.5 text-xs font-black text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 sm:block">
                  {userName} · {userRole === 'admin' ? 'مدير' : userRole === 'instructor' ? 'معلم' : 'طالب'}
                </button>
                <button onClick={handleLogout} className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-black text-rose-600 transition hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-400">خروج</button>
              </>
            ) : (
              <button onClick={() => openTab('auth')} className={buttonPrimary}>دخول</button>
            )}

            <button onClick={() => setMobileMenu((v) => !v)} className={`${buttonSoft} lg:hidden`}>☰</button>
          </div>
        </div>

        {mobileMenu && (
          <div className={`border-t px-4 py-3 lg:hidden ${darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
            <div className="grid gap-2">
              <button onClick={() => openTab('home')} className={buttonSoft}>الرئيسية</button>
              <button onClick={() => openTab('stages')} className={buttonSoft}>المراحل والصفوف</button>
              <button onClick={() => openTab('courses')} className={buttonSoft}>الكورسات</button>
              {isLoggedIn && (userRole === 'instructor' || userRole === 'admin') && <button onClick={() => openTab('instructor-dashboard')} className={buttonSoft}>لوحة المعلم</button>}
              {isLoggedIn && userRole === 'admin' && <button onClick={() => openTab('admin-dashboard')} className={buttonSoft}>لوحة الإدارة</button>}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {activeTab === 'auth' && !isLoggedIn && (
          <div className="mx-auto max-w-md py-8">
            <div className={`${cardClass} p-8`}>
              <div className="mb-6 flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-black transition ${authMode === 'login' ? 'bg-indigo-600 text-white shadow' : 'opacity-60'}`}
                >
                  تسجيل الدخول
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-black transition ${authMode === 'signup' ? 'bg-indigo-600 text-white shadow' : 'opacity-60'}`}
                >
                  حساب جديد (طالب)
                </button>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold opacity-70">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold opacity-70">كلمة المرور</label>
                    <input
                      type="password"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="••••••••"
                      className={inputClass}
                    />
                  </div>
                  <button type="submit" className={`w-full ${buttonPrimary}`}>دخول المنصة</button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold opacity-70">الاسم الكامل</label>
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="محمد أحمد"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold opacity-70">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="student@edu.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold opacity-70">كلمة المرور</label>
                    <input
                      type="password"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="••••••••"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold opacity-70">رقم هاتفك</label>
                      <input
                        type="text"
                        value={inputPhone}
                        onChange={(e) => setInputPhone(e.target.value)}
                        placeholder="011xxxxxxx"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold opacity-70">هاتف ولي الأمر</label>
                      <input
                        type="text"
                        value={inputParentPhone}
                        onChange={(e) => setInputParentPhone(e.target.value)}
                        placeholder="012xxxxxxx"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold opacity-70">المرحلة الدراسية</label>
                    <select
                      value={inputStage}
                      onChange={(e) => {
                        setInputStage(e.target.value);
                        const firstGrade = educationalStages.find((s) => s.id === e.target.value)?.grades[0]?.id || '';
                        setInputGrade(firstGrade);
                      }}
                      className={inputClass}
                    >
                      {educationalStages.map((st) => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold opacity-70">الصف الدراسي</label>
                    <select
                      value={inputGrade}
                      onChange={(e) => setInputGrade(e.target.value)}
                      className={inputClass}
                    >
                      {currentAvailableGrades.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className={`w-full ${buttonPrimary}`}>إنشاء حساب وتسجيل</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* باقي العرض (Home, Stages, Courses, Admin/Instructor Dashboards) يتم عرضه بناءً على الـ activeTab */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 text-white shadow-2xl sm:p-12">
              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-bold backdrop-blur-md">منصة تعليمية متكاملة</span>
                <h1 className="text-3xl font-black tracking-tight sm:text-5xl">مرحباً بك في منصة البداية التعليمية</h1>
                <p className="text-sm font-medium opacity-90 sm:text-base">استكشف أقوى الكورسات، ادرس مع نخبة الأساتذة، وامتحن بأحدث أنظمة الرقابة الذكية والتقييم.</p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <button onClick={() => openTab('courses')} className="rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-indigo-700 shadow-xl transition hover:bg-slate-100">استعرض الكورسات</button>
                  <button onClick={() => openTab('stages')} className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-black backdrop-blur-md transition hover:bg-white/20">المراحل التعليمية</button>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className={`${cardClass} p-6 text-center`}>
                <span className="block text-2xl font-black text-indigo-600 sm:text-3xl">{courses.length}</span>
                <span className="text-xs font-bold opacity-60">كورس متاح</span>
              </div>
              <div className={`${cardClass} p-6 text-center`}>
                <span className="block text-2xl font-black text-indigo-600 sm:text-3xl">{totalLessons}</span>
                <span className="text-xs font-bold opacity-60">درس تعليمي</span>
              </div>
              <div className={`${cardClass} p-6 text-center`}>
                <span className="block text-2xl font-black text-indigo-600 sm:text-3xl">{totalStudents}</span>
                <span className="text-xs font-bold opacity-60">طالب مسجل</span>
              </div>
              <div className={`${cardClass} p-6 text-center`}>
                <span className="block text-2xl font-black text-indigo-600 sm:text-3xl">{totalTeachers}</span>
                <span className="text-xs font-bold opacity-60">معلم خبير</span>
              </div>
            </div>
          </div>
        )}

        {/* لوحة التحكم للأدمن (تجمع صلاحيات الأدمن والمعلم بالكامل) */}
        {activeTab === 'admin-dashboard' && isLoggedIn && userRole === 'admin' && (
          <div className="space-y-8">
            <div className={`${cardClass} p-6 sm:p-8`}>
              <h2 className="text-xl font-black mb-6">لوحة تحكم الأدمن (صلاحيات كاملة للمنصة وإدارة المعلمين)</h2>
              
              <div className="grid gap-8">
                {/* إنشاء حساب معلم */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <h3 className="text-base font-black mb-4 text-indigo-500">إضافة حساب معلم جديد وتفعيله</h3>
                  <form onSubmit={handleAdminCreateTeacher} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="اسم المعلم" value={newTeacherName} onChange={(e) => setNewTeacherName(e.target.value)} className={inputClass} />
                    <input type="email" placeholder="البريد الإلكتروني" value={newTeacherEmail} onChange={(e) => setNewTeacherEmail(e.target.value)} className={inputClass} />
                    <input type="password" placeholder="كلمة المرور" value={newTeacherPassword} onChange={(e) => setNewTeacherPassword(e.target.value)} className={inputClass} />
                    <input type="text" placeholder="رقم الهاتف" value={newTeacherPhone} onChange={(e) => setNewTeacherPhone(e.target.value)} className={inputClass} />
                    <button type="submit" className={`sm:col-span-2 ${buttonPrimary}`}>إنشاء حساب المعلم</button>
                  </form>
                </div>

                {/* إدارة المستخدمين */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <h3 className="text-base font-black mb-4">إدارة مستخدمي المنصة (طلاب ومعلمين)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 opacity-60">
                          <th className="py-3 px-4">الاسم</th>
                          <th className="py-3 px-4">البريد</th>
                          <th className="py-3 px-4">الدور</th>
                          <th className="py-3 px-4">الحالة</th>
                          <th className="py-3 px-4">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.map((u) => (
                          <tr key={u.email} className="border-b border-slate-100 dark:border-slate-800/50">
                            <td className="py-3 px-4 font-bold">{u.name}</td>
                            <td className="py-3 px-4 opacity-80">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className={`rounded-lg px-2 py-1 text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300' : u.role === 'instructor' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                                {u.role === 'admin' ? 'مدير' : u.role === 'instructor' ? 'معلم' : 'طالب'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`rounded-lg px-2 py-1 text-xs font-bold ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'}`}>
                                {u.status === 'active' ? 'نشط' : 'معطل'}
                              </span>
                            </td>
                            <td className="py-3 px-4 flex gap-2">
                              {u.email !== ADMIN_EMAIL && (
                                <>
                                  <button onClick={() => handleToggleUserStatus(u.email)} className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold hover:bg-slate-200 dark:bg-slate-800">
                                    {u.status === 'active' ? 'تعطيل' : 'تفعيل'}
                                  </button>
                                  <button onClick={() => handleDeleteUser(u.email)} className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30">
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

                {/* سجل نتائج الامتحانات */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-black">سجل درجات وحالات الامتحانات للطلاب</h3>
                    {examResultsLog.length > 0 && (
                      <button onClick={clearResults} className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 dark:bg-rose-950/30">مسح السجل</button>
                    )}
                  </div>
                  {examResultsLog.length === 0 ? (
                    <p className="text-sm opacity-50">لا توجد نتائج مسجلة حتى الآن.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 opacity-60">
                            <th className="py-3 px-4">الطالب</th>
                            <th className="py-3 px-4">الهاتف / ولي الأمر</th>
                            <th className="py-3 px-4">الامتحان</th>
                            <th className="py-3 px-4">النتيجة</th>
                            <th className="py-3 px-4">الإنذارات</th>
                            <th className="py-3 px-4">التاريخ</th>
                            <th className="py-3 px-4">حذف</th>
                          </tr>
                        </thead>
                        <tbody>
                          {examResultsLog.map((r) => (
                            <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800/50">
                              <td className="py-3 px-4 font-bold">{r.studentName}</td>
                              <td className="py-3 px-4 opacity-80">{r.studentPhone} / {r.parentPhone}</td>
                              <td className="py-3 px-4">{r.examTitle}</td>
                              <td className="py-3 px-4 font-black text-indigo-600">{r.score} / {r.total}</td>
                              <td className="py-3 px-4 font-bold text-rose-500">{r.warnings} إنذارات</td>
                              <td className="py-3 px-4 text-xs opacity-60">{r.date}</td>
                              <td className="py-3 px-4">
                                <button onClick={() => deleteResult(r.id)} className="text-rose-500 text-xs font-bold">حذف</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* لوحة المعلم (إضافة الكورسات، الدروس، الامتحانات) */}
        {activeTab === 'instructor-dashboard' && isLoggedIn && (userRole === 'instructor' || userRole === 'admin') && (
          <div className="space-y-8">
            <div className={`${cardClass} p-6 sm:p-8 space-y-8`}>
              <h2 className="text-xl font-black">لوحة تحكم المعلم (إنشاء وإدارة المحتوى التعليمي)</h2>

              {/* إنشاء كورس جديد */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-base font-black mb-4 text-indigo-500">إضافة كورس تعليمي جديد</h3>
                <form onSubmit={handleCreateCourse} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="عنوان الكورس" value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} className={inputClass} />
                  <input type="text" placeholder="اسم المعلم / المحاضر" value={newCourseInstructor} onChange={(e) => setNewCourseInstructor(e.target.value)} className={inputClass} />
                  <input type="text" placeholder="التصنيف (مثال: رياضيات، أحياء)" value={newCourseCategory} onChange={(e) => setNewCourseCategory(e.target.value)} className={inputClass} />
                  <select value={newCourseStage} onChange={(e) => setNewCourseStage(e.target.value)} className={inputClass}>
                    {educationalStages.map((st) => <option key={st.id} value={st.id}>{st.name}</option>)}
                  </select>
                  <select value={newCourseGrade} onChange={(e) => setNewCourseGrade(e.target.value)} className={inputClass}>
                    {targetGradesForNewCourse.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                  <input type="text" placeholder="السعر (مجاناً أو القيمة)" value={newCoursePrice} onChange={(e) => setNewCoursePrice(e.target.value)} className={inputClass} />
                  <textarea placeholder="وصف الكورس" value={newCourseDesc} onChange={(e) => setNewCourseDesc(e.target.value)} className={`sm:col-span-2 ${inputClass}`} rows={3} />
                  <button type="submit" className={`sm:col-span-2 ${buttonPrimary}`}>نشر الكورس</button>
                </form>
              </div>

              {/* إضافة درس فيديو للكورس */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-base font-black mb-4 text-indigo-500">إضافة درس (فيديو) للكورس</h3>
                <form onSubmit={handleAddVideoToCourse} className="space-y-4">
                  <select value={selectedCourseForContent} onChange={(e) => setSelectedCourseForContent(e.target.value)} className={inputClass}>
                    <option value="">اختر الكورس المستهدف</option>
                    {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="عنوان الدرس" value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} className={inputClass} />
                    <input type="text" placeholder="المدة (مثال: 15 دقيقة)" value={newVideoDuration} onChange={(e) => setNewVideoDuration(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold opacity-70">رابط الفيديو (أو رفع ملف)</label>
                    <input type="text" placeholder="https://..." value={newVideoUrlInput} onChange={(e) => setNewVideoUrlInput(e.target.value)} className={inputClass} />
                  </div>
                  <button type="submit" className={buttonPrimary}>إضافة الدرس للكورس</button>
                </form>
              </div>

              {/* إضافة امتحان ذكي */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-base font-black mb-4 text-indigo-500">إنشاء اختبار ذكي (اختيار من متعدد)</h3>
                <form onSubmit={handleCreateExam} className="space-y-4">
                  <select value={examCourseTarget} onChange={(e) => setExamCourseTarget(e.target.value)} className={inputClass}>
                    <option value="">اختر الكورس لإضافة الامتحان له</option>
                    {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                  <input type="text" placeholder="عنوان الاختبار" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} className={inputClass} />

                  {examQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                      <input type="text" placeholder={`نص السؤال ${qIdx + 1}`} value={q.question} onChange={(e) => {
                        const val = e.target.value;
                        setExamQuestions((old) => old.map((item, idx) => idx === qIdx ? { ...item, question: val } : item));
                      }} className={inputClass} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => (
                          <input key={oIdx} type="text" placeholder={`الاختيار ${oIdx + 1}`} value={opt} onChange={(e) => {
                            const val = e.target.value;
                            setExamQuestions((old) => old.map((item, idx) => idx === qIdx ? {
                              ...item,
                              options: item.options.map((op, i) => i === oIdx ? val : op)
                            } : item));
                          }} className={inputClass} />
                        ))}
                      </div>
                      <div>
                        <label className="text-xs font-bold opacity-70 ml-2">الإجابة الصحيحة:</label>
                        <select value={q.correctAnswer} onChange={(e) => {
                          const val = Number(e.target.value);
                          setExamQuestions((old) => old.map((item, idx) => idx === qIdx ? { ...item, correctAnswer: val } : item));
                        }} className={inputClass}>
                          {q.options.map((_, i) => <option key={i} value={i}>الاختيار {i + 1}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3">
                    <button type="button" onClick={handleAddExamQuestion} className={buttonSoft}>+ إضافة سؤال آخر</button>
                    <button type="submit" className={buttonPrimary}>حفظ ونشر الامتحان</button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}