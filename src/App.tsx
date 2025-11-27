import { Presentation } from './components/Presentation';
// import { portfolioData } from './data/portfolio-data-engineer';
import { portfolioData } from './data/new-presentation';

function App() {
  return (
    <Presentation data={portfolioData} />
  );
}

export default App;
