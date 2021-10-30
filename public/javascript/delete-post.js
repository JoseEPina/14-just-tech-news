async function deleteFormHandler(event) {
   event.preventDefault();

   const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();

   const id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];

   if (comment_text) {
      const deleteComments = await fetch(`/api/comments/`, {
         method: 'DELETE',
         body: JSON.stringify({
            id,
            comment_text,
         }),
         headers: {
            'Content-Type': 'application/json',
         },
      });

      if (deleteComments.ok) {
         const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });

         if (response.ok) {
            document.location.replace('/dashboard/');
         } else {
            alert(response.statusText);
         }
      } else {
         alert(response.statusText);
      }
   }
}

document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);
