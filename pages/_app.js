import { ThemeProvider } from "../components/DarkMode/themeContext";
import StylesBase from "../components/DarkMode/stylesBase";
import GlobalStyles from './../styles/GlobalStyles';
import { League_Spartan } from '@next/font/google';
import '../components/calendar.css';


const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  variable: '--font-leagueSpartan',
});

const App = ({ Component, pageProps }) => (
  <ThemeProvider>
    <main className={`${leagueSpartan.variable} font-sans`}>
      <GlobalStyles />
      <StylesBase />
      <Component {...pageProps} />
    </main>
  </ThemeProvider>
);

export default App;
