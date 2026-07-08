// ============================================
// SCRIPT DE BACKUP MANUAL
// Ejecutar con: npm run backup
// ============================================

const fs = require('fs');
const path = require('path');

const ARCHIVO_DATOS = path.join(__dirname, 'datos', 'database.json');
const CARPETA_BACKUPS = path.join(__dirname, 'backups');

function hacerBackupManual() {
    console.log('========================================');
    console.log('  BACKUP MANUAL - SISTEMA MANTENIMIENTO');
    console.log('========================================');
    console.log('');

    // Verificar que existe la base de datos
    if (!fs.existsSync(ARCHIVO_DATOS)) {
        console.log('❌ Base de datos no encontrada en:', ARCHIVO_DATOS);
        console.log('   Asegúrate de que el servidor se haya ejecutado al menos una vez.');
        process.exit(1);
    }

    // Crear carpeta de backups si no existe
    if (!fs.existsSync(CARPETA_BACKUPS)) {
        fs.mkdirSync(CARPETA_BACKUPS, { recursive: true });
        console.log('📁 Carpeta de backups creada');
    }

    try {
        // Leer datos
        const datos = fs.readFileSync(ARCHIVO_DATOS, 'utf8');
        const fecha = new Date();
        
        // Formato: backup_YYYY-MM-DD_HH-MM-SS.json
        const fechaStr = fecha.toISOString().slice(0, 10);
        const horaStr = fecha.toISOString().slice(11, 19).replace(/:/g, '-');
        const nombre = `backup_${fechaStr}_${horaStr}.json`;
        const ruta = path.join(CARPETA_BACKUPS, nombre);
        
        // Guardar backup
        fs.writeFileSync(ruta, datos);
        
        // Calcular tamaño
        const stats = fs.statSync(ruta);
        const tamañoKB = (stats.size / 1024).toFixed(2);
        
        console.log('✅ Backup creado exitosamente');
        console.log(`   📁 Nombre: ${nombre}`);
        console.log(`   📊 Tamaño: ${tamañoKB} KB`);
        console.log(`   📂 Ubicación: ${ruta}`);
        console.log('');
        
        // Mostrar cantidad de backups existentes
        const archivos = fs.readdirSync(CARPETA_BACKUPS)
            .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
            .sort();
        
        console.log(`📦 Total de backups: ${archivos.length}`);
        
        // Si hay más de 30, mostrar los más antiguos
        if (archivos.length > 30) {
            const eliminar = archivos.length - 30;
            console.log(`⚠️  Hay ${eliminar} backups antiguos (más de 30)`);
            console.log('   Puedes eliminarlos manualmente si lo deseas.');
        }
        
    } catch (error) {
        console.error('❌ Error creando backup:', error.message);
        process.exit(1);
    }
    
    console.log('');
    console.log('========================================');
}

// Ejecutar
hacerBackupManual();