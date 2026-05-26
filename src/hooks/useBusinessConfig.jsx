/**
 * useBusinessConfig — Contexto y Hook de Configuración del Negocio
 * Hace que SelvaStay Pro sea adaptable para cualquier tipo de negocio (Eco-Lodge, Hotel, Coworking, Canchas, Alquiler).
 * Además mantiene un log de auditoría persistente para trazabilidad técnica.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Tipos de negocio pre-configurados y su vocabulario correspondiente
export const BUSINESS_TYPES = {
  lodge: {
    id: 'lodge',
    name: 'Eco-Lodge / Recreo Turístico',
    unit: 'Habitación',
    units: 'Habitaciones',
    client: 'Huésped',
    clients: 'Huéspedes',
    booking: 'Reserva',
    bookings: 'Reservas',
    service: 'Servicio Extra',
    services: 'Servicios Extra',
    icon: 'Trees',
    desc: 'Gestión ecológica de cabañas, glampings y recreos en la selva.'
  },
  hotel: {
    id: 'hotel',
    name: 'Hotel / Hostal Urbano',
    unit: 'Habitación',
    units: 'Habitaciones',
    client: 'Huésped',
    clients: 'Huéspedes',
    booking: 'Estadía',
    bookings: 'Estadías',
    service: 'Consumo / Mini Bar',
    services: 'Consumos',
    icon: 'Hotel',
    desc: 'Control clásico de habitaciones, reservas y servicios adicionales.'
  },
  coworking: {
    id: 'coworking',
    name: 'Espacio de Coworking',
    unit: 'Escritorio/Sala',
    units: 'Escritorios/Salas',
    client: 'Miembro',
    clients: 'Miembros',
    booking: 'Reservación',
    bookings: 'Reservaciones',
    service: 'Bebida/Café',
    services: 'Consumos Café',
    icon: 'Briefcase',
    desc: 'Alquiler de espacios compartidos, salas de juntas y consumo interno.'
  },
  canchas: {
    id: 'canchas',
    name: 'Club Deportivo (Canchas)',
    unit: 'Cancha',
    units: 'Canchas',
    client: 'Jugador',
    clients: 'Jugadores',
    booking: 'Turno',
    bookings: 'Turnos',
    service: 'Alquiler de Raquetas/Balón',
    services: 'Alquileres',
    icon: 'Activity',
    desc: 'Reserva de canchas de fútbol, tenis, pádel y venta de bebidas.'
  },
  alquiler: {
    id: 'alquiler',
    name: 'Rent-a-Car / Alquiler Equipos',
    unit: 'Vehículo/Equipo',
    units: 'Vehículos/Equipos',
    client: 'Cliente',
    clients: 'Clientes',
    booking: 'Alquiler',
    bookings: 'Alquileres',
    service: 'Seguro/Garantía',
    services: 'Seguros/Adicionales',
    icon: 'Car',
    desc: 'Gestión de flotas, maquinaria o herramientas con cobros diarios.'
  }
};

const BusinessConfigContext = createContext(null);

export function BusinessConfigProvider({ children }) {
  // Configuración por defecto
  const [businessName, setBusinessName] = useState(() => {
    return localStorage.getItem('v_biz_name') || 'SelvaStay Tarapoto';
  });

  const [businessType, setBusinessType] = useState(() => {
    return localStorage.getItem('v_biz_type') || 'lodge';
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('v_biz_currency') || 'S/';
  });

  const [activeModules, setActiveModules] = useState(() => {
    const saved = localStorage.getItem('v_biz_modules');
    return saved ? JSON.parse(saved) : { projects: true, services: true, clients: true };
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('v_biz_audit_logs');
    if (saved) return JSON.parse(saved);
    
    // Semilla inicial de trazabilidad para que la tabla no se vea vacía al inicio
    return [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        action: 'SISTEMA_INICIADO',
        details: 'El sistema SelvaStay Pro se ha cargado de manera correcta en el navegador.'
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        action: 'CONFIGURACION_CARGADA',
        details: 'Configuración inicial cargada con éxito desde el almacén local del navegador (localStorage).'
      }
    ];
  });

  // Guardar cambios en localStorage al actualizar estados
  useEffect(() => {
    localStorage.setItem('v_biz_name', businessName);
  }, [businessName]);

  useEffect(() => {
    localStorage.setItem('v_biz_type', businessType);
  }, [businessType]);

  useEffect(() => {
    localStorage.setItem('v_biz_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('v_biz_modules', JSON.stringify(activeModules));
  }, [activeModules]);

  useEffect(() => {
    localStorage.setItem('v_biz_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Función para registrar un log de auditoría (Trazabilidad - Gestión de Proyectos)
  const addAuditLog = useCallback((action, details) => {
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      details
    };
    setAuditLogs((prev) => [newLog, ...prev].slice(0, 100)); // Limitar a los últimos 100 registros
  }, []);

  // Helpers de vocabulario dinámico
  const getUnitName = useCallback((plural = false) => {
    const config = BUSINESS_TYPES[businessType] || BUSINESS_TYPES.lodge;
    return plural ? config.units : config.unit;
  }, [businessType]);

  const getClientName = useCallback((plural = false) => {
    const config = BUSINESS_TYPES[businessType] || BUSINESS_TYPES.lodge;
    return plural ? config.clients : config.client;
  }, [businessType]);

  const getBookingName = useCallback((plural = false) => {
    const config = BUSINESS_TYPES[businessType] || BUSINESS_TYPES.lodge;
    return plural ? config.bookings : config.booking;
  }, [businessType]);

  const getServiceName = useCallback((plural = false) => {
    const config = BUSINESS_TYPES[businessType] || BUSINESS_TYPES.lodge;
    return plural ? config.services : config.service;
  }, [businessType]);

  // Actualizar módulos activos
  const toggleModule = useCallback((moduleName) => {
    setActiveModules((prev) => {
      const updated = { ...prev, [moduleName]: !prev[moduleName] };
      addAuditLog('MODULO_MODIFICADO', `Módulo '${moduleName}' cambiado a ${updated[moduleName] ? 'ACTIVO' : 'INACTIVO'}`);
      return updated;
    });
  }, [addAuditLog]);

  // Cambiar configuración del negocio de golpe
  const updateBusinessSettings = useCallback((name, type, curr) => {
    setBusinessName(name);
    setBusinessType(type);
    setCurrency(curr);
    addAuditLog('PERSONALIZACION_NEGOCIO', `Negocio actualizado a: '${name}' | Tipo: '${type}' | Moneda: '${curr}'`);
  }, [addAuditLog]);

  // Limpiar bitácora
  const clearAuditLogs = useCallback(() => {
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'BITACORA_REINICIADA',
        details: 'El administrador ha vaciado el historial de auditoría y trazabilidad.'
      }
    ]);
  }, []);

  return (
    <BusinessConfigContext.Provider value={{
      businessName,
      businessType,
      currency,
      activeModules,
      auditLogs,
      getUnitName,
      getClientName,
      getBookingName,
      getServiceName,
      toggleModule,
      updateBusinessSettings,
      addAuditLog,
      clearAuditLogs
    }}>
      {children}
    </BusinessConfigContext.Provider>
  );
}

export function useBusinessConfig() {
  const context = useContext(BusinessConfigContext);
  if (!context) {
    throw new Error('useBusinessConfig debe ser usado dentro de un BusinessConfigProvider');
  }
  return context;
}
