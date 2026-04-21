import api from "./axios";


 //Fetch paginated + filtered issues
 //param {{ page?: number, limit?: number, status?: string, priority?: string, severity?: string, search?: string, sortBy?: string, sortOrder?: string }} params
 
export const fetchIssuesApi = (params = {}) =>
  api.get("/issues", { params });


 //Fetch a single issue by ID
 //param {string} id

export const fetchIssueApi = (id) => api.get(`/issues/${id}`);


 //Create a new issue
 //param {{ title: string, description?: string, priority?: string, severity?: string, assignee?: string, tags?: string[] }} data
 
export const createIssueApi = (data) => api.post("/issues", data);


 //Update an existing issue
 //param {string} id
 //param {Partial<Issue>} data
 
export const updateIssueApi = (id, data) => api.put(`/issues/${id}`, data);


 //Delete an issue
 //param {string} id
 
export const deleteIssueApi = (id) => api.delete(`/issues/${id}`);