import { gsap } from 'gsap';
import CONFIG from '../config';
import LostTimeStopWatchView from './views/class.lost-time-stopwatch-view';
import WonTimeMarkerView from './views/class.won-time-marker-view';

export default class TimerController {
	constructor() {
		// TODO : Initialiser le TimerView

		// Initialisation de la classe
		this.isRunning = false;
		this.isFirstActivityFinished = false;
	}

	prepare(pUserChoices) {
		// TODO : Appeler le prepare du TimerView
	}

	start() {
		this.isRunning = true;
		// TODO : Appeler le start du TimerView
	}

	firstActivityTimeIsOver() {
		// Le temps prévu pour la première activité est écoulé
		if (!this.isFirstActivityFinished) {
			this.lostTimeStopWatchView = new LostTimeStopWatchView();
			this.lostTimeStopWatchView.init(this.htmlSecondActivityBackground, this.userChoices.secondActivityDuration);
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
			this.wonTimeMarkerView.showAt(this.htmlCursor.getBoundingClientRect(), this.htmlCursor.offsetWidth, this.htmlFirstActivityBackground.offsetWidth);
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
		this.htmlStopTimerButton.style.visibility = 'visible';
		this.isRunning = false;
		this.cursorTween.pause(0);
	}
}
