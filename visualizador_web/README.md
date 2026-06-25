# Visualizador Dinámico de Población - DMQ (2001-2035)

Aplicación web interactiva diseñada para analizar y visualizar la dinámica poblacional del Distrito Metropolitano de Quito (DMQ). La herramienta presenta datos históricos (censos de 2001, 2010 y 2022) contrastados con proyecciones poblacionales hasta el año 2035, permitiendo filtros detallados a nivel de Administración Zonal y Parroquias.

## 📊 Características Principales
*   **Filtros Interactivos:** Consulta de datos por año específico o por parroquia.
*   **Gráficos Dinámicos:** Visualización de la evolución temporal de la población (líneas) y la distribución demográfica por sexo (dona), impulsados por `Chart.js`.
*   **KPIs en Tiempo Real:** Cálculo automático de la población actual, proyecciones a 2035 y tasas de crecimiento estimadas.
*   **Diseño Moderno y Responsivo:** Construido con HTML, CSS (Vanilla) y JS sin dependencias pesadas, garantizando una carga rápida e interfaz adaptativa (glassmorphism).

## 🏢 Créditos y Autoría
Este proyecto es el resultado de un esfuerzo colaborativo e interdisciplinario:
*   **Metodología, Estimaciones y Proyecciones de Datos:** Elaborado y validado por el **Instituto de Investigaciones de la Ciudad (IIC)**.
*   **Diseño, Arquitectura y Desarrollo del Visualizador:** Desarrollado por [Tu Equipo/Dirección].

## ⚙️ Tecnologías Utilizadas
*   **Frontend:** HTML5, CSS3 (Variables, CSS Grid/Flexbox), JavaScript (ES6+).
*   **Librerías Visuales:** [Chart.js](https://www.chartjs.org/) para el renderizado de gráficos estadísticos.
*   **Procesamiento de Datos (Backend offline):** Python (`pandas`) utilizado en el script `extract_data.py` para transformar los insumos de Excel en archivos JSON ligeros (`data.js`) legibles por el navegador.

## 🚀 Instalación y Uso Local
El proyecto no requiere de un servidor o base de datos activa (Serverless). Para ejecutarlo localmente:

1. Clona este repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   ```
2. Navega a la carpeta principal:
   ```bash
   cd visualizador_web
   ```
3. Abre el archivo `index.html` en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari).

## 🔄 Actualización de Datos
Si el IIC emite una nueva actualización de las proyecciones en formato Excel, los datos del visualizador pueden actualizarse fácilmente:
1. Reemplaza los archivos `.xlsx` en las carpetas base.
2. Ejecuta el script de extracción:
   ```bash
   python extract_data.py
   ```
3. El script automáticamente regenerará el archivo `data.js` con la información más reciente. No es necesario modificar el código HTML o JavaScript.
