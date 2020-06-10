import { gsap } from 'gsap';
import CONFIG from '../../config';

export default class LostTimeStopWatchView {
	constructor() {
		// Element(s) HTML manipulé(s)
		this.htmlLostTime = document.getElementById('lost-time');

		this.isLostTimeStopWatchRunning = false;
	}

	init(pSecondActivityBackground, pSecondActivityDuration) {
		// On positionne le fond qui représente le temps perdu et on l'anime de façon à ce qu'il s'agrandisse.
		let backgroundRect = pSecondActivityBackground.getBoundingClientRect();
		this.lostTimeXPos = backgroundRect.left;
		this.secondActivityBackground = pSecondActivityBackground;
		this.secondActivityDuration = pSecondActivityDuration;

		this.htmlLostTime.style.left = this.lostTimeXPos.toString() + 'px';

		this.lostTimeTween = gsap.timeline();
		this.lostTimeTween.to(this.htmlLostTime, {
			width: this.secondActivityBackground.offsetWidth.toString() + 'px',
			duration: this.secondActivityDuration * CONFIG.MINUTE_DURATION,
			ease: 'none',
		});
	}

	start() {
		this.isLostTimeStopWatchRunning = true;
		this.lostTimeTween.play(0);
	}

	pause() {
		this.lostTimeTween.pause();
		this.isLostTimeStopWatchRunning = false;
	}

	kill() {
		this.lostTimeTween.pause();
		this.htmlLostTime.style.width = 0;
	}
}
