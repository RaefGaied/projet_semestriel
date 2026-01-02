# Script de vérification PostgreSQL
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "🔍 VÉRIFICATION POSTGRESQL" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# 1. Vérifier la version
Write-Host "1️⃣ Version PostgreSQL:" -ForegroundColor Yellow
try {
    psql --version
    Write-Host "   ✅ PostgreSQL installé`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ PostgreSQL NON installé`n" -ForegroundColor Red
}

# 2. Vérifier le service
Write-Host "2️⃣ Service PostgreSQL:" -ForegroundColor Yellow
$services = Get-Service -Name "*postgres*" -ErrorAction SilentlyContinue
if ($services) {
    foreach ($service in $services) {
        $status = if ($service.Status -eq 'Running') { "✅" } else { "⚠️" }
        Write-Host "   $status $($service.Name): $($service.Status)" -ForegroundColor $(if ($service.Status -eq 'Running') { 'Green' } else { 'Yellow' })
    }
    Write-Host ""
} else {
    Write-Host "   ❌ Aucun service PostgreSQL trouvé`n" -ForegroundColor Red
}

# 3. Vérifier le port
Write-Host "3️⃣ Port 5432 (défaut):" -ForegroundColor Yellow
$port = Test-NetConnection -ComputerName localhost -Port 5432 -WarningAction SilentlyContinue
if ($port.TcpTestSucceeded) {
    Write-Host "   ✅ Port 5432 ouvert (PostgreSQL écoute)`n" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ Port 5432 fermé ou PostgreSQL non lancé`n" -ForegroundColor Yellow
}

# 4. Vérifier pgAdmin
Write-Host "4️⃣ pgAdmin (interface graphique):" -ForegroundColor Yellow
$pgAdmin = Get-ChildItem "C:\Program Files\pgAdmin*" -ErrorAction SilentlyContinue
if ($pgAdmin) {
    Write-Host "   ✅ pgAdmin installé: $($pgAdmin.FullName)`n" -ForegroundColor Green
} else {
    Write-Host "   ℹ️ pgAdmin non trouvé (optionnel)`n" -ForegroundColor Cyan
}

# 5. Vérifier les variables d'environnement
Write-Host "5️⃣ PATH système:" -ForegroundColor Yellow
$pgPath = $env:Path -split ';' | Where-Object { $_ -like "*PostgreSQL*" }
if ($pgPath) {
    Write-Host "   ✅ PostgreSQL dans le PATH`n" -ForegroundColor Green
    foreach ($path in $pgPath) {
        Write-Host "      - $path" -ForegroundColor Gray
    }
    Write-Host ""
} else {
    Write-Host "   ⚠️ PostgreSQL absent du PATH (⚠️ Redémarrer le terminal)`n" -ForegroundColor Yellow
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "RÉSUMÉ" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

if (Get-Command psql -ErrorAction SilentlyContinue) {
    Write-Host "✅ PostgreSQL est prêt à l'emploi!" -ForegroundColor Green
    Write-Host "`nCommandes utiles:" -ForegroundColor Cyan
    Write-Host "  psql -U postgres              # Se connecter" -ForegroundColor Gray
    Write-Host "  Get-Service *postgres*        # Voir les services" -ForegroundColor Gray
    Write-Host "  Start-Service postgresql-x64  # Démarrer le service" -ForegroundColor Gray
} else {
    Write-Host "❌ PostgreSQL n'est pas encore installé" -ForegroundColor Red
    Write-Host "`nOptions d'installation:" -ForegroundColor Cyan
    Write-Host "  1. Télécharger: https://www.postgresql.org/download/windows/" -ForegroundColor Gray
    Write-Host "  2. Chocolatey: choco install postgresql15 -y" -ForegroundColor Gray
    Write-Host "  3. Winget: winget install PostgreSQL.PostgreSQL" -ForegroundColor Gray
}

Write-Host "`n"
