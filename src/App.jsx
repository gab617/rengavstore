import { Routes, Route } from "react-router-dom";
import SlugPicker from "./components/SlugPicker";
import Storefront from "./components/Storefront";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SlugPicker />} />
      <Route path="/:slug" element={<Storefront />} />
    </Routes>
  );
}