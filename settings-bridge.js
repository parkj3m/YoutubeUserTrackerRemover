(function () {
	const DEFAULTS = {
		removeSi: true, // boolean to remove the "si" tracking parameter
		removeTimestamp: true, // boolean to remove "t"/"start" (video timestamp)
		addPrefix: false, // boolean to adds the prefix to the copied link or not
		prefixText: '!!p ' // the text added when addPrefix is true
	};

	const SETTINGS = 'data-youtube-user-tracker-remover-settings';

	function applySettings(settings) {
		document.documentElement.setAttribute(SETTINGS, JSON.stringify(settings));
	}

	function loadAndApply() {
		chrome.storage.sync.get(DEFAULTS, (settings) => {
			applySettings(settings);
			console.log("Settings actually applied!");
		});
	}

	loadAndApply();

	chrome.storage.onChanged.addListener((changes, area) => {
		if(area !== 'sync') { return };
		loadAndApply();
	});
})();
