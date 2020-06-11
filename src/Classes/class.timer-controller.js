import { gsap } from 'gsap';
import CONFIG from '../config';
import LostTimeStopWatchView from './views/class.lost-time-stopwatch-view';
import WonTimeMarkerView from './views/class.won-time-marker-view';
import TimerView from './class.timer-view';

export default class TimerController {
	constructor() {
		this.timerView = new TimerView();

		this.isRunning = false;
		this.isFirstActivityFinished = false;
	}

	prepare(pUserChoices) {
		this.userChoices = pUserChoices;
		this.timerView.prepare(pUserChoices);
		document.addEventListener(CONFIG.TIMER_VIEW_READY, this.timerIsReadyToLaunch.bind(this));
		document.addEventListener(CONFIG.FIRST_ACTIVITY_ENDED, this.endFirstActivity.bind(this));
	}

	timerIsReadyToLaunch() {
		let event = new CustomEvent(CONFIG.TIMER_READY_TO_LAUNCH_EVENT);
		document.dispatchEvent(event);
	}

	start() {
		this.isRunning = true;

		// Ci-dessous, on prend le temps choisi par l'utilisateur qu'on multiplie par la durée des minutes configurée pour les tests,
		// qu'on multiplie ensuite par 1000 pour avoir le temps en millisecondes
		// et on y ajoute le "delay" de fermeture du popup
		// avant le lancement de l'animation du curseur.
		this.firstActivityTimer = setTimeout(this.firstActivityTimeIsOver.bind(this), this.userChoices.firstActivityDuration * CONFIG.MINUTE_DURATION * 1000 + CONFIG.POPUP_CLOSING_DELAY * 1000);

		this.timerView.start();
	}

	firstActivityTimeIsOver() {
		// Le temps prévu pour la première activité est écoulé
		if (!this.isFirstActivityFinished) {
			this.lostTimeStopWatchView = new LostTimeStopWatchView();
			this.lostTimeStopWatchView.init(this.userChoices.secondActivityDuration);
			this.lostTimeStopWatchView.start();
		}
	}

	endFirstActivity() {
		// La première activité est terminée.
		this.isFirstActivityFinished = true;

		// Si le chrono de dépassement existe, (donc que l'activité 1 a empiété sur l'activité 2)
		// on coupe l'animation du chrono pour montrer le temps perdu.
		// Sinon, on fait apparaître dans le fond une couleur montrant le temps gagné
		if (this.lostTimeStopWatchView) {
			this.lostTimeStopWatchView.pause();
		} else {
			this.wonTimeMarkerView = new WonTimeMarkerView();
			this.wonTimeMarkerView.show();
		}
	}

	stopAllTimers() {
		if (this.lostTimeStopWatchView) {
			this.lostTimeStopWatchView.kill();
			this.lostTimeStopWatchView = null;
		} else {
			clearTimeout(this.firstActivityTimer);
		}

		if (this.wonTimeMarkerView) {
			this.wonTimeMarkerView.kill();
			this.wonTimeMarkerView = null;
		}

		this.isFirstActivityFinished = false;
		this.isRunning = false;
		this.timerView.showStopTimerButton();
		this.timerView.stop();
	}
}
