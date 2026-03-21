#!/bin/bash

echo "🚀 Installation de la base de données PostgreSQL pour la Conférence IA & TE 2025"

# Lire les variables du fichier .env
if [ -f "server/.env" ]; then
    source server/.env
    echo "✅ Variables d'environnement chargées depuis server/.env"
else
    echo "❌ Fichier .env non trouvé"
    exit 1
fi

# Vérification des variables d'environnement
if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
    echo "❌ Variables d'environnement manquantes dans le fichier .env"
    exit 1
fi

echo "📊 Configuration de la base de données :"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME (nouveau nom pour éviter les conflits)"
echo "   User: $DB_USER"
echo ""

# Test de connexion à PostgreSQL
echo "🔗 Test de connexion à PostgreSQL..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "SELECT 1;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Connexion à PostgreSQL réussie"
else
    echo "❌ Impossible de se connecter à PostgreSQL"
    echo "   Vérifiez que PostgreSQL est en cours d'exécution"
    echo "   Vérifiez vos identifiants dans le fichier .env"
    exit 1
fi

# Création de la base de données si elle n'existe pas
echo "🗄️  Vérification de l'existence de la base de données..."
DB_EXISTS=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -t -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" | xargs)

if [ "$DB_EXISTS" = "1" ]; then
    echo "✅ La base de données '$DB_NAME' existe déjà"
else
    echo "➕ Création de la base de données '$DB_NAME'..."
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✅ Base de données '$DB_NAME' créée avec succès"
    else
        echo "❌ Erreur lors de la création de la base de données"
        exit 1
    fi
fi

# Exécution du script de schéma
echo "📜 Exécution du script de création du schéma..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f database/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schéma de base de données installé avec succès"
else
    echo "❌ Erreur lors de l'installation du schéma"
    exit 1
fi

# Vérification de l'installation
echo "🔍 Vérification de l'installation..."
TABLE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)

echo "📊 Statistiques de l'installation :"
echo "   Nombre de tables créées: $TABLE_COUNT"
echo "   Tables principales: users, speakers, committees, program_schedule, submissions, registrations, sponsors"

# Test de connexion avec les données
echo "🧪 Test de connexion avec les données..."
TEST_USER=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT username FROM users WHERE username = 'admin';" | xargs)

if [ "$TEST_USER" = "admin" ]; then
    echo "✅ Données initiales installées avec succès"
    echo "   Utilisateur admin: admin"
    echo "   Mot de passe: admin123"
else
    echo "⚠️  Données initiales non trouvées, mais le schéma est installé"
fi

echo ""
echo "🎉 Installation de la base de données terminée avec succès !"
echo ""
echo "🔧 Prochaines étapes :"
echo "   1. Lancez le serveur : cd server && npm run dev"
echo "   2. Accédez au site : http://localhost:3000"
echo "   3. Espace admin : http://localhost:3000/admin.html"
echo "   4. Identifiants admin : admin / admin123"
echo ""
echo "⚠️  N'oubliez pas de changer le mot de passe administrateur après la première connexion !"