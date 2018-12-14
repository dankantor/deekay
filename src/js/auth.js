class Auth {
  
  async check() {
    if (this.authorization) {
      const response = await fetch('https://api.fig.fm/me', {
        'headers': {
          'Authorization': this.authorization
        }
      });
      if (response.error) {
        this.authorization = null;
      } else {
        const data = await response.json();
        console.log(data);
        this.authorization = data.jwt;
        const now = new Date().getTime();
        setTimeout(this.check, data.token.expiresAt - now);
      }
    }
  }
  
  get authorization() {
    const authorization = localStorage.getItem('authorization');
    if (authorization) {
      return authorization;
    } else {
      return null;
    }
  }
  
  set authorization(value) {
    if (value === null) {
      localStorage.removeItem('authorization');
    } else {
      localStorage.setItem('authorization', value);
    }
  }
  
}

module.exports = Auth;