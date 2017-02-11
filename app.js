{// wraps the code to prevent the creation of global variables... by creating a "block"

firebase.initializeApp({
  apiKey: 'AIzaSyB-pb00SC2mOtYzia0c5ujquMuH-lek3Yc',
  authDomain: 'realtime-voting.firebaseapp.com',
  databaseURL: 'https://realtime-voting.firebaseio.com',
  storageBucket: 'realtime-voting.appspot.com',
  messagingSenderId: '485500242156'
});

  const MAX_MESSAGES_DISPLAYED = 10

  const messagesRef = firebase.database().ref('messages')
  const messagesDiv = document.querySelector('.messages')
  const form = document.querySelector('form')

  const votesRef = firebase.database().ref('votes')
  const voteButtons = document.querySelectorAll('.choice button')
  const voteTotals = document.querySelectorAll('.vote_totals')

  const sendVote = (evt) => {
    // what button i clicked on
    const voteFor = evt.target.closest('.choice').dataset.value

    // go get the current counts
    votesRef.once('value')
      .then(snap => snap.val())
      .then(data => {
        // update the new count
        const newCount = data && data[voteFor] ? data[voteFor] += 1 : 1
        votesRef.update({ [voteFor]: newCount })
      })
      .catch(console.error)

    voteButtons.forEach(btn => btn.remove())
    voteTotals.forEach(item => item.classList.remove('hidden'))
  }

  const sendMessage = (evt) => {
    evt.preventDefault()

    const nameInput = evt.target.elements.name // evt.target.querySelctor('[name="name"]')
    const contentInput = evt.target.elements.content // evt.target.querySelctor('[name="content"]')

    const name = nameInput.value.trim()
    const content = contentInput.value.trim()

    if (name && content) {
      messagesRef.push({ name, content })
        .then(() => contentInput.value = '')
    }
  }

  const onNewVote = (snap) => {
    const votes = snap.val()

    document.querySelectorAll('h3').forEach(voteTotal => {
      const choice = voteTotal.closest('.choice').dataset.value
      const total = Object.values(votes).reduce((acc, val) => acc + val) // SUM
      const current = votes[choice]

      voteTotal.innerText = Math.round(current / total * 100) + '%'
    })
  }

  const renderMessage = (msg) => {
    const docFragment = document.createDocumentFragment()

    const div = document.createElement('DIV')
    docFragment.appendChild(div)

    const strong = document.createElement('STRONG')
    div.appendChild(strong)

    const name = document.createTextNode(msg.name)
    strong.appendChild(name)

    const seperator = document.createTextNode(': ')
    div.appendChild(seperator)

    const span = document.createElement('SPAN')
    div.appendChild(span)

    const content = document.createTextNode(msg.content)
    span.appendChild(content)

    return docFragment
  }

  const onNewMessage = (snap) => {
    const msg = snap.val() // { name: 'Scott', content: 'Hey' }

    messagesDiv.appendChild(renderMessage(msg))

    // messagesDiv.innerHTML += `
    //   <div>
    //     <strong>${msg.name}</strong>: <span>${msg.content}</span>
    //   </div>
    // `

    if (messagesDiv.childElementCount > MAX_MESSAGES_DISPLAYED) {
      messagesDiv.firstChild.remove()
    }
  }

  form.addEventListener('submit', sendMessage)
  messagesRef.limitToLast(MAX_MESSAGES_DISPLAYED).on('child_added', onNewMessage)

  voteButtons.forEach(btn => btn.addEventListener('click', sendVote))
  votesRef.on('value', onNewVote)

}



//---NOTES--
// array methods
// forEach returns undefined
// map(a) (return array mangled; ['apple'] => ['APPLE'])
// filter(a) ( returns posibly fewer )
// reduce(prev, curr) ( returns a single value )
