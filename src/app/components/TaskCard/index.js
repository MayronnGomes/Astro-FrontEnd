import React, { useState, useRef, useEffect } from 'react';

const TaskCard = ({ task }) => {
    const [user, setUser] = useState(null);
    const [currentPriority, setCurrentPriority] = useState(task.prioridade);
    const [isPriorityMenuOpen, setIsPriorityMenuOpen] = useState(false);

    const { nome, id } = task;

    const priorityClasses = {
        Baixa: "bg-green-500",
        Média: "bg-yellow-500",
        Alta: "bg-red-500",
    };

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsPriorityMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePriorityChange = async (newPriority) => {
        setCurrentPriority(newPriority);
        setIsPriorityMenuOpen(false);

        const response = await fetch(`http://localhost:8080/api/atividadesStatus/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "prioridade": newPriority }),
        });
    };

    return (
        <div className="bg-gray-700 p-4 rounded-lg shadow-md">
            <img alt={`Placeholder image for ${nome}`} className="w-full h-32 object-cover rounded-md mb-4" height="200" src="https://storage.googleapis.com/a1aa/image/96vI10aIaXa1PlUfeTloOnpf5ZuWII7urnr81s4piFynU4znA.jpg" width="300" />
            <h2 className="text-xl font-bold mb-2 truncate">{nome}</h2>
            <span
                ref={buttonRef}
                onClick={() => user.tipo === 'coordenador' ? setIsPriorityMenuOpen(!isPriorityMenuOpen) : undefined}
                className={`${priorityClasses[currentPriority] || "bg-gray-500"} text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded cursor-pointer`}
            >
                Prioridade {currentPriority}
            </span>

            {isPriorityMenuOpen && (
                <ul ref={menuRef} className="dropdown-menu dropdown-menu-lg-end bg-gray-800 p-2 rounded-lg shadow-lg absolute z-10 w-40 mt-2">
                    <li>
                        <button
                            onClick={() => handlePriorityChange('Baixa')}
                            className="dropdown-item text-white mb-2 w-full px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Prioridade Baixa
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handlePriorityChange('Média')}
                            className="dropdown-item text-white mb-2 w-full px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Prioridade Média
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handlePriorityChange('Alta')}
                            className="dropdown-item text-white mb-2 w-full px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Prioridade Alta
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default TaskCard;