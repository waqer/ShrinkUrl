import React, { useState } from 'react';
import URLList from './URLList';

function App() {
  const [showList, setShowList] = useState(false);
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [suffix, setSuffix] = useState('.com');
  const [autoFix, setAutoFix] = useState(true);

  // Normalize URL before sending to backend
  const normalizeUrl = (input) => {
    let url = input.trim();

    if (!autoFix) return url;

    // If URL already has protocol, leave as-is
    if (/^https?:\/\//.test(url)) return url;

    // Remove trailing slash if any
    url = url.replace(/\/$/, '');

    // Add suffix only if bare domain (no path) and missing .com/.org/.net
    if (!url.includes('/') && !url.match(/\.(com|org|net)$/)) {
      url += suffix;
    }

    // Add protocol
    url = 'https://' + url;

    return url;
  };

  const handleShorten = async (urlToShorten) => {
    if (!urlToShorten.trim()) return;
    try {
      const response = await fetch('http://localhost:5000/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ long_url: urlToShorten }),
      });
      const data = await response.json();
      setShortUrl(data.short_url);
    } catch (err) {
      console.error('Failed to shorten URL:', err);
      alert('Failed to shorten URL');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">ShrinkURL</h1>

      {/* Toggle dashboard */}
      <div className="text-center mb-4">
        <button
          className="btn btn-primary"
          onClick={() => setShowList(!showList)}
        >
          {showList ? 'Create New Link' : 'View All Links'}
        </button>
      </div>

      {showList ? (
        <URLList />
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-8">
            {/* Auto-fix checkbox */}
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="autoFix"
                checked={autoFix}
                onChange={(e) => setAutoFix(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="autoFix">
                Auto-add https:// and .com/.org/.net if missing
              </label>
            </div>

            {/* Input group with prefix & suffix */}
            {autoFix ? (
              <div className="d-flex gap-2 mb-2">
                {/* Prefix dropdown */}
                <select
                  className="form-select"
                  style={{ maxWidth: 120 }}
                  value={longUrl.startsWith('https://') ? 'https://' : 'http://'}
                  onChange={(e) =>
                    setLongUrl(e.target.value + longUrl.replace(/^https?:\/\//, ''))
                  }
                >
                  <option value="http://">http://</option>
                  <option value="https://">https://</option>
                </select>

                {/* Main input */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter website name or path"
                  value={longUrl.replace(/^https?:\/\//, '').replace(/(\.com|\.org|\.net)$/, '')}
                  onChange={(e) =>
                    setLongUrl(
                      (longUrl.startsWith('https://') ? 'https://' : 'http://') +
                      e.target.value +
                      suffix
                    )
                  }
                />

                {/* Suffix dropdown */}
                <select
                  className="form-select"
                  style={{ maxWidth: 100 }}
                  value={suffix}
                  onChange={(e) => {
                    setSuffix(e.target.value);
                    // Only replace if it was a bare domain
                    setLongUrl(longUrl.replace(/(\.com|\.org|\.net)$/, e.target.value));
                  }}
                >
                  <option value=".com">.com</option>
                  <option value=".org">.org</option>
                  <option value=".net">.net</option>
                </select>
              </div>
            ) : (
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Paste full URL here"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
              />
            )}

            {/* Paste button centered */}
            <div className="text-center mb-3">
              <button
                className="btn btn-warning d-flex align-items-center justify-content-center"
                style={{ gap: '6px' }}
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setLongUrl(text);
                  } catch (err) {
                    console.error('Failed to read clipboard:', err);
                    alert('Unable to access clipboard');
                  }
                }}
              >
                📋 Paste from Clipboard
              </button>
            </div>

            {/* Shorten button centered */}
            <div className="text-center mb-3">
              <button
                className="btn btn-success"
                type="button"
                disabled={!longUrl.trim()}
                onClick={() => {
                  const urlToShorten = normalizeUrl(longUrl);
                  setLongUrl(urlToShorten);
                  handleShorten(urlToShorten);
                }}
              >
                Shorten
              </button>
            </div>

            {/* Display short URL */}
            {shortUrl && (
              <div className="alert alert-info d-flex justify-content-between align-items-center">
                <span>
                  Short URL:{' '}
                  <a href={shortUrl} target="_blank" rel="noreferrer">
                    {shortUrl}
                  </a>
                </span>
                <button
                  className="btn btn-outline-dark btn-sm"
                  disabled={!shortUrl}
                  onClick={() => navigator.clipboard.writeText(shortUrl)}
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;