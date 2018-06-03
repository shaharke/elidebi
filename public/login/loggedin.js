window.onload = function() {
  const hashParams = this.window.location.hash.substr(1).split('&').reduce((acc, param) => {
    const pairs = param.split('=');
    acc[pairs[0]] = pairs[1];
    return acc;
  }, {})
  const token = hashParams.id_token;
  
  axios.post(`https://z5vr51yi5k.execute-api.eu-central-1.amazonaws.com/dev/auth?id_token=${token}`).then((response) => {

    if (response.status == 200) {
      const memberId = response.data.id;
      axios.get(`https://z5vr51yi5k.execute-api.eu-central-1.amazonaws.com/dev/lottery/mine?id_token=${token}&member_id=${memberId}`).then((response) => {
        if (response.status == 200) {
          console.log(response.data);
        } else {
          console.error(response.data);
        }
      });
    } else {
      console.error("Error while authenticating", {code: response.code, error: response.data});
    }
  }); 
  
};
