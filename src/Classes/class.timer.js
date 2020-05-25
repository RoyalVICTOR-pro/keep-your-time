import { gsap } from "gsap";
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
        this.isFirstActivityFinished = false;
    }

    prepare (pUserChoices){
        this.userChoices = pUserChoices;

        this.FIRST_ACTIVITY_ICON.src = this.ACTIVITIES_LIST[this.userChoices.firstActivityIndex].icon;
        this.SECOND_ACTIVITY_ICON.src = this.ACTIVITIES_LIST[this.userChoices.secondActivityIndex].icon;
        this.FIRST_ACTIVITY_NAME.innerHTML = this.ACTIVITIES_LIST[this.userChoices.firstActivityIndex].name;
        this.SECOND_ACTIVITY_NAME.innerHTML = this.ACTIVITIES_LIST[this.userChoices.secondActivityIndex].name;
        
        this.STOP_TIMER_BUTTON.addEventListener("click", this.endFirstActivity.bind(this));
        this.STOP_TIMER_BUTTON.style.visibility = 'visible';

        // Changement des proportions du fond (On fait les calculs sur une base de 90 car il y a des marges de chaque côté et le curseur court sur 90vw et non 100)
        let backgroundSize = Math.floor((this.userChoices.firstActivityDuration*90)/(this.userChoices.firstActivityDuration + this.userChoices.secondActivityDuration));
        this.FIRST_ACTIVITY_BACKGROUND.style.width = backgroundSize + "vw";
        this.SECOND_ACTIVITY_BACKGROUND.style.width = (90 - backgroundSize) + "vw"; 
 
        // Réglages des paramètres du curseur
        this.cursorTween = gsap.timeline();
        this.cursorTween.to(this.CURSOR, {
            x: this.FIRST_ACTIVITY_BACKGROUND.offsetWidth, 
            duration: this.userChoices.firstActivityDuration*this.MINUTE_DURATION, 
            ease: "none"
        });
        
        this.cursorTween.to(this.CURSOR, {
            x: (this.FIRST_ACTIVITY_BACKGROUND.offsetWidth + this.SECOND_ACTIVITY_BACKGROUND.offsetWidth).toString() + "px", 
            duration: this.userChoices.secondActivityDuration*this.MINUTE_DURATION, 
            ease: "none"
        });
        //this.cursorTween.pause();

        if(this.lostTimeStopWatch)
            this.lostTimeStopWatch = null;

        let event = new CustomEvent('timerReady');
        document.dispatchEvent(event);
    }

    start() {
        this.isRunning = true;
        this.cursorTween.delay(1); // Si on change le delay de 1 secondes, pense à changer les 1000 millisecondes ajoutées dans le setTimeOut dans le code ci-dessous. 
        this.cursorTween.play();
        // Ci-dessous, on prend le temps choisi par l'utilisateur qu'on multiplie par la durée des minutes configurée pour les tests, 
        // qu'on multiplie ensuite par 1000 pour avoir le temps en millisecondes et on y ajoute 1000 millisecondes qui permett
        this.firstActivityTimer = setTimeout(this.firstActivityTimeIsOver.bind(this), this.userChoices.firstActivityDuration*this.MINUTE_DURATION*1000+1000);
    }

    firstActivityTimeIsOver() {
        if(!this.isFirstActivityFinished) {
            this.lostTimeStopWatch = new LostTimeStopWatch(this.SECOND_ACTIVITY_BACKGROUND, this.userChoices.secondActivityDuration, this.MINUTE_DURATION);
            this.lostTimeStopWatch.start();
        }
    }

    endFirstActivity() {
        this.isFirstActivityFinished = true;

        this.STOP_TIMER_BUTTON.style.visibility = 'hidden';
        
        if(this.lostTimeStopWatch) {
            console.log("Entré dans le if ");
            this.lostTimeStopWatch.pause();
        } else {
            let cursorPositions = this.CURSOR.getBoundingClientRect();
            this.WON_TIME.style.left = cursorPositions.left+(this.CURSOR.offsetWidth/2) + "px";
            this.WON_TIME.style.width = this.FIRST_ACTIVITY_BACKGROUND.offsetWidth-cursorPositions.left +"px";
        }
    }

    stopAllTimers() {
        console.log("Stop All Timers Appelé !");
        if(this.lostTimeStopWatch) {
            this.lostTimeStopWatch.kill();
            this.lostTimeStopWatch = null;
        } else {
            clearTimeout(this.firstActivityTimer);
        }

        this.isFirstActivityFinished = false;
        this.STOP_TIMER_BUTTON.style.visibility = 'visible';
        this.isRunning = false;
        this.cursorTween.pause(0);
        this.WON_TIME.style.width = 0;
    }
}