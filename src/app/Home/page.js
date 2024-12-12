"use client";

import React from 'react';
import SideBar from '../components/SideBar';

const Home = () => {
  return (
    <div className="flex">
        <SideBar />
        <div className="flex-1">
            <nav className="bg-gray-800 p-4 flex justify-between items-center">
                <button className="md:hidden text-white" id="menu-button">
                    <i className="fas fa-bars"></i>
                </button>
                <div className="text-xl font-bold">Dashboard</div>
                <div className="space-x-4 hidden md:block">
                    <a className="hover:text-gray-400" href="#">Home</a>
                    <a className="hover:text-gray-400" href="#">Tasks</a>
                    <a className="hover:text-gray-400" href="#">Profile</a>
                </div>
            </nav>
            <nav className="bg-gray-700 p-4 flex justify-between items-center">
                <div className="space-x-4">
                    <a className="hover:text-gray-400" href="#">Overview</a>
                    <a className="hover:text-gray-400" href="#">Projects</a>
                    <a className="hover:text-gray-400" href="#">Calendar</a>
                    <a className="hover:text-gray-400" href="#">Reports</a>
                </div>
            </nav>
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <img alt="Placeholder image for Task 1" className="w-full h-32 object-cover rounded-md mb-4" height="200" src="https://storage.googleapis.com/a1aa/image/Xve2bQ4z1YVQSauTiybnPwUkwGRj8sflOjt0gkWz4hhNK85TA.jpg" width="300"/>
                    <h2 className="text-xl font-bold mb-2">Task 1</h2>
                    <span className="bg-red-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">High Priority</span>
                    <p>Description for task 1</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <img alt="Placeholder image for Task 2" className="w-full h-32 object-cover rounded-md mb-4" height="200" src="https://storage.googleapis.com/a1aa/image/E2imKBXnkv7iKpnF9GsYdw4xVPeJJJuGbAfzcQUYPIiOK85TA.jpg" width="300"/>
                    <h2 className="text-xl font-bold mb-2">Task 2</h2>
                    <span className="bg-yellow-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Medium Priority</span>
                    <p>Description for task 2</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <img alt="Placeholder image for Task 3" className="w-full h-32 object-cover rounded-md mb-4" height="200" src="https://storage.googleapis.com/a1aa/image/ri8SXD1c3sovIBqTGfprvp4GCfupi8clH51GkVyPjeukU4znA.jpg" width="300"/>
                    <h2 className="text-xl font-bold mb-2">Task 3</h2>
                    <span className="bg-green-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Low Priority</span>
                    <p>Description for task 3</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <img alt="Placeholder image for Task 4" className="w-full h-32 object-cover rounded-md mb-4" height="200" src="https://storage.googleapis.com/a1aa/image/Puwee4YeJPOveTi6L3eG5IUarVjF3AMQDgm5pFI4F4WEShPfE.jpg" width="300"/>
                    <h2 className="text-xl font-bold mb-2">Task 4</h2>
                    <span className="bg-red-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">High Priority</span>
                    <p>Description for task 4</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <img alt="Placeholder image for Task 5" className="w-full h-32 object-cover rounded-md mb-4" height="200" src="https://storage.googleapis.com/a1aa/image/96vI10aIaXa1PlUfeTloOnpf5ZuWII7urnr81s4piFynU4znA.jpg" width="300"/>
                    <h2 className="text-xl font-bold mb-2">Task 5</h2>
                    <span className="bg-yellow-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Medium Priority</span>
                    <p>Description for task 5</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <img alt="Placeholder image for Task 6" className="w-full h-32 object-cover rounded-md mb-4" height="200" src="https://storage.googleapis.com/a1aa/image/K1gdZAmry45HERJezWdysYe8r3sjTYbTFnJHAoGEsDNLK85TA.jpg" width="300"/>
                    <h2 className="text-xl font-bold mb-2">Task 6</h2>
                    <span className="bg-green-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Low Priority</span>
                    <p>Description for task 6</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <img alt="Placeholder image for Task 7" className="w-full h-32 object-cover rounded-md mb-4" height="200" src="https://storage.googleapis.com/a1aa/image/MlOIjtomJ1JSNFWlPHPgAc76jf1MyfFKzB3B11JORfsfownPB.jpg" width="300"/>
                    <h2 className="text-xl font-bold mb-2">Task 7</h2>
                    <span className="bg-red-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">High Priority</span>
                    <p>Description for task 7</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <img alt="Placeholder image for Task 8" className="w-full h-32 object-cover rounded-md mb-4" height="200" src="https://storage.googleapis.com/a1aa/image/rjOf3v3ef3c1iINxxgHcdz4eI9xl8CYegfGdLO9yWMCOjCf8JA.jpg" width="300"/>
                    <h2 className="text-xl font-bold mb-2">Task 8</h2>
                    <span className="bg-yellow-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Medium Priority</span>
                    <p>Description for task 8</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Home;