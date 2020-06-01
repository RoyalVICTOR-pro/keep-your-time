const CONFIG = {
  ACTIVITIES_LIST: [
    { icon: 'assets/images/179.svg', name: 'Rangement' },
    { icon: 'assets/images/079.svg', name: 'Ecole/Devoirs' },
    { icon: 'assets/images/240.svg', name: 'Préparation' },
    { icon: 'assets/images/089.svg', name: 'Repas' },
    { icon: 'assets/images/076.svg', name: 'Jeu' },
    { icon: 'assets/images/024.svg', name: 'Dessin animé' },
    { icon: 'assets/images/197.svg', name: 'Atelier Cuisine' },
    { icon: 'assets/images/037.svg', name: 'Sortie' },
  ],
  MINUTE_DURATION: 60,
  IS_TEST_MODE: false,

  CHANGE_TIMER_CANCELLED_EVENT: 'changeTimerCancelled',
  TIMER_DATA_READY_EVENT: 'timerDataAreReady',
  TIMER_READY_TO_LAUNCH_EVENT: 'timerReady',
  BUTTON_INTERACTION_EVENT: 'click',
  POPUP_CLOSING_DELAY: 1,
}

module.exports = CONFIG
