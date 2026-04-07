// XSS vulnerability
// user-controlled input injected directly into innerHTML

const renderComment = (comment) => {
  const div = document.getElementById('comments')
  div.innerHTML += `<p>${comment.text}</p>`
}

// attacker can pass: <script>document.cookie</script>