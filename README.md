# Webcam Security Awareness 

<div align="center">
  <h3>Stealth Webcam Access Without User Permission</h3>
  <p><strong>Ethical Hacking Practice | Information Security Assignment</strong></p>
</div>

##  Team Information

| **Group Name** | Cyber Defender |
|----------------|-----------------|
| **Student** | Rimsha |
| **Roll No** | 23F-0583 |
| **Course** | Information Security |

---

##  Project Overview

This project demonstrates a critical security vulnerability in modern web browsers where malicious websites can potentially access hardware devices (specifically webcams) without explicit user permission. The application serves as an educational tool to understand browser permission models, media stream APIs, and the importance of security awareness when granting hardware access to websites.

---

##  Objectives

| # | Objective | Status |
|---|-----------|--------|
| 1 | Create an interactive landing page with group information |  Completed |
| 2 | Automated webcam capture simulation |  Completed |
| 3 | Continuous recording in 10-second segments |  Completed |
| 4 | Local Storage implementation (Phase 1) |  Completed |
| 5 | Google Drive cloud storage (Phase 2) |  Completed |
| 6 | Security awareness warning system |  Completed |

---

##  Features

-  **Automated Webcam Access** - Camera activates with single click
-  **Continuous Recording** - Auto-records every 10 seconds
-  **Local Storage** - Videos saved in browser storage
-  **Cloud Upload** - Automatic upload to Google Drive
-  **Security Warning** - Educational message about vulnerabilities
-  **Device Info Display** - Shows browser and system details
-  **Download Option** - Save videos locally
-  **Modern UI** - Professional gradient design with animations

---

##  Technologies Used

### Frontend
- **HTML5** - Structure and content
- **CSS3** - Styling, animations, responsive design
- **JavaScript (ES6)** - Client-side functionality
- **MediaDevices API** - Webcam access
- **MediaRecorder API** - Video recording
- **LocalStorage API** - Client-side storage

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **Google APIs** - Google Drive integration
- **OAuth 2.0** - Authentication for Google services

### Cloud Storage
- **Google Drive API** - Cloud storage for recorded videos

---

##  Project Structure
webcam-security-demo

├──  server.js # Backend server (Node.js/Express)

├──  script.js # Frontend JavaScript logic

├──  index.html # Main webpage structure

├──  style.css # Styling and animations

├──  package.json # Dependencies and scripts

├──  README.md # Project documentation

---

##  Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Google Account](https://accounts.google.com/) (for Drive API)
- Modern browser (Chrome, Firefox, Edge)

---

## How to Get Google Drive API Credentials:
- Go to Google Cloud Console
- Create a new project
- Enable Google Drive API
- Create OAuth 2.0 credentials
- Get refresh token from OAuth playground

## How It Works
- User Click "Start Camera"
- Camera Permission
- Continuous Recording (10s segments)
- Save to LocalStorage (Phase 1)
- Upload to Google Drive (Phase 2)
-  Security Warning Displayed

## Technical Flow
- Camera Access: navigator.mediaDevices.getUserMedia() requests webcam
- Recording: MediaRecorder API captures 10-second segments
- Local Storage: Videos converted to DataURL and saved
- Server Upload: Frontend sends data to /upload-to-drive endpoint
- Google Drive: Server processes and uploads to cloud
- Warning: Educational message about security implications

## Usage Guide
- Open the website at http://localhost:5500
- Click "Start Camera" button in demo section
- Allow camera permission when prompted by browser
- Recording starts automatically (10-second segments)
- Observe the continuous recording indicator in top-right
- Videos save locally to recordings/ folder
- Videos upload to Google Drive automatically
- Read security warning that appears after first segment
- Click "Stop Recording" to end the demonstration
- Download videos using the download button

## How to Protect Yourself
### For Users
#### Check browser permissions regularly
- Chrome: Settings → Privacy → Site Settings → Camera
- Firefox: Options → Privacy → Permissions → Camera
#### Use physical camera covers - 100% effective
#### Revoke unused permissions immediately
#### Keep browsers updated for security patches
#### Be skeptical - Question why a website needs camera access
#### Use browser extensions like "Camera Blocker"

### For Developers
#### Request permissions contextually - Explain why
#### Implement timeouts - Release camera when not in use
#### Add visual indicators when camera is active
#### Store data securely - Encrypt sensitive information
#### Educate users - Include clear privacy policies

## Phases of Project
### Phase 1: Local Storage
- Videos saved to browser's LocalStorage
- Immediate access and playback
- Download option available
- Works offline

## Phase 2: Google Drive Cloud Storage
- Automatic upload to Google Drive
- Public shareable links generated
- Permanent cloud storage
- Access from anywhere

## Educational Purpose
### IMPORTANT DISCLAIMER

This project is created strictly for educational purposes as part of an Information Security assignment. It demonstrates:

- How browsers handle hardware permissions
- Potential security risks of granting permissions
- Importance of security awareness for users

Ethical Guidelines Followed:
- Explicit warnings displayed to users
- User must click to start camera
- Educational context only
- Data stored securely








