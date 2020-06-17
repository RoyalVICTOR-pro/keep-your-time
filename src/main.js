import 'babel-polyfill';
import { gsap } from 'gsap';
import CONFIG from './config';
import TimerController from './Classes/controllers/class.timer-controller';
import Form from './Classes/class.form';

window.onload = function () {
	// Initialisation
	let appForm = new Form();
	let appTimer = new TimerController();

	// On affiche le formulaire
	appForm.init();
	appForm.show();

	// On attend que le formulaire soit rempli, validé et vérifié pour préparer le timer.
	document.addEventListener(CONFIG.TIMER_DATA_READY_EVENT, prepareTimer);

	function prepareTimer(e) {
		if (appTimer.isRunning) {
			appTimer.stopAllTimers();
		}

		appTimer.prepare(e.detail.userChoices);
		// On attend que le timer soit prêt en arrière-plan pour masquer le formulaire et lancer le timer
		document.addEventListener(CONFIG.TIMER_READY_TO_LAUNCH_EVENT, launchTimer(e));
	}

	function launchTimer(e) {
		appForm.hide();
		appTimer.start();
	}
};
