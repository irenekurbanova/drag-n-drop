<template>
  <router-view />
</template>

<style>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}

body {
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
  font-size: 15px;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.button {
  margin-top: 2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 15px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.button:hover {
  background-color: #45a049;
  color: white;
}
</style>
