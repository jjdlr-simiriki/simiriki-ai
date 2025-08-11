## Servicio de despliegue

El sitio Simiriki es híbrido (landing estática + endpoints tipo `/api/assist`) y **no requiere un servidor Node.js completo**. Por esta razón, el despliegue se realiza en **Azure Static Web Apps**, que soporta sitios estáticos, SSR, React Server Components y rutas API en un único recurso. Static Web Apps aloja el contenido estático globalmente y ejecuta las funciones de backend como serverless.

---

## Repositorios y CI/CD

El código fuente está en **GitHub**: [`jjdlr-simiriki/simiriki-ai`](https://github.com/jjdlr-simiriki/simiriki-ai).

El despliegue se gestiona con **GitHub Actions**, ya configurado para publicar automáticamente en Azure Static Web Apps tras cada push a `main`.  
Esta opción es más sencilla y directa que trasladar el flujo a Azure DevOps.  
Si en algún momento decides migrar el CI/CD a Azure DevOps, solo necesitarás:
- El `deployment_token` de Static Web Apps como variable secreta.
- Un archivo YAML de pipeline adaptado.

---

## API / Backend

Simiriki **usa funciones serverless para la ruta `/api/assist`** (Next.js API routes).  
No cuenta con un backend Node.js completo; todas las rutas API se gestionan como funciones serverless en Static Web Apps.  
En la configuración de despliegue, esto se declara con:

```yaml
api_location: "api"
```

---

**Resumen:**  
- Despliegue en Azure Static Web Apps.
- CI/CD con GitHub Actions sobre el repo `jjdlr-simiriki/simiriki-ai`.
- API endpoint gestionado como función serverless, sin backend Node.js tradicional.