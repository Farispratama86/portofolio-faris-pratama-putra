const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function getApiBaseUrl() {
  return API_BASE || window.location.origin;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request gagal (${res.status})`);
  }
  return data;
}

export async function fetchProjects() {
  const json = await request('/api/projects');
  return Array.isArray(json.data) ? json.data : [];
}

export async function fetchExperiences() {
  const json = await request('/api/experiences');
  return Array.isArray(json.data) ? json.data : [];
}

export async function loginAdmin(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function uploadCroppedImage(blob, token, type = 'project') {
  const fd = new FormData();
  fd.append('image', blob, `${type}-crop.webp`);
  return request(`/api/upload?type=${encodeURIComponent(type)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
}

export async function createProject(payload, token) {
  const json = await request('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return json.data;
}

export async function updateProject(id, payload, token) {
  const json = await request(`/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return json.data;
}

export async function deleteProject(id, token) {
  return request(`/api/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createExperience(payload, token) {
  const json = await request('/api/experiences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return json.data;
}

export async function updateExperience(id, payload, token) {
  const json = await request(`/api/experiences/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return json.data;
}

export async function deleteExperience(id, token) {
  return request(`/api/experiences/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchProfile() {
  const json = await request('/api/profile');
  return json.data || {};
}

export async function updateProfile(payload, token) {
  const json = await request('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return json.data;
}

export async function fetchCertificates() {
  const json = await request('/api/certificates');
  return Array.isArray(json.data) ? json.data : [];
}

export async function createCertificate(payload, token) {
  const json = await request('/api/certificates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return json.data;
}

export async function updateCertificate(id, payload, token) {
  const json = await request(`/api/certificates/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return json.data;
}

export async function deleteCertificate(id, token) {
  return request(`/api/certificates/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchSkills() {
  const json = await request('/api/skills');
  return Array.isArray(json.data) ? json.data : [];
}

export async function createSkill(payload, token) {
  const json = await request('/api/skills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return json.data;
}

export async function updateSkill(id, payload, token) {
  const json = await request(`/api/skills/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return json.data;
}

export async function deleteSkill(id, token) {
  return request(`/api/skills/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

