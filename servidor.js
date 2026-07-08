// ============================================
// ===== RUTAS PARA ÁREAS (CON PUT Y DELETE) =====
// ============================================

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
// ===== RUTAS PARA INCIDENCIAS (CON PUT Y DELETE) =====
// ============================================

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
// ===== RUTAS PARA USUARIOS (CON DELETE) =====
// ============================================

app.delete('/api/usuarios/:id', (req, res) => {
    const datos = leerDatos();
    if (!datos) return res.status(500).json({ error: 'Error leyendo datos' });
    
    const id = parseInt(req.params.id);
    const indice = datos.usuarios.findIndex(u => u.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    datos.usuarios.splice(indice, 1);
    
    if (guardarDatos(datos)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Error eliminando usuario' });
    }
});