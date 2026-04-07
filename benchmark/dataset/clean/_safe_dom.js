// clean/06 — textContent prevents XSS
const renderComment = (comment) => {
  const div = document.getElementById('comments')
  const p = document.createElement('p')
  p.textContent = comment.text
  div.appendChild(p)
}