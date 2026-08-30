(function () {
	console.log('[Youtube User Tracker Remover] active');

	// These are always removed: pure tracking/metadata params that never
	// change what the link plays.
	const ALWAYS_REMOVE = [
		'feature',
		'ab_channel',
		'pp',
		'app',
		'source_ve_path',
		'gclid',
		'list',
		'index'
	];

	const DEFAULTS = {
		removeSi: true,
		removeTimestamp: true,
		addPrefix: false,
		prefixText: '!!p '
	};

	const SETTINGS = 'data-youtube-user-tracker-remover-settings';

	function getSettings() {
		try {
			const raw = document.documentElement.getAttribute(SETTINGS);
			if(!raw) { return DEFAULTS };
			return Object.assign({}, DEFAULTS, JSON.parse(raw));
		}
		catch(e) {
			return DEFAULTS;
		}
	}

	function changeYoutubeUrl(text) {
		if(typeof text !== 'string') { return text };

		let url;
		try{ 
			url = new URL(text.trim());
		}
		catch(e) {
			return text;
		}

		const isYoutube =
			/(^|\.)youtube\.com$/.test(url.hostname) ||
			/(^|\.)youtu\.be$/.test(url.hostname);

		if(!isYoutube) return text;

		const settings = getSettings();
		let changed = false;

		for(const param of ALWAYS_REMOVE) {
			if (url.searchParams.has(param)) {
				url.searchParams.delete(param);
				changed = true;
			}
		}

		if(settings.removeSi && url.searchParams.has('si')) {
			url.searchParams.delete('si');
			changed = true;
		}

		if(settings.removeTimestamp) {
			if (url.searchParams.has('t')) {
				url.searchParams.delete('t');
				changed = true;
			}
			if (url.searchParams.has('start')) {
				url.searchParams.delete('start');
				changed = true;
			}
		}

		let result = text;
		if(changed) {
			result = url.toString().replace(/\?$/, '');
		}

		if(settings.addPrefix) {
			result = (settings.prefixText || '') + result;
		}

		if(result === text) { return text; }

		console.log('[Youtube User Tracker Remover] parameter(s) cleaned:', text, '->', result);
		return result;
	}

	if(navigator.clipboard && navigator.clipboard.writeText) {
		const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
		navigator.clipboard.writeText = function (text) {
			let toWrite = text;
			try{
				toWrite = changeYoutubeUrl(text);
			}
			catch(e) {
				toWrite = text;
			}
			return originalWriteText(toWrite);
		};
	}

	document.addEventListener(
		'copy',
		function (e) {
			if(!e.clipboardData) { return };

			const selection = window.getSelection ? window.getSelection().toString() : '';
			if(!selection) { return };

			const trimmed = selection.trim();
			const changed = changeYoutubeUrl(trimmed);

			if(changed !== trimmed) {
				e.clipboardData.setData('text/plain', changed);
				e.preventDefault();
			}
		}, true
	);
})();
