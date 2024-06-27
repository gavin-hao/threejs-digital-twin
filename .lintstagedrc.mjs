export default {
  'src/**/*': ['prettier --write --ignore-unknown'],
  'src/**/*.{vue,scss,css}': 'stylelint --fix',
  'src/**/*.{(j|t)s?(x),vue}': 'eslint --cache --fix --max-warnings 0',
};
