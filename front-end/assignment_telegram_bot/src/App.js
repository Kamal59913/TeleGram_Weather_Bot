import "./App.css";
import PageContent from "./Components/PageContent";
import SideMenu from "./Components/SideMenu";
function App() {
  return (
    <div className="App">
      <div className="SideMenuAndPageContent">
        <SideMenu></SideMenu>      
        <PageContent></PageContent>
      </div>
    </div>
  );
}
export default App;
