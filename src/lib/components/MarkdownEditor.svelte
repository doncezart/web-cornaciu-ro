<script lang="ts">
	import { marked } from 'marked';
	import DOMPurify from 'isomorphic-dompurify';

	interface Props {
		name?: string;
		value?: string;
		placeholder?: string;
	}

	let { name = 'content', value = '', placeholder = 'Scrie articolul aici...' }: Props = $props();

	let content = $state('');
	let textarea = $state<HTMLTextAreaElement>();

	$effect(() => {
		content = value;
	});
	let mode: 'write' | 'preview' = $state('write');
	let uploading = $state(false);
	let dragOver = $state(false);

	let renderedHtml = $state('');
	let debounceTimer: ReturnType<typeof setTimeout>;

	$effect(() => {
		const src = content || '';
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			renderedHtml = DOMPurify.sanitize(marked.parse(src) as string);
		}, 300);
		return () => clearTimeout(debounceTimer);
	});

	const readingTime = $derived((() => {
		const words = content.trim().split(/\s+/).filter(Boolean).length;
		return Math.max(1, Math.ceil(words / 200));
	})());

	function wrap(before: string, after: string = before) {
		if (!textarea) return;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selected = content.slice(start, end);
		const replacement = `${before}${selected || 'text'}${after}`;
		content = content.slice(0, start) + replacement + content.slice(end);
		requestAnimationFrame(() => {
			textarea!.focus();
			const newStart = start + before.length;
			const newEnd = newStart + (selected ? selected.length : 4);
			textarea!.setSelectionRange(newStart, newEnd);
		});
	}

	function insertLine(prefix: string) {
		if (!textarea) return;
		const start = textarea.selectionStart;
		const lineStart = content.lastIndexOf('\n', start - 1) + 1;
		const before = content.slice(0, lineStart);
		const after = content.slice(lineStart);
		content = `${before}${prefix}${after}`;
		requestAnimationFrame(() => {
			textarea!.focus();
			textarea!.setSelectionRange(start + prefix.length, start + prefix.length);
		});
	}

	function insertAt(text: string) {
		if (!textarea) return;
		const start = textarea.selectionStart;
		content = content.slice(0, start) + text + content.slice(start);
		requestAnimationFrame(() => {
			textarea!.focus();
			const pos = start + text.length;
			textarea!.setSelectionRange(pos, pos);
		});
	}

	function bold() { wrap('**'); }
	function italic() { wrap('_'); }
	function heading2() { insertLine('## '); }
	function heading3() { insertLine('### '); }
	function bulletList() { insertLine('- '); }
	function numberedList() { insertLine('1. '); }
	function blockquote() { insertLine('> '); }
	function horizontalRule() { insertAt('\n---\n'); }
	function insertLink() { wrap('[', '](url)'); }

	function handleKeydown(e: KeyboardEvent) {
		if (e.ctrlKey || e.metaKey) {
			if (e.key === 'b') { e.preventDefault(); bold(); }
			if (e.key === 'i') { e.preventDefault(); italic(); }
			if (e.key === 'k') { e.preventDefault(); insertLink(); }
		}
	}

	async function uploadFile(file: File) {
		if (!file.type.startsWith('image/')) return;
		uploading = true;
		try {
			const formData = new FormData();
			formData.append('file', file);
			const res = await fetch('/api/upload', { method: 'POST', body: formData });
			if (!res.ok) {
				const err = await res.json();
				alert(err.message || 'Eroare la upload');
				return;
			}
			const { url } = await res.json();
			insertAt(`\n![${file.name}](${url})\n`);
		} catch {
			alert('Eroare la upload. Verifică configurația R2.');
		} finally {
			uploading = false;
		}
	}

	function handleImageUpload() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = () => {
			if (input.files?.[0]) uploadFile(input.files[0]);
		};
		input.click();
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		if (e.dataTransfer?.files) {
			for (const file of e.dataTransfer.files) {
				if (file.type.startsWith('image/')) uploadFile(file);
			}
		}
	}

	function handlePaste(e: ClipboardEvent) {
		const items = e.clipboardData?.items;
		if (!items) return;
		for (const item of items) {
			if (item.type.startsWith('image/')) {
				e.preventDefault();
				const file = item.getAsFile();
				if (file) uploadFile(file);
			}
		}
	}
</script>

<div class="editor">
	<!-- Hidden inputs for form submission -->
	<input type="hidden" {name} value={content} />
	<input type="hidden" name="readingTime" value={readingTime} />

	<div class="editor-toolbar">
		<div class="toolbar-left">
			<button type="button" class="tab" class:active={mode === 'write'} onclick={() => mode = 'write'}>
				Editare
			</button>
			<button type="button" class="tab" class:active={mode === 'preview'} onclick={() => mode = 'preview'}>
				Previzualizare
			</button>
		</div>

		{#if mode === 'write'}
			<div class="toolbar-actions">
				<button type="button" title="Heading 2" aria-label="Heading 2" onclick={heading2}><strong>H2</strong></button>
				<button type="button" title="Heading 3" aria-label="Heading 3" onclick={heading3}><strong>H3</strong></button>
				<span class="divider"></span>
				<button type="button" title="Bold (Ctrl+B)" aria-label="Bold" onclick={bold}><strong>B</strong></button>
				<button type="button" title="Italic (Ctrl+I)" aria-label="Italic" onclick={italic}><em>I</em></button>
				<span class="divider"></span>
				<button type="button" title="Listă" aria-label="Listă neordonată" onclick={bulletList}>•</button>
				<button type="button" title="Listă numerotată" aria-label="Listă numerotată" onclick={numberedList}>1.</button>
				<button type="button" title="Blockquote" aria-label="Citat" onclick={blockquote}>❝</button>
				<button type="button" title="Linie orizontală" aria-label="Linie orizontală" onclick={horizontalRule}>—</button>
				<span class="divider"></span>
				<button type="button" title="Link (Ctrl+K)" aria-label="Inserează link" onclick={insertLink}>🔗</button>
				<button type="button" title="Imagine" aria-label="Încarcă imagine" onclick={handleImageUpload} disabled={uploading}>
					{uploading ? '⏳' : '🖼️'}
				</button>
			</div>
		{/if}

		<div class="toolbar-right">
			<span class="reading-time">~{readingTime} min lectură</span>
		</div>
	</div>

	{#if mode === 'write'}
		<div
			class="editor-write"
			class:drag-over={dragOver}
			ondragover={(e) => { e.preventDefault(); dragOver = true; }}
			ondragleave={() => dragOver = false}
			ondrop={handleDrop}
			role="textbox"
			tabindex="-1"
		>
			<textarea
				bind:this={textarea}
				bind:value={content}
				{placeholder}
				onkeydown={handleKeydown}
				onpaste={handlePaste}
				rows="24"
			></textarea>
			{#if dragOver}
				<div class="drop-overlay">Plasează imaginea aici</div>
			{/if}
			{#if uploading}
				<div class="upload-indicator">Se încarcă imaginea...</div>
			{/if}
		</div>
	{:else}
		<div class="editor-preview prose">
			{#if content.trim()}
				{@html renderedHtml}
			{:else}
				<p class="empty-preview">Niciun conținut de previzualizat.</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.editor {
		border: 1px solid var(--border);
		background: white;
		overflow: hidden;
	}

	.editor-toolbar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		border-bottom: 1px solid var(--border);
		background: #fafafa;
		flex-wrap: wrap;
	}

	.toolbar-left {
		display: flex;
		gap: 0;
	}

	.tab {
		padding: 6px 16px;
		border: 1px solid var(--border);
		background: white;
		font-size: 13px;
		font-family: var(--font-sans);
		cursor: pointer;
		color: var(--gray);
		transition: all 0.15s ease;
	}

	.tab:first-child { border-radius: 4px 0 0 4px; }
	.tab:last-child { border-radius: 0 4px 4px 0; border-left: none; }

	.tab.active {
		background: var(--primary);
		color: white;
		border-color: var(--primary);
	}

	.toolbar-actions {
		display: flex;
		align-items: center;
		gap: 2px;
		margin-left: 12px;
	}

	.toolbar-actions button {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 14px;
		color: var(--gray);
		border-radius: 4px;
		transition: all 0.15s ease;
		font-family: var(--font-sans);
	}

	.toolbar-actions button:hover {
		background: var(--border);
		color: var(--primary);
	}

	.toolbar-actions button:disabled {
		opacity: 0.5;
		cursor: wait;
	}

	.divider {
		width: 1px;
		height: 20px;
		background: var(--border);
		margin: 0 4px;
	}

	.toolbar-right {
		margin-left: auto;
	}

	.reading-time {
		font-size: 12px;
		color: var(--gray);
		white-space: nowrap;
	}

	.editor-write {
		position: relative;
	}

	.editor-write.drag-over {
		outline: 2px dashed var(--secondary);
		outline-offset: -2px;
	}

	textarea {
		width: 100%;
		min-height: 500px;
		padding: 24px;
		border: none;
		resize: vertical;
		font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
		font-size: 14px;
		line-height: 1.8;
		color: var(--primary);
		background: white;
		tab-size: 2;
	}

	textarea:focus {
		outline: none;
	}

	.drop-overlay {
		position: absolute;
		inset: 0;
		background: rgba(139, 115, 85, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		color: var(--secondary);
		font-weight: 500;
		pointer-events: none;
	}

	.upload-indicator {
		position: absolute;
		bottom: 12px;
		right: 12px;
		background: var(--primary);
		color: white;
		padding: 6px 14px;
		font-size: 13px;
		border-radius: 4px;
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.6; }
	}

	.editor-preview {
		padding: 32px;
		min-height: 500px;
		overflow-y: auto;
	}

	/* Prose styles for markdown preview */
	.prose :global(h1) {
		font-family: var(--font-serif);
		font-size: 36px;
		font-weight: 400;
		margin: 0 0 24px;
		color: var(--primary);
	}

	.prose :global(h2) {
		font-family: var(--font-serif);
		font-size: 28px;
		font-weight: 400;
		margin: 40px 0 16px;
		color: var(--primary);
	}

	.prose :global(h3) {
		font-family: var(--font-serif);
		font-size: 22px;
		font-weight: 500;
		margin: 32px 0 12px;
		color: var(--primary);
	}

	.prose :global(p) {
		margin: 0 0 16px;
		line-height: 1.8;
		color: #444;
		font-size: 16px;
	}

	.prose :global(ul), .prose :global(ol) {
		margin: 0 0 16px;
		padding-left: 24px;
	}

	.prose :global(li) {
		margin-bottom: 6px;
		line-height: 1.7;
		color: #444;
	}

	.prose :global(blockquote) {
		border-left: 3px solid var(--secondary);
		margin: 24px 0;
		padding: 12px 20px;
		color: var(--gray);
		font-style: italic;
		background: #fafafa;
	}

	.prose :global(code) {
		background: #f3f3f3;
		padding: 2px 6px;
		border-radius: 3px;
		font-size: 14px;
	}

	.prose :global(pre) {
		background: #1a1a1a;
		color: #e5e5e5;
		padding: 20px;
		overflow-x: auto;
		margin: 24px 0;
		font-size: 14px;
		line-height: 1.6;
	}

	.prose :global(pre code) {
		background: none;
		padding: 0;
		color: inherit;
	}

	.prose :global(img) {
		max-width: 100%;
		height: auto;
		margin: 24px 0;
		border: 1px solid var(--border);
	}

	.prose :global(hr) {
		border: none;
		border-top: 1px solid var(--border);
		margin: 32px 0;
	}

	.prose :global(a) {
		color: var(--secondary);
		text-decoration: underline;
	}

	.prose :global(strong) {
		font-weight: 600;
		color: var(--primary);
	}

	.empty-preview {
		color: var(--gray);
		font-style: italic;
	}
</style>
