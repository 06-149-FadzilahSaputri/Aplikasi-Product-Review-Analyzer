import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [productName, setProductName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/analyze-review', {
        product_name: productName,
        review_text: reviewText
      })
      
      setResult(response.data)
    } catch (err) {
      console.error(err)
      setError('Gagal menganalisis. Pastikan Backend (Port 8000) sudah nyala!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-wrapper">
      {/* --- HEADER --- */}
      <header className="main-header">
        <div className="logo-section">
          <div className="logo-container">
            <img src="/logo.png" alt="App Logo" className="app-logo-img" />
          </div>
          <h1>Product Review Analyzer</h1>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="main-container">
        <div className="card input-card">
          <div className="card-header">
            <div className="icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </div>
            <h2>Analyze Product Review</h2>
          </div>

          <form onSubmit={handleAnalyze}>
            <div className="form-group">
              <label>Product Name</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name..."
                required 
              />
            </div>

            <div className="form-group">
              <label>Product Review</label>
              <textarea 
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Paste or type the product review here..."
                rows="6"
                required
              />
              <p className="helper-text">Minimum 50 characters</p>
            </div>

            <button type="submit" disabled={loading} className="analyze-btn">
              {loading ? (
                'Analyzing...'
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="btn-icon">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                  </svg>
                  Analyze Review
                </>
              )}
            </button>
          </form>
          {error && <p className="error-msg">{error}</p>}
        </div>

        {/* --- RESULT SECTION --- */}
        {result && (
          <div className="card result-card">
            <div className="result-header">
              <h3>Analysis Result</h3>
              <span className={`sentiment-tag ${result.sentiment}`}>
                {result.sentiment}
              </span>
            </div>
            
            <div className="key-points-box">
              <h4>Key Points (AI Generated):</h4>
              <div className="points-list">
                {result.key_points.split('\n').map((line, i) => (
                   line.trim() && <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- FOOTER BARU --- */}
      <footer className="app-footer">
        <p>© 2025 Product Review Analyzer. Created by <strong>Fadzilah Saputri</strong></p>
      </footer>

    </div>
  )
}

export default App