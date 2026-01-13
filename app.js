// ===== TEKNOLOJİ KAHİN - Ana Uygulama =====

// Demo verisi (gerçek veri çekilene kadar)
const DEMO_DATA = {
    lastUpdate: new Date().toISOString(),
    projects: [
        { name: "bun", fullName: "oven-sh/bun", stars: 85000, growth: 847, description: "Incredibly fast JavaScript runtime", language: "Zig", score: 95 },
        { name: "deno", fullName: "denoland/deno", stars: 92000, growth: 234, description: "A modern runtime for JavaScript", language: "Rust", score: 88 },
        { name: "turso", fullName: "tursodatabase/turso", stars: 12000, growth: 523, description: "SQLite for the edge", language: "Rust", score: 87 },
        { name: "drizzle-orm", fullName: "drizzle-team/drizzle-orm", stars: 18000, growth: 412, description: "TypeScript ORM", language: "TypeScript", score: 85 },
        { name: "htmx", fullName: "bigskysoftware/htmx", stars: 28000, growth: 356, description: "High power tools for HTML", language: "JavaScript", score: 82 },
        { name: "svelte", fullName: "sveltejs/svelte", stars: 75000, growth: 189, description: "Cybernetically enhanced web apps", language: "JavaScript", score: 80 },
        { name: "astro", fullName: "withastro/astro", stars: 38000, growth: 278, description: "The all-in-one web framework", language: "TypeScript", score: 79 },
        { name: "tauri", fullName: "tauri-apps/tauri", stars: 72000, growth: 156, description: "Build desktop apps", language: "Rust", score: 77 },
        { name: "fresh", fullName: "denoland/fresh", stars: 11000, growth: 198, description: "The next-gen web framework", language: "TypeScript", score: 75 },
        { name: "solid", fullName: "solidjs/solid", stars: 29000, growth: 134, description: "A declarative UI library", language: "TypeScript", score: 73 },
    ],
    watchList: [
        { name: "moment", fullName: "moment/moment", stars: 47000, growth: -34, description: "Parse, validate, manipulate dates", language: "JavaScript", score: 35 },
        { name: "jquery", fullName: "jquery/jquery", stars: 58000, growth: -28, description: "JavaScript library", language: "JavaScript", score: 30 },
        { name: "lodash", fullName: "lodash/lodash", stars: 57000, growth: -15, description: "Utility library", language: "JavaScript", score: 45 },
    ]
};

// ===== ANA FONKSİYONLAR =====

// Veri yükle (önce JSON dosyasından, yoksa demo)
async function loadData() {
    try {
        const response = await fetch('./data/trending.json');
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log('JSON verisi bulunamadı, demo veri kullanılıyor');
    }
    return DEMO_DATA;
}

// İstatistikleri güncelle
function updateStats(data) {
    document.getElementById('totalRepos').textContent = data.projects.length + data.watchList.length;
    document.getElementById('risingCount').textContent = data.projects.filter(p => p.growth > 0).length;
    document.getElementById('fallingCount').textContent = data.watchList.length;

    const date = new Date(data.lastUpdate);
    document.getElementById('lastUpdate').textContent = date.toLocaleString('tr-TR');
}

// Trend listesini render et
function renderTrendList(projects, containerId, isRising = true) {
    const container = document.getElementById(containerId);

    if (!projects || projects.length === 0) {
        container.innerHTML = '<div class="loading">Veri bulunamadı</div>';
        return;
    }

    container.innerHTML = projects.slice(0, 5).map((project, index) => `
        <div class="trend-item">
            <div class="trend-rank">${index + 1}</div>
            <div class="trend-info">
                <div class="trend-name">
                    <a href="https://github.com/${project.fullName}" target="_blank">${project.name}</a>
                </div>
                <div class="trend-desc">${project.description || ''}</div>
            </div>
            <div class="trend-stats">
                <div class="trend-stars">⭐ ${formatNumber(project.stars)}</div>
                <div class="trend-growth ${project.growth >= 0 ? 'up' : 'down'}">
                    ${project.growth >= 0 ? '↑' : '↓'} ${Math.abs(project.growth)}%
                </div>
            </div>
        </div>
    `).join('');
}

// Proje tablosunu render et
function renderProjectsTable(projects) {
    const tbody = document.getElementById('projectsTable');
    const allProjects = [...projects.projects, ...projects.watchList]
        .sort((a, b) => b.score - a.score);

    tbody.innerHTML = allProjects.map((project, index) => {
        const scoreClass = project.score >= 70 ? 'high' : project.score >= 40 ? 'medium' : 'low';
        return `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <a href="https://github.com/${project.fullName}" target="_blank">
                        ${project.fullName}
                    </a>
                </td>
                <td>⭐ ${formatNumber(project.stars)}</td>
                <td class="${project.growth >= 0 ? 'trend-growth up' : 'trend-growth down'}">
                    ${project.growth >= 0 ? '↑' : '↓'} ${Math.abs(project.growth)}%
                </td>
                <td><span class="score-badge ${scoreClass}">${project.score}</span></td>
            </tr>
        `;
    }).join('');
}

// Grafik oluştur
function createChart(data) {
    const ctx = document.getElementById('trendChart').getContext('2d');

    const labels = data.projects.slice(0, 7).map(p => p.name);
    const scores = data.projects.slice(0, 7).map(p => p.score);
    const growths = data.projects.slice(0, 7).map(p => p.growth);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Trend Skoru',
                    data: scores,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1,
                    borderRadius: 8,
                },
                {
                    label: 'Büyüme %',
                    data: growths,
                    backgroundColor: 'rgba(63, 185, 80, 0.8)',
                    borderColor: 'rgba(63, 185, 80, 1)',
                    borderWidth: 1,
                    borderRadius: 8,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#8b949e'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#8b949e' },
                    grid: { color: 'rgba(48, 54, 61, 0.5)' }
                },
                y: {
                    ticks: { color: '#8b949e' },
                    grid: { color: 'rgba(48, 54, 61, 0.5)' }
                }
            }
        }
    });
}

// Sayı formatla (1000 -> 1K)
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Arama fonksiyonu
function setupSearch(data) {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');

    function filterAndSort() {
        const searchTerm = searchInput.value.toLowerCase();
        const sortBy = sortSelect.value;

        let allProjects = [...data.projects, ...data.watchList];

        // Filtrele
        if (searchTerm) {
            allProjects = allProjects.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.fullName.toLowerCase().includes(searchTerm)
            );
        }

        // Sırala
        allProjects.sort((a, b) => {
            switch (sortBy) {
                case 'stars': return b.stars - a.stars;
                case 'growth': return b.growth - a.growth;
                default: return b.score - a.score;
            }
        });

        renderFilteredTable(allProjects);
    }

    searchInput.addEventListener('input', filterAndSort);
    sortSelect.addEventListener('change', filterAndSort);
}

function renderFilteredTable(projects) {
    const tbody = document.getElementById('projectsTable');

    tbody.innerHTML = projects.map((project, index) => {
        const scoreClass = project.score >= 70 ? 'high' : project.score >= 40 ? 'medium' : 'low';
        return `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <a href="https://github.com/${project.fullName}" target="_blank">
                        ${project.fullName}
                    </a>
                </td>
                <td>⭐ ${formatNumber(project.stars)}</td>
                <td class="${project.growth >= 0 ? 'trend-growth up' : 'trend-growth down'}">
                    ${project.growth >= 0 ? '↑' : '↓'} ${Math.abs(project.growth)}%
                </td>
                <td><span class="score-badge ${scoreClass}">${project.score}</span></td>
            </tr>
        `;
    }).join('');
}

// ===== BAŞLAT =====
async function init() {
    console.log('🔮 Teknoloji Kahin başlatılıyor...');

    const data = await loadData();

    updateStats(data);
    renderTrendList(data.projects, 'risingList', true);
    renderTrendList(data.watchList, 'watchList', false);
    renderProjectsTable(data);
    createChart(data);
    setupSearch(data);

    // Yenile butonu
    document.getElementById('refreshBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        location.reload();
    });

    console.log('✅ Teknoloji Kahin hazır!');
}

// Sayfa yüklenince başlat
document.addEventListener('DOMContentLoaded', init);
