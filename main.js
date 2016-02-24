(function ($, _, localStorage) {
  if (localStorage && !localStorage.words) {
    $.getJSON('en.json', function (words) {
      localStorage.words = JSON.stringify(words)
      generateWords()
    })
  } else if (localStorage && !localStorage.currentWords) {
    generateWords()
  } else if (localStorage && localStorage.currentWords) {
    refreshWords()
  }

  function generateWords () {
    var currentWords = _.sampleSize(JSON.parse(localStorage.words), 25)
    localStorage.currentWords = JSON.stringify(currentWords)

    refreshWords()
  }

  function refreshWords () {
    var currentWords = JSON.parse(localStorage.currentWords)
    var container = document.getElementById('cardContainer')
    container.innerHTML = ''
    for (var i = 0; i < 25; i++) {
      var div = document.createElement('div')
      div.className = 'card card-' + i
      var div2 = document.createElement('div')
      div2.innerHTML = currentWords[i]
      div.appendChild(div2)
      container.appendChild(div)
    }
  }

  window.generateWords = generateWords
})(window.$, window._, window.localStorage)
