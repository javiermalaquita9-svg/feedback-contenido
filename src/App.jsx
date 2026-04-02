import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  LayoutTemplate,
  Video,
  Smartphone,
  CheckCircle2,
  Play,
  FolderOpen,
  MessageSquare,
  ArrowLeft,
  Send,
  Edit2,
  Check,
  X,
  Copy as CopyIcon,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  GalleryHorizontal,
  Pin,
  Tag,
  Settings,
  Hash,
  Users,
  Key,
  ExternalLink
} from 'lucide-react';
import { auth } from './firebase'; // Importa solo auth
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

const STATUSES = {
  en_revision: { label: 'En Revisión', styles: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  listo: { label: 'Listo', styles: 'bg-green-100 text-green-700 border-green-200' },
  publicado: { label: 'Publicado', styles: 'bg-blue-100 text-blue-700 border-blue-200' }
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const getOffsetDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

let globalIdCounter = Date.now();
const generateId = () => String(globalIdCounter++);

const DEFAULT_CONFIG = {
  pillars: ['Servicios', 'Educación', 'Branding', 'Tendencia'],
  objectives: ['Diferenciación', 'Alcance / Recurrencia', 'Autoridad / Sostenibilidad'],
  tags: ['Lanzamiento', 'Verano', 'Moda', 'Educativo', 'Mitos', 'Servicio', 'Oferta', 'Urgente'],
  formats: ['Reels/TikTok', 'Post', 'Carrusell', 'Story'],
  quickLinks: [],
  socialLinks: [],
  rut: '',
  address: '',
  phone: ''
};

const INITIAL_CLIENTS = [
  { id: 'cli_1', name: 'Moda Verano', email: 'contacto@modaverano.com', status: 'Activo', projectsCount: 12, config: { ...DEFAULT_CONFIG, quickLinks: [{name: 'Drive', url: 'https://drive.google.com'}] } },
  { id: 'cli_2', name: 'Tech Store', email: 'admin@techstore.io', status: 'Activo', projectsCount: 5, config: { ...DEFAULT_CONFIG, formats: ['Reels/TikTok', 'Post'] } },
  { id: 'cli_3', name: 'Cafetería Central', email: 'hola@cafecentral.cl', status: 'Inactivo', projectsCount: 0, config: { ...DEFAULT_CONFIG } },
]; // Revertido a INITIAL_CLIENTS para consistencia con el estado local

const INITIAL_PROJECTS = [
  {
    id: '1',
    title: 'Reel de Lanzamiento - Colección Verano',
    description: 'Toma principal en la playa mostrando la nueva colección. Transiciones rápidas con música en tendencia.',
    copy: '¡El verano ya llegó! ☀️🌊 Descubre nuestra nueva colección diseñada para acompañarte en cada aventura.\n\nComenta "VERANO" y te enviamos un código de descuento.',
    objective: 'Diferenciación',
    publishDate: getTodayString(),
    clientId: 'cli_1',
    pillars: { 'Servicios': 30, 'Educación': 0, 'Branding': 50, 'Tendencia': 20 },
    format: 'Reels/TikTok',
    tags: ['lanzamiento', 'verano', 'moda'],
    hashtags: '#Verano #NuevaColeccion #Moda',
    mediaUrl: 'https://drive.google.com/drive/folders/1B0_mD1cQLb3s9S3a-i5n_I6QY7g_3fyl?usp=sharing',
    coverUrl: '',
    carouselLength: 1,
    carouselUrls: [],
    status: 'en_revision',
    createdAt: new Date().toLocaleDateString(),
    comments: [
      { id: 'c1', text: 'El logo al final pasa muy rápido, ¿podemos darle un segundo más?', date: new Date().toLocaleString(), author: 'Cliente' }
    ],
    pinnedCommentIds: ['c1']
  },
  {
    id: '2',
    title: 'Post Carrusel: 5 Mitos de nuestro servicio',
    description: 'Diseño en carrusel de 5 slides desmintiendo mitos comunes. Estilo minimalista con colores de la marca.',
    copy: '¿Creías que era imposible? 🤯 Hoy desmentimos los 5 mitos más grandes sobre nuestro servicio.\n\n👉 Desliza para descubrir la verdad y cuéntanos en los comentarios cuál te sorprendió más.',
    objective: 'Autoridad / Sostenibilidad',
    publishDate: getOffsetDate(2),
    clientId: 'cli_1',
    pillars: { 'Servicios': 20, 'Educación': 60, 'Branding': 20, 'Tendencia': 0 },
    format: 'Carrusell',
    tags: ['educativo', 'mitos', 'servicio'],
    hashtags: '#Mitos #Educacion #Servicios',
    mediaUrl: 'https://drive.google.com/drive/folders/1z2y3x4w5v6u7t8s9r0q1p2o3n4m5l6k?usp=sharing',
    coverUrl: '',
    carouselLength: 2,
    carouselUrls: [],
    status: 'listo',
    createdAt: new Date().toLocaleDateString(),
    comments: [],
    pinnedCommentIds: []
  },
  {
    id: '3',
    title: 'Story Promocional - Oferta Flash',
    description: 'Video vertical con enfoque directo en la oferta de 24 horas. Dejar espacio arriba y abajo para los stickers de Instagram.',
    copy: '¡La oferta flash acaba de empezar! 🔥 Tienes 24 horas para aprovechar el descuento.\n\nToca el enlace para ir a la tienda.',
    objective: 'Alcance / Recurrencia',
    publishDate: getOffsetDate(1),
    clientId: 'cli_2',
    pillars: { 'Servicios': 60, 'Educación': 0, 'Branding': 0, 'Tendencia': 40 },
    format: 'Story',
    tags: ['oferta', 'urgente'],
    hashtags: '#OfertaFlash #Descuento',
    mediaUrl: 'https://drive.google.com/drive/folders/17UXr9f5luaThQXCFtb3bDvn_8ljJMx5u?usp=sharing',
    coverUrl: '',
    carouselLength: 1,
    carouselUrls: [],
    status: 'en_revision',
    createdAt: new Date().toLocaleDateString(),
    comments: [],
    pinnedCommentIds: []
  }
];

export default function App() {
  // Estados de autenticación y rol
  const [user, setUser] = useState(null); // Almacena el objeto de usuario de Firebase
  const [role, setRole] = useState(null); // 'admin' o 'cliente'
  const [authLoading, setAuthLoading] = useState(true); // Para mostrar un loader mientras se verifica la sesión
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Gestión de clientes (ahora localmente)
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [editingClientId, setEditingClientId] = useState(INITIAL_CLIENTS[0].id);

  const [newConfigItems, setNewConfigItems] = useState({ pillars: '', objectives: '', tags: '', formats: '' });
  const [newQuickLink, setNewQuickLink] = useState({ name: '', url: '' });
  const [newSocialLink, setNewSocialLink] = useState({ name: '', url: '' });
  const [isClientDataSaved, setIsClientDataSaved] = useState(false);

  // Extraemos la info del primer cliente para inicializar el formulario de "Crear"
  // Asegura que currentInitialClient siempre esté definido.
  const currentInitialClient = clients.length > 0 ? clients[0] : { id: '', name: '', email: '', status: '', projectsCount: 0, config: DEFAULT_CONFIG };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    copy: '',
    clientId: currentInitialClient.id,
    objective: currentInitialClient.config.objectives[0] || '',
    publishDate: getTodayString(),
    pillars: {},
    format: currentInitialClient.config.formats[0] || '',
    mediaUrl: '',
    coverUrl: '',
    tags: [],
    hashtags: '',
    carouselLength: 2,
    carouselUrls: ['', '']
  });

  const [savedProjects, setSavedProjects] = useState(INITIAL_PROJECTS);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentView, setCurrentView] = useState('contenido');
  const [rawActiveTab, setActiveTab] = useState('Reels/TikTok');
  const [filterClientId, setFilterClientId] = useState('all');
  
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [newComment, setNewComment] = useState('');
  
  const [isEditingCopy, setIsEditingCopy] = useState(false);
  const [editCopyValue, setEditCopyValue] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Estados para el calendario
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Estado para el drag & drop
  const [dragOverDate, setDragOverDate] = useState(null);
  const dragTimeoutRef = useRef(null);

  // --- Efecto para escuchar el estado de autenticación ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Lógica simple para determinar el rol. En una app real, esto podría venir de Firestore.
        if (currentUser.email === 'wong.luiggi@gmail.com') { // <-- ¡IMPORTANTE! Cambia esto por tu email de administrador
          setRole('admin');
        } else {
          setRole('cliente');
        }
      } else {
        setRole(null);
      }
      setAuthLoading(false);
    });

    // Limpiar el listener al desmontar el componente
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePillarClick = (e, pillarName) => {
    e.preventDefault();
    setFormData(prev => ({
      ...prev,
      pillars: {
        ...prev.pillars,
        [pillarName]: (prev.pillars[pillarName] || 0) >= 100 ? 0 : (prev.pillars[pillarName] || 0) + 10
      }
    }));
  };

  const totalPillars = Object.values(formData.pillars).reduce((acc, curr) => acc + curr, 0);

  // Referencias dinámicas basadas en el cliente seleccionado en el form o la configuración
  const formClient = clients.find(c => c.id === formData.clientId) || currentInitialClient;
  const editingClient = clients.find(c => c.id === editingClientId) || clients[0];
  
  // Format Tabs calculation
  const activeClientForTabs = filterClientId !== 'all' ? clients.find(c => c.id === filterClientId) : null;
  const displayFormats = activeClientForTabs ? activeClientForTabs.config.formats : Array.from(new Set(clients.flatMap(c => c.config.formats)));

  const activeTab = displayFormats.includes(rawActiveTab) ? rawActiveTab : (displayFormats[0] || 'Reels/TikTok');

  const handleClientChange = (e) => {
    const newClientId = e.target.value;
    const newClient = clients.find(c => c.id === newClientId);
    setFormData(prev => ({
      ...prev,
      clientId: newClientId,
      // Asegurarse de que el formato y objetivo sean válidos para el nuevo cliente
      format: newClient?.config.formats[0] || '',
      objective: newClient?.config.objectives[0] || '',
      pillars: {},
      tags: []
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProject = {
      id: generateId(),
      ...formData,
      status: 'en_revision',
      createdAt: new Date().toISOString(), // Usar ISO para consistencia
      comments: [],
      pinnedCommentIds: []
    };
    
    setSavedProjects(prev => [newProject, ...prev]);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);

    setFormData({
      title: '',
      description: '',
      copy: '',
      clientId: currentInitialClient.id, // Reset a los valores iniciales seguros para el cliente
      objective: currentInitialClient.config.objectives[0] || '',
      publishDate: getTodayString(),
      pillars: {},
      format: currentInitialClient.config.formats[0] || '',
      mediaUrl: '',
      coverUrl: '',
      tags: [],
      hashtags: '',
      carouselLength: 2,
      carouselUrls: ['', '']
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("¡Enlace copiado al portapapeles!");
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedProjectId) return;

    const updatedProjects = savedProjects.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          comments: [
            ...(p.comments || []), 
            { 
              id: generateId(), 
              text: newComment, 
              date: new Date().toLocaleString(),
              author: role === 'admin' ? 'Administrador' : 'Cliente'
            }
          ]
        };
      }
      return p;
    });

    setSavedProjects(updatedProjects);
    setNewComment('');
  };

  const filteredProjects = savedProjects.filter(project => 
    project.format === activeTab && 
    (filterClientId === 'all' || project.clientId === filterClientId || role === 'cliente')
  );

  const selectedProject = savedProjects.find(p => p.id === selectedProjectId);

  const handleCopyToClipboard = () => {
    if (!selectedProject) return;
    const textArea = document.createElement("textarea");
    textArea.value = selectedProject.copy || "Sin copy proporcionado.";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar', err);
    }
    document.body.removeChild(textArea);
  };

  const handleSaveCopy = () => {
    setSavedProjects(prev => prev.map(p => 
      p.id === selectedProjectId ? { ...p, copy: editCopyValue } : p
    ));
    setIsEditingCopy(false);
  };

  const handlePinComment = (projectId, commentId) => {
    setSavedProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const pinned = p.pinnedCommentIds || [];
        if (pinned.includes(commentId)) {
          return { ...p, pinnedCommentIds: pinned.filter(id => id !== commentId) };
        } else {
          if (pinned.length >= 3) {
            alert('Máximo 3 correcciones fijadas permitidas.');
            return p;
          }
          return { ...p, pinnedCommentIds: [...pinned, commentId] };
        }
      }
      return p;
    }));
  };

  const handleStatusChange = (projectId, newStatus) => {
    setSavedProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, status: newStatus } : p
    ));
  };

  const navigateTo = (view) => {
    setCurrentView(view);
    setSelectedProjectId(null);
    setIsEditingCopy(false);
  };

  const openProjectDetail = (projectId) => {
    setSelectedProjectId(projectId);
    setCurrentView('contenido'); 
  };

  // --- Lógica del Calendario ---
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const nextMonthIndex = currentMonth === 11 ? 0 : currentMonth + 1;

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const prevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) { setCurrentYear(y => y - 1); return 11; }
      return prev - 1;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) { setCurrentYear(y => y + 1); return 0; }
      return prev + 1;
    });
  };

  const calendarDays = [];

  for(let i = 0; i < firstDayOfMonth; i++) {
    const day = daysInPrevMonth - firstDayOfMonth + 1 + i;
    calendarDays.push({
      day,
      dateStr: `${prevMonthYear}-${String(prevMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      isCurrentMonth: false
    });
  }

  for(let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      dateStr: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      isCurrentMonth: true
    });
  }

  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  if (remainingCells < 7) {
    for(let i = 1; i <= remainingCells; i++) {
      calendarDays.push({
        day: i,
        dateStr: `${nextMonthYear}-${String(nextMonthIndex + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        isCurrentMonth: false
      });
    }
  }

  // --- Lógica Drag & Drop ---
  const handleDragStart = (e, projectId) => {
    e.dataTransfer.setData('projectId', projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, dateStr) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverDate !== dateStr) {
      setDragOverDate(dateStr);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverDate(null);
  };

  const handleDrop = (e, targetDateStr) => {
    e.preventDefault();
    setDragOverDate(null);
    const projectId = e.dataTransfer.getData('projectId');
    if (projectId) {
      setSavedProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, publishDate: targetDateStr } : p
      ));
    }
  };

  const handleDragOverButton = (e, direction) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dragTimeoutRef.current) {
      dragTimeoutRef.current = setTimeout(() => {
        if (direction === 'prev') prevMonth();
        if (direction === 'next') nextMonth();
        dragTimeoutRef.current = null;
      }, 800);
    }
  };

  const handleDragLeaveButton = () => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
  };

  const renderConfigSection = (title, key, description) => {
    const configArray = editingClient.config[key] || [];
    const handleAdd = () => {
      const val = newConfigItems[key].trim();
      if (val && !configArray.includes(val)) {
        setClients(prev => prev.map(c => c.id === editingClientId ? { ...c, config: { ...c.config, [key]: [...c.config[key], val] } } : c));
        setNewConfigItems(prev => ({ ...prev, [key]: '' }));
      }
    };
    const handleRemove = (item) => {
      setClients(prev => prev.map(c => c.id === editingClientId ? { ...c, config: { ...c.config, [key]: c.config[key].filter(i => i !== item) } } : c));
    };
    return (
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">{title}</label>
        {description && <p className="text-[10px] text-slate-500 mb-3">{description}</p>}
        <div className="flex flex-wrap gap-2 mb-3">
          {configArray.map(item => (
            <span key={item} className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200">
              {item}
              <button onClick={() => handleRemove(item)} className="text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full p-0.5 transition-colors"><X size={12}/></button>
            </span>
          ))}
          {configArray.length === 0 && <span className="text-xs text-slate-400 italic">No hay elementos configurados.</span>}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newConfigItems[key]} onChange={e => setNewConfigItems({...newConfigItems, [key]: e.target.value})} onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }} placeholder="Agregar nuevo..." className="flex-1 p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
          <button onClick={handleAdd} className="bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm">
            <Plus size={16}/> Agregar
          </button>
        </div>
      </div>
    );
  };

  const handleAddQuickLink = () => {
    if (newQuickLink.name.trim() && newQuickLink.url.trim()) {
      setClients(prev => prev.map(c => c.id === editingClientId ? { ...c, config: { ...c.config, quickLinks: [...(c.config.quickLinks || []), newQuickLink] } } : c));
      setNewQuickLink({ name: '', url: '' });
    }
  };
  const handleRemoveQuickLink = (idx) => {
    setClients(prev => prev.map(c => c.id === editingClientId ? { ...c, config: { ...c.config, quickLinks: c.config.quickLinks.filter((_, i) => i !== idx) } } : c));
  };

  // eslint-disable-next-line no-unused-vars
  const handleCarouselLengthChange = (e) => {
    const length = parseInt(e.target.value, 10) || 1;
    const newUrls = [...formData.carouselUrls];
    while (newUrls.length < length) newUrls.push('');
    setFormData(prev => ({ ...prev, carouselLength: length, carouselUrls: newUrls.slice(0, length) }));
  };

  const handleAddSocialLink = () => {
    if (newSocialLink.name.trim() && newSocialLink.url.trim()) {
      setClients(prev => prev.map(c => c.id === editingClientId ? { ...c, config: { ...c.config, socialLinks: [...(c.config.socialLinks || []), newSocialLink] } } : c));
      setNewSocialLink({ name: '', url: '' });
    }
  };
  const handleRemoveSocialLink = (idx) => {
    setClients(prev => prev.map(c => c.id === editingClientId ? { ...c, config: { ...c.config, socialLinks: c.config.socialLinks.filter((_, i) => i !== idx) } } : c));
  };
  const handleClientDataChange = (e) => {
    const { name, value } = e.target;
    setClients(prev => prev.map(c => {
      if (c.id === editingClientId) {
        if (name === 'name' || name === 'email') {
          return { ...c, [name]: value };
        }
        return { ...c, config: { ...c.config, [name]: value } };
      }
      return c;
    }));
  };

  const handleSaveClientData = () => {
    setIsClientDataSaved(true);
    setTimeout(() => setIsClientDataSaved(false), 2000);
  };
  let headerClient = null;
  if (role === 'cliente') {
    headerClient = clients[0]; // Simulación del cliente que ha iniciado sesión
  } else if (currentView === 'configuracion') {
    headerClient = editingClient;
  } else if (currentView === 'crear') {
    headerClient = formClient;
  } else if (filterClientId !== 'all') {
    headerClient = clients.find(c => c.id === filterClientId);
  }
  const headerConfig = headerClient?.config;

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <p className="text-slate-500">Cargando aplicación...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
          <h1 className="text-xl font-bold text-center text-slate-800 mb-6">Iniciar Sesión</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                placeholder="tu@correo.com"
                className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Contraseña</label>
              <input 
                type="password" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* --- MENU LATERAL --- */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-200 shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <span className="font-black text-lg text-slate-800 tracking-tight leading-tight">Feedback de contenido</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Menú Principal</p>
          
          {role === 'admin' && (
            <button onClick={() => navigateTo('crear')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'crear' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
              <Plus size={18} className={currentView === 'crear' ? 'text-indigo-600' : 'text-slate-400'} /> Crear Pieza
            </button>
          )}
          
          <button onClick={() => navigateTo('contenido')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'contenido' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            <FolderOpen size={18} className={currentView === 'contenido' ? 'text-indigo-600' : 'text-slate-400'} /> Gestor Contenido
          </button>
          <button onClick={() => navigateTo('calendario')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'calendario' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            <CalendarIcon size={18} className={currentView === 'calendario' ? 'text-indigo-600' : 'text-slate-400'} /> Calendario
          </button>

          {role === 'admin' && (
            <button onClick={() => navigateTo('clientes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'clientes' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
              <Users size={18} className={currentView === 'clientes' ? 'text-indigo-600' : 'text-slate-400'} /> Gestión Clientes
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-600 truncate">{user.email}</p>
            <button onClick={() => signOut(auth)} className="text-[10px] font-bold text-indigo-600 hover:underline">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 h-screen overflow-y-auto relative flex flex-col">
        
        {/* CABECERA GLOBAL: ACCESOS RÁPIDOS Y CLIENTE */}
        {( (headerConfig?.quickLinks && headerConfig.quickLinks.length > 0) || (headerConfig?.socialLinks && headerConfig.socialLinks.length > 0) || headerClient?.name ) && (
          <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-6 shrink-0 sticky top-0 z-10 shadow-sm">
            
            <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
              {headerConfig?.quickLinks?.length > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Accesos</span>
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar items-center">
                    {headerConfig.quickLinks.map((link, idx) => (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:shadow-sm px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border border-indigo-100">
                        <LinkIcon size={12} /> {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {headerConfig?.quickLinks?.length > 0 && headerConfig?.socialLinks?.length > 0 && <div className="w-px h-6 bg-slate-200 shrink-0"></div>}
  
              {headerConfig?.socialLinks?.length > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Redes</span>
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar items-center">
                    {headerConfig.socialLinks.map((link, idx) => (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-pink-50 text-pink-700 hover:bg-pink-100 hover:shadow-sm px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border border-pink-100">
                        <LinkIcon size={12} /> {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {headerClient?.name && (
              <div className="flex items-center gap-3 shrink-0 pl-4 border-l border-slate-200">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cliente</span>
                  <span className="text-sm font-bold text-slate-800 leading-tight">{headerClient.name}</span>
                </div>
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-sm">
                  {headerClient.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VISTA: CREAR */}
        {currentView === 'crear' && role === 'admin' && (
          <div className="p-6 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Crear Nueva Revisión</h1>
                <p className="text-sm text-slate-500 mt-1">Sube los enlaces de Drive y asigna fechas para el calendario.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la pieza</label>
                            <input type="text" name="title" required value={formData.title} onChange={handleInputChange} placeholder="Ej: Reel Verano - Promoción Zapatos" className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Cliente</label>
                            <select name="clientId" required value={formData.clientId} onChange={handleClientChange} className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-600">
                              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Publicación</label>
                            <input type="date" name="publishDate" required value={formData.publishDate} onChange={handleInputChange} className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-600" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Descripción del video</label>
                          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Detalles visuales, notas para edición..." rows="3" className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" />
                        </div>
                      </div>

                      {/* Objetivo */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Objetivo Principal</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {formClient.config.objectives.slice(0, 3).map(obj => (
                            <label key={obj} className={`cursor-pointer transition-all flex items-center justify-center text-center p-2 rounded-lg border text-xs ${formData.objective === obj ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'}`}>
                              <input type="radio" name="objective" value={obj} checked={formData.objective === obj} onChange={handleInputChange} className="hidden" />
                              <span>{obj}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Pilares */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-xs font-bold text-slate-700">Pilares de contenido</label>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${totalPillars === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>Total: {totalPillars}%</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {formClient.config.pillars.map(pillar => (
                            <div key={pillar}>
                              <label className="block text-[10px] text-slate-500 capitalize mb-1">{pillar}</label>
                              <button type="button" onClick={(e) => handlePillarClick(e, pillar)} className="w-full p-2 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all text-sm font-black text-indigo-600 flex justify-between items-center shadow-sm select-none">
                                <span>{formData.pillars[pillar] || 0}</span>
                                <span className="text-slate-400 text-[10px]">%</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Formato */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Formato</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {formClient.config.formats.map(format => (
                            <label key={format} className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border cursor-pointer transition-all ${formData.format === format ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'}`}>
                              <input type="radio" name="format" value={format} checked={formData.format === format} onChange={handleInputChange} className="hidden" />
                              <div className="mb-1"><LayoutTemplate size={16} className="opacity-70" /></div>
                              <span className="text-[10px] font-bold text-center">{format}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Enlaces */}
                      <div>
                        <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1">
                          <LinkIcon size={12} className="text-slate-400" /> Enlace de la Carpeta (Drive)
                        </label>
                        <input type="url" name="mediaUrl" required value={formData.mediaUrl} onChange={handleInputChange} placeholder="https://drive.google.com/drive/folders/..." className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>

                      <div>
                        <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-2"><Tag size={12} className="text-slate-400" /> Etiquetas</label>
                        <div className="flex flex-wrap gap-2">
                          {formClient.config.tags.map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag] }))}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${formData.tags.includes(tag) ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Hashtags & Copy */}
                      <div className="flex flex-col gap-4 pt-2">
                        <div>
                          <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1"><Hash size={12} className="text-slate-400" /> Hashtags</label>
                          <textarea name="hashtags" value={formData.hashtags} onChange={handleInputChange} placeholder="#verano #moda..." rows="2" className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" />
                        </div>
                        <div>
                          <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1"><LayoutTemplate size={12} className="text-slate-400" /> Copy de la publicación</label>
                          <textarea name="copy" value={formData.copy} onChange={handleInputChange} placeholder="Texto que acompañará al post..." rows="4" className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        {isSuccess ? (
                          <div className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle2 size={16} /> Proyecto creado</div>
                        ) : (
                          <span className="text-[10px] text-slate-400">Los datos se guardan localmente.</span>
                        )}
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm"><Plus size={16} /> Crear</button>
                      </div>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* VISTA: CONTENIDO & DETALLE */}
        {currentView === 'contenido' && (
          <div className="p-6 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
              
              {!selectedProjectId ? (
                <>
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestor de Contenido</h1>
                    <p className="text-sm text-slate-500 mt-1">Navega y revisa todas tus piezas organizadas por formato.</p>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 mb-8 gap-4">
                    <div className="flex overflow-x-auto hide-scrollbar gap-6 w-full md:w-auto">
                      {displayFormats.map(format => {
                        const count = savedProjects.filter(p => p.format === format && (filterClientId === 'all' || p.clientId === filterClientId || role === 'cliente')).length;
                        return (
                          <button
                            key={format}
                            onClick={() => setActiveTab(format)}
                            className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === format ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                          >
                            <LayoutTemplate size={16} className="opacity-50" /> {format}
                            <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full ${activeTab === format ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
                          </button>
                        );
                      })}
                    </div>
                    {role === 'admin' && (
                      <select 
                        value={filterClientId} 
                        onChange={(e) => setFilterClientId(e.target.value)}
                        className="mb-3 p-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg shadow-sm outline-none hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <option value="all">Ver Todos los Clientes</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    )}
                  </div>

                  {filteredProjects.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-slate-400">
                      <FolderOpen size={48} className="mb-4 opacity-50 text-indigo-300" />
                      <p className="font-bold text-slate-600">No hay piezas en esta categoría</p>
                      <button onClick={() => navigateTo('crear')} className="mt-4 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-all">Ir a Crear</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                      {filteredProjects.map(project => (
                        <div key={project.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-indigo-200">
                          <div className="p-3 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2 gap-2">
                              <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2">{project.title}</h3>
                              <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold border whitespace-nowrap ${STATUSES[project.status || 'en_revision']?.styles}`}>
                                {STATUSES[project.status || 'en_revision']?.label}
                              </span>
                            </div>
                            {role === 'admin' && (
                              <p className="text-[10px] text-slate-500 font-medium mb-2 flex items-center gap-1">
                                <Users size={10}/> {clients.find(c => c.id === project.clientId)?.name || 'Sin cliente asignado'}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold border border-slate-200 flex items-center gap-1">
                                <CalendarIcon size={10}/> {project.publishDate}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-bold border border-indigo-100">
                                {project.objective}
                              </span>
                            </div>
                          </div>
                          <div className="p-2 bg-slate-50 border-t border-slate-100">
                            <button onClick={() => openProjectDetail(project.id)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                              <MessageSquare size={14} /> Detalle
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                
                /* --- VISTA DE DETALLE --- */
                selectedProject && (
                  <div className="space-y-6 pb-20">
                    {(() => {
                      return (
                    <>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedProjectId(null)} className="p-2 hover:bg-slate-200 bg-slate-100 rounded-full transition-all text-slate-600">
                        <ArrowLeft size={20} />
                      </button>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{selectedProject.title}</h2>
                        <div className="flex flex-wrap items-center gap-4 mt-1">
                          <p className="text-sm text-slate-500 flex items-center gap-1.5"><CalendarIcon size={14}/> Agendado para: <strong className="text-slate-700">{selectedProject.publishDate}</strong></p>
                          {role === 'admin' && <p className="text-sm text-slate-500 flex items-center gap-1.5"><Users size={14}/> Cliente: <strong className="text-slate-700">{clients.find(c => c.id === selectedProject.clientId)?.name}</strong></p>}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                      <div className="xl:col-span-7 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                          <div className="w-full bg-slate-50 p-6 md:p-8 flex items-center justify-center gap-6 relative overflow-hidden border-b border-slate-200">
                            <a href={selectedProject.mediaUrl} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-all shadow-lg shadow-indigo-200 flex items-center gap-3 text-sm">
                              <FolderOpen size={20} /> Abrir Carpeta de Archivos
                            </a>
                          </div>

                          <div className="p-6 md:p-8 space-y-6">
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Descripción del Video</h4>
                              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{selectedProject.description || "Sin descripción proporcionada."}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                              <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Objetivo</h4>
                                <span className="inline-block px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 w-full truncate text-center">
                                  {selectedProject.objective || 'Indefinido'}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Formato</h4>
                                <span className="inline-block px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 capitalize w-full truncate text-center">
                                  {selectedProject.format || 'Indefinido'}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Estado</h4>
                                <select 
                                  value={selectedProject.status || 'en_revision'}
                                  onChange={(e) => handleStatusChange(selectedProject.id, e.target.value)}
                                  className={`w-full px-2 py-2 rounded-lg text-xs font-bold border outline-none cursor-pointer text-center appearance-none ${STATUSES[selectedProject.status || 'en_revision']?.styles}`}
                                >
                                  {Object.entries(STATUSES).map(([key, {label}]) => (
                                    <option key={key} value={key} className="bg-white text-slate-900 font-medium">{label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Distribución de Pilares</h4>
                              <div className="grid grid-cols-4 gap-2 text-center">
                                {clients.find(c => c.id === selectedProject.clientId)?.config.pillars.map(pillar => (
                                  <div key={pillar} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="block text-xl font-black text-indigo-600 mb-1">{selectedProject.pillars?.[pillar] || 0}%</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{pillar}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Etiquetas</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedProject.tags && selectedProject.tags.length > 0 ? (
                                  selectedProject.tags.map(tag => (
                                    <span key={tag} className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 capitalize">
                                      {tag}
                                    </span>
                                  ))
                                ) : (
                                  <p className="text-sm text-slate-500">Sin etiquetas.</p>
                                )}
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Hashtags</h4>
                              <p className="text-sm text-indigo-600 font-medium">{selectedProject.hashtags || "Sin hashtags."}</p>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Copy de la Publicación</h4>
                                <div className="flex gap-2">
                                  {!isEditingCopy ? (
                                    <>
                                      <button onClick={handleCopyToClipboard} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors rounded-lg" title="Copiar">
                                        {isCopied ? <Check size={18} className="text-green-600" /> : <CopyIcon size={18} />}
                                      </button>
                                      <button onClick={() => { setEditCopyValue(selectedProject.copy || ''); setIsEditingCopy(true); }} className="p-1.5 text-indigo-600 hover:bg-indigo-50 transition-colors rounded-lg" title="Editar">
                                        <Edit2 size={18} />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button onClick={() => setIsEditingCopy(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors rounded-lg"><X size={18} /></button>
                                      <button onClick={handleSaveCopy} className="p-1.5 text-white bg-green-600 hover:bg-green-700 transition-colors rounded-lg"><Check size={18} /></button>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {!isEditingCopy ? (
                                <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-16">
                                  {selectedProject.copy || "Sin copy proporcionado."}
                                </div>
                              ) : (
                                <textarea value={editCopyValue} onChange={(e) => setEditCopyValue(e.target.value)} placeholder="Escribe el copy..." className="w-full text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 outline-none resize-none min-h-30" autoFocus />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="xl:col-span-5 h-150 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-8">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                          <MessageSquare size={18} className="text-indigo-600" />
                          <h3 className="font-bold text-slate-800">Correcciones y Feedback</h3>
                        </div>
                        
                        {/* Pinned Comment Area */}
                        <div className="p-4 border-b border-slate-200 bg-yellow-50/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Pin size={16} className="text-yellow-700" />
                            <h4 className="font-bold text-sm text-yellow-800">Correcciones Fijadas ({(selectedProject.pinnedCommentIds || []).length}/3)</h4>
                          </div>
                          {(selectedProject.pinnedCommentIds || []).length > 0 ? (
                            <div className="space-y-2">
                              {(selectedProject.pinnedCommentIds || []).map(id => {
                                const pinnedComment = selectedProject.comments?.find(c => c.id === id);
                                if (!pinnedComment) return null;
                                return (
                                  <div key={id} className="bg-white p-3 rounded-lg border border-yellow-200 shadow-sm relative group">
                                    <button onClick={() => handlePinComment(selectedProject.id, id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                                    <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">{pinnedComment.author}</p>
                                    <p className="text-sm text-slate-800">{pinnedComment.text}</p>
                                    <span className="text-[9px] text-slate-400 mt-1.5 block text-right">{pinnedComment.date}</span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500">No hay correcciones fijadas.</p>
                          )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                          {!selectedProject.comments || selectedProject.comments.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                              <MessageSquare size={32} className="mb-2 opacity-50 text-indigo-300" />
                              <p className="text-sm font-medium">Aún no hay correcciones.</p>
                              <p className="text-xs mt-1 text-center max-w-50">Ingresa los comentarios solicitados por el cliente aquí abajo.</p>
                            </div>
                          ) : (
                            selectedProject.comments.map(comment => (
                              <div key={comment.id} className="flex items-start justify-end gap-2">
                                <button 
                                  onClick={() => handlePinComment(selectedProject.id, comment.id)}
                                  className={`p-1.5 rounded-full transition-colors shrink-0 ${(selectedProject.pinnedCommentIds || []).includes(comment.id) ? 'bg-yellow-200 text-yellow-700' : 'text-slate-300 hover:bg-slate-200 hover:text-slate-500'}`}
                                  title="Fijar corrección"
                                >
                                  <Pin size={14} />
                                </button>
                                <div className="flex flex-col items-end max-w-[85%]">
                                  <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-sm">
                                    <p className="text-[10px] font-bold uppercase opacity-75 mb-1">{comment.author}</p>
                                    <p className="text-sm">{comment.text}</p>
                                  </div>
                                  <span className="text-[9px] text-slate-400 mt-1.5 mr-1">{comment.date}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="p-4 bg-white border-t border-slate-200">
                          <div className="relative flex items-end gap-2">
                            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escribe una corrección..." className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none min-h-15" />
                            <button onClick={handleAddComment} className="p-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shrink-0"><Send size={18} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                      );
                    })()}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* --- VISTA: CALENDARIO --- */}
        {currentView === 'calendario' && (
          <div className="p-6 md:p-8 lg:p-12 min-h-full">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Calendario de Publicación</h1>
                  <p className="text-sm text-slate-500 mt-1">Organiza y revisa los estados de tus piezas por mes.</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                  <button onClick={prevMonth} onDragOver={(e) => handleDragOverButton(e, 'prev')} onDragLeave={handleDragLeaveButton} onDrop={handleDragLeaveButton} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"><ChevronLeft size={20} /></button>
                  <span className="font-bold text-slate-800 min-w-30 text-center">{monthNames[currentMonth]} {currentYear}</span>
                  <button onClick={nextMonth} onDragOver={(e) => handleDragOverButton(e, 'next')} onDragLeave={handleDragLeaveButton} onDrop={handleDragLeaveButton} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"><ChevronRight size={20} /></button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="p-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-0">{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                  {calendarDays.map(({ day, dateStr, isCurrentMonth }) => {
                    const dayProjects = savedProjects.filter(p => p.publishDate === dateStr);
                    const isToday = dateStr === getTodayString();

                    return (
                      <div 
                        key={dateStr} 
                        className={`min-h-30 border-r border-b border-slate-100 p-2 relative group transition-colors ${!isCurrentMonth ? 'bg-slate-50/50' : ''} ${dragOverDate === dateStr ? 'bg-indigo-50 border-indigo-300 ring-inset ring-2 ring-indigo-300' : 'hover:bg-slate-50'}`}
                        onDragOver={(e) => handleDragOver(e, dateStr)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, dateStr)}
                      >
                        <span className={`text-xs font-bold p-1 rounded-md ${isToday ? 'bg-indigo-600 text-white' : !isCurrentMonth ? 'text-slate-300' : 'text-slate-400'}`}>
                          {day}
                        </span>
                        
                        <div className="mt-2 flex flex-col gap-1.5">
                          {dayProjects.map(project => {
                            return (
                              <div
                                key={project.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, project.id)}
                                className={`text-left p-1.5 rounded-lg border shadow-sm flex flex-col gap-1.5 cursor-grab active:cursor-grabbing ${STATUSES[project.status || 'en_revision']?.styles}`}
                                title={project.title}
                              >
                                <button onClick={() => openProjectDetail(project.id)} className="w-full text-left hover:opacity-80 transition-opacity">
                                  <div className="text-[10px] font-bold leading-tight truncate w-full">{project.title}</div>
                                  <div className="flex flex-col w-full gap-0.5 mt-0.5">
                                    <span className="text-[8px] opacity-80 uppercase tracking-wider truncate w-full text-left">{project.format}</span>
                                    <span className="text-[7.5px] opacity-60 truncate w-full text-left font-medium">{project.objective}</span>
                                  </div>
                                </button>
                                
                                <select 
                                  value={project.status || 'en_revision'}
                                  onChange={(e) => { e.stopPropagation(); handleStatusChange(project.id, e.target.value); }}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`w-full rounded-md text-[9px] font-bold border outline-none cursor-pointer appearance-none text-center bg-white/50 border-current/30`}
                                >
                                  {Object.entries(STATUSES).map(([key, {label}]) => (
                                    <option key={key} value={key} className="bg-white text-slate-900 font-medium">{label}</option>
                                  ))}
                                </select>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VISTA: CONFIGURACIÓN */}
        {currentView === 'configuracion' && role === 'admin' && (
          <div className="p-6 md:p-8 lg:p-12">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigateTo('clientes')} className="p-2 hover:bg-slate-200 bg-slate-100 rounded-full transition-all text-slate-600 shadow-sm border border-slate-200">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Configuración: {editingClient.name}</h1>
                  <p className="text-sm text-slate-500 mt-1">Ajusta los parámetros, pilares y datos de este cliente en específico.</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
                 
                 {/* Datos del Cliente */}
                 <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Datos del Cliente</label>
                  <p className="text-[10px] text-slate-500 mb-3">Información general y de contacto del cliente.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <input type="text" name="name" value={editingClient.name} onChange={handleClientDataChange} placeholder="Nombre completo / Empresa" className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <input type="text" name="rut" value={editingClient.config.rut} onChange={handleClientDataChange} placeholder="RUT / Documento de Identidad" className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <input type="email" name="email" value={editingClient.email} onChange={handleClientDataChange} placeholder="Correo electrónico" className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <input type="tel" name="phone" value={editingClient.config.phone} onChange={handleClientDataChange} placeholder="Teléfono" className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <input type="text" name="address" value={editingClient.config.address} onChange={handleClientDataChange} placeholder="Dirección física" className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none md:col-span-2" />
                  </div>
                  <div className="flex justify-end mb-6">
                    <button onClick={handleSaveClientData} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2">
                      {isClientDataSaved ? <><Check size={16}/> Guardado</> : "Guardar Información"}
                    </button>
                  </div>
                  
                  <label className="block text-sm font-bold text-slate-700 mb-1">Redes Sociales</label>
                  <p className="text-[10px] text-slate-500 mb-3">Botones de acceso rápido a los perfiles sociales del cliente.</p>
                  <div className="flex flex-col gap-2 mb-3">
                    {(editingClient.config.socialLinks || []).map((link, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{link.name}</span>
                          <span className="text-[10px] text-slate-500 truncate max-w-xs">{link.url}</span>
                        </div>
                        <button onClick={() => handleRemoveSocialLink(idx)} className="text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full p-1 transition-colors"><X size={14}/></button>
                      </div>
                    ))}
                    {(!editingClient.config.socialLinks || editingClient.config.socialLinks.length === 0) && <span className="text-xs text-slate-400 italic">No hay redes sociales configuradas.</span>}
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="flex-1 flex gap-2">
                      <input type="text" value={newSocialLink.name} onChange={e => setNewSocialLink({...newSocialLink, name: e.target.value})} placeholder="Red (Ej: Instagram)" className="w-1/3 p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                      <input type="url" value={newSocialLink.url} onChange={e => setNewSocialLink({...newSocialLink, url: e.target.value})} placeholder="URL (https://...)" className="flex-1 p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <button onClick={handleAddSocialLink} className="bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm h-9.5">
                      <Plus size={16}/> Agregar
                    </button>
                  </div>
                </div>

                 <hr className="border-slate-100" />
                 {renderConfigSection('Pilares de Contenido', 'pillars', 'Los pilares guían la distribución temática de cada pieza.')}
                 <hr className="border-slate-100" />
                 {renderConfigSection('Objetivos Principales', 'objectives', 'Solo se tomarán en cuenta los primeros 3 objetivos en el formulario de creación.')}
                 <hr className="border-slate-100" />
                 {renderConfigSection('Etiquetas', 'tags', 'Opciones predefinidas para organizar las piezas de contenido.')}
                 <hr className="border-slate-100" />
                 {renderConfigSection('Formatos', 'formats', 'Se generarán pestañas dinámicas en el Gestor de Contenido para cada formato.')}
                 <hr className="border-slate-100" />
                 
                 <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Accesos Rápidos (Cabecera)</label>
                  <p className="text-[10px] text-slate-500 mb-3">Botones con enlaces a carpetas de Drive, Canva, etc.</p>
                  <div className="flex flex-col gap-2 mb-3">
                    {(editingClient.config.quickLinks || []).map((link, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{link.name}</span>
                          <span className="text-[10px] text-slate-500 truncate max-w-xs">{link.url}</span>
                        </div>
                        <button onClick={() => handleRemoveQuickLink(idx)} className="text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full p-1 transition-colors"><X size={14}/></button>
                      </div>
                    ))}
                    {(!editingClient.config.quickLinks || editingClient.config.quickLinks.length === 0) && <span className="text-xs text-slate-400 italic">No hay accesos rápidos configurados.</span>}
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="flex-1 flex gap-2">
                      <input type="text" value={newQuickLink.name} onChange={e => setNewQuickLink({...newQuickLink, name: e.target.value})} placeholder="Nombre (Ej: Drive)" className="w-1/3 p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                      <input type="url" value={newQuickLink.url} onChange={e => setNewQuickLink({...newQuickLink, url: e.target.value})} placeholder="URL (https://...)" className="flex-1 p-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <button onClick={handleAddQuickLink} className="bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm h-9.5">
                      <Plus size={16}/> Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA: GESTIÓN DE CLIENTES (PROPUESTA) */}
        {currentView === 'clientes' && role === 'admin' && (
          <div className="p-6 md:p-8 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
              
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestión de Clientes (Multi-espacio)</h1>
                <p className="text-sm text-slate-500 mt-1">Propuesta de arquitectura para administrar múltiples clientes desde una sola plataforma.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h2 className="font-bold text-slate-800 flex items-center gap-2"><Users size={18} className="text-indigo-600"/> Clientes Activos</h2>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
                        <Plus size={14}/> Nuevo Cliente
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {clients.length > 0 ? clients.map(client => (
                        <div key={client.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-black text-sm">
                              {client.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-sm text-slate-800">{client.name}</h3>
                              <p className="text-xs text-slate-500">{client.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{client.projectsCount} piezas</span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${client.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{client.status}</span>
                            
                            <div className="flex items-center gap-1 border-l border-slate-200 pl-4 ml-2">
                              <button onClick={() => copyToClipboard(`https://tuapp.com/acceso/${client.id}-token-secreto`)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Copiar Enlace Mágico">
                                <Key size={16}/>
                              </button>
                              <button onClick={() => { setEditingClientId(client.id); navigateTo('configuracion'); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Configurar Cliente">
                                <Settings size={16}/>
                              </button>
                              <button onClick={() => { setFilterClientId(client.id); navigateTo('contenido'); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Ver espacio de trabajo">
                                <ExternalLink size={16}/>
                              </button>
                            </div>
                          </div>
                        </div>
                      )) : <p className="p-4 text-sm text-slate-500 text-center">No hay clientes en la base de datos.</p>}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold text-indigo-900 mb-4">¿Cómo funcionará el acceso?</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                        <h4 className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-2">1. Separación de Datos</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Cada proyecto, comentario y configuración tendrá asignado un <strong><code>cliente_id</code></strong>. Cuando un usuario inicie sesión, la base de datos (ej. Firebase o Supabase) filtrará automáticamente la información.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                        <h4 className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-2">2. Accesos sin contraseña (Magic Links)</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Para facilitar la vida de tus clientes, en lugar de pedirles crear una contraseña, puedes generar un <strong>Enlace Mágico</strong> único. Al hacer clic, el sistema los reconoce y los deja entrar a su espacio.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                        <h4 className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-2">3. Tu vista como Administrador</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Como Admin, tendrás un selector global en tu cabecera para <strong>"Cambiar de Cliente"</strong>. Al seleccionar uno, todo el Gestor de Contenido y Calendario se actualizará para mostrar solo la información de esa marca.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-2 text-sm">Próximos pasos recomendados:</h3>
                    <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                      <li>Migrar el estado local a una base de datos en la nube (ej. Firebase, Supabase).</li>
                      <li>Implementar autenticación (Auth) para proteger las rutas.</li>
                      <li>Añadir el campo <code>clienteId</code> a la creación de piezas.</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
