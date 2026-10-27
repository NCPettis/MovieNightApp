/**1. what's the Vibe tonight?
 * 2. Show the first 5 options in array of movies that match?
 * 3. User says yes or no to the 5
 * 4. Movies with yes go to a watch list result/array in another page
 * 5. Button for user to go and see
 * 6. New page has table/list of the watchlist moves. maybe use a tag/user for who added it?
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
  console.log(genresRevealed);


}