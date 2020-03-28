const hlsSources = [
    'https://adhoc-hlslive-fst-amz.mlb.com/41cb66c7-477a-464b-a6ea-601d4556fc5b/Brewers-walk-off-in-NLDS-Game-1.m3u8',
    'https://adhoc-hlslive-fst-amz.mlb.com/f76c487e-49de-41a8-bfdc-b32223c54052/Arenados-walkoff-homer-cycle.m3u8',
    'https://adhoc-hlslive-fst-amz.mlb.com/5ab0f896-7beb-4e83-af43-25e33c38b546/Justin-Verlanders-1st-nohitter.m3u8',
    'https://adhoc-hlslive-fst-amz.mlb.com/26f473a9-7b9a-427c-8bc3-d3e7b8b21c13/Royals-win-2015-World-Series.m3u8',
    'https://adhoc-hlslive-fst-amz.mlb.com/09782e63-3200-40c5-b79e-fe7c9859aad5/Giants-win-2014-World-Series.m3u8',
];
let hlsSrc;
let hls;
let captionOutput;

const getRandomSrc = () => {
    return hlsSources[Math.floor(Math.random() * hlsSources.length)];
};

const initLoadButton = () => {
    const loadButton = document.querySelector('#loadBtn');
    return loadButton;
};

const initCaptionOutput = () => {
    return document.querySelector('#captionOutput');
};

const initVideo = () => {
    const vid = document.querySelector('video');

    //vid.src = hlsSrc;
    vid.controls = true;
    vid.autoplay = true;
    //vid.muted = true;
    //vid.preload = 'metadata';

    return vid;
};

const getHls = (config = { enableWebVTT: true }) => {
    const newHls = new window.Hls(config);
    return newHls;
};

const initHls = (videoEl) => {
    if (hls) {
        hls.destroy();
    }
    return getHls();
};

const loadHlsSource = (videoEl, hlsSrc) => {
    hls.attachMedia(videoEl);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS media parsed');
        videoEl.currentTime = 3000;
    });
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('HLS media attached');
        hlsSrc = getRandomSrc();
        hls.loadSource(hlsSrc);
    });
    hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, () => {
        console.log('HLS subtitle tracks updated');
        // This monkey business keeps the subtitles displayed if you load another source while they are displayed
        hls.subtitleTrack = -1;
        hls.subtitleTrack = 0;
    });
    hls.on(Hls.Events.SUBTITLE_TRACK_SWITCH, () => {
        console.log('HLS subtitle track switch');
        if (hls.subtitleTrack <= -1) {
            captionOutput.style.display = 'none';
        } else {
            captionOutput.style.display = 'block';
        }
    });
    hls.on(Hls.Events.SUBTITLE_TRACK_LOADED, () => {
        console.log('HLS subtitle tracks loaded');
        const track = videoEl.textTracks[hls.subtitleTrack];
        track.addEventListener('cuechange', (event) => {
            var cue = event.target.activeCues[0];
            if (cue) {
                console.log('cue', cue.text);
                captionOutput.innerHTML = cue.text;
            } else {
                captionOutput.innerHTML = '';
            }
        });
    });
};

const init = () => {
    const autoLoadButton = initLoadButton();
    const vid = initVideo();
    captionOutput = initCaptionOutput();
    hls = initHls(vid);

    autoLoadButton.addEventListener('click', (event) => {
        console.log('load hls source', hlsSrc);
        loadHlsSource(vid, hlsSrc);
    });
};

init();
