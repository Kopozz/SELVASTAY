/**
 * ProyectosPage — Módulo de Gestión de Proyectos Ágiles (Sprints / Kanban / Gantt)
 * Diseñado con estética profesional dark theme.
 * 100% interactivo, con persistencia en localStorage e historial de auditoría integrado.
 */
import { useState, useEffect, useMemo } from 'react';
import { 
  ListTodo, 
  Calendar, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  User, 
  ChevronsRight, 
  CalendarDays,
  Tag
} from 'lucide-react';
import { useBusinessConfig } from '../hooks/useBusinessConfig';
import toast from 'react-hot-toast';

export default function ProyectosPage() {
  const { addAuditLog } = useBusinessConfig();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'timeline'
  
  // Modales
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [selectedColumnForTask, setSelectedColumnForTask] = useState('Backlog');

  // Estados locales cargados desde localStorage
  const [sprints, setSprints] = useState(() => {
    const saved = localStorage.getItem('v_proj_sprints');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'sprint-1', nombre: 'Sprint 1: Infraestructura & Mantenimiento', fechaInicio: '2026-05-01', fechaFin: '2026-05-15' },
      { id: 'sprint-2', nombre: 'Sprint 2: Campaña Comercial & Marketing', fechaInicio: '2026-05-16', fechaFin: '2026-05-30' },
      { id: 'sprint-3', nombre: 'Sprint 3: Digitalización & Procesos', fechaInicio: '2026-06-01', fechaFin: '2026-06-15' }
    ];
  });

  const [selectedSprintId, setSelectedSprintId] = useState('sprint-1');

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('v_proj_tasks');
    if (saved) return JSON.parse(saved);
    return [
      // Sprint 1
      { id: 't-1', sprintId: 'sprint-1', titulo: 'Renovar pintura exterior y techos', descripcion: 'Repintar la fachada principal con pintura impermeable y reparar filtraciones menores en techos.', estado: 'Ejecución', prioridad: 'Alta', responsable: 'Luis Pérez', fechaInicio: '2026-05-02', fechaFin: '2026-05-10', progreso: 60 },
      { id: 't-2', sprintId: 'sprint-1', titulo: 'Instalación de routers de alta potencia', descripcion: 'Extender la red Wi-Fi mediante repetidores industriales en zonas comunes.', estado: 'Completado', prioridad: 'Alta', responsable: 'Sistemas', fechaInicio: '2026-05-01', fechaFin: '2026-05-05', progreso: 100 },
      { id: 't-3', sprintId: 'sprint-1', titulo: 'Mantenimiento preventivo de aire acondicionado', descripcion: 'Limpieza de filtros y carga de gas refrigerante en todas las unidades.', estado: 'Planificación', prioridad: 'Media', responsable: 'ClimaTec', fechaInicio: '2026-05-08', fechaFin: '2026-05-12', progreso: 10 },
      { id: 't-4', sprintId: 'sprint-1', titulo: 'Inventario general de insumos de recepción', descripcion: 'Clasificar papelería, tarjetas magnéticas y kits de bienvenida.', estado: 'Backlog', prioridad: 'Baja', responsable: 'María Gómez', fechaInicio: '2026-05-10', fechaFin: '2026-05-14', progreso: 0 },

      // Sprint 2
      { id: 't-5', sprintId: 'sprint-2', titulo: 'Fotografía profesional del local', descripcion: 'Sesión de fotos en alta resolución de las instalaciones para catálogo digital.', estado: 'Planificación', prioridad: 'Media', responsable: 'Carlos Estudio', fechaInicio: '2026-05-18', fechaFin: '2026-05-22', progreso: 0 },
      { id: 't-6', sprintId: 'sprint-2', titulo: 'Lanzamiento de publicidad segmentada', descripcion: 'Campaña en Meta Ads enfocada en turistas nacionales durante feriados.', estado: 'Backlog', prioridad: 'Alta', responsable: 'Agency S.A.', fechaInicio: '2026-05-20', fechaFin: '2026-05-28', progreso: 0 },

      // Sprint 3
      { id: 't-7', sprintId: 'sprint-3', titulo: 'Configurar pasarela de pagos Supabase', descripcion: 'Desplegar tablas de transacciones y conectar webhooks seguros.', estado: 'Backlog', prioridad: 'Alta', responsable: 'Desarrollador', fechaInicio: '2026-06-02', fechaFin: '2026-06-10', progreso: 0 }
    ];
  });

  // Persistir en localStorage
  useEffect(() => {
    localStorage.setItem('v_proj_sprints', JSON.stringify(sprints));
  }, [sprints]);

  useEffect(() => {
    localStorage.setItem('v_proj_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Formulario Sprint
  const [newSprint, setNewSprint] = useState({ nombre: '', fechaInicio: '', fechaFin: '' });
  // Formulario Tarea
  const [newTask, setNewTask] = useState({ titulo: '', descripcion: '', prioridad: 'Media', responsable: '', fechaInicio: '', fechaFin: '', progreso: 0 });

  // Columnas Kanban
  const columnas = ['Backlog', 'Planificación', 'Ejecución', 'Completado'];

  // KPIs calculados del Sprint seleccionado
  const sprintTasks = useMemo(() => {
    return tasks.filter(t => t.sprintId === selectedSprintId);
  }, [tasks, selectedSprintId]);

  const kpis = useMemo(() => {
    const total = sprintTasks.length;
    const completadas = sprintTasks.filter(t => t.estado === 'Completado').length;
    const activas = sprintTasks.filter(t => ['Planificación', 'Ejecución'].includes(t.estado)).length;
    const altas = sprintTasks.filter(t => t.prioridad === 'Alta' && t.estado !== 'Completado').length;
    const avance = total > 0 ? Math.round((completadas / total) * 100) : 0;
    return { total, completadas, activas, altas, avance };
  }, [sprintTasks]);

  // Crear Sprint
  const handleCreateSprint = (e) => {
    e.preventDefault();
    if (!newSprint.nombre || !newSprint.fechaInicio || !newSprint.fechaFin) {
      toast.error('Por favor completa todos los campos del Sprint.');
      return;
    }
    const sprintId = `sprint-${Date.now()}`;
    const nuevo = { id: sprintId, ...newSprint };
    setSprints(prev => [...prev, nuevo]);
    setSelectedSprintId(sprintId);
    setShowSprintModal(false);
    setNewSprint({ nombre: '', fechaInicio: '', fechaFin: '' });
    toast.success('Sprint creado y activado.');
    addAuditLog('PROYECTO_SPRINT_CREADO', `Sprint '${nuevo.nombre}' planificado exitosamente.`);
  };

  // Crear Tarea
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.titulo || !newTask.responsable) {
      toast.error('Ingresa al menos el título y el responsable de la tarea.');
      return;
    }
    const tarea = {
      id: `t-${Date.now()}`,
      sprintId: selectedSprintId,
      estado: selectedColumnForTask,
      progreso: selectedColumnForTask === 'Completado' ? 100 : Number(newTask.progreso || 0),
      ...newTask
    };
    setTasks(prev => [...prev, tarea]);
    setShowTaskModal(false);
    setNewTask({ titulo: '', descripcion: '', prioridad: 'Media', responsable: '', fechaInicio: '', fechaFin: '', progreso: 0 });
    toast.success('Tarea agregada al Sprint.');
    addAuditLog('PROYECTO_TAREA_CREADA', `Tarea '${tarea.titulo}' añadida en estado '${tarea.estado}'.`);
  };

  // Mover Tarea de Estado
  const moveTask = (taskId, nuevoEstado) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        let prog = t.progreso;
        if (nuevoEstado === 'Completado') prog = 100;
        else if (nuevoEstado === 'Backlog') prog = 0;
        else if (t.estado === 'Completado' && nuevoEstado !== 'Completado') prog = 50;

        addAuditLog('PROYECTO_TAREA_DESPLAZADA', `Tarea '${t.titulo}' movida de '${t.estado}' a '${nuevoEstado}'.`);
        return { ...t, estado: nuevoEstado, progreso: prog };
      }
      return t;
    }));
    toast.success(`Tarea movida a ${nuevoEstado}`);
  };

  // Eliminar Tarea
  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast.success('Tarea eliminada.');
    if (taskToDelete) {
      addAuditLog('PROYECTO_TAREA_ELIMINADA', `Tarea '${taskToDelete.titulo}' eliminada del Sprint.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-v-white)] tracking-tight flex items-center gap-2">
            <ListTodo className="text-[var(--color-v-green)]" size={24} />
            Gestión de Proyectos Internos
          </h1>
          <p className="text-[var(--color-v-gray-400)] text-sm mt-1">
            Metodología Scrum/Kanban para la planificación física, logística y mejoras operativas del negocio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Selector de Sprints */}
          <select 
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            className="input-field py-2 w-64 bg-[var(--color-v-black-2)] border-r-8 border-transparent"
          >
            {sprints.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>

          <button 
            onClick={() => setShowSprintModal(true)}
            className="btn-secondary py-2 flex items-center gap-1 text-xs whitespace-nowrap"
          >
            <Plus size={14} />
            <span>Sprint</span>
          </button>
        </div>
      </header>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="v-stat p-4 relative overflow-hidden group">
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform">
            <ListTodo size={54} className="text-[var(--color-v-blue)]" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(68,138,255,0.1)] flex items-center justify-center text-[var(--color-v-blue)]">
              <ListTodo size={18} />
            </div>
            <div>
              <p className="text-[var(--color-v-gray-400)] text-xs font-semibold uppercase tracking-wider">Tareas Totales</p>
              <h3 className="text-xl font-black text-[var(--color-v-white)] mt-0.5">{kpis.total}</h3>
            </div>
          </div>
        </div>

        <div className="v-stat p-4 relative overflow-hidden group">
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform">
            <Clock size={54} className="text-[var(--color-v-amber)]" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(255,171,0,0.1)] flex items-center justify-center text-[var(--color-v-amber)]">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[var(--color-v-gray-400)] text-xs font-semibold uppercase tracking-wider">Tareas Activas</p>
              <h3 className="text-xl font-black text-[var(--color-v-white)] mt-0.5">{kpis.activas}</h3>
            </div>
          </div>
        </div>

        <div className="v-stat p-4 relative overflow-hidden group">
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform">
            <AlertTriangle size={54} className="text-[var(--color-v-red)]" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(255,23,68,0.1)] flex items-center justify-center text-[var(--color-v-red)]">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-[var(--color-v-gray-400)] text-xs font-semibold uppercase tracking-wider">Altas Criticas</p>
              <h3 className="text-xl font-black text-[var(--color-v-white)] mt-0.5">{kpis.altas}</h3>
            </div>
          </div>
        </div>

        <div className="v-stat p-4 relative overflow-hidden group border-[rgba(0,230,118,0.15)]">
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp size={54} className="text-[var(--color-v-green)]" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(0,230,118,0.08)] flex items-center justify-center text-[var(--color-v-green)]">
              <TrendingUp size={18} />
            </div>
            <div className="w-full">
              <p className="text-[var(--color-v-gray-400)] text-xs font-semibold uppercase tracking-wider">Completado</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-[var(--color-v-white)]">{kpis.avance}%</span>
                <div className="flex-1 h-1.5 rounded-full bg-[var(--color-v-black-4)] overflow-hidden">
                  <div className="bg-[var(--color-v-green)] h-full rounded-full" style={{ width: `${kpis.avance}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Vista (Kanban / Gantt) */}
      <div className="flex justify-between items-center bg-[var(--color-v-black-2)] p-2 rounded-xl border border-[rgba(255,255,255,0.03)]">
        <div className="text-xs font-semibold text-[var(--color-v-gray-400)] pl-2">
          Proyecto: <span className="text-[var(--color-v-white)]">{sprints.find(s => s.id === selectedSprintId)?.nombre || '—'}</span>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              viewMode === 'kanban' 
                ? 'bg-[var(--color-v-green)] text-black shadow-[0_0_15px_rgba(0,230,118,0.2)]'
                : 'text-[var(--color-v-gray-400)] hover:text-[var(--color-v-white)]'
            }`}
          >
            <ListTodo size={12} />
            Kanban
          </button>
          <button 
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              viewMode === 'timeline' 
                ? 'bg-[var(--color-v-green)] text-black shadow-[0_0_15px_rgba(0,230,118,0.2)]'
                : 'text-[var(--color-v-gray-400)] hover:text-[var(--color-v-white)]'
            }`}
          >
            <CalendarDays size={12} />
            Cronograma (Gantt)
          </button>
        </div>
      </div>

      {/* Visualización de Tareas */}
      {viewMode === 'kanban' ? (
        // ================= KANBAN BOARD =================
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columnas.map(col => {
            const colTasks = sprintTasks.filter(t => t.estado === col);
            return (
              <div key={col} className="v-card p-4 bg-[var(--color-v-black-2)]/50 min-h-[450px] flex flex-col">
                {/* Column header */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-[rgba(255,255,255,0.03)]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      col === 'Backlog' ? 'bg-[var(--color-v-gray-400)]' :
                      col === 'Planificación' ? 'bg-[var(--color-v-blue)]' :
                      col === 'Ejecución' ? 'bg-[var(--color-v-amber)]' : 'bg-[var(--color-v-green)]'
                    }`} />
                    <h4 className="text-sm font-bold text-[var(--color-v-white)] uppercase tracking-wider">{col}</h4>
                  </div>
                  <span className="text-xs font-bold bg-[var(--color-v-black-3)] px-2 py-0.5 rounded text-[var(--color-v-gray-400)]">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[480px] scrollbar-none pr-0.5">
                  {colTasks.map(task => (
                    <div key={task.id} className="v-card p-3.5 bg-[var(--color-v-black-3)] hover:border-[rgba(0,230,118,0.25)] transition-all flex flex-col group border-[rgba(255,255,255,0.02)]">
                      {/* Priority and Actions */}
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                          task.prioridad === 'Alta' ? 'bg-[rgba(255,23,68,0.1)] text-[var(--color-v-red)]' :
                          task.prioridad === 'Media' ? 'bg-[rgba(255,171,0,0.1)] text-[var(--color-v-amber)]' :
                          'bg-[rgba(68,138,255,0.1)] text-[var(--color-v-blue)]'
                        }`}>
                          {task.prioridad}
                        </span>

                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-xs text-[var(--color-v-red)] font-semibold hover:underline transition-opacity cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>

                      {/* Title */}
                      <h5 className="text-sm font-bold text-[var(--color-v-white)] leading-snug mb-1.5">{task.titulo}</h5>
                      
                      {/* Description */}
                      <p className="text-xs text-[var(--color-v-gray-400)] leading-relaxed line-clamp-3 mb-3">
                        {task.descripcion || 'Sin descripción.'}
                      </p>

                      {/* Meta information */}
                      <div className="mt-auto space-y-2">
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-[var(--color-v-gray-500)]">
                            <span>Progreso</span>
                            <span>{task.progreso}%</span>
                          </div>
                          <div className="h-1 bg-[var(--color-v-black-4)] rounded-full overflow-hidden">
                            <div className="bg-[var(--color-v-green)] h-full rounded-full" style={{ width: `${task.progreso}%` }} />
                          </div>
                        </div>

                        {/* Assignee & Dates */}
                        <div className="flex items-center justify-between text-xs text-[var(--color-v-gray-500)] font-medium pt-1.5 border-t border-[rgba(255,255,255,0.02)]">
                          <div className="flex items-center gap-1 text-[var(--color-v-gray-300)]">
                            <User size={10} />
                            <span className="truncate max-w-[80px]">{task.responsable}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Calendar size={10} />
                            <span>{task.fechaFin.slice(5)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Move Buttons */}
                      <div className="flex justify-end gap-1.5 mt-3 pt-2 border-t border-[rgba(255,255,255,0.02)]">
                        {col !== 'Backlog' && (
                          <button 
                            onClick={() => moveTask(task.id, columnas[columnas.indexOf(col) - 1])}
                            className="p-1 rounded bg-[var(--color-v-black-4)] hover:bg-[var(--color-v-black-5)] text-[9px] text-[var(--color-v-gray-300)] flex items-center font-bold"
                            title="Desplazar a la izquierda"
                          >
                            &larr;
                          </button>
                        )}
                        {col !== 'Completado' && (
                          <button 
                            onClick={() => moveTask(task.id, columnas[columnas.indexOf(col) + 1])}
                            className="px-2 py-1 rounded bg-[rgba(0,230,118,0.1)] hover:bg-[var(--color-v-green)] hover:text-black text-[9px] text-[var(--color-v-green)] font-bold flex items-center gap-0.5"
                            title="Desplazar a la derecha"
                          >
                            <span>Avanzar</span>
                            <ChevronsRight size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="p-8 border border-dashed border-[rgba(255,255,255,0.03)] rounded-xl text-center text-[10px] text-[var(--color-v-gray-500)] italic flex-1 flex items-center justify-center">
                      Vacío
                    </div>
                  )}
                </div>

                {/* Add task button */}
                <button 
                  onClick={() => {
                    setSelectedColumnForTask(col);
                    setShowTaskModal(true);
                  }}
                  className="w-full mt-3 p-2.5 rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.04)] text-xs font-bold text-[var(--color-v-gray-300)] hover:text-[var(--color-v-white)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Añadir Tarea</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        // ================= CRONOGRAMA / GANTT VIEW =================
        <div className="v-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="text-[var(--color-v-green)]" size={16} />
            <h3 className="text-sm font-semibold text-[var(--color-v-white)] uppercase tracking-wider">Cronograma Físico de Tareas</h3>
          </div>

          {sprintTasks.length === 0 ? (
            <div className="text-center py-12 text-xs text-[var(--color-v-gray-500)] italic">
              No hay tareas planificadas en este Sprint para graficar en el cronograma.
            </div>
          ) : (
            <div className="space-y-6">
              {sprintTasks.map(task => (
                <div key={task.id} className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center pb-4 border-b border-[rgba(255,255,255,0.02)] last:border-0 last:pb-0">
                  {/* Task details */}
                  <div className="lg:col-span-1 space-y-1">
                    <h5 className="text-xs font-bold text-[var(--color-v-white)] leading-snug">{task.titulo}</h5>
                    <div className="flex items-center gap-2 text-[9px] text-[var(--color-v-gray-500)]">
                      <span className={`px-1.5 py-0.5 rounded font-black ${
                        task.estado === 'Completado' ? 'bg-[rgba(0,230,118,0.1)] text-[var(--color-v-green)]' :
                        task.estado === 'Ejecución' ? 'bg-[rgba(255,171,0,0.1)] text-[var(--color-v-amber)]' :
                        'bg-[var(--color-v-black-4)] text-[var(--color-v-gray-400)]'
                      }`}>{task.estado}</span>
                      <span>•</span>
                      <span>Resp: {task.responsable}</span>
                    </div>
                  </div>

                  {/* Date specs */}
                  <div className="flex items-center gap-4 text-[10px] text-[var(--color-v-gray-400)] lg:col-span-1">
                    <div>
                      <p className="text-[8px] text-[var(--color-v-gray-500)] uppercase font-semibold">Inicio</p>
                      <p className="font-medium text-[var(--color-v-gray-200)]">{task.fechaInicio || '2026-05-01'}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text(--color-v-gray-500) uppercase font-semibold">Cierre</p>
                      <p className="font-medium text-[var(--color-v-gray-200)]">{task.fechaFin || '2026-05-15'}</p>
                    </div>
                  </div>

                  {/* Progress visualization & mock timeline bar */}
                  <div className="lg:col-span-2 space-y-2">
                    <div className="flex justify-between text-[9px] text-[var(--color-v-gray-400)] font-medium">
                      <span>Representación de Planificación de Ejecución</span>
                      <span className="font-bold text-[var(--color-v-green)]">{task.progreso}% completado</span>
                    </div>

                    {/* Gantt Bar representation */}
                    <div className="w-full h-5 rounded-md bg-[var(--color-v-black-3)] p-0.5 relative overflow-hidden border border-[rgba(255,255,255,0.03)] flex items-center">
                      <div 
                        className={`h-full rounded-sm transition-all duration-700 ${
                          task.estado === 'Completado' ? 'bg-[var(--color-v-green)]/80 shadow-[0_0_10px_rgba(0,230,118,0.2)]' :
                          task.estado === 'Ejecución' ? 'bg-[var(--color-v-amber)]/80' :
                          'bg-[var(--color-v-blue)]/50'
                        }`} 
                        style={{ 
                          width: `${task.progreso || 5}%`, 
                          marginLeft: colIndexOffset(task.fechaInicio) 
                        }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL DE NUEVA TAREA ================= */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="v-card w-full max-w-md p-6 border-[rgba(255,255,255,0.08)] bg-[var(--color-v-black-2)] shadow-2xl animate-scale-in">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(255,255,255,0.04)]">
              <ListTodo className="text-[var(--color-v-green)]" size={16} />
              <h3 className="text-sm font-bold text-[var(--color-v-white)] uppercase tracking-wider">Añadir Tarea en {selectedColumnForTask}</h3>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-v-gray-400)] mb-1">Título de la Tarea</label>
                <input 
                  type="text"
                  placeholder="Ej. Reparar fugas en baños"
                  required
                  value={newTask.titulo}
                  onChange={(e) => setNewTask({...newTask, titulo: e.target.value})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-v-gray-400)] mb-1">Descripción</label>
                <textarea 
                  placeholder="Explica a detalle en qué consiste la tarea..."
                  rows={2}
                  value={newTask.descripcion}
                  onChange={(e) => setNewTask({...newTask, descripcion: e.target.value})}
                  className="input-field py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-v-gray-400)] mb-1">Prioridad</label>
                  <select 
                    value={newTask.prioridad}
                    onChange={(e) => setNewTask({...newTask, prioridad: e.target.value})}
                    className="input-field py-2"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-v-gray-400)] mb-1">Responsable</label>
                  <input 
                    type="text"
                    placeholder="Ej. Luis Pérez"
                    required
                    value={newTask.responsable}
                    onChange={(e) => setNewTask({...newTask, responsable: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-v-gray-400)] mb-1">Fecha de Inicio</label>
                  <input 
                    type="date"
                    required
                    value={newTask.fechaInicio}
                    onChange={(e) => setNewTask({...newTask, fechaInicio: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-v-gray-400)] mb-1">Fecha de Entrega</label>
                  <input 
                    type="date"
                    required
                    value={newTask.fechaFin}
                    onChange={(e) => setNewTask({...newTask, fechaFin: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>

              {selectedColumnForTask !== 'Completado' && selectedColumnForTask !== 'Backlog' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-v-gray-400)] mb-1">Progreso Inicial ({newTask.progreso}%)</label>
                  <input 
                    type="range"
                    min="0"
                    max="99"
                    value={newTask.progreso}
                    onChange={(e) => setNewTask({...newTask, progreso: Number(e.target.value)})}
                    className="w-full accent-[var(--color-v-green)]"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-3 justify-end border-t border-[rgba(255,255,255,0.04)]">
                <button 
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="btn-secondary py-2 text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn-primary py-2 text-xs"
                >
                  Agregar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DE NUEVO SPRINT ================= */}
      {showSprintModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="v-card w-full max-w-md p-6 border-[rgba(255,255,255,0.08)] bg-[var(--color-v-black-2)] shadow-2xl animate-scale-in">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(255,255,255,0.04)]">
              <Calendar className="text-[var(--color-v-green)]" size={16} />
              <h3 className="text-sm font-bold text-[var(--color-v-white)] uppercase tracking-wider">Planificar Nuevo Sprint</h3>
            </div>

            <form onSubmit={handleCreateSprint} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-v-gray-400)] mb-1">Nombre del Sprint / Hito</label>
                <input 
                  type="text"
                  placeholder="Ej. Sprint 4: Mejoras operativas generales"
                  required
                  value={newSprint.nombre}
                  onChange={(e) => setNewSprint({...newSprint, nombre: e.target.value})}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-v-gray-400)] mb-1">Fecha de Inicio</label>
                  <input 
                    type="date"
                    required
                    value={newSprint.fechaInicio}
                    onChange={(e) => setNewSprint({...newSprint, fechaInicio: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-v-gray-400)] mb-1">Fecha de Cierre</label>
                  <input 
                    type="date"
                    required
                    value={newSprint.fechaFin}
                    onChange={(e) => setNewSprint({...newSprint, fechaFin: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 justify-end border-t border-[rgba(255,255,255,0.04)]">
                <button 
                  type="button"
                  onClick={() => setShowSprintModal(false)}
                  className="btn-secondary py-2 text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn-primary py-2 text-xs"
                >
                  Planificar Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Función auxiliar para calcular el desplazamiento lateral del Gantt según su fecha de inicio simulada
function colIndexOffset(fechaStr) {
  if (!fechaStr) return '0%';
  const dia = parseInt(fechaStr.split('-')[2], 10);
  if (isNaN(dia)) return '0%';
  
  // Mapear el día del 1 al 30 de forma porcentual (0% a 50%) para dar sensación de desfase temporal
  const offset = Math.min(50, Math.max(0, Math.round(((dia - 1) / 30) * 100)));
  return `${offset}%`;
}
