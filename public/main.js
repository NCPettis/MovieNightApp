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
  
  console.log(checked);

  const res = await fetch('/genres');
  const data = await res.json();
  console.log(data.genres);

  //If checked box input == data.genres.name then give me the id number
 const genreIds = [];

 for( let i = 0; i < checked.length; i++){

  const box = checked[i]
  const match = data.genres.find(
    genre => genre.name.toLowerCase() === box.id.toLowerCase()
  );

  if(match){
    genreIds.push(match.id);
  }else{
    console.log(`No genre found for ${box.id}`);
  }

  const genreString = genreIds.join(',');
  console.log(genreString);

 }

  //^^^^^^Search the above Array obj by name to get the genre's id - 


  //vvvvvvInput the ID's into this fetch Req Below

  const response = await fetch('/genresRevealed');
  const genresRevealed = await response.json();
  console.log(genresRevealed);

//   const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2Y1NTM3YjMwNmZiMjEyNWRmMThkYmJiNTczMDk3YiIsIm5iZiI6MTc5Mjg5NjE0My40MDMsInN1YiI6IjZhZGQ2YzhmN2EwY2YwNzUyNTU3Njg3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.40e4or-xZTJUP-DJE11Gxco4bowKDfpyqnBh2PYrZpg'
//   }
// };

// fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=27%2C35', options)
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.error(err));

}