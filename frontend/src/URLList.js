import React, { useState, useEffect } from 'react';

function URLList() {
  const [urls, setUrls] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUrls = () => {
    fetch('http://localhost:5000/urls')
      .then(res => res.json())
      .then(data => setUrls(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching URLs:', err));
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;
    try {
      const res = await fetch(`http://localhost:5000/urls/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) fetchUrls();
      else alert(data.error);
    } catch (err) {
      console.error(err);
      alert('Failed to delete URL');
    }
  };

  const filtered = urls.filter(u =>
    u.long_url.toLowerCase().includes(search.toLowerCase()) ||
    u.short_url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by original or short link..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Short URL</th>
            <th>Original URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td><a href={u.short_url} target="_blank" rel="noreferrer">{u.short_url}</a></td>
              <td><a href={u.long_url} target="_blank" rel="noreferrer">{u.long_url}</a></td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">No URLs found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default URLList;
