const DEFAULTS = {
	removeSi: true,
	removeTimestamp: true,
	addPrefix: false,
	prefixText: '!!p '
};

const addPrefixCheckbox = document.getElementById('addPrefix');
const prefixTextInput = document.getElementById('prefixText');

function load() {
	chrome.storage.sync.get(DEFAULTS, (settings) => {
		document.getElementById('removeSi').checked = settings.removeSi;
		document.getElementById('removeTimestamp').checked = settings.removeTimestamp;
		addPrefixCheckbox.checked = settings.addPrefix;
		prefixTextInput.value = settings.prefixText;
		prefixTextInput.disabled = !settings.addPrefix;
	});
}

document.getElementById('removeSi').addEventListener('change', (e) => {
  	chrome.storage.sync.set({ removeSi: e.target.checked });
});

document.getElementById('removeTimestamp').addEventListener('change', (e) => {
  	chrome.storage.sync.set({ removeTimestamp: e.target.checked });
});

addPrefixCheckbox.addEventListener('change', (e) => {
	chrome.storage.sync.set({ addPrefix: e.target.checked });
	prefixTextInput.disabled = !e.target.checked;
});

// A timer to save the prefix after typing has stoppped.
// It is to prevent saving to browser storage everytime something has been typed.
// Currently at 200ms
let prefixSaveTimer = null;
prefixTextInput.addEventListener('input', (e) => {
	const value = e.target.value;
	clearTimeout(prefixSaveTimer);
	prefixSaveTimer = setTimeout(() => {
		chrome.storage.sync.set({ prefixText: value });
	}, 200);
});

function isYoutubeUrl(url) {
	if(!url) { return false };
	try {
		const u = new URL(url);
		return (
			/(^|\.)youtube\.com$/.test(u.hostname) ||
			/(^|\.)youtu\.be$/.test(u.hostname)
		);
	} catch(e) {
		return false;
	}
}

const reloadStatus = document.getElementById('reloadStatus');

document.getElementById('reloadTab').addEventListener('click', () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tab = tabs[0];
		if(!tab || !isYoutubeUrl(tab.url)) {
			reloadStatus.textContent = 'Current tab is not YouTube';
			return;
		}
		chrome.tabs.reload(tab.id, () => {
			reloadStatus.textContent = 'Reloaded';
			setTimeout(() => window.close(), 400);
		});
	});
});

load();
