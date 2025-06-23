import React, { useEffect } from 'react'
import Navbar from './components/Navbar.jsx';
import { Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import SignUpPage from './Pages/SignUpPage.jsx';
import Settings from './Pages/Settings.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
// import { axiosInstance  } from './lib/axios.js';
import { authStore } from './store/authStore.js';
import {Loader} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import {useThemeStore} from '../src/store/useThemeStore.js';

const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = authStore();
  const {themeSelected} = useThemeStore();
  // console.log('themeSelected at app.jsx: ', themeSelected);
  // console.log('online users: ', onlineUsers);

  useEffect(() => {
    checkAuth();
  }, [checkAuth])
  if(isCheckingAuth && !authUser) 
    return(
    <div data-theme = {themeSelected} className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin' />
    </div>
    );


  return (
    <div data-theme={themeSelected}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage/>: <LoginPage/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/> : <HomePage />}/>
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <HomePage />}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <LoginPage />}/>
        <Route path='/settings' element={<Settings/>}/>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App