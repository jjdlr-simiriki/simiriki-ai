import os
from pathlib import Path
from github import Github

# Usa un token de GitHub con permisos de lectura/escritura en el repo
token = os.environ["GITHUB_TOKEN"]
repo_name = "jjdlr-simiriki/simiriki-ai"

# Inicializa el cliente
g = Github(token)
repo = g.get_repo(repo_name)

# Directorio local donde guardaste los archivos
base_dir = Path("/tmp/simiriki-update")

# Lista de archivos a subir con su ruta en el repo
files_to_push = {
    "scripts/ms-enrich.js": base_dir / "scripts/ms-enrich.js",
    "src/middleware/rateLimitMiddleware.ts": base_dir / "src/middleware/rateLimitMiddleware.ts",
    "tests/route.test.ts": base_dir / "tests/route.test.ts",
    "email-templates/compose_template.html": base_dir / "email-templates/compose_template.html",
}

for remote_path, local_path in files_to_push.items():
    content = local_path.read_text()

    try:
        # Si el archivo existe, actualízalo
        existing = repo.get_contents(remote_path, ref="main")
        repo.update_file(
            path=remote_path,
            message=f"feat: actualiza {remote_path}",
            content=content,
            sha=existing.sha,
            branch="main",
        )
        print(f"Actualizado: {remote_path}")
    except Exception:
        # Si no existe, créalo
        repo.create_file(
            path=remote_path,
            message=f"feat: añade {remote_path}",
            content=content,
            branch="main",
        )
        print(f"Creado: {remote_path}")

print("Completado. Cambios subidos a main.")
