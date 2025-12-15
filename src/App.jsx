import './App.css';
import Navbar from './components/navbar/navbar.jsx';
import AdminGame from './pages/adminGame.jsx';
import AdminLobby from './pages/adminLobby.jsx';
import Lobby from './pages/lobby.jsx';
import SelectedPlayer from './pages/selectedPlayer.jsx';

function App() {

  return (
    <>
    <Navbar/>
    <SelectedPlayer/>
    </>
  )
}

export default App
