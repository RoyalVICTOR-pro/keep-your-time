import { gsap } from "gsap";

export default class LostTimeStopWatch {
    constructor(pSecondActivityBackground, pSecondActivityDuration, pMinuteDuration) {

        this.LOST_TIME = document.getElementById("lost-time");
        
        this.isLostTimeStopWatchRunning = false;

        let backgroundRect = pSecondActivityBackground.getBoundingClientRect();
        this.lostTimeXPos = backgroundRect.left;
        this.secondActivityBackground = pSecondActivityBackground;
        this.secondActivityDuration = pSecondActivityDuration;
        this.MINUTE_DURATION = pMinuteDuration;

        this.LOST_TIME.style.left = this.lostTimeXPos.toString() + "px";

        this.lostTimeTween = gsap.timeline();
        this.lostTimeTween.to(this.LOST_TIME, {
            width: this.secondActivityBackground.offsetWidth.toString() + "px", 
            duration: this.secondActivityDuration*this.MINUTE_DURATION, 
            ease: "none"
        });

    }

    start(){
        this.isLostTimeStopWatchRunning = true;
        this.lostTimeTween.play(0);
    }

    pause(){
        this.lostTimeTween.pause();
        this.isLostTimeStopWatchRunning = false;
    }

    kill(){
        this.lostTimeTween.pause();
        this.LOST_TIME.style.width = 0;
    }
}