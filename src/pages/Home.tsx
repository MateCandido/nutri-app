import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { SearchBox } from '../components/SearchBox'
import { NutritionCard } from '../components/NutritionCard'
import { ImageUploader } from '../components/ImageUploader'
import type { IApiResponse } from '../interfaces/NutritionData'

async function fileToGenerativePart(file: File) {
  const reader = new FileReader()
  const result = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
  return {
    inlineData: {
      data: (result as string).split(",")[1],
      mimeType: file.type,
    },
  }
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
const jsonPrompt = `
  Respond ONLY with a valid JSON object matching this TypeScript interface:

  interface INutritionData {
    calories: string; // e.g., "54 kcal"
    protein: string; // e.g., "1.1 g"
    carbohydrates_total: string; // e.g., "13.6 g"
    carbohydrates_sugars?: string;
    carbohydrates_fiber?: string;
    fat_total: string;
  }
  interface IApiResponse {
      food_name: string;
      serving_size?: string;
      nutrition: INutritionData;
  }

  Do not include any introductory text, concluding text, markdown formatting like \`\`\`json, or anything outside the JSON structure.
  Your entire response must be ONLY the JSON object itself, starting with { and ending with }.
`;


export const Home = () => {
  const [mode, setMode] = useState<'text' | 'image'>('text')
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState<IApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const processApiResponse = (rawText: string) => {
    if (!rawText) {
      throw new Error("The AI returned an empty response.")
    }
    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '')
    const parsedData: IApiResponse = JSON.parse(cleanText)
    setResponse(parsedData)
  }

  const runTextQuery = async () => {
    if (!prompt) return
    setIsLoading(true)
    setResponse(null)
    setError(null)
    const fullPrompt = `Analyze the food item: "${prompt}". Provide approximate nutritional data. ${jsonPrompt}`
    try {
      const result = await model.generateContent(fullPrompt)
      processApiResponse(result.response.text())
    } catch (apiError) {
      console.error("API Error (Text):", apiError)
      setError("Failed to get data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const runImageQuery = async () => {
    if (!imageFile) return
    setIsLoading(true)
    setResponse(null)
    setError(null)
    try {
      const imagePart = await fileToGenerativePart(imageFile)
      const fullPrompt = `Analyze the food in this image. Provide approximate nutritional data. ${jsonPrompt}`
      const promptParts = [fullPrompt, imagePart]
      const result = await model.generateContent(promptParts)
      processApiResponse(result.response.text())
    } catch (apiError) {
      console.error("API Error (Image):", apiError)
      setError("Failed to analyze the image. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageSelect = (file: File) => {
    setImageFile(file)
    setResponse(null)
    setError(null)
  }

  return (
    <div>
      <div className="tabs">
        <button className={mode === 'text' ? 'active' : ''} onClick={() => setMode('text')}>Search by Text</button>
        <button className={mode === 'image' ? 'active' : ''} onClick={() => setMode('image')}>Analyze by Image</button>
      </div>

      {mode === 'text' ? (
        <SearchBox prompt={prompt} setPrompt={setPrompt} onSearch={runTextQuery} isLoading={isLoading} />
      ) : (
        <div>
          <ImageUploader onImageSelect={handleImageSelect} />
          {imageFile && !isLoading && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button onClick={runImageQuery} disabled={isLoading}>
                Analyze Image
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
      
      <NutritionCard data={response} isLoading={isLoading} />
    </div>
  )
}