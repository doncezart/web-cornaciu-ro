const cyrillicMap: Record<string, string> = {
	а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z',
	и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p',
	р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch',
	ш: 'sh', щ: 'sht', ъ: 'a', ь: '', ю: 'yu', я: 'ya',
	є: 'ye', і: 'i', ї: 'yi', ґ: 'g'
};

function transliterate(text: string): string {
	return text.replace(/[а-яёєіїґ]/gi, (char) => {
		const lower = char.toLowerCase();
		const mapped = cyrillicMap[lower] ?? '';
		return char === lower ? mapped : mapped.charAt(0).toUpperCase() + mapped.slice(1);
	});
}

export function slugify(text: string): string {
	return transliterate(text)
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)+/g, '');
}
