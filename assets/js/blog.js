/* =========================================================================
   Musings archive — renders three forms in three voices:
     · Essays   → a complete, scannable table-of-contents index
     · Quotes    → a commonplace book of pull-quotes
     · Thoughts  → numbered aphorisms
   Reads the same posts/quotes/thoughts JSON indexes as before; presentation
   only, so create_post.sh stays unchanged.
   ========================================================================= */
document.addEventListener("DOMContentLoaded", function () {
    const CACHE_KEY = 'musingsContent';
    const CACHE_EXPIRY = 3600000; // 1 hour
    const container = document.getElementById('blog-container');

    // limit = Infinity means "never paginate" — the essay index is meant to be
    // complete and scannable; the longer forms reveal progressively as they grow.
    const SECTIONS = [
        { id: 'essays',   label: 'Essays',   limit: Infinity },
        { id: 'quotes',   label: 'Quotes',   limit: 6 },
        { id: 'thoughts', label: 'Thoughts', limit: 6 },
    ];

    init();

    async function init() {
        renderLoading();
        const data = await loadContent();
        if (!data) { renderError(); return; }
        render(data);
    }

    /* --------------------------------------------------------------- data */
    async function loadContent() {
        const cached = readCache();
        if (cached) return cached;

        try {
            const [posts, thoughts, quotes] = await Promise.all([
                fetchJSON('./blog/posts/index.json'),
                fetchJSON('./blog/thoughts/index.json'),
                fetchJSON('./blog/quotes/index.json'),
            ]);
            const data = {
                posts: posts || [],
                thoughts: thoughts || [],
                quotes: quotes || [],
            };
            writeCache(data);
            return data;
        } catch (error) {
            console.error('Error loading musings:', error);
            return null;
        }
    }

    async function fetchJSON(url, timeout = 5000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);
        try {
            const res = await fetch(url, {
                signal: controller.signal,
                headers: { 'Cache-Control': 'no-cache' },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return null;
        } finally {
            clearTimeout(timer);
        }
    }

    function readCache() {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const { timestamp, data } = JSON.parse(raw);
            if (Date.now() - timestamp < CACHE_EXPIRY) return data;
            localStorage.removeItem(CACHE_KEY);
            return null;
        } catch (error) {
            return null;
        }
    }

    function writeCache(data) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
        } catch (error) {
            /* private mode / quota — just skip caching */
        }
    }

    /* ------------------------------------------------------------- render */
    function render(data) {
        if (!data.posts.length && !data.quotes.length && !data.thoughts.length) {
            renderError();
            return;
        }
        container.innerHTML = '';
        const counts = {
            essays: data.posts.length,
            quotes: data.quotes.length,
            thoughts: data.thoughts.length,
        };

        container.appendChild(buildNav(counts));
        if (data.posts.length)    container.appendChild(buildEssays(data.posts));
        if (data.quotes.length)   container.appendChild(buildQuotes(data.quotes));
        if (data.thoughts.length) container.appendChild(buildThoughts(data.thoughts));

        wireScrollSpy();
    }

    function renderLoading() {
        container.innerHTML = '<div class="loading-indicator">Gathering the archive…</div>';
    }

    function renderError() {
        container.innerHTML = '<div class="error-message">Couldn’t load the archive just now. Please try again later.</div>';
    }

    /* ----------------------------------------------------------- builders */
    function buildNav(counts) {
        const nav = document.createElement('nav');
        nav.className = 'archive-nav';
        nav.setAttribute('aria-label', 'Sections');
        SECTIONS.forEach(s => {
            const count = counts[s.id] || 0;
            if (!count) return;
            const a = document.createElement('a');
            a.href = '#' + s.id;
            a.innerHTML = `${s.label} <span class="count">${count}</span>`;
            nav.appendChild(a);
        });
        return nav;
    }

    function sectionShell(id, label, count) {
        const section = document.createElement('section');
        section.className = 'archive-section';
        section.id = id;
        const head = document.createElement('div');
        head.className = 'section-head';
        head.innerHTML =
            `<h2>${label}</h2>` +
            `<span class="rule" aria-hidden="true"></span>` +
            `<span class="count">${count}</span>`;
        section.appendChild(head);
        return section;
    }

    function buildEssays(posts) {
        const section = sectionShell('essays', 'Essays', posts.length);
        const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

        const byYear = {};
        sorted.forEach(p => {
            const year = new Date(p.date).getFullYear();
            (byYear[year] = byYear[year] || []).push(p);
        });

        const index = document.createElement('div');
        index.className = 'essay-index';

        Object.keys(byYear).sort((a, b) => b - a).forEach(year => {
            const heading = document.createElement('div');
            heading.className = 'essay-year';
            heading.textContent = year;
            index.appendChild(heading);

            byYear[year].forEach(p => {
                const url = p.url.endsWith('.html') ? p.url.slice(0, -5) : p.url;
                const item = document.createElement('div');
                item.className = 'essay-item';
                item.innerHTML = `
                    <a class="essay-row" href="${url}">
                        <span class="essay-title">${p.title}</span>
                        <span class="essay-leader" aria-hidden="true"></span>
                        <span class="essay-date">${shortDate(p.date)}</span>
                    </a>
                    ${p.excerpt ? `<p class="essay-excerpt"><span>${p.excerpt}</span></p>` : ''}
                `;
                index.appendChild(item);
            });
        });

        section.appendChild(index);
        return section;
    }

    function buildQuotes(quotes) {
        const section = sectionShell('quotes', 'Quotes', quotes.length);
        const sorted = [...quotes].sort((a, b) => new Date(b.date) - new Date(a.date));

        const list = document.createElement('div');
        list.className = 'quote-list';

        sorted.forEach(q => {
            const figure = document.createElement('figure');
            figure.className = 'quote-entry';

            const author = q.authorLink
                ? `<a href="${q.authorLink}" target="_blank" rel="noopener">${q.author}</a>`
                : q.author;

            // Skip the source line when it just repeats the opening of the quote
            // (some entries title themselves with their first sentence).
            const dup = q.title &&
                q.content.trim().toLowerCase().startsWith(q.title.trim().toLowerCase().replace(/\.$/, ''));
            const source = (q.title && !dup) ? `<span class="quote-source">${q.title}</span>` : '';

            figure.innerHTML = `
                ${source}
                <blockquote class="quote-body">${q.content}</blockquote>
                <figcaption class="quote-cite">— ${author}<span class="quote-date">${fullDate(q.date)}</span></figcaption>
            `;
            list.appendChild(figure);
        });

        section.appendChild(list);
        applyShowMore(section, list, '.quote-entry', limitFor('quotes'));
        return section;
    }

    function buildThoughts(thoughts) {
        const section = sectionShell('thoughts', 'Thoughts', thoughts.length);
        const sorted = [...thoughts].sort((a, b) => new Date(b.date) - new Date(a.date));

        const list = document.createElement('div');
        list.className = 'thought-list';

        sorted.forEach((t, i) => {
            const entry = document.createElement('div');
            entry.className = 'thought-entry';
            entry.innerHTML = `
                <div class="thought-num" aria-hidden="true">${toRoman(i + 1)}</div>
                <div class="thought-body">
                    <h3 class="thought-title">${t.title}</h3>
                    <p class="thought-text">${t.content}</p>
                    <div class="thought-date">${fullDate(t.date)}</div>
                </div>
            `;
            list.appendChild(entry);
        });

        section.appendChild(list);
        applyShowMore(section, list, '.thought-entry', limitFor('thoughts'));
        return section;
    }

    /* --------------------------------------------------------- show more */
    function applyShowMore(section, list, itemSelector, limit) {
        const items = Array.from(list.querySelectorAll(itemSelector));
        if (items.length <= limit) return;

        items.slice(limit).forEach(el => el.classList.add('is-hidden'));

        const remaining = items.length - limit;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'show-more';
        button.textContent = `Show ${remaining} more`;
        button.addEventListener('click', () => {
            items.forEach(el => el.classList.remove('is-hidden'));
            button.remove();
        });
        section.appendChild(button);
    }

    /* --------------------------------------------------------- scrollspy */
    function wireScrollSpy() {
        const links = Array.from(document.querySelectorAll('.archive-nav a'));
        if (!links.length || !('IntersectionObserver' in window)) return;

        const linkFor = {};
        links.forEach(l => { linkFor[l.getAttribute('href').slice(1)] = l; });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                links.forEach(l => l.classList.remove('active'));
                const link = linkFor[entry.target.id];
                if (link) link.classList.add('active');
            });
        }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

        document.querySelectorAll('.archive-section').forEach(s => observer.observe(s));
    }

    /* ----------------------------------------------------------- helpers */
    function limitFor(id) {
        const section = SECTIONS.find(s => s.id === id);
        return section ? section.limit : Infinity;
    }

    function shortDate(value) {
        return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function fullDate(value) {
        return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function toRoman(n) {
        const numerals = [
            [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
            [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
            [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
        ];
        let result = '';
        for (const [value, symbol] of numerals) {
            while (n >= value) { result += symbol; n -= value; }
        }
        return result;
    }
});
