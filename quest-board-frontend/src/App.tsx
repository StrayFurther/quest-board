import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {QuestBoardPage} from "./pages/QuestBoard/QuestBoardPage.tsx";
import {QuestDetailPage} from "./pages/QuestDetail/QuestDetailPage.tsx";
import {RegisterPage} from "./pages/Register/RegisterPage.tsx";
import {LoginPage} from "./pages/Login/LoginPage.tsx";
import {AdventurerDetailPage} from "./pages/Adventurer/AdventurerDetailPage.tsx";
import {NavigationBar} from "./components/NavigationBar/NavigationBar.tsx";
import {QuestServiceProvider} from "./providers/QuestServiceProvider.tsx";
import {PopUpProvider} from "./providers/PopUpProvider.tsx";
import {AuthProvider} from "./providers/AuthProvider.tsx";
import {AdventurerServiceProvider} from "./providers/AdventuerServiceProvider.tsx";

function App() {

  return (
    <>
      <AuthProvider>
        <AdventurerServiceProvider>
          <QuestServiceProvider>
            <PopUpProvider>
              <BrowserRouter>
                <NavigationBar />
                <div className="app__container">
                  <Routes>
                    <Route path="/" element={<QuestBoardPage />} />
                    <Route path="register" element={<RegisterPage/>}/>
                    <Route path="login" element={<LoginPage/>}/>
                    <Route path="me" element={<AdventurerDetailPage/>}/>
                    <Route path="/quest/:id" element={<QuestDetailPage />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </PopUpProvider>
          </QuestServiceProvider>
        </AdventurerServiceProvider>
      </AuthProvider>
    </>
  )
}

export default App
