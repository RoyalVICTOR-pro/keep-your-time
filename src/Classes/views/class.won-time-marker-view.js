export default class WonTimeMarkerView {
	constructor(pSecondActivityBackground, pSecondActivityDuration) {
		// Element(s) HTML manipulé(s)
		this.htmlWonTime = document.getElementById('won-time');

		this.htmlCursor = document.getElementById('cursor');
		this.htmlFirstActivityBackground = document.getElementById('first-activity-background');
	}

	show() {
		this.htmlWonTime.style.left = this.htmlCursor.getBoundingClientRect().left + this.htmlCursor.offsetWidth / 2 + 'px';
		this.htmlWonTime.style.width = this.htmlFirstActivityBackground.offsetWidth - this.htmlCursor.getBoundingClientRect().left + 'px';
	}

	kill() {
		this.htmlWonTime.style.width = 0;
	}
}
