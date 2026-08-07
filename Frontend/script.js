/**
 * Document Verification System - Simple JavaScript
 * Internal Office Tool
 */

// ============================================================================
// Application State
// ============================================================================

const AppState = {
    selectedFiles: [],
    parentFolderName: '',
    aspirantFolders: new Set(),
    totalDocuments: 0,
    isProcessing: false,
    uploadedData: null,
    webhookUrl: 'http://localhost:5678/webhook/Documnet-Verification',

    reset() {
        this.selectedFiles = [];
        this.parentFolderName = '';
        this.aspirantFolders.clear();
        this.totalDocuments = 0;
        this.isProcessing = false;
        this.uploadedData = null;
    }
};

// ============================================================================
// Utility Functions
// ============================================================================

function filterValidFiles(files) {
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
    return Array.from(files)
        .filter(file => {
            if (file.name.startsWith('.')) return false;
            const ext = file.name.split('.').pop().toLowerCase();
            return validExtensions.includes(ext);
        })
        .sort((a, b) => {
            const pathA = a.webkitRelativePath || a.name;
            const pathB = b.webkitRelativePath || b.name;
            return pathA.localeCompare(pathB);
        });
}

function getParentFolderName(files) {
    if (files.length === 0) return '';
    const firstPath = files[0].webkitRelativePath || files[0].name;
    const parts = firstPath.split('/');
    return parts.length > 1 ? parts[0] : 'Folder';
}

function extractAspirantFolders(files) {
    const folders = new Set();
    Array.from(files).forEach(file => {
        const path = file.webkitRelativePath || file.name;
        const parts = path.split('/');
        if (parts.length > 2) {
            folders.add(parts[1]);
        }
    });
    return folders;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================================
// UI Manager
// ============================================================================

const UI = {
    showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('hidden');
        }
    },

    hideSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('hidden');
        }
    },

    showFolderInfo() {
        document.getElementById('folderName').textContent = AppState.parentFolderName;
        document.getElementById('aspirantCount').textContent = AppState.aspirantFolders.size;
        document.getElementById('documentCount').textContent = AppState.totalDocuments;
        
        this.showSection('folderInfoSection');
        this.showSection('startSection');
        document.getElementById('startBtn').disabled = false;
    },

    showProgress() {
        this.hideSection('folderInfoSection');
        this.hideSection('startSection');
        this.hideSection('errorSection');
        this.hideSection('successSection');
        this.hideSection('downloadSection');
        this.hideSection('verifyAnotherSection');
        this.showSection('progressSection');
    },

    updateProgress(percentage) {
        const fill = document.getElementById('progressFill');
        const percent = document.getElementById('progressPercentage');
        if (fill) fill.style.width = percentage + '%';
        if (percent) percent.textContent = Math.round(percentage) + '%';
    },

    showSuccess() {
        this.hideSection('progressSection');
        this.showSection('successSection');
        this.showSection('downloadSection');
        this.showSection('verifyAnotherSection');
    },

    showError(message) {
        this.hideSection('progressSection');
        document.getElementById('errorMessage').textContent = escapeHtml(message);
        this.showSection('errorSection');
        this.showSection('verifyAnotherSection');
    },

    reset() {
        this.hideSection('folderInfoSection');
        this.hideSection('startSection');
        this.hideSection('progressSection');
        this.hideSection('errorSection');
        this.hideSection('successSection');
        this.hideSection('downloadSection');
        this.hideSection('verifyAnotherSection');
        this.showSection('uploadSection');
        document.getElementById('startBtn').disabled = true;
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('progressPercentage').textContent = '0%';
    }
};

// ============================================================================
// File Upload Handler
// ============================================================================

const FileHandler = {
    init() {
        const uploadBtn = document.getElementById('uploadBtn');
        const folderInput = document.getElementById('folderInput');

        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => folderInput.click());
        }

        if (folderInput) {
            folderInput.addEventListener('change', (e) => this.handleFolderSelection(e));
        }
    },

    handleFolderSelection(event) {
        const files = event.target.files;
        const validFiles = filterValidFiles(files);

        if (validFiles.length === 0) {
            alert('No valid documents found. Please select a folder containing PDF, JPG, JPEG, PNG, or WebP files.');
            return;
        }

        AppState.selectedFiles = validFiles;
        AppState.parentFolderName = getParentFolderName(validFiles);
        AppState.aspirantFolders = extractAspirantFolders(validFiles);
        AppState.totalDocuments = validFiles.length;

        UI.showFolderInfo();
    }
};

// ============================================================================
// Verification Handler
// ============================================================================

const Verification = {
    init() {
        const startBtn = document.getElementById('startBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const verifyAnotherBtn = document.getElementById('verifyAnotherBtn');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.start());
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.download());
        }

        if (verifyAnotherBtn) {
            verifyAnotherBtn.addEventListener('click', () => this.reset());
        }
    },

    async start() {
        if (AppState.isProcessing) {
            alert('Verification is already in progress');
            return;
        }

        if (AppState.selectedFiles.length === 0) {
            alert('Please select a folder first');
            return;
        }

        AppState.isProcessing = true;
        UI.showProgress();
        UI.updateProgress(10);

        try {
            await this.uploadToWebhook();
        } catch (error) {
            UI.showError(error.message || 'An error occurred during verification');
            AppState.isProcessing = false;
        }
    },

    async uploadToWebhook() {
        // Create manifest
        const manifest = AppState.selectedFiles.map(file => ({
            filename: file.name,
            binaryKey: file.webkitRelativePath || file.name,
            folderId: this.extractAspirantId(file),
            relativePath: file.webkitRelativePath || file.name
        }));

        UI.updateProgress(20);

        // Create FormData
        const formData = new FormData();
        formData.append('manifest', JSON.stringify(manifest));

        // Add files
        AppState.selectedFiles.forEach((file) => {
            const binaryKey = file.webkitRelativePath || file.name;
            formData.append(binaryKey, file, file.name);
        });

        UI.updateProgress(40);

        // Send to webhook
        const response = await fetch(AppState.webhookUrl, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        UI.updateProgress(70);

        // Handle response
        const contentType = response.headers.get('content-type');
        let blob = null;

        if (contentType && contentType.includes('application/vnd.openxmlformats')) {
            blob = await response.blob();
        } else if (contentType && contentType.includes('application/json')) {
            const jsonData = await response.json();
            if (jsonData.error) {
                throw new Error(jsonData.error.message || 'Verification failed');
            }
            blob = await response.blob();
        } else {
            blob = await response.blob();
        }

        AppState.uploadedData = blob;
        UI.updateProgress(100);

        setTimeout(() => {
            UI.showSuccess();
            AppState.isProcessing = false;
        }, 300);
    },

    extractAspirantId(file) {
        const path = file.webkitRelativePath || file.name;
        const parts = path.split('/');
        return parts.length > 1 ? parts[1] : 'unknown';
    },

    download() {
        if (!AppState.uploadedData) {
            alert('Report is not available');
            return;
        }

        const url = window.URL.createObjectURL(AppState.uploadedData);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Verification_Report_${AppState.parentFolderName}_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },

    reset() {
        const folderInput = document.getElementById('folderInput');
        if (folderInput) {
            folderInput.value = '';
        }
        AppState.reset();
        UI.reset();
    }
};

// ============================================================================
// Application Initialization
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    FileHandler.init();
    Verification.init();
});