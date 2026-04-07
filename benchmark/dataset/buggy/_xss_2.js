
const renderComment = (comment) => {
  const div = document.getElementById('comments')
  div.innerHTML += `<p>${comment.text}</p>`
}