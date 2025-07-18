# Sistema de Gestión de Proyectos - Kamak Desarrollos

## 📋 Resumen Ejecutivo

El sistema de gestión de proyectos de Kamak Desarrollos es una plataforma web completa que permite administrar, visualizar y mostrar proyectos de construcción de manera profesional. El sistema incluye un panel de administración robusto y una interfaz pública atractiva para mostrar el portafolio de trabajos realizados.

---

## 🏗️ Arquitectura del Sistema

### **Frontend (Angular 19)**
- **Framework**: Angular 19 con TypeScript
- **UI Framework**: Angular Material + Tailwind CSS
- **Iconos**: Lucide Angular
- **Mapas**: Google Maps API
- **Estado**: Signals de Angular para reactividad

### **Backend (Node.js/Express)**
- **API RESTful** para gestión de datos
- **Autenticación JWT** para el panel administrativo
- **Almacenamiento de archivos** para imágenes y videos
- **Base de datos** para proyectos y multimedia

---

## 🎯 Funcionalidades Principales

### **1. Panel de Administración**

#### **Dashboard Principal**
- **Estadísticas en tiempo real**: Contador de proyectos totales, publicados y borradores
- **Lista de proyectos** con paginación y búsqueda
- **Filtros por categoría**: Estaciones de Servicio, Tiendas, Comerciales
- **Acciones rápidas**: Crear, editar, eliminar proyectos
- **Navegación intuitiva** con breadcrumbs

#### **Gestión de Proyectos**
- **Formulario completo** con campos opcionales (sin validaciones obligatorias)
- **Información general**: Nombre, categoría, descripción, ubicación
- **Detalles técnicos**: Superficie, fechas, duración automática
- **Información interna**: Contacto, presupuesto, estado de facturación, notas
- **Estado de publicación**: Publicado/Borrador con toggle

#### **Gestión de Multimedia**

##### **Imágenes**
- **Imágenes "Antes y Después"**: Subida individual con preview
- **Galería de fotos**: Múltiples imágenes con drag & drop
- **Lightbox interactivo**: Visualización a pantalla completa
- **Optimización automática**: Conversión a formatos web (WebP)
- **Eliminación segura**: Confirmación antes de borrar

##### **Videos**
- **Integración con YouTube**: URLs de videos con preview
- **Gestión completa**: Agregar, editar, eliminar, reordenar
- **Reproducción embebida**: En la página pública del proyecto

#### **Características Avanzadas**
- **Scroll automático al top** al navegar entre secciones
- **Guardado automático** de cambios
- **Validación de formatos** de archivos
- **Manejo de errores** con mensajes informativos
- **Responsive design** para tablets y móviles

### **2. Interfaz Pública**

#### **Página Principal**
- **Hero section** con información de la empresa
- **Sección de proyectos** con filtros y paginación
- **Mapa interactivo** con ubicaciones de proyectos
- **Sección de servicios** ofrecidos
- **Footer** con información de contacto

#### **Página de Proyecto Individual**
- **Información completa** del proyecto
- **Galería de imágenes** con lightbox
- **Videos embebidos** (YouTube y locales)
- **Sección "Antes y Después"** con comparativas
- **Información técnica** detallada
- **Call-to-action** para contacto

#### **Mapa Interactivo**
- **Marcadores personalizados** para cada proyecto
- **Popup informativo** con imagen y datos del proyecto
- **Centrado en Argentina** con zoom apropiado
- **Contador de proyectos** mostrados
- **Responsive** para todos los dispositivos

---

## 🔄 Flujo de Trabajo del Sistema

### **1. Creación de Proyecto**
```
1. Acceso al panel  admin → Dashboard URL: kamak.com/admin/dashboard
2. Clic en "Crear Proyecto"
3. Llenado del formulario (campos opcionales)
4. Guardado inicial del proyecto
5. Redirección automática a la pestaña de imágenes
6. Subida de imágenes "Antes y Después"
7. Agregado de imágenes a la galería
8. Inclusión de videos (opcional)
9. Publicación del proyecto
```

### **2. Edición de Proyecto**
```
1. Selección del proyecto desde el dashboard
2. Modificación de información en pestaña "Información"
3. Gestión de imágenes en pestaña "Imágenes"
4. Gestión de videos en pestaña "Videos"
5. Cambio de estado (Publicado/Borrador)
6. Guardado de cambios
```

### **3. Visualización Pública**
```
1. Acceso a la página principal
2. Navegación por proyectos con filtros
3. Visualización del mapa interactivo
4. Clic en proyecto para ver detalles
5. Exploración de galería y videos
6. Contacto a través de CTA
```
