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

        let event = new CustomEvent('timerReady');
        document.dispatchEvent(event);
    }
}