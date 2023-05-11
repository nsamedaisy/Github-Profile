const APIURL = 'https://api.github.com/users/'

const form = document.getElementById('form')
const search = document.getElementById('search')
const main = document.getElementById('main')


// we will use axios to handle our request through async/await
// Axios is an open-source, promise-based HTTP client. It uses JS promises to send HTTP requests and manage their responses and it fetches APIs that are not available in the basic Fetch API.

// Axios request with async/await pauses the asynchronous function untill the promise is resolved

// the Try...catch block is use to handle errors in standard API call using axios

async function getUser (username) {
  try {
    const { data } = await axios(APIURL + username)

    createUserCard(data)
    getRepos(username)
  } catch (err) {
    if (err.response.status === 404) {
      createErrorCard('No profile with this user name')
    }
  }
}

async function getRepos (username) {
  try {
    const { data } = await axios(APIURL + username + '/repos?sort=created') // sort=created get the latest repos

    addReposToCard(data)
  } catch (err) {
    createErrorCard('Problem fetching repos')
  }
}

function createUserCard (user) {
  const cardHTML = `
  <div class="card">
  <div>
<a href="http://github.com/users/"><img src="${user.avatar_url}" alt="${user.name}" class="avatar"></a>
  </div>
  <div class="user-info">
    <h2>${user.name}</h2>
    <p>${user.bio}</p>
    <ul>
<a href="http://github.com">
<li>${user.followers} <strong>Followers</strong></li>
</a>
      <li>${user.following} <strong>Following</strong></li>
      <li>${user.public_repos} <strong>Repos</strong></li>
    </ul>
    <div id="repos"></div>
  </div>
</div>
  `

  main.innerHTML = cardHTML
}

function createErrorCard (mgs) {
  const cardHTML = `
  <div class= "card">
    <h1>${mgs}</h1>
  </div>
  `

  main.innerHTML = cardHTML
}

function addReposToCard (repos) {
  const reposEl = document.getElementById('repos')

  repos // looping tru my repo

    .slice(0, 3) // slice the repo array to a desired number

  // for each repos we create our links
    .forEach(repo => {
      const repoEl = document.createElement('a')
      repoEl.classList.add('repo')
      repoEl.href = repo.html_url // points to the actual repository url
      repoEl.target = '_blank' // opens in a new window
      repoEl.innerText = repo.name

      reposEl.appendChild(repoEl)
    })
}

form.addEventListener('submit', (e) => {
  // prevents the auto submission of the form
  e.preventDefault()

  const user = search.value

  if (user) {
    getUser(user)

    search.value = ''
  }
})
