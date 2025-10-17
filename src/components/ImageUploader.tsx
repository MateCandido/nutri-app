import { useState, useRef } from 'react'
import styles from './ImageUploader.module.css'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
}

export const ImageUploader = ({ onImageSelect }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImageSelect(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleAreaClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={styles.uploaderContainer} onClick={handleAreaClick}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className={styles.hiddenInput} 
        aria-label="File upload" 
      />
      {preview ? (
        <img src={preview} alt="Image preview" className={styles.previewImage} />
      ) : (
        <div className={styles.placeholder}>
          <p>Click or drag & drop an image here</p>
          <span>📷</span>
        </div>
      )}
    </div>
  )
}