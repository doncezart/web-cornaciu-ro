export function reveal(node: HTMLElement, { threshold = 0.15, stagger = true } = {}) {
	const children = stagger
		? Array.from(node.querySelectorAll<HTMLElement>('.animate-in'))
		: [];

	// If the node itself should animate
	if (node.classList.contains('animate-in')) {
		children.unshift(node);
	}

	const targets = children.length > 0 ? children : [node];

	// Ensure all targets start hidden
	for (const el of targets) {
		if (!el.classList.contains('animate-in')) {
			el.classList.add('animate-in');
		}
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const el = entry.target as HTMLElement;
					const idx = targets.indexOf(el);
					setTimeout(() => {
						el.classList.add('visible');
					}, idx * 100);
					observer.unobserve(el);
				}
			}
		},
		{ threshold, rootMargin: '0px 0px -80px 0px' }
	);

	for (const el of targets) {
		observer.observe(el);
	}

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
