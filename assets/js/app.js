let initialData = {}

const setTitle = hash => {
    document.title = hash.toUpperCase()
    document.getElementById('tag-title').innerText = hash.toUpperCase()
}

const goHome = () => {
    alert("카테고리를 찾을 수 없습니다.")
    location.href = '/'
}

const renderTags = (tags) => {
    // console.log('renderTags()')
    return tags.reduce((html, tag) => {
        html += `<a href="/tags/#${tag}" class="tag">#${tag}</a>`
        return html
    }, '<span class="post-date">') + '</span>'
}

const renderPost = (post) => {
    // console.log('renderPost()')
    // console.log(post)
    return `<div class="post">
        <div class="post-thumbnail pull-right" style="background-image: url('${post.image}')"></div>
        <a href="/categories/#${post.category.toLowerCase()}">
            <span class="tag text-muted" style="color: #bbb;">${post.category}</span>
        </a>
        <h2 class="post-title">
            <a href="${post.href}" class="text-default">${post.title}</a>
        </h2>
        <time class="post-date">${post.date_str}</time>
        <br>${renderTags(post.tags)}
    </div>`
}

const renderPosts = (hash) => {
    // console.log('renderPosts()')
    let category = initialData.filter(item => {
        if (item) return item.name === hash
    })
    if (!category[0]) goHome()
    let posts = category[0].posts.filter(n => n)
    let str = ''
    for (post of posts) {
        str += renderPost(post)
    }
    document.getElementById('insert-posts').innerHTML = str
}

if (window.location.hash) {
    const hash = window.location.hash.split('#')[1]
    setTitle(hash)
    fetch("/categories.json", { headers: { "Content-Type": "application/json; charset=utf-8" }})
        .then(res => res.json())
        .then(response => {
            initialData = response.filter(n => n);
            renderPosts(hash, response)
        })
        .catch(err => goHome)
} else goHome()

function HashHandler() {
    renderPosts(window.location.hash.split('#')[1])
}

window.addEventListener("hashchange", HashHandler, false);
