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

/**
 * IMPORTANT:
 * This file keeps the original local/demo behavior so no existing feature is removed.
 * For production, move authentication, passwords, file storage and authorization to a
 * real backend (e.g. Supabase/Next.js server actions) and never ship credentials in JS.
 */

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

      if (savedUsers) setUsersList(JSON.parse(savedUsers));
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

  useEffect(() => {
    if (isLoggedIn && userRole === 'student' && (activeTab === 'instructor-dashboard' || activeTab === 'admin-dashboard')) {
      setActiveTab('home');
      showToast('غير مسموح للطالب بالوصول لهذه الصفحة');
    }
  }, [activeTab, isLoggedIn, userRole]);

  // Keep the original anti-cheating behavior, but avoid duplicate listeners.
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

  // Added professional exam timer while preserving the original exam feature.
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
    showToast('تم إنشاء وتفعيل حساب المعلم بواسطة الأدمن');
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {/* HOME */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-slate-950 to-violet-950 p-7 text-white shadow-2xl sm:p-12">
              <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
              <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="relative max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                  ✨ تعليم أذكى · متابعة أفضل · نتائج أقوى
                </div>
                <h1 className="text-4xl font-black leading-tight sm:text-6xl">ابدأ طريقك التعليمي مع <span className="text-indigo-300">BEDAYA EDU</span></h1>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-lg">منصة تجمع الكورسات، الفيديوهات، ملفات PDF والامتحانات الذكية في تجربة واحدة منظمة لكل طالب ومعلم.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => openTab('courses')} className="rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-indigo-950 transition hover:-translate-y-0.5">تصفح الكورسات ←</button>
                  <button onClick={() => openTab('stages')} className="rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-black text-white backdrop-blur transition hover:bg-white/15">اختر صفك الدراسي</button>
                  {!isLoggedIn && <button onClick={() => { setAuthMode('signup'); openTab('auth'); }} className="rounded-2xl bg-amber-400 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:bg-amber-300">إنشاء حساب طالب</button>}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                ['📚', courses.length, 'كورس متاح'],
                ['🎬', totalLessons, 'درس فيديو'],
                ['👨‍🎓', totalStudents, 'طالب'],
                ['👨‍🏫', totalTeachers, 'معلم'],
              ].map(([icon, value, label]) => (
                <div key={String(label)} className={`${cardClass} p-5`}>
                  <div className="text-2xl">{icon}</div>
                  <div className="mt-3 text-2xl font-black">{value}</div>
                  <div className="mt-1 text-xs font-bold opacity-55">{label}</div>
                </div>
              ))}
            </section>

            {isLoggedIn && userRole === 'student' && (
              <section className={`${cardClass} overflow-hidden`}>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-black">مرحباً {userName} 👋</h2>
                    <p className="mt-1 text-xs opacity-55">هذه مساحة سريعة لمتابعة تعليمك.</p>
                  </div>
                  <button onClick={() => openTab('courses')} className={buttonPrimary}>متابعة التعلم</button>
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-3">
                  <div className="rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-500/10"><span className="text-xs font-bold opacity-60">المرحلة</span><div className="mt-1 font-black">{educationalStages.find(s => s.id === userStage)?.name || userStage}</div></div>
                  <div className="rounded-2xl bg-violet-50 p-4 dark:bg-violet-500/10"><span className="text-xs font-bold opacity-60">الصف</span><div className="mt-1 font-black">{educationalStages.flatMap(s => s.grades).find(g => g.id === userGrade)?.name || userGrade}</div></div>
                  <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-500/10"><span className="text-xs font-bold opacity-60">نتائج امتحاناتك</span><div className="mt-1 font-black">{examResultsLog.filter(r => r.studentEmail === userEmail).length} محاولة</div></div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* STAGES */}
        {activeTab === 'stages' && (
          <section className="space-y-7">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-500">Learning Paths</span>
              <h1 className="mt-2 text-3xl font-black">اختر المرحلة والصف</h1>
              <p className="mt-2 text-sm opacity-55">سيتم عرض الكورسات المناسبة للصف الذي تختاره.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {educationalStages.map((stage) => (
                <div key={stage.id} className={`${cardClass} overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-xl`}>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{stage.icon}</span>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">{stage.grades.length} صفوف</span>
                  </div>
                  <h2 className="mt-5 text-lg font-black">{stage.name}</h2>
                  <div className="mt-5 space-y-2">
                    {stage.grades.map((grade) => (
                      <button key={grade.id} onClick={() => { setSelectedGradeForCourses(grade.id); openTab('courses'); }} className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 p-3 text-right text-xs font-bold transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-800 dark:hover:bg-indigo-500/10">
                        <span>{grade.name}</span>
                        <span className="text-indigo-500 transition group-hover:-translate-x-1">←</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* COURSES */}
        {activeTab === 'courses' && (
          <section className="space-y-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-indigo-500">Courses Library</span>
                <h1 className="mt-2 text-3xl font-black">الكورسات التعليمية</h1>
                <p className="mt-2 text-sm opacity-55">{selectedGradeForCourses ? 'فلترة حسب الصف المحدد' : isLoggedIn && userRole === 'student' ? 'الكورسات المخصصة لصفك' : 'تصفح كل محتوى المنصة'}</p>
              </div>
              {selectedGradeForCourses && <button onClick={() => setSelectedGradeForCourses(null)} className={buttonSoft}>إلغاء فلترة الصف</button>}
            </div>

            <div className={`${cardClass} grid gap-3 p-4 md:grid-cols-[1fr_180px]`}>
              <div className="relative">
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">🔎</span>
                <input value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)} className={`${inputClass} pr-11`} placeholder="ابحث باسم الكورس أو المعلم أو المادة..." />
              </div>
              <select value={courseCategory} onChange={(e) => setCourseCategory(e.target.value)} className={inputClass}>
                {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'كل المواد' : c}</option>)}
              </select>
            </div>

            {visibleCourses.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visibleCourses.map((course) => {
                  const pct = getCourseProgress(course);
                  return (
                    <article key={course.id} className={`${cardClass} group overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl`}>
                      <div className="h-2 bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500" />
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-3">
                          <span className="rounded-xl bg-indigo-50 px-3 py-1.5 text-[10px] font-black text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">{course.category}</span>
                          <span className="rounded-xl bg-amber-50 px-3 py-1.5 text-[10px] font-black text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">{course.price}</span>
                        </div>
                        <h2 className="mt-5 line-clamp-2 text-xl font-black">{course.title}</h2>
                        <p className="mt-2 text-xs font-bold text-indigo-500">👨‍🏫 {course.instructor}</p>
                        <p className="mt-4 line-clamp-3 text-sm leading-7 opacity-60">{course.description || 'محتوى تعليمي متكامل مصمم لمساعدتك على الفهم والتدريب.'}</p>

                        <div className="mt-5 flex gap-2 text-[10px] font-bold opacity-60">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 dark:bg-slate-800">🎬 {course.lessons.length} درس</span>
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 dark:bg-slate-800">📄 {course.pdfs.length} ملف</span>
                          {course.exam && <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 dark:bg-slate-800">📝 امتحان</span>}
                        </div>

                        {isLoggedIn && userRole === 'student' && course.lessons.length > 0 && (
                          <div className="mt-5">
                            <div className="mb-2 flex justify-between text-[10px] font-black"><span>تقدمك</span><span>{pct}%</span></div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all" style={{ width: `${pct}%` }} /></div>
                          </div>
                        )}

                        <button onClick={() => setSelectedCourse(course)} className={`${buttonPrimary} mt-6 w-full`}>فتح الكورس والتفاصيل</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className={`${cardClass} p-14 text-center`}>
                <div className="text-5xl">📭</div>
                <h2 className="mt-4 text-xl font-black">لا توجد نتائج</h2>
                <p className="mt-2 text-sm opacity-55">جرب تغيير البحث أو الفلتر.</p>
              </div>
            )}
          </section>
        )}

        {/* AUTH */}
        {activeTab === 'auth' && (
          <section className="mx-auto max-w-lg">
            <div className={`${cardClass} overflow-hidden`}>
              <div className="bg-gradient-to-br from-indigo-700 to-violet-700 p-7 text-white">
                <div className="text-3xl">🔐</div>
                <h1 className="mt-3 text-2xl font-black">{authMode === 'login' ? 'أهلاً بعودتك' : 'ابدأ حسابك كطالب'}</h1>
                <p className="mt-2 text-sm text-indigo-100">ادخل إلى عالمك التعليمي في BEDAYA EDU.</p>
              </div>
              <div className="p-6">
                <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
                  <button onClick={() => setAuthMode('login')} className={`rounded-xl py-3 text-xs font-black transition ${authMode === 'login' ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900' : 'opacity-60'}`}>تسجيل الدخول</button>
                  <button onClick={() => setAuthMode('signup')} className={`rounded-xl py-3 text-xs font-black transition ${authMode === 'signup' ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900' : 'opacity-60'}`}>حساب طالب جديد</button>
                </div>

                {authMode === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <label className="block text-xs font-black">البريد الإلكتروني<input className={`${inputClass} mt-2`} type="email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} placeholder="example@edu.com" /></label>
                    <label className="block text-xs font-black">كلمة المرور<input className={`${inputClass} mt-2`} type="password" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} placeholder="••••••••" /></label>
                    <button className={`${buttonPrimary} w-full`} type="submit">دخول المنصة</button>
                  </form>
                ) : (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <label className="block text-xs font-black">اسم الطالب<input className={`${inputClass} mt-2`} value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder="محمد أحمد" /></label>
                    <label className="block text-xs font-black">البريد الإلكتروني<input className={`${inputClass} mt-2`} type="email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} placeholder="student@edu.com" /></label>
                    <label className="block text-xs font-black">كلمة المرور<input className={`${inputClass} mt-2`} type="password" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} placeholder="••••••••" /></label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block text-xs font-black">هاتف الطالب<input className={`${inputClass} mt-2`} value={inputPhone} onChange={(e) => setInputPhone(e.target.value)} placeholder="011..." /></label>
                      <label className="block text-xs font-black">هاتف ولي الأمر<input className={`${inputClass} mt-2`} value={inputParentPhone} onChange={(e) => setInputParentPhone(e.target.value)} placeholder="012..." /></label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block text-xs font-black">المرحلة<select className={`${inputClass} mt-2`} value={inputStage} onChange={(e) => { const stage = e.target.value; setInputStage(stage); setInputGrade(educationalStages.find(s => s.id === stage)?.grades[0]?.id || ''); }}>{educationalStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
                      <label className="block text-xs font-black">الصف<select className={`${inputClass} mt-2`} value={inputGrade} onChange={(e) => setInputGrade(e.target.value)}>{currentAvailableGrades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></label>
                    </div>
                    <button className={`${buttonPrimary} w-full`} type="submit">إنشاء الحساب والدخول</button>
                  </form>
                )}
              </div>
            </div>
          </section>
        )}

        {/* INSTRUCTOR */}
        {activeTab === 'instructor-dashboard' && isLoggedIn && (userRole === 'instructor' || userRole === 'admin') && (
          <section className="space-y-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-500">Creator Studio</span>
              <h1 className="mt-2 text-3xl font-black">لوحة المعلم</h1>
              <p className="mt-2 text-sm opacity-55">أنشئ الكورسات، أضف الفيديوهات وملفات PDF، وانشر الامتحانات.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                ['الكورسات', courses.length],
                ['الدروس', totalLessons],
                ['الامتحانات', courses.filter(c => c.exam).length],
                ['النتائج', examResultsLog.length],
              ].map(([label, value]) => <div key={String(label)} className={`${cardClass} p-5`}><div className="text-2xl font-black">{value}</div><div className="mt-1 text-xs font-bold opacity-50">{label}</div></div>)}
            </div>

            <div className={`${cardClass} p-6 sm:p-8`}>
              <h2 className="mb-6 text-xl font-black">➕ إنشاء كورس جديد</h2>
              <form onSubmit={handleCreateCourse} className="grid gap-4 md:grid-cols-2">
                <input className={inputClass} value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} placeholder="عنوان الكورس" />
                <input className={inputClass} value={newCourseInstructor} onChange={(e) => setNewCourseInstructor(e.target.value)} placeholder="اسم المعلم" />
                <input className={inputClass} value={newCourseCategory} onChange={(e) => setNewCourseCategory(e.target.value)} placeholder="المادة / التصنيف" />
                <input className={inputClass} value={newCoursePrice} onChange={(e) => setNewCoursePrice(e.target.value)} placeholder="السعر: مجاناً أو 150 ج.م" />
                <select className={inputClass} value={newCourseStage} onChange={(e) => { const stage = e.target.value; setNewCourseStage(stage); setNewCourseGrade(educationalStages.find(s => s.id === stage)?.grades[0]?.id || ''); }}>{educationalStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                <select className={inputClass} value={newCourseGrade} onChange={(e) => setNewCourseGrade(e.target.value)}>{targetGradesForNewCourse.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
                <textarea className={`${inputClass} min-h-28 md:col-span-2`} value={newCourseDesc} onChange={(e) => setNewCourseDesc(e.target.value)} placeholder="وصف الكورس وماذا سيتعلم الطالب..." />
                <button className={buttonPrimary} type="submit">نشر الكورس</button>
              </form>
            </div>

            <div className={`${cardClass} p-6 sm:p-8`}>
              <h2 className="mb-6 text-xl font-black">🎬📄 المحتوى التعليمي</h2>
              <select className={`${inputClass} mb-5`} value={selectedCourseForContent} onChange={(e) => setSelectedCourseForContent(e.target.value)}>
                <option value="">-- اختر الكورس --</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>

              <div className="grid gap-5 lg:grid-cols-2">
                <form onSubmit={handleAddVideoToCourse} className="rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
                  <h3 className="font-black text-indigo-500">إضافة فيديو</h3>
                  <div className="mt-4 space-y-3">
                    <input className={inputClass} value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} placeholder="عنوان الدرس" />
                    <input className={inputClass} value={newVideoDuration} onChange={(e) => setNewVideoDuration(e.target.value)} placeholder="مدة الفيديو" />
                    <div className="flex gap-2 text-xs font-bold">
                      <button type="button" onClick={() => setVideoAddMethod('file')} className={videoAddMethod === 'file' ? buttonPrimary : buttonSoft}>رفع ملف</button>
                      <button type="button" onClick={() => setVideoAddMethod('url')} className={videoAddMethod === 'url' ? buttonPrimary : buttonSoft}>رابط خارجي</button>
                    </div>
                    {videoAddMethod === 'file' ? <input className="text-xs" type="file" accept="video/*" onChange={(e) => setNewVideoFile(e.target.files?.[0] || null)} /> : <input className={inputClass} value={newVideoUrlInput} onChange={(e) => setNewVideoUrlInput(e.target.value)} placeholder="https://..." />}
                    <button className={`${buttonPrimary} w-full`} type="submit">إضافة الفيديو</button>
                  </div>
                </form>

                <form onSubmit={handleAddPdfToCourse} className="rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
                  <h3 className="font-black text-blue-500">إضافة PDF / مذكرة</h3>
                  <div className="mt-4 space-y-3">
                    <input className={inputClass} value={newPdfTitle} onChange={(e) => setNewPdfTitle(e.target.value)} placeholder="عنوان الملف" />
                    <div className="flex gap-2 text-xs font-bold">
                      <button type="button" onClick={() => setPdfAddMethod('file')} className={pdfAddMethod === 'file' ? buttonPrimary : buttonSoft}>رفع ملف</button>
                      <button type="button" onClick={() => setPdfAddMethod('url')} className={pdfAddMethod === 'url' ? buttonPrimary : buttonSoft}>رابط خارجي</button>
                    </div>
                    {pdfAddMethod === 'file' ? <input className="text-xs" type="file" accept="application/pdf" onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)} /> : <input className={inputClass} value={newPdfUrlInput} onChange={(e) => setNewPdfUrlInput(e.target.value)} placeholder="https://..." />}
                    <button className={`${buttonPrimary} w-full`} type="submit">إضافة PDF</button>
                  </div>
                </form>
              </div>
            </div>

            <div className={`${cardClass} p-6 sm:p-8`}>
              <h2 className="mb-6 text-xl font-black">📝 إنشاء امتحان ذكي</h2>
              <form onSubmit={handleCreateExam} className="space-y-5">
                <select className={inputClass} value={examCourseTarget} onChange={(e) => setExamCourseTarget(e.target.value)}>
                  <option value="">-- اختر الكورس --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <input className={inputClass} value={examTitle} onChange={(e) => setExamTitle(e.target.value)} placeholder="عنوان الامتحان" />

                <div className="space-y-4">
                  {examQuestions.map((q, qi) => (
                    <div key={qi} className="rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
                      <div className="mb-3 flex items-center justify-between"><span className="font-black">السؤال {qi + 1}</span>{examQuestions.length > 1 && <button type="button" onClick={() => setExamQuestions(old => old.filter((_, i) => i !== qi))} className="text-xs font-black text-rose-500">حذف</button>}</div>
                      <input className={`${inputClass} mb-3`} value={q.question} onChange={(e) => setExamQuestions(old => old.map((x, i) => i === qi ? { ...x, question: e.target.value } : x))} placeholder="نص السؤال..." />
                      <div className="grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt, oi) => <input key={oi} className={inputClass} value={opt} onChange={(e) => setExamQuestions(old => old.map((x, i) => i === qi ? { ...x, options: x.options.map((o, j) => j === oi ? e.target.value : o) } : x))} placeholder={`الاختيار ${oi + 1}`} />)}
                      </div>
                      <label className="mt-3 block text-xs font-bold">الإجابة الصحيحة<select className={`${inputClass} mt-2`} value={q.correctAnswer} onChange={(e) => setExamQuestions(old => old.map((x, i) => i === qi ? { ...x, correctAnswer: Number(e.target.value) } : x))}>{q.options.map((_, oi) => <option key={oi} value={oi}>الاختيار {oi + 1}</option>)}</select></label>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddExamQuestion} className={buttonSoft}>➕ إضافة سؤال</button>
                </div>
                <button className={`${buttonPrimary} w-full`} type="submit">نشر الامتحان</button>
              </form>
            </div>

            {/* Course management */}
            <div className={`${cardClass} overflow-hidden`}>
              <div className="border-b border-slate-200 p-6 dark:border-slate-800"><h2 className="text-xl font-black">إدارة الكورسات</h2></div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {courses.map(c => (
                  <div key={c.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div><div className="font-black">{c.title}</div><div className="mt-1 text-xs opacity-50">{c.instructor} · {c.lessons.length} دروس · {c.pdfs.length} ملفات</div></div>
                    <div className="flex gap-2"><button onClick={() => startEditingCourse(c)} className={buttonSoft}>تعديل</button><button onClick={() => handleDeleteCourse(c.id)} className="rounded-2xl bg-rose-50 px-4 py-2.5 text-xs font-black text-rose-600 dark:bg-rose-950/30">حذف</button></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exam results */}
            <div className={`${cardClass} overflow-hidden`}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-6 dark:border-slate-800">
                <div><h2 className="text-xl font-black">📊 سجل درجات الطلاب والإنذارات</h2><p className="mt-1 text-xs opacity-50">متابعة نتائج الامتحانات.</p></div>
                {examResultsLog.length > 0 && <button onClick={clearResults} className="text-xs font-black text-rose-500">مسح الكل</button>}
              </div>
              {examResultsLog.length ? <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-right text-xs"><thead className="bg-slate-50 dark:bg-slate-950/50"><tr>{['الطالب','الامتحان','الدرجة','الإنذارات','المدة','التاريخ','إجراء'].map(h => <th key={h} className="p-4 font-black opacity-60">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-800">{examResultsLog.map(r => <tr key={r.id}><td className="p-4"><b>{r.studentName}</b><div className="opacity-50">{r.studentPhone}</div></td><td className="p-4">{r.examTitle}</td><td className="p-4 font-black text-emerald-500">{r.score} / {r.total}</td><td className="p-4 font-black text-rose-500">{r.warnings}</td><td className="p-4">{r.duration}</td><td className="p-4 opacity-50">{r.date}</td><td className="p-4"><button onClick={() => deleteResult(r.id)} className="font-black text-rose-500">حذف</button></td></tr>)}</tbody></table></div> : <div className="p-10 text-center text-sm opacity-50">لا توجد نتائج بعد.</div>}
            </div>
          </section>
        )}

        {/* ADMIN */}
        {activeTab === 'admin-dashboard' && isLoggedIn && userRole === 'admin' && (
          <section className="space-y-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-blue-500">Admin Control Center</span>
              <h1 className="mt-2 text-3xl font-black">لوحة إدارة المنصة</h1>
              <p className="mt-2 text-sm opacity-55">إدارة المعلمين والطلاب والحسابات والنتائج.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['👨‍🎓', totalStudents, 'الطلاب'],
                ['👨‍🏫', totalTeachers, 'المعلمون'],
                ['📚', courses.length, 'الكورسات'],
                ['📝', examResultsLog.length, 'نتائج الامتحانات'],
              ].map(([icon, value, label]) => <div key={String(label)} className={`${cardClass} p-6`}><span className="text-2xl">{icon}</span><div className="mt-3 text-3xl font-black">{value}</div><div className="mt-1 text-xs font-bold opacity-50">{label}</div></div>)}
            </div>

            <div className={`${cardClass} p-6 sm:p-8`}>
              <h2 className="mb-6 text-xl font-black">➕ إنشاء حساب معلم</h2>
              <form onSubmit={handleAdminCreateTeacher} className="grid gap-4 md:grid-cols-2">
                <input className={inputClass} value={newTeacherName} onChange={(e) => setNewTeacherName(e.target.value)} placeholder="اسم المعلم" />
                <input className={inputClass} type="email" value={newTeacherEmail} onChange={(e) => setNewTeacherEmail(e.target.value)} placeholder="teacher@edu.com" />
                <input className={inputClass} type="password" value={newTeacherPassword} onChange={(e) => setNewTeacherPassword(e.target.value)} placeholder="كلمة المرور" />
                <input className={inputClass} value={newTeacherPhone} onChange={(e) => setNewTeacherPhone(e.target.value)} placeholder="رقم الهاتف" />
                <button className={buttonPrimary} type="submit">إنشاء وتفعيل المعلم</button>
              </form>
            </div>

            <div className={`${cardClass} overflow-hidden`}>
              <div className="border-b border-slate-200 p-6 dark:border-slate-800"><h2 className="text-xl font-black">👥 إدارة المستخدمين</h2></div>
              <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-right text-xs"><thead className="bg-slate-50 dark:bg-slate-950/50"><tr>{['الاسم','البريد','الدور','الهاتف','ولي الأمر','الحالة','إجراءات'].map(h => <th key={h} className="p-4 font-black opacity-60">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-800">{usersList.map(u => <tr key={u.email}><td className="p-4 font-black">{u.name}</td><td className="p-4">{u.email}</td><td className="p-4"><span className="rounded-full bg-indigo-50 px-3 py-1 font-black text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">{u.role === 'admin' ? 'مدير' : u.role === 'instructor' ? 'معلم' : 'طالب'}</span></td><td className="p-4">{u.phone || '—'}</td><td className="p-4">{u.parentPhone || '—'}</td><td className="p-4 font-black">{u.status === 'active' ? <span className="text-emerald-500">مفعل</span> : <span className="text-rose-500">معطل</span>}</td><td className="p-4"><div className="flex gap-3">{u.email !== ADMIN_EMAIL && <><button onClick={() => handleToggleUserStatus(u.email)} className="font-black text-amber-500">{u.status === 'active' ? 'تعطيل' : 'تفعيل'}</button><button onClick={() => handleDeleteUser(u.email)} className="font-black text-rose-500">حذف</button></>}</div></td></tr>)}</tbody></table></div>
            </div>
          </section>
        )}
      </main>

      {/* COURSE DETAILS MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-md sm:p-6">
          <div className={`${cardClass} max-h-[92vh] w-full max-w-5xl overflow-y-auto`}>
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <div><span className="text-xs font-black text-indigo-500">{selectedCourse.category}</span><h2 className="mt-1 text-xl font-black sm:text-2xl">{selectedCourse.title}</h2><p className="mt-1 text-xs opacity-50">👨‍🏫 {selectedCourse.instructor}</p></div>
              <button onClick={() => setSelectedCourse(null)} className={buttonSoft}>✕ إغلاق</button>
            </div>
            <div className="space-y-6 p-5 sm:p-7">
              <p className="leading-8 opacity-70">{selectedCourse.description}</p>

              <div>
                <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-black">🎬 الدروس المرئية</h3><span className="text-xs font-bold opacity-50">{selectedCourse.lessons.length} درس</span></div>
                <div className="space-y-4">
                  {selectedCourse.lessons.length ? selectedCourse.lessons.map((lesson, idx) => {
                    const done = progress[userEmail]?.includes(String(lesson.id));
                    return (
                      <div key={lesson.id} className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
                        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                          <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-xs font-black text-indigo-600 dark:bg-indigo-500/10">{idx + 1}</span><div><div className="font-black">{lesson.title}</div><div className="mt-1 text-[10px] opacity-50">⏱ {lesson.duration}</div></div></div>
                          {isLoggedIn && userRole === 'student' && <button onClick={() => toggleLessonComplete(selectedCourse.id, lesson.id)} className={`rounded-xl px-3 py-2 text-[10px] font-black ${done ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : buttonSoft}`}>{done ? '✓ مكتمل' : 'تحديد كمكتمل'}</button>}
                        </div>
                        <video controls className="aspect-video w-full bg-black" src={lesson.videoUrl}>متصفحك لا يدعم الفيديو</video>
                      </div>
                    );
                  }) : <div className="rounded-2xl bg-slate-50 p-5 text-sm opacity-50 dark:bg-slate-950">لا توجد دروس مرئية بعد.</div>}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-black">📄 ملفات PDF والملخصات</h3>
                {selectedCourse.pdfs.length ? <div className="grid gap-3 sm:grid-cols-2">{selectedCourse.pdfs.map(pdf => <a key={pdf.id} href={pdf.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-black text-blue-700 transition hover:-translate-y-0.5 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">📄 {pdf.title}<span className="mt-1 block text-[10px] opacity-60">فتح الملف ↗</span></a>)}</div> : <div className="rounded-2xl bg-slate-50 p-5 text-sm opacity-50 dark:bg-slate-950">لا توجد ملفات PDF.</div>}
              </div>

              {selectedCourse.exam && (
                <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-900 dark:bg-indigo-950/30">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><h3 className="font-black text-indigo-700 dark:text-indigo-300">📝 {selectedCourse.exam.title}</h3><p className="mt-1 text-xs opacity-60">{selectedCourse.exam.questions.length} سؤال · مؤقت تلقائي</p></div>
                    <button onClick={() => { setSelectedCourse(null); startExam(selectedCourse.exam!); }} className={buttonPrimary}>بدء الامتحان</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT COURSE MODAL */}
      {editingCourseId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className={`${cardClass} max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6`}>
            <div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-black">تعديل الكورس</h2><button onClick={() => setEditingCourseId(null)} className={buttonSoft}>✕</button></div>
            <form onSubmit={handleUpdateCourse} className="grid gap-4 md:grid-cols-2">
              <input className={inputClass} value={editCourseTitle} onChange={(e) => setEditCourseTitle(e.target.value)} placeholder="العنوان" />
              <input className={inputClass} value={editCourseInstructor} onChange={(e) => setEditCourseInstructor(e.target.value)} placeholder="المعلم" />
              <input className={inputClass} value={editCourseCategory} onChange={(e) => setEditCourseCategory(e.target.value)} placeholder="المادة" />
              <input className={inputClass} value={editCoursePrice} onChange={(e) => setEditCoursePrice(e.target.value)} placeholder="السعر" />
              <select className={inputClass} value={editCourseStage} onChange={(e) => { const s = e.target.value; setEditCourseStage(s); setEditCourseGrade(educationalStages.find(x => x.id === s)?.grades[0]?.id || ''); }}>{educationalStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
              <select className={inputClass} value={editCourseGrade} onChange={(e) => setEditCourseGrade(e.target.value)}>{targetGradesForEditCourse.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
              <textarea className={`${inputClass} min-h-28 md:col-span-2`} value={editCourseDesc} onChange={(e) => setEditCourseDesc(e.target.value)} placeholder="الوصف" />
              <button className={`${buttonPrimary} md:col-span-2`} type="submit">حفظ التعديلات</button>
            </form>
          </div>
        </div>
      )}

      {/* EXAM MODAL */}
      {activeExam && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-md sm:p-6">
          <div className={`${cardClass} max-h-[94vh] w-full max-w-3xl overflow-y-auto`}>
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><div className="text-xs font-black text-indigo-500">SMART EXAM</div><h2 className="mt-1 text-xl font-black">{activeExam.title}</h2></div>
                {!examSubmitted && <div className="flex gap-2"><span className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-600 dark:bg-rose-950/30">⚠️ {cheatingWarnings}/3</span><span className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">⏱ {Math.floor(examSecondsLeft / 60)}:{String(examSecondsLeft % 60).padStart(2, '0')}</span></div>}
              </div>
            </div>

            {!examSubmitted ? (
              <div className="space-y-5 p-5 sm:p-7">
                {activeExam.questions.map((q, qi) => (
                  <div key={qi} className="rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
                    <div className="mb-4 text-sm font-black leading-7">{qi + 1}. {q.question}</div>
                    <div className="grid gap-2">
                      {q.options.map((opt, oi) => <label key={oi} className={`cursor-pointer rounded-2xl border p-4 text-sm font-bold transition ${examAnswers[qi] === oi ? 'border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-600/15' : 'border-slate-200 hover:border-indigo-300 dark:border-slate-800'}`}><input className="sr-only" type="radio" name={`question-${qi}`} checked={examAnswers[qi] === oi} onChange={() => setExamAnswers(old => ({ ...old, [qi]: oi }))} />{opt}</label>)}
                    </div>
                  </div>
                ))}
                <button onClick={() => submitExam(false)} className={`${buttonPrimary} w-full py-4`}>تسليم الامتحان وإنهاء المحاولة</button>
              </div>
            ) : (
              <div className="p-10 text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-emerald-50 text-4xl dark:bg-emerald-500/10">✓</div>
                <h2 className="mt-6 text-3xl font-black">تم إنهاء الامتحان</h2>
                <p className="mt-3 text-lg font-black text-indigo-600 dark:text-indigo-400">درجتك: {examScore} / {activeExam.questions.length}</p>
                <button onClick={() => setActiveExam(null)} className={`${buttonPrimary} mt-7`}>العودة للمنصة</button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className={`border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} mt-12`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-center text-xs opacity-50 sm:px-6">
          <div className="font-black">BEDAYA EDU</div>
          <div>منصة تعليمية ذكية — تعلم، تدرب، وتابع تقدمك.</div>
        </div>
      </footer>
    </div>
  );
}
