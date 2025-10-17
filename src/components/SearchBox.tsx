import styles from './SearchBox.module.css'

interface SearchBoxProps {
  prompt: string
  setPrompt: (value: string) => void
  onSearch: () => void
  isLoading: boolean
  placeholder?: string 
}

export const SearchBox = ({
  prompt,
  setPrompt,
  onSearch,
  isLoading,
  placeholder = "Enter food name (e.g., Apple)" 
}: SearchBoxProps) => {

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !isLoading) {
      onSearch()
    }
  }

  return (
    <div className={styles.searchBox}>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown} 
        placeholder={placeholder}
        disabled={isLoading} 
        className={styles.input}
      />
      <button
        onClick={onSearch}
        disabled={isLoading || !prompt} 
        className={styles.button}
      >
        {isLoading ? 'Thinking...' : 'Get Nutrition'}
      </button>
    </div>
  )
}