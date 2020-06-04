export default class WonTimeMarker {
	constructor(pSecondActivityBackground, pSecondActivityDuration) {
		// Element(s) HTML manipulé(s)
		this.htmlWonTime = document.getElementById('won-time');
	}

	showAt(pCursorBoundingRect, pCursorWidth, pHtmlFirstActivityBackgroundWidth) {
		// TODO : Débugger ca en essayant de console log les valeurs des paramètres.
		this.htmlWonTime.style.left = pCursorBoundingRect.left + pCursorWidth / 2 + 'px';
		this.htmlWonTime.style.width = pHtmlFirstActivityBackgroundWidth - pCursorBoundingRect.left + 'px';
	}

	kill() {
		this.htmlWonTime.style.width = 0;
	}
}
