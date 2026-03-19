const express = require('express');
const serverless = require('serverless-http');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));

// Google Drive Config
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

// OAuth2 Setup
let drive = null;
try {
    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    drive = google.drive({ version: 'v3', auth: oauth2Client });
    console.log('✅ Google Drive configured');
} catch (error) {
    console.error('❌ Drive config error:', error.message);
}

// Helper Functions
function dataURLToBuffer(dataURL) {
    const matches = dataURL.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid data URL');
    return Buffer.from(matches[2], 'base64');
}

async function uploadToGoogleDrive(videoBuffer, fileName) {
    if (!drive) return { success: false, message: 'Drive not configured' };

    try {
        const tempFilePath = '/tmp/' + fileName;
        fs.writeFileSync(tempFilePath, videoBuffer);

        const response = await drive.files.create({
            requestBody: { name: fileName, mimeType: 'video/webm' },
            media: { body: fs.createReadStream(tempFilePath) },
            fields: 'id, name, webViewLink'
        });

        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: { role: 'reader', type: 'anyone' }
        });

        fs.unlinkSync(tempFilePath);
        return { success: true, id: response.data.id, webViewLink: response.data.webViewLink };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Routes
app.post('/.netlify/functions/api/upload', async (req, res) => {
    try {
        const { video, fileName } = req.body;
        if (!video) return res.status(400).json({ error: 'No video data' });

        const videoBuffer = dataURLToBuffer(video);
        const result = await uploadToGoogleDrive(videoBuffer, fileName);
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/.netlify/functions/api/test', (req, res) => {
    res.json({ success: true, message: 'API working!' });
});

// Export for Netlify Function
exports.handler = serverless(app);