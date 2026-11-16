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


// var thumbUp = document.getElementsByClassName("fa-thumbs-up");
console.log('main.js v2 loaded');
const PAGE_SIZE = 5;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
let allMovies = [];
let shown = 0;

const resultsList = document.querySelector('#results');
const moreShown = document.querySelector('#moreMovies');
const watchlistResult = document.querySelector('#watchList')



var trash = document.getElementsByClassName("fa-trash");

Array.from(document.querySelectorAll('.remove')).forEach(function(button) {
      button.addEventListener('click', function(){
        const id = this.closest('li').dataset.id;
       
        fetch(`/watchlist/${id}`, {
          method: 'DELETE'})
        .then(response => {
          if (response.ok) window.location.reload();
        });
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

moreShown.addEventListener('click', showNextFive);
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

// console.log('showMovies called with:', movies)
//   const IMG_URL = 'https://image.tmdb.org/t/p/w500'
//   const results = document.querySelector('#results');

allMovies = movies || [];
shown = 0;
resultsList.innerHTML = '';

if (allMovies.length === 0){
  resultsList.textContent = 'No movies found'
  moreShown.hidden = true;

  return;
  }
  showNextFive();

}
  


function showNextFive(){

  const batch = allMovies.slice(shown, shown + PAGE_SIZE);
  
  batch.forEach( movie => {

    console.log(movie)
    const card = document.createElement('article');
    card.className = 'movie-card';

    if (movie.poster_path) {

      const img = document.createElement('img');
      console.log(JSON.stringify(IMG_URL + movie.poster_path))
      img.src = IMG_URL + movie.poster_path;
      img.alt = `picture for ${movie.title}`;
      card.appendChild(img);
    }

    let title = document.createElement('h3')
    title.textContent = movie.title;

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.textContent = 'Add to Watchlist';
    addButton.addEventListener('click', () => addToWatchlist (movie));

    card.append(title, addButton);

    resultsList.appendChild(card);

  });

  shown += batch.length;
  moreShown.hidden = shown >= allMovies.length;


}

async function addToWatchlist(movie){

  const res = await fetch('/watchlist', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        tmdbId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
    })
  });

  if (res.status === 409) return alert('Already on your watchlist');
  if (res.ok) appendWatchItem(movie.id, movie.title);


}

function appendWatchItem(id, title){
  const li = document.createElement('li');

  li.dataset.id = id;
  li.append(title + ' ');

  const trashcan = document.createElement('button');

  trashcan.type = 'button';
  trashcan.className = 'remove';
  trashcan.setAttribute ('aria-label', `Remove ${title} from watchlist`);

  const icon = document.createElement('i');
  icon.className = 'fa fa-trash-o';
  icon.setAttribute('aria-hidden', 'true')

  trashcan.appendChild(icon);
  li.appendChild(trashcan);
  watchlistResult.appendChild(li);
}

watchlistResult.addEventListener('click', async (e) => {
  const btn = e.target.closest('.remove');
  if (!btn) return;

  const li = btn.closest('li');
  const res = await fetch(`/watchlist/${li.dataset.id}` , {
    method: 'DELETE'});
    if (res.ok) li.remove();
});