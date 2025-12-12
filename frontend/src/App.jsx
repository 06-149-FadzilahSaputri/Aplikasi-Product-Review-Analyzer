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
      // Mengirim data ke Backend Python
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
    <div className="container">
      <h1>🚀 Product Review Analyzer</h1>
      <p className="subtitle">Powered by Gemini & Hugging Face</p>

      <div className="card input-section">
        <form onSubmit={handleAnalyze}>
          <div className="form-group">
            <label>Nama Produk</label>
            <input 
              type="text" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Contoh: iPhone 15, Skincare X..."
              required 
            />
          </div>

          <div className="form-group">
            <label>Review Customer</label>
            <textarea 
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Paste review panjang di sini..."
              rows="5"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Sedang Menganalisis AI...' : 'Analyze Review'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      {result && (
        <div className="card result-section">
          <h2>📊 Hasil Analisis</h2>
          
          <div className={`sentiment-badge ${result.sentiment}`}>
            Sentiment: <strong>{result.sentiment}</strong>
          </div>

          <div className="key-points">
            <h3>📝 Key Points (by Gemini):</h3>
            <div className="markdown-content">
              {result.key_points.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App