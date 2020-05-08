import "babel-polyfill";
import Config from "./class.config";
import Timer from "./class.timer";
import Form from "./class.form";

window.onload = function() 
{
    const SETTINGS_BUTTON = document.getElementById("settings-button");
    let Config = new Config();
    let Form = new Form();
    let Timer = new Timer();

    Form.show();

    Form.addEventListener("canLaunch", prepareTimer(e));
    // Todo : Utiliser d'abord un addEventListener et quand ca fonctionnera utiliser un async/await pour améliorer.

    // A la validation du formulaire
    function prepareTimer(e)
    {
        if(Timer.isRunning)
            Timer.stopAllTimers();
        Timer.addEventListener("timerReady", launchTimer(e));
        Timer.prepare(e.formData);
    }

    function launchTimer(e)
    {
        Form.hide();
        Timer.start();
        showSettingsButton();
    }

    function showSettingsButton()
    {
        SETTINGS_BUTTON.style.opacity = 0;
        SETTINGS_BUTTON.style.display = 'initial';
        SETTINGS_BUTTON.addEventListener("click", openSettings);
        let animSettingsButton = gsap.to(SETTINGS_BUTTON, {opacity: 1, duration: 1, ease: "none", delay:2});
    }

    function openSettings()
    {
        Form.show();
        SETTINGS_BUTTON.removeEventListener("click", openSettings);
        Form.addEventListener("changeTimerCancelled", showSettingsButton);
        // Todo : Activer le bouton Annuler du formulaire <= Le faire plutôt dans le Form.hide

        let animSettingsButton = gsap.to(SETTINGS_BUTTON, {opacity: 0, duration: 1, ease: "none"});
    }

    /*
    // Début version 1

    const POPUP = document.getElementById('popup');
    const MODAL = document.getElementById('modal');
    let anim_modal = gsap.to(MODAL, {opacity: 0.7, duration: 1, ease: "none"});
    let anim_popup = gsap.to(POPUP, {opacity: 1, duration: 1, ease: "none"});

    const LAUNCH_BUTTON = document.getElementById('launch');

    LAUNCH_BUTTON.addEventListener('click', function () {

        anim_modal.reverse();
        anim_popup.reverse();

    });
    */
    /*
    // version 0

    const ACTIVITIES = ["Rangement","Travail", "Préparation", "Repas", "Jeu", "Dessin animé"];
    const FIRST_SELECT = document.getElementById('first-activity-list');
    const FIRST_INPUT = document.getElementById('first-activity-time');
    const SECOND_SELECT = document.getElementById('second-activity-list');
    const SECOND_INPUT = document.getElementById('second-activity-time');
    const FIRST_ACTIVITY_BACKGROUND = document.getElementById('first-activity');
    const LOST_TIME = document.getElementById('lost-time');

    var areFieldsVisible = true;

    FIRST_ACTIVITY_BACKGROUND.addEventListener("click", function(event){
        if(!areFieldsVisible)
        {
          FIRST_SELECT.style.visibility = 'visible';
          FIRST_INPUT.style.visibility = 'visible';
          SECOND_SELECT.style.visibility = 'visible';
          SECOND_INPUT.style.visibility = 'visible';
        }
    });

    ACTIVITIES.forEach(function(element,key)
    {
        FIRST_SELECT[key+1] = new Option(element, element);
        SECOND_SELECT[key+1] = new Option(element, element);
    });

    FIRST_SELECT.onchange = function ()
    {
        let choice = FIRST_SELECT.selectedIndex;
        let value =  FIRST_SELECT.options[choice].value;
        document.getElementById('first-activity-name').innerText = value;
    }

    SECOND_SELECT.onchange = function ()
    {
        let choice = SECOND_SELECT.selectedIndex;
        let value =  SECOND_SELECT.options[choice].value;
        document.getElementById('second-activity-name').innerText = value;

        launchTimer();
    }

    function launchTimer()
    {
        FIRST_SELECT.style.visibility = 'hidden';
        FIRST_INPUT.style.visibility = 'hidden';
        SECOND_SELECT.style.visibility = 'hidden';
        SECOND_INPUT.style.visibility = 'hidden';
        areFieldsVisible = false;

        let firstActivityDuration = parseInt(FIRST_INPUT.value);
        let secondActivityDuration = parseInt(SECOND_INPUT.value);
        let percentage = Math.floor((firstActivityDuration*100)/(firstActivityDuration + secondActivityDuration));
        FIRST_ACTIVITY_BACKGROUND.style.width = percentage + "%";
        LOST_TIME.style.left = FIRST_ACTIVITY_BACKGROUND.offsetWidth + "px";

        let tween = gsap.to("#chat-noir", {x: FIRST_ACTIVITY_BACKGROUND.offsetWidth, duration: firstActivityDuration*10, ease: "none"});
        let tween2 = gsap.to("#chat-noir", {x: document.body.offsetWidth, duration: secondActivityDuration*10, delay: firstActivityDuration*10, ease: "none"});
        let tween3 = gsap.to("#lost-time", {width: (document.body.offsetWidth-FIRST_ACTIVITY_BACKGROUND.offsetWidth).toString() + "px", duration: secondActivityDuration*10, delay: firstActivityDuration*10, ease: "none"});
    }

    this.console.log("C'est prêt en live reload !");*/
}