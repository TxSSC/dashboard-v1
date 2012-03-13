# Builds a directory of folders with the specified format
- [module]/module.js or modules/module.coffee
- [module]/style.css
- [module]/templates/*.html

### CSS is minified using clean-css
### Templates are pre-compiled using hogan
### Javascript is compiled using coffee-script is module.coffee is present


## Known bugs:
- Functions must be correctly wrapped if a return value is wanted on window.modules.[folder_name]