import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

// Registrando os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TarefasPorStatusAgrupado = ({ atividades, selectedMonth, selectedYear }) => {
  const monthNames = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const monthIndex = monthNames.indexOf(selectedMonth.toLowerCase());

  const getLastDayOfMonth = (year, month) => {
    return new Date(year, month, 0).getDate(); // Último dia do mês
  };

  const atividadesDoMes = atividades.filter((atividade) => {
    const dataInicio = new Date(atividade.dataInicio);
    const atividadeMonth = dataInicio.getMonth();
    const atividadeYear = dataInicio.getFullYear();
    return atividadeMonth === monthIndex && atividadeYear === parseInt(selectedYear);
  });

  // Verificando se não há atividades para o mês
  if (atividadesDoMes.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h4 className="text-lg font-bold mb-2">Não há tarefas para {selectedMonth} {selectedYear}</h4>
        <p className="text-gray-500">Nenhuma atividade foi registrada para este mês.</p>
      </div>
    );
  }

  const atividadesAgrupadas = {
    pendente: {},
    concluida: {},
    canceladaPendencia: {}
  };

  const getSemanaDoAno = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + 1) / 7);
  };

  atividadesDoMes.forEach((atividade) => {
    const dataInicio = new Date(atividade.dataInicio);
    const semana = getSemanaDoAno(dataInicio);
    let statusAgrupado = '';

    if (atividade.status === 'aberta' || atividade.status === 'em andamento') {
      statusAgrupado = 'pendente';
    } else if (atividade.status === 'concluída' || atividade.status === 'encerrada com antecipação') {
      statusAgrupado = 'concluida';
    } else if (atividade.status === 'cancelada' || atividade.status === 'encerrada com pendência') {
      statusAgrupado = 'canceladaPendencia';
    }

    if (statusAgrupado) {
      if (!atividadesAgrupadas[statusAgrupado][semana]) {
        atividadesAgrupadas[statusAgrupado][semana] = [];
      }
      atividadesAgrupadas[statusAgrupado][semana].push(atividade);
    }
  });

  const ultimoDia = getLastDayOfMonth(selectedYear, monthIndex + 1);
  const semanas = Array.from({ length: Math.ceil(ultimoDia / 7) }, (_, i) => i + 1);

  const atividadesPorGrupo = Object.keys(atividadesAgrupadas).reduce((acc, grupo) => {
    acc[grupo] = semanas.map((semana) => atividadesAgrupadas[grupo][semana] || []);
    return acc;
  }, {});

  const data = {
    labels: semanas.map((semana) => `Semana ${semana}`), // Rótulos representando as semanas
    datasets: [
      {
        label: 'Pendente',
        data: atividadesPorGrupo.pendente.map((semana) => semana.length),
        backgroundColor: '#FF5733', // Cor de fundo para tarefas pendentes
        atividades: atividadesPorGrupo.pendente,
      },
      {
        label: 'Concluída',
        data: atividadesPorGrupo.concluida.map((semana) => semana.length),
        backgroundColor: '#33FF57', // Cor de fundo para tarefas concluídas
        atividades: atividadesPorGrupo.concluida,
      },
      {
        label: 'Cancelada/Pendente',
        data: atividadesPorGrupo.canceladaPendencia.map((semana) => semana.length),
        backgroundColor: '#FF33A1', // Cor de fundo para tarefas canceladas/pendentes
        atividades: atividadesPorGrupo.canceladaPendencia,
      },
    ],
  };

  // Opções do gráfico
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const datasetIndex = context.datasetIndex;
            const dataIndex = context.dataIndex;
            const atividades = context.dataset.atividades[dataIndex];

            // Listando as atividades com quebra de linha
            const atividadesNomes = atividades.map((atividade) => atividade.nome).join('\n');
            return `${context.raw} Atividades:\n${atividadesNomes}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false, // Barras não empilhadas
      },
      y: {
        stacked: false, // Barras não empilhadas
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h4 className="text-lg font-bold mb-2">Atividades por Status - {selectedMonth} {selectedYear}</h4>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TarefasPorStatusAgrupado;
