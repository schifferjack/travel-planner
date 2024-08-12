import { Routes, Route, Link } from "react-router-dom";
import ItineraryPlanner from "./pages/ItineraryPlanner";
import About from "./pages/About";
import BudgetPlanner from "./pages/Budget";
import Home from "./pages/Home";

function App() {
  return (
    <div
      className="w-full 
      text-white bg-[url('src/assets/pexels-recalmedia-60217.jpg')] bg-cover relative before:content-['']
            z-10
            before:absolute
            before:inset-0
            before:block
            before:bg-slate-800
            before:opacity-75
            before:z-[-5]
            min-h-svh
            "
    >
      <nav className="">
        <li className="flex list-none h-24 items-center font-bold">
          <ul className="px-8">
            <b className="text-2xl cursor-pointer">
              <Link to="/">Travel Planner</Link>
            </b>
          </ul>
          <div className="flex flex-1 justify-evenly h-full">
            <ul className="hover:text-orange-400 cursor-pointer h-full flex items-center">
              <Link to="/itinerary-planner">Itinerary Planner</Link>
            </ul>
            <ul className="hover:text-orange-400 cursor-pointer h-full flex items-center">
              <Link to="/budget-planner">Budget Planner</Link>
            </ul>
            <ul className="hover:text-orange-400 cursor-pointer h-full flex items-center">
              <Link to="/about">About</Link>
            </ul>
          </div>
        </li>
      </nav>
      <div className={`px-8 pb-8 w-full`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/itinerary-planner" element={<ItineraryPlanner />} />
          <Route path="/budget-planner" element={<BudgetPlanner />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
