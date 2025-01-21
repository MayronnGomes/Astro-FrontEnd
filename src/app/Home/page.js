"use client";

import React, { useEffect } from 'react';
import SideBar from '../components/SideBar';
import { SidebarProvider } from '../contexts/SideBarContext';
import { useRouter } from 'next/navigation';

const Home = () => {
    const router = useRouter();

    useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.replace('/Login');
            }
        }, [router]);

    return (
        <SidebarProvider>
            <div className='flex h-screen'>

            <SideBar />
            <div className="col-span-full flex justify-center items-center h-full w-full">
                <span className="text-3xl text-white bg-gray-700 p-6 rounded-md font-semibold">
                    Em manutençao ...
                </span>
            </div>
            </div>
        </SidebarProvider>

    );

};

export default Home;