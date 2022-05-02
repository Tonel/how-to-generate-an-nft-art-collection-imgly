import NFTArtCollectionGenerator from './components/NFTArtCollectionGenerator/NFTArtCollectionGenerator';
import React from 'react';
import './App.css';
// CodeSandbox does not parse @imports properly,
// so the styles are imported here
import './styles/fonts.css';
import './styles/typography.css';
import './styles/css-reset.css';
import './styles/variables.css';
import './styles/ci-v11-variables.css';
import './styles/util.css';
import './styles/forms.css';
import './styles/button.css';

function App() {
  return (
    <div className="App">
      <NFTArtCollectionGenerator />
    </div>
  );
}

export default App;
