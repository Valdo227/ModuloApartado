function info(){
      fetch('/clicked', {method: 'POST'})
        .then(function(response) {
          if(response.ok) {
            console.log('click was recorded');
            return;
          }
          throw new Error('Request failed.');
        })
        .catch(function(error) {
          console.log(error);
        });
    });
}
