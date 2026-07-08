const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// ===== CREAR LA APLICACIÓN =====
const app = express();

const PUERTO = process.env.PORT || 3000;
const ARCHIVO_DATOS = path.join(__dirname, 'datos', 'database.json');

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// ===== FUNCIONES =====
function leerDatos() {
    try {
        if (!fs.existsSync(ARCHIVO_DATOS)) {
            const datosIniciales = {
                usuarios: [{ usuario: "admin", clave: "admin123", tipo: "mantenimiento" }],
                areas: [],
                eventos: [],
                solicitudes: [],
                incidencias: [],
                logo: ""
            };
            if (!fs.existsSync(path.dirname(ARCHIVO_DATOS))) {
                fs.mkdirSync(path.dirname(ARCHIVO_DATOS), { recursive: true });
            }
            fs.writeFileSync(ARCHIVO_DATOS, JSON.stringify(datosIniciales, null, 2));
            return datosIniciales;
        }
        return JSON.parse(fs.readFileSync(ARCHIVO_DATOS, 'utf8'));
    } catch (error) {
        console.error('Error leyendo datos:', error);
        return null;
    }
}

function guardarDatos(datos) {
    try {
        fs.writeFileSync(ARCHIVO_DATOS, JSON.stringify(datos, null, 2));
        return true;
    } catch (error) {
        console.error('Error guardando datos:', error);
        return false;
    }
}

// ============================================
// ===== RUTAS PARA DATOS GENERALES =====
// ============================================

app.get('/api/datos', (req, res) => {
    const datos = leerDatos();
    if (datos) {
        res.json(datos);
    } else {
        res.status(500).json({ error: 'Error leyendo datos' });
    }
});

app.post('/api/datos/completos', (req, res) => {
    const datosImportados = req.body;
    if (!datosImportados.usuarios || !datosImportados.solicitudes) {
        return res.status(400).json({ error: 'Estructura de datos inválida' });
    }
    if (guardarDatos(datosImportados)) {
        res.json({ success: true, mensaje: 'Datos guardados correctamente' });
    } else {
        res.status(500).json({ error: 'Error guardando datos' });
    }
});

// ============================================
// ===== RUTAS PARA SOLICITUDES =====
// ============================================

app.get('/api/solicitudes', (req, res) => {
    const datos = leerDatos();
    if (datos) {
        res.json(datos.solicitudes);
    } else {
        res.status(500).json({ error: 'Error leyendo solicitudes' });
    }
});

app.post('/api/solicitudes', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo base de datos' });
    
    const nuevaSolicitud = {
        ...req.body,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
    };
    
    datos.solicitudes.push(nuevaSolicitud);
    
    if (guardarDatos(datos)) {
        res.json({ success: true, id: nuevaSolicitud.id });
    } else {
        res.status(500).json({ error: 'Error guardando solicitud' });
    }
});

app.put('/api/solicitudes/:id', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const id = parseInt(req.params.id);
    const indice = datos.solicitudes.findIndex(s => s.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    datos.solicitudes[indice] = {
        ...datos.solicitudes[indice],
        ...req.body,
        fechaModificacion: new Date().toISOString()
    };
    
    if (guardarDatos(datos)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Error actualizando solicitud' });
    }
});

app.delete('/api/solicitudes/:id', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const id = parseInt(req.params.id);
    const indice = datos.solicitudes.findIndex(s => s.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    datos.solicitudes.splice(indice, 1);
    
    if (guardarDatos(datos)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Error eliminando solicitud' });
    }
});

// ============================================
// ===== RUTAS PARA EVENTOS =====
// ============================================

app.get('/api/eventos', (req, res) => {
    const datos = leerDatos();
    if (datos) {
        res.json(datos.eventos);
    } else {
        res.status(500).json({ error: 'Error leyendo eventos' });
    }
});

app.post('/api/eventos', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const nuevoEvento = {
        ...req.body,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
    };
    
    datos.eventos.push(nuevoEvento);
    
    if (guardarDatos(datos)) {
        res.json({ success: true, id: nuevoEvento.id });
    } else {
        res.status(500).json({ error: 'Error guardando evento' });
    }
});

app.put('/api/eventos/:id', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const id = parseInt(req.params.id);
    const indice = datos.eventos.findIndex(e => e.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    datos.eventos[indice] = {
        ...datos.eventos[indice],
        ...req.body,
        fechaModificacion: new Date().toISOString()
    };
    
    if (guardarDatos(datos)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Error actualizando evento' });
    }
});

app.delete('/api/eventos/:id', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const id = parseInt(req.params.id);
    const indice = datos.eventos.findIndex(e => e.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    datos.eventos.splice(indice, 1);
    
    if (guardarDatos(datos)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Error eliminando evento' });
    }
});

// ============================================
// ===== RUTAS PARA ÁREAS =====
// ============================================

app.get('/api/areas', (req, res) => {
    const datos = leerDatos();
    if (datos) {
        res.json(datos.areas);
    } else {
        res.status(500).json({ error: 'Error leyendo personal' });
    }
});

app.post('/api/areas', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const nuevaArea = {
        ...req.body,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
    };
    datos.areas.push(nuevaArea);
    
    if (guardarDatos(datos)) {
        res.json({ success: true, id: nuevaArea.id });
    } else {
        res.status(500).json({ error: 'Error guardando personal' });
    }
});

app.put('/api/areas/:id', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const id = parseInt(req.params.id);
    const indice = datos.areas.findIndex(a => a.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Personal no encontrado' });
    }
    
    datos.areas[indice] = {
        ...datos.areas[indice],
        ...req.body,
        fechaModificacion: new Date().toISOString()
    };
    
    if (guardarDatos(datos)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Error actualizando personal' });
    }
});

app.delete('/api/areas/:id', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const id = parseInt(req.params.id);
    const indice = datos.areas.findIndex(a => a.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Personal no encontrado' });
    }
    
    datos.areas.splice(indice, 1);
    
    if (guardarDatos(datos)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Error eliminando personal' });
    }
});

// ============================================
// ===== RUTAS PARA INCIDENCIAS =====
// ============================================

app.get('/api/incidencias', (req, res) => {
    const datos = leerDatos();
    if (datos) {
        res.json(datos.incidencias);
    } else {
        res.status(500).json({ error: 'Error leyendo incidencias' });
    }
});

app.post('/api/incidencias', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const nuevaIncidencia = {
        ...req.body,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
    };
    datos.incidencias.push(nuevaIncidencia);
    
    if (guardarDatos(datos)) {
        res.json({ success: true, id: nuevaIncidencia.id });
    } else {
        res.status(500).json({ error: 'Error guardando incidencia' });
    }
});

app.put('/api/incidencias/:id', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const id = parseInt(req.params.id);
    const indice = datos.incidencias.findIndex(inc => inc.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Incidencia no encontrada' });
    }
    
    datos.incidencias[indice] = {
        ...datos.incidencias[indice],
        ...req.body,
        fechaModificacion: new Date().toISOString()
    };
    
    if (guardarDatos(datos)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Error actualizando incidencia' });
    }
});

app.delete('/api/incidencias/:id', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const id = parseInt(req.params.id);
    const indice = datos.incidencias.findIndex(inc => inc.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Incidencia no encontrada' });
    }
    
    datos.incidencias.splice(indice, 1);
    
    if (guardarDatos(datos)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Error eliminando incidencia' });
    }
});

// ============================================
// ===== RUTAS PARA USUARIOS =====
// ============================================

app.get('/api/usuarios', (req, res) => {
    const datos = leerDatos();
    if (datos) {
        const usuariosSinClave = datos.usuarios.map(u => ({
            ...u,
            clave: undefined
        }));
        res.json(usuariosSinClave);
    } else {
        res.status(500).json({ error: 'Error leyendo usuarios' });
    }
});

app.post('/api/usuarios', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    if (datos.usuarios.some(u => u.usuario === req.body.usuario)) {
        return res.status(400).json({ error: 'El usuario ya existe' });
    }
    
    const nuevoUsuario = {
        ...req.body,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
    };
    datos.usuarios.push(nuevoUsuario);
    
    if (guardarDatos(datos)) {
        res.json({ success: true, id: nuevoUsuario.id });
    } else {
        res.status(500).json({ error: 'Error guardando usuario' });
    }
});

app.delete('/api/usuarios/:id', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const id = parseInt(req.params.id);
    const indice = datos.usuarios.findIndex(u => u.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    if (datos.usuarios[indice].usuario === 'admin') {
        return res.status(400).json({ error: 'No se puede eliminar el admin principal' });
    }
    
    datos.usuarios.splice(indice, 1);
    
    if (guardarDatos(datos)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Error eliminando usuario' });
    }
});

// ============================================
// ===== RUTAS PARA LOGO =====
// ============================================

app.post('/api/logo', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    datos.logo = req.body.logo;
    
    if (guardarDatos(datos)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Error guardando logo' });
    }
});

// ============================================
// ===== RUTAS PARA BACKUP =====
// ============================================

app.post('/api/backup', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const backupPath = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath, { recursive: true });
    }
    
    const fecha = new Date().toISOString().slice(0, 10);
    const archivo = path.join(backupPath, `backup_${fecha}_${Date.now()}.json`);
    fs.writeFileSync(archivo, JSON.stringify(datos, null, 2));
    
    res.json({ success: true, mensaje: 'Backup creado correctamente' });
});

// ============================================
// ===== RUTA PRINCIPAL =====
// ============================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// ===== INICIAR SERVIDOR =====
// ============================================

app.listen(PUERTO, '0.0.0.0', () => {
    console.log('==================================================');
    console.log('  🚀 SISTEMA DE MANTENIMIENTO ESCOLAR');
    console.log('==================================================');
    console.log(`  ✅ Servidor ejecutándose en el puerto: ${PUERTO}`);
    console.log(`  📁 Datos: ${ARCHIVO_DATOS}`);
    console.log('==================================================');
    console.log('  ℹ️  Usuario admin: admin');
    console.log('  ℹ️  Contraseña: admin123');
    console.log('==================================================');
});