// ===== VERİ ÇEKME SCRİPTİ =====
// Bu script GitHub API'den veri çeker ve trending.json'a kaydeder
// Node.js ile çalıştır: node scripts/fetch-data.js

const fs = require('fs');
const path = require('path');

// GitHub API Token (environment variable'dan al)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// API Headers
const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Teknoloji-Kahin'
};

if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
}

// ===== API FONKSİYONLARI =====

// GitHub'dan trending repoları çek
async function fetchTrendingRepos() {
    console.log('📊 Trending repolar çekiliyor...');

    // Son 7 günde oluşturulan ve en çok star alan repolar
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 30);
    const dateStr = oneWeekAgo.toISOString().split('T')[0];

    const url = `https://api.github.com/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&per_page=50`;

    try {
        const response = await fetch(url, { headers });
        const data = await response.json();

        if (data.items) {
            console.log(`✅ ${data.items.length} repo bulundu`);
            return data.items;
        }
    } catch (error) {
        console.error('❌ Trending çekme hatası:', error.message);
    }

    return [];
}

// Popüler repoları çek (star sayısına göre)
async function fetchPopularRepos() {
    console.log('⭐ Popüler repolar çekiliyor...');

    const url = `https://api.github.com/search/repositories?q=stars:>50000&sort=stars&order=desc&per_page=30`;

    try {
        const response = await fetch(url, { headers });
        const data = await response.json();

        if (data.items) {
            console.log(`✅ ${data.items.length} popüler repo bulundu`);
            return data.items;
        }
    } catch (error) {
        console.error('❌ Popüler çekme hatası:', error.message);
    }

    return [];
}

// npm download sayısını çek
async function fetchNpmDownloads(packageName) {
    try {
        const url = `https://api.npmjs.org/downloads/point/last-week/${packageName}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.downloads || 0;
    } catch (error) {
        return 0;
    }
}

// Trend skoru hesapla
function calculateScore(repo, npmDownloads = 0) {
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;
    const watchers = repo.watchers_count || 0;
    const openIssues = repo.open_issues_count || 0;

    // Yaş faktörü (yeni repolar bonus alır)
    const createdAt = new Date(repo.created_at);
    const ageInDays = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
    const ageFactor = Math.max(1, 365 / Math.max(ageInDays, 1));

    // Aktivite faktörü
    const pushedAt = new Date(repo.pushed_at);
    const daysSincePush = (Date.now() - pushedAt) / (1000 * 60 * 60 * 24);
    const activityFactor = daysSincePush < 7 ? 1.5 : daysSincePush < 30 ? 1.2 : 1;

    // Skor hesaplama
    let score = 0;
    score += Math.min(stars / 1000, 30) * 2;  // Max 60 puan (stars)
    score += Math.min(forks / 500, 10);        // Max 10 puan (forks)
    score += Math.min(npmDownloads / 100000, 15); // Max 15 puan (npm)
    score += ageFactor * 5;                     // Max ~15 puan (yaş)
    score *= activityFactor;                    // Aktivite çarpanı

    return Math.min(Math.round(score), 100);
}

// Büyüme yüzdesini tahmin et (gerçek veri yerine)
function estimateGrowth(repo) {
    const createdAt = new Date(repo.created_at);
    const ageInDays = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
    const starsPerDay = repo.stargazers_count / Math.max(ageInDays, 1);

    // Günlük star kazanımına göre büyüme tahmini
    if (starsPerDay > 100) return Math.round(500 + Math.random() * 300);
    if (starsPerDay > 50) return Math.round(200 + Math.random() * 200);
    if (starsPerDay > 20) return Math.round(100 + Math.random() * 100);
    if (starsPerDay > 5) return Math.round(50 + Math.random() * 50);
    if (starsPerDay > 1) return Math.round(10 + Math.random() * 40);
    return Math.round(-20 + Math.random() * 40); // Düşük aktivite
}

// ===== ANA FONKSİYON =====

async function main() {
    console.log('🔮 Teknoloji Kahin - Veri Güncelleme');
    console.log('====================================\n');

    // Verileri çek
    const trending = await fetchTrendingRepos();
    const popular = await fetchPopularRepos();

    // Birleştir ve tekrarları kaldır
    const allRepos = [...trending, ...popular];
    const uniqueRepos = [];
    const seen = new Set();

    for (const repo of allRepos) {
        if (!seen.has(repo.full_name)) {
            seen.add(repo.full_name);
            uniqueRepos.push(repo);
        }
    }

    console.log(`\n📦 Toplam ${uniqueRepos.length} benzersiz repo`);

    // İşle ve formatla
    const projects = [];
    const watchList = [];

    for (const repo of uniqueRepos.slice(0, 30)) {
        const growth = estimateGrowth(repo);
        const score = calculateScore(repo);

        const projectData = {
            name: repo.name,
            fullName: repo.full_name,
            stars: repo.stargazers_count,
            growth: growth,
            description: repo.description || '',
            language: repo.language || 'Unknown',
            score: score
        };

        if (growth > 0 && score >= 50) {
            projects.push(projectData);
        } else {
            watchList.push(projectData);
        }
    }

    // Sırala
    projects.sort((a, b) => b.score - a.score);
    watchList.sort((a, b) => b.score - a.score);

    // Sonuç objesi
    const result = {
        lastUpdate: new Date().toISOString(),
        projects: projects.slice(0, 15),
        watchList: watchList.slice(0, 10)
    };

    // Kaydet
    const outputPath = path.join(__dirname, '..', 'data', 'trending.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`\n✅ Veri kaydedildi: ${outputPath}`);

    // Geçmiş için de kaydet
    const today = new Date().toISOString().split('T')[0];
    const historyPath = path.join(__dirname, '..', 'data', 'history', `${today}.json`);
    fs.writeFileSync(historyPath, JSON.stringify(result, null, 2));
    console.log(`📁 Geçmiş kaydedildi: ${historyPath}`);

    console.log('\n🎉 Veri güncelleme tamamlandı!');
}

// Çalıştır
main().catch(console.error);
