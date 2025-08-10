# Configuración de Dominios Personalizados y HTTPS en Azure Static Web Apps

Esta guía te ayudará a configurar dominios personalizados (`simiriki.com` y `www.simiriki.com`) y habilitar HTTPS en Azure Static Web Apps.

## Requisitos Previos

- Azure Static Web App creada y funcionando
- Dominio registrado (`simiriki.com`)
- Acceso al panel de control de tu registrador de dominio
- Permisos de propietario o colaborador en la suscripción de Azure

## Paso 1: Acceder a tu Azure Static Web App

1. Inicia sesión en el [Portal de Azure](https://portal.azure.com)
2. Navega a tu recurso de **Azure Static Web Apps**
3. Selecciona tu aplicación web estática de la lista

## Paso 2: Configurar el Dominio Principal (simiriki.com)

### 2.1 Agregar el Dominio Personalizado

1. En el menú lateral de tu Static Web App, selecciona **"Custom domains"**
2. Haz clic en **"+ Add"**
3. Selecciona **"Custom domain on other DNS"**
4. Introduce `simiriki.com` en el campo de dominio
5. Haz clic en **"Next"**

### 2.2 Configurar DNS - Registro CNAME

Azure te proporcionará un valor CNAME que necesitas configurar en tu registrador de dominio:

1. **Copia el valor CNAME** que Azure te proporciona (similar a `victorious-sea-123456789.1.azurestaticapps.net`)
2. Ve al panel de control de tu registrador de dominio
3. Accede a la configuración DNS
4. Crea un **registro CNAME** con los siguientes valores:
   - **Nombre/Host**: `@` o déjalo vacío (para el dominio raíz)
   - **Tipo**: `CNAME`
   - **Valor/Destino**: El valor proporcionado por Azure
   - **TTL**: `300` (5 minutos) o el valor mínimo permitido

> **Nota**: Algunos registradores no permiten registros CNAME para dominios raíz. En ese caso, usa un registro A con la IP proporcionada por Azure.

### 2.3 Verificación del Dominio

1. Espera a que la propagación DNS se complete (puede tardar hasta 48 horas, pero generalmente es más rápido)
2. En Azure Portal, haz clic en **"Validate"**
3. Una vez validado exitosamente, haz clic en **"Add"**

## Paso 3: Configurar el Subdominio WWW (www.simiriki.com)

### 3.1 Agregar el Subdominio WWW

1. Nuevamente en **"Custom domains"**, haz clic en **"+ Add"**
2. Selecciona **"Custom domain on other DNS"**
3. Introduce `www.simiriki.com`
4. Haz clic en **"Next"**

### 3.2 Configurar DNS - Registro CNAME para WWW

1. **Copia el valor CNAME** para el subdominio www
2. En tu registrador de dominio, crea un **registro CNAME**:
   - **Nombre/Host**: `www`
   - **Tipo**: `CNAME`
   - **Valor/Destino**: El valor CNAME proporcionado por Azure
   - **TTL**: `300`

### 3.3 Verificar y Agregar

1. Espera la propagación DNS
2. Valida el dominio en Azure Portal
3. Agrega el dominio una vez validado

## Paso 4: Configurar HTTPS (SSL/TLS)

Azure Static Web Apps proporciona certificados SSL gratuitos automáticamente.

### 4.1 Habilitar HTTPS Automático

1. Una vez que ambos dominios estén agregados y validados
2. Azure comenzará automáticamente el proceso de provisión de certificados SSL
3. Este proceso puede tardar entre 5-15 minutos

### 4.2 Verificar el Estado SSL

1. En la sección **"Custom domains"**, verifica que ambos dominios muestren:
   - Estado: **"Ready"**
   - SSL State: **"Certificate issued"**
   - HTTPS: **"Secured"**

## Paso 5: Configurar Redirección (Opcional pero Recomendado)

### 5.1 Configurar Redirección de WWW a No-WWW o Viceversa

Crea un archivo `staticwebapp.config.json` en la carpeta `public` de tu proyecto:

```json
{
  "routes": [
    {
      "route": "/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "globalHeaders": {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html"
    }
  }
}
```

### 5.2 Redirección a Nivel de DNS (Alternativa)

Si prefieres manejar la redirección a nivel de DNS:
- Configura `simiriki.com` como el dominio principal
- Configura `www.simiriki.com` para redirigir a `simiriki.com`

## Paso 6: Verificación Final

### 6.1 Pruebas de Funcionamiento

Verifica que todo funcione correctamente:

1. **Acceso HTTP**: 
   - `http://simiriki.com` → debe redirigir a `https://simiriki.com`
   - `http://www.simiriki.com` → debe redirigir a `https://www.simiriki.com`

2. **Acceso HTTPS**:
   - `https://simiriki.com` → debe cargar correctamente con certificado válido
   - `https://www.simiriki.com` → debe cargar correctamente con certificado válido

3. **Certificado SSL**:
   - Verifica en el navegador que el candado de seguridad esté presente
   - Revisa que el certificado sea válido y no haya warnings

### 6.2 Herramientas de Verificación

Utiliza estas herramientas para verificar la configuración:

- **DNS**: `dig simiriki.com` o `nslookup simiriki.com`
- **SSL**: [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)
- **Conectividad**: `curl -I https://simiriki.com`

## Solución de Problemas Comunes

### Problema: "Domain validation failed"

**Solución**:
1. Verifica que el registro DNS esté configurado correctamente
2. Espera más tiempo para la propagación DNS (hasta 48 horas)
3. Usa herramientas como `dig` para verificar la propagación

### Problema: "SSL certificate not issued"

**Solución**:
1. Asegúrate de que el dominio esté completamente validado
2. Espera 15-30 minutos adicionales
3. Intenta eliminar y volver a agregar el dominio

### Problema: "Site not accessible"

**Solución**:
1. Verifica que la aplicación esté desplegada correctamente
2. Revisa los logs de deployment en Azure Portal
3. Confirma que el build se haya completado sin errores

## Mantenimiento Continuo

### Renovación Automática de Certificados

- Azure maneja automáticamente la renovación de certificados SSL
- Los certificados se renuevan aproximadamente 30 días antes del vencimiento
- No se requiere acción manual

### Monitoreo

- Configura alertas en Azure Monitor para monitorear la disponibilidad
- Revisa periódicamente el estado de los certificados SSL
- Mantén actualizados los registros DNS si cambias de proveedor

## Recursos Adicionales

- [Documentación oficial de Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Configuración de dominios personalizados](https://docs.microsoft.com/en-us/azure/static-web-apps/custom-domain)
- [Configuración SSL/TLS](https://docs.microsoft.com/en-us/azure/static-web-apps/custom-domain#configure-a-custom-domain)

---

**¿Necesitas ayuda?** Contacta al equipo de soporte de Simiriki en `soporte@simiriki.com`