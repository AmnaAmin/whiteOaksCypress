module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --max-warnings=0',
    'tsc-files --noEmit',
    'react-scripts test --bail --watchAll=false --findRelatedTests --passWithNoTests',
  ],
  '*.{js,jsx,ts,tsx,json,css,js}': ['prettier --write'],
}
