const etapas = [
  {
    id: 1,
    titulo: "Organização e Coleta de Informações",
    data: "14/05/2025 a 16/05/2025"
  },
  {
    id: 2,
    titulo: "Configuração básica da loja",
    data: "17/05/2025 a 21/05/2025"
  },
  {
    id: 3,
    titulo: "Design e personalização",
    data: "22/05/2025 a 30/05/2025"
  },
  {
    id: 4,
    titulo: "Cadastro e migração de produtos",
    data: "31/05/2025 a 08/06/2025"
  },
  {
    id: 5,
    titulo: "Configuração de funcionalidades",
    data: "09/06/2025 a 17/06/2025"
  },
  {
    id: 6,
    titulo: "Testes gerais e ajustes",
    data: "18/06/2025 a 21/06/2025"
  },
  {
    id: 7,
    titulo: "Apresentação de prévias para aprovação",
    data: "22/06/2025 a 24/06/2025"
  },
  {
    id: 8,
    titulo: "Ajustes finais e correções",
    data: "25/06/2025 a 26/06/2025"
  },
  {
    id: 9,
    titulo: "Entrega final e publicação da loja",
    data: "27/06/2025"
  }
];
const statusList = [
  { value: "pendente", label: "Pendente", icon: "⚪" },
  { value: "andamento", label: "Em andamento", icon: "🟡" },
  { value: "concluido", label: "Concluído", icon: "🟢" }
];

let statusObj = {};

async function fetchStatus() {
  const res = await fetch('/api/etapas');
  const data = await res.json();
  statusObj = {};
  data.forEach(etapa => statusObj[etapa.id] = etapa.status);
}

async function updateStatus(id, status) {
  await fetch(`/api/etapas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  statusObj[id] = status;
  renderTimeline();
}

function isAdmin() {
  return new URLSearchParams(window.location.search).get('admin') === '1';
}

async function renderTimeline() {
  await fetchStatus();
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = '';
  etapas.forEach(etapa => {
    const status = statusList.find(s => s.value === statusObj[etapa.id]) || statusList[0];
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.innerHTML = `
      <div class="status" title="${status.label}">${status.icon}</div>
      <div class="info">
        <div class="title">${etapa.titulo}</div>
        <div class="date">${etapa.data}</div>
      </div>
    `;
    if (isAdmin()) {
      const select = document.createElement('select');
      select.className = 'admin-select';
      statusList.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.value;
        opt.textContent = s.label;
        if (s.value === status.value) opt.selected = true;
        select.appendChild(opt);
      });
      select.onchange = () => updateStatus(etapa.id, select.value);
      tile.querySelector('.info').appendChild(select);
    }
    timeline.appendChild(tile);
  });
}

renderTimeline();