"use client";

import Image from "next/image";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/Login');
  }

  return (
    <div>
      <div className="min-h-screen min-w-full bg-gray-800 text-gray-200">
        <header className="bg-gray-900 text-white py-4">
          <div className="w-full flex justify-between items-center px-4">
            <Image
              src="/images/logo_astro_branca.png"
              alt="ASTRO"
              width={200}
              height={150}
              className="rounded"
            />
            <nav>
              <ul className="flex space-x-4 text-xl">
                <li>
                  <a href="#Funcionalidade" className="hover:underline hover:text-gray-400">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="/projetos" className="hover:underline hover:text-gray-400">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#contato" className="hover:underline hover:text-gray-400">
                    Contato
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Bem-vindo ao ASTRO</h2>
          <p className="text-lg text-gray-400 mb-8">
            Uma plataforma para gerenciamento de atividades em ações de extensão
          </p>
          <button
            className="bg-blue-800 text-white py-2 px-6 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
            onClick={goToLogin}
          >
            Comece já
          </button>
        </main>

        <section className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-8 text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">Principais Funcionalidades</h2>

          <div className="bg-gray-700 p-6 rounded-lg shadow flex flex-col justify-center items-center">
            <h3 className="text-xl font-semibold my-4 text-white">Gerenciamento de Atividades</h3>
            <p className="text-gray-300">Acompanhe o progresso das atividades, comente sobre o que foi feito e troque feedback com sua equipe ou coordenadores para garantir que tudo está sendo realizado conforme o planejado.</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow flex flex-col justify-center items-center">
            <h3 className="text-xl font-semibold my-4 text-white">Relatórios de Atividades</h3>
            <p className="text-gray-300">Acesse gráficos detalhados das atividades realizadas durante o mês. Utilize os filtros por mês e ano para obter uma visão clara do desempenho e progresso das suas tarefas.</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow flex flex-col justify-center items-center">
            <h3 className="text-xl font-semibold my-4 text-white">Notificações e Acompanhamento</h3>
            <p className="text-gray-300">Receba notificações em tempo real sobre novas atividades, alterações nas tarefas e outros eventos importantes para garantir que você esteja sempre atualizado.</p>
          </div>
        </section>


        <footer className="bg-gray-900 text-white text-center py-4 mt-12" id="contato">
          <div className="flex items-center justify-center p-5 mb-3">
            <a
              href='https://wa.me/5585982181553'
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-800 text-4xl w-16 h-16 rounded-full flex justify-center items-center mr-5">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
            <a
              href='https://t.me/dev_mayronn'
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-800 text-4xl w-16 h-16 rounded-full flex justify-center items-center mr-5">
              <i className="fa-brands fa-telegram"></i>
            </a>
            <a
              href='https://www.linkedin.com/in/mayronn-gomes-viana-039293302'
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-800 text-4xl w-16 h-16 rounded-full flex justify-center items-center mr-5">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a
              href='mailto:cttmayronn@gmail.com'
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-800 text-4xl w-16 h-16 rounded-full flex justify-center items-center">
              <i className="fa-solid fa-envelope"></i>
            </a>
          </div>
          <p>&copy; 2025 ASTRO - Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

