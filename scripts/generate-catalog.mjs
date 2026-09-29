#!/usr/bin/env node
// Downloads a YouTube playlist as audio-only m4a and writes src/music/catalog.json.
// Run by hand before `pnpm publish`. Not part of the Cloudflare build.
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);

const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLQKZBqSJS3rk';
const AUDIO_DIRECTORY = 'public/music';
const CATALOG_PATH = 'src/music/catalog.json';
const URL_BASE = '/music/';
const FORMAT = '140'; // m4a, AAC ~130 kbps, plays everywhere, no ffmpeg step

async function ytdlp(args) {
    try {
        return await run('uvx', ['yt-dlp', ...args], { maxBuffer: 64 * 1024 * 1024 });
    } catch (error) {
        throw new Error(`yt-dlp failed: ${error.stderr || error.message}`);
    }
}

// Single track. Returns null when the audio or sidecar is absent.
async function readTrack(trackId, audioDirectory) {
    const audioPath = `${audioDirectory}/${trackId}.m4a`;
    const infoPath = `${audioDirectory}/${trackId}.info.json`;
    if (!existsSync(audioPath) || !existsSync(infoPath)) return null;
    const info = JSON.parse(await readFile(infoPath, 'utf8'));
    return {
        id: trackId,
        title: info.title,
        seconds: Math.round(info.duration),
        bytes: (await stat(audioPath)).size,
    };
}

// Single track. Downloads format 140 and the sidecar. Fails loudly.
async function downloadTrack(trackId, audioDirectory) {
    await mkdir(audioDirectory, { recursive: true });
    await ytdlp([
        '-f', FORMAT,
        '--write-info-json',
        '--no-progress',
        '-o', `${audioDirectory}/%(id)s.%(ext)s`,
        `https://www.youtube.com/watch?v=${trackId}`,
    ]);
    const track = await readTrack(trackId, audioDirectory);
    if (track === null) throw new Error(`no m4a produced for ${trackId}`);
    return track;
}

// Single track. Refreshes the sidecar without the media. Fails loudly.
async function refreshTrackMetadata(trackId, audioDirectory) {
    await ytdlp([
        '--skip-download',
        '--write-info-json',
        '--no-progress',
        '-o', `${audioDirectory}/%(id)s.%(ext)s`,
        `https://www.youtube.com/watch?v=${trackId}`,
    ]);
    const track = await readTrack(trackId, audioDirectory);
    if (track === null) throw new Error(`no sidecar produced for ${trackId}`);
    return track;
}

// Deletes audio and sidecars whose id left the playlist.
async function pruneOrphanAudio(keptIds, audioDirectory) {
    if (!existsSync(audioDirectory)) return;
    const kept = new Set(keptIds);
    for (const entry of await readdir(audioDirectory)) {
        const trackId = entry.replace(/\.(m4a|info\.json)$/, '');
        if (trackId === entry || kept.has(trackId)) continue;
        await rm(`${audioDirectory}/${entry}`, { force: true });
        console.log(`prune ${entry}`);
    }
}

// Pure. Derives the served path and stamps the generation time.
function buildCatalog(downloads, urlBase, generatedAt) {
    return {
        generatedAt,
        tracks: downloads.map((track) => ({ ...track, audioFile: `${urlBase}${track.id}.m4a` })),
    };
}

async function writeCatalog(catalog, filePath) {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, `${JSON.stringify(catalog, null, 4)}\n`);
}

async function fetchTrackIds(playlistUrl) {
    const { stdout } = await ytdlp(['--flat-playlist', '--print', 'id', playlistUrl]);
    return stdout.split('\n').map((line) => line.trim()).filter(Boolean);
}

// Holds the loop and the skip branch, then delegates per track.
async function generateCatalog(playlistUrl, audioDirectory, catalogPath, urlBase, refresh) {
    const trackIds = await fetchTrackIds(playlistUrl);
    const downloads = [];
    for (const trackId of trackIds) {
        const existing = await readTrack(trackId, audioDirectory);
        if (existing !== null) {
            if (refresh) {
                console.log(`meta  ${existing.title}`);
                downloads.push(await refreshTrackMetadata(trackId, audioDirectory));
            } else {
                console.log(`skip  ${existing.title}`);
                downloads.push(existing);
            }
            continue;
        }
        console.log(`fetch ${trackId}`);
        downloads.push(await downloadTrack(trackId, audioDirectory));
    }
    await pruneOrphanAudio(trackIds, audioDirectory);
    await writeCatalog(buildCatalog(downloads, urlBase, new Date().toISOString()), catalogPath);
    console.log(`\n${downloads.length} tracks written to ${catalogPath}`);
}

await generateCatalog(
    PLAYLIST_URL,
    AUDIO_DIRECTORY,
    CATALOG_PATH,
    URL_BASE,
    process.argv.includes('--refresh'),
);
