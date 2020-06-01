import { gsap } from 'gsap'
import CONFIG from '../config'
import LostTimeStopWatch from './class.lost-time-stopwatch'

export default class Timer {
  constructor(pActivitiesList, pMinuteDuration) {
    // Elément(s) HTML manipulé(s)
    this.FIRST_ACTIVITY_BACKGROUND = document.getElementById(
      'first-activity-background'
    )
    this.FIRST_ACTIVITY_ICON = document.getElementById('first-activity-icon')
    this.FIRST_ACTIVITY_NAME = document.getElementById('first-activity-name')
    this.STOP_TIMER_BUTTON = document.getElementById('stop-timer-button')
    this.WON_TIME = document.getElementById('won-time')
    this.SECOND_ACTIVITY_BACKGROUND = document.getElementById(
      'second-activity-background'
    )
    this.SECOND_ACTIVITY_ICON = document.getElementById('second-activity-icon')
    this.SECOND_ACTIVITY_NAME = document.getElementById('second-activity-name')
    this.LOST_TIME = document.getElementById('lost-time')
    this.CURSOR = document.getElementById('cursor')
    this.TIMELINE = document.getElementById('timeline')

    // Initialisation de la classe
    this.ACTIVITIES_LIST = pActivitiesList
    this.MINUTE_DURATION = pMinuteDuration
    this.isRunning = false
    this.isFirstActivityFinished = false
  }

  prepare(pUserChoices) {
    /* 
        Ici, on prépare le timer en fonction des choix de l'utilisateur. 
        On change les dimensions des fonds de couleurs, 
        on prépare l'animation du curseur sur la durée des 2 activités
        */

    this.userChoices = pUserChoices

    this.FIRST_ACTIVITY_ICON.src = this.ACTIVITIES_LIST[
      this.userChoices.firstActivityIndex
    ].icon
    this.SECOND_ACTIVITY_ICON.src = this.ACTIVITIES_LIST[
      this.userChoices.secondActivityIndex
    ].icon
    this.FIRST_ACTIVITY_NAME.innerHTML = this.ACTIVITIES_LIST[
      this.userChoices.firstActivityIndex
    ].name
    this.SECOND_ACTIVITY_NAME.innerHTML = this.ACTIVITIES_LIST[
      this.userChoices.secondActivityIndex
    ].name

    // (Changement des proportions du fond : On fait les calculs sur une base de 90 car il y a des marges de chaque côté et le curseur court sur 90vw et non 100)
    let backgroundSize = Math.floor(
      (this.userChoices.firstActivityDuration * 90) /
        (this.userChoices.firstActivityDuration +
          this.userChoices.secondActivityDuration)
    )
    this.FIRST_ACTIVITY_BACKGROUND.style.width = backgroundSize + 'vw'
    this.SECOND_ACTIVITY_BACKGROUND.style.width = 90 - backgroundSize + 'vw'

    // Réglages des paramètres du curseur
    this.cursorTween = gsap.timeline()
    this.cursorTween.to(this.CURSOR, {
      x: this.FIRST_ACTIVITY_BACKGROUND.offsetWidth,
      duration: this.userChoices.firstActivityDuration * this.MINUTE_DURATION,
      ease: 'none',
    })

    this.cursorTween.to(this.CURSOR, {
      x:
        (
          this.FIRST_ACTIVITY_BACKGROUND.offsetWidth +
          this.SECOND_ACTIVITY_BACKGROUND.offsetWidth
        ).toString() + 'px',
      duration: this.userChoices.secondActivityDuration * this.MINUTE_DURATION,
      ease: 'none',
    })

    // On affiche le bouton qui permet d'avertir que la première activité est terminée et qu'on passe à la 2ème.
    this.STOP_TIMER_BUTTON.addEventListener(
      CONFIG.BUTTON_INTERACTION_EVENT,
      this.endFirstActivity.bind(this)
    )
    this.STOP_TIMER_BUTTON.style.visibility = 'visible'

    let event = new CustomEvent(CONFIG.TIMER_READY_TO_LAUNCH_EVENT)
    document.dispatchEvent(event)
  }

  start() {
    this.isRunning = true
    this.cursorTween.delay(CONFIG.POPUP_CLOSING_DELAY)
    this.cursorTween.play()
    // Ci-dessous, on prend le temps choisi par l'utilisateur qu'on multiplie par la durée des minutes configurée pour les tests,
    // qu'on multiplie ensuite par 1000 pour avoir le temps en millisecondes
    // et on y ajoute le "delay" de fermeture de la popup
    // avant le lancement de l'animation du curseur.
    this.firstActivityTimer = setTimeout(
      this.firstActivityTimeIsOver.bind(this),
      this.userChoices.firstActivityDuration * this.MINUTE_DURATION * 1000 +
        CONFIG.POPUP_CLOSING_DELAY * 1000
    )
  }

  firstActivityTimeIsOver() {
    // Le temps prévu pour la première activité est écoulé
    if (!this.isFirstActivityFinished) {
      this.lostTimeStopWatch = new LostTimeStopWatch(
        this.SECOND_ACTIVITY_BACKGROUND,
        this.userChoices.secondActivityDuration,
        this.MINUTE_DURATION
      )
      this.lostTimeStopWatch.start()
    }
  }

  endFirstActivity() {
    // La première activité est terminée.
    this.isFirstActivityFinished = true

    this.STOP_TIMER_BUTTON.style.visibility = 'hidden'

    // Si le chrono de dépassement existe, (donc que l'activité 1 a empiété sur l'activité 2)
    // on coupe l'animation du chrono pour montrer le temps perdu.
    // Sinon, on fait apparaître dans le fond une couleur montrant le temps gagné
    if (this.lostTimeStopWatch) {
      this.lostTimeStopWatch.pause()
    } else {
      let cursorPositions = this.CURSOR.getBoundingClientRect()
      this.WON_TIME.style.left =
        cursorPositions.left + this.CURSOR.offsetWidth / 2 + 'px'
      this.WON_TIME.style.width =
        this.FIRST_ACTIVITY_BACKGROUND.offsetWidth - cursorPositions.left + 'px'
    }
  }

  stopAllTimers() {
    if (this.lostTimeStopWatch) {
      this.lostTimeStopWatch.kill()
      this.lostTimeStopWatch = null
    } else {
      clearTimeout(this.firstActivityTimer)
    }

    this.isFirstActivityFinished = false
    this.STOP_TIMER_BUTTON.style.visibility = 'visible'
    this.isRunning = false
    this.cursorTween.pause(0)
    this.WON_TIME.style.width = 0
  }
}
