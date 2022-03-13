module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --max-warnings=0',
    'tsc-files tsconfig.json --noEmit',
    'react-scripts test --bail --watchAll=false --findRelatedTests --passWithNoTests',
    () => 'tsc-files --noEmit',
  ],
  '*.{js,jsx,ts,tsx,json,css,js}': ['prettier --write'],
}
