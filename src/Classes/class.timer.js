import LostTimeStopWatch from "./class.lost-time-stopwatch";

export default class Timer {
    constructor(pActivitiesList, pMinuteDuration) {
        // Eléments HTML utiles
        this.FIRST_ACTIVITY_BACKGROUND = document.getElementById('first-activity-background');
        this.FIRST_ACTIVITY_ICON = document.getElementById('first-activity-icon'); 
        this.FIRST_ACTIVITY_NAME = document.getElementById('first-activity-name'); 
        this.STOP_TIMER_BUTTON = document.getElementById('stop-timer-button'); 
        this.WON_TIME = document.getElementById('won-time'); 
        this.SECOND_ACTIVITY_BACKGROUND = document.getElementById('second-activity-background'); 
        this.SECOND_ACTIVITY_ICON = document.getElementById('second-activity-icon'); 
        this.SECOND_ACTIVITY_NAME = document.getElementById('second-activity-name'); 
        this.LOST_TIME = document.getElementById('lost-time'); 
        this.CURSOR = document.getElementById('cursor'); 
        this.TIMELINE = document.getElementById('timeline'); 
        
        this.ACTIVITIES_LIST = pActivitiesList;
        this.MINUTE_DURATION = pMinuteDuration;
        this.isRunning = false;
    }

    prepare (pUserChoices){
        this.userChoices = pUserChoices;

        this.FIRST_ACTIVITY_ICON.src = this.ACTIVITIES_LIST[this.userChoices.firstActivityIndex].icon;
        this.SECOND_ACTIVITY_ICON.src = this.ACTIVITIES_LIST[this.userChoices.secondActivityIndex].icon;
        this.FIRST_ACTIVITY_NAME.innerHTML = this.ACTIVITIES_LIST[this.userChoices.firstActivityIndex].name;
        this.SECOND_ACTIVITY_NAME.innerHTML = this.ACTIVITIES_LIST[this.userChoices.secondActivityIndex].name;
        
        this.STOP_TIMER_BUTTON.addEventListener("click", this.endFirstActivity);
        this.STOP_TIMER_BUTTON.style.display = 'block';

        // Changement des proportions du fond (On fait les calculs sur une base de 90 car il y a des marges de chaque côté et le curseur court sur 90vw et non 100)
        let backgroundSize = Math.floor((this.userChoices.firstActivityDuration*90)/(this.userChoices.firstActivityDuration + this.userChoices.secondActivityDuration));
        this.FIRST_ACTIVITY_BACKGROUND.style.width = backgroundSize + "vw";
        this.SECOND_ACTIVITY_BACKGROUND.style.width = (90 - backgroundSize) + "vw"; 
        
        // Réglages des paramètres du curseur
        this.cursorTween = gsap.to(this.CURSOR, {x: this.FIRST_ACTIVITY_BACKGROUND.offsetWidth, duration: this.userChoices.firstActivityDuration*this.MINUTE_DURATION, ease: "none"});
        this.cursorTween.pause();

        let event = new CustomEvent('timerReady');
        document.dispatchEvent(event);
    }

    start()
    {
        this.isRunning = true;
        this.cursorTween.delay(1);
        this.cursorTween.play();
        this.firstActivityTimer = setTimeout(this.firstActivityTimeIsOver, this.userChoices.firstActivityDuration*this.MINUTE_DURATION*1000);
    }

    firstActivityTimeIsOver()
    {
        console.log("FirstActivityTimeIsOver appelé");
        //this.lostTimeStopWatch = new LostTimeStopWatch();
        //this.lostTimeStopWatch.start();
    }

    endFirstActivity()
    {
        if(this.lostTimeStopWatch)
        {
            this.lostTimeStopWatch.stop();
        }
        else
        {
            // TODO : Faire apparaître une bande WonTime de la position actuelle du curseur jusqu'à la fin de la première activité.
        }
    }

    stopAllTimers()
    {
        if(this.lostTimeStopWatch)
            this.lostTimeStopWatch.stop();
        else
            clearTimeout(this.firstActivityTimer);
        
        this.isRunning = false;
        this.cursorTween.pause(0);       
    }
}