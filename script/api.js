// API
const apiKey = '806d9b72-8fc9-432c-a274-d54bdecb9d1a';
const apiURL = 'https://v2.api.noroff.dev/gamehub';
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVmljQiIsImVtYWlsIjoidmljYnJvMDI0NThAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MzgwMTEwNzV9.Ke81gamCJK8NSBi-dNBiMOQSPUvGjdt_Sis7_vD2TZg';

const options = {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Noroff-API-Key': apiKey
  }
};