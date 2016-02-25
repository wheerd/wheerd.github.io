(function ($, _, localStorage) {
  if (!localStorage.lang) localStorage.lang = 'en'
  refreshLanguageStates()

  function refreshLanguageStates () {
    var langs = document.getElementsByClassName('lang')
    for (var i = 0; i < langs.length; i++) {
      var lang = langs.item(i)

      lang.disabled = lang.classList.contains(localStorage.lang)
    }
  }

  if (localStorage && !localStorage.words) {
    loadWords('en')
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

  function loadWords (lang) {
    localStorage.lang = lang
    refreshLanguageStates()
    $.getJSON('data/' + lang + '.json', function (words) {
      localStorage.words = JSON.stringify(words)
      generateWords()
    })
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

      div2.onclick = stateToggler(i)
    }

    resetState()
  }

  function refreshStates () {
    var state = JSON.parse(localStorage.state)
    var container = document.getElementById('cardContainer')
    var cards = container.childNodes
    for (var i = 0; i < 25; i++) {
      cards[i].className = 'card card-' + i + ' state-' + state[i]
    }
  }

  function resetState () {
    var state = _.times(25, _.constant(0))
    localStorage.state = JSON.stringify(state)

    refreshStates()
  }

  function stateToggler (i) {
    return function () {
      toggleState(i)
    }
  }

  function toggleState (i) {
    var state = JSON.parse(localStorage.state)
    state[i] = (state[i] + 1) % 5
    localStorage.state = JSON.stringify(state)

    refreshStates()
  }

  window.loadWords = loadWords
  window.generateWords = generateWords
  window.resetState = resetState
})(window.$, window._, window.localStorage)
