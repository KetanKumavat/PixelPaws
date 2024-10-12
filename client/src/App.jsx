import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { logo } from "./assets";
import { Home, CreatePost } from "./page";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ element }) => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    toast.error("Please sign in to access this page.");
    return <Navigate to="/" />;
  }

  return element;
};

const App = () => {
  const { user } = useUser();
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.firstName);
    }
  }, [user]);

  return (
    <BrowserRouter>
      <header className="w-full flex flex-wrap justify-between items-center bg-pink-700 sm:px-8 px-4 py-2 shadow-xl shadow-black/25 sticky top-0 z-10">
        <Link
          to="/"
          className="flex items-center space-x-2 text-white font-bold text-xl">
          <img src={logo} alt="logo" className="w-16 h-16 object-cover" />
          <span className="text-2xl sm:text-3xl">PixelPaws</span>
        </Link>
        <div className="flex items-center gap-2">
          <SignedIn>
            <Link
              to="/create-post"
              className="font-medium bg-white hover:bg-gray-200 text-pink-600 px-3 py-1 sm:px-4 sm:py-2 rounded-md transition-colors duration-300">
              Create
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton className="font-medium bg-white hover:bg-gray-200 text-pink-600 px-3 py-1 sm:px-4 sm:py-2 rounded-md transition-colors duration-300" />
          </SignedOut>
        </div>
      </header>
      <main className="sm:p-8 px-4 py-8 w-full bg-stone-50 min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/create-post"
            element={<ProtectedRoute element={<CreatePost name={name} />} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
