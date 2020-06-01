import { gsap } from 'gsap'
import CONFIG from '../config'

export default class Form {
  constructor(pActivitiesList, pTestMode = false) {
    // Elément(s) HTML manipulé(s)
    this.FORM_POPUP = document.getElementById('popup')
    this.FORM_MODAL = document.getElementById('modal')
    this.FIRST_ACTIVITY_LIST = document.getElementById('first-activity-list')
    this.FIRST_ACTIVITY_DURATION = document.getElementById(
      'first-activity-duration'
    )
    this.SECOND_ACTIVITY_LIST = document.getElementById('second-activity-list')
    this.SECOND_ACTIVITY_DURATION = document.getElementById(
      'second-activity-duration'
    )
    this.CANCEL_BUTTON = document.getElementById('cancel')
    this.LAUNCH_BUTTON = document.getElementById('launch')
    this.ERROR_MESSAGE_AREA = document.getElementById('error')

    // Préparation des animations d'apparition et de disparition de la popup du formulaire
    this.modalShowAnimation = gsap
      .to(this.FORM_MODAL, { opacity: 0.7, duration: 1, ease: 'none' })
      .pause()
    this.popupShowAnimation = gsap
      .to(this.FORM_POPUP, { opacity: 1, duration: 1, ease: 'none' })
      .pause()

    this.modalHideAnimation = gsap
      .to(this.FORM_MODAL, { opacity: 0, duration: 1, ease: 'none' })
      .pause()
    this.popupHideAnimation = gsap
      .to(this.FORM_POPUP, {
        opacity: 0,
        duration: 1,
        ease: 'none',
        onComplete: this.disableForm.bind(this),
      })
      .pause()

    // Remplissage des listes d'activités à partir des activités disponible dans la configuration
    this.ACTIVITIES_LIST = pActivitiesList
    this.ACTIVITIES_LIST.forEach((element, key) => {
      this.FIRST_ACTIVITY_LIST[key] = new Option(element.name, key)
      this.SECOND_ACTIVITY_LIST[key] = new Option(element.name, key)
    })

    // Mise en place de valeur par défaut pour les tests
    this.TEST_MODE = pTestMode
    if (this.TEST_MODE) {
      this.FIRST_ACTIVITY_LIST.value = 1
      this.SECOND_ACTIVITY_LIST.value = 6
      this.FIRST_ACTIVITY_DURATION.value = '00:01'
      this.SECOND_ACTIVITY_DURATION.value = '00:03'
    }

    // Attente de validation du formulaire
    this.LAUNCH_BUTTON.addEventListener(
      CONFIG.BUTTON_INTERACTION_EVENT,
      this.checkForm.bind(this)
    )
  }

  checkForm() {
    // Controle du formulaire avant lancement du Timer
    if (
      this.FIRST_ACTIVITY_DURATION.value == '00:00' ||
      this.FIRST_ACTIVITY_DURATION.value == '' ||
      this.SECOND_ACTIVITY_DURATION.value == '00:00' ||
      this.SECOND_ACTIVITY_DURATION.value == ''
    )
      this.ERROR_MESSAGE_AREA.innerText =
        'Merci de saisir des durées pour les activités.'
    else if (
      this.FIRST_ACTIVITY_LIST.options[this.FIRST_ACTIVITY_LIST.selectedIndex]
        .value ==
      this.SECOND_ACTIVITY_LIST.options[this.SECOND_ACTIVITY_LIST.selectedIndex]
        .value
    )
      this.ERROR_MESSAGE_AREA.innerText =
        'Merci de sélectionner des activités différentes.'
    else this.sendForm()
  }

  sendForm() {
    let firstSelectValue = this.FIRST_ACTIVITY_LIST.options[
      this.FIRST_ACTIVITY_LIST.selectedIndex
    ].value
    let secondSelectValue = this.SECOND_ACTIVITY_LIST.options[
      this.SECOND_ACTIVITY_LIST.selectedIndex
    ].value
    let firstDurationValue = this.convertToMinutes(
      this.FIRST_ACTIVITY_DURATION.value
    )
    let secondDurationValue = this.convertToMinutes(
      this.SECOND_ACTIVITY_DURATION.value
    )

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
    })
    document.dispatchEvent(event)

    // Une fois le timer lancé la première fois, on a la possibilité de changer et d'en lancer un nouveau à la place.
    //Si l'utilisateur change d'avis, il peut utiliser le bouton Annuler pour refermer la popup et le formulaire.
    this.CANCEL_BUTTON.disabled = false
    this.CANCEL_BUTTON.addEventListener(
      CONFIG.BUTTON_INTERACTION_EVENT,
      (e) => {
        let event = new CustomEvent(CONFIG.CHANGE_TIMER_CANCELLED_EVENT)
        document.dispatchEvent(event)
      }
    )
  }

  show() {
    this.FORM_POPUP.style.visibility = 'visible'
    this.FORM_MODAL.style.visibility = 'visible'
    this.modalShowAnimation.play(0)
    this.popupShowAnimation.play(0)
  }

  hide() {
    this.modalHideAnimation.play(0)
    this.popupHideAnimation.play(0)
  }

  disableForm() {
    this.FORM_POPUP.style.visibility = 'hidden'
    this.FORM_MODAL.style.visibility = 'hidden'
  }

  convertToMinutes(pTimeInputValue) {
    let split = pTimeInputValue.split(':')
    let timeInMinutes
    if (split[0] != '00' && split[0] != '')
      timeInMinutes = parseInt(split[0]) * 60 + parseInt(split[1])
    else timeInMinutes = parseInt(split[1])
    return timeInMinutes
  }
}
