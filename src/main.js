import "babel-polyfill";
//import Game from "./Classes/class.game.js";

window.onload = function() 
{
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

    this.console.log("C'est prêt en live reload !");
}