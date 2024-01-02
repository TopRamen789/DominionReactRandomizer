import CardSet from './card-set';
import styles from './App.module.css';
import RandomizerTools from './randomizer-tools';
import { Route, Routes } from 'react-router-dom';
import DominionApp from './dominion-app';

function App() {
  return (
    <DominionApp>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <RandomizerTools />
        </div>
        <div className={styles.kingdom}>
          <Routes>
            <Route path="/">
              <Route index element={<CardSet />} />
              <Route path="/kotw" element={<CardSet />} />
            </Route>
          </Routes>
        </div>
      </div>
    </DominionApp>
  );
}

export default App;