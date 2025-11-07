export const API_BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
    crimes: `${API_BASE_URL}/crimes`,
    officers: `${API_BASE_URL}/officers`,
    suspects: `${API_BASE_URL}/suspects`,
    cases: `${API_BASE_URL}/cases`,
    firs: `${API_BASE_URL}/firs`,
};

export const ROLE_LABELS = {
    admin: "Administrator",
    officer: "Police Officer",
};
