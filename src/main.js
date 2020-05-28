import "babel-polyfill";
import { gsap } from "gsap";
import Config from "./Classes/class.config";
import Timer from "./Classes/class.timer";
import Form from "./Classes/class.form";

window.onload = function () {

    // Elément(s) HTML manipulé(s)
    const SETTINGS_BUTTON = document.getElementById("settings-button");

    // Initialisation
    let appConfig = new Config();
    let appForm = new Form(appConfig.activitiesList, appConfig.isTestMode);
    let appTimer = new Timer(appConfig.activitiesList, appConfig.minuteDuration);

    // On affiche le formulaire
    appForm.show();

    // On attend que le formulaire soit rempli, validé et vérifié pour préparer le timer.
    document.addEventListener("formAskToLaunchTimer", prepareTimer);

    function prepareTimer(e) {
        if (appTimer.isRunning)
            appTimer.stopAllTimers();

        appTimer.prepare(e.detail.userChoices);
        // On attend que le timer soit prêt en arrière-plan pour masquer le formulaire et lancer le timer
        document.addEventListener("timerReady", launchTimer(e));
    }
    
    function launchTimer(e) {
        appForm.hide();
        appTimer.start();
        showSettingsButton();
    }
    
    function showSettingsButton() {
        // Le bouton de réglages permet de refaire apparaître le formulaire
        SETTINGS_BUTTON.style.opacity = 0;
        SETTINGS_BUTTON.style.display = 'initial';
        SETTINGS_BUTTON.addEventListener("click", openSettings);
        let animSettingsButton = gsap.to(SETTINGS_BUTTON, {opacity: 1, duration: 1, ease: "none"});
    }

    function openSettings() {
        // Quand on affiche le formulaire, on masque et désactive le bouton de réglages
        appForm.show();
        SETTINGS_BUTTON.removeEventListener("click", openSettings);
        
        let animSettingsButton = gsap.to(SETTINGS_BUTTON, {opacity: 0, duration: 1, ease: "none"});

        // Si jamais l'utilisateur change d'avis et referme le formulaire, on refait apparaître le bouton de réglages et on cache le formulaire.
        document.addEventListener("changeTimerCancelled", closeSettings);
    }

    function closeSettings() {
        appForm.hide();
        showSettingsButton();
    }    
};