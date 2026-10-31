/**1. what's the Vibe tonight?
 * 2. Show the first 5 options in array of movies that match?
 * 3. User says yes or no to the 5
 * 4. Movies with yes go to a watch list result/array in another page
 * 5. Button for user to go and see
 * 6. New page has table/list of the watchlist moves. maybe use a tag/user for who added it?
 * 7. thumbs up for master list to pick with friends.
 * 
 * Uknowns:
 * -how to add users to a group with kvp in db
 * -how the watchlist movies aggregate (will there be duplicates from users?)
 * -what is my delete? Can the yes/no function be a delete?
 
 */


var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

document.querySelector('#genrePicker').addEventListener('click', genreFinder )
async function genreFinder() {
  const checked = document.querySelectorAll("input[name='genre']:checked");
  const genreString = [...checked].map(genre => genre.value).join(',');
  
  console.log(checked);


  const response = await fetch(`/genresRevealed?genres=${encodeURIComponent(genreString)}`);
  const genresRevealed = await response.json();

  showMovies(genresRevealed.results)
  console.log(genresRevealed.results);


}


function showMovies(movies){

console.log('showMovies called with:', movies)
  const IMG_URL = 'https://image.tmdb.org/t/p/w500'
  const results = document.querySelector('#results');
  



  
  movies.forEach( movie => {

    console.log(movie)
    const card = document.createElement('article');
    card.className = 'movie-card';

    if (movie.poster_path) {

      const img = document.createElement('img');
      img.src = IMG_URL + movie.poster_path;
      img.alt = `picture for ${movie.title}`;
      card.appendChild(img);
    }

    let title = document.createElement('h3')
    title.textContent = movie.title;

    card.appendChild(title);

    results.appendChild(card);

    

  });


}