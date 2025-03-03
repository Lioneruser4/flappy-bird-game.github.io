document.getElementById('downloadForm').addEventListener('submit', function(event) {
       event.preventDefault();
       const url = document.getElementById('url').value;
       fetch(`/download?url=${encodeURIComponent(url)}`)
           .then(response => response.json())
           .then(data => {
               if (data.success) {
                   window.location.href = data.downloadLink;
               } else {
                   alert('İndirme işlemi başarısız oldu.');
               }
           });
   });
