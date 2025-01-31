import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TarefasPorStatusPizza = ({ atividades, selectedMonth, selectedYear }) => {

  const monthNames = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const monthIndex = monthNames.indexOf(selectedMonth.toLowerCase());

  const atividadesDoMes = atividades.filter((atividade) => {
    const dataInicio = new Date(atividade.dataInicio);
    const atividadeMonth = dataInicio.getMonth();
    const atividadeYear = dataInicio.getFullYear();
    return atividadeMonth === monthIndex && atividadeYear === parseInt(selectedYear);
  });

  if (atividadesDoMes.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h4 className="text-lg font-bold mb-2">Não há tarefas para {selectedMonth} {selectedYear}</h4>
        <p className="text-gray-500">Nenhuma atividade foi registrada para este mês.</p>
      </div>
    );
  }

  // Agrupando as atividades por status
  const statusActivities = atividadesDoMes.reduce((acc, atividade) => {
    const { status, nome } = atividade;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(nome); // Adicionando nome da atividade no status correspondente
    return acc;
  }, {});

  // Preparando os dados para o gráfico de pizza
  const labels = Object.keys(statusActivities); // Status das atividades
  const dataValues = Object.values(statusActivities).map((atividades) => atividades.length); // Quantidade de tarefas por status
  const backgroundColor = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#C3E6CB']; // Cores para as fatias
  const hoverBackgroundColor = ['#FF4567', '#37A6DB', '#FFCE76', '#4BC0C1', '#FFB174', '#9FDEB4']; // Cores ao passar o mouse

  // Função para exibir os nomes das atividades no tooltip
  const tooltipCallbacks = {
    label: function (context) {
      const status = context.label;
      const atividadesNomes = statusActivities[status].join(', '); // Juntando os nomes das atividades com o mesmo status
      return `${context.raw} Tarefas - Atividades: ${atividadesNomes}`;
    },
  };

  const data = {
    labels, // Status das atividades
    datasets: [
      {
        data: dataValues, // Quantidade de tarefas por status
        backgroundColor, // Cores para as fatias
        hoverBackgroundColor, // Cores ao passar o mouse
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: tooltipCallbacks, // Customizando o tooltip
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h4 className="text-lg font-bold mb-2">Distribuição de Tarefas por Status - {selectedMonth} {selectedYear}</h4>
      <Pie data={data} options={options} />
    </div>
  );
};

export default TarefasPorStatusPizza;
