@echo off
REM Script Windows pour exécuter l'exploration ET L
REM A exécuter depuis: cd backend/etl

echo.
echo ======================================================================
echo  ETL - BI Mini-projet Hotel
echo ======================================================================
echo.

REM Vérifier Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python non trouvé
    echo Installez Python 3.8+
    exit /b 1
)

echo [1/4] Installation des dépendances...
pip install -r requirements.txt

if errorlevel 1 (
    echo ERROR: Installation échouée
    exit /b 1
)

echo [2/4] Exploration des données...
echo.
python exploration_data.py

if errorlevel 1 (
    echo ERROR: Exploration échouée
    exit /b 1
)

echo.
echo [3/4] Prochaine étape: Exécuter transformation_etl.py sur Google Colab
echo.
echo Instructions:
echo   1. Ouvrir Google Colab: https://colab.research.google.com
echo   2. Créer un nouveau notebook
echo   3. Copier le contenu de colab_notebook.py
echo   4. Exécuter cellule par cellule
echo   5. Télécharger les fichiers CSV générés
echo.
echo ======================================================================
echo.

pause
