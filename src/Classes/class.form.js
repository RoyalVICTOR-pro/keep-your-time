import { gsap } from "gsap";
export default class Form {
    constructor(pActivitiesList, pTestMode = false) {
        // Eléments HTML utiles
        this.FORM_POPUP = document.getElementById("popup");
        this.FORM_MODAL = document.getElementById("modal");
        this.FIRST_ACTIVITY_LIST = document.getElementById("first-activity-list");
        this.FIRST_ACTIVITY_DURATION = document.getElementById("first-activity-duration");
        this.SECOND_ACTIVITY_LIST = document.getElementById("second-activity-list");
        this.SECOND_ACTIVITY_DURATION = document.getElementById("second-activity-duration");
        this.CANCEL_BUTTON = document.getElementById("cancel");
        this.LAUNCH_BUTTON = document.getElementById("launch");
        this.ERROR_MESSAGE_AREA = document.getElementById("error");

        this.modalShowAnimation = gsap.to(this.FORM_MODAL, {opacity: 0.7, duration: 1, ease: "none"}).pause();
        this.popupShowAnimation = gsap.to(this.FORM_POPUP, {opacity: 1, duration: 1, ease: "none"}).pause();
        
        this.modalHideAnimation = gsap.to(this.FORM_MODAL, {opacity: 0, duration: 1, ease: "none"}).pause();
        this.popupHideAnimation = gsap.to(this.FORM_POPUP, {opacity: 0, duration: 1, ease: "none", onComplete:this.disableForm.bind(this)}).pause();
        


        this.ACTIVITIES_LIST = pActivitiesList;
        this.ACTIVITIES_LIST.forEach((element,key) => {
            this.FIRST_ACTIVITY_LIST[key] = new Option(element.name, key);
            this.SECOND_ACTIVITY_LIST[key] = new Option(element.name, key);
        });
        
        

        this.TEST_MODE = pTestMode; 
        if(this.TEST_MODE) {
            this.FIRST_ACTIVITY_LIST.value = 1;
            this.SECOND_ACTIVITY_LIST.value = 6;
            this.FIRST_ACTIVITY_DURATION.value = "00:01";
            this.SECOND_ACTIVITY_DURATION.value = "00:03";
        }

        this.LAUNCH_BUTTON.addEventListener("click", this.checkForm.bind(this));
        
    }

    checkForm() {
        if(this.FIRST_ACTIVITY_DURATION.value == "00:00" || this.FIRST_ACTIVITY_DURATION.value == "" || this.SECOND_ACTIVITY_DURATION.value == "00:00" || this.SECOND_ACTIVITY_DURATION.value == "")
            this.ERROR_MESSAGE_AREA.innerText = "Merci de saisir des durées pour les activités.";
        else if(this.FIRST_ACTIVITY_LIST.options[this.FIRST_ACTIVITY_LIST.selectedIndex].value == this.SECOND_ACTIVITY_LIST.options[this.SECOND_ACTIVITY_LIST.selectedIndex].value)
            this.ERROR_MESSAGE_AREA.innerText = "Merci de sélectionner des activités différentes.";
        else
            this.launchTimer();
    }
    
    launchTimer() {
        let firstSelectValue =  this.FIRST_ACTIVITY_LIST.options[this.FIRST_ACTIVITY_LIST.selectedIndex].value;
        let secondSelectValue =  this.SECOND_ACTIVITY_LIST.options[this.SECOND_ACTIVITY_LIST.selectedIndex].value;
        let firstDurationValue = this.convertToMinutes(this.FIRST_ACTIVITY_DURATION.value);
        let secondDurationValue = this.convertToMinutes(this.SECOND_ACTIVITY_DURATION.value);
        
        let event = new CustomEvent('formAskToLaunchTimer', { 
            detail:{
                'userChoices': {
                    firstActivityIndex: firstSelectValue, 
                    firstActivityDuration: firstDurationValue, 
                    secondActivityIndex: secondSelectValue, 
                    secondActivityDuration: secondDurationValue
                } 
            }
        });
        document.dispatchEvent(event);

        this.CANCEL_BUTTON.disabled = false;
        this.CANCEL_BUTTON.addEventListener("click", (e)=>{
            let event = new CustomEvent('changeTimerCancelled');
            document.dispatchEvent(event);
        });
    }

    convertToMinutes(pTimeInputValue) {
        let split = pTimeInputValue.split(":");
        let timeInMinutes;
        if(split[0]!="00" && split[0]!="")
            timeInMinutes = parseInt(split[0])*60+parseInt(split[1]);
        else
            timeInMinutes = parseInt(split[1]);
        return timeInMinutes;
    }
    
    show() {
        this.FORM_POPUP.style.visibility = 'visible';
        this.FORM_MODAL.style.visibility = 'visible';
        this.modalShowAnimation.play(0);
        this.popupShowAnimation.play(0);
    }

    hide() {
        this.modalHideAnimation.play(0);
        this.popupHideAnimation.play(0);
    }

    disableForm() {
        this.FORM_POPUP.style.visibility = 'hidden';
        this.FORM_MODAL.style.visibility = 'hidden';
    }
}