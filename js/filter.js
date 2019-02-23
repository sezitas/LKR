$(document).ready(function () {
  $('#license-search').on('keyup', function () {
    var value = $(this).val().toLowerCase()
    $('#license-tbody tr').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    })
  })
})
