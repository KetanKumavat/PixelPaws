import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import { logo } from "./assets";
import { Home, CreatePost } from "./page";

const App = () => (
  <BrowserRouter>
    <header className="w-full flex justify-between items-center bg-pink-700 sm:px-8 px-4 py-2 shadow-xl shadow-black/25 sticky top-0 z-10">
      <Link
        to="/"
        className="flex items-center space-x-2 text-white font-bold text-xl">
        <img src={logo} alt="logo" className="w-20 h-20 object-cover" />
        <span className="text-3xl">PixelPaws</span>
      </Link>

      <Link
        to="/create-post"
        className="font-medium bg-white hover:bg-gray-200 text-pink-600 px-4 py-2 rounded-md transition-colors duration-300">
        Create
      </Link>
    </header>
    <main className="sm:p-8 px-4 py-8 w-full bg-stone-50 min-h-[calc(100vh-73px)]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </main>
  </BrowserRouter>
);

export default App;
