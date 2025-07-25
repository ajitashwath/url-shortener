# URL Shortener
A simple URL shortener application built with Node.js, Express, and JavaScript. Create short, manageable links from long URLs with a clean, modern interface.

## Features

- ✨ **Shorten URLs**: Convert long URLs into short, manageable links
- 📊 **Click Tracking**: Monitor how many times your shortened URLs are accessed
- ✏️ **Edit URLs**: Update the destination of existing short links
- 🗑️ **Delete URLs**: Remove shortened URLs when no longer needed
- 📋 **Copy to Clipboard**: Quickly copy shortened URLs with one click
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS
- 🚀 **Fast & Lightweight**: Minimal dependencies, maximum performance

## Tech Stack
- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3 (Tailwind), Vanilla JavaScript
- **ID Generation**: nanoid for generating short codes
- **Storage**: In-memory storage (perfect for development/testing)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ajitashwath/url-shortener.git
   cd url-shortener
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   node server.js
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Web Interface

1. **Shorten a URL**:
   - Enter a long URL in the input field
   - Click "Shorten" button
   - Your shortened URL will appear in the results section

2. **Manage URLs**:
   - **Copy**: Click the "Copy" button to copy the short URL to clipboard
   - **Update**: Click "Update" to change where the short URL redirects
   - **Delete**: Click "Delete" to remove the shortened URL
   - **View Stats**: See click counts for each shortened URL

### API Endpoints

The application provides a REST API for programmatic access:

#### Create Short URL
```http
POST /shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url"
}
```

#### Redirect to Original URL
```http
GET /:shortCode
```

#### Get URL Info
```http
GET /shorten/:shortCode
```

#### Update URL
```http
PUT /shorten/:shortCode
Content-Type: application/json

{
  "url": "https://new-destination.com"
}
```

#### Delete URL
```http
DELETE /shorten/:shortCode
```

#### Get URL Statistics
```http
GET /shorten/:shortCode/stats
```

## File Structure

```
url-shortener/
├── index.html          # Main web interface
├── script.js           # Frontend JavaScript
├── server.js           # Express server and API
├── package.json        # Node.js dependencies
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request
