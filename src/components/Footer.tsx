import styles from './Footer.module.css'

export const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <p>
        © {currentYear} Nutri App. Developed by Mateus Cândido.
      </p>
      <p>
        <a href="https://github.com/MateCandido" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </p>
    </footer>
  )
}