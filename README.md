# Estimación y Proyección Poblacional DMQ (2022-2035)

Este repositorio contiene los insumos, resultados, rutinas de procesamiento y el código fuente del visualizador web interactivo para la dinámica poblacional del Distrito Metropolitano de Quito (DMQ).

## 📁 Estructura del Repositorio

* **`01_INSUMOS/`**: Contiene las bases de datos históricas (censos 2001, 2010 y 2022) y los parámetros base utilizados para la estimación poblacional.
* **`02_RESULTADOS/`**: Modelos de proyección poblacional (exponencial, lineal, logarítmico, polinómico) y resultados finales por parroquia y sexo hasta el año 2035.
* **`03_RUTINAS/`**: Scripts y metodologías utilizadas para calcular y generar las proyecciones.
* **`visualizador_web/`**: Aplicación web interactiva (HTML, CSS, JS) para explorar visualmente la evolución y proyección de la población sin necesidad de software especializado.

## 🏢 Créditos y Autoría

Este repositorio representa un trabajo interdisciplinario:

* **Metodología, Estimaciones y Proyecciones de Datos:** Desarrollado, calculado y validado por el **Instituto de Investigaciones de la Ciudad (IIC)**.
* **Desarrollo del Visualizador Web y Organización:** Creado por la **Dirección de Gestión de la Información (DMGI)**.

## 🚀 Uso del Visualizador

Para utilizar el dashboard interactivo de manera local, simplemente navega a la carpeta `visualizador_web/` y abre el archivo `index.html` en tu navegador web de preferencia.

---

## 🔁 Replicación del análisis en R

### Requisitos

- [R](https://cran.r-project.org/) versión 4.0 o superior
- [RStudio](https://posit.co/download/rstudio-desktop/)

Instala los paquetes necesarios ejecutando en la consola de R:

```r
install.packages(c(
  "rmarkdown", "readxl", "openxlsx", "writexl",
  "dplyr", "tidyr", "stringr",
  "ggplot2", "scales",
  "flextable", "tibble"
))
```

### Paso 1 — Fijar el directorio de trabajo

> **Este es el paso clave.** Los scripts usan rutas relativas, por lo que el directorio de trabajo debe ser la carpeta raíz del repositorio (la que contiene `01_INSUMOS`, `02_RESULTADOS` y `03_RUTINAS`).

**Opción A — Desde el menú de RStudio:**

```
Session → Set Working Directory → Choose Directory...
```

Selecciona la carpeta raíz del repositorio.

**Opción B — Desde la consola de R:**

```r
setwd("ruta/a/Poblacion-Quito-2022-2035")
```

**Opción C — Proyecto de RStudio (.Rproj):**
Crea un proyecto en la carpeta raíz. RStudio fijará el directorio automáticamente cada vez que lo abras.

### Paso 2 — Ejecutar los scripts en orden

Abre cada archivo `.Rmd` en RStudio y haz clic en **Knit** (`Ctrl+Shift+K`):

| Orden | Archivo                                                         | Descripción                              |
| ----- | --------------------------------------------------------------- | ----------------------------------------- |
| 1°   | `03_RUTINAS/01_Supuestos_estimacion_anual_parroquial_DMQ.Rmd` | Verificación de supuestos metodológicos |
| 2°   | `03_RUTINAS/02_Estimacion_anual_parroquial_DMQ.Rmd`           | Estimación parroquial 2023–2035         |

Los HTML se generan en `03_RUTINAS/` y los Excel de resultados en `02_RESULTADOS/`.

### Paso 3 — Verificar resultados

Los HTML generados deben ser equivalentes a los de `02_RESULTADOS/`. El archivo `03_Resultados_proyeccion2023_2035.xlsx` contiene los resultados en tres hojas:

| Hoja                       | Contenido                                                    |
| -------------------------- | ------------------------------------------------------------ |
| `modelo_exponencial`     | Población proyectada 2023–2035 con desagregación por sexo |
| `resultados_por_modelos` | Comparación de los 4 modelos evaluados                      |
| `poblacion_2022`         | Población base 2022 con proporciones por sexo               |

### Consideraciones metodológicas

- Los resultados son una **estimación tendencial de desagregación territorial**, no una proyección demográfica completa.
- La proyección cantonal oficial proviene del INEC (*Estimaciones y Proyecciones de la Población de Ecuador, revisión 2024*).
- La suma de las poblaciones parroquiales coincide exactamente con el total oficial del cantón Quito para cada año.
- La desagregación por sexo aplica proporciones constantes observadas en el Censo 2022.

---

## 📚 Referencias

- Instituto Nacional de Estadística y Censos. (2025). *Estimaciones y proyecciones de la población de Ecuador, revisión 2024*. INEC.
- Oficio Nro. IIC-2026-0224-O — Instituto de Investigaciones de la Ciudad.
- Circular Nro. GADDMQ-SGP-2026-C — Secretaría General de Planificación, GAD-DMQ.
