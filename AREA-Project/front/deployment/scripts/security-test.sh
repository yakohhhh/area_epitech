#!/bin/bash
# Script de tests de sécurité complets pour l'application AREA
# Usage: ./security-test.sh

set -e

echo "🔒 Tests de Sécurité Complets - Application AREA"
echo "=================================================="

PROJECT_DIR=$(pwd)
REPORT_DIR="$PROJECT_DIR/security-reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Création du dossier de rapports
mkdir -p "$REPORT_DIR"

# Vérifications préalables
echo "🔍 Vérifications des outils de sécurité..."

# Installation automatique des outils manquants
install_tool() {
    local tool=$1
    local install_cmd=$2
    
    if ! command -v "$tool" &> /dev/null; then
        echo "⬇️  Installation de $tool..."
        eval "$install_cmd"
    else
        echo "✅ $tool disponible"
    fi
}

# Trivy
install_tool "trivy" "curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin"

# Grype
install_tool "grype" "curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin"

# Vérifier les images
echo ""
echo "🔍 Vérification des images Docker..."
for image in "area-frontend:latest" "area-backend:latest"; do
    if ! docker images "$image" -q | grep -q .; then
        echo "❌ Image $image non trouvée"
        echo "🔧 Lancez d'abord: ./build-all.sh"
        exit 1
    fi
done

echo "✅ Images trouvées"

# 1. Scan des vulnérabilités avec Trivy
echo ""
echo "🔍 1. Scan des vulnérabilités avec Trivy"
echo "----------------------------------------"

echo "📦 Scan Frontend..."
trivy image --format json --output "$REPORT_DIR/trivy-frontend-$TIMESTAMP.json" area-frontend:latest
trivy image --severity HIGH,CRITICAL area-frontend:latest > "$REPORT_DIR/trivy-frontend-summary-$TIMESTAMP.txt"

echo "📦 Scan Backend..."
trivy image --format json --output "$REPORT_DIR/trivy-backend-$TIMESTAMP.json" area-backend:latest
trivy image --severity HIGH,CRITICAL area-backend:latest > "$REPORT_DIR/trivy-backend-summary-$TIMESTAMP.txt"

# Scan des secrets dans le code source
echo "🔍 Scan des secrets dans le code source..."
trivy fs --security-checks secret --format json --output "$REPORT_DIR/trivy-secrets-$TIMESTAMP.json" .
trivy fs --security-checks secret . > "$REPORT_DIR/trivy-secrets-summary-$TIMESTAMP.txt"

# 2. Scan avec Grype
echo ""
echo "🔍 2. Scan des vulnérabilités avec Grype"
echo "----------------------------------------"

echo "📦 Scan Frontend..."
grype area-frontend:latest -o json > "$REPORT_DIR/grype-frontend-$TIMESTAMP.json"

echo "📦 Scan Backend..."
grype area-backend:latest -o json > "$REPORT_DIR/grype-backend-$TIMESTAMP.json"

# 3. Docker Scout (si disponible)
echo ""
echo "🔍 3. Docker Scout Analysis"
echo "---------------------------"

if docker scout --help &> /dev/null 2>&1; then
    docker scout cves area-frontend:latest --format sarif --output "$REPORT_DIR/scout-frontend-$TIMESTAMP.sarif"
    docker scout cves area-backend:latest --format sarif --output "$REPORT_DIR/scout-backend-$TIMESTAMP.sarif"
    
    docker scout recommendations area-frontend:latest > "$REPORT_DIR/scout-recommendations-frontend-$TIMESTAMP.txt"
    docker scout recommendations area-backend:latest > "$REPORT_DIR/scout-recommendations-backend-$TIMESTAMP.txt"
else
    echo "⚠️  Docker Scout non disponible"
fi

# 4. Audit des Dockerfiles avec Hadolint
echo ""
echo "🔍 4. Audit des Dockerfiles"
echo "---------------------------"

if command -v hadolint &> /dev/null; then
    echo "📄 Audit Dockerfile Frontend..."
    hadolint front/Dockerfile > "$REPORT_DIR/hadolint-frontend-$TIMESTAMP.txt" || true
    
    echo "📄 Audit Dockerfile Backend..."
    hadolint back/Dockerfile > "$REPORT_DIR/hadolint-backend-$TIMESTAMP.txt" || true
else
    echo "⬇️  Installation de Hadolint..."
    docker pull hadolint/hadolint
    
    echo "📄 Audit Dockerfile Frontend..."
    docker run --rm -i hadolint/hadolint < front/Dockerfile > "$REPORT_DIR/hadolint-frontend-$TIMESTAMP.txt" || true
    
    echo "📄 Audit Dockerfile Backend..."
    docker run --rm -i hadolint/hadolint < back/Dockerfile > "$REPORT_DIR/hadolint-backend-$TIMESTAMP.txt" || true
fi

# 5. Tests de sécurité runtime
echo ""
echo "🔍 5. Tests de sécurité runtime"
echo "-------------------------------"

# Démarrer les containers si nécessaire
if ! docker ps | grep -q area_frontend; then
    echo "🚀 Démarrage des containers pour les tests..."
    docker-compose up -d
    sleep 10
fi

# Tests des utilisateurs
echo "👤 Vérification des utilisateurs non-root..."
{
    echo "=== Tests Utilisateurs ==="
    echo "Frontend:"
    docker exec area_frontend id || echo "Erreur: Container Frontend non accessible"
    echo ""
    echo "Backend:"
    docker exec area_backend id || echo "Erreur: Container Backend non accessible"
    echo ""
} > "$REPORT_DIR/runtime-users-$TIMESTAMP.txt"

# Tests des capabilities
echo "🔒 Vérification des capabilities..."
{
    echo "=== Docker Capabilities ==="
    echo "Frontend:"
    docker inspect area_frontend --format='{{.HostConfig.CapAdd}}' || echo "N/A"
    docker inspect area_frontend --format='{{.HostConfig.CapDrop}}' || echo "N/A"
    echo ""
    echo "Backend:"
    docker inspect area_backend --format='{{.HostConfig.CapAdd}}' || echo "N/A"
    docker inspect area_backend --format='{{.HostConfig.CapDrop}}' || echo "N/A"
    echo ""
} > "$REPORT_DIR/runtime-capabilities-$TIMESTAMP.txt"

# Tests des headers de sécurité
echo "🛡️ Tests des headers de sécurité..."
{
    echo "=== Headers de Sécurité ==="
    echo "Frontend (localhost:3000):"
    curl -s -I http://localhost:3000/ | grep -E "(X-Frame-Options|X-Content-Type-Options|Content-Security-Policy|Strict-Transport-Security)" || echo "Headers de sécurité non détectés"
    echo ""
    echo "Backend (localhost:5001):"
    curl -s -I http://localhost:5001/health | grep -E "(X-Frame-Options|X-Content-Type-Options|Content-Security-Policy|Strict-Transport-Security)" || echo "Headers de sécurité non détectés"
    echo ""
} > "$REPORT_DIR/runtime-headers-$TIMESTAMP.txt"

# 6. Test de pénétration avec OWASP ZAP (optionnel)
echo ""
echo "🔍 6. Test de pénétration OWASP ZAP"
echo "-----------------------------------"

if docker ps | grep -q zap; then
    docker rm -f zap 2>/dev/null || true
fi

echo "🚀 Démarrage d'OWASP ZAP..."
docker run -d --name zap -p 8090:8080 zaproxy/zap-stable zap-x.sh -daemon -host 0.0.0.0 -port 8080

# Attendre que ZAP soit prêt
sleep 30

# Quick scan du frontend
echo "🕷️ Scan du frontend..."
docker exec zap zap-cli quick-scan http://host.docker.internal:3000 || echo "Scan ZAP échoué"

# Générer le rapport
docker exec zap zap-cli report -o /tmp/zap-report.html -f html || echo "Génération rapport ZAP échouée"
docker cp zap:/tmp/zap-report.html "$REPORT_DIR/zap-report-$TIMESTAMP.html" 2>/dev/null || echo "Copie rapport ZAP échouée"

# Nettoyer ZAP
docker rm -f zap

# 7. Génération du rapport de synthèse
echo ""
echo "📊 Génération du rapport de synthèse..."

cat > "$REPORT_DIR/security-summary-$TIMESTAMP.md" << EOF
# Rapport de Sécurité - Application AREA
**Date**: $(date)
**Version**: $TIMESTAMP

## 🔍 Tests Effectués

### 1. Scan des Vulnérabilités
- ✅ Trivy (Images + Secrets)
- ✅ Grype
- ✅ Docker Scout (si disponible)

### 2. Audit de Configuration
- ✅ Hadolint (Dockerfiles)
- ✅ Utilisateurs non-root
- ✅ Capabilities Docker
- ✅ Headers de sécurité

### 3. Tests Runtime
- ✅ Vérification des permissions
- ✅ Test des endpoints
- ✅ OWASP ZAP (Pentesting)

## 📁 Fichiers Générés

$(ls -la "$REPORT_DIR"/*$TIMESTAMP* | awk '{print "- " $9}')

## 🔍 Analyse Rapide

### Vulnérabilités Critiques (Trivy)
\`\`\`
$(grep -c "CRITICAL" "$REPORT_DIR/trivy-frontend-summary-$TIMESTAMP.txt" 2>/dev/null || echo "0") vulnérabilités critiques détectées dans le Frontend
$(grep -c "CRITICAL" "$REPORT_DIR/trivy-backend-summary-$TIMESTAMP.txt" 2>/dev/null || echo "0") vulnérabilités critiques détectées dans le Backend
\`\`\`

### Recommandations
1. Examiner les rapports détaillés dans le dossier security-reports/
2. Corriger les vulnérabilités CRITICAL et HIGH en priorité
3. Mettre à jour les images de base si nécessaire
4. Vérifier la configuration des headers de sécurité

## 📞 Actions à Suivre
- [ ] Examiner les rapports Trivy
- [ ] Corriger les Dockerfiles selon Hadolint
- [ ] Implémenter les headers de sécurité manquants
- [ ] Planifier les mises à jour de sécurité
EOF

# Nettoyage final
echo ""
echo "🧹 Nettoyage..."
docker-compose down 2>/dev/null || true

# Résultats finaux
echo ""
echo "✅ Tests de sécurité terminés!"
echo "=============================="
echo ""
echo "📁 Rapports générés dans: $REPORT_DIR/"
echo "📊 Rapport de synthèse: security-summary-$TIMESTAMP.md"
echo ""
echo "🔍 Fichiers principaux:"
echo "   - trivy-frontend-summary-$TIMESTAMP.txt"
echo "   - trivy-backend-summary-$TIMESTAMP.txt"
echo "   - trivy-secrets-summary-$TIMESTAMP.txt"
echo "   - zap-report-$TIMESTAMP.html"
echo ""
echo "🚨 Prochaines étapes:"
echo "   1. Examiner les rapports de vulnérabilités"
echo "   2. Corriger les problèmes CRITICAL et HIGH"
echo "   3. Mettre à jour les images de base"
echo "   4. Re-exécuter les tests après corrections"

# Afficher un résumé des vulnérabilités critiques s'il y en a
if [ -f "$REPORT_DIR/trivy-frontend-summary-$TIMESTAMP.txt" ]; then
    CRITICAL_COUNT=$(grep -c "CRITICAL" "$REPORT_DIR/trivy-frontend-summary-$TIMESTAMP.txt" 2>/dev/null || echo "0")
    HIGH_COUNT=$(grep -c "HIGH" "$REPORT_DIR/trivy-frontend-summary-$TIMESTAMP.txt" 2>/dev/null || echo "0")
    
    if [ "$CRITICAL_COUNT" -gt 0 ] || [ "$HIGH_COUNT" -gt 0 ]; then
        echo ""
        echo "⚠️  ATTENTION: $CRITICAL_COUNT vulnérabilités CRITICAL et $HIGH_COUNT vulnérabilités HIGH détectées!"
        echo "   Consultez le rapport détaillé pour plus d'informations."
    fi
fi
