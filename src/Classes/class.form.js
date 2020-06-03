import { gsap } from 'gsap';
import CONFIG from '../config';

export default class Form {
	constructor() {
		// Elément(s) HTML manipulé(s)
		this.htmlFormPopup = document.getElementById('popup');
		this.htmlFormModal = document.getElementById('modal');
		this.htmlFirstActivityList = document.getElementById('first-activity-list');
		this.htmlFirstActivityDuration = document.getElementById('first-activity-duration');
		this.htmlSecondActivityList = document.getElementById('second-activity-list');
		this.htmlSecondActivityDuration = document.getElementById('second-activity-duration');
		this.htmlCancelButton = document.getElementById('cancel');
		this.htmlLaunchButton = document.getElementById('launch');
		this.htmlErrorMessageArea = document.getElementById('error');
	}

	init() {
		// Préparation des animations d'apparition et de disparition de la popup du formulaire
		this.modalShowAnimation = gsap.to(this.htmlFormModal, { opacity: 0.7, duration: 1, ease: 'none' }).pause();
		this.popupShowAnimation = gsap.to(this.htmlFormPopup, { opacity: 1, duration: 1, ease: 'none' }).pause();

		this.modalHideAnimation = gsap.to(this.htmlFormModal, { opacity: 0, duration: 1, ease: 'none' }).pause();
		this.popupHideAnimation = gsap.to(this.htmlFormPopup, { opacity: 0, duration: 1, ease: 'none', onComplete: this.disableForm.bind(this) }).pause();

		// Remplissage des listes d'activités à partir des activités disponible dans la configuration
		CONFIG.ACTIVITIES_LIST.forEach((element, key) => {
			this.htmlFirstActivityList[key] = new Option(element.name, key);
			this.htmlSecondActivityList[key] = new Option(element.name, key);
		});

		// Attente de validation du formulaire
		this.htmlLaunchButton.addEventListener(CONFIG.BUTTON_INTERACTION_EVENT, this.checkForm.bind(this));
	}

	checkForm() {
		// Controle du formulaire avant lancement du Timer
		if (this.htmlFirstActivityDuration.value == '00:00' || this.htmlFirstActivityDuration.value == '' || this.htmlSecondActivityDuration.value == '00:00' || this.htmlSecondActivityDuration.value == '') {
			this.htmlErrorMessageArea.innerText = 'Merci de saisir des durées pour les activités.';
		} else if (this.htmlFirstActivityList.options[this.htmlFirstActivityList.selectedIndex].value == this.htmlSecondActivityList.options[this.htmlSecondActivityList.selectedIndex].value) {
			this.htmlErrorMessageArea.innerText = 'Merci de sélectionner des activités différentes.';
		} else {
			this.sendForm();
		}
	}

	sendForm() {
		let firstSelectValue = this.htmlFirstActivityList.options[this.htmlFirstActivityList.selectedIndex].value;
		let secondSelectValue = this.htmlSecondActivityList.options[this.htmlSecondActivityList.selectedIndex].value;
		let firstDurationValue = this.convertToMinutes(this.htmlFirstActivityDuration.value);
		let secondDurationValue = this.convertToMinutes(this.htmlSecondActivityDuration.value);

		//  Une fois le formulaire vérifié, on prévient que le Timer peut être lancé en lui envoyant les données saisies par l'utilisateur.
		let event = new CustomEvent(CONFIG.TIMER_DATA_READY_EVENT, {
			detail: {
				userChoices: {
					firstActivityIndex: firstSelectValue,
					firstActivityDuration: firstDurationValue,
					secondActivityIndex: secondSelectValue,
					secondActivityDuration: secondDurationValue,
				},
			},
		});
		document.dispatchEvent(event);

		// Une fois le timer lancé la première fois, on a la possibilité de changer et d'en lancer un nouveau à la place.
		//Si l'utilisateur change d'avis, il peut utiliser le bouton Annuler pour refermer la popup et le formulaire.
		this.htmlCancelButton.disabled = false;
		this.htmlCancelButton.addEventListener(CONFIG.BUTTON_INTERACTION_EVENT, (e) => {
			let event = new CustomEvent(CONFIG.CHANGE_TIMER_CANCELLED_EVENT);
			document.dispatchEvent(event);
		});
	}

	show() {
		// Mise en place de valeur par défaut pour les tests
		if (CONFIG.IS_TEST_MODE) {
			this.htmlFirstActivityList.value = 1;
			this.htmlSecondActivityList.value = 6;
			this.htmlFirstActivityDuration.value = '00:01';
			this.htmlSecondActivityDuration.value = '00:03';
		}

		this.htmlFormPopup.style.visibility = 'visible';
		this.htmlFormModal.style.visibility = 'visible';
		this.modalShowAnimation.play(0);
		this.popupShowAnimation.play(0);
	}

	hide() {
		this.modalHideAnimation.play(0);
		this.popupHideAnimation.play(0);
	}

	disableForm() {
		this.htmlFormPopup.style.visibility = 'hidden';
		this.htmlFormModal.style.visibility = 'hidden';
	}

	convertToMinutes(pTimeInputValue) {
		let split = pTimeInputValue.split(':');
		let timeInMinutes;
		if (split[0] != '00' && split[0] != '') {
			timeInMinutes = parseInt(split[0]) * 60 + parseInt(split[1]);
		} else {
			timeInMinutes = parseInt(split[1]);
		}
		return timeInMinutes;
	}
}
