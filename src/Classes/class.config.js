export default class Config {
    constructor() {
        this.activitiesList = [
            {icon: "assets/images/179.svg", name: "Rangement"},
            {icon: "assets/images/079.svg", name: "Ecole/Devoirs"},
            {icon: "assets/images/240.svg", name: "Préparation"},
            {icon: "assets/images/089.svg", name: "Repas"},
            {icon: "assets/images/076.svg", name: "Jeu"},
            {icon: "assets/images/024.svg", name: "Dessin animé"},
            {icon: "assets/images/197.svg", name: "Atelier Cuisine"},
            {icon: "assets/images/037.svg", name: "Sortie"}
        ];

         // Utile pour les tests
        this.minuteDuration = 60;
        this.isTestMode = false; 
    }
}