
$(document).ready(function(){
  $('#title').autocomplete({
    source: async function(req,res){
      let localhost = `http://localhost:8000/search?query=${req.term}`
      let data = await fetch(localhost)
        .then(data => data.json())
        .then(data => data.slice(0,20))
        .then(data => data.map(result => {
          return {
            label: result.title,
            value: result.title,
            id: result._id
          }
        }))
        res(data)
    },
    minLength: 2,
    select: function(event, ui){
      let localhost = `http://localhost:8000/get/${ui.item.id}`
      fetch(localhost)
        .then(result => result.json())
        .then(result => {
          $('#cast').empty()
          $('#plot').empty()
          $('#runtime').empty()
          $('#rating').empty()
          document.querySelector('#poster').src = null
          result.cast.forEach(cast => {
            $('#cast').append(`<li>${cast}</li>`)
          })
          $('#poster').attr('src', result.poster)
          document.querySelector('#castName').innerText = 'Cast'
          document.querySelector('#runtime').innerText = `Runtime: ${result.runtime}`
          document.querySelector('#plot').innerText = `Plot: ${result.plot}`
          document.querySelector('#year').innerText = `year: ${result.year}`
          
        })
    }
  })
})

