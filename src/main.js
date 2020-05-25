import "babel-polyfill";
import { gsap } from "gsap";
import Config from "./Classes/class.config";
import Timer from "./Classes/class.timer";
import Form from "./Classes/class.form";

window.onload = function () {
    const SETTINGS_BUTTON = document.getElementById("settings-button");
    let appConfig = new Config();
    let appForm = new Form(appConfig.activitiesList, appConfig.isTestMode);
    let appTimer = new Timer(appConfig.activitiesList, appConfig.minuteDuration);

    appForm.show();

    document.addEventListener("formAskToLaunchTimer", prepareTimer);

    // A la validation du formulaire
    function prepareTimer(e) {
        if (appTimer.isRunning)
            appTimer.stopAllTimers();

        appTimer.prepare(e.detail.userChoices);
        document.addEventListener("timerReady", launchTimer(e));
    }

    
    function launchTimer(e) {
        appForm.hide();
        appTimer.start();
        showSettingsButton();
    }
    
    function showSettingsButton() {
        SETTINGS_BUTTON.style.opacity = 0;
        SETTINGS_BUTTON.style.display = 'initial';
        SETTINGS_BUTTON.addEventListener("click", openSettings);
        let animSettingsButton = gsap.to(SETTINGS_BUTTON, {opacity: 1, duration: 1, ease: "none"});
    }

    function openSettings() {
        appForm.show();
        SETTINGS_BUTTON.removeEventListener("click", openSettings);
        document.addEventListener("changeTimerCancelled", closeSettings);        

        let animSettingsButton = gsap.to(SETTINGS_BUTTON, {opacity: 0, duration: 1, ease: "none"});
    }

    function closeSettings() {
        appForm.hide();
        showSettingsButton();
    }    
};