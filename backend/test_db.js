/**
 * test_db.js — Script de diagnóstico de Base de Datos (Supabase)
 * Verifica si el backend puede conectarse a las tablas de la base de datos de producción.
 */
import { supabase } from './config/supabaseClient.js';

async function diagnoseDatabase() {
  console.log('🔌 Iniciando diagnóstico de Base de Datos (Supabase)...');
  console.log(`🔗 URL: ${process.env.SUPABASE_URL}`);
  
  try {
    // 1. Probar lectura de la tabla 'lodges'
    console.log('\n📊 Probando tabla: lodges...');
    const { data: lodges, error: lError } = await supabase
      .from('lodges')
      .select('id, nombre')
      .limit(5);
    
    if (lError) {
      console.error('❌ Error al leer la tabla lodges:', lError.message);
    } else {
      console.log(`✅ Conexión exitosa a lodges. Registros encontrados: ${lodges.length}`);
      lodges.forEach(l => console.log(`   - [Lodge] ID: ${l.id} | Nombre: ${l.nombre}`));
    }

    // 2. Probar lectura de 'habitaciones'
    console.log('\n📊 Probando tabla: habitaciones...');
    const { data: rooms, error: rError } = await supabase
      .from('habitaciones')
      .select('id, numero, estado, precio_noche')
      .limit(5);

    if (rError) {
      console.error('❌ Error al leer la tabla habitaciones:', rError.message);
    } else {
      console.log(`✅ Conexión exitosa a habitaciones. Registros encontrados: ${rooms.length}`);
      rooms.forEach(r => console.log(`   - [Unidad] N°: ${r.numero} | Estado: ${r.estado} | Precio: S/${r.precio_noche}`));
    }

    // 3. Probar lectura de 'clientes'
    console.log('\n📊 Probando tabla: clientes...');
    const { count: cCount, error: cError } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true });

    if (cError) {
      console.error('❌ Error al leer la tabla clientes:', cError.message);
    } else {
      console.log(`✅ Conexión exitosa a clientes. Total de registros en DB: ${cCount}`);
    }

    // 4. Probar lectura de 'reservas'
    console.log('\n📊 Probando tabla: reservas...');
    const { count: resCount, error: resError } = await supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true });

    if (resError) {
      console.error('❌ Error al leer la tabla reservas:', resError.message);
    } else {
      console.log(`✅ Conexión exitosa a reservas. Total de registros en DB: ${resCount}`);
    }

    console.log('\n🎉 --- DIAGNÓSTICO FINALIZADO ---');
    if (!lError && !rError && !cError && !resError) {
      console.log('🚀 RESULTADO: El sistema CUENTA con base de datos Supabase remota 100% OPERATIVA y con el esquema inicial cargado.');
    } else {
      console.log('⚠️ RESULTADO: La conexión falló o el esquema no está cargado. Se operará en Modo Offline (localStorage fallback).');
    }

  } catch (err) {
    console.error('💥 Error inesperado durante el diagnóstico:', err);
  }
}

diagnoseDatabase();
