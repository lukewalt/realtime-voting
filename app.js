{

    firebase.initializeApp({
      apiKey: 'AIzaSyB-pb00SC2mOtYzia0c5ujquMuH-lek3Yc',
      authDomain: 'realtime-voting.firebaseapp.com',
      databaseURL: 'https://realtime-voting.firebaseio.com',
      storageBucket: 'realtime-voting.appspot.com',
      messagingSenderId: '485500242156'
    });




    document
        .querySelectorAll('.choice button')
        .forEach(b => b.addEventListener('click', onVote));

    //function for click event
    function onVote(e) {
        //submit vote
        // //what button
        const url = 'https://realtime-voting.firebaseio.com/votes.json'
        const voteFor = e.target.closest('.choice').dataset.value

        //go get the current count
        firebase.database().ref('votes').once('value')
        .then((snap) => snap.val())
        .then(data => {
            //tertiary if else
            const newCount = data && data[voteFor] ? data[voteFor] += 1 : 1

            //patch data //happening over the socet in replacement of patch
            return firebase.database().ref('votes').update({ [voteFor] : newCount })
        })

        //// show current vote total
        .catch(console.error)

        document.querySelectorAll('button').forEach(btn => btn.remove())
        document.querySelectorAll('.hidden').forEach(item => item.classList.remove('hidden'))
    }

    firebase.database().ref('votes').on('value', onUpdate)


    function onUpdate (snap) {
        const data = snap.val()

        document.querySelectorAll('h3').forEach(h =>{
            //calc total
            const total = Object.values(data).reduce((acc, val) => acc + val);
            const current = data[h.closest('.choice').dataset.value];
            //update dom
            h.innerText = Math.round(current/total * 100) + "%"
        })

    }


}




//---NOTES--
// array methods
// forEach returns undefined
// map(a) (return array mangled; ['apple'] => ['APPLE'])
// filter(a) ( returns posibly fewer )
// reduce(prev, curr) ( returns a single value )
