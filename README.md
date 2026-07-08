# Restaurante - Client User (App Móvil)

Este repositorio contiene la **Aplicación Móvil** diseñada para los clientes del Restaurante. Desarrollada con React Native y Expo, proporciona una experiencia de usuario nativa e intuitiva para que los clientes interactúen con el sistema del restaurante desde sus dispositivos iOS o Android.

##📱 ¿Qué hace esta App?
La aplicación es el punto de contacto directo del cliente con el restaurante. Sus principales funcionalidades incluyen:
- **Autenticación:** Interfaz para el inicio de sesión y registro de clientes.
- **Navegación Intuitiva:** Implementación de navegación por pestañas (Bottom Tabs) y navegación entre pantallas (Stack Navigation) para un flujo de usuario natural.
- **Gestión de Sesión:** Manejo de estado global seguro y persistente usando Zustand y Expo Secure Store.
- **Interacción Multimedia:** Posibilidad de subir o modificar imágenes de perfil a través de Expo Image Picker.

## 🛠 Stack Tecnológico
- **Framework Móvil:** React Native (v0.83.6)
- **Herramientas de Desarrollo:** Expo (SDK ~55)
- **Navegación:** React Navigation v7 (Native Stack & Bottom Tabs)
- **Gestor de Estado:** Zustand
- **Peticiones HTTP:** Axios
- **Manejo de Formularios:** React Hook Form
- **Almacenamiento Local Seguro:** Expo Secure Store & Async Storage
- **Calidad de Código:** ESLint, Prettier, Husky, Commitizen

## 📁 Estructura del Proyecto
```
Restaurante-Client-User/
├── assets/          # Imágenes estáticas, fuentes e iconos locales
├── src/             # Código fuente de la aplicación
│   ├── components/  # Componentes reutilizables de UI
│   ├── screens/     # Pantallas principales (Login, Home, Profile, etc.)
│   ├── navigation/  # Configuración de rutas (Stack, Tabs)
│   ├── store/       # Estados globales (Zustand)
│   └── utils/       # Funciones auxiliares (axios config, validaciones)
├── App.jsx          # Componente principal / Entry point
├── app.json         # Configuración del manifiesto de Expo
└── package.json     # Dependencias y scripts
```

## 📋 Requisitos Previos
Para correr la aplicación móvil necesitas:
- [Node.js](https://nodejs.org/) instalado.
- Dispositivo móvil físico con la app de **Expo Go** instalada (disponible en App Store / Google Play).
- O en su defecto, un Emulador de Android o Simulador de iOS correctamente configurado en tu PC/Mac.
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (opcional si usas los scripts de npm).

## ⚙️ Pasos para Clonar y Ejecutar

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/IN6CM-GestorRestaurante/Restaurante-Client-User.git
   cd Restaurante-Client-User
   ```

2. **Instalar dependencias:**
   Es preferible utilizar `npm` o `yarn`.
   ```bash
   npm install
   ```
   *(Nota: El proyecto incluye un script postinstall para parchar un conflicto menor de Zustand con Expo)*.

3. **Variables de Entorno:**
   Crea un archivo `.env` en la raíz (usa `.env.example` si existe) para configurar la URL del servidor backend:
   ```env
   EXPO_PUBLIC_API_URL=http://tu-ip-local:3000/api
   ```
   *Importante: Usa la IP local de tu máquina de desarrollo, no 'localhost', ya que Expo corre en la red local para comunicarse con el celular físico.*

4. **Levantar la aplicación en desarrollo:**
   ```bash
   npm run start
   ```
   - Escanea el código QR que aparecerá en la terminal con la cámara de tu celular (iOS) o con la app Expo Go (Android).
   - O presiona `a` para abrir en el emulador de Android.
   - O presiona `i` para abrir en el simulador de iOS.

## 🤝 Estándar de Commits
Este proyecto está configurado con Husky y Commitizen. Al commitear, ejecuta:
```bash
npm run commit
```
Y sigue el flujo de CLI para estandarizar tus mensajes.
