import { LoadingSpinner } from './LoadingSpinner'
import type { IApiResponse } from '../interfaces/NutritionData'
import styles from './NutritionCard.module.css'

interface NutritionCardProps {
  data: IApiResponse | null
  isLoading: boolean
}

const formatLabel = (key: string) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

export const NutritionCard = ({ data, isLoading }: NutritionCardProps) => {
  return (
    <div className={styles.card}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        data && data.nutrition ? (
          <div className={styles.content}>
            <div className={styles.header}>
              <h4>{data.food_name}</h4>
              {data.serving_size && <p>{data.serving_size}</p>}
            </div>
            <ul className={styles.nutritionList}>
              {Object.entries(data.nutrition).map(([key, value]) => (
                <li key={key} className={styles.nutritionItem}>
                  <span className={styles.label}>{formatLabel(key)}</span>
                  <span className={styles.value}>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className={styles.placeholder}>Enter a food name or upload an image to see its nutritional information.</p>
        )
      )}
    </div>
  )
}