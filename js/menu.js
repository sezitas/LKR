const { remote } = require('electron')
const { Menu, MenuItem } = remote

// Build our new menu
var menu = new Menu()
menu.append(new MenuItem({
  label: 'Delete',
  click: function () {
    // Trigger an alert when menu item is clicked
    console.alert('Deleted')
  }
}))
menu.append(new MenuItem({
  label: 'More Info...',
  click: function () {
    // Trigger an alert when menu item is clicked
    console.alert('Here is more information')
  }
}))

// Add the listener
document.addEventListener('DOMContentLoaded', function () {
  var nodeList = document.querySelectorAll('.js-context-menu')

  Array.prototype.forEach.call(nodeList, function (item) {
    item.addEventListener('contextmenu', function (event) {
      menu.popup(remote.getCurrentWindow())
    })
  })
})
