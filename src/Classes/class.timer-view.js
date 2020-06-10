import { gsap } from 'gsap';
import CONFIG from '../config';
import LostTimeStopWatchView from './views/class.lost-time-stopwatch-view';
import WonTimeMarkerView from './views/class.won-time-marker-view';

export default class TimerView {
	constructor() {
		// Elément(s) HTML manipulé(s)
		this.htmlFirstActivityBackground = document.getElementById('first-activity-background');
		this.htmlFirstActivityIcon = document.getElementById('first-activity-icon');
		this.htmlFirstActivityName = document.getElementById('first-activity-name');
		this.htmlStopTimerButton = document.getElementById('stop-timer-button');
		this.htmlSecondActivityBackground = document.getElementById('second-activity-background');
		this.htmlSecondActivityIcon = document.getElementById('second-activity-icon');
		this.htmlSecondActivityName = document.getElementById('second-activity-name');
		this.htmlCursor = document.getElementById('cursor');
	}

	prepare(pUserChoices) {
		/* 
        Ici, on prépare le timer en fonction des choix de l'utilisateur. 
        On change les dimensions des fonds de couleurs, 
        on prépare l'animation du curseur sur la durée des 2 activités
        */

		this.userChoices = pUserChoices;

		this.htmlFirstActivityIcon.src = CONFIG.ACTIVITIES_LIST[this.userChoices.firstActivityIndex].icon;
		this.htmlSecondActivityIcon.src = CONFIG.ACTIVITIES_LIST[this.userChoices.secondActivityIndex].icon;
		this.htmlFirstActivityName.innerHTML = CONFIG.ACTIVITIES_LIST[this.userChoices.firstActivityIndex].name;
		this.htmlSecondActivityName.innerHTML = CONFIG.ACTIVITIES_LIST[this.userChoices.secondActivityIndex].name;

		// (Changement des proportions du fond : On fait les calculs sur une base de 90 car il y a des marges de chaque côté et le curseur court sur 90vw et non 100)
		let backgroundSize = Math.floor((this.userChoices.firstActivityDuration * 90) / (this.userChoices.firstActivityDuration + this.userChoices.secondActivityDuration));
		this.htmlFirstActivityBackground.style.width = backgroundSize + 'vw';
		this.htmlSecondActivityBackground.style.width = 90 - backgroundSize + 'vw';

		// Réglages des paramètres du curseur
		this.cursorTween = gsap.timeline();
		this.cursorTween.to(this.htmlCursor, {
			x: this.htmlFirstActivityBackground.offsetWidth,
			duration: this.userChoices.firstActivityDuration * CONFIG.MINUTE_DURATION,
			ease: 'none',
		});

		this.cursorTween.to(this.htmlCursor, {
			x: (this.htmlFirstActivityBackground.offsetWidth + this.htmlSecondActivityBackground.offsetWidth).toString() + 'px',
			duration: this.userChoices.secondActivityDuration * CONFIG.MINUTE_DURATION,
			ease: 'none',
		});

		// On affiche le bouton qui permet d'avertir que la première activité est terminée et qu'on passe à la 2ème.
		this.htmlStopTimerButton.addEventListener(CONFIG.BUTTON_INTERACTION_EVENT, this.endFirstActivity.bind(this));
		this.htmlStopTimerButton.style.visibility = 'visible';

		let event = new CustomEvent(CONFIG.TIMER_READY_TO_LAUNCH_EVENT);
		document.dispatchEvent(event);
	}

	start() {
		this.cursorTween.delay(CONFIG.POPUP_CLOSING_DELAY);
		this.cursorTween.play();
		// Ci-dessous, on prend le temps choisi par l'utilisateur qu'on multiplie par la durée des minutes configurée pour les tests,
		// qu'on multiplie ensuite par 1000 pour avoir le temps en millisecondes
		// et on y ajoute le "delay" de fermeture du popup
		// avant le lancement de l'animation du curseur.
		this.firstActivityTimer = setTimeout(this.firstActivityTimeIsOver.bind(this), this.userChoices.firstActivityDuration * CONFIG.MINUTE_DURATION * 1000 + CONFIG.POPUP_CLOSING_DELAY * 1000);
	}

	firstActivityTimeIsOver() {
		// TODO : Dispatch Event pour appelé la méthode dans le controller
	}

	endFirstActivity() {
		this.htmlStopTimerButton.style.visibility = 'hidden';
		// TODO : Dispatch Event pour appelé la méthode dans le controller
	}
}
