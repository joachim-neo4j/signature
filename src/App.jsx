import { useState } from 'react'
import { SunIcon, MoonIcon, XIcon, TrashIcon } from '@primer/octicons-react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    name: 'Virginia Barasch',
    title: 'VP Corporate Marketing',
    company: '',
    phone: '415-203-0130',
    companyWebsite: 'https://neo4j.com',
    logoUrl: 'https://neo4j.design/uploads/ZZB8GGIkd2qFYSPLQth_Vw.png',
    additionalLinks: [
      { id: 1, label: 'LinkedIn', url: '' },
      { id: 2, label: 'Twitter', url: '' }
    ]
  })
  
  const [darkMode, setDarkMode] = useState(false)
  const [copied, setCopied] = useState(false)

  // Generate HTML signature with inline styles only
  const generateSignatureHTML = () => {
    const { name, title, company, phone, companyWebsite, logoUrl, additionalLinks } = formData
    
    let socialLinks = []
    additionalLinks.forEach(link => {
      if (link.url && link.label) {
        const url = link.url.startsWith('http') ? link.url : `https://${link.url.replace(/^\/+|\/+$/g, '')}`
        socialLinks.push(`<a href="${url}" style="font-size: 13px; line-height: 1.6; text-decoration: underline;">${link.label}</a>`)
      }
    })
    
    return `<!-- Email Signature -->
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #000000; max-width: 600px; border-collapse: collapse;">
  <tr>
    <td style="padding: 0; vertical-align: top;">
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 0 0 4px 0; font-size: 15px; font-weight: 600; color: #000000; line-height: 1.5;">${name || 'Your Name'}</td>
        </tr>
        <tr>
          <td style="padding: 0 0 4px 0; font-size: 13px; font-weight: 400; color: #000000; line-height: 1.5;">${title || 'Your Title'}</td>
        </tr>
        ${phone ? `<tr><td style="padding: 0 0 12px 0; font-size: 13px; font-weight: 400; color: #000000; line-height: 1.6;">${phone}</td></tr>` : ''}
        ${logoUrl ? `<tr><td style="padding: ${phone ? '0 0 8px 0' : '8px 0 8px 0'};"><img src="${logoUrl}" alt="${company || 'Company'}" style="max-width: 80px; height: auto; border: 0;" /></td></tr>` : ''}
        ${companyWebsite ? `<tr><td style="padding: 0 0 4px 0; font-size: 13px; font-weight: 400; line-height: 1.6;"><a href="${companyWebsite}" style="text-decoration: underline;">${companyWebsite}</a></td></tr>` : ''}
        ${socialLinks.length > 0 ? `<tr><td style="padding: 0; font-size: 13px; font-weight: 400; line-height: 1.6;">${socialLinks.join(', ')}</td></tr>` : ''}
      </table>
    </td>
  </tr>
</table>`
  }

  const handleCopy = async () => {
    const html = generateSignatureHTML()
    try {
      // Try to write HTML with MIME type first (modern browsers)
      if (navigator.clipboard && navigator.clipboard.write && typeof ClipboardItem !== 'undefined') {
        try {
          const clipboardItem = new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([html], { type: 'text/plain' })
          })
          await navigator.clipboard.write([clipboardItem])
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
          return
        } catch (clipboardErr) {
          // ClipboardItem failed, fall through to text fallback
        }
      }
    } catch (err) {
      // Fall through to text fallback
    }
    
    // Fallback: write as plain text
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(html)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return
      }
    } catch (err) {
      // Continue to final fallback
    }
    
    // Final fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = html
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    textArea.style.left = '-9999px'
    textArea.style.top = '0'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      const successful = document.execCommand('copy')
      if (successful) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (e) {
      console.error('Failed to copy:', e)
    }
    document.body.removeChild(textArea)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const clearField = (field) => {
    setFormData(prev => ({ ...prev, [field]: '' }))
  }

  const handleLinkChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      additionalLinks: prev.additionalLinks.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    }))
  }

  const addLinkRow = () => {
    setFormData(prev => ({
      ...prev,
      additionalLinks: [
        ...prev.additionalLinks,
        { id: Date.now(), label: '', url: '' }
      ]
    }))
  }

  const removeLinkRow = (id) => {
    setFormData(prev => ({
      ...prev,
      additionalLinks: prev.additionalLinks.filter(link => link.id !== id)
    }))
  }

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="container">
        <div className="content-grid">
          {/* Form Section */}
          <section className="form-section">
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Name"
                />
                {formData.name && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => clearField('name')}
                    aria-label="Clear name"
                  >
                    <XIcon className="icon" size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Title"
                />
                {formData.title && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => clearField('title')}
                    aria-label="Clear title"
                  >
                    <XIcon className="icon" size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Phone"
                />
                {formData.phone && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => clearField('phone')}
                    aria-label="Clear phone"
                  >
                    <XIcon className="icon" size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  id="companyWebsite"
                  type="url"
                  value={formData.companyWebsite}
                  onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                  placeholder="Company Website"
                />
                {formData.companyWebsite && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => clearField('companyWebsite')}
                    aria-label="Clear website"
                  >
                    <XIcon className="icon" size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="links-section">
                {formData.additionalLinks.map((link, index) => (
                  <div key={link.id} className="link-row">
                    <div className="input-wrapper link-input">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleLinkChange(link.id, 'label', e.target.value)}
                        placeholder="Label (e.g., LinkedIn)"
                      />
                    </div>
                    <div className="input-wrapper link-input">
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                        placeholder="URL"
                      />
                    </div>
                    <button
                      type="button"
                      className="remove-link-btn"
                      onClick={() => removeLinkRow(link.id)}
                      aria-label="Remove link"
                    >
                      <TrashIcon className="icon" size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-link-link"
                  onClick={addLinkRow}
                  aria-label="Add additional link"
                >
                  Add additional link
                </button>
              </div>
            </div>
          </section>

          {/* Preview Section */}
          <section className="preview-section">
            <div className="preview-container">
              <button
                className="theme-toggle"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle theme"
              >
                <span className={`toggle-segment ${!darkMode ? 'active' : ''}`}>
                  <SunIcon className="icon" size={16} />
                </span>
                <span className={`toggle-segment ${darkMode ? 'active' : ''}`}>
                  <MoonIcon className="icon" size={16} />
                </span>
              </button>
              <div
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: generateSignatureHTML() }}
              />
            </div>
            <div className="button-group">
              <button
                className="btn btn-primary"
                onClick={handleCopy}
              >
                {copied ? '✓ Copied!' : 'Copy HTML Signature'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default App
