(function ($, _, localStorage) {
  if (!localStorage.lang) localStorage.lang = 'en'
  if (!localStorage.size) localStorage.size = 25
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
    var currentWords = _.sampleSize(JSON.parse(localStorage.words), localStorage.size)
    localStorage.currentWords = JSON.stringify(currentWords)
    refreshWords()
    resetState()
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
    for (var i = 0; i < localStorage.size; i++) {
      var div = document.createElement('div')
      div.className = 'card card-' + i
      var div2 = document.createElement('div')
      div2.innerHTML = currentWords[i]
      div.appendChild(div2)
      container.appendChild(div)

      div2.onclick = stateToggler(i)
    }

    refreshStates()
  }

  function refreshStates () {
    if (!localStorage.state) return
    var state = JSON.parse(localStorage.state)
    var container = document.getElementById('cardContainer')
    var cards = container.childNodes
    for (var i = 0; i < localStorage.size; i++) {
      cards[i].className = 'card card-' + i + ' state-' + state[i]
    }
  }

  function resetState () {
    var state = _.times(localStorage.size, _.constant(0))
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

  function switchMode (btn) {
    var mode = localStorage.size
    localStorage.size = mode == 25? 20 : 25
    refreshModeButton()

    generateWords()
  }

  function refreshModeButton() {
    var mode = localStorage.size
    document.getElementById('modeButton').innerHTML = mode == 25? "5x4" : "5x5"
  }

  window.loadWords = loadWords
  window.generateWords = generateWords
  window.resetState = resetState
  window.switchMode = switchMode

  refreshModeButton()
})(window.$, window._, window.localStorage)
