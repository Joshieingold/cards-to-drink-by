import './App.css';
import Navbar from './components/navbar/navbar.jsx';
import SelectedPlayer from "./pages/selectedPlayer.jsx";
import AdminGame from "./pages/adminGame.jsx";
import AdminLobby from "./pages/adminLobby.jsx";
import GeneralPlayer from './pages/generalPlayer.jsx';
import Lobby from "./pages/lobby.jsx";

function App() {

  return (
    <>
    <Navbar/>
    <AdminGame/>
    <AdminLobby/>
    <GeneralPlayer/>
    <Lobby/>
    <SelectedPlayer/>
    </>
  )
}

export default App

// Admin Game Looks Good
// Admin Lobby Looks Good
// General Player cant look bad
// Lobby Looks good
// Now the selected player looks good
