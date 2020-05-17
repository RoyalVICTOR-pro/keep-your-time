import { gsap } from "gsap";

export default class Form {
    constructor(pActivitiesList, pTestMode = false) 
    {
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

        this.anim_modal = gsap.to(this.FORM_MODAL, {opacity: 0.7, duration: 1, ease: "none"}).pause();
        this.anim_popup = gsap.to(this.FORM_POPUP, {opacity: 1, duration: 1, ease: "none"}).pause();
        
        this.ACTIVITIES_LIST = pActivitiesList;
        this.ACTIVITIES_LIST.forEach((element,key) => {
            this.FIRST_ACTIVITY_LIST[key] = new Option(element.name, key);
            this.SECOND_ACTIVITY_LIST[key] = new Option(element.name, key);
        });
        
        this.TEST_MODE = pTestMode;
        if(this.TEST_MODE)
        {
            this.FIRST_ACTIVITY_LIST.value = 1;
            this.SECOND_ACTIVITY_LIST.value = 6;
            this.FIRST_ACTIVITY_DURATION.value = "00:01";
            this.SECOND_ACTIVITY_DURATION.value = "00:03";
        }

        this.LAUNCH_BUTTON.addEventListener("click", this.checkForm.bind(this));
        
    }

    checkForm()
    {
        // TODO : Checker que tous les champs sont remplis. 
        this.launchTimer();
    }
    
    launchTimer()
    {
        // Lancer le timer
        let choice;
        
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
        this.CANCEL_BUTTON.addEventListener("click", this.hide);
    }

    convertToMinutes(pTimeInputValue)
    {
        // TODO : Essayer de passer cette méthode en private et les autres en public. 
        let split = pTimeInputValue.split(":");
        let timeInMinutes;
        if(split[0]!="00")
            timeInMinutes = split[0]*60+split[1];
        else
            timeInMinutes = split[1];
        return timeInMinutes;
    }
    
    show()
    {
        this.anim_modal.play();
        this.anim_popup.play();
    }

    hide()
    {
        this.anim_modal.reverse();
        this.anim_popup.reverse();
    }

}