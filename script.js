const API_BASE_URL = 'http://localhost:3000';
const shortenForm = document.getElementById('shorten-form');
const urlInput = document.getElementById('url-input');
const resultsSection = document.getElementById('results-section');
const resultsContainer = document.getElementById('results-container');
const toast = document.getElementById('toast');

let shortenedLinks = [];

/**
 * @param {string} message 
 * @param {boolean} isError
 */
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.className = `toast show ${isError ? 'bg-red-600' : 'bg-green-600'}`;
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}

function renderLinks() {
    resultsContainer.innerHTML = '';
    if (shortenedLinks.length > 0) {
        resultsSection.classList.remove('hidden');
    } else {
        resultsSection.classList.add('hidden');
    }

    shortenedLinks.forEach(link => {
        const linkCard = document.createElement('div');
        linkCard.className = 'p-4 border border-slate-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4';
        const shortUrl = `${API_BASE_URL}/${link.shortCode}`;

        linkCard.innerHTML = `
            <div class="flex-grow">
                <p class="text-slate-500 text-sm break-all">Original: ${link.url}</p>
                <a href="${shortUrl}" target="_blank" class="text-blue-600 font-semibold text-lg hover:underline">${shortUrl}</a>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-sm text-slate-500 mr-2">Clicks: ${link.accessCount}</span>
                <button onclick="copyToClipboard('${shortUrl}')" class="bg-slate-200 text-slate-700 px-3 py-1 rounded-md hover:bg-slate-300 text-sm">Copy</button>
                <button onclick="updateUrl('${link.shortCode}')" class="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-md hover:bg-yellow-500 text-sm">Update</button>
                <button onclick="deleteUrl('${link.shortCode}')" class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm">Delete</button>
            </div>
        `;
        resultsContainer.appendChild(linkCard);
    });
}

shortenForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const longUrl = urlInput.value;
    try {
        const response = await fetch(`${API_BASE_URL}/shorten`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: longUrl }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to shorten URL');
        }

        const newLink = await response.json();
        shortenedLinks.unshift(newLink);
        renderLinks();
        urlInput.value = '';
        showToast('URL shortened successfully!');

    } catch (error) {
        showToast(error.message, true);
    }
});

/**
 * @param {string} text
 */
function copyToClipboard(text) {
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = text;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
    showToast('Copied to clipboard!');
}

/**
 * @param {string} shortCode 
 */
async function updateUrl(shortCode) {
    const newUrl = prompt('Enter the new URL:');
    if (!newUrl) return;
    try {
        const response = await fetch(`${API_BASE_URL}/shorten/${shortCode}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: newUrl }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update URL');
        }
        const updatedLink = await response.json();
        const linkIndex = shortenedLinks.findIndex(link => link.shortCode === shortCode);
        if (linkIndex !== -1) {
            shortenedLinks[linkIndex] = updatedLink;
        }
        renderLinks();
        showToast('URL updated successfully!');

    } catch (error) {
        showToast(error.message, true);
    }
}

/**
 * @param {string} shortCode
 */
async function deleteUrl(shortCode) {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/shorten/${shortCode}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete URL');
        }

        shortenedLinks = shortenedLinks.filter(link => link.shortCode !== shortCode);
        renderLinks();
        showToast('URL deleted successfully!');

    } catch (error) {
        showToast(error.message, true);
    }
}