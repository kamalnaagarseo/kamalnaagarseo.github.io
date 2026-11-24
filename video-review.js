/* Local-only recording preview. No network upload; no stored recordings. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const live = $('vr-live'), playback = $('vr-playback'), placeholder = $('vr-placeholder');
  if (!live || !navigator.mediaDevices || !window.MediaRecorder) {
    if ($('vr-status')) $('vr-status').textContent = 'This browser does not support in-page camera recording. Try an updated Chrome, Edge, Firefox or Safari browser over HTTPS.';
    if ($('vr-open')) $('vr-open').disabled = true;
    return;
  }
  const open = $('vr-open'), start = $('vr-start'), stop = $('vr-stop'), again = $('vr-again');
  const time = $('vr-time'), status = $('vr-status');
  let stream = null, recorder = null, chunks = [], blobUrl = null, tick = null, autoStop = null, started = 0;
  const MAX_SECONDS = 90;
  const stamp = secs => `${String(Math.floor(secs/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`;
  function message(str) { status.textContent = str; }
  function clearTimers(){ if(tick)clearInterval(tick);if(autoStop)clearTimeout(autoStop);tick=null;autoStop=null; }
  function endTracks(){ if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}live.srcObject=null; }
  function dropPlayback(){ if(blobUrl){URL.revokeObjectURL(blobUrl);blobUrl=null;}playback.pause();playback.removeAttribute('src');playback.load();playback.hidden=true; }
  function mime(){return ['video/webm;codecs=vp8,opus','video/webm','video/mp4'].find(m=>MediaRecorder.isTypeSupported(m))||'';}
  async function openCamera(){
    open.disabled=true;again.hidden=true;dropPlayback();chunks=[];
    try {
      if(stream)endTracks();
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:'user',width:{ideal:1280},height:{ideal:720} }, audio: { echoCancellation:true,noiseSuppression:true } });
      live.srcObject=stream;live.hidden=false;placeholder.hidden=true;
      try {await live.play();}catch(e){}
      start.disabled=false;stop.disabled=true;time.hidden=true;
      message('Camera is ready. Press Start Recording when you are comfortable.');
    } catch(e) {
      live.hidden=true;placeholder.hidden=false;
      message(e?.name==='NotAllowedError'?'Camera permission was denied. Allow camera and microphone access in your browser settings.':`Camera unavailable (${e?.name||'unknown error'}). Check permissions and devices.`);
    } finally {open.disabled=false;}
  }
  function stopRecording(){if(recorder?.state==='recording')recorder.stop();}
  function startRecording(){
    if(!stream || !stream.active) {message('Please open the camera first.');return;}
    try {
      const selected=mime();recorder= selected ? new MediaRecorder(stream,{mimeType:selected,videoBitsPerSecond:1500000}) : new MediaRecorder(stream);
      chunks=[];
      recorder.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data);};
      recorder.onerror=()=>{clearTimers();endTracks();message('Recording failed. Please try again.');start.disabled=true;stop.disabled=true;};
      recorder.onstop=()=>{
        clearTimers();const length=Math.min(MAX_SECONDS,Math.floor((Date.now()-started)/1000));
        const video = new Blob(chunks,{type:recorder.mimeType || 'video/webm'});chunks=[];endTracks();live.hidden=true;
        if(!video.size){message('No video was recorded. Please re-record.');placeholder.hidden=false;open.disabled=false;return;}
        blobUrl=URL.createObjectURL(video);playback.src=blobUrl;playback.hidden=false;placeholder.hidden=true;
        start.disabled=true;stop.disabled=true;again.hidden=false;open.disabled=true;time.hidden=true;
        const sizeMB=(video.size/1048576).toFixed(1);
        message(`Preview ready — ${stamp(length)} · ${sizeMB} MB. This recording stays in your browser; it has not been submitted.`);
        if(video.size > 50*1048576) message(`Preview ready, but this recording is ${sizeMB} MB. A future secure upload limit will be 50 MB. Try a shorter take.`);
      };
      recorder.start(250);started=Date.now();time.hidden=false;time.textContent=`00:00 / ${stamp(MAX_SECONDS)}`;
      start.disabled=true;stop.disabled=false;open.disabled=true;again.hidden=true;
      message('Recording in progress. Stop at any time. It automatically stops after 90 seconds.');
      tick=setInterval(()=>{const elapsed=Math.min(MAX_SECONDS,Math.floor((Date.now()-started)/1000));time.textContent=`${stamp(elapsed)} / ${stamp(MAX_SECONDS)}`;},250);
      autoStop=setTimeout(stopRecording,MAX_SECONDS*1000);
    } catch(e){ message('Unable to start recording on this device. Try another browser.');start.disabled=false; }
  }
  open.addEventListener('click',openCamera);
  start.addEventListener('click',startRecording);
  stop.addEventListener('click',stopRecording);
  again.addEventListener('click',()=>{again.hidden=true;open.disabled=false;openCamera();});
  window.addEventListener('pagehide',()=>{clearTimers();if(recorder?.state==='recording')recorder.stop();endTracks();dropPlayback();});
})();
/*
 * Kamal Naagar SEO
 * Turnstile + D1 Reservation Test
 * No video upload in this stage.
 */

(() => {
  "use strict";

  const API =
    "https://kamal-seo-video-testimonials.kamalnaagar2020.workers.dev";

  const button = document.getElementById(
    "vr-test-reservation"
  );

  const result = document.getElementById(
    "vr-test-result"
  );

  const emailInput = document.getElementById(
    "vr-email"
  );

  if (!button || !result || !emailInput) return;

  let busy = false;

  function show(message) {
    result.textContent = message;
  }

  button.addEventListener("click", async () => {
    if (busy) return;

    const email = emailInput.value.trim();

    if (!email || !emailInput.checkValidity()) {
      show("Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    if (!window.turnstile) {
      show("Security check is still loading. Please try again.");
      return;
    }

    const widget = document.querySelector(
      "#vr-security-test .cf-turnstile"
    );

    const token = window.turnstile.getResponse(widget);

    if (!token) {
      show("Please complete the security verification first.");
      return;
    }

    busy = true;
    button.disabled = true;

    show("Verifying and creating test reservation...");

    try {
      const response = await fetch(
        API + "/preflight",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            token: token
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        show(
          "Test successful! Reservation created. " +
          "Status: " + data.status +
          ". No video has been uploaded."
        );
      } else {
        show(
          "Test failed: " +
          (data.message || "Unknown error")
        );
      }

    } catch (error) {
      show(
        "Connection failed. Please check your internet connection."
      );
    } finally {
      busy = false;
      button.disabled = false;

      try {
        window.turnstile.reset(widget);
      } catch (error) {
        // Widget may not be available.
      }
    }
  });
})();

