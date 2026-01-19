// Simple tab-to-panel switcher for the main tabs
document.addEventListener('DOMContentLoaded', () => {
	const tabs = Array.from(document.querySelectorAll('.top-tabs [role="tab"]'));
	const panels = Array.from(document.querySelectorAll('.tab-panel'));

	// Position panels directly under the visible .top-tabs element
	function positionPanels() {
		const topTabs = document.querySelector('.top-tabs');
		if (!topTabs) return;
		const rect = topTabs.getBoundingClientRect();
		// rect.bottom is viewport coordinate; panels are fixed, so use it directly
		const topPx = Math.ceil(rect.bottom);
		panels.forEach(p => {
			p.style.top = topPx + 'px';
		});
	}

	// update on load and when viewport changes
	window.addEventListener('resize', positionPanels);
	window.addEventListener('orientationchange', positionPanels);
	window.addEventListener('load', positionPanels);

	function getRandomTurtleImage() {
		const turtles = ['turtl1.png', 'turtl2.png', 'turtl3.png'];
		return turtles[Math.floor(Math.random() * turtles.length)];
	}

	function activate(id) {
		tabs.forEach(t => {
			const isActive = t.dataset.tab === id;
			t.setAttribute('aria-selected', String(Boolean(isActive)));
			if (isActive) t.classList.add('active'); else t.classList.remove('active');
		});

		panels.forEach(p => {
			const isActive = p.dataset.tabpanel === id;
			const pText = p.querySelector('p');
			if (isActive) {
				p.hidden = false;
				if (pText) {
					// Randomly select turtle image for specific tabs
					if (['intro', 'guidelines', 'staff'].includes(id)) {
						pText.style.backgroundImage = `url(images/${getRandomTurtleImage()})`;
					}
					pText.classList.add('fade-out');
					// Force reflow to trigger transition from opacity 0 to 1
					void pText.offsetWidth;
					pText.classList.remove('fade-out');
				}
			} else {
				// Add fade-out class to text content
				if (pText) {
					pText.classList.add('fade-out');
				}
				// Wait for fade-out animation to complete before hiding
				setTimeout(() => {
					p.hidden = true;
				}, 500); // Match the 0.5s transition duration
			}
		});
	}

	tabs.forEach(t => {
		t.addEventListener('click', (e) => {
			// only handle button tabs (external links are anchors)
			if (t.tagName !== 'BUTTON') return;
			const id = t.dataset.tab;
			if (!id) return;
			activate(id);
		});
	});

	// default: activate introduction if present
	const defaultTab = tabs.find(t => t.dataset.tab === 'intro');
	if (defaultTab) activate('intro');

	// position panels after initial render
	positionPanels();
});
