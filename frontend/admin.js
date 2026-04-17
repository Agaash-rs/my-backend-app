const tableBody = document.querySelector('#leadsTable tbody');
const filterPlatform = document.getElementById('filterPlatform');
const adminMsg = document.getElementById('adminMsg');

async function loadLeads() {
  const platform = filterPlatform.value;
  const query = platform ? `?platform=${encodeURIComponent(platform)}` : '';
  try {
    const res = await fetch(`http://localhost:5000/api/leads${query}`);
    if (!res.ok) {
      throw new Error('Unable to fetch leads');
    }
    const leads = await res.json();
    tableBody.innerHTML = '';

    if (!leads.length) {
      tableBody.innerHTML = '<tr><td colspan="8">No leads found.</td></tr>';
      adminMsg.innerText = platform
        ? `No leads found for ${platform}.`
        : 'No leads found.';
      adminMsg.style.color = '#333';
      return;
    }

    adminMsg.innerText = platform
      ? `Showing ${leads.length} lead(s) for ${platform}.`
      : `Showing ${leads.length} lead(s).`;
    adminMsg.style.color = '#333';

    leads.forEach((lead) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${lead.name || ''}</td>
        <td>${lead.email || ''}</td>
        <td>${lead.phone || ''}</td>
        <td>${lead.platform || ''}</td>
        <td>${lead.message || ''}</td>
        <td>
          <select class="status-select" data-id="${lead._id}">
            <option ${lead.status === 'New' ? 'selected' : ''}>New</option>
            <option ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option ${lead.status === 'Converted' ? 'selected' : ''}>Converted</option>
            <option ${lead.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </td>
        <td>${new Date(lead.created_at).toLocaleString()}</td>
        <td>
          <button class="small-btn update-btn" data-id="${lead._id}">Save</button>
          <button class="small-btn delete-btn" data-id="${lead._id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const id = e.target.dataset.id;
        await updateLeadStatus(id, e.target.value);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (confirm('Delete this lead?')) {
          await deleteLead(id);
        }
      });
    });

    document.querySelectorAll('.update-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const select = e.target.closest('tr').querySelector('.status-select');
        if (select) {
          await updateLeadStatus(id, select.value);
        }
      });
    });
  } catch (error) {
    console.error(error);
    adminMsg.innerText = 'Unable to load leads. Please make sure the backend is running.';
    adminMsg.style.color = 'red';
  }
}

async function updateLeadStatus(id, status) {
  try {
    const res = await fetch(`http://localhost:5000/api/leads/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      throw new Error('Unable to update status');
    }
    adminMsg.innerText = `Status updated to ${status}.`;
    adminMsg.style.color = 'green';
    await loadLeads();
  } catch (error) {
    console.error(error);
    adminMsg.innerText = 'Unable to update status.';
    adminMsg.style.color = 'red';
  }
}

async function deleteLead(id) {
  try {
    const res = await fetch(`http://localhost:5000/api/leads/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      throw new Error('Unable to delete lead');
    }
    adminMsg.innerText = 'Lead deleted successfully.';
    adminMsg.style.color = 'green';
    await loadLeads();
  } catch (error) {
    console.error(error);
    adminMsg.innerText = 'Unable to delete lead.';
    adminMsg.style.color = 'red';
  }
}

filterPlatform.addEventListener('change', loadLeads);
loadLeads();
