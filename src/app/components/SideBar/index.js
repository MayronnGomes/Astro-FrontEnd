import React, { useState } from 'react';

const SideBar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClick = (item) => {
        setActiveItem(item);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <button
                className="md:hidden p-4 text-white"
                onClick={toggleSidebar}
            >
                <i className="fas fa-bars"></i>
            </button>

            <div
                className={`w-full md:w-64 bg-gray-900 text-white h-full p-4 transition-transform ${isSidebarOpen ? 'transform-none' : '-translate-x-full'} md:translate-x-0 shadow-[8px_0_10px_rgba(0,0,0,0.8)]`}
            >
                <div className="flex items-center mb-8 border-b border-gray-700 pb-4">
                    <img alt="Logo" className="w-8 h-8 mr-2" height="32" src="https://storage.googleapis.com/a1aa/image/5vuz4T3qMe3aNCifaPGbBvuEkGlYZvMO7rI9flq6TBo4k4znA.jpg" width="32" />
                    <span className="text-xl font-semibold">Logoipsum</span>
                </div>
                <div className="flex items-center mb-6 border-b border-gray-700 pb-4">
                    <img alt="User Avatar" className="w-10 h-10 rounded-full mr-3" height="40" src="https://storage.googleapis.com/a1aa/image/VkfyeN7xGTieHoe7l2wY3S7Vme4SEJ8ofByveRyBHqKqOJe5TA.jpg" width="40" />
                    <div className="overflow-hidden">
                        <div className="font-semibold">Ruben Septimus</div>
                        <div className="text-sm text-gray-400 truncate">ruben.septimus@leaseerracr.com</div>
                    </div>
                </div>

                {/* Menu */}
                <div className="mb-6 border-b border-gray-700 pb-4">
                    <div className="mb-2 text-gray-400">Menu</div>
                    <ul>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 ${activeItem === 'Home' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => handleClick('Home')}>
                                <i className="fas fa-home mr-3"></i> Home
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 ${activeItem === 'Task' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => handleClick('Task')}>
                                <i className="fas fa-tasks mr-3"></i> Task
                                <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-1">12</span>
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 ${activeItem === 'Activity' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => handleClick('Activity')}>
                                <i className="fas fa-chart-line mr-3"></i> Activity
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 ${activeItem === 'Users' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => handleClick('Users')}>
                                <i className="fas fa-users mr-3"></i> Users
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 ${activeItem === 'Notifications' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => handleClick('Notifications')}>
                                <i className="fas fa-bell mr-3"></i> Notifications
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="mb-6 border-b border-gray-700 pb-4">
                    <div className="mb-2 text-gray-400">Projetos</div>
                    <ul>
                        <li className="mb-2">
                            <a className="flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700" href="#">
                                <i className="fas fa-project-diagram mr-3"></i> Meninas Digitais
                                <i className="fas fa-arrow-right ml-auto"></i>
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className="flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700" href="#">
                                <i className="fas fa-project-diagram mr-3"></i> Meninas Digitais
                                <i className="fas fa-arrow-right ml-auto"></i>
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className="flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700" href="#">
                                <i className="fas fa-project-diagram mr-3"></i> Meninas Digitais
                                <i className="fas fa-arrow-right ml-auto"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="mb-6 border-b border-gray-700 pb-4">
                    <div className="mb-2 text-gray-400">Suporte</div>
                    <ul>
                        <li className="mb-2">
                            <a className="flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700" href="#">
                                <i className="fas fa-cog mr-3"></i> Setting
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className="flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700" href="#">
                                <i className="fas fa-life-ring mr-3"></i> Support
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <a className="flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700" href="#">
                        <i className="fas fa-project-diagram mr-3"></i> Meninas Digitais
                        <i className="fas fa-arrow-right ml-auto"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
